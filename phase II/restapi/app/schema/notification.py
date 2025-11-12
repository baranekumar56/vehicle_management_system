


from enum import Enum
from pydantic import BaseModel, ConfigDict, Field, RootModel
from typing import Optional, List
from datetime import datetime

class SendOption(str, Enum):
    allusers = "allusers"
    allcustomers = "allcustomers"
    allmechanics = "allmechanics"
    specifiedusers = "specifiedusers"

class LiveNotification(BaseModel):
    user_id: int
    content: str
    created_at: datetime 
    read: bool

    model_config = ConfigDict(from_attributes=True)

class SystemNotificationCreate(BaseModel):
    send_option: SendOption
    specified_users: Optional[List[int]] = None
    content: str
    created_at: datetime = Field(default_factory=datetime.now)
    required: bool = True

    model_config = ConfigDict(from_attributes=True)

