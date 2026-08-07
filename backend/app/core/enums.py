"""
ParkEase AI — Domain Enum Types
All status fields use these enums for type-safety at DB and application level.
"""
from enum import Enum


class BookingStatus(str, Enum):
    """Booking lifecycle states (MVP — 5 states)."""
    PENDING_PAYMENT = "PENDING_PAYMENT"
    CONFIRMED = "CONFIRMED"
    ACTIVE = "ACTIVE"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

    # Future lifecycle extensions (not implemented in MVP):
    # CHECKED_IN = "CHECKED_IN"
    # CHECKED_OUT = "CHECKED_OUT"


class SlotPhysicalStatus(str, Enum):
    """Physical readiness of a parking slot — NOT booking state."""
    AVAILABLE = "AVAILABLE"
    MAINTENANCE = "MAINTENANCE"


class SlotType(str, Enum):
    """Type/category of a parking slot."""
    STANDARD = "STANDARD"
    COMPACT = "COMPACT"
    ACCESSIBLE = "ACCESSIBLE"
    EV = "EV"
    MOTORCYCLE = "MOTORCYCLE"


class VehicleType(str, Enum):
    """Type of vehicle."""
    CAR = "CAR"
    SUV = "SUV"
    MOTORCYCLE = "MOTORCYCLE"
    TRUCK = "TRUCK"


class PaymentMethod(str, Enum):
    """Payment method for booking transactions."""
    CREDIT_CARD = "CREDIT_CARD"
    WALLET = "WALLET"
    UPI = "UPI"
    CASH = "CASH"
    RAZORPAY = "RAZORPAY"
    STRIPE = "STRIPE"


class PaymentStatus(str, Enum):
    """Payment transaction status."""
    SUCCESS = "SUCCESS"
    PENDING = "PENDING"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class FacilityStatus(str, Enum):
    """Facility operational status."""
    LIVE = "LIVE"
    MAINTENANCE = "MAINTENANCE"
    OFFLINE = "OFFLINE"


# ----- Active booking statuses used in overlap queries -----
ACTIVE_BOOKING_STATUSES = (
    BookingStatus.PENDING_PAYMENT,
    BookingStatus.CONFIRMED,
    BookingStatus.ACTIVE,
)
