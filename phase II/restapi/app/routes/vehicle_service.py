from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response,status
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.vehicle_service import VehicleService as ModelVehicleService, VehicleServiceCreate
from sqlalchemy.exc import IntegrityError
from app.crud.vehicle import *
from app.crud.generic import *
from app.models.services_vehicles.Vehicle import VehicleService 
from app.schema.vehicle_service import Search as ModelSearch


router = APIRouter()

@router.post('/add_vehicle_service', status_code=status.HTTP_200_OK)
async def add_a_vehicle(vehicle_service: VehicleServiceCreate , db:AsyncSession = Depends(get_db) ):


        # add the duplicate login here dont do in add vehicle to db
        
        vehicle_service_exists = await check_if_vehicle_service_exists(vehicle_service, db)
        if  vehicle_service_exists:
            raise HTTPException(status_code=409, detail="vehicle service already exists")
        
        try :
              vehicle_service:ModelVehicleService = await add_vehicle_service_to_db(vehicle_service, db)

              return {"msg":"vehicle service added successfully", "data": vehicle_service}
        except Exception as e:

            e = str(e)
            raise HTTPException(status_code=500, detail="Some thing bad happened, {}".format(e))
        
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
    
    res = await activate_deactivate_vehicle_service(vehicle_service_id = vehicle_service_id, db = db, activate = True)

    if res:
        response.status_code = 200
        return {"msg": "Vehicle status updated successfully"}
    
    else :
        response.status_code = 400
        return {"msg": "User status update failed"}

@router.put('/update_vehicle_service')
async def update_vehicle_service(vehicle_service: ModelVehicleService , db:AsyncSession = Depends(get_db)):
     
     # this is put , i check whether it is a legal object by checking its id, then put everything with the upcoming data
    try :
        vehicle_service: ModelVehicleService = await check_if_id_exists(vehicle_service.vehicle_service_id, VehicleService, db)

        if vehicle_service is None:
            raise HTTPException(status_code=404, detail="Vehicle service not found")
        
        # update the new attributes

        updated_rows = await update_entry_by_id(VehicleService, vehicle_service.vehicle_service_id, db, price = vehicle_service.price, time_to_complete = vehicle_service.time_to_complete )
        await commit_changes(db)

        return {"data": "updation successfull", "affected_rows":updated_rows }
    except Exception as e:
         raise HTTPException(status_code=500, detail="Can't update vehicle service, {}".format(str(e)))
    

@router.get('/get_vehicle_service')
async def get_all_services_of_a_vehicle(vehicle_id: int, db:AsyncSession = Depends(get_db)):
    
    records = await get_entries(VehicleService, db, vehicle_id = vehicle_id)

    vehicle_services: list[ModelVehicleService] = records

    return {"data": vehicle_services}


@router.post("/get_services")
async def get_all_vehicle_services(search_string: str,filters:dict,limit: int, offset:int, db:AsyncSession = Depends(get_db)):
     
    records = await get_entries(VehicleService, db, search_string=search_string, **filters)
    matches = []
    for record in records:
         matches.append(VehicleService.model_validate(record))

    return matches


