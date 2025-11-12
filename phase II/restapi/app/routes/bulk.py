

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, File, UploadFile
from app.database.database import get_db, schedule_settings
from app.models.bookings.Booking import AvailabilityCache, Shed
from app.models.user.User import Mechanic
from app.models.schedule.Schedule import Schedule

from app.schema.schedule import Schedule as ModelSchedule, ScheduleCreate
from app.crud.generic import *
from datetime import datetime


from app.schema.service import ServiceCreate
from app.schema.vehicle import VehicleCreate
from app.schema.vehicle_service import VehicleServiceCreate
from app.schema.user import MechanicCreate
from app.schema.package import PackageServiceCreate
from app.schema.inventory import ProductCreate

# models

from app.models.services_vehicles.Service import Service
from app.models.services_vehicles.Vehicle import Vehicle, VehicleService
from app.models.package.Package import PackageService
from app.models.inventory.Inventory import Inventory


import csv
import codecs

router = APIRouter()

schemas = {"service" : [ServiceCreate, Service], "vehicle" : [VehicleCreate, Vehicle], "vehicle_service": [VehicleServiceCreate, VehicleService],"package_service":[PackageServiceCreate, PackageService], "inventory": [ProductCreate, Inventory]  }



@router.post('/bulk_upload')
async def bulk_insert( table_name : str, file:UploadFile =  File(...), db:AsyncSession = Depends(get_db)):

    """
        THe core idea for batch upload, is get the csv file , along with the table to insert , 
        we just simple map each column to the actual value, then try to insert them, before that go through the columns validation 
        so that the value gets filtered, user need to make sure the csv file size should be less than 10mb

    """

    try:

        # check file type
        print(file.content_type)
        if file.content_type != 'text/csv':
            raise HTTPException(status_code=400, detail="Only CSV files are accepted")
        
        contents = await file.read()
        size = len(contents)

        # 1024 * 1024 * 10

        if size > 1024 * 1024 * 10 :
            raise HTTPException(status_code=400, detail="CSV file size must be within 10MB")

        await file.seek(0)

        await bulk_insert_handler(file, table_name, db)

        return {"msg" : "batch upload done successfully"}

    except HTTPException as e:
        raise 
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Some error occurred, {str(e)}")


async def bulk_insert_handler(file:UploadFile, table_name, db:AsyncSession):

    """this function takes the file with the table name, by mapping the table name to its modelcreate class, 
       if all the attributes with more are available , no problem , if required is not there , then aborted.
       Checks , the file is considered to have the first rows as the headers or the attributes
    """

    modelCreateClass, model = schemas[table_name]
    required_attributes = modelCreateClass.__fields__.keys()

    # remove active and other created at deactivated at attributes

    required_attributes = [attr for attr in required_attributes if  attr not in ['created_at', 'active', 'last_deactivated', ]]



    csv_reader = csv.DictReader(codecs.iterdecode(file.file, "utf-8"))
    headers = [h.lower() for h in csv_reader.fieldnames]

    # Ensure all required attributes exist in headers
    for attr in required_attributes:
        if attr.lower() not in headers:
            file.file.close()
            raise HTTPException(
                status_code=400,
                detail=f"Missing required attribute '{attr}' in CSV headers."
            )

    try:
        for row in csv_reader:
            
            to_be_added = {attr: row[attr] for attr in required_attributes}
            model_obj = modelCreateClass(**to_be_added) 
            db_obj = model(**model_obj.dict()) 

            db.add(db_obj)

        await commit_changes(db)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Bulk upload failed, {str(e)}")
    finally:
        file.file.close()


