from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.core.security import create_access_token
from app.core.firebase import verify_firebase_id_token
from fastapi import HTTPException, status
from typing import Dict, Any

class AuthService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)

    async def authenticate_firebase_token(self, id_token: str, default_role: str = "CUSTOMER") -> Dict[str, Any]:
        # Step 1: Verify token via Firebase Admin or fallback
        decoded = verify_firebase_id_token(id_token)
        if not decoded:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired Firebase ID token",
            )
        
        uid = decoded.get("uid")
        email = decoded.get("email") or f"{uid}@parkease.ai"

        # Step 2: Check if user exists in PostgreSQL
        user = await self.user_repo.get_by_id(uid)
        if not user:
            role = default_role
            if email == "admin@parkease.ai":
                role = "SUPER_ADMIN"

            user = User(
                id=uid,
                email=email,
                role=role,
                first_name=decoded.get("name", "User").split(" ")[0],
                last_name=" ".join(decoded.get("name", "").split(" ")[1:]),
                is_email_verified=decoded.get("email_verified", False),
                account_status="ACTIVE",
            )
            user = await self.user_repo.create(user)

        # Step 3: Issue custom ParkEase JWT token
        token = create_access_token(
            subject=user.id,
            claims={"email": user.email, "role": user.role, "tenant_id": user.tenant_id}
        )

        user_dict = {
            "id": user.id,
            "uid": user.id,
            "email": user.email,
            "role": user.role,
            "firstName": user.first_name or "",
            "lastName": user.last_name or "",
            "tenantId": user.tenant_id,
            "isEmailVerified": user.is_email_verified,
            "accountStatus": user.account_status,
            "createdAt": user.created_at.isoformat() if user.created_at else "",
        }

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": user_dict,
        }
