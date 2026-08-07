"""
ParkEase AI — API Dependencies & Response Envelope
Shared across all protected endpoints.
Auto-provisions User record in PostgreSQL on first JWT authentication.
"""
from typing import Any, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel
import logging

from app.core.database import get_db
from app.core.security import decode_access_token
from app.models.user import User

logger = logging.getLogger(__name__)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/firebase-login", auto_error=False)


async def get_current_user(
    token: Optional[str] = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
) -> User:
    """
    Decode ParkEase JWT Bearer token and return the authenticated User.
    If the user exists in JWT but not yet in PostgreSQL, auto-provisions the User record.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    payload = decode_access_token(token)
    if not payload or "sub" not in payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    user_id = payload["sub"]
    email = payload.get("email", f"{user_id}@parkease.com")

    user = await db.get(User, user_id)
    if not user:
        # Auto-provision user record in PostgreSQL for logged-in user
        user = User(
            id=user_id,
            email=email,
            role=payload.get("role", "CUSTOMER"),
            first_name=payload.get("first_name", "User"),
            last_name=payload.get("last_name", ""),
            is_email_verified=True,
            profile_setup_complete=True,
        )
        db.add(user)
        await db.flush()
        logger.info(f"UserAutoProvisioned: id={user_id} email={email}")

    return user


# ---------------------------------------------------------------------------
# Standardized API Response Envelope
# ---------------------------------------------------------------------------

class ApiResponse(BaseModel):
    """
    All endpoints return this envelope:
      { "success": true, "message": "...", "data": { ... } }
    """
    success: bool
    message: str
    data: Any = None

    @staticmethod
    def ok(data: Any = None, message: str = "Success") -> dict:
        return {"success": True, "message": message, "data": data}

    @staticmethod
    def created(data: Any = None, message: str = "Created") -> dict:
        return {"success": True, "message": message, "data": data}

    @staticmethod
    def error(message: str = "Error", data: Any = None) -> dict:
        return {"success": False, "message": message, "data": data}
