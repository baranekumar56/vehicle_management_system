from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

class PaymentType(str, Enum):

    payment = "payment"
    refund = "refund"

class BasePayment(BaseModel):

    booking_id: int = Field(..., gt=-1)
    user_id : int = Field(..., gt=-1)
    paid_amount : float = Field(...)
    type : PaymentType = Field(PaymentType.payment)

    model_config = ConfigDict(from_attributes=True)

    

class PaymentCreate(BasePayment):

    payment_time : datetime = Field(default_factory=datetime.now)

class Payment(PaymentCreate):

    payment_id : int = Field(..., ge=0)

    
