"""
ParkEase AI — Booking Repository
Handles booking CRUD with row-level locking and atomic operations.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, update, func
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timezone

from app.models.booking import Booking
from app.models.slot import ParkingSlot
from app.models.facility import Facility, Floor
from app.models.vehicle import Vehicle
from app.core.enums import BookingStatus, ACTIVE_BOOKING_STATUSES

import logging

logger = logging.getLogger(__name__)


class BookingRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def check_overlap(
        self,
        slot_id: str,
        start_time: datetime,
        end_time: datetime,
        exclude_booking_id: Optional[str] = None,
    ) -> bool:
        """
        Check if any active booking overlaps [start_time, end_time) on this slot.
        Excludes expired PENDING_PAYMENT holds.
        Returns True if overlap exists (slot is NOT available).
        """
        now = datetime.now(timezone.utc)
        active_statuses = [s.value for s in ACTIVE_BOOKING_STATUSES]

        stmt = select(func.count()).where(
            Booking.slot_id == slot_id,
            Booking.status.in_(active_statuses),
            Booking.start_time < end_time,
            Booking.end_time > start_time,
            Booking.deleted_at.is_(None),
        )

        # Exclude expired payment holds
        stmt = stmt.where(
            ~and_(
                Booking.status == BookingStatus.PENDING_PAYMENT.value,
                Booking.payment_expires_at.isnot(None),
                Booking.payment_expires_at < now,
            )
        )

        if exclude_booking_id:
            stmt = stmt.where(Booking.id != exclude_booking_id)

        result = await self.db.execute(stmt)
        count = result.scalar_one()
        return count > 0

    async def create(self, booking: Booking) -> Booking:
        """Insert a new booking record."""
        self.db.add(booking)
        await self.db.flush()
        await self.db.refresh(booking)
        logger.info(f"BookingCreated: id={booking.id} slot={booking.slot_id} user={booking.user_id} status={booking.status}")
        return booking

    async def get_by_id(self, booking_id: str) -> Optional[Booking]:
        """Get a single booking by ID with relationships loaded."""
        stmt = (
            select(Booking)
            .where(Booking.id == booking_id, Booking.deleted_at.is_(None))
            .options(
                selectinload(Booking.slot),
                selectinload(Booking.facility),
                selectinload(Booking.vehicle),
            )
        )
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def get_user_bookings(self, user_id: str) -> List[Booking]:
        """
        Fetch all bookings for a user, eager-loading slot + facility + vehicle.
        Ordered by start_time DESC (most recent first).
        """
        stmt = (
            select(Booking)
            .where(Booking.user_id == user_id, Booking.deleted_at.is_(None))
            .options(
                selectinload(Booking.slot),
                selectinload(Booking.facility),
                selectinload(Booking.vehicle),
            )
            .order_by(Booking.start_time.desc())
        )
        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def confirm_booking(self, booking_id: str) -> Optional[Booking]:
        """Transition PENDING_PAYMENT → CONFIRMED."""
        booking = await self.get_by_id(booking_id)
        if not booking:
            return None
        if booking.status != BookingStatus.PENDING_PAYMENT.value:
            return None

        booking.status = BookingStatus.CONFIRMED.value
        booking.payment_expires_at = None  # No longer relevant
        booking.updated_at = datetime.now(timezone.utc)
        await self.db.flush()
        await self.db.refresh(booking)
        logger.info(f"PaymentConfirmed: id={booking.id} slot={booking.slot_id}")
        return booking

    async def cancel_booking(
        self, booking_id: str, user_id: str, reason: str
    ) -> Optional[Booking]:
        """Cancel a booking. Validates ownership."""
        booking = await self.get_by_id(booking_id)
        if not booking or booking.user_id != user_id:
            return None
        if booking.status in (BookingStatus.COMPLETED.value, BookingStatus.CANCELLED.value):
            return None

        booking.status = BookingStatus.CANCELLED.value
        booking.cancelled_at = datetime.now(timezone.utc)
        booking.cancellation_reason = reason
        booking.updated_by = user_id
        booking.updated_at = datetime.now(timezone.utc)
        await self.db.flush()
        await self.db.refresh(booking)
        logger.info(f"BookingCancelled: id={booking.id} reason={reason}")
        return booking

    async def cleanup_stale(self) -> int:
        """
        Batch cleanup:
        1. Expire PENDING_PAYMENT bookings past their payment_expires_at → CANCELLED
        2. Complete CONFIRMED/ACTIVE bookings past their end_time → COMPLETED
        Run every few hours, not continuously.
        """
        now = datetime.now(timezone.utc)
        count = 0

        # 1. Expired payment holds
        stmt1 = (
            update(Booking)
            .where(
                Booking.status == BookingStatus.PENDING_PAYMENT.value,
                Booking.payment_expires_at.isnot(None),
                Booking.payment_expires_at < now,
                Booking.deleted_at.is_(None),
            )
            .values(
                status=BookingStatus.CANCELLED.value,
                cancelled_at=now,
                cancellation_reason="Payment TTL expired",
                updated_at=now,
            )
        )
        result1 = await self.db.execute(stmt1)
        count += result1.rowcount
        if result1.rowcount > 0:
            logger.info(f"PaymentExpired: {result1.rowcount} bookings cancelled")

        # 2. Past-endtime active bookings → COMPLETED
        active_vals = [BookingStatus.CONFIRMED.value, BookingStatus.ACTIVE.value]
        stmt2 = (
            update(Booking)
            .where(
                Booking.status.in_(active_vals),
                Booking.end_time < now,
                Booking.deleted_at.is_(None),
            )
            .values(status=BookingStatus.COMPLETED.value, updated_at=now)
        )
        result2 = await self.db.execute(stmt2)
        count += result2.rowcount
        if result2.rowcount > 0:
            logger.info(f"BookingsCompleted: {result2.rowcount} bookings auto-completed")

        return count
