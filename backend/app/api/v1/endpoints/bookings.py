"""
ParkEase AI — Booking API Endpoints
Full booking lifecycle: create, confirm, list, get, cancel.

HTTP Status Codes:
    201  Created — booking created successfully
    200  OK — query/action successful
    400  Bad Request — invalid input
    401  Unauthorized — missing/invalid token
    403  Forbidden — user does not own the resource
    404  Not Found — booking/slot not found
    409  Conflict — slot already booked / race condition
    410  Gone — payment TTL expired
    422  Validation Error — schema validation failed
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, ApiResponse
from app.models.user import User
from app.services.booking_service import BookingService
from app.schemas.booking import BookingCreateRequest, BookingCancelRequest

router = APIRouter()


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    summary="Create a new booking",
    description="Reserves a slot as PENDING_PAYMENT with a 5-minute payment window.",
    response_description="Booking created with payment TTL",
)
async def create_booking(
    request: BookingCreateRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    booking = await service.create_booking(current_user.id, request)
    return ApiResponse.created(
        data=booking.model_dump(mode="json"),
        message="Booking created. Complete payment within 5 minutes.",
    )


@router.post(
    "/{booking_id}/confirm",
    summary="Confirm booking after payment",
    description="Transitions PENDING_PAYMENT → CONFIRMED and generates QR gate pass.",
    response_description="Confirmed booking with QR token",
)
async def confirm_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    booking = await service.confirm_after_payment(booking_id, current_user.id)
    return ApiResponse.ok(
        data=booking.model_dump(mode="json"),
        message="Payment confirmed. Your parking slot is reserved!",
    )


@router.get(
    "/my-bookings",
    summary="Get authenticated user's bookings",
    description="Returns bookings categorized as active, past, and cancelled.",
    response_description="Categorized booking lists",
)
async def get_my_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    result = await service.get_my_bookings(current_user.id)
    return ApiResponse.ok(
        data=result.model_dump(mode="json"),
        message="Bookings retrieved",
    )


@router.get(
    "/{booking_id}",
    summary="Get a single booking",
    description="Returns booking details. User must own the booking.",
    response_description="Booking details",
)
async def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    booking = await service.get_booking(booking_id, current_user.id)
    return ApiResponse.ok(
        data=booking.model_dump(mode="json"),
        message="Booking retrieved",
    )


@router.post(
    "/{booking_id}/cancel",
    summary="Cancel a booking",
    description="Cancels the booking with an optional reason.",
    response_description="Cancelled booking",
)
async def cancel_booking(
    booking_id: str,
    body: BookingCancelRequest = BookingCancelRequest(),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    service = BookingService(db)
    booking = await service.cancel_booking(booking_id, current_user.id, body.reason or "User cancelled")
    return ApiResponse.ok(
        data=booking.model_dump(mode="json"),
        message="Booking cancelled",
    )
