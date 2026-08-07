"""
ParkEase AI — Slot Pydantic Schemas
Request/response models for the Slot availability API.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class SlotAvailabilityQuery(BaseModel):
    """Query parameters for slot availability search."""
    facility_id: str
    floor_id: Optional[str] = None
    start_time: datetime               # ISO 8601 UTC
    end_time: datetime                 # ISO 8601 UTC
    slot_type: Optional[str] = None    # STANDARD, EV, ACCESSIBLE, COMPACT, MOTORCYCLE
    vehicle_type: Optional[str] = None # CAR, SUV, MOTORCYCLE, TRUCK


class SlotWithAvailability(BaseModel):
    """Slot data with computed is_bookable flag."""
    id: str
    name: str
    type: str
    status: str                        # Physical: AVAILABLE or MAINTENANCE
    price_per_hour: Optional[float] = None
    x: int = 0
    y: int = 0
    w: int = 1
    h: int = 1
    floor_id: str
    floor_name: str
    is_bookable: bool                  # Computed: AVAILABLE AND no overlapping active booking

    class Config:
        from_attributes = True


class DigitalTwinState(BaseModel):
    """Initial Digital Twin state — returned via REST GET."""
    slot_id: str
    slot_name: str
    floor_name: str
    status: str
    sensor_status: str                 # ONLINE / OFFLINE
    occupancy_detected: bool
    battery_level: int
    last_updated: datetime
    booking_end_time: Optional[datetime] = None  # Frontend computes countdown
    vehicle_plate: Optional[str] = None
