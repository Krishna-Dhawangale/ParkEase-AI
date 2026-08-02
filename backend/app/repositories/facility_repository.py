from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.models.facility import Facility, Floor
from app.models.slot import ParkingSlot

class FacilityRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_facilities(self) -> List[Facility]:
        stmt = select(Facility).options(selectinload(Facility.floors).selectinload(Floor.slots))
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, facility_id: str) -> Optional[Facility]:
        stmt = select(Facility).where(Facility.id == facility_id).options(selectinload(Facility.floors).selectinload(Floor.slots))
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create_facility(self, facility: Facility) -> Facility:
        self.db.add(facility)
        await self.db.flush()
        await self.db.refresh(facility)
        return facility
