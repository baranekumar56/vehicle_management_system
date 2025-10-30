from sqlalchemy import Column, Integer, String, Float, DateTime, func, CheckConstraint, Boolean
from sqlalchemy.ext.declarative import declarative_base
from app.database.database import Base
from sqlalchemy.orm import relationship

class Service(Base):


    __tablename__ = "service"

    service_id = Column(Integer, primary_key=True, index=True)
    service_name = Column(String(50), nullable=False,unique=True, index=True)
    created_at = Column(DateTime(timezone=True)) 
    last_deactivated = Column(DateTime(timezone=True), nullable=True)
    active = Column(Boolean,default=True)





