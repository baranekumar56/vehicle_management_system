

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db

from app.crud.generic import *

from app.models.package.Package import Package, PackageService
from app.schema.package import Package as ModelPackage, PackageCreate, PackageService as ModelPackageService, PackageServiceCreate
from app.crud.package import package_state_changer

from sqlalchemy.exc import IntegrityError

router = APIRouter()



@router.post('/create_package')
async def create_new_package(new_package: PackageCreate, db:AsyncSession = Depends(get_db)):

    # check if there is already another package with the same name
    try:

        package = await check_if_entry_exists(Package, db=db, package_name = new_package.package_name, vehicle_id = new_package.vehicle_id )

        if package != None:
            raise HTTPException(status_code=400, detail="Package already exists for that vehicle type...")
        

        # then add the current package

        package = await add_entry(Package, new_package, db=db)

        await commit_changes(db)

        return {"msg": "package created successfully"}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Some thing bad happend, couldn't create package")
    

@router.patch('/activate_package')
async def activate_package(package_id:int,db:AsyncSession = Depends(get_db) ):

    try:

        # check package exists 
        package = await check_if_id_exists(package_id, Package, db=db)

        if package is None:
            raise HTTPException(status_code=404, detail="Package not found")
        
        updated_row_count = await update_entry_by_id(Package, id=package_id, db=db, active = True)

        if updated_row_count <= 0:
            raise HTTPException(status_code=400, detail="Failed to update package")
        
        await commit_changes(db)

        return {"msg": "package activated successfully"}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Some thing bad happend, couldn't update package")


@router.patch('/deactivate_package')
async def deactivate_package(package_id:int,db:AsyncSession = Depends(get_db) ):

    try:

        # check package exists 
        package = await check_if_id_exists(package_id, Package, db=db)

        if package is None:
            raise HTTPException(status_code=404, detail="Package not found")
        
        updated_row_count = await update_entry_by_id(Package, id=package_id, db=db, active = False)

        if updated_row_count <= 0:
            raise HTTPException(status_code=400, detail="Failed to update package")
        
        await commit_changes(db)
        return {"msg": "package deactivated successfully"}


    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Some thing bad happend, couldn't update package")


@router.post('/add_package_services')
async def add_package_services(services:list[PackageServiceCreate], db:AsyncSession = Depends(get_db)):

    """this function tries to insert all the package service provided by the user, if a duplicate pair is found all the insertions are rollbacked"""
    try: 
        inserted_rows = await insert_multiple_entries(PackageService, services, db)

        if inserted_rows != len(services):
            raise IntegrityError(statement="Duplicate entries found")

        await commit_changes(db)

        return {"msg": "package services added successfully"}

    except IntegrityError as e:
        raise HTTPException(status_code=422, detail="Duplicate entries found")

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to add services to packages")

@router.post('/remove_package_services')
async def remove_package_services(package_service_ids: list[int], db:AsyncSession = Depends(get_db)):

    """this function entirely deletes no gotcha's , it just passes the ids to delete"""
    """for this any condition is used , so even when the id is not available , it wont raise any error"""
    try:
        deleted_rows = await delete_multiple_entries_using_id(PackageService, ids=package_service_ids, db=db)

        await commit_changes(db)

        return {"msg": "packages services removed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete package services")


@router.patch('/batch_status_update')
async def batch_status_changer(package_ids: list[int],new_status: bool, db:AsyncSession = Depends(get_db)):

    try:
        updated_rows = await package_state_changer(package_ids, new_status, db)

        await commit_changes(db)
        return {"msg": "batch updation successfull"}
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to delete package services")
    
### the only remaining thing i guess is, filter,