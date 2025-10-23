from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from datetime import datetime
"""
This file desrcibes about all the service pydantic models that we gonna use in our project
"""


class BaseService(BaseModel):

    service_name: str = Field(...)
    active : bool = True


    @field_validator('service_name')
    def service_name_validation(cls, service_name: str):

        
        
        service_name = service_name.strip()

        if len(service_name) < 3:
            raise ValueError("Length of service name should be greater than 3")
        
        if len(service_name) > 50:
            raise ValueError("Service name too Long")
        
        for i in service_name:

            if not i.isalpha() and i != ' ':
                raise ValueError("Service name can only contain Letters and space")
            
        return service_name.lower()
        

class ServiceCreate(BaseService):

    created_at: datetime = Field(default=datetime.now())
    last_deactivated : datetime = None

    model_config = ConfigDict(from_attributes=True)

class Service(ServiceCreate):

    id : int = Field(...)


class Services(RootModel[list[Service]]):
    pass