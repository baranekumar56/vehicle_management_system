
from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, Numeric
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column

from app.schema.payment import PaymentType

class Payment(Base):

    __tablename__ = "payments"

    payment_id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, nullable=False, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    paid_amount = Column(Numeric(10, 2), nullable=False)
    type = Column(Enum(PaymentType, name="payment_type"))
    payment_time = Column(DateTime(timezone=True))


class Bill(Base):

    __tablename__ = "bills"

    bill_id = Column(Integer, primary_key=True)
    booking_id = Column(Integer, nullable=False)
    forwarded_mechanic_id = Column(Integer, nullable=False)
    forwarded_at = Column(DateTime(timezone=True), nullable=False)
    billed = Column(Boolean, default=False)
