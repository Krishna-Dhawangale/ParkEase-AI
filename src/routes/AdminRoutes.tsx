import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../portals/client-admin/dashboard/Dashboard';
import ParkingList from '../portals/client-admin/parking/ParkingList';
import DigitalTwin from '../portals/client-admin/digitalTwin/DigitalTwin';
import BookingList from '../portals/client-admin/bookings/BookingList';
import Users from '../portals/client-admin/users/Users';
import EmployeeList from '../portals/client-admin/employees/EmployeeList';
import AnalyticsDashboard from '../portals/client-admin/analytics/AnalyticsDashboard';
import PredictionDashboard from '../portals/client-admin/ai/PredictionDashboard';
import PricingRules from '../portals/client-admin/pricing/PricingRules';
import Payments from '../portals/client-admin/payments/Payments';
import NotificationCenter from '../portals/client-admin/notifications/NotificationCenter';
import DailyReport from '../portals/client-admin/reports/DailyReport';
import AccessLogs from '../portals/client-admin/security/AccessLogs';
import General from '../portals/client-admin/settings/General';
import Profile from '../portals/client-admin/profile/Profile';
import Tickets from '../portals/client-admin/support/Tickets';
import DeviceManager from '../portals/client-admin/devices/DeviceManager';

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="parking" element={<ParkingList />} />
    <Route path="digital-twin" element={<DigitalTwin />} />
    <Route path="bookings" element={<BookingList />} />
    <Route path="customers" element={<Users />} />
    <Route path="users" element={<Navigate to="/admin/customers" replace />} />
    <Route path="employees" element={<EmployeeList />} />
    <Route path="analytics" element={<AnalyticsDashboard />} />
    <Route path="ai" element={<PredictionDashboard />} />
    <Route path="pricing" element={<PricingRules />} />
    <Route path="payments" element={<Payments />} />
    <Route path="devices" element={<DeviceManager />} />
    <Route path="notifications" element={<NotificationCenter />} />
    <Route path="reports" element={<DailyReport />} />
    <Route path="security" element={<AccessLogs />} />
    <Route path="settings" element={<General />} />
    <Route path="profile" element={<Profile />} />
    <Route path="support" element={<Tickets />} />
  </Route>
);
