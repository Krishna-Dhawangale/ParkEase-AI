"""
ParkEase AI — Booking Pydantic Schemas
Request/response models for the Booking API.
"""
from pydantic import BaseModel, field_validator
from typing import Optional, List
from datetime import datetime


class BookingCreateRequest(BaseModel):
    """Create a new booking (→ PENDING_PAYMENT)."""
    facility_id: str
    floor_id: str
    slot_id: str
    vehicle_id: str                # FK to vehicles table
    start_time: datetime           # ISO 8601 UTC
    end_time: datetime             # ISO 8601 UTC

    @field_validator("end_time")
    @classmethod
    def end_after_start(cls, v, info):
        start = info.data.get("start_time")
        if start and v <= start:
            raise ValueError("end_time must be after start_time")
        return v


class BookingCancelRequest(BaseModel):
    """Cancel a booking with a reason."""
    reason: Optional[str] = "User cancelled"


class BookingResponse(BaseModel):
    """Single booking — returned in all booking endpoints."""
    id: str
    facility_id: str
    facility_name: str
    floor_id: Optional[str] = None
    floor_name: Optional[str] = None
    slot_id: Optional[str] = None
    slot_name: Optional[str] = None
    vehicle_id: Optional[str] = None
    vehicle_plate: str
    start_time: datetime           # UTC — frontend computes countdown
    end_time: datetime             # UTC — frontend computes countdown
    total_amount: float
    currency: str
    status: str
    qr_code_token: Optional[str] = None
    is_active: bool                # Computed: status in active set AND now < end_time
    payment_expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class MyBookingsResponse(BaseModel):
    """Categorized booking lists for My Bookings page."""
    active: List[BookingResponse] = []
    past: List[BookingResponse] = []
    cancelled: List[BookingResponse] = []
