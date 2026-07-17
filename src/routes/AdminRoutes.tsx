import { Route, Navigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../modules/admin/dashboard/Dashboard';
import ParkingList from '../modules/admin/parking/ParkingList';
import DigitalTwin from '../modules/admin/digitalTwin/DigitalTwin';
import BookingList from '../modules/admin/bookings/BookingList';
import Users from '../modules/admin/users/Users';
import EmployeeList from '../modules/admin/employees/EmployeeList';
import AnalyticsDashboard from '../modules/admin/analytics/AnalyticsDashboard';
import PredictionDashboard from '../modules/admin/ai/PredictionDashboard';
import PricingRules from '../modules/admin/pricing/PricingRules';
import Payments from '../modules/admin/payments/Payments';
import NotificationCenter from '../modules/admin/notifications/NotificationCenter';
import DailyReport from '../modules/admin/reports/DailyReport';
import AccessLogs from '../modules/admin/security/AccessLogs';
import General from '../modules/admin/settings/General';
import Profile from '../modules/admin/profile/Profile';
import Tickets from '../modules/admin/support/Tickets';

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="parking" element={<ParkingList />} />
    <Route path="digital-twin" element={<DigitalTwin />} />
    <Route path="bookings" element={<BookingList />} />
    <Route path="users" element={<Users />} />
    <Route path="employees" element={<EmployeeList />} />
    <Route path="analytics" element={<AnalyticsDashboard />} />
    <Route path="ai" element={<PredictionDashboard />} />
    <Route path="pricing" element={<PricingRules />} />
    <Route path="payments" element={<Payments />} />
    <Route path="notifications" element={<NotificationCenter />} />
    <Route path="reports" element={<DailyReport />} />
    <Route path="security" element={<AccessLogs />} />
    <Route path="settings" element={<General />} />
    <Route path="profile" element={<Profile />} />
    <Route path="support" element={<Tickets />} />
  </Route>
);
