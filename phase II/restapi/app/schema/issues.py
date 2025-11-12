

from enum import Enum
from pydantic import BaseModel, EmailStr, field_validator, ConfigDict, model_validator,RootModel,Field
from fastapi import HTTPException
from typing import Optional
from datetime import datetime


class IssueStatus(Enum):

    opened  = "opened"
    resolved = "resolved"
    pending = "pending"
    ongoing = "ongoing"

class IssueCreate(BaseModel):

    email : EmailStr
    name : str
    description : str
    status : IssueStatus = Field(IssueStatus.opened)
    created_at : datetime = Field(default_factory=datetime.now)

class Issue(IssueCreate):

    issue_id : int

class IssueMessageCreate(BaseModel):

    issue_id : int
    from_id : int
    to_id : int
    content : str
    created_at : datetime = Field(default_factory=datetime.now)

class IssueMessage(IssueMessageCreate):

    issue_message_id : int