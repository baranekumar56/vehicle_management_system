from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

"""
This file desrcibes about all the services selected for a vehicle
"""

class BaseBookedService(BaseModel):

    booking_id : int
    vehicle_service_id : int
    price : float
    time_to_complete : int
    status : bool = False
    cancelled_by_admin : bool = False

    model_config = ConfigDict(from_attributes=True)


    @field_validator('booking_id')
    def booking_id_validation(cls, booking_id: int) -> int:

        if booking_id < 0: 
            raise ValueError('Booking id cannot be negative')
        
        return booking_id
    
    @field_validator('vehicle_service_id')
    def vehicle_service_id_validation(cls, vehicle_service_id: int) -> int:

        if vehicle_service_id < 0:
            raise ValueError('Vehicle id cannot be negative')
        
        return vehicle_service_id
    
    @field_validator('price')
    def price_validation(cls, price: float) -> float:

        if price < 0: 
            raise ValueError('Price cannot be negative')
        
        return price
    
    @field_validator('time_to_complete')
    def time_to_complete_validation(cls, time_to_complete: int) -> int:

        if time_to_complete < 0:
            raise ValueError('Time to Complete a service cannot be negative')
        
        return time_to_complete
    

class BookedServiceCreate(BaseBookedService):

    created_at : datetime = Field(..., default_factory=datetime.now)


class BookedService(BookedServiceCreate):

    booked_service_id : int = Field(..., gt=-1)
