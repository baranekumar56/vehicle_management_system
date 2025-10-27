from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime
from bson import ObjectId

# class PyObjectId(ObjectId):

#     @classmethod
#     def __get_validators__(cls):
#         yield cls.validate

#     @classmethod
#     def validate(cls, obj):

#         if not ObjectId.is_valid(obj):
#             raise ValueError("Invalid object")
        
#         return ObjectId(obj)
    
#     @classmethod
#     def __modify_schema__(cls, field_schema):
#         field_schema.update(type="string")
        


class MechNoteCreate(BaseModel):

    booking_id : int = Field(..., ge=0)
    mechanic_id : int = Field(..., ge=0)
    note : str = Field(...,max_length=500 )
    created_at : datetime = Field(default_factory=datetime.now)


    @field_validator('note')
    def note_validation(cls, note: str) -> str:
        return note.strip()

class MechNote(MechNoteCreate):

    mechanic_note_id : str = Field(..., alias='_id')

    class Config:
        json_encoders = {ObjectId: str}
        populate_by_name = True



