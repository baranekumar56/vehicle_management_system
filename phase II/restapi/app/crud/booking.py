
from typing import List

from fastapi import HTTPException
from app.models.bookings.Booking import Booking, BookedRepair, BookedService, BookingStatus
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.grpc_stubs.grpc_client import *
from app.models.payment.Payment import Payment
from app.schema.payment import Payment as ModelPayment, PaymentCreate
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

    booking:Booking = await get_entries(Booking, db=db, booking_id=booking_id)[0]

    updated_row_count = 0

    if status in ['booked', 'billing', 'billing_confirmation', 'on_going']:

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


        if status == 'cancelled' or status == 'rejected':
            booked_date = booking.booked_date.date()
            today = datetime.now().date()

            # carry out date arithmetics
            paid_amount = 0
            payments = await get_entries(Payment, db, booking_id = booking.booking_id )

            for payment in payments:
                paid_amount += payment.paid_amount

            if status == 'rejected':

                # make a full refund of what user paid
                refund = PaymentCreate(booking_id=booking.booking_id, user_id=booking.user_id, paid_amount=paid_amount,type="refund", payment_time=datetime.now() )
                refund = await add_entry(Payment, refund, db )
                

            elif booking.total_amount == paid_amount:
                # check date match 
                if booked_date - today >= 7:
                    # full refund
                    refund = PaymentCreate(booking_id=booking.booking_id, user_id=booking.user_id, paid_amount=paid_amount,type="refund", payment_time=datetime.now() )
                    refund = await add_entry(Payment, refund, db )
                
                elif booked_date - today >= 3:

                    # 50 % refund
                    refund = PaymentCreate(booking_id=booking.booking_id, user_id=booking.user_id, paid_amount=paid_amount * 0.5,type="refund", payment_time=datetime.now() )
                    refund = await add_entry(Payment, refund, db )
                else:
                    # no refund for him
                    pass


            updated_row_count = update_entry_by_id(Booking, id=booking_id, db=db, status = status)

            # grpc_func_call()
            # then call the grpc service 
            await handle_booking_state_change(stub=stub, booking_id=booking.booking_id, current_status=status, mechanic_id=0, schedule_id=0)

    await commit_changes(db)

    return updated_row_count
    