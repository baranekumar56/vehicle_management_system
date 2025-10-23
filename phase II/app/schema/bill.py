from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

"""
This file desrcibes about all the bills model used in the app
"""

class BaseBill(BaseModel):

    booking_id : int = Field(..., ge=0)
    forwarded_at : datetime = Field(default=datetime.now())
    forwarded_mechanic_id : int = Field(..., ge=0)
    status : bool = True

class BillCreate(BaseBill):

    forwarded_at : datetime = Field(default_factory=datetime.now)

class Bill(BillCreate):
    
    id : int = Field(..., ge=0)



