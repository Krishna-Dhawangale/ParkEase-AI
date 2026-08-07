"""
ParkEase AI — Booking Service
Orchestrates the complete booking lifecycle with structured logging.
"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from uuid import uuid4
import logging

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import OperationalError
from fastapi import HTTPException, status

from app.models.booking import Booking
from app.models.vehicle import Vehicle
from app.models.facility import Facility
from app.repositories.booking_repository import BookingRepository
from app.repositories.slot_repository import SlotRepository
from app.services.pricing_service import PricingService
from app.schemas.booking import (
    BookingCreateRequest,
    BookingResponse,
    MyBookingsResponse,
)
from app.core.enums import BookingStatus, SlotPhysicalStatus, ACTIVE_BOOKING_STATUSES
from app.core.config import settings

logger = logging.getLogger(__name__)


class BookingService:
    def __init__(self, db: AsyncSession):
        self.db = db
        self.booking_repo = BookingRepository(db)
        self.slot_repo = SlotRepository(db)

    async def create_booking(
        self, user_id: str, request: BookingCreateRequest
    ) -> BookingResponse:
        """
        Create a booking as PENDING_PAYMENT with 5-minute TTL.

        Steps:
        1. Validate vehicle belongs to user
        2. Lock slot row (SELECT FOR UPDATE NOWAIT)
        3. Check slot is physically AVAILABLE (not MAINTENANCE)
        4. Check no overlapping active bookings
        5. Calculate total via PricingService
        6. Insert booking with PENDING_PAYMENT + payment_expires_at
        7. Return BookingResponse

        Raises HTTPException(409) on slot conflict or lock contention.
        """
        # 1. Validate or auto-provision vehicle for the user
        vehicle = None
        if request.vehicle_id and request.vehicle_id != "demo-vehicle-id":
            vehicle = await self.db.get(Vehicle, request.vehicle_id)

        if not vehicle or vehicle.user_id != user_id:
            from sqlalchemy import select
            stmt = select(Vehicle).where(Vehicle.user_id == user_id)
            res = await self.db.execute(stmt)
            vehicle = res.scalars().first()

            if not vehicle:
                plate = request.vehicle_id if (request.vehicle_id and request.vehicle_id != "demo-vehicle-id" and not request.vehicle_id.startswith("v-")) else "MH 40 GD 3868"
                vehicle = Vehicle(
                    id=request.vehicle_id if (request.vehicle_id and request.vehicle_id.startswith("v-")) else f"veh_{uuid4().hex[:10]}",
                    user_id=user_id,
                    license_plate=plate,
                    make="Maruti Suzuki",
                    model="Desire",
                    color="White",
                    type="Hatchback",
                    is_default=True,
                    created_at=datetime.now(timezone.utc),
                )
                self.db.add(vehicle)
                await self.db.flush()
                logger.info(f"VehicleAutoProvisioned: id={vehicle.id} user={user_id} plate={vehicle.license_plate}")

        # 2. Lock the slot row
        try:
            slot = await self.slot_repo.get_slot_for_update(request.slot_id)
        except OperationalError:
            # Another transaction holds the lock
            logger.warning(f"OverlapRejected: slot={request.slot_id} user={user_id} reason=lock_contention")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This slot was just taken by another user. Please select a different slot.",
            )

        if not slot:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Slot not found",
            )

        # 3. Check slot physical status
        if slot.status != SlotPhysicalStatus.AVAILABLE.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Slot is under {slot.status} and cannot be booked",
            )

        # 4. Check for overlapping bookings
        has_overlap = await self.booking_repo.check_overlap(
            request.slot_id, request.start_time, request.end_time
        )
        if has_overlap:
            logger.warning(f"OverlapRejected: slot={request.slot_id} user={user_id} reason=time_overlap")
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This slot is already booked for the selected time. Please choose a different slot or time.",
            )

        # 5. Calculate pricing
        facility = await self.db.get(Facility, request.facility_id)
        base_rate = facility.base_price_per_hour if facility else 30.0
        total_amount = PricingService.calculate_amount(
            price_per_hour=slot.price_per_hour,
            start_time=request.start_time,
            end_time=request.end_time,
            base_facility_rate=base_rate,
        )

        # 6. Create booking
        now = datetime.now(timezone.utc)
        booking_id = f"BK_{uuid4().hex}"
        booking = Booking(
            id=booking_id,
            user_id=user_id,
            facility_id=request.facility_id,
            floor_id=request.floor_id,
            slot_id=request.slot_id,
            vehicle_id=vehicle.id,
            vehicle_plate_snapshot=vehicle.license_plate,
            start_time=request.start_time,
            end_time=request.end_time,
            total_amount=total_amount,
            currency=facility.currency if facility else "INR",
            status=BookingStatus.PENDING_PAYMENT.value,
            payment_expires_at=now + timedelta(minutes=settings.BOOKING_PAYMENT_TTL_MINUTES),
            created_by=user_id,
            created_at=now,
            updated_at=now,
        )
        await self.booking_repo.create(booking)
        await self.db.commit()

        # 7. Build response
        return self._build_response(booking, slot_name=slot.name, facility_name=facility.name if facility else "")

    async def confirm_after_payment(
        self, booking_id: str, user_id: str
    ) -> BookingResponse:
        """
        Transition PENDING_PAYMENT → CONFIRMED after mock payment success.
        Generates QR gate pass token.
        """
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking or booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found",
            )

        if booking.status != BookingStatus.PENDING_PAYMENT.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Booking is {booking.status}, cannot confirm payment",
            )

        # Check if payment TTL has expired
        now = datetime.now(timezone.utc)
        if booking.payment_expires_at and booking.payment_expires_at < now:
            booking.status = BookingStatus.CANCELLED.value
            booking.cancelled_at = now
            booking.cancellation_reason = "Payment TTL expired"
            await self.db.commit()
            logger.info(f"PaymentExpired: id={booking_id}")
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Payment window expired. Please create a new booking.",
            )

        # Confirm + generate QR token
        booking.status = BookingStatus.CONFIRMED.value
        booking.qr_code_token = f"QR_{uuid4().hex}"
        booking.payment_expires_at = None
        booking.updated_by = user_id
        booking.updated_at = now
        await self.db.commit()
        await self.db.refresh(booking)
        logger.info(f"PaymentConfirmed: id={booking_id} qr={booking.qr_code_token}")

        slot_name = booking.slot.name if booking.slot else ""
        facility_name = booking.facility.name if booking.facility else ""
        return self._build_response(booking, slot_name=slot_name, facility_name=facility_name)

    async def get_my_bookings(self, user_id: str) -> MyBookingsResponse:
        """
        Fetch all user bookings, categorize into active / past / cancelled.
        is_active computed dynamically: status in active set AND now < end_time.
        """
        bookings = await self.booking_repo.get_user_bookings(user_id)
        now = datetime.now(timezone.utc)

        active = []
        past = []
        cancelled = []

        for b in bookings:
            slot_name = b.slot.name if b.slot else ""
            floor_name = ""
            facility_name = b.facility.name if b.facility else ""

            resp = self._build_response(b, slot_name=slot_name, facility_name=facility_name, floor_name=floor_name)

            if b.status == BookingStatus.CANCELLED.value:
                cancelled.append(resp)
            elif resp.is_active:
                active.append(resp)
            else:
                past.append(resp)

        return MyBookingsResponse(active=active, past=past, cancelled=cancelled)

    async def cancel_booking(
        self, booking_id: str, user_id: str, reason: str
    ) -> BookingResponse:
        """Cancel a booking. Validates ownership and eligibility."""
        booking = await self.booking_repo.cancel_booking(booking_id, user_id, reason)
        if not booking:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found or cannot be cancelled",
            )
        await self.db.commit()

        slot_name = booking.slot.name if booking.slot else ""
        facility_name = booking.facility.name if booking.facility else ""
        return self._build_response(booking, slot_name=slot_name, facility_name=facility_name)

    async def get_booking(self, booking_id: str, user_id: str) -> BookingResponse:
        """Get a single booking by ID. Validates ownership."""
        booking = await self.booking_repo.get_by_id(booking_id)
        if not booking or booking.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Booking not found",
            )
        slot_name = booking.slot.name if booking.slot else ""
        facility_name = booking.facility.name if booking.facility else ""
        return self._build_response(booking, slot_name=slot_name, facility_name=facility_name)

    # ---- Private helpers ----

    def _build_response(
        self,
        booking: Booking,
        slot_name: str = "",
        facility_name: str = "",
        floor_name: str = "",
    ) -> BookingResponse:
        """Build BookingResponse from model with computed is_active."""
        now = datetime.now(timezone.utc)
        is_active = (
            booking.status in [s.value for s in ACTIVE_BOOKING_STATUSES]
            and booking.end_time > now
            # Exclude expired PENDING_PAYMENT
            and not (
                booking.status == BookingStatus.PENDING_PAYMENT.value
                and booking.payment_expires_at
                and booking.payment_expires_at < now
            )
        )

        return BookingResponse(
            id=booking.id,
            facility_id=booking.facility_id,
            facility_name=facility_name,
            floor_id=booking.floor_id,
            floor_name=floor_name,
            slot_id=booking.slot_id,
            slot_name=slot_name,
            vehicle_id=booking.vehicle_id,
            vehicle_plate=booking.vehicle_plate_snapshot,
            start_time=booking.start_time,
            end_time=booking.end_time,
            total_amount=booking.total_amount or 0.0,
            currency=booking.currency or "INR",
            status=booking.status,
            qr_code_token=booking.qr_code_token,
            is_active=is_active,
            payment_expires_at=booking.payment_expires_at,
            created_at=booking.created_at,
        )
