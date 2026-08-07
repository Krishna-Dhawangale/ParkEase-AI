import httpx
from fastapi import HTTPException
from app.core.config import settings
from app.models.user import User
from app.repositories.user_repository import UserRepository
from sqlalchemy.ext.asyncio import AsyncSession

class UserService:
    def __init__(self, db: AsyncSession):
        self.user_repo = UserRepository(db)
        
    async def create_client_admin(self, email: str, password: str, first_name: str, last_name: str, tenant_id: str, firebase_uid: str = None) -> User:
        # Check if already exists in postgres
        existing = await self.user_repo.get_by_email(email)
        if existing:
            raise HTTPException(status_code=400, detail="User with this email already exists.")
            
        if not firebase_uid:
            # Call Firebase Identity Toolkit to create the user securely
            if not settings.FIREBASE_API_KEY:
                raise HTTPException(status_code=500, detail="Firebase API Key not configured")
                
            url = f"https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={settings.FIREBASE_API_KEY}"
            payload = {
                "email": email,
                "password": password,
                "returnSecureToken": True
            }
            
            import httpx
            async with httpx.AsyncClient() as client:
                response = await client.post(url, json=payload)
                data = response.json()
                
                if response.status_code != 200:
                    error_msg = data.get("error", {}).get("message", "Failed to create user in Firebase")
                    raise HTTPException(status_code=response.status_code, detail=error_msg)
                    
                firebase_uid = data.get("localId")
            
        # Create user in Postgres
        user = User(
            id=firebase_uid,
            email=email,
            role="CLIENT_ADMIN",
            first_name=first_name,
            last_name=last_name,
            tenant_id=tenant_id,
            requires_password_change=True,
            is_email_verified=False,
            account_status="ACTIVE"
        )
        return await self.user_repo.create(user)
