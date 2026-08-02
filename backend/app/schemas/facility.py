from pydantic import BaseModel
from typing import Optional, List, Any, Dict

class SlotSchema(BaseModel):
    id: str
    name: str
    status: str = "AVAILABLE"
    type: str = "STANDARD"
    price_per_hour: Optional[float] = None
    x: int = 0
    y: int = 0
    w: int = 1
    h: int = 1

    class Config:
        from_attributes = True

class FloorSchema(BaseModel):
    id: str
    facility_id: str
    name: str
    level: int = 1
    capacity: int = 0
    layout_json: Optional[Dict[str, Any]] = None
    slots: Optional[List[SlotSchema]] = []

    class Config:
        from_attributes = True

class FacilityBase(BaseModel):
    name: str
    description: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    capacity: int = 0
    base_price_per_hour: float = 10.0
    currency: str = "USD"
    status: str = "LIVE"
    is_active: bool = True

class FacilityCreate(FacilityBase):
    tenant_id: str

class FacilityResponse(FacilityBase):
    id: str
    tenant_id: str
    floors: Optional[List[FloorSchema]] = []

    class Config:
        from_attributes = True
