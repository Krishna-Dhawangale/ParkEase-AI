from sqlalchemy import Column, String, Float, DateTime, ForeignKey, CheckConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(String, primary_key=True, index=True)  # BK_<uuid4_hex>
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    facility_id = Column(String, ForeignKey("facilities.id", ondelete="CASCADE"), nullable=False, index=True)
    floor_id = Column(String, ForeignKey("floors.id", ondelete="CASCADE"), nullable=True)
    slot_id = Column(String, ForeignKey("parking_slots.id", ondelete="SET NULL"), nullable=True, index=True)

    # Vehicle: FK reference + denormalized plate snapshot for receipts
    vehicle_id = Column(String, ForeignKey("vehicles.id", ondelete="SET NULL"), nullable=True, index=True)
    vehicle_plate_snapshot = Column(String, nullable=False)

    # Time window
    start_time = Column(DateTime(timezone=True), nullable=False)
    end_time = Column(DateTime(timezone=True), nullable=False)

    # Pricing
    total_amount = Column(Float, default=0.0)
    currency = Column(String, default="INR")

    # Lifecycle: PENDING_PAYMENT → CONFIRMED → ACTIVE → COMPLETED / CANCELLED
    status = Column(String, default="PENDING_PAYMENT", index=True)

    # QR gate pass — generated on CONFIRMED, valid until end_time
    qr_code_token = Column(String, nullable=True)  # QR_<uuid4_hex>

    # Payment hold TTL
    payment_expires_at = Column(DateTime(timezone=True), nullable=True)

    # Check-in / Check-out (future extension)
    check_in_time = Column(DateTime(timezone=True), nullable=True)
    check_out_time = Column(DateTime(timezone=True), nullable=True)

    # Cancellation metadata
    cancelled_at = Column(DateTime(timezone=True), nullable=True)
    cancellation_reason = Column(String, nullable=True)

    # Audit trail
    created_by = Column(String, nullable=True)
    updated_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    deleted_at = Column(DateTime(timezone=True), nullable=True)  # Soft delete

    # Table-level constraints
    __table_args__ = (
        CheckConstraint("start_time < end_time", name="chk_booking_time_order"),
        CheckConstraint("total_amount >= 0", name="chk_booking_amount_positive"),
    )

    # Relationships
    user = relationship("User", back_populates="bookings")
    facility = relationship("Facility", back_populates="bookings")
    slot = relationship("ParkingSlot", back_populates="bookings")
    vehicle = relationship("Vehicle", backref="bookings")
    payments = relationship("Payment", back_populates="booking", cascade="all, delete-orphan")
