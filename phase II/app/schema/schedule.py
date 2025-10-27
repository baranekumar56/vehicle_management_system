from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

class ScheduleCreate(BaseModel):

    booking_id : int = Field(..., ge=0)
    scheduled_from : datetime = Field(...)
    scheduled_to : datetime = Field(...)
    mechanic_id : int = Field(..., ge=0)
    under_taken : bool = False
    stopped : bool = False
    stop_reason : str = Field(..., max_length=100)

class Schedule(ScheduleCreate):

    schedule_id : int = Field(..., ge=0)