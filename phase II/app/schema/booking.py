from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

"""
This file desrcibes about the structure of a booking object
"""

class Address(BaseModel):

    street: str
    area : str
    city : str
    state : str
    pincode : str

    @field_validator('street')
    def street_name_validation(cls, street:str) -> str:

        street = street.strip()

        if len(street) <= 3 or len(street) > 50:
            raise ValueError('Street name should have length between 3 to 50')
        
        return street.lower()
    
    @field_validator('area')
    def area_name_validation(cls, area:str) -> str:

        area = area.strip()

        if len(area) <= 3 or len(area) > 50:
            raise ValueError('area name should have length between 3 to 50')
        
        return area.lower()
    
    @field_validator('city')
    def street_name_validation(cls, city:str) -> str:

        city = city.strip()

        if len(city) <= 3 or len(city) > 50:
            raise ValueError('city name should have length between 3 to 50')
        
        return city.lower()
    
    @field_validator('state')
    def street_name_validation(cls, state:str) -> str:

        state = state.strip()

        if len(state) <= 3 or len(state) > 50:
            raise ValueError('state name should have length between 3 to 50')
        
        return state.lower()
    
    @field_validator('pincode')
    def street_name_validation(cls, pincode:str) -> str:

        pincode = pincode.strip()

        if len(pincode) != 6:
            raise ValueError('pincode length should be 6')
        
        return pincode.lower()


class ServiceType(str, Enum):

    service = "service"
    repair = "repair"

class BookingStatus(str, Enum):

    booked = "booked"
    billing = "billing"
    billing_confirmation = "billing_confirmation"
    on_going = "on_going"
    halted = "halted"
    cancelled = "cancelled"
    rejected = "rejected"

class PaymentStatus(str, Enum):

    payed = "payed"
    pending = "pending"


class BaseBooking(BaseModel):

    user_id : int
    vehicle_id : int
    total_amount : float
    type : ServiceType
    status : BookingStatus
    pickup_required : bool = False
    address : Optional[Address] | None = None
    phone_no : str
    estimated_completion_time : Optional [datetime] | None = None
    time_of_completion : Optional[datetime] | None = None
    payment_status : PaymentStatus
    raw_material_cost : float = Field(..., gt=-1)
    repair_description : str
    estimated_completion_days : int = Field(..., gt=0)
    rc_image : str # it will be a file url

    @field_validator('user_id')
    def user_id_validation(cls, user_id: int) -> int : 

        if user_id < 0:
            raise ValueError("User id cannot be negative")

        return user_id
    
    @field_validator('vehicle_id')
    def vehicle_id_validation(cls, vehicle_id: int) -> int :

        if vehicle_id < 0:
            raise ValueError("Vehicle Id cannot be negative")
        
        return vehicle_id
    
    @field_validator('total_amount')
    def total_amount_validation(cls, total_amount: float) -> float :

        if total_amount < 0:
            raise ValueError("Amount cannot be negative")
        
        return total_amount
    
    @field_validator('phone_no')
    def phone_no_validation(cls, phone_no: str) -> str:

        phone_no = phone_no.strip()

        if len(phone_no) < 9 or len(phone_no) > 15:
            raise ValueError('Length of phone number should be 10 - 15')

        if not phone_no.isnumeric():
            raise ValueError('Phone number should only have digits') 

        return phone_no
    
    @field_validator('repair_description')
    def repair_description_validation(cls, repair_description: str) -> str:

        repair_description = repair_description.strip()

        if len(repair_description) == 0:
            raise ValueError('Repair Description cannot be empty')
        
        if len(repair_description) > 500:
            raise ValueError('Repair description should have less than 500 characters')
        
        return repair_description



class BookingCreate(BaseBooking):

    created_at : datetime
    cancelled_at : Optional[datetime]
    

class Booking(BookingCreate):

    booking_id : int