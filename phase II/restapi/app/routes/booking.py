

from typing import List
from fastapi import APIRouter, Depends, Form, Body, HTTPException
from app.schema.booking import Booking as ModelBooking, BookingCreate, BookingStatus, ServiceType, PaymentStatus
from app.schema.booked_service import BookedService as ModelBookedService, BookedServiceCreate
from app.schema.booked_repair import BookedRepair as ModelBookedRepair, BookedRepairCreate
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.schema.user_vehicle import UserVehicle as ModelUserVehicle, UserVehicleCreate
from app.schema.bill import BillCreate
from app.schema.booked_repair import BookedRepairCreate, BookedRepair as ModelBookedRepair
from app.models.bookings.Booking import Booking, BookedRepair, BookedService, Bill
from app.models.user.User import UserVehicle
from app.crud.generic import *
from app.crud.booking import *
from app.database.database import mech_notes
from app.schema.booking import MechNote, MechNoteCreate
from datetime import datetime, timedelta
from app.database.database import schedule_settings

router = APIRouter()


# the flow for booking being created is 
    # create a booking entry => after successfull booking generation => add all the services or add a repair entry for that booking

@router.get('/get_available_slots')
async def get_available_slots(db:AsyncSession = Depends(get_db)):
    
    try: 

        # we will call the schedule and availability service here
        pass

    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to get availble slots")



@router.post('/create_booking/repair')
async def create_repair_booking(new_booking: BookingCreate,user_vehicle: UserVehicleCreate, db:AsyncSession = Depends(get_db) ):

    # this route handles a new booking create request 

    try:

        user_vehicle_entry = await check_if_entry_exists(UserVehicle, db, user_id = booking.user_id, vehicle_no = user_vehicle.vehicle_no)
        user_veh = None
        if user_vehicle_entry is None:

            # then it is a new vehicle then add to user vehicle with owned flag set to false

            user_veh:UserVehicle = await add_entry(UserVehicle, user_vehicle, db )

        new_booking.user_vehicle_id = user_veh.user_vehicle_id

        # register booking
        booking:Booking = await add_entry(Booking, new_booking, db, type="repair")


        await commit_changes(db=db)

        return {"msg": "Booking created successfully", "data": ModelBooking.model_validate(booking)} 

    except Exception as e:
        t = str(e)
        raise HTTPException(status_code=500, detail="Some error occured, {}".format(t))


# the problem with service booking is i should get all the booking data at once , the services they picked the booking details etc, 
@router.post('/create_booking/service')
async def create_service_booking(new_booking: BookingCreate = Body(...), booked_services:List[int] = Body(...),user_vehicle:UserVehicleCreate = Body(...), db:AsyncSession = Depends(get_db)):

    # get booking create first -> store all the booked services -> perform aggreagtions (total amount , total time) -> then commit 
    # so that the order flow wont change , also i need to get the data of the users vehicles

    # create the booking entry
    try :
        user_vehicle_entry = await check_if_entry_exists(UserVehicle, db, user_id = booking.user_id, vehicle_no = user_vehicle.vehicle_no)
        user_veh = None
        if user_vehicle_entry is None:

            # then it is a new vehicle then add to user vehicle with owned flag set to false

            user_veh:UserVehicle = await add_entry(UserVehicle, user_vehicle, db )

        new_booking.user_vehicle_id = user_veh.user_vehicle_id
        booking: Booking = await add_entry(Booking, new_booking, db)


        total_price, total_time = await add_services_to_booked_services(booking=booking, vehicle_service_ids=booked_services, db=db)

        # the above would add all the selected services for the booking

        # now perform the aggregations then get the updated value

        total_time = total_time + ( 60 if booking.pickup_required else 0)

        est_completion_time = booking.booked_date + timedelta(minutes = total_time) 

        res = await update_entry_by_id(Booking, booking.booking_id, db, total_amount = total_price, estimated_completion_time = est_completion_time, total_time = total_time)

        # now we look for user vehicle , check whether the user id + vehicle no , combo exists



        if res <= 0:
            raise HTTPException(status_code=500, detail="Cannot create booking")


        if booking.booked_date.date() == datetime.now().date() and datetime.now().time() > 6:
            ## add to unschedulabe queue
            doc = await schedule_settings.find_one({})
            doc['unschedulable_bookings'].append(booking.booking_id)
            await schedule_settings.delete_many()
            await schedule_settings.insert_one(doc) 

        await commit_changes(db)

        return {"msg": "booking created successfully", "data": ModelBooking.model_validate(booking)}
    except Exception as e:
        t = str(e)
        raise HTTPException(status_code=500, detail="Some error occured, {}".format(t))


@router.patch('/update_booking')
async def update_booking_status(booking_id: int,status:str, db:AsyncSession = Depends(get_db)):

    # update the status of the booking take necessary actions

    _ = handle_booking_status_change(booking_id=booking_id, status=status, db=db)
    pass


@router.post('/create_bill')
async def create_a_bill_for_repair_booking(billCreate : BillCreate, requirement_list: list[BookedRepairCreate] , db:AsyncSession = Depends(get_db)):

    # first create the bill then, add the required repair
    
    try:
        
        await add_entry(Bill,billCreate, db)

        for requirement in requirement_list:
            await add_entry(BookedRepair, requirement, db)
        
        await commit_changes(db)

        return {"msg": "bill created successfully and requirement list updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Some thing wrong happend, {str(e)}")

@router.post('/repair/add_requirements')
async def add_requirements_to_repair(requirements: list[BookedRepairCreate], db:AsyncSession = Depends(get_db)):
    
    try:

        for requirement in requirements:
            await add_entry(BookedRepair, requirement, db)
        
        await commit_changes(db)

        return {"msg": "requirements have been added successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Some thing wrong happend, {str(e)}")


@router.put('/repair/update_repair')
async def update_repairs(repairs: list[ModelBookedRepair], db:AsyncSession = Depends(get_db)):

    try:

        for repair in repairs:
            args = repair.model_dump()
            del args.booked_repair_id
            await update_entry_by_id(BookedRepair, repair.booked_repair_id, db, **args  )
        
        await commit_changes(db)

        return {"msg": "Repair details have been updated successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Some thing wrong happend, {str(e)}")



@router.get('/get_mech_notes')
async def get_mech_notes_for_bookings(booking_id: int):

    notes = await mech_notes.find({"booking_id": booking_id}).to_list()

    for i in range(0, len(notes)):

        notes[i]['_id'] = str(notes[i]['_id'])

    return notes

@router.post('/add_mech_note')
async def add_mech_notes_for_bookings(booking_id: int, note: MechNoteCreate):
    note = note.model_dump()
    note['created_at'] = str(note['created_at'])
    result = await mech_notes.insert_one(note)

    inserted_id = result.inserted_id
    inserted_doc = mech_notes.find_one({"_id": inserted_id})

    inserted_doc['_id'] = str(inserted_doc['_id'])

    return inserted_doc




