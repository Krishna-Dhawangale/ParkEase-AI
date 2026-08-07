import asyncio
from app.core.database import engine, Base
import app.models.tenant
import app.models.user
import app.models.facility

async def drop_all():
    print("Dropping all tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
    print("Tables dropped.")

if __name__ == "__main__":
    asyncio.run(drop_all())
