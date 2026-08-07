from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from typing import List, Optional
from app.models.tenant import Tenant

class TenantRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_tenants(self) -> List[Tenant]:
        stmt = select(Tenant)
        result = await self.db.execute(stmt)
        return result.scalars().all()

    async def get_by_id(self, tenant_id: str) -> Optional[Tenant]:
        stmt = select(Tenant).where(Tenant.id == tenant_id)
        result = await self.db.execute(stmt)
        return result.scalars().first()

    async def create_tenant(self, tenant: Tenant) -> Tenant:
        self.db.add(tenant)
        await self.db.flush()
        await self.db.refresh(tenant)
        return tenant

    async def delete_tenant(self, tenant_id: str) -> bool:
        tenant = await self.get_by_id(tenant_id)
        if tenant:
            await self.db.delete(tenant)
            await self.db.flush()
            return True
        return False
