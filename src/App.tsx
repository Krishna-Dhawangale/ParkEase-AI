import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { LenisProvider } from './components/motion/LenisProvider';
import { CustomerLayout } from './components/layout/CustomerLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { CustomerDashboard } from './portals/customer/pages/CustomerDashboard';
import { ParkingSearchPage } from './portals/customer/pages/ParkingSearch';
import { ParkingDetails } from './portals/customer/pages/ParkingDetails';
import { AIRecommendationPage } from './pages/AIRecommendation/AIRecommendationPage';
import { CustomerDigitalTwin } from './portals/customer/pages/CustomerDigitalTwin';
import { Checkout } from './portals/customer/pages/Checkout';
import { PaymentPage } from './pages/Payment/PaymentPage';
import { TicketPage } from './pages/Ticket/TicketPage';
import { ProfilePage } from './portals/customer/pages/ProfilePage';
import { Payments } from './portals/customer/pages/Payments';
import { MyBookings } from './portals/customer/pages/MyBookings';
import { ComingSoon } from './portals/customer/pages/ComingSoon';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { AIInsightsPage } from './pages/AIInsights/AIInsightsPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { ProjectWorkflowPage } from './pages/ProjectWorkflow/ProjectWorkflowPage';
import { adminRoutes } from './routes/AdminRoutes';
import { superAdminRoutes } from './portals/super-admin/routes/SuperAdminRoutes';

// Auth Pages
import { UserAuthPage } from './pages/Auth/UserAuthPage';
import { AdminAuthPage } from './pages/Auth/AdminAuthPage';
import { OwnerAuthPage } from './pages/Auth/OwnerAuthPage';
import { ChangePasswordPage } from './pages/Auth/ChangePasswordPage';
import { ForcePasswordChange } from './pages/Auth/ForcePasswordChange';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <LenisProvider>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login/user" element={<UserAuthPage />} />
        <Route path="/login/admin" element={<AdminAuthPage />} />
        <Route path="/login/owner" element={<OwnerAuthPage />} />
        <Route path="/admin/change-password" element={<ChangePasswordPage />} />
        <Route path="/super-admin/change-password" element={<ChangePasswordPage />} />
        <Route path="/force-password-change" element={<ForcePasswordChange />} />
        
        {/* App pages with sidebar layout (Customer Only) */}
        <Route element={<RoleProtectedRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN']} />}>
          <Route path="/customer" element={<CustomerLayout />}>
            <Route index element={<ParkingSearchPage />} />
            <Route path="search" element={<ParkingSearchPage />} />
            <Route path="parking/:id" element={<ParkingDetails />} />
            <Route path="ai-recommendation" element={<AIRecommendationPage />} />
            <Route path="digital-twin" element={<CustomerDigitalTwin />} />
            <Route path="book" element={<Checkout />} />
            <Route path="payments" element={<Payments />} />
            <Route path="bookings" element={<MyBookings />} />
            <Route path="vehicles" element={<ComingSoon />} />
            <Route path="activity" element={<ComingSoon />} />
            <Route path="support" element={<ComingSoon />} />
            <Route path="settings" element={<ComingSoon />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="ticket" element={<TicketPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="ai-insights" element={<AIInsightsPage />} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="workflow" element={<ProjectWorkflowPage />} />
          </Route>
        </Route>

        <Route path="/dashboard" element={<Navigate to="/customer" replace />} />

        {/* Admin Portal */}
        {adminRoutes}

        {/* Super Admin Portal */}
        {superAdminRoutes}
      </Routes>
      </LenisProvider>
    </BrowserRouter>
  );
}

export default App;
