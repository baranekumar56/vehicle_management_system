from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from datetime import datetime


"""
This file desrcibes about all the vehicle pydantic models that we gonna use in our project, mainly during the service --> vehicle 
binding phase
"""

class FuelType(str, Enum):

    petrol = "petrol"
    cng = "cng"
    diesel = "diesel"
    electric = "electric"
    hybrid = "hybrid"


class VehicleType(str, Enum):

    two_wheeler = "two_wheeler"
    four_wheeler = "four_wheeler"


class BaseVehicle(BaseModel):

    brand : str = Field(...)
    model : str = Field(...)
    fuel : FuelType = Field(...)
    vehicle_type : VehicleType = Field(...)
    active : bool = True

    model_config = ConfigDict(from_attributes=True)

    @field_validator('brand')
    def validation_for_brand_name(cls, brand: str):

        brand = brand.strip()

        if len(brand) < 3:
            raise ValueError("Length of Brand name should be greater than 3")
        
        if len(brand) > 50:
            raise ValueError("Brand name too Long")
        
        for i in brand:

            if not i.isalpha() and i != ' ':
                raise ValueError("Brand name can only contain Letters and space")
            
        return brand.lower()

    @field_validator('model')
    def validation_for_brand_name(cls, model: str):

        model = model.strip()

        if len(model) < 3:
            raise ValueError("Length of Model name should be greater than 3")
        
        if len(model) > 50:
            raise ValueError("Model name too Long")
        
        for i in model:

            if not i.isalnum() and i != ' ':
                raise ValueError("Model Name cannot have special characters")
            
        return model.lower()
    

class VehicleCreate(BaseVehicle):

    created_at: datetime = Field(..., default_factory=datetime.now)
    last_deactivated : datetime | None = None


class Vehicle(VehicleCreate):

    vehicle_id : int = Field(...)

    @field_validator('vehicle_id')
    def vehicle_id_validation(cls, id:int):

        if id < 0:
            raise ValueError("Id cannot be negative")
        
        return id

class Vehicles(RootModel[list[Vehicle]]):
    pass 







