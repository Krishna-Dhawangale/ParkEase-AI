"""
ParkEase AI — Slot Repository
Handles slot queries including availability computation with booking overlap checks.
"""
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import and_, not_, exists, text
from sqlalchemy.orm import selectinload
from typing import List, Optional, Tuple
from datetime import datetime

from app.models.slot import ParkingSlot
from app.models.booking import Booking
from app.models.facility import Floor
from app.core.enums import ACTIVE_BOOKING_STATUSES, SlotPhysicalStatus


class SlotRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_available_slots(
        self,
        facility_id: str,
        floor_id: Optional[str],
        start_time: datetime,
        end_time: datetime,
        slot_type: Optional[str] = None,
        vehicle_type: Optional[str] = None,
    ) -> List[Tuple[ParkingSlot, bool, str]]:
        """
        Returns all slots for a facility/floor with is_bookable computed:
          slot.status = AVAILABLE
          AND NOT EXISTS (overlapping active/pending booking that hasn't expired)
          AND slot not soft-deleted

        Returns list of (ParkingSlot, is_bookable: bool, floor_name: str).
        """
        # Subquery: does an overlapping active booking exist for this slot?
        active_statuses = [s.value for s in ACTIVE_BOOKING_STATUSES]
        overlap_subq = (
            select(Booking.id)
            .where(
                Booking.slot_id == ParkingSlot.id,
                Booking.status.in_(active_statuses),
                Booking.start_time < end_time,
                Booking.end_time > start_time,
                Booking.deleted_at.is_(None),
                # Exclude expired PENDING_PAYMENT holds
                ~and_(
                    Booking.status == "PENDING_PAYMENT",
                    Booking.payment_expires_at.isnot(None),
                    Booking.payment_expires_at < datetime.now(start_time.tzinfo or None),
                ),
            )
            .correlate(ParkingSlot)
            .exists()
        )

        stmt = (
            select(ParkingSlot, ~overlap_subq, Floor.name)
            .join(Floor, ParkingSlot.floor_id == Floor.id)
            .where(
                ParkingSlot.facility_id == facility_id,
                ParkingSlot.deleted_at.is_(None),
            )
        )

        if floor_id:
            stmt = stmt.where(ParkingSlot.floor_id == floor_id)
        if slot_type:
            stmt = stmt.where(ParkingSlot.type == slot_type)

        stmt = stmt.order_by(ParkingSlot.name)

        result = await self.db.execute(stmt)
        return result.all()

    async def get_slot_by_id(self, slot_id: str) -> Optional[ParkingSlot]:
        """Get a single slot by ID."""
        result = await self.db.execute(
            select(ParkingSlot).where(ParkingSlot.id == slot_id, ParkingSlot.deleted_at.is_(None))
        )
        return result.scalars().first()

    async def get_slot_for_update(self, slot_id: str) -> Optional[ParkingSlot]:
        """
        SELECT ... FOR UPDATE NOWAIT — locks the row for atomic booking transaction.
        Raises OperationalError if another transaction holds the lock.
        """
        result = await self.db.execute(
            select(ParkingSlot)
            .where(ParkingSlot.id == slot_id, ParkingSlot.deleted_at.is_(None))
            .with_for_update(nowait=True)
        )
        return result.scalars().first()

    async def get_slot_with_floor(self, slot_id: str) -> Optional[Tuple[ParkingSlot, str]]:
        """Get slot with its floor name for display."""
        result = await self.db.execute(
            select(ParkingSlot, Floor.name)
            .join(Floor, ParkingSlot.floor_id == Floor.id)
            .where(ParkingSlot.id == slot_id, ParkingSlot.deleted_at.is_(None))
        )
        return result.first()
