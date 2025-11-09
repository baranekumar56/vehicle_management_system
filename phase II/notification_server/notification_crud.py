
# from sqlalchemy.ext.asyncio import AsyncSession
# from sqlalchemy import select, insert, text
# from Notification import Notification
# from notification_schema import Notification as ModelNotification, SystemNotificationCreate, SendOption

# import asyncio
# from websocket import connection_manager

# async def insert_notifications(notification: SystemNotificationCreate, db:AsyncSession ):
#     customer_role = 3
#     mechanic_role = 2
#     admin_role = 1

#     if notification.send_option == SendOption.allcustomers:
#         # insert into all customers 
#         await db.execute(text("""INSERT INTO notification(to_user_id, content, created_at) 
#         SELECT user_id, :content, :created_at FROM users u where u.role_id = :role_id;"""), {"role_id": customer_role, "content":notification.content, "created_at": notification.created_at  })


#     elif notification.send_option == SendOption.allmechanics:

#         await db.execute(text("""INSERT INTO notification(to_user_id, content, created_at) 
#         SELECT user_id, :content, :created_at FROM users u where u.role_id = :role_id;"""), {"role_id": mechanic_role, "content":notification.content, "created_at": notification.created_at  })

#     # now on to all users

#     elif notification.send_option == SendOption.allusers:

#         await db.execute(text("""INSERT INTO notification(to_user_id, content, created_at) 
#         SELECT user_id, :content, :created_at FROM users u where u.role_id <> :role_id;"""), {"role_id": admin_role, "content":notification.content, "created_at": notification.created_at  })

#     else :

#         # this section is for specified users
#         user_ids = notification.specified_users
#         await db.execute(text("""INSERT INTO notification(to_user_id, content, created_at) 
#         SELECT user_id, :content, :created_at FROM users u where u.user_id in (:ids)"""), {"ids": user_ids, "content":notification.content, "created_at": notification.created_at  })

#         asyncio.create_task(connection_manager.send_notification(user_ids=user_ids, content=notification.content))



from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from notification_schema import SystemNotificationCreate, SendOption
import asyncio
from websocket import connection_manager

async def insert_notifications(notification: SystemNotificationCreate, db: AsyncSession):
    customer_role = 3
    mechanic_role = 2
    admin_role = 1


    if notification.send_option == SendOption.allcustomers:
        await db.execute(
            text("""INSERT INTO notification(to_user_id, content, created_at) 
                    SELECT user_id, :content, :created_at FROM users WHERE role_id = :role_id;"""),
            {"role_id": customer_role, "content": notification.content, "created_at": notification.created_at}
        )
    elif notification.send_option == SendOption.allmechanics:
        await db.execute(
            text("""INSERT INTO notification(to_user_id, content, created_at) 
                    SELECT user_id, :content, :created_at FROM users WHERE role_id = :role_id;"""),
            {"role_id": mechanic_role, "content": notification.content, "created_at": notification.created_at}
        )
    elif notification.send_option == SendOption.allusers:
        await db.execute(
            text("""INSERT INTO notification(to_user_id, content, created_at) 
                    SELECT user_id, :content, :created_at FROM users WHERE role_id != :role_id;"""),
            {"role_id": admin_role, "content": notification.content, "created_at": notification.created_at}
        )
    else:
        user_ids = notification.specified_users or []

        await db.execute(
            text("""INSERT INTO notification(to_user_id, content, created_at) 
                    SELECT user_id, :content, :created_at FROM users WHERE user_id = ANY(:ids);"""),
            {"ids": user_ids, "content": notification.content, "created_at": notification.created_at}
        )
        asyncio.create_task(connection_manager.send_notification(user_ids=user_ids, content=notification.content))
