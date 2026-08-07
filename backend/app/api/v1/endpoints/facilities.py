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

@router.post("/", response_model=FacilityResponse)
async def create_facility(facility_in: dict, db: AsyncSession = Depends(get_db)):
    from app.models.facility import Facility
    import uuid
    import datetime

    repo = FacilityRepository(db)
    
    with open("create_facility_payload.log", "a") as f:
        import json
        f.write(json.dumps(facility_in) + "\n")

    # We accept a dict here for simplicity, in a real app we'd use FacilityCreate schema
    fac_id = facility_in.get("id", str(uuid.uuid4()))
    tenant_id = facility_in.get("tenantId")
    if not tenant_id:
        raise HTTPException(status_code=400, detail="tenantId is required")

    facility = Facility(
        id=fac_id,
        tenant_id=tenant_id,
        name=facility_in.get("name"),
        description=facility_in.get("description"),
        street=facility_in.get("address"),
        city=facility_in.get("city"),
        state=facility_in.get("state"),
        zip_code=facility_in.get("pinCode"),
        latitude=float(facility_in.get("latitude", 0)) if facility_in.get("latitude") else None,
        longitude=float(facility_in.get("longitude", 0)) if facility_in.get("longitude") else None,
        capacity=facility_in.get("totalCapacity", 0),
        status=facility_in.get("status", "DRAFT")
    )
    created = await repo.create_facility(facility)
    await db.commit()
    return created

@router.patch("/{facility_id}", response_model=FacilityResponse)
async def update_facility(facility_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    facility = await repo.get_by_id(facility_id)
    if not facility:
        raise HTTPException(status_code=404, detail="Facility not found")
    
    if "status" in data:
        facility.status = data["status"]
    if "name" in data:
        facility.name = data["name"]
    # We can add more fields as needed

    updated = await repo.update_facility(facility)
    await db.commit()
    return updated

@router.delete("/{facility_id}")
async def delete_facility(facility_id: str, db: AsyncSession = Depends(get_db)):
    repo = FacilityRepository(db)
    success = await repo.delete_facility(facility_id)
    if not success:
        raise HTTPException(status_code=404, detail="Facility not found")
    await db.commit()
    return {"message": "Facility deleted"}
