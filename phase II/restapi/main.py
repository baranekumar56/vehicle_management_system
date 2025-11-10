
from fastapi import FastAPI, Depends
from fastapi.security import HTTPBearer
from sqlalchemy import select, update, delete, insert
from app.schema.service import Service, ServiceCreate
from app.schema.mech_note import MechNote, MechNoteCreate
from app.database.database import get_db, init_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import Session
from app.database.database import mech_notes
from app.middlewares.AuthorizationMiddleware import AuthorizationMiddleware
from app.auth.jwt_bearer import JWTBearer

from app.routes import *

# app = FastAPI(dependencies=[Depends(JWTBearer())])
app = FastAPI()

# bearer_scheme = HTTPBearer()

# @app.get("/secure-data", dependencies=[Depends(bearer_scheme)])
# async def get_secure_data():
#     return {"secure": True}


#middle ware initializations
# app.add_middleware(AuthorizationMiddleware)


# init db
@app.on_event('startup')
async def load_tables():
    await init_db()

# initializing the routes

app.include_router(router=user_router, prefix='/users', tags=['users'])
app.include_router(router=service_router, prefix='/service', tags=['services'])
app.include_router(router=vehicle_router, prefix='/vehicle', tags=['vehicles'])
app.include_router(router=vehicle_service_router, prefix='/vehicle_service', tags=['vehicle services'])
app.include_router(router=booking_router, prefix='/booking', tags=['booking'])
app.include_router(router=package_router, prefix='/package', tags=['package'])

@app.get('/')
def root():
    return {"msg": "Working fine"}