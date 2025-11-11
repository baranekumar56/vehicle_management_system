from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint, func, CheckConstraint, Boolean, Text, Enum, Numeric
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column


class Package(Base):

    __tablename__ = "package"

    package_id = Column(Integer, primary_key=True)
    package_name = Column(String, nullable=False)
    vehicle_id = Column(Integer)
    total_services = Column(Integer, default=0)
    total_time = Column(Integer, default=0) # tells the total time in minutes required to complete the packaged
    total_price = Column(Numeric(10, 2), default=0.0)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True),nullable=False)
    last_deactivated = Column(DateTime(timezone=True))


class PackageService(Base):

    __tablename__ = "package_service"

    package_service_id = Column(Integer, primary_key=True)
    package_id = Column(Integer)
    vehicle_service_id = Column(Integer)
    
    __table_args__ = (
        UniqueConstraint('package_id', 'vehicle_service_id', name='uix_package_id_vehicle_service_id'),
    )
