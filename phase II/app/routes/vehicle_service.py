from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response,status
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.vehicle_service import VehicleService, VehicleServiceCreate
from sqlalchemy.exc import IntegrityError
from app.crud.vehicle import *


router = APIRouter()

@router.post('/add_vehicle_service', status_code=status.HTTP_200_OK)
async def add_a_vehicle(vehicle_service: VehicleServiceCreate , db:AsyncSession = Depends(get_db) ):


        # add the duplicate login here dont do in add vehicle to db
        
        vehicle_service_exists = await check_if_vehicle_service_exists(vehicle_service, db)
        if  vehicle_service_exists:
            raise HTTPException(status_code=409, detail="vehicle service already exists")
        
        try :
              vehicle_service:VehicleService = await add_vehicle_service_to_db(vehicle_service, db)

              return {"msg":"vehicle service added successfully", "data": vehicle_service}
        except Exception as e:

            e = str(e)
            raise HTTPException(status_code=500, detail="Some thing bad happened, {e}")
        
@router.patch('/deactivate_vehicle_service/{vehicle_service_id}')
async def deactivate_a_vehicle(response:Response, vehicle_service_id: int, db:AsyncSession = Depends(get_db) ):
      
    # check whether the vehicle exists

    vehicle_service_exists = await check_if_vehicle_service_exists_by_id(vehicle_service_id=vehicle_service_id, db=db)

    if not vehicle_service_exists:
         raise HTTPException(status_code=404, detail="Vehicle service not found")
    
    res = await activate_deactivate_vehicle_service(vehicle_service_id=vehicle_service_id, db=db, activate=False)

    if res:
        response.status_code = 200
        return {"msg": "Vehicle status updated successfully"}
    
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}

            
@router.patch('/activate_vehicle/{vehicle_service_id}')
async def activate_a_vehicle(response:Response, vehicle_service_id: int, db:AsyncSession = Depends(get_db) ):
      
    # check whether the vehicle exists

    vehicle_service_exists = await check_if_vehicle_service_exists_by_id(vehicle_service_id=vehicle_service_id, db=db)

    if not vehicle_service_exists:
         raise HTTPException(status_code=404, detail="Vehicle service not found")
    
    res = await activate_deactivate_vehicle(vehicle_service_id=vehicle_service_id, db=db, activate=True)

    if res:
        response.status_code = 200
        return {"msg": "Vehicle status updated successfully"}
    
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}
