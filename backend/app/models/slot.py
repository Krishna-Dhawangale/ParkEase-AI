from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class ParkingSlot(Base):
    __tablename__ = "parking_slots"

    id = Column(String, primary_key=True, index=True)
    floor_id = Column(String, ForeignKey("floors.id", ondelete="CASCADE"), nullable=False, index=True)
    facility_id = Column(String, ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False) # e.g. 'A1'
    status = Column(String, default="AVAILABLE") # AVAILABLE, OCCUPIED, RESERVED, BLOCKED, MAINTENANCE, EV_CHARGING
    type = Column(String, default="STANDARD") # STANDARD, COMPACT, ACCESSIBLE, EV, MOTORCYCLE
    price_per_hour = Column(Float, nullable=True)
    x = Column(Integer, default=0)
    y = Column(Integer, default=0)
    w = Column(Integer, default=1)
    h = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    floor = relationship("Floor", back_populates="slots")
    facility = relationship("Facility", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")
