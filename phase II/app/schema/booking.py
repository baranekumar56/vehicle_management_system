from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime
from app.schema.user import Address
"""
This file desrcibes about the structure of a booking object
"""


class ServiceType(str, Enum):

    service = "service"
    repair = "repair"

class BookingStatus(str, Enum):

    booked = "booked"
    billing = "billing"
    billing_confirmation = "billing_confirmation"
    pending = "pending"
    on_going = "on_going"
    halted = "halted"
    cancelled = "cancelled"
    rejected = "rejected"

class PaymentStatus(str, Enum):

    payed = "payed"
    pending = "pending"


class BaseBooking(BaseModel):

    user_id : int
    user_vehicle_id : int
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

    model_config = ConfigDict(from_attributes=True)


    @field_validator('user_id')
    def user_id_validation(cls, user_id: int) -> int : 

        if user_id < 0:
            raise ValueError("User id cannot be negative")

        return user_id
    
    @field_validator('user_vehicle_id')
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