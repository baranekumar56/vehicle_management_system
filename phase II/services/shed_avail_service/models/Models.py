import enum
from sqlalchemy import Column, ForeignKeyConstraint, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum, Numeric, Date, ARRAY, ForeignKey

from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column
from dataclasses import dataclass
from custom_db_types.custom_db_classes import AddressType
from datetime import datetime
from enum import Enum

from sqlalchemy import Enum as DBEnum

from sqlalchemy.orm import declarative_base

Base = declarative_base()

class ServiceType(str, Enum):

    service = "service"
    repair = "repair"

class BookingStatus(str, Enum):

    booked = "booked"
    billing = "billing"
    billing_confirmation = "billing_confirmation"
    not_scheduled = "not_scheduled"
    pending = "pending"
    on_going = "on_going"
    halted = "halted"
    cancelled = "cancelled"
    rejected = "rejected"
    completed = "completed"

class PaymentStatus(str, Enum):

    payed = "payed"
    pending = "pending"


class Booking(Base):

   __tablename__ = "booking" 


   booking_id = Column(Integer, primary_key=True)
   user_id = Column(Integer)
   user_vehicle_id = Column(Integer)
   total_amount = Column(Numeric(10, 2))
   total_time = Column(Integer, default=0)
   type = Column(DBEnum(ServiceType, name="service_type"))
   status = Column(DBEnum(BookingStatus, name="booking_status"))
   pickup_required = Column(Boolean, default=False)
   address = Column(AddressType)
   phone_no = Column(String(15), nullable=False)
   estimated_completion_time = Column(DateTime(timezone=True))
   time_of_completion = Column(DateTime(timezone=True))
   payment_status = Column(DBEnum(PaymentStatus, name="payment_status"))
   raw_material_cost = Column(Numeric(precision=10, scale=2))
   repair_description = Column(String)
   estimated_completion_days = Column(Integer, default=1)
   rc_image = Column(String)
   booked_date = Column(DateTime(timezone=True))
   created_at = Column(DateTime(timezone=True))
   cancelled_at = Column(DateTime(timezone=True))

   booked_services = relationship("BookedService", lazy="joined")
   booked_repairs = relationship("BookedRepair", lazy="joined")



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
  
class ShedType(enum.Enum):

    repair = "repair"
    service = "service"

class AvailabilityCache(Base):

   __tablename__ = 'availabilitycache'

   id = Column(Integer, primary_key=True)
   shed_id = Column(Integer)
   day = Column(Date)
   available_hours = Column(ARRAY(Integer))
   version = Column(Integer, default = 0)
   active = Column(Boolean, default=True)
   shed_type = Column(DBEnum(ShedType, name="shed_type"))
  
class Shed(Base):

   __tablename__ = 'shed'

   shed_id = Column(Integer, primary_key=True)
   shed_no = Column(Integer)
   shed_name = Column(String)
   active = Column(Boolean, default=True)


class Users(Base):

    __tablename__ = 'users'

    user_id = Column(Integer, primary_key=True, index=True)
    user_name = Column(String(30), index=True)
    user_email = Column(String(30), unique=True,index=True)
    password = Column(String(255))
    address = Column(AddressType)
    phone = Column(String(15))
    profile_picture = Column(Text, nullable=True)
    id_picture = Column(Text)
    role_id = Column(Integer)
    joined_on = Column(DateTime)
    active = Column(Boolean, default=True)


class Role(Base):

    __tablename__ = 'role'

    role_id = Column(Integer, primary_key=True)
    role_name = Column(String, nullable=False)
    

class VehicleType(Enum):

    two_wheeler = "two_wheeler"
    four_wheeler = "four_wheeler"

class FuelType(Enum):

    petrol = "petrol"
    diesel = "diesel"
    hybrid = "hybrid"
    cng = "cng"
    electric = "electric"



class UserVehicle(Base):

    __tablename__ = 'user_vehicle'

    user_vehicle_id = Column(Integer, primary_key=True, index=True)
    vehicle_no = Column(String(20), index=True)
    user_id = Column(Integer, index=True)
    brand = Column(String(50))
    model = Column(String(50))
    fuel = Column(DBEnum(FuelType, name="fuel_type"))
    vehicle_type = Column(DBEnum(VehicleType, name="vehicle_type"))
    owned = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    rc_image = Column(Text, nullable=True)
    selected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True))



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


class ServiceReminder(Base):

   __tablename__ = 'service_reminder'

   service_reminder_id = Column(Integer, primary_key=True)
   remind_at = Column(Date, index=True)
   user_id = Column(Integer)
   user_vehicle_id = Column(Integer)
   created_at = Column(DateTime(timezone=True))

   __tableargs__ = (
      ForeignKeyConstraint(['user_id'], ['users.user_id']),
      ForeignKeyConstraint(['user_vehicle_id'], ['user_vehicle.user_vehicle_id']),
   )

   user_details = relationship("Users", lazy="joined")
   vehicle_details = relationship("UserVehicle", lazy="joined")


class MechStatus(enum.Enum):

    available = 'available'
    blocked = 'blocked'

class Mechanic(Base):

    __tablename__ = "mechanic"

    id = Column(Integer, primary_key=True)
    mechanic_id = Column(Integer, index=True)
    experience = Column(Integer)
    date_joined = Column(DateTime(timezone=True))
    status = Column(DBEnum(MechStatus, name="mechanic_status"))
