from pydantic_settings import BaseSettings
from typing import List, Optional
import os
from dotenv import load_dotenv

# Load root .env file
load_dotenv(os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../.env")))

class Settings(BaseSettings):
    PROJECT_NAME: str = "ParkEase AI Backend API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    # Database & Redis
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "postgresql+asyncpg://postgres:ParkEaseAI@localhost:5432/parkease_ai"
    )
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # JWT & Auth
    SECRET_KEY: str = os.getenv("SECRET_KEY", "parkease_super_secret_jwt_key_2026_change_in_prod")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30  # 30 days

    # Firebase Admin SDK & Web SDK
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH", None)
    FIREBASE_PROJECT_ID: Optional[str] = os.getenv("VITE_FIREBASE_PROJECT_ID", "parkease-ai-b2c42")
    FIREBASE_API_KEY: Optional[str] = os.getenv("VITE_FIREBASE_API_KEY", "")

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    class Config:
        case_sensitive = True

settings = Settings()
