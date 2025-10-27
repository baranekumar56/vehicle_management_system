from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user.User import Users
from sqlalchemy.sql import select, update, insert
from app.auth.jwt_handler import create_access_token, create_refresh_token, verify_password, hash_password
from app.schema.vehicle import Vehicle, VehicleCreate, BaseVehicle
from sqlalchemy.exc import IntegrityError

from app.crud.user import *

router = APIRouter(tags=['vehicle'])

@router.post('/add_vehicle')
async def add_a_vehicle(vehicle: VehicleCreate, db:AsyncSession = Depends(get_db) ):
    
    pass