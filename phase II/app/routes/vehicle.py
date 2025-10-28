from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response,status
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.vehicle import Vehicle, VehicleCreate, BaseVehicle
from sqlalchemy.exc import IntegrityError
from app.crud.vehicle import *


router = APIRouter()

@router.post('/add_vehicle', status_code=status.HTTP_200_OK)
async def add_a_vehicle(vehicle: VehicleCreate, db:AsyncSession = Depends(get_db) ):


        # add the duplicate login here dont do in add vehicle to db
        
        vehicle_exists = await check_if_vehicle_exists(vehicle, db)
        if  vehicle_exists:
            raise HTTPException(status_code=409, detail="Vehicle already exists")
        
        try :
              vehicle:Vehicle = await add_vehicle_to_db(vehicle, db)

              return {"msg":"vehicle added successfully", "data": vehicle}
        except Exception as e:

            e = str(e)
            raise HTTPException(status_code=500, detail="Some thing bad happened, {e}")
        
@router.patch('/deactivate_vehicle/{vehicle_id}')
async def deactivate_a_vehicle(response:Response, vehicle_id: int, db:AsyncSession = Depends(get_db) ):
      
    # check whether the vehicle exists

    vehicle_exists = await check_if_vehicle_exists_by_id(vehicle_id=vehicle_id, db=db)

    if not vehicle_exists:
         raise HTTPException(status_code=404, detail="Vehicle not found")
    
    res = await activate_deactivate_vehicle(vehicle_id=vehicle_id, db=db, activate=False)

    if res:
        response.status_code = 200
        return {"msg": "Vehicle status updated successfully"}
    
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}

            
@router.patch('/activate_vehicle/{vehicle_id}')
async def activate_a_vehicle(response:Response, vehicle_id: int, db:AsyncSession = Depends(get_db) ):
      
    # check whether the vehicle exists

    vehicle_exists = await check_if_vehicle_exists_by_id(vehicle_id=vehicle_id, db=db)

    if not vehicle_exists:
         raise HTTPException(status_code=404, detail="Vehicle not found")
    
    res = await activate_deactivate_vehicle(vehicle_id=vehicle_id, db=db)

    if res:
        response.status_code = 200
        return {"msg": "Vehicle status updated successfully"}
    
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}
