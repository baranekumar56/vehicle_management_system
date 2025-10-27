from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from datetime import datetime

from app.schema.vehicle import FuelType, VehicleType


class BaseUserVehicle(BaseModel):

    vehicle_no : str
    user_id : int
    brand : str
    model : str
    fuel : FuelType
    vehicle_type : VehicleType
    owned : bool = True
    is_deleted : bool = False
    rc_image : str
    selected : bool = False # auto fill option

class UserVehicleCreate(BaseUserVehicle):

    created_at : datetime = Field(default_factory=datetime.now)

class UserVehicle(UserVehicleCreate):

    user_vehicle_id : int