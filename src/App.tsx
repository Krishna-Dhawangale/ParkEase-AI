import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { CustomerDashboard } from './portals/customer/pages/CustomerDashboard';
import { ParkingSearchPage } from './portals/customer/pages/ParkingSearch';
import { ParkingDetails } from './portals/customer/pages/ParkingDetails';
import { AIRecommendationPage } from './pages/AIRecommendation/AIRecommendationPage';
import { CustomerDigitalTwin } from './portals/customer/pages/CustomerDigitalTwin';
import { Checkout } from './portals/customer/pages/Checkout';
import { PaymentPage } from './pages/Payment/PaymentPage';
import { TicketPage } from './pages/Ticket/TicketPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
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
          <Route path="/dashboard" element={<CustomerDashboard />} />
          <Route path="/search" element={<ParkingSearchPage />} />
          <Route path="/parking/:id" element={<ParkingDetails />} />
          <Route path="/ai-recommendation" element={<AIRecommendationPage />} />
          <Route path="/digital-twin" element={<CustomerDigitalTwin />} />
          <Route path="/book" element={<Checkout />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/workflow" element={<ProjectWorkflowPage />} />
        </Route>

        {/* Admin Portal */}
        {adminRoutes}

        {/* Super Admin Portal */}
        {superAdminRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
