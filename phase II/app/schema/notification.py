from enum import Enum
from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

class NotificationCreate(BaseModel):

    to_user_id : int = Field(..., ge=0)
    from_user_id : int = Field(..., ge=0)
    msg_content : str = Field(..., max_length=500)
    created_at : datetime = Field(default_factory=datetime.now)
    model_config = ConfigDict(from_attributes=True)


class Notification(NotificationCreate):

    notification_id : int = Field(..., ge=0)
    read : bool = False
    