
from typing import List

from fastapi import HTTPException
from app.models.bookings.Booking import Booking, BookedRepair, BookedService, BookingStatus
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from app.crud.generic import *

async def add_services_to_booked_services(booking:Booking, vehicle_service_ids: List[int], db:AsyncSession):

    # here we call the booking service logging procedure
    print(vehicle_service_ids)
    res = await db.execute(text("SELECT * FROM vehicle_service_log_in_booked_service(:ids, :booking_id)"), 
                          {"ids":vehicle_service_ids, "booking_id": booking.booking_id})
    
    row = res.first()
    return row.total_price, row.total_time



async def handle_booking_status_change(booking_id:int, status:str, db:AsyncSession):
    

    # when are possible activity required statges 
    # when its is in billing, billing_confirmation or on_going, no problem, 

    booking = await get_entries(Booking, db=db, booking_id=booking_id)[0]

    updated_row_count = 0

    if status in ['booked', 'billing', 'billing_confirmation', 'on_going', 'pending']:

        # carry out status update and return the object
        
        updated_row_count = await update_entry_by_id(Booking, id=booking_id, db=db, status = status)

    else :

        # NOTE NOTE ==> users cannot cancel their booking on date of booking
        # but admin can halt or reject on the same date

        # notify the grpc server related to booking, 
        # when booked date is today, then notify the grpc server regarding scheduling if needed

        if datetime.now().date() == booking.booked_date.date():
            
            if status == 'cancelled':
                raise HTTPException(status_code=400, detail="Customer cannot cancell order on booking date...")
            
            
            # now call the grpc servers with the status being updated

            updated_row_count = update_entry_by_id(Booking, id=booking_id, db=db, status = status)

            # grpc_func_call()
            

            # then call the grpc service 

    return updated_row_count
    