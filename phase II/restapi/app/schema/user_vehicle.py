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
    owned : bool = False
    is_deleted : bool = False
    rc_image : str
    selected : bool = False # auto fill option

    model_config = ConfigDict(from_attributes=True)


    @field_validator('vehicle_no')
    def vehicle_no_validation(cls, vehicle_no: str) -> str:

        # strip all the white spaces 
        vehicle_no  = vehicle_no.strip()

        # there are two formats
        """
        Format example: YY BH XXXX AA where:

        YY = year of first registration, e.g., “21” for 2021. 

        “BH” stands for Bharat (India) series.

        XXXX = four digits (random / sequential)

        AA = two-letter suffix.

        Current format => SS RR LL NNNN

        SS => state
        RR => regional transport office code
        LL => some random letter of length one or two or three
        NNNN => number

        """


        # convert all alphabets to capital  
        t = []
        for ind in range(0, len(vehicle_no)):

            if vehicle_no[ind].isalpha():
                t.append( vehicle_no[ind].upper())
            else :
                t.append(vehicle_no[ind])

        return "".join(t)

class UserVehicleCreate(BaseUserVehicle):

    created_at : datetime = Field(default_factory=datetime.now)

class UserVehicle(UserVehicleCreate):

    user_vehicle_id : int