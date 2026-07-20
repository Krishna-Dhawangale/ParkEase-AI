import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ParkingSearchPage } from './pages/ParkingSearch/ParkingSearchPage';
import { AIRecommendationPage } from './pages/AIRecommendation/AIRecommendationPage';
import { DigitalTwinPage } from './pages/DigitalTwin/DigitalTwinPage';
import { BookingFlowPage } from './pages/BookingFlow/BookingFlowPage';
import { PaymentPage } from './pages/Payment/PaymentPage';
import { TicketPage } from './pages/Ticket/TicketPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboard/AdminDashboardPage';
import { AnalyticsPage } from './pages/Analytics/AnalyticsPage';
import { AIInsightsPage } from './pages/AIInsights/AIInsightsPage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { UserAuthPage } from './pages/Auth/UserAuthPage';
import { AdminAuthPage } from './pages/Auth/AdminAuthPage';
import { OwnerAuthPage } from './pages/Auth/OwnerAuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login/user" element={<UserAuthPage />} />
        <Route path="/login/admin" element={<AdminAuthPage />} />
        <Route path="/login/owner" element={<OwnerAuthPage />} />
        
        {/* App pages with sidebar layout */}
        <Route element={<AppLayout />}>
          {/* Shared Authenticated Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']} />}>
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
          </Route>

          {/* Regular User Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<ParkingSearchPage />} />
            <Route path="/ai-recommendation" element={<AIRecommendationPage />} />
            <Route path="/digital-twin" element={<DigitalTwinPage />} />
            <Route path="/book" element={<BookingFlowPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket" element={<TicketPage />} />
          </Route>

          {/* Parking Owner Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['OWNER']} />}>
            <Route path="/owner/dashboard" element={<div className="p-8">Owner Dashboard WIP</div>} />
          </Route>

          {/* Admin Routes */}
          <Route element={<RoleProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/ai-insights" element={<AIInsightsPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
