-- 04_constraints.sql
-- Foreign keys, unique constraints, and PostgreSQL GiST overlap exclusion constraints

-- Foreign Keys
ALTER TABLE users 
    ADD CONSTRAINT fk_users_tenant 
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL;

ALTER TABLE user_sessions 
    ADD CONSTRAINT fk_sessions_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE facilities 
    ADD CONSTRAINT fk_facilities_tenant 
    FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE;

ALTER TABLE floors 
    ADD CONSTRAINT fk_floors_facility 
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE;

ALTER TABLE parking_slots 
    ADD CONSTRAINT fk_slots_floor 
    FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE;

ALTER TABLE slot_live_status 
    ADD CONSTRAINT fk_live_status_slot 
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE;

ALTER TABLE parking_sensors 
    ADD CONSTRAINT fk_sensors_facility 
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_sensors_slot 
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE SET NULL;

ALTER TABLE sensor_readings 
    ADD CONSTRAINT fk_readings_sensor 
    FOREIGN KEY (sensor_id) REFERENCES parking_sensors(id) ON DELETE CASCADE;

ALTER TABLE anpr_logs 
    ADD CONSTRAINT fk_anpr_facility 
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE;

ALTER TABLE vehicles 
    ADD CONSTRAINT fk_vehicles_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE bookings 
    ADD CONSTRAINT fk_bookings_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bookings_facility 
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_bookings_slot 
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_bookings_vehicle 
    FOREIGN KEY (vehicle_id) REFERENCES vehicles(id) ON DELETE SET NULL;

ALTER TABLE booking_events 
    ADD CONSTRAINT fk_events_booking 
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE;

ALTER TABLE payments 
    ADD CONSTRAINT fk_payments_booking 
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    ADD CONSTRAINT fk_payments_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

ALTER TABLE payment_attempts 
    ADD CONSTRAINT fk_attempts_payment 
    FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE;

ALTER TABLE pricing_rules 
    ADD CONSTRAINT fk_pricing_facility 
    FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE;

ALTER TABLE notifications 
    ADD CONSTRAINT fk_notifications_user 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Unique Composite Constraints
ALTER TABLE floors 
    ADD CONSTRAINT uq_facility_floor_level UNIQUE (facility_id, level);

ALTER TABLE parking_slots 
    ADD CONSTRAINT uq_floor_slot_name UNIQUE (floor_id, name);

-- PostgreSQL GiST Exclusion Constraint for Zero Overlapping Bookings
-- Requires btree_gist extension (loaded in 01_extensions.sql)
ALTER TABLE bookings 
    ADD CONSTRAINT no_overlapping_slot_bookings 
    EXCLUDE USING gist (
        slot_id WITH =,
        tstzrange(start_time, end_time) WITH &&
    ) WHERE (status IN ('RESERVED', 'CHECKED_IN'));
