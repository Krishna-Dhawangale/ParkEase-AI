from pydantic_settings import BaseSettings
from typing import List, Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "ParkEase AI Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database & Redis
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:Girish%40123@localhost:5432/parkease_db"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "parkease_super_secret_jwt_key_2026_change_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # Firebase Admin SDK
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH", None)

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # ----- Booking Settings -----
    BOOKING_PAYMENT_TTL_MINUTES: int = int(os.getenv("BOOKING_PAYMENT_TTL_MINUTES", "5"))
    BOOKING_CLEANUP_INTERVAL_HOURS: int = int(os.getenv("BOOKING_CLEANUP_INTERVAL_HOURS", "4"))

    # ----- Digital Twin Settings -----
    TWIN_WS_PUSH_INTERVAL_SECONDS: int = int(os.getenv("TWIN_WS_PUSH_INTERVAL_SECONDS", "5"))
    TWIN_BATTERY_MIN: int = int(os.getenv("TWIN_BATTERY_MIN", "85"))
    TWIN_BATTERY_MAX: int = int(os.getenv("TWIN_BATTERY_MAX", "100"))

    class Config:
        case_sensitive = True

settings = Settings()
