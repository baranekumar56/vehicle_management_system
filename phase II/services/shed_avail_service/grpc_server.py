

import grpc

from shedavail_pb2_grpc import add_ShedAvailServiceServicer_to_server, ShedAvailServiceServicer
from shedavail_pb2 import AvailabilityRequirements, AvailabilityResponse, ScheduleDetails, ScheduleResponse, Slot, empty, Status
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy import create_engine, or_
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import text, update, insert

from models.Models import AvailabilityCache, Schedule
from models.Models import Booking, ServiceReminder
from models.Mech import Mechanic
from utils.util import *


from sqlalchemy import cast, Date, desc
from datetime import datetime, date, time, timedelta
# from sqlalchemy.ext.serializer

from motor.motor_asyncio import AsyncIOMotorClient

import yagmail

from collections import deque


def init_db():

    engine = engine(URL="")
    sessionLocal = sessionmaker(bind=engine,autocommit=False, autoflush=False)
    URL = "mongodb://localhost:27017"

    client = AsyncIOMotorClient(URL)

    mongodb_database = client.get_database('vsms')

    schedule_settings = mongodb_database.get_collection('schedule_settings')

    return sessionLocal, schedule_settings

sessionLocal, schedule_settings = init_db()

def get_db():

    db = sessionLocal()

    try :
        yield db
    finally :
        db.close()

class ShedAvailService(ShedAvailServiceServicer):

    async def simulate_daily_schedule(self, request, context):
        db: Session = next(get_db())

        # get all todays booking from booking table
        bookings = []

        conditions = or_(Booking.status == 'booked', Booking.status == 'on_going')

        try:
            bookings = db.query(Booking)\
                         .filter(cast(Booking.booked_date, Date) <= datetime.now().date(), conditions)\
                         .order_by(Booking.type)\
                         .order_by(Booking.booked_date)\
                         .order_by(Booking.estimated_completion_time)\
                         .all()  # Added missing .all() to execute query

            # now fetch the previous days mech list (the order)
            doc = await schedule_settings.find_one({})
            available_mechs = doc['available_mechanics']

            # now i have all the available mechs previous day mech object
            temp: list[Mechanic] = []
            for mechh in available_mechs:
                t = Mechanic(mechh['mechanic_id'], [], [])
                temp.append(t)

            q = deque()
            q.extend(temp)

            complete_mechs = []
            not_scheduleable = []
            i = 0

            # first book all the repairs
            # take k mechanics from the available mechs and assign them to repair works
            not_enough_mechanics = False

            while i < len(bookings):
                booking: Booking = bookings[i]

                if booking.type == 'service':
                    break

                if len(q) == 0:
                    not_enough_mechanics = True
                    break

                # assign a mech to repair for entire day
                mech: Mechanic = q.popleft()

                t = datetime.now()
                from_time = t.replace(hour=9, minute=0, microsecond=0)
                to_time = t.replace(hour=18, minute=0, microsecond=0)

                mech.job_queue.append([from_time, to_time])

                schedule = Schedule(
                    booking_id=booking.booking_id,
                    scheduled_from=from_time,
                    scheduled_to=to_time,
                    mechanic_id=mech.mechanic_id,
                    under_taken=False,
                    stopped=False,
                    stop_reason=""
                )

                db.add(schedule)
                db.flush()  # flush to get schedule_id without commit

                mech.bookings.append([booking.booking_id, schedule.schedule_id])

                complete_mechs.append(mech)
                i += 1

            if not_enough_mechanics:
                # add all the bookings from i to end
                for j in range(i, len(bookings)):
                    not_scheduleable.append(bookings[j].booking_id)

            while not not_enough_mechanics and i < len(bookings):
                booking = bookings[i]

                mech: Mechanic = q.popleft()

                if len(mech.job_queue) == 0:
                    from_time, to_time = calculate_schedule_window(booking=booking)

                    mech.job_queue.append([from_time, to_time])

                    schedule = Schedule(
                        booking_id=booking.booking_id,
                        scheduled_from=from_time,
                        scheduled_to=to_time,
                        mechanic_id=mech.mechanic_id,
                        under_taken=False,
                        stopped=False,
                        stop_reason=""
                    )

                    db.add(schedule)
                    db.flush()

                    mech.bookings.append([booking.booking_id, schedule.schedule_id])
                    q.append(mech)
                else:
                    n = len(q)
                    idx = 0
                    scheduled = False

                    while idx < n:
                        current_mech = q.popleft()
                        last_job = current_mech.job_queue[-1]
                        booking_time = booking.booked_date

                        if last_job[0] < booking_time < last_job[1]:
                            # overlap detected
                            idx += 1
                            q.append(current_mech)
                            continue

                        # schedule here
                        from_time, to_time = calculate_schedule_window(booking=booking)
                        current_mech.job_queue.append([from_time, to_time])

                        schedule = Schedule(
                            booking_id=booking.booking_id,
                            scheduled_from=from_time,
                            scheduled_to=to_time,
                            mechanic_id=current_mech.mechanic_id,
                            under_taken=False,
                            stopped=False,
                            stop_reason=""
                        )

                        db.add(schedule)
                        db.flush()

                        current_mech.bookings.append([booking.booking_id, schedule.schedule_id])
                        q.append(current_mech)

                        scheduled = True
                        idx += 1
                        break

                    if not scheduled:
                        not_scheduleable.append(booking.booking_id)
                i += 1

            # All mechs tells us `about all the mechs , completely scheduled and time available one`
            # with all the mechs, schedule their todays jobs
            all_mechs = complete_mechs + list(q)

            available_mechanics = all_mechs
            doc['available_mechanics'] = available_mechanics
            doc['unschedulable_bookings'] = not_scheduleable

            await schedule_settings.delete_many({})
            await schedule_settings.insert_one(doc)

            db.commit()

            return Status(status=1)  # Assuming Status int32 where 1 indicates success

        except Exception as e:
            print(f"Failed to schedule...: {e}")
            return Status(status=0)

    async def update_mech_status(self, request, context):

        if request.status == 'available':
            # add him to today's available mechanics
            doc = await schedule_settings.find_one({})
            available_mechanics = doc['available_mechanics']

            # just add him
            mechanic = Mechanic(mechanic_id=request.mech_id, job_queue=[], bookings=[])
            available_mechanics.append(mechanic)

            doc['available_mechanics'] = available_mechanics
            await schedule_settings.delete_many({})
            await schedule_settings.insert_one(doc)
            return empty()

        else:
            # the only gotcha, get all the removing mechs bookings , then for each booking 
            # if they are in pause state, leave it , then 

            doc = await schedule_settings.find_one({})
            available_mechanics = doc['available_mechanics']
            unschedulable_bookings = doc['unschedulable_bookings']

            # fixed typo: mechainc_id → mechanic_id
            mech = [mech for mech in available_mechanics if mech.mechanic_id == request.mech_id][0]

            for booking in mech.bookings:
                # booking[0] => booking id, booking[1] => schedule id
                schedule_id = booking[1]

                # sync SQLAlchemy session from get_db generator
                db = next(get_db())
                db_booking = db.query(Booking).filter(Booking.booking_id == booking[0]).first()
                if not isinstance(db_booking, Booking):
                    db.close()
                    continue

                if db_booking.status in ['completed', 'halted', 'billing_confirmation', 'billing', 'cancelled', 'rejected', 'pending']:
                    db.close()
                    continue

                # now either booking or on going
                # cancel all the schedules for this booking in schedules table
                query = update(Schedule).where(Schedule.schedule_id == schedule_id).values(stopped=True, stop_reason="Mechanic blocked")
                db.execute(query)

                if db_booking.status == 'on_going':
                    query = update(Booking).where(Booking.booking_id == db_booking.booking_id).values(status="not_scheduled")
                    db.execute(query)
                    # later add the code to log the reason for status change

                unschedulable_bookings.append(db_booking.booking_id)
                db.close()

            # that's it , now remove the mechanic from available ones
            available_mechanics = [mech for mech in available_mechanics if mech.mechanic_id != request.mech_id]
            doc['available_mechanics'] = available_mechanics
            doc['unschedulable_bookings'] = unschedulable_bookings
            await schedule_settings.delete_many({})
            await schedule_settings.insert_one(doc)

            return empty()


    async def handle_schedule(self, request, context):
        # i dont know what to do at this point here

        # when status is going to be => billing or billing confirmation or pending or not scheduled or cancelled or rejected or completed

        # cancelled or rejected or halted or billing or billing confirmation or pending or not scheduled 
        
        db: Session = next(get_db())  # Fixed missing parentheses to call generator
        current_status = request.current_status
        
        booking = db.query(Booking).filter(Booking.booking_id == request.booking_id).first()  # Use correct Booking field and fetch one
        
        doc = await schedule_settings.find_one({})

        available_mechanics = doc['available_mechanics']
        not_scheduleable = doc['unschedulable_bookings']

        if current_status in ['halted', 'cancelled', 'rejected', 'pending', 'billing_confirmation', 'billing']:
            # check if booking id is in any mechanics current scheduling if it is, then cancel 
            for i in range(len(available_mechanics)):
                mech: Mechanic = available_mechanics[i]

                found = False
                updated_bookings = []

                for booking_id, schedule_id in mech.bookings:
                    if booking_id == request.booking_id:
                        # then cancel the schedule
                        query = update(Schedule).where(Schedule.schedule_id == schedule_id)\
                                            .values(stopped=True, stop_reason="Cancelled due to booking status change")
                        db.execute(query)
                        found = True

                        # remove from bookings list
                        updated_bookings = [pair for pair in mech.bookings if pair[0] != request.booking_id]

                        if booking_id not in not_scheduleable:
                            not_scheduleable.append(booking_id)
                        break

                if found:
                    mech.bookings = updated_bookings
                    available_mechanics[i] = mech
                    break

        db.commit()
        await schedule_settings.delete_many({})
        doc['available_mechanics'] = available_mechanics
        doc['unschedulable_bookings'] = not_scheduleable
        await schedule_settings.insert_one(doc)

        return Status(status=1)


    def get_available_hours(self, request, context):
        
        # first using the db connection , we get all the available hours 

        db:Session = next(get_db())

        # as this is a microservice , i think we can directly execute statements

        records = db.query(AvailabilityCache).all()
        
        # now for availability cache , for each row check whether we have have a conitnuous set of numbers

        result = {}

        for slot in records:
            
            if not slot.active:
                continue
            
            if len(slot.available_hours ) == 0:
                continue

            a_hours = slot.available_hours

            if request.required_hours == 1:
                day = str(slot.day)

                if day in result:
                    result[day] = result[day] | set(useable_hours)
                else:
                    result[day] = set(useable_hours)
                
                continue
                

            # search for continuous values here

            count = 1
            useable_hours = []

            for i in range(1, len(a_hours)):

                if a_hours[i] - 1 == a_hours[i-1]:
                    count += 1

                    if count >= request.required_hours:
                        # then go front of reqiured hours
                        useable_hours.append(a_hours[i - count + 1])
                else:
                    count = 1

            if len(useable_hours ) != 0:
                # then current slot is ok
                day = str(slot.day)
                if day in result:
                    result[day] = result[day] | set(useable_hours)
                else:
                    result[day] = set(useable_hours)
            
        # for the next n days there are no viable slots

        res = AvailabilityResponse()

        if len(result) == 0:
            res.slots = []
            return res
        
        # now i have to create slot object to send through wire

        for day, available_hours in result.items():

            # create slot object then push it in array
            slot = Slot(available_date = day, available_hours = list(available_hours))
            res.slots.append(slot)

        
        return res
    

    def send_remainder_emails():

        db:Session = next(get_db)

        my_email = 'baranevsmstest@gmail.com'
        my_name = 'barane_vsms_test'
        password = 'Baranekumarvsmstest1234'

        yag = yagmail(my_email, password)

        query = db.query(ServiceReminder).filter(ServiceReminder.remind_at == datetime.now().date())
        bookings = query.all()
        for booking in bookings:

            if not booking.user_details.active or not booking.vehicle_details.is_deleted:
                continue
            
            user_email = booking.user_details.user_email
            vehicle_no = booking.vehicle_details.vehicle_no
            vehicle_name = booking.vehicle_details.brand + booking.vehicle_details.model

            yag.send(
                to=user_email,
                subject = 'Remainder for vehicle service',
                contents =  f"Your 3-month remainder for vehicle no: {vehicle_no} ({vehicle_name}), is today , dont forget to make your booking...."
            )
        
def serve():

    server = grpc.server(ThreadPoolExecutor(max_workers=10))

    add_ShedAvailServiceServicer_to_server(ShedAvailService(), server=server)

    server.add_insecure_port('127.0.0.1:6969')

    server.start()

    server.wait_for_termination()



