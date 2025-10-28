from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, Numeric
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column


class Schedule(Base):

    __tablename__ = "schedules"

    schedule_id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, nullable=False)
    scheduled_from = Column(DateTime(timezone=True), nullable=False)
    scheduled_to = Column(DateTime(timezone=True), nullable=False)
    mechanic_id = Column(Integer, nullable=False)
    under_taken = Column(Boolean, default=False)
    stopped = Column(Boolean, default=False)
    stop_reason = Column(String)