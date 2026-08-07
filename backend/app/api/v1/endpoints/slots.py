"""
ParkEase AI — Slot API Endpoints
Slot availability with rich filters + Digital Twin initial REST state.

HTTP Status Codes:
    200  OK — slots/twin data retrieved
    400  Bad Request — invalid filters
    401  Unauthorized — Digital Twin requires auth
    403  Forbidden — no active booking for this slot
    404  Not Found — slot not found
"""
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime
from typing import Optional

from app.core.database import get_db
from app.api.deps import get_current_user, ApiResponse
from app.models.user import User
from app.repositories.slot_repository import SlotRepository
from app.repositories.booking_repository import BookingRepository
from app.services.digital_twin_service import DigitalTwinService
from app.schemas.slot import SlotWithAvailability, DigitalTwinState
from app.core.enums import ACTIVE_BOOKING_STATUSES

router = APIRouter()


@router.get(
    "/available",
    summary="Query available parking slots",
    description="Returns all slots for a facility with is_bookable flag computed from overlap queries. Supports filters: floor_id, slot_type, vehicle_type.",
    response_description="List of slots with availability status",
)
async def get_available_slots(
    facility_id: str = Query(..., description="Facility UUID"),
    floor_id: Optional[str] = Query(None, description="Filter by floor"),
    start_time: datetime = Query(..., description="Booking start (ISO 8601 UTC)"),
    end_time: datetime = Query(..., description="Booking end (ISO 8601 UTC)"),
    slot_type: Optional[str] = Query(None, description="STANDARD, EV, ACCESSIBLE, COMPACT, MOTORCYCLE"),
    vehicle_type: Optional[str] = Query(None, description="CAR, SUV, MOTORCYCLE, TRUCK"),
    db: AsyncSession = Depends(get_db),
):
    if end_time <= start_time:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="end_time must be after start_time",
        )

    repo = SlotRepository(db)
    results = repo.get_available_slots(
        facility_id=facility_id,
        floor_id=floor_id,
        start_time=start_time,
        end_time=end_time,
        slot_type=slot_type,
        vehicle_type=vehicle_type,
    )

    # Handle both coroutine and list returns
    if hasattr(results, '__await__'):
        results = await results

    slots_data = []
    for slot, is_bookable, floor_name in results:
        slots_data.append(
            SlotWithAvailability(
                id=slot.id,
                name=slot.name,
                type=slot.type or "STANDARD",
                status=slot.status or "AVAILABLE",
                price_per_hour=slot.price_per_hour,
                x=slot.x or 0,
                y=slot.y or 0,
                w=slot.w or 1,
                h=slot.h or 1,
                floor_id=slot.floor_id,
                floor_name=floor_name or "",
                is_bookable=bool(is_bookable) and slot.status == "AVAILABLE",
            ).model_dump()
        )

    return ApiResponse.ok(
        data=slots_data,
        message=f"Found {len(slots_data)} slots",
    )


@router.get(
    "/{slot_id}/twin",
    summary="Get Digital Twin initial state",
    description="Returns simulated telemetry for a slot. Requires an active booking on this slot.",
    response_description="Digital Twin state with telemetry data",
)
async def get_slot_twin(
    slot_id: str,
    booking_id: str = Query(..., description="Active booking ID for validation"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Validate booking ownership and active status
    booking_repo = BookingRepository(db)
    booking = await booking_repo.get_by_id(booking_id)

    if not booking or booking.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Booking not found",
        )

    if booking.slot_id != slot_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This booking is not for the requested slot",
        )

    now = datetime.now(booking.end_time.tzinfo) if booking.end_time.tzinfo else datetime.utcnow()
    is_active = (
        booking.status in [s.value for s in ACTIVE_BOOKING_STATUSES]
        and booking.end_time > now
    )

    if not is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Digital Twin is only available for active bookings",
        )

    # Get slot info
    slot_repo = SlotRepository(db)
    slot_info = await slot_repo.get_slot_with_floor(slot_id)
    if not slot_info:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Slot not found",
        )
    slot, floor_name = slot_info

    # Generate telemetry
    twin_service = DigitalTwinService()
    state = await twin_service.get_initial_state(
        slot_id=slot_id,
        slot_name=slot.name,
        floor_name=floor_name,
        booking_end_time=booking.end_time,
        vehicle_plate=booking.vehicle_plate_snapshot,
    )

    return ApiResponse.ok(
        data=state,
        message="Digital Twin state retrieved",
    )
