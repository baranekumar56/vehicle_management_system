from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint, func, CheckConstraint, Boolean, Text, Enum, Numeric
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column

from app.schema.issues import IssueStatus

class Issue(Base):

    __tablename__ = "issue"

    issue_id = Column(Integer, primary_key= True)
    email = Column(String)
    name = Column(String)
    description = Column(String)
    status = Column(Enum(IssueStatus, name="issue_status"))
    created_at = Column(DateTime(timezone=True))

class IssueMessage(Base):

    __tablename__ ="issue_message"

    issue_message_id = Column(Integer, primary_key=True)
    issue_id = Column(Integer, index=True)
    from_id = Column(Integer)
    to_id = Column(Integer)
    content = Column(String)
    created_at = Column(DateTime(timezone=True))