

import grpc

from shedavail_pb2_grpc import add_ShedAvailServiceServicer_to_server, ShedAvailServiceServicer
from shedavail_pb2 import AvailabilityRequirements, AvailabilityResponse, ScheduleDetails, ScheduleResponse, Slot
from concurrent.futures import ThreadPoolExecutor
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy import text

from models.Models import AvailabilityCache
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

    def updated_mech_status(self, request, context):

        # this function gets called when a mechanic puts a leave in between a day or joins mid day

        # possible schenariors

        """
        puts leave in between --> 
            -> then remove all his current bookings, mark all his not handled schedules as cancelled
            -> for bookings , now try to reschedule to other mechanics 

        when joins in between -->
            -> assign pending or unschedulable bookings to him
            ( a little notch here is , we assign those bookings in a way that from morning to evening, because when he comes , may
              be huge amount of work have been kept aside, now the first booking vehicle can be assigned to him, if they didn't appeared, then we refund them)

        """

        db:Session = next(get_db)

        available_mechs = schedule_settings.find()[0]['available_mechs']

        """Tells us whether the scheduling was successfull"""
        scheduled = False

        if request.status == 'available':
            
            mech = Mechanic(request.mech_id, [], [])
            available_mechs.append(mech)

            # now schedule all the not scheuldable bookings

            bookings = schedule_settings.find()[0]['not_schedulable']

            i = 0

            while i < len(bookings):

                booking:Booking = bookings[i]

                if booking.type == 'repair':
                    # then schedule the from the current time till , end of day

                    from_time = datetime.now().time().replace(minute=0, second=0, microsecond=0)
                    to_time = datetime.time(18, 0)

                    mech.job_queue.append([from_time, to_time])
                    mech.bookings.append(booking)
                    scheduled = True
                    break

                else :

                    # check whether the current booking is not overlapping the user
                    from_time, to_time = calculate_schedule_window(booking=booking)

                    if len(mech.job_queue) == 0:

                        # then assign the current booking to the mechanic
                        mech.job_queue.append(from_time, to_time)
                        mech.bookings.append(booking)
                    
                    else :

                        # check if there is an overlap

                        last_job = mech.job_queue[-1]

                        booking_time = booking.booked_date.time()

                        if booking_time > last_job[0] and booking_time < last_job[1]:
                        # this is a over lap , we cant assign the booking to him 
                            continue

                        else:
                            # there is no over lap add the cuurent time to job queue

                            mech.job_queue.append([from_time, to_time])
                            mech.bookings.append(bookings)
                i += 1
            

        else:
            

            # this part of scheduling handles mechanic blocking

            # now we remove all of his bookings from him and try to reshedule that to others

            # the current mechanic will be in available mechanincs, take him out, 
            # check if the booking scheduled to him was completed , if it is, then delete it else add it to need to reschedule,
            # then try to make this bookings to schedule with available mechanics 

            leaving_mech:Mechanic = [mech for mech in available_mechs if mech.mechanic_id == request.mechanic_id][0]
            remaining_mechs = [mech for mech in available_mechs if mech.mechanic_id != request.mechanic_id]

            # now take all the leaving mechanics bookings and get its booking status

            pending_bookings = []

            for booking in leaving_mech.bookings:

                booking = db.query(Booking).filter(Booking.booked_id == booking.booking_id).first()


                if booking.status in ['completed', 'halted', 'billing_confirmation' , 'billing' , 'cancelled', 'rejected', 'pending']  :
                    # we dont need to reschedule for these status
                    continue

                # booked or on going

                # now schedule the booking to a free mechanic
                
                # the mechnics could have already have job with them, now check for a gap in which we could squeeze the scehdule


                # when the handling booking is repair, it is pain in the ass
                
                
                
            


        
        return 


    def handle_schedule(self, request: ScheduleDetails , context):

        # i dont know what to do at this point here
        




        return super().handle_schedule(request, context)

    def get_available_hours(self, request: AvailabilityRequirements, context):
        
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
        

    


def handle_daily_schedule():
    """this function handles daily schedule for mechanics..."""
    db:Session = next(get_db)

    # get all todays booking from booking table
    bookings = []

    try:
        bookings = db.query(Booking).filter(
            cast(Booking.booked_date, Date) <= datetime.now().date(), Booking.status != 'completed').order_by(Booking.type).order_by(Booking.booked_date).order_by(Booking.estimated_completion_time)


        # now fetch the previous days mech list (the order)

        # for each booking pair with new mechanic , until 

        available_mechs = schedule_settings.find()[0]['available_mechs']

        # now i have all the available mechs previous day mech object

        temp:list[Mechanic] = []

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

            booking:Booking = bookings[i]

            if booking.type == 'service':
                break

            if len(q) == 0:
                not_enough_mechanics = True
                break


            # assign a mech to repair for entire day

            mech:Mechanic = q.popleft()

            from_time = datetime.time(9, 0)
            to_time = datetime.time(18, 0)

            mech.job_queue.append([from_time, to_time])
            mech.bookings.append(booking)

            complete_mechs.append(mech)

            i += 1

        if not_enough_mechanics:
            # add all the bookings from i to end
            not_scheduleable.extend(bookings[i:])


        while not not_enough_mechanics and i < len(bookings):

            booking = bookings[i]
            
            # first schedule for all services then , if a repair comes try to schedule them in between time of all mechanics

            # take a mechanic check if his previous job is coinciding with current if, it is enqueue him at the back

            mech: Mechanic = q.popleft()

            if len(mech.job_queue)  == 0:

                from_time, to_time = calculate_schedule_window(booking=booking)

                mech.job_queue.append([from_time, to_time])
                mech.bookings.append(booking)

                q.append(mech)

            else :

                # we have done a round trip assigning job to all mechanic, now we need to compare each booking with 
                # all the mechanic , if their job queue over laps with current booking skip to next , if not assignable
                # add that booking to not bookable list


                n = len(q)
                i = 0
                scheduled = False

                while (i < n) :
                    mech = q.popleft()
                    
                    # check if his previous job overlaps current

                    last_job = mech.job_queue[-1]

                    booking_time = booking.booked_date.time()

                    if booking_time > last_job[0] and booking_time < last_job[1]:
                        # this is a over lap , we cant assign the booking to him 
                        q.append(mech)
                        continue

                    # now we can schedule the booking to him
                    from_time, to_time = calculate_schedule_window(booking=booking)

                    mech.job_queue.append([from_time, to_time])
                    mech.bookings.append(booking)

                    q.append(mech)

                    scheduled = True
                    break

                    i += 1

                if not scheduled :

                    # then that booking had no free mechanics to schedule, we then wait for mechanics getting freed, or other bookings get halted or rejected pr cancelled
                    not_scheduleable.append(booking)
            i += 1
        """All mechs tells us `about all the mechs , completely scheduled and time available one`"""  
        """with all the mechs, schedule their todays jobs """  
        all_mechs = complete_mechs + list(q)


            
        # sheds get binded during vehicle being admitted here

    except:
        print("Failed to schedule...")


def serve():

    server = grpc.server(ThreadPoolExecutor(max_workers=10))

    add_ShedAvailServiceServicer_to_server(ShedAvailService(), server=server)

    server.add_insecure_port('127.0.0.1:6969')

    server.start()

    server.wait_for_termination()



