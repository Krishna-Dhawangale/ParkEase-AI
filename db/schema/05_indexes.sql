-- 05_indexes.sql
-- Performance compound indexes for high-concurrency queries & time-series data

-- Bookings Compound Indexes
CREATE INDEX IF NOT EXISTS ix_bookings_user_status 
    ON bookings(user_id, status);

CREATE INDEX IF NOT EXISTS ix_bookings_facility_time 
    ON bookings(facility_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS ix_bookings_slot_time 
    ON bookings(slot_id, start_time, end_time);

CREATE INDEX IF NOT EXISTS ix_bookings_status_time 
    ON bookings(status, start_time);

-- Parking Slots & Dynamic State Indexes
CREATE INDEX IF NOT EXISTS ix_slots_floor 
    ON parking_slots(floor_id);

CREATE INDEX IF NOT EXISTS ix_slot_live_status 
    ON slot_live_status(status);

-- ANPR Camera & Vehicle Indexes
CREATE INDEX IF NOT EXISTS ix_anpr_plate_time 
    ON anpr_logs(license_plate, captured_at DESC);

CREATE INDEX IF NOT EXISTS ix_anpr_facility 
    ON anpr_logs(facility_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS ix_vehicles_user 
    ON vehicles(user_id);

CREATE INDEX IF NOT EXISTS ix_vehicles_plate 
    ON vehicles(license_plate);

-- IoT Sensor Readings Indexes
CREATE INDEX IF NOT EXISTS ix_readings_sensor_time 
    ON sensor_readings(sensor_id, created_at DESC);

-- Payments & Pricing Indexes
CREATE INDEX IF NOT EXISTS ix_payments_booking 
    ON payments(booking_id);

CREATE INDEX IF NOT EXISTS ix_payments_status 
    ON payments(transaction_status);

CREATE INDEX IF NOT EXISTS ix_pricing_priority 
    ON pricing_rules(facility_id, priority DESC, is_active);

-- Soft Delete Partial Indexes (Fast query filtering for active rows)
CREATE INDEX IF NOT EXISTS ix_tenants_active 
    ON tenants(id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_facilities_active 
    ON facilities(tenant_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_floors_active 
    ON floors(facility_id) WHERE deleted_at IS NULL;

CREATE INDEX IF NOT EXISTS ix_slots_active 
    ON parking_slots(floor_id) WHERE deleted_at IS NULL;
