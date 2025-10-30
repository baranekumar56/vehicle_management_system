
from app.models.services_vehicles.Vehicle import Vehicle, VehicleService
from app.schema.vehicle import VehicleCreate, Vehicle as ModelVehicle
from app.schema.vehicle_service import VehicleService as ModelVehicleService
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from fastapi import HTTPException
from datetime import datetime

from app.schema.vehicle_service import  VehicleServiceCreate, VehicleService as ModelVehicleService

async def check_if_vehicle_exists(vehicle: VehicleCreate , db:AsyncSession):

    result = await db.execute(select(Vehicle).where(Vehicle.brand == vehicle.brand ,Vehicle.model == vehicle.model , Vehicle.fuel == vehicle.fuel, Vehicle.vehicle_type == vehicle.vehicle_type))

    vehicle = result.scalar_one_or_none()

    if vehicle is None :
        return False
    else :
        return True
    
async def check_if_vehicle_exists_by_id(vehicle_id: int , db:AsyncSession):

    result = await db.execute(select(Vehicle).where(Vehicle.vehicle_id == vehicle_id))

    vehicle = result.scalar_one_or_none()

    if vehicle is None :
        return False
    else :
        return True


async def add_vehicle_to_db(vehicle: VehicleCreate, db:AsyncSession) :

    # first we need to check whether the vehicle already exists
    
    vehicle:Vehicle = Vehicle(**vehicle.model_dump())
    # print(vehicle)
    db.add(vehicle)
    await db.commit()
    await db.refresh(vehicle)

    return ModelVehicle.model_validate(vehicle)


async def activate_deactivate_vehicle(vehicle_id: int,db: AsyncSession, activate: bool = True):

    # if activate is true set the service to true else dont
    try:
        if activate:
            await db.execute(update(Vehicle).where(vehicle_id == vehicle_id).values(active=True))
        else :
            await db.execute(update(Vehicle).where(vehicle_id == vehicle_id).values(active = False, last_deactivated = datetime.now()))

        await db.commit()
        return True
    
    except Exception as e:
        return False
    
async def check_if_vehicle_service_exists(vehicle_service:VehicleServiceCreate, db:AsyncSession ):

    # get the both attributes , then find if there exists any duplicate entries

    res = await db.execute(select(VehicleService).where(VehicleService.service_id == vehicle_service.service_id , VehicleService.vehicle_id == vehicle_service.vehicle_id))

    found = res.scalar_one_or_none()

    if found is None :
        return False
    return True

async def add_vehicle_service_to_db(vehicle_service: VehicleService, db:AsyncSession) :

    # first we need to check whether the vehicle already exists
    
    vehicle_service:Vehicle = VehicleService(**vehicle_service.model_dump())
    print(vehicle_service.__dict__)
    db.add(vehicle_service)
    await db.commit()
    await db.refresh(vehicle_service)

    return ModelVehicleService.model_validate(vehicle_service)

async def check_if_vehicle_service_exists_by_id(vehicle_service_id:int, db:AsyncSession ):

    # get the both attributes , then find if there exists any duplicate entries

    res = await db.execute(select(VehicleService).where(VehicleService.vehicle_service_id == vehicle_service_id))

    found = res.scalar_one_or_none()

    if found is None :
        return False
    return True

async def activate_deactivate_vehicle_service(vehicle_service_id: int, db: AsyncSession, activate: bool = True):

    # if activate is true set the service to true else dont
    try:
        if activate:
            await db.execute(update(VehicleService).where(VehicleService.vehicle_service_id == vehicle_service_id).values(active=True))
        else:
            await db.execute(update(VehicleService).where(VehicleService.vehicle_service_id == vehicle_service_id).values(active=False, last_deactivated=datetime.now()))


        await db.commit()
        return True
    
    except Exception as e:
        return False