
from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Text, Enum
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column
from dataclasses import dataclass
from app.custom_db_types.custom_db_classes import AddressType
from app.models.services_vehicles.Vehicle import VehicleType, FuelType

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
    role_id = Column(Integer )
    joined_on = Column(DateTime)
    active = Column(Boolean, default=True)


class UserVehicle(Base):

    __tablename__ = 'user_vehicles'

    user_vehicle_id = Column(Integer, primary_key=True, index=True)
    vehicle_no = Column(String(20), index=True)
    user_id = Column(Integer, index=True)
    brand = Column(String(50))
    model = Column(String(50))
    fuel = Column(Enum(FuelType, name="fuel_type"))
    vehicle_type = Column(Enum(VehicleType, name="vehicle_type"))
    owned = Column(Boolean, default=False)
    is_deleted = Column(Boolean, default=False)
    rc_image = Column(Text, nullable=True)
    selected = Column(Boolean, default=False)



    
