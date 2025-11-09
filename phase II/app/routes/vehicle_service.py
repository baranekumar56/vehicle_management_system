from fastapi import APIRouter, Query, Form, File, UploadFile, Depends, HTTPException, Response,status
from pydantic import Field
from app.database.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from app.schema.vehicle_service import VehicleService as ModelVehicleService, VehicleServiceCreate
from sqlalchemy.exc import IntegrityError
from app.crud.vehicle import *
from app.crud.generic import *
from app.models.services_vehicles.Vehicle import VehicleService 
from app.models.user.User import Search
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


@router.get('/set_search_vals')
async def set_Vals(db:AsyncSession = Depends(get_db)):
     
    from datetime import datetime
    from sqlalchemy import insert

    insert_values = [
        {"id": 1, "first_name": "Alice", "last_name": "Smith", "address": "123 Elm St", "phone": "555-1234", "created_at": datetime(2025, 1, 15, 8, 30)},
        {"id": 2, "first_name": "Bob", "last_name": "Brown", "address": "456 Oak St", "phone": "555-5678", "created_at": datetime(2025, 2, 20, 14, 45)},
        {"id": 3, "first_name": "Charlie", "last_name": "Davis", "address": "789 Pine St", "phone": "555-8765", "created_at": datetime(2025, 3, 10, 9, 0)},
        {"id": 4, "first_name": "Diana", "last_name": "Evans", "address": "321 Maple St", "phone": "555-4321", "created_at": datetime(2025, 4, 5, 18, 15)},
        {"id": 5, "first_name": "Ethan", "last_name": "Frank", "address": "654 Cedar St", "phone": "555-9876", "created_at": datetime(2025, 5, 25, 12, 0)},
        {"id": 6, "first_name": "Fiona", "last_name": "Green", "address": "987 Birch St", "phone": "555-3456", "created_at": datetime(2025, 6, 30, 7, 25)},
        {"id": 7, "first_name": "George", "last_name": "Harris", "address": "246 Spruce St", "phone": "555-6543", "created_at": datetime(2025, 7, 15, 16, 50)},
        {"id": 8, "first_name": "Hannah", "last_name": "Iverson", "address": "135 Walnut St", "phone": "555-7890", "created_at": datetime(2025, 8, 8, 13, 5)},
        {"id": 9, "first_name": "Ian", "last_name": "Johnson", "address": "864 Chestnut St", "phone": "555-2109", "created_at": datetime(2025, 9, 12, 10, 40)},
        {"id": 10, "first_name": "Jane", "last_name": "King", "address": "753 Ash St", "phone": "555-1098", "created_at": datetime(2025, 10, 20, 11, 30)},
    ]

    # Example insert query using SQLAlchemy ORM async session
    async def insert_test_data(db):
        stmt = insert(Search).values(insert_values)
        await db.execute(stmt)
        await db.commit()

    await insert_test_data(db=db)


@router.post("/get_services")
async def get_all_vehicle_services(search_string: str,filters:dict,limit: int, offset:int, db:AsyncSession = Depends(get_db)):
     
    records = await get_entries(VehicleService, db, search_string=search_string, **filters)
    matches = []
    for record in records:
         matches.append(VehicleService.model_validate(record))

    return matches


