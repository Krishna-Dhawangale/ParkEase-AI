import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { RoleProtectedRoute } from './components/auth/RoleProtectedRoute';
import { LandingPage } from './pages/Landing/LandingPage';
import { DashboardPage } from './pages/Dashboard/DashboardPage';
import { ParkingSearchPage } from './pages/ParkingSearch/ParkingSearchPage';
import { AIRecommendationPage } from './pages/AIRecommendation/AIRecommendationPage';
import { DigitalTwinPage } from './pages/DigitalTwin/DigitalTwinPage';
import { BookingFlowPage } from './pages/BookingFlow/BookingFlowPage';
import { PaymentPage } from './pages/Payment/PaymentPage';
import { TicketPage } from './pages/Ticket/TicketPage';
import { ProfilePage } from './pages/Profile/ProfilePage';
import { NotificationsPage } from './pages/Notifications/NotificationsPage';
import { ProjectWorkflowPage } from './pages/ProjectWorkflow/ProjectWorkflowPage';
import { RewardsPage } from './pages/Rewards/RewardsPage';
import { CustomerSupportPage } from './pages/Support/CustomerSupportPage';

// Auth Pages
import { UserAuthPage } from './pages/Auth/UserAuthPage';
import { AdminAuthPage } from './pages/Auth/AdminAuthPage';
import { OwnerAuthPage } from './pages/Auth/OwnerAuthPage';

// Route Modules
import { ownerRoutes } from './routes/OwnerRoutes';
import { adminRoutes } from './routes/AdminRoutes';
import { UserAuthPage } from './pages/Auth/UserAuthPage';
import { AdminAuthPage } from './pages/Auth/AdminAuthPage';
import { OwnerAuthPage } from './pages/Auth/OwnerAuthPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing & Auth */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login/user" element={<UserAuthPage />} />
        <Route path="/login/admin" element={<AdminAuthPage />} />
        <Route path="/login/owner" element={<OwnerAuthPage />} />

        {/* 1. CUSTOMER ROUTE TREE (Role: USER) */}
        <Route element={<RoleProtectedRoute allowedRoles={['USER']} />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/search" element={<ParkingSearchPage />} />
            <Route path="/ai-recommendation" element={<AIRecommendationPage />} />
            <Route path="/digital-twin" element={<DigitalTwinPage />} />
            <Route path="/book" element={<BookingFlowPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/ticket" element={<TicketPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<CustomerSupportPage />} />
            <Route path="/rewards" element={<RewardsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/workflow" element={<ProjectWorkflowPage />} />
          </Route>
        </Route>

        {/* 2. PARKING OPERATOR ROUTE TREE (Role: OWNER) */}
        <Route element={<RoleProtectedRoute allowedRoles={['OWNER']} />}>
          {ownerRoutes}
        </Route>

        {/* 3. PLATFORM SUPERADMIN ROUTE TREE (Role: SUPER_ADMIN) */}
        <Route element={<RoleProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          {adminRoutes}
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
