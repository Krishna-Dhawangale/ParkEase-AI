import { Route, Navigate } from 'react-router-dom';
import { OwnerLayout } from '../layouts/OwnerLayout';
import { FacilityDashboard } from '../modules/owner/dashboard/FacilityDashboard';
import { FacilityManagement } from '../modules/owner/parking/FacilityManagement';
import { BookingOperations } from '../modules/owner/bookings/BookingOperations';
import { CustomerDirectory } from '../modules/owner/customers/CustomerDirectory';
import { StaffManagement } from '../modules/owner/employees/StaffManagement';
import { PricingManagement } from '../modules/owner/pricing/PricingManagement';
import { DigitalTwinBuilder } from '../modules/owner/digitalTwin/DigitalTwinBuilder';
import { BusinessAnalytics } from '../modules/owner/reports/BusinessAnalytics';
import { SecurityOperations } from '../modules/owner/security/SecurityOperations';
import { AIAnalytics } from '../modules/owner/ai/AIAnalytics';
import { MaintenanceWorkOrders } from '../modules/owner/maintenance/MaintenanceWorkOrders';
import { OperationalAuditLogs } from '../modules/owner/audit/OperationalAuditLogs';
import General from '../portals/client-admin/settings/General';

export const ownerRoutes = (
  <Route path="/owner" element={<OwnerLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<FacilityDashboard />} />
    <Route path="parking" element={<FacilityManagement />} />
    <Route path="bookings" element={<BookingOperations />} />
    <Route path="customers" element={<CustomerDirectory />} />
    <Route path="staff" element={<StaffManagement />} />
    <Route path="pricing" element={<PricingManagement />} />
    <Route path="digital-twin" element={<DigitalTwinBuilder />} />
    <Route path="reports" element={<BusinessAnalytics />} />
    <Route path="security" element={<SecurityOperations />} />
    <Route path="ai-insights" element={<AIAnalytics />} />
    <Route path="maintenance" element={<MaintenanceWorkOrders />} />
    <Route path="audit-logs" element={<OperationalAuditLogs />} />
    <Route path="settings" element={<General />} />
    <Route path="support" element={<BusinessAnalytics />} />
  </Route>
);
