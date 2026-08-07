from pydantic import BaseModel
from typing import Optional, Any, Dict
from datetime import datetime

class TenantBase(BaseModel):
    name: str
    slug: str
    status: str = "ACTIVE"
    plan: str = "BASIC"
    type: Optional[str] = None
    contact_person: Optional[str] = None
    contact_email: str
    contact_phone: str
    address_json: Optional[Dict[str, Any]] = None
    gst_number: Optional[str] = None
    website: Optional[str] = None
    is_onboarded: bool = False

class TenantCreate(TenantBase):
    id: str

class TenantResponse(TenantBase):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
