
from fastapi import Response, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.user import User, UserCreate
from sqlalchemy import select, update, insert
from app.models.services_vehicles import Service
from app.custom_db_types.custom_db_classes import Address
from app.database.database import get_db
from datetime import datetime
from app.models.services_vehicles.Service import Service


async def check_service_exists(service_id: int, db:AsyncSession):

    # check whether the service id is in the table

    result = await db.execute(select(Service).where(Service.service_id == service_id))
    service = result.scalar_one_or_none()

    if service is None:
        return None
    
    return service

async def activate_deactivate_service(service_id: int, db:AsyncSession,  activate: bool = True,):

    # if activate is true set the service to true else dont
    try:
        if activate:
            await db.execute(update(Service).where(Service.service_id == service_id).values(active=True))
        else :
            await db.execute(update(Service).where(Service.service_id == service_id).values(active = False, last_deactivated = datetime.now()))

        await db.commit()

        return True
    
    except Exception as e:
        return False