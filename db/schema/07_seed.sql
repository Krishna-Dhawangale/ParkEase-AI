-- 07_seed.sql
-- Seed initial data for local development & demonstration

-- Insert Default Tenant
INSERT INTO tenants (id, name, slug, status, plan, tenant_type, contact_person, contact_email, contact_phone, is_onboarded)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'ParkEase Demo Mall',
    'parkease-demo-mall',
    'ACTIVE',
    'ENTERPRISE',
    'COMMERCIAL_MALL',
    'Rajesh Sharma',
    'contact@parkease.ai',
    '+91-9876543210',
    TRUE
) ON CONFLICT (slug) DO NOTHING;

-- Insert Super Admin User
INSERT INTO users (id, email, role, first_name, last_name, tenant_id, is_email_verified, profile_setup_complete)
VALUES (
    'admin_super_user_001',
    'superadmin@parkease.ai',
    'SUPER_ADMIN',
    'System',
    'Admin',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    TRUE,
    TRUE
) ON CONFLICT (id) DO NOTHING;

-- Insert Demo Facility
INSERT INTO facilities (id, tenant_id, name, description, city, state, country, capacity, base_price_per_hour, currency, status)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Empress Mall Parking',
    'Multi-level smart parking facility with EV charging and ANPR gate control',
    'Nagpur',
    'Maharashtra',
    'India',
    20,
    50.00,
    'INR',
    'LIVE'
) ON CONFLICT (id) DO NOTHING;

-- Insert Floor Level B1
INSERT INTO floors (id, facility_id, name, level, capacity)
VALUES (
    'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33',
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'Basement B1',
    1,
    20
) ON CONFLICT (id) DO NOTHING;

-- Insert 10 Demo Parking Slots (A-01 to A-10)
INSERT INTO parking_slots (id, floor_id, name, type, price_per_hour, x, y, w, h) VALUES
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a01', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-01', 'STANDARD', 50.00, 0, 0, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a02', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-02', 'STANDARD', 50.00, 1, 0, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a03', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-03', 'EV', 75.00, 2, 0, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a04', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-04', 'EV', 75.00, 3, 0, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a05', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-05', 'ACCESSIBLE', 50.00, 4, 0, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a06', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-06', 'STANDARD', 50.00, 0, 1, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a07', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-07', 'STANDARD', 50.00, 1, 1, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a08', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-08', 'COMPACT', 40.00, 2, 1, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a09', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-09', 'MOTORCYCLE', 25.00, 3, 1, 1, 1),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a10', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'A-10', 'MOTORCYCLE', 25.00, 4, 1, 1, 1)
ON CONFLICT (id) DO NOTHING;

-- Insert Dynamic Pricing Rules
INSERT INTO pricing_rules (facility_id, rule_name, vehicle_type, rate_multiplier, priority)
VALUES 
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Weekend Surge', 'CAR', 1.25, 10),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'EV Charging Premium', 'EV', 1.50, 20)
ON CONFLICT DO NOTHING;
