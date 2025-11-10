
import grpc
from app.grpc_stubs.shedavail_pb2 import AvailabilityRequirements, Slot, AvailabilityResponse, MechStatus, empty , Status , ScheduleResponse, ScheduleDetails
from app.grpc_stubs.shedavail_pb2_grpc import ShedAvailServiceStub
import asyncio
from concurrent.futures import ThreadPoolExecutor

executor = ThreadPoolExecutor(max_workers=10)

def connect_to_grpc_service():

    channel = grpc.insecure_channel('127.0.0.1:6969')

    stub = ShedAvailServiceStub(channel=channel)

    return stub


async def get_available_slots(stub, required_hours):
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor, get_available_slots_sync, stub, required_hours)

def get_available_slots_sync(stub, required_hours):
    req = AvailabilityRequirements(required_hours=required_hours)
    response = stub.get_available_hours(req) 
    return [[slot.available_date, slot.available_hours] for slot in response.slots]


async def handle_booking_state_change(stub, booking_id, current_status, mechanic_id=0, schedule_id=0):

    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(executor,handle_booking_state_change_sync, stub, booking_id, current_status, mechanic_id, schedule_id)

def handle_booking_state_change_sync(stub, booking_id, current_status, mechanic_id, schedule_id ):

    # construct Schedule details object
    req = ScheduleDetails(booking_id=booking_id, current_status = current_status, mechanic_id = mechanic_id, schedule_id = schedule_id)

    response = stub.handle_schedule(req)
    return response.status


