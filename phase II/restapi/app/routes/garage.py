"""
this file is mostly used for schedule related routes and garage related routes
"""

from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from app.database.database import get_db, schedule_settings
from app.models.bookings.Booking import AvailabilityCache, Shed
from app.models.user.User import Mechanic
from app.models.schedule.Schedule import Schedule

from app.schema.schedule import Schedule as ModelSchedule, ScheduleCreate
from app.crud.generic import *
from datetime import datetime
"""
    In this file, we update and create schedules, schedules, rescheudule all those things
"""

router = APIRouter()

## shed related routes

@router.post('/create_shed')
async def create_a_shed(shed_id: int,type:str, shed_name: str,background_tasks: BackgroundTasks, db:AsyncSession = Depends(get_db)):
    try:

        doc = await schedule_settings.find_one({})

        total_shed_count = doc['shed_count']
        available_sheds = doc['available_sheds']
        current_shed_id = total_shed_count + 1
        available_sheds.append(current_shed_id)
        # in doc , there will be repair sheds and service sheds
        available_hours = [9, 10, 11, 12, 13, 14, 15, 17, 18]
        if type == 'repair':
            doc['repair_shed_count'] = current_shed_id
            s = Shed(shed_id=current_shed_id,shed_type = "repair", shed_name=shed_name, active = True )
            db.add(s)
            await db.flush()
            # in all the availability cache add a shed if with this
            background_tasks.add_task(create_date_stamps, current_shed_id, "repair")

        else :
            doc['service_shed_count'] = current_shed_id
            s = Shed(shed_id=current_shed_id,shed_type = "service", shed_name=shed_name, active = True )
            db.add(s)
            await db.flush()

            background_tasks.add_task(create_date_stamps, current_shed_id, "service")

        _id = doc['_id']

        if type == 'repair':
            doc['repair_shed_count'] = doc['repair_shed_count'] 
        else:
            doc['service_shed_count'] = doc['service_shed_count']

        # update to mongo
        await db.commit()
        await schedule_settings.update_one({"_id" : _id}, {"$set": {"repair_shed_count" : doc['repair_shed_count'], "service_shed_count": doc['service_shed_count'], "shed_count" : total_shed_count + 1, "available_sheds": available_sheds}})
        return {"msg" : "Shed created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to create shed, {str(e)}")
        
async def create_date_stamps(shed_id, type):


    db_generator = get_db()
    db = await db_generator.__anext__()
    try:   
        for i in range(0, 30):
            dat = datetime.now().date() + timedelta(days=i)
            ac = AvailabilityCache(shed_id = shed_id, day=dat, available_hours = [9, 10, 11, 12, 13, 14, 15, 17, 18], version = 0, active = True, shed_type = type)
            db.add(ac)

        await db.commit()
    finally:
        await db_generator.aclose()


@router.patch('/deactivate_shed')
async def deactivate_shed(shed_id: int, db:AsyncSession = Depends(get_db)):

    # check if the id exists in the schedule settings
    try:
        doc = await schedule_settings.find_one({})
        availabile_sheds = doc['available_sheds']

        if shed_id not in availabile_sheds:
            raise HTTPException(status_code=404, detail="Shed id not found")
        
        # then deactivate it
        await update_entry_by_id(Shed, id=shed_id, db=db, active = False)

        await update_entry(AvailabilityCache, {"shed_id" : shed_id }, db, active = False )

        await commit_changes(db)

        return {"msg" : "Shed deactivated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Can't update shed status, {str(e)}")
    
@router.patch('/activate_shed')
async def activate_shed(shed_id: int, db:AsyncSession = Depends(get_db)):

    # check if the id exists in the schedule settings
    try:
        doc = await schedule_settings.find_one({})
        availabile_sheds = doc['available_sheds']

        if shed_id not in availabile_sheds:
            raise HTTPException(status_code=404, detail="Shed id not found")
        
        # then deactivate it
        await update_entry_by_id(Shed, id=shed_id, db=db, active = True)
        await update_entry(AvailabilityCache, {"shed_id" : shed_id }, db, active = True )

        await commit_changes(db)

        return {"msg" : "Shed activated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Can't update shed status, {str(e)}")
    

@router.delete('/delete_shed')
async def delete_a_shed(shed_id: int, db:AsyncSession = Depends(get_db)):

    try:
        from app.crud.garage import delete_availability_in_availability_cache

        doc = await schedule_settings.find_one({})
        available_sheds = doc['available_sheds']

        if shed_id not in available_sheds:
            raise HTTPException(status_code=404, detail="Shed id not found")
  
        # on delete remove the id from available ids in mongo and delete in availability cache also delete that in sheds table
        
        _id = doc['_id']
        available_sheds = [shed for shed in available_sheds if shed_id != shed]
        await delete_multiple_entries_using_id(Shed, [shed_id], db)
        
        await delete_availability_in_availability_cache(shed_id, db)
        

        await schedule_settings.update_one({"_id" : _id}, {"$set": { "available_sheds": available_sheds}})
        await commit_changes(db)
        return {"msg" : "Shed deleted successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Can't delete shed, {str(e)}")
    
    
@router.get('/get_schedules')
async def get_a_mechanics_schedule(mechanic_idd: int, db:AsyncSession=Depends(get_db)):

    try:

        mechanic = await check_if_id_exists(mechanic_idd, Mechanic, db)

        if mechanic is None:
            raise HTTPException(status_code=404, detail="Mechanic id not found")
        today = datetime.now().date()
        print("------------------------")
        schedules = await get_entries(Schedule, db, mechanic_id = mechanic_idd, scheduled_date = today )
        print("------------------------")

        schedules = [ModelSchedule.model_validate(schedule) for schedule in schedules]

        return {"schedules": schedules}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get schdueles for mechanic, {str(e)}")

# now only thing is admin doing manuall scheduling

@router.post('/create_manual_schedule')
async def manual_scheduling_for_mechanic(schedule: ScheduleCreate, db:AsyncSession = Depends(get_db) ):

    # insert the schedule first then update the mongo db

    

    # class Mechanic:

    #     mechanic_id:int 
    #     job_queue: list[list[int]]
    #     bookings : list[list[int]] # booking id, scheulde id

    #     def __init__(self, mechanic_id, job_queue, bookings):
    #         self.mechanic_id = mechanic_id
    #         self.job_queue = job_queue
    #         self.bookings = bookings



    try:
        
        schedule:Schedule = await add_entry(Schedule, schedule, db)

        # now everything is ok, i need to update the mongo documnet for the mechanic

        doc = await schedule_settings.find_one({})

        available_mechanics = doc['available_mechanics']

        for i in range(0, len(available_mechanics)):

            if available_mechanics[i]['mechanic_id'] == schedule.mechanic_id:
                
                # update his job queue
                available_mechanics[i]['job_queue'].append([schedule.scheduled_from, schedule.scheduled_to])
                available_mechanics[i]['bookings'].append([schedule.booking_id, schedule.schedule_id])
        
        _id = doc['_id']

        await schedule_settings.update_one({"_id" : _id}, {"$set" : {"available_mechanics": available_mechanics}})

        await commit_changes(db)

        return {"msg": "schedule creation successfull"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Manual schedule failed, {str(e)}")


