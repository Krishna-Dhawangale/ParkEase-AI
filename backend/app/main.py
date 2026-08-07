from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.core.config import settings
from app.core.database import engine, Base, AsyncSessionLocal
from app.api.v1.endpoints import auth, facilities, ws, bookings, slots
from app.repositories.booking_repository import BookingRepository

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Create tables if they do not exist
    # NOTE: For production, replace create_all() with Alembic migrations.
    #       Alembic is already in requirements.txt. Run:
    #         alembic init alembic
    #         alembic revision --autogenerate -m "initial"
    #         alembic upgrade head
    logger.info("Initializing PostgreSQL database tables...")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logger.info("Database tables initialized successfully.")

    # Startup cleanup: expire stale PENDING_PAYMENT holds and auto-complete past bookings
    try:
        async with AsyncSessionLocal() as db:
            repo = BookingRepository(db)
            cleaned = await repo.cleanup_stale()
            await db.commit()
            if cleaned > 0:
                logger.info(f"Startup cleanup: {cleaned} stale bookings processed")
    except Exception as e:
        logger.warning(f"Startup cleanup skipped: {e}")

    yield

    # Shutdown
    logger.info("Shutting down database engine...")
    await engine.dispose()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(facilities.router, prefix=f"{settings.API_V1_STR}/facilities", tags=["Facilities"])
app.include_router(bookings.router, prefix=f"{settings.API_V1_STR}/bookings", tags=["Bookings"])
app.include_router(slots.router, prefix=f"{settings.API_V1_STR}/slots", tags=["Slots"])
app.include_router(ws.router, tags=["WebSockets"])

@app.get("/health", tags=["Health Check"])
async def health_check():
    return {"status": "healthy", "project": settings.PROJECT_NAME, "version": settings.VERSION}
