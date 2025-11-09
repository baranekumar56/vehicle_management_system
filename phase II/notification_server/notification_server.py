
# from fastapi import FastAPI, Depends, HTTPException
# from notification_schema import LiveNotification, NotificationCreate, SendOption
# from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
# from notification_schema import Notification as ModelNotification, SystemNotificationCreate
# from Notification import Notification
# from sqlalchemy import insert, select

# from notification_crud import insert_notifications
# from websocket import ConnectionManager, connection_manager
# from asyncio import create_task
# import asyncio

# import uvicorn

# db_url = "postgresql+psycopg://postgres:postgres@localhost:5432/vsms"

# engine = create_async_engine(db_url, echo=True)
# SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

# async def get_db():
#     async with SessionLocal() as session:
#         yield session


# app = FastAPI()

# @app.on_event('startup')
# async def send_ping_to_all_clients():
#     async def ping_loop():
#         while True:
#             await connection_manager.send_grouped_notification(3, content="ping", heartbeat=True)
#             await asyncio.sleep(25)

#     asyncio.create_task(ping_loop())


# @app.post('notifications/create_notification')
# async def create_new_notification(notification: SystemNotificationCreate, db:AsyncSession = Depends(get_db)):
    

#     try:

#         if notification.required:
#             await insert_notifications(notification=notification, db=db)

#             await db.commit()
#         else :
#             # we forward the notification to web socket
#             asyncio.create_task(connection_manager.send_notification(notification.specified_users))

#         return {"msg": "notification creation successfull"}
#     except Exception as e:
#         print(str(e))
    
# @app.get('notifications/get_notifications')
# async def get_all_notifications(user_id : int,limit: int = 100, offset: int = 0, db: AsyncSession = Depends(get_db)):

#     try :

#         query = select(Notification).where(to_user_id = user_id).order_by(Notification.created_at).limit(limit=limit).offset(offset=offset)

#         notifications = await db.execute(query)
#         notifications = notifications.all()

#         res = []
#         for notification in notifications:
#             res.append(ModelNotification.model_validate(notification))
        
#         return res
#     except Exception as e:
#         print(str(e))

# @app.patch('notifications/update_notification_status')
# async def update_notification_status(notification__id: int,  db: AsyncSession = Depends(get_db) ):

#     try :

#         query = select(Notification).where(notification_id = notification__id)
#         notification = await db.execute(query)
#         notification = notification.first()

#         notification.read = True

#         await db.add(notification)
#         await db.commit()

#         return {"msg": "notification updated successfully"}

#     except Exception as e:
#         print(str(e))


# if __name__ == '__main__':

#     uvicorn.run(
#         app=app,
#         host="0.0.0.0",
#         port=9696,
#         reload=True
#     )

import os
from fastapi import FastAPI, Depends, HTTPException, WebSocketDisconnect, status, BackgroundTasks, WebSocket
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from notification_schema import LiveNotification, SendOption, SystemNotificationCreate
from Notification import Notification as DBNotification
from notification_crud import insert_notifications
from websocket import connection_manager
from sqlalchemy import select
import uvicorn

db_url = os.environ.get("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost:5432/vsms")

engine = create_async_engine(db_url, echo=True)
SessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)

async def get_db():
    async with SessionLocal() as session:
        yield session

app = FastAPI()

@app.on_event("startup")
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(DBNotification.metadata.create_all)

@app.post("/notifications/create_notification", status_code=status.HTTP_201_CREATED)
async def create_new_notification(notification: SystemNotificationCreate, background_tasks: BackgroundTasks, db: AsyncSession = Depends(get_db)):
    try:
        if notification.required:
            await insert_notifications(notification=notification, db=db)
            await db.commit()
        else:
            background_tasks.add_task(connection_manager.send_notification, user_ids=notification.specified_users, content=notification.content)
        return {"msg": "notification creation successful"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.get("/notifications/get_notifications")
async def get_all_notifications(user_id: int, limit: int = 100, offset: int = 0, db: AsyncSession = Depends(get_db)):
    try:
        query = select(DBNotification).where(DBNotification.to_user_id == user_id).order_by(DBNotification.created_at).limit(limit).offset(offset)
        notifications = await db.execute(query)
        notifications = notifications.scalars().all()
        return [LiveNotification.model_validate(n) for n in notifications]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    


@app.patch("/notifications/update_notification_status")
async def update_notification_status(notification_id: int, db: AsyncSession = Depends(get_db)):
    try:
        result = await db.execute(select(DBNotification).where(DBNotification.notification_id == notification_id))
        notification = result.scalars().first()
        if not notification:
            raise HTTPException(status_code=404, detail="Notification not found")
        notification.read = True
        await db.commit()
        await db.refresh(notification)
        return {"msg": "notification updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

import logging

logger = logging.getLogger("uvicorn.error")

@app.websocket("/ws/{user_id}/{role_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int, role_id: int):
    await connection_manager.connect(user_id,2, websocket)
    logger.info(f"User connected.. Id: {user_id}")
    try:
        while True:
            try:
                data = await websocket.receive_text()
            except WebSocketDisconnect:
                break
    finally:
        connection_manager.disconnect(user_id)
        logger.info(f"User disconnected.. Id: {user_id}")

if __name__ == "__main__":
    uvicorn.run(app=app, host="127.0.0.1", port=9696)
