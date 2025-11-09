

class Mechanic:

    mechanic_id:int 
    job_queue: list[list[int]]
    bookings : list[list[int]] # booking id, scheulde id

    def __init__(self, mechanic_id, job_queue, bookings):
        self.mechanic_id = mechanic_id
        self.job_queue = job_queue
        self.bookings = bookings

