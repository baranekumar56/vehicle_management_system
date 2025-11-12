
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):

    name : str
    quantity : int
    price : float
    date_added : datetime = Field(default_factory=datetime.now)
    date_modified : datetime | None = None

class Product(ProductCreate):

    inventory_id : int


class RequirementUpdate(BaseModel):

    inventory_id : int
    quantity : int
    booking_id: int
    
    
class NeededItemCreate(BaseModel):

    booking_id : int
    item_name : str
    quantity : int
    price : float

class NeededItem(NeededItemCreate):

    needed_item_id : int

