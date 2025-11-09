# from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, ForeignKey
# from app.database.database import Base
# from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column
# from dataclasses import dataclass
# from sqlalchemy.orm import declarative_base

# Base = declarative_base()


# class Notification(Base):

#     __tablename__ = "notification"

#     notification_id = Column(Integer, primary_key=True)
#     to_user_id = Column(Integer)
#     content = Column(String)
#     created_at = Column(DateTime(timezone=True))
#     read = Column(Boolean, default=False)

from sqlalchemy import Column, Integer, String, DateTime, Boolean, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Notification(Base):
    __tablename__ = "notification"
    notification_id = Column(Integer, primary_key=True, index=True)
    to_user_id = Column(Integer, index=True)
    content = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    read = Column(Boolean, default=False)
