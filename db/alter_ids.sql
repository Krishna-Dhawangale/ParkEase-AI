-- Migration: Alter ID and FK columns to VARCHAR(255) to allow string IDs (e.g., fac_1771146316279)

-- Drop FK constraints temporarily to alter types cleanly
ALTER TABLE floors DROP CONSTRAINT IF EXISTS floors_facility_id_fkey;
ALTER TABLE parking_slots DROP CONSTRAINT IF EXISTS parking_slots_floor_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_facility_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_floor_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_slot_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_vehicle_id_fkey;
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE vehicles DROP CONSTRAINT IF EXISTS vehicles_user_id_fkey;

-- Alter column types to VARCHAR(255)
ALTER TABLE tenants ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE facilities ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE facilities ALTER COLUMN tenant_id TYPE VARCHAR(255);
ALTER TABLE floors ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE floors ALTER COLUMN facility_id TYPE VARCHAR(255);
ALTER TABLE parking_slots ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE parking_slots ALTER COLUMN floor_id TYPE VARCHAR(255);
ALTER TABLE vehicles ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE vehicles ALTER COLUMN user_id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN user_id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN facility_id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN floor_id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN slot_id TYPE VARCHAR(255);
ALTER TABLE bookings ALTER COLUMN vehicle_id TYPE VARCHAR(255);

-- Ensure parking_slots has facility_id column if needed by models
ALTER TABLE parking_slots ADD COLUMN IF NOT EXISTS facility_id VARCHAR(255);
ALTER TABLE parking_slots ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- Re-add FK constraints with ON DELETE CASCADE / SET NULL
ALTER TABLE floors ADD CONSTRAINT floors_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE;
ALTER TABLE parking_slots ADD CONSTRAINT parking_slots_floor_id_fkey FOREIGN KEY (floor_id) REFERENCES floors(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD CONSTRAINT bookings_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE;
ALTER TABLE bookings ADD CONSTRAINT bookings_slot_id_fkey FOREIGN KEY (slot_id) REFERENCES parking_slots(id) ON DELETE SET NULL;
