"""
ParkEase AI — Seed Zudio Parking Facility & Slots in PostgreSQL
Seeds Zudio Parking (fac_1771146316279), Floor B1, 15 slots (Z-01 to Z-15),
and demo User + Vehicle for booking workflow testing.
"""
import sys
import os
import asyncio
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent / "backend"
sys.path.insert(0, str(backend_dir))

from sqlalchemy import text
from app.core.database import AsyncSessionLocal

async def seed_zudio():
    print("🌱 Seeding Zudio Parking into PostgreSQL...")
    async with AsyncSessionLocal() as session:
        # 1. Insert Default Tenant if missing
        await session.execute(text("""
            INSERT INTO tenants (id, name, slug, status, plan, tenant_type, contact_person, contact_email, contact_phone, is_onboarded)
            VALUES (
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                'Zudio Retail',
                'zudio-retail',
                'ACTIVE',
                'ENTERPRISE',
                'RETAIL_MALL',
                'Zudio Store Manager',
                'zudio@parkease.ai',
                '+91-9876543210',
                TRUE
            ) ON CONFLICT (id) DO NOTHING;
        """))

        # 2. Insert Demo Customer User if missing
        await session.execute(text("""
            INSERT INTO users (id, email, role, first_name, last_name, is_email_verified, profile_setup_complete)
            VALUES (
                'demo_customer_001',
                'user@parkease.com',
                'CUSTOMER',
                'Demo',
                'Customer',
                TRUE,
                TRUE
            ) ON CONFLICT (id) DO NOTHING;
        """))

        # 3. Insert Demo Vehicle for user
        await session.execute(text("""
            INSERT INTO vehicles (id, user_id, license_plate, make, model, color, type, is_default)
            VALUES (
                'demo-vehicle-id',
                'demo_customer_001',
                'MH 31 AB 1234',
                'Tata',
                'Nexon EV',
                'Black',
                'SUV',
                TRUE
            ) ON CONFLICT (id) DO NOTHING;
        """))

        # 4. Insert Zudio Parking Facility (matching Firebase ID)
        await session.execute(text("""
            INSERT INTO facilities (id, tenant_id, name, description, city, state, country, capacity, base_price_per_hour, currency, status)
            VALUES (
                'fac_1771146316279',
                'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
                'Zudio Parking',
                'Prime retail store parking with EV charging and real-time Digital Twin telemetry',
                'Nagpur',
                'Maharashtra',
                'India',
                15,
                30.00,
                'INR',
                'LIVE'
            ) ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                capacity = EXCLUDED.capacity,
                base_price_per_hour = EXCLUDED.base_price_per_hour,
                status = EXCLUDED.status;
        """))

        # 5. Insert Floor B1 for Zudio Parking
        await session.execute(text("""
            INSERT INTO floors (id, facility_id, name, level, capacity)
            VALUES (
                'fl_zudio_b1',
                'fac_1771146316279',
                'Basement B1',
                1,
                15
            ) ON CONFLICT (id) DO UPDATE SET
                name = EXCLUDED.name,
                capacity = EXCLUDED.capacity;
        """))

        # 6. Insert 15 Parking Slots (Z-01 to Z-15)
        slots_data = [
            ("slot_zudio_01", "fl_zudio_b1", "fac_1771146316279", "Z-01", "AVAILABLE", "STANDARD", 30.00, 0, 0, 1, 1),
            ("slot_zudio_02", "fl_zudio_b1", "fac_1771146316279", "Z-02", "AVAILABLE", "STANDARD", 30.00, 1, 0, 1, 1),
            ("slot_zudio_03", "fl_zudio_b1", "fac_1771146316279", "Z-03", "AVAILABLE", "STANDARD", 30.00, 2, 0, 1, 1),
            ("slot_zudio_04", "fl_zudio_b1", "fac_1771146316279", "Z-04", "AVAILABLE", "STANDARD", 30.00, 3, 0, 1, 1),
            ("slot_zudio_05", "fl_zudio_b1", "fac_1771146316279", "Z-05", "AVAILABLE", "STANDARD", 30.00, 4, 0, 1, 1),
            ("slot_zudio_06", "fl_zudio_b1", "fac_1771146316279", "Z-06", "AVAILABLE", "STANDARD", 30.00, 0, 1, 1, 1),
            ("slot_zudio_07", "fl_zudio_b1", "fac_1771146316279", "Z-07", "AVAILABLE", "STANDARD", 30.00, 1, 1, 1, 1),
            ("slot_zudio_08", "fl_zudio_b1", "fac_1771146316279", "Z-08", "AVAILABLE", "STANDARD", 30.00, 2, 1, 1, 1),
            ("slot_zudio_09", "fl_zudio_b1", "fac_1771146316279", "Z-09", "AVAILABLE", "STANDARD", 30.00, 3, 1, 1, 1),
            ("slot_zudio_10", "fl_zudio_b1", "fac_1771146316279", "Z-10", "AVAILABLE", "STANDARD", 30.00, 4, 1, 1, 1),
            ("slot_zudio_11", "fl_zudio_b1", "fac_1771146316279", "Z-11", "AVAILABLE", "EV", 45.00, 0, 2, 1, 1),
            ("slot_zudio_12", "fl_zudio_b1", "fac_1771146316279", "Z-12", "AVAILABLE", "EV", 45.00, 1, 2, 1, 1),
            ("slot_zudio_13", "fl_zudio_b1", "fac_1771146316279", "Z-13", "AVAILABLE", "ACCESSIBLE", 30.00, 2, 2, 1, 1),
            ("slot_zudio_14", "fl_zudio_b1", "fac_1771146316279", "Z-14", "AVAILABLE", "COMPACT", 25.00, 3, 2, 1, 1),
            ("slot_zudio_15", "fl_zudio_b1", "fac_1771146316279", "Z-15", "AVAILABLE", "COMPACT", 25.00, 4, 2, 1, 1),
        ]

        for s in slots_data:
            await session.execute(text("""
                INSERT INTO parking_slots (id, floor_id, facility_id, name, status, type, price_per_hour, x, y, w, h)
                VALUES (:id, :floor_id, :facility_id, :name, :status, :type, :price_per_hour, :x, :y, :w, :h)
                ON CONFLICT (id) DO UPDATE SET
                    status = EXCLUDED.status,
                    type = EXCLUDED.type,
                    price_per_hour = EXCLUDED.price_per_hour;
            """), {
                "id": s[0], "floor_id": s[1], "facility_id": s[2], "name": s[3],
                "status": s[4], "type": s[5], "price_per_hour": s[6],
                "x": s[7], "y": s[8], "w": s[9], "h": s[10]
            })

        await session.commit()
        print("✅ Zudio Parking successfully seeded in PostgreSQL!")
        print("   Facility ID: fac_1771146316279")
        print("   Floor: Basement B1 (fl_zudio_b1)")
        print("   Slots: Z-01 to Z-15 (10 Standard, 2 EV, 1 Accessible, 2 Compact)")

if __name__ == "__main__":
    asyncio.run(seed_zudio())
