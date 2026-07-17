import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import { ProjectWorkflowPage } from './pages/ProjectWorkflow/ProjectWorkflowPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public landing */}
        <Route path="/" element={<LandingPage />} />
        
        {/* App pages with sidebar layout */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/search" element={<ParkingSearchPage />} />
          <Route path="/ai-recommendation" element={<AIRecommendationPage />} />
          <Route path="/digital-twin" element={<DigitalTwinPage />} />
          <Route path="/book" element={<BookingFlowPage />} />
          <Route path="/payment" element={<PaymentPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/ai-insights" element={<AIInsightsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/workflow" element={<ProjectWorkflowPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
