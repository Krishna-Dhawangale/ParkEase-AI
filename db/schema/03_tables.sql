-- 03_tables.sql
-- Table definitions for ParkEase AI v3 Exceptional Production-Grade Schema

-- 1. Tenants (Multi-tenant organizations)
CREATE TABLE IF NOT EXISTS tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'ACTIVE',
    plan VARCHAR(50) DEFAULT 'BASIC',
    tenant_type VARCHAR(50),
    contact_person VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    address_json JSONB,
    gst_number VARCHAR(100),
    website VARCHAR(255),
    is_onboarded BOOLEAN DEFAULT FALSE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 2. Users (User accounts synced with Firebase Auth)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Firebase UID string
    email VARCHAR(255) UNIQUE NOT NULL,
    role user_role NOT NULL DEFAULT 'CUSTOMER',
    sub_role VARCHAR(50),
    permissions_json JSONB,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image VARCHAR(500),
    is_email_verified BOOLEAN DEFAULT FALSE,
    tenant_id UUID,
    requires_password_change BOOLEAN DEFAULT FALSE,
    profile_setup_complete BOOLEAN DEFAULT FALSE,
    account_status VARCHAR(50) DEFAULT 'ACTIVE',
    onboarding_status VARCHAR(50) DEFAULT 'ACCOUNT_CREATED',
    phone VARCHAR(50),
    city VARCHAR(100),
    contact_email VARCHAR(255),
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 3. User Sessions (Active tokens & device fingerprints)
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(500) NOT NULL,
    device_info VARCHAR(255),
    ip_address VARCHAR(45),
    expires_at TIMESTAMPTZ NOT NULL,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Facilities (Parking structures/garages)
CREATE TABLE IF NOT EXISTS facilities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    address_json JSONB,
    street VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    zip_code VARCHAR(20),
    country VARCHAR(100),
    latitude FLOAT8,
    longitude FLOAT8,
    capacity INT DEFAULT 0, -- Cached / computed count of active slots
    base_price_per_hour NUMERIC(10, 2) DEFAULT 10.00,
    currency VARCHAR(10) DEFAULT 'INR',
    status facility_status DEFAULT 'LIVE',
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 5. Floors (Parking levels & digital twin floors)
CREATE TABLE IF NOT EXISTS floors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    level INT DEFAULT 1,
    layout_json JSONB,
    capacity INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 6. Parking Slots (Static parking space layout)
CREATE TABLE IF NOT EXISTS parking_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    floor_id UUID NOT NULL,
    name VARCHAR(50) NOT NULL,
    type slot_type DEFAULT 'STANDARD',
    price_per_hour NUMERIC(10, 2),
    x INT DEFAULT 0,
    y INT DEFAULT 0,
    w INT DEFAULT 1,
    h INT DEFAULT 1,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    deleted_by UUID
);

-- 7. Slot Live Status (Decoupled high-frequency dynamic state to avoid MVCC bloat)
CREATE TABLE IF NOT EXISTS slot_live_status (
    slot_id UUID PRIMARY KEY,
    status slot_status DEFAULT 'AVAILABLE',
    sensor_id UUID,
    battery_level INT,
    last_occupied_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Parking Sensors (IoT Hardware devices)
CREATE TABLE IF NOT EXISTS parking_sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slot_id UUID,
    facility_id UUID NOT NULL,
    device_eui VARCHAR(100) UNIQUE NOT NULL,
    sensor_type sensor_type DEFAULT 'ULTRASONIC',
    battery_level INT DEFAULT 100,
    firmware_version VARCHAR(50),
    health_status VARCHAR(50) DEFAULT 'HEALTHY',
    last_ping_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 9. Sensor Readings (Time-series telemetry log)
CREATE TABLE IF NOT EXISTS sensor_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id UUID NOT NULL,
    occupancy_state BOOLEAN NOT NULL,
    battery_level INT,
    temperature NUMERIC(5, 2),
    raw_payload_json JSONB,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 10. ANPR Logs (Automated License Plate Recognition camera events)
CREATE TABLE IF NOT EXISTS anpr_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL,
    camera_id VARCHAR(100) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    confidence_score NUMERIC(5, 2),
    direction VARCHAR(20) NOT NULL, -- 'ENTRY' or 'EXIT'
    image_snapshot_url VARCHAR(500),
    matched_booking_id UUID,
    captured_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 11. Vehicles (Customer registered vehicles)
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    license_plate VARCHAR(50) NOT NULL,
    make VARCHAR(50),
    model VARCHAR(50),
    color VARCHAR(50),
    vehicle_type VARCHAR(50) DEFAULT 'CAR',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 12. Bookings (Parking reservations & sessions)
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    facility_id UUID NOT NULL,
    slot_id UUID,
    vehicle_id UUID,
    vehicle_plate_snapshot VARCHAR(50) NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    total_amount NUMERIC(10, 2) DEFAULT 0.00,
    currency VARCHAR(10) DEFAULT 'INR',
    status booking_status DEFAULT 'RESERVED',
    qr_code_token VARCHAR(255),
    check_in_time TIMESTAMPTZ,
    check_out_time TIMESTAMPTZ,
    version INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

-- 13. Booking Events (State transition history timeline)
CREATE TABLE IF NOT EXISTS booking_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    from_status booking_status,
    to_status booking_status NOT NULL,
    actor_id VARCHAR(255),
    actor_type VARCHAR(50) DEFAULT 'USER', -- 'USER', 'SYSTEM', 'ANPR_CAMERA', 'ATTENDANT'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 14. Payments (Primary payment transaction record)
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL,
    user_id VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    payment_method payment_method DEFAULT 'CREDIT_CARD',
    transaction_status payment_status DEFAULT 'SUCCESS',
    gateway_reference VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 15. Payment Attempts (Multi-gateway payment retry logs)
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL,
    gateway_name VARCHAR(50) NOT NULL, -- 'STRIPE', 'RAZORPAY', 'UPI_INTENT'
    gateway_reference VARCHAR(255),
    status payment_status NOT NULL,
    error_code VARCHAR(100),
    error_message TEXT,
    attempted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 16. Pricing Rules (Dynamic surge & holiday rate engine)
CREATE TABLE IF NOT EXISTS pricing_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    facility_id UUID NOT NULL,
    rule_name VARCHAR(100) NOT NULL,
    vehicle_type VARCHAR(50),
    day_of_week INT, -- 0-6 (Sun-Sat)
    start_time TIME,
    end_time TIME,
    rate_multiplier NUMERIC(5, 2) DEFAULT 1.00,
    fixed_surge_fee NUMERIC(10, 2) DEFAULT 0.00,
    is_holiday_rule BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 0, -- Higher number = higher precedence
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 17. Notifications (User in-app/push notification store)
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 18. Audit Logs (Enterprise data modification & compliance log)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255),
    tenant_id UUID,
    table_name VARCHAR(100) NOT NULL,
    record_id VARCHAR(255) NOT NULL,
    action VARCHAR(20) NOT NULL, -- 'INSERT', 'UPDATE', 'DELETE'
    changes_before_json JSONB,
    changes_after_json JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
