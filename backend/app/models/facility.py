from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Facility(Base):
    __tablename__ = "facilities"

    id = Column(String, primary_key=True, index=True)
    tenant_id = Column(String, ForeignKey("tenants.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    description = Column(String, nullable=True)
    address_json = Column(JSON, nullable=True)
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    state = Column(String, nullable=True)
    zip_code = Column(String, nullable=True)
    country = Column(String, nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    capacity = Column(Integer, default=0)
    base_price_per_hour = Column(Float, default=10.0)
    currency = Column(String, default="USD")
    status = Column(String, default="LIVE")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    tenant = relationship("Tenant", back_populates="facilities")
    floors = relationship("Floor", back_populates="facility", cascade="all, delete-orphan")
    slots = relationship("ParkingSlot", back_populates="facility", cascade="all, delete-orphan")
    bookings = relationship("Booking", back_populates="facility", cascade="all, delete-orphan")


class Floor(Base):
    __tablename__ = "floors"

    id = Column(String, primary_key=True, index=True)
    facility_id = Column(String, ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)
    level = Column(Integer, default=1)
    layout_json = Column(JSON, nullable=True)
    capacity = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    facility = relationship("Facility", back_populates="floors")
    slots = relationship("ParkingSlot", back_populates="floor", cascade="all, delete-orphan")
