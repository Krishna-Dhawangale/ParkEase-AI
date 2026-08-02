from pydantic import BaseModel, EmailStr
from typing import Optional, List

class UserBase(BaseModel):
    email: EmailStr
    role: str = "CUSTOMER"
    sub_role: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    profile_image: Optional[str] = None
    phone: Optional[str] = None
    city: Optional[str] = None
    tenant_id: Optional[str] = None

class FirebaseLoginRequest(BaseModel):
    id_token: str
    role: Optional[str] = None

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(UserBase):
    id: str
    is_email_verified: bool = False
    requires_password_change: bool = False
    profile_setup_complete: bool = False
    account_status: str = "ACTIVE"
    onboarding_status: str = "ACCOUNT_CREATED"
    permissions: Optional[List[str]] = []

    class Config:
        from_attributes = True
