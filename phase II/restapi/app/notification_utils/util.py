import httpx
from sqlalchemy import select
from app.database.database import get_db
from app.models.bookings.Booking import Booking, BookedService, BookedRepair
from app.models.services_vehicles.Vehicle import VehicleService
from app.models.services_vehicles.Service import Service
from app.models.schedule.Schedule import Schedule

async def send_booked_service_update_notification(booked_service: BookedService):
    db_generator = get_db()
    db = await db_generator.__anext__()

    try:
        query = select(Booking).join(BookedService, Booking.booking_id == booked_service.booking_id)
        booking_result = await db.execute(query)
        booking = booking_result.scalar_one_or_none()

        if not booking:
            print("No booking found for booked_service")
            return

        query = select(Service).join(VehicleService, VehicleService.service_id == Service.service_id).join(
            BookedService, BookedService.vehicle_service_id == VehicleService.vehicle_service_id
        ).filter(BookedService.booked_service_id == booked_service.booked_service_id)

        service_result = await db.execute(query)
        service = service_result.scalar_one_or_none()

        if not service:
            print("No service found for booked_service")
            return

        notification = {
            "send_option": "specified_users",
            "specified_users": [booking.user_id],
            "content": f"Your {service.service_name} for booking id {booking.booking_id} has been completed !!!",
            "required": False,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                'http://127.0.0.1:9696/create_notification',
                json=notification,
            )
            response_data = response.json()
            # Optionally log or use response_data
    except Exception as e:
        user_id = booking.user_id if 'booking' in locals() and booking else "unknown"
        print(f"Notification to user {user_id} on booked service id {booked_service.booked_service_id} failed due to: {str(e)}")
    finally:
        await db_generator.aclose()



async def send_booked_repair_update_notification(booked_repair: BookedRepair):
    db_generator = get_db()
    db = await db_generator.__anext__()

    try:
        query = select(Booking).join(BookedRepair, Booking.booking_id == booked_repair.booking_id)
        booking_result = await db.execute(query)
        booking = booking_result.scalar_one_or_none()

        if not booking:
            print("No booking found for booked_repair")
            return


        notification = {
            "send_option": "specified_users",
            "specified_users": [booking.user_id],
            "content": f"Your {booked_repair.repair_name} repair for booking id {booking.booking_id} has been completed !!!",
            "required": False,
        }

        async with httpx.AsyncClient() as client:
            response = await client.post(
                'http://127.0.0.1:9696/create_notification',
                json=notification,
            )
            response_data = response.json()
            #
    except Exception as e:
        user_id = booking.user_id if 'booking' in locals() and booking else "unknown"
        print(f"Notification to user {user_id} on booked repair {booked_repair.repair_name} failed due to: {str(e)}")
    finally:
        await db_generator.aclose()


async def mechanic_schedule_update_notification(schedule: Schedule):

    try:

        notification = {
            "send_option": "specified_users",
            "specified_users": [schedule.mechanic_id],
            "content": f"Your today's schedule have been updated, please visit the schedule page learn more about it.",
            "required": False,
        }
        
    except Exception as e:
        print(f"Mechanic schedule update notification failed for schedule id {schedule.schedule_id}")

async def notify_user(user_id: int, msg: str):

    try:

        notification = {
            "send_option": "specified_users",
            "specified_users": [user_id],
            "content": msg,
            "required": False,
        }
        
    except Exception as e:
        print(f"Failed to send notification to user id {user_id}")