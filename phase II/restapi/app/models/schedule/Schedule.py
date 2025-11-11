from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, Numeric, Date
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column


class Schedule(Base):

    __tablename__ = "schedule"

    schedule_id = Column(Integer, primary_key=True)
    booking_id = Column(Integer)
    scheduled_date = Column(Date)
    scheduled_from = Column(DateTime(timezone=True), nullable=False)
    scheduled_to = Column(DateTime(timezone=True), nullable=False)
    mechanic_id = Column(Integer)
    under_taken = Column(Boolean, default=False)
    stopped = Column(Boolean, default=False)
    stop_reason = Column(String)