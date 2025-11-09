# from enum import Enum
# from pydantic import BaseModel, field_validator, ConfigDict, model_validator,RootModel,Field
# from fastapi import HTTPException
# from typing import Optional
# from datetime import datetime

# class SendOption(str, Enum):

#     allusers = "allusers"
#     allcustomers = "allcustomers"
#     allmechanics = "allmechanics"
#     specifiedusers = "specifiedusers"

# class LiveNotification(BaseModel):
#     user_id : int
#     content : str


# class SystemNotificationCreate(BaseModel):

#     send_option : SendOption = Field(...)
#     specified_users : list[int] | None = Field(None)
#     content : str = Field(...)
#     created_at : datetime = Field(default_factory=datetime.now)
#     required : bool = Field(True) # required flags are set to false by system generated notification , like status update
#     model_config = ConfigDict(from_attributes=True)

# class Notification():

#     notification_id : int = Field(..., ge=0)
#     to_user_id : int = Field(...,ge=0)
#     content : str = Field(...)
#     created_at :datetime = Field(default_factory=datetime.now)
#     read : bool = False
    


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

