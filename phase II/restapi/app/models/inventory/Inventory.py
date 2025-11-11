from sqlalchemy import Column, Integer, String, Float, DateTime, UniqueConstraint, func, CheckConstraint, Boolean, Text, Enum, Numeric
from app.database.database import Base
from sqlalchemy.orm import relationship, relationship, Mapped, mapped_column



class Inventory(Base):

    __tablename__ = "inventory"

    inventory_id = Column(Integer, primary_key=True)
    name = Column(String, index=True, unique=True)
    quantity = Column(Integer)
    price = Column(Numeric(10, 2))
    date_added = Column(DateTime(timezone=True))
    date_modified = Column(DateTime(timezone=True))

class NeededItem(Base):

    __tablename__ = "needed_item"

    needed_item_id = Column(Integer, primary_key=True)
    booking_id = Column(Integer)
    item_name = Column(String)
    quantity = Column(Integer)
    price = Column(Numeric(10, 2))