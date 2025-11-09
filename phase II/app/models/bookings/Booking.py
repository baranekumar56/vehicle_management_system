from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, Numeric, Date, ARRAY, ForeignKey
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column
from dataclasses import dataclass
from app.custom_db_types.custom_db_classes import AddressType


from app.schema.booking import BookingStatus, ServiceType, PaymentStatus
from datetime import datetime


class Booking(Base):

   __tablename__ = "booking" 


   booking_id = Column(Integer, primary_key=True)
   user_id = Column(Integer)
   user_vehicle_id = Column(Integer)
   total_amount = Column(Numeric(10, 2))
   type = Column(Enum(ServiceType, name="service_type"))
   status = Column(Enum(BookingStatus, name="booking_status"))
   pickup_required = Column(Boolean, default=False)
   address = Column(AddressType)
   phone_no = Column(String(15), nullable=False)
   estimated_completion_time = Column(DateTime(timezone=True))
   time_of_completion = Column(DateTime(timezone=True))
   payment_status = Column(Enum(PaymentStatus, name="payment_status"))
   raw_material_cost = Column(Numeric(precision=10, scale=2))
   repair_description = Column(String)
   estimated_completion_days = Column(Integer, default=1)
   rc_image = Column(String)
   booked_date = Column(DateTime(timezone=True))
   created_at = Column(DateTime(timezone=True))
   cancelled_at = Column(DateTime(timezone=True))



class BookedService(Base):
   
   __tablename__ = "booked_service"

   booked_service_id = Column(Integer, primary_key=True)
   booking_id = Column(Integer)
   vehicle_service_id = Column(Integer)
   price = Column(Numeric(10, 2), nullable=False)
   time_to_complete = Column(Integer, nullable=False)
   status = Column(Boolean, default=False)
   cancelled_by_admin = Column(Boolean, default=False)
   created_at = Column(DateTime(timezone=True), nullable=False)


class BookedRepair(Base):
   
  __tablename__ = "booked_repair" 

  booked_repair_id = Column(Integer, primary_key=True)
  booking_id = Column(Integer)
  repair_name = Column(String, nullable=False)
  price = Column(Numeric(10, 2), nullable=False)
  cancelled_by_admin = Column(Boolean, default=False)
  status = Column(Boolean, default=False)
  cancelled_by_user = Column(Boolean, default=False)
  removable = Column(Boolean, default=True)
  created_at =  Column(DateTime(timezone=True), nullable=False)
  

class AvailabilityCache(Base):

   __tablename__ = 'availabilitycache'

   id = Column(Integer, primary_key=True)
   shed_id = Column(Integer)
   day = Column(Date)
   available_hours = Column(ARRAY(Integer))
   version = Column(Integer, default = 0)
   active = Column(Boolean, default=True)
  
class Shed(Base):

   __tablename__ = 'shed'

   shed_id = Column(Integer, primary_key=True)
   shed_no = Column(Integer)
   shed_name = Column(String)
   active = Column(Boolean, default=True)


class ServiceReminder(Base):

   __tablename__ = 'service_reminder'

   remind_at = Column(Date, index=True)
   user_id = Column(Integer)
   user_vehicle_id = Column(Integer)
   created_at = Column(DateTime(timezone=True))

   __tableargs__ = (
      ForeignKey(['user_id'], ['users.user_id']),
      ForeignKey(['user_vehicle_id'], ['user_vehicle.user_vehicle_id']),
   )

   user_details = relationship("Users", lazy="joined")
   vehicle_details = relationship("UserVehicle", lazy="joined")



