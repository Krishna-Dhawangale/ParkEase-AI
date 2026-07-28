import { Route, Navigate } from 'react-router-dom';
import { SuperAdminLayout } from '../layouts/SuperAdminLayout';
import { SuperAdminDashboard } from '../pages/SuperAdminDashboard';
import { SuperAdminLogin } from '../pages/SuperAdminLogin';
import { OrganizationsPage } from '../pages/OrganizationsPage';
import { CreateOrganizationPage } from '../pages/CreateOrganizationPage';
import { OrganizationDetailPage } from '../pages/OrganizationDetailPage';
import { ApprovalsPage } from '../pages/ApprovalsPage';
import { FacilityReviewPage } from '../pages/FacilityReviewPage';
import { FacilitiesPage } from '../pages/FacilitiesPage';
import { FacilityDetailPage } from '../pages/FacilityDetailPage';
import { ClientAdminsPage } from '../pages/ClientAdminsPage';
import { CreateClientAdminPage } from '../pages/CreateClientAdminPage';
import { ClientAdminDetailPage } from '../pages/ClientAdminDetailPage';
import { SAPlaceholderPage } from '../components/SAPlaceholderPage';

export const superAdminRoutes = (
  <>
    <Route path="/super-admin/login" element={<SuperAdminLogin />} />
    <Route path="/super-admin" element={<SuperAdminLayout />}>
      <Route index element={<Navigate to="dashboard" replace />} />
      <Route path="dashboard" element={<SuperAdminDashboard />} />
      <Route path="organizations">
        <Route index element={<OrganizationsPage />} />
        <Route path="create" element={<CreateOrganizationPage />} />
        <Route path=":id" element={<OrganizationDetailPage />} />
      </Route>
      <Route path="approvals">
        <Route index element={<ApprovalsPage />} />
        <Route path=":id" element={<FacilityReviewPage />} />
      </Route>
      <Route path="facilities">
        <Route index element={<FacilitiesPage />} />
        <Route path=":id" element={<FacilityDetailPage />} />
      </Route>

      <Route path="client-admins">
        <Route index element={<ClientAdminsPage />} />
        <Route path="new" element={<CreateClientAdminPage />} />
        <Route path=":id" element={<ClientAdminDetailPage />} />
      </Route>
      <Route path="onboarding" element={<SAPlaceholderPage title="Client Onboarding" description="Track new client activation" />} />
      <Route path="digital-twins" element={<SAPlaceholderPage title="Digital Twin Monitor" description="Monitor 3D visualization systems" />} />
      <Route path="devices" element={<SAPlaceholderPage title="Devices & Cameras" description="Hardware and camera monitoring" />} />
      <Route path="operations" element={<SAPlaceholderPage title="Platform Operations" description="System health and operational metrics" />} />
      <Route path="plans" element={<SAPlaceholderPage title="SaaS Plans" description="Manage subscription tiers" />} />
      <Route path="subscriptions" element={<SAPlaceholderPage title="Subscriptions" description="Client subscription management" />} />
      <Route path="billing" element={<SAPlaceholderPage title="Billing" description="Invoices and payment processing" />} />
      <Route path="revenue" element={<SAPlaceholderPage title="Revenue" description="SaaS revenue analytics" />} />
      <Route path="support" element={<SAPlaceholderPage title="Support Tickets" description="B2B support queue" />} />
      <Route path="complaints" element={<SAPlaceholderPage title="Complaints" description="End-user complaint monitoring" />} />
      <Route path="audit" element={<SAPlaceholderPage title="Audit Logs" description="System-wide activity history" />} />
      <Route path="security" element={<SAPlaceholderPage title="Security" description="Platform security posture" />} />
      <Route path="access-control" element={<SAPlaceholderPage title="Access Control" description="Role and permission management" />} />
      <Route path="system-health" element={<SAPlaceholderPage title="System Health" description="Microservice status" />} />
      <Route path="notifications" element={<SAPlaceholderPage title="Notifications" description="System-wide notifications" />} />
      <Route path="settings" element={<SAPlaceholderPage title="Platform Settings" description="Global configuration" />} />
      <Route path="profile" element={<SAPlaceholderPage title="Profile" description="Super Admin profile settings" />} />
    </Route>
  </>
);
