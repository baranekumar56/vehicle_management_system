from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

"""
This file desrcibes about all the repair assigned for a vehicle
"""

class BaseBookedRepair(BaseModel):

    booking_id : int
    repair_name : str
    price : float
    status : bool = False
    cancelled_by_admin : bool = False
    cancelled_by_user : bool = False
    removable : bool = True

    model_config = ConfigDict(from_attributes=True)


    @field_validator('booking_id')
    def booking_id_validation(cls, booking_id: int) -> int:

        if booking_id < 0: 
            raise ValueError('Booking id cannot be negative')
        
        return booking_id
    
    
    @field_validator('price')
    def price_validation(cls, price: float) -> float:

        if price < 0: 
            raise ValueError('Price cannot be negative')
        
        return price
    
    @field_validator('repair_name')
    def repair_name_validation(cls, repair_name: str) -> str:

        repair_name = repair_name.strip()

        if len(repair_name) < 3:
            raise ValueError('Repair Name too short')
        
        if len(repair_name) > 50:
            raise ValueError('Repair name should be less than 50')
        
        return repair_name

    

class BookedRepairCreate(BaseBookedRepair):

    created_at : datetime = Field(..., default_factory=datetime.now)


class BookedRepair(BookedRepairCreate):

    booked_repair_id : int = Field(..., gt=-1)
