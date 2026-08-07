from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.schemas.user import FirebaseLoginRequest, TokenResponse
from app.services.auth_service import AuthService

router = APIRouter()

@router.post("/firebase-login", response_model=TokenResponse)
async def firebase_login(
    payload: FirebaseLoginRequest,
    db: AsyncSession = Depends(get_db)
):
    service = AuthService(db)
    result = await service.authenticate_firebase_token(
        id_token=payload.id_token, 
        default_role=payload.role or "CUSTOMER",
        tenant_id=payload.tenant_id
    )
    return result
