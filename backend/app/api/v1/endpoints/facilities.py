from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.repositories.facility_repository import FacilityRepository
from app.schemas.facility import FacilityResponse

router = APIRouter()

@router.get("/", response_model=List[FacilityResponse])
async def get_facilities(db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    facilities = await repo.get_all_facilities()
    return facilities

@router.get("/{facility_id}", response_model=FacilityResponse)
async def get_facility(facility_id: str, db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    facility = await repo.get_by_id(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    return facility
