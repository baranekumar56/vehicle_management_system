from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
import datetime

"""
This file desrcibes about all the vehicle to service pydantic models that we gonna use in our project
binding phase
"""

class BaseVehicleService(BaseModel):

    service_id : int
    vehicle_id : int
    price : float
    time_to_complete : int
    active : bool = True

    @field_validator('service_id')
    def service_id_validation(cls, service_id: int) -> int :

        if service_id < 0:
            
            raise ValueError("Service id cannot be negative")
        
        return service_id
    
    @field_validator('vehicle_id')
    def vehicle_id_validation(cls, vehicle_id: int) -> int :

        if vehicle_id < 0 :
            raise ValueError("Vehicle id cannot be negative")
            
        return vehicle_id
    
    @field_validator('price')
    def price_validation(cls, price: float) -> float :
        
        if price <= 0:
            raise ValueError("Price cannot be less than or equal to zero")
        
        return price
    
    @field_validator('time_to_complete')
    def time_to_complete_validation(cls, time_to_complete: int) -> int :

        if time_to_complete <= 0:
            raise ValueError("Time to complete a service for a vehicle cannot be negative or zero")
        
        return time_to_complete


class VehicleServiceCreate(BaseVehicleService):

    created_at: datetime = Field(..., default_factory=datetime.datetime.now)
    last_deactivated : datetime = None

class VehicleService(VehicleServiceCreate):

    id : int = Field(...)

    @field_validator('id')
    def vehicle_id_validation(cls, id:int):

        if id < 0:
            raise ValueError("Id cannot be negative")
        
        return id


class VehicleServices(RootModel[VehicleService[list[VehicleService]]]):
    pass
