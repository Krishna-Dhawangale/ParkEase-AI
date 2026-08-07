from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserResponse, ClientAdminCreateRequest
from app.api.deps import get_current_user_id, require_role

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    return await repo.get_all_users()

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(user_id: str, data: dict, db: AsyncSession = Depends(get_db)):
    repo = UserRepository(db)
    user = await repo.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # We only allow updating role, tenant_id, and account_status for simplicity
    if "role" in data:
        user.role = data["role"]
    if "tenant_id" in data:
        user.tenant_id = data["tenant_id"]
    if "account_status" in data:
        user.account_status = data["account_status"]
    
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/client-admin")
async def create_client_admin(
    payload: ClientAdminCreateRequest,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(require_role("SUPER_ADMIN"))
):
    from app.services.user_service import UserService
    service = UserService(db)
    
    import secrets
    import string
    password = payload.password
    if not password:
        password = ''.join(secrets.choice(string.ascii_letters + string.digits) for i in range(10)) + "!2a"
        
    user = await service.create_client_admin(
        email=payload.email,
        password=password,
        first_name=payload.first_name,
        last_name=payload.last_name,
        tenant_id=payload.organization_id,
        firebase_uid=payload.id
    )
    await db.commit()
    
    from app.schemas.user import UserResponse
    user_response = UserResponse.model_validate(user).model_dump()
    return {"user": user_response, "temporary_password": password}

@router.post("/me/password-changed")
async def password_changed(
    uid: str = Depends(get_current_user_id), # Wait, we need get_current_user from dependencies
    db: AsyncSession = Depends(get_db)
):
    repo = UserRepository(db)
    user = await repo.get_by_id(uid)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user.requires_password_change = False
    await db.commit()
    return {"message": "Password changed successfully"}

