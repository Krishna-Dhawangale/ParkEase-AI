-- 02_enums.sql
-- Custom PostgreSQL ENUM types for strict type validation and efficient storage

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('CUSTOMER', 'CLIENT_ADMIN', 'SUPER_ADMIN', 'ATTENDANT');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'facility_status') THEN
        CREATE TYPE facility_status AS ENUM ('LIVE', 'MAINTENANCE', 'OFFLINE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'slot_status') THEN
        CREATE TYPE slot_status AS ENUM ('AVAILABLE', 'OCCUPIED', 'RESERVED', 'BLOCKED', 'MAINTENANCE', 'EV_CHARGING');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'slot_type') THEN
        CREATE TYPE slot_type AS ENUM ('STANDARD', 'COMPACT', 'ACCESSIBLE', 'EV', 'MOTORCYCLE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
        CREATE TYPE booking_status AS ENUM ('RESERVED', 'CHECKED_IN', 'COMPLETED', 'CANCELLED', 'EXPIRED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('CREDIT_CARD', 'WALLET', 'UPI', 'CASH', 'RAZORPAY', 'STRIPE');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('SUCCESS', 'PENDING', 'FAILED', 'REFUNDED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'sensor_type') THEN
        CREATE TYPE sensor_type AS ENUM ('ULTRASONIC', 'GEOMAGNETIC', 'CAMERA_ANPR', 'RADAR');
    END IF;
END $$;
