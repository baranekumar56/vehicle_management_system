from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

class BasePackage(BaseModel):

    package_name : str
    vehicle_id: int = Field(..., ge=0)
    total_services : int = 0
    total_time : int = 0
    total_price : float = 0.0
    active : bool = True

    model_config = ConfigDict(from_attributes=True)



    @field_validator('package_name')
    def name_validation(cls, name: str) -> str:

        name = name.strip()

        if len(name) == 0 or len(name) > 50:
            raise ValueError("Package name should be between 1 to 50 characters")
        
        name = name.lower()

        for i in name:
            if (i >= 'a' and i <= 'z') or (i >= 'A' and i <= 'Z') or i == ' ':
                continue
            else:
                raise ValueError("Package name should only contain alphabets and spaces")
        
        return name

class PackageCreate(BasePackage):

    created_at : datetime = Field(default_factory=datetime.now)
    last_deactivated : datetime | None = None


class Package(PackageCreate):

    package_id : int = Field(..., ge=0)

class PackageServiceCreate(BaseModel):

    package_id : int = Field(..., ge=0)
    vehicle_service_id : int = Field(..., ge=0)

class PackageService(PackageServiceCreate):

    package_service_id : int = Field(..., ge=0)





    

