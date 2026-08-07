import asyncio
import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from app.core.database import engine, Base
from app.models import Tenant, User, Facility, Floor, ParkingSlot, Vehicle, Booking, Payment

async def init_tables():
    print("[INIT] Creating SQLAlchemy models in PostgreSQL...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("[SUCCESS] Tables created successfully.")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(init_tables())
