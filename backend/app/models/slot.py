from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, CheckConstraint, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class ParkingSlot(Base):
    __tablename__ = "parking_slots"

    id = Column(String, primary_key=True, index=True)
    floor_id = Column(String, ForeignKey("floors.id", ondelete="CASCADE"), nullable=False, index=True)
    facility_id = Column(String, ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String, nullable=False)  # e.g. 'A1', 'EV-03'

    # Physical state ONLY — never set to BOOKED/RESERVED.
    # Booking availability is computed from the bookings table via overlap queries.
    status = Column(String, default="AVAILABLE")  # AVAILABLE, MAINTENANCE

    type = Column(String, default="STANDARD")  # STANDARD, COMPACT, ACCESSIBLE, EV, MOTORCYCLE
    price_per_hour = Column(Float, nullable=True)

    # Grid position for Digital Twin layout
    x = Column(Integer, default=0)
    y = Column(Integer, default=0)
    w = Column(Integer, default=1)
    h = Column(Integer, default=1)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # Soft delete

    # Table-level constraints
    __table_args__ = (
        CheckConstraint("price_per_hour IS NULL OR price_per_hour >= 0", name="chk_slot_price_positive"),
        UniqueConstraint("floor_id", "name", name="uq_slot_name_per_floor"),
    )

    # Relationships
    floor = relationship("Floor", back_populates="slots")
    facility = relationship("Facility", back_populates="slots")
    bookings = relationship("Booking", back_populates="slot")
