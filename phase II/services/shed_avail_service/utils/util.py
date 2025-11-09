

from datetime import datetime, time, timedelta, date

def calculate_schedule_window(booking):
        from_time = booking.booked_date.time() # now add this with the estimated completion time
        to_time = booking.estimated_completion_time.time()

        # round it off to nnearest hour

        to_time = to_time + timedelta(hours=1)

        to_time = to_time.replace(minute=0, second=0,microsecond=0)

        return from_time, to_time
