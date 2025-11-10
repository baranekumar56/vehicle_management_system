
from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean, Enum, Numeric
from sqlalchemy.ext.declarative import declarative_base
from app.database.database import Base
from sqlalchemy.orm import relationship
import enum

class VehicleType(enum.Enum):

    two_wheeler = "two_wheeler"
    four_wheeler = "four_wheeler"

class FuelType(enum.Enum):

    petrol = "petrol"
    diesel = "diesel"
    hybrid = "hybrid"
    cng = "cng"
    electric = "electric"

class Vehicle(Base):

    __tablename__ = "vehicle"

    vehicle_id = Column(Integer, primary_key=True)
    brand = Column(String(50), index=True)
    model = Column(String(50))
    fuel = Column(Enum(FuelType, name="fuel_type"))
    vehicle_type = Column(Enum(VehicleType, name="vehicle_type"))
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True))
    last_deactivated = Column(DateTime(timezone=True), nullable=True)
    
class VehicleService(Base):

    __tablename__ = "vehicle_service"

    vehicle_service_id = Column(Integer, primary_key=True)
    service_id = Column(Integer)
    vehicle_id = Column(Integer)
    price = Column(Numeric(precision=10, scale=2))
    time_to_complete = Column(Integer) # mostly this wwould be an int minutes
    last_deactivated = Column(DateTime(timezone=True), nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True))
