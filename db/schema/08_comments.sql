-- 08_comments.sql
-- Comprehensive PostgreSQL database comments for tables and columns (In-database documentation)

-- 1. Tenants
COMMENT ON TABLE tenants IS 'Stores multi-tenant organizations, malls, airport authorities, and parking operators.';
COMMENT ON COLUMN tenants.id IS 'Unique tenant UUID identifier.';
COMMENT ON COLUMN tenants.slug IS 'Unique URL-friendly organization identifier.';
COMMENT ON COLUMN tenants.plan IS 'Subscription plan tier (e.g. BASIC, PRO, ENTERPRISE).';

-- 2. Users
COMMENT ON TABLE users IS 'User profiles across all portals (Customers, Client Admins, Super Admins, Attendants), synced with Firebase Auth.';
COMMENT ON COLUMN users.id IS 'Firebase UID string identifier.';
COMMENT ON COLUMN users.role IS 'Primary access control role (CUSTOMER, CLIENT_ADMIN, SUPER_ADMIN, ATTENDANT).';
COMMENT ON COLUMN users.tenant_id IS 'Associated tenant organization UUID (null for retail customers).';

-- 3. User Sessions
COMMENT ON TABLE user_sessions IS 'Active refresh token sessions, IP addresses, and device fingerprints for JWT authentication.';
COMMENT ON COLUMN user_sessions.refresh_token_hash IS 'SHA-256 hash of active session refresh token.';

-- 4. Facilities
COMMENT ON TABLE facilities IS 'Physical parking garages, structures, airports, or surface lots.';
COMMENT ON COLUMN facilities.capacity IS 'Cached total active parking bay count.';
COMMENT ON COLUMN facilities.base_price_per_hour IS 'Base hourly parking rate before dynamic pricing multipliers.';

-- 5. Floors
COMMENT ON TABLE floors IS 'Floors, levels, or zones within a facility for 2D/3D Digital Twin visualization.';
COMMENT ON COLUMN floors.layout_json IS 'Digital twin floor grid layout dimensions and SVG geometry metadata.';

-- 6. Parking Slots
COMMENT ON TABLE parking_slots IS 'Static parking bay definitions, type, coordinates, and pricing.';
COMMENT ON COLUMN parking_slots.x IS 'Digital Twin 2D grid column coordinate.';
COMMENT ON COLUMN parking_slots.y IS 'Digital Twin 2D grid row coordinate.';
COMMENT ON COLUMN parking_slots.price_per_hour IS 'Custom slot hourly rate (overrides facility base price if set).';

-- 7. Slot Live Status
COMMENT ON TABLE slot_live_status IS 'High-frequency dynamic occupancy state separated from static slot data to prevent MVCC bloat.';
COMMENT ON COLUMN slot_live_status.status IS 'Real-time bay status (AVAILABLE, OCCUPIED, RESERVED, BLOCKED, EV_CHARGING).';

-- 8. Parking Sensors
COMMENT ON TABLE parking_sensors IS 'Hardware IoT devices (Ultrasonic, Radar, Geomagnetic) installed at parking bays.';
COMMENT ON COLUMN parking_sensors.device_eui IS 'Unique hardware LoRaWAN/MAC identifier.';

-- 9. Sensor Readings
COMMENT ON TABLE sensor_readings IS 'Time-series telemetry historical log of raw sensor payload readings.';
COMMENT ON COLUMN sensor_readings.occupancy_state IS 'True if vehicle detected present, false if vacant.';

-- 10. ANPR Logs
COMMENT ON TABLE anpr_logs IS 'Automated License Plate Recognition camera entry and exit event captures.';
COMMENT ON COLUMN anpr_logs.confidence_score IS 'OCR recognition confidence percentage (0-100).';
COMMENT ON COLUMN anpr_logs.direction IS 'Barrier direction capture (ENTRY or EXIT).';

-- 11. Vehicles
COMMENT ON TABLE vehicles IS 'Registered customer vehicles and license plate details.';
COMMENT ON COLUMN vehicles.license_plate IS 'Vehicle registration plate number.';

-- 12. Bookings
COMMENT ON TABLE bookings IS 'Core parking space reservations and session duration tracking.';
COMMENT ON COLUMN bookings.slot_id IS 'Reserved parking bay UUID.';
COMMENT ON COLUMN bookings.qr_code_token IS 'Encrypted token rendered on digital pass for entry gate scanners.';
COMMENT ON COLUMN bookings.vehicle_plate_snapshot IS 'Historical snapshot of license plate at booking creation time.';

-- 13. Booking Events
COMMENT ON TABLE booking_events IS 'Immutable audit trail logging all booking status transitions over time.';
COMMENT ON COLUMN booking_events.actor_type IS 'Entity triggering state change (USER, SYSTEM, ANPR_CAMERA, ATTENDANT).';

-- 14. Payments
COMMENT ON TABLE payments IS 'Primary billing transaction records and invoice receipts.';
COMMENT ON COLUMN payments.amount IS 'Total paid transaction amount in specified currency.';

-- 15. Payment Attempts
COMMENT ON TABLE payment_attempts IS 'Detailed gateway retry logs for payment processors (Stripe, Razorpay, UPI).';
COMMENT ON COLUMN payment_attempts.error_code IS 'Gateway failure error code if transaction failed.';

-- 16. Pricing Rules
COMMENT ON TABLE pricing_rules IS 'Dynamic rate engine for peak hours, weekend surges, holidays, and vehicle multipliers.';
COMMENT ON COLUMN pricing_rules.priority IS 'Precedence priority order (higher numbers win over lower priority rules).';

-- 17. Notifications
COMMENT ON TABLE notifications IS 'Customer and admin in-app notification bell messages.';

-- 18. Audit Logs
COMMENT ON TABLE audit_logs IS 'Enterprise-grade system audit log recording all data modifications (INSERT, UPDATE, DELETE).';
COMMENT ON COLUMN audit_logs.changes_before_json IS 'JSON snapshot of record attributes prior to modification.';
COMMENT ON COLUMN audit_logs.changes_after_json IS 'JSON snapshot of record attributes following modification.';
