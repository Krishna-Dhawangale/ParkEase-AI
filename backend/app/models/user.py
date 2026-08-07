from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.core.database import Base

from sqlalchemy.dialects.postgresql import ENUM, UUID

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True) # Firebase UID
    email = Column(String, unique=True, index=True, nullable=False)
    role = Column(ENUM('CUSTOMER', 'CLIENT_ADMIN', 'SUPER_ADMIN', 'ATTENDANT', name='user_role'), nullable=False, default="CUSTOMER")
    sub_role = Column(String, nullable=True)
    permissions_json = Column(JSON, nullable=True)
    first_name = Column(String, nullable=True)
    last_name = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)
    is_email_verified = Column(Boolean, default=False)
    tenant_id = Column(String, ForeignKey("tenants.id", ondelete="SET NULL"), nullable=True, index=True)
    requires_password_change = Column(Boolean, default=False)
    profile_setup_complete = Column(Boolean, default=False)
    account_status = Column(String, default="ACTIVE")
    onboarding_status = Column(String, default="ACCOUNT_CREATED")
    phone = Column(String, nullable=True)
    city = Column(String, nullable=True)
    contact_email = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    tenant = relationship("Tenant", back_populates="users")
    bookings = relationship("Booking", back_populates="user", cascade="all, delete-orphan")
    vehicles = relationship("Vehicle", back_populates="user", cascade="all, delete-orphan")
