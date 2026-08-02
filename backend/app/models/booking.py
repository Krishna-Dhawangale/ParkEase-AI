from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    facility_id = Column(String, ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    floor_id = Column(String, ForeignKey("floors.id", ondelete="CASCADE"), nullable=True)
    slot_id = Column(String, ForeignKey("parking_slots.id", ondelete="SET NULL"), nullable=True, index=True)
    vehicle_plate = Column(String, nullable=False)
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)
    total_amount = Column(Float, default=0.0)
    currency = Column(String, default="USD")
    status = Column(String, default="RESERVED", index=True) # RESERVED, CHECKED_IN, COMPLETED, CANCELLED, EXPIRED
    qr_code_token = Column(String, nullable=True)
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    check_out_time = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="bookings")
    facility = relationship("Facility", back_populates="bookings")
    slot = relationship("ParkingSlot", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
