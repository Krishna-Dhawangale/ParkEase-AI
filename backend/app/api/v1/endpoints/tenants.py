from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.repositories.tenant_repository import TenantRepository
from app.schemas.tenant import TenantResponse, TenantCreate
from app.models.tenant import Tenant

router = APIRouter()

@router.get("/", response_model=List[TenantResponse])
async def get_tenants(db: AsyncSession = Depends(get_db)):
    repo = TenantRepository(db)
    return await repo.get_all_tenants()

@router.get("/{tenant_id}", response_model=TenantResponse)
async def get_tenant(tenant_id: str, db: AsyncSession = Depends(get_db)):
    repo = TenantRepository(db)
    tenant = await repo.get_by_id(tenant_id)
    if not tenant:
        raise HTTPException(status_code=404, detail="Tenant not found")
    return tenant

@router.post("/", response_model=TenantResponse)
async def create_tenant(tenant_in: TenantCreate, db: AsyncSession = Depends(get_db)):
    repo = TenantRepository(db)
    existing = await repo.get_by_id(tenant_in.id)
    if existing:
        raise HTTPException(status_code=400, detail="Tenant with this ID already exists")
    
    tenant = Tenant(**tenant_in.model_dump())
    created = await repo.create_tenant(tenant)
    await db.commit()
    return created

@router.delete("/{tenant_id}")
async def delete_tenant(tenant_id: str, db: AsyncSession = Depends(get_db)):
    repo = TenantRepository(db)
    success = await repo.delete_tenant(tenant_id)
    if not success:
        raise HTTPException(status_code=404, detail="Tenant not found")
    await db.commit()
    return {"message": "Tenant deleted"}
