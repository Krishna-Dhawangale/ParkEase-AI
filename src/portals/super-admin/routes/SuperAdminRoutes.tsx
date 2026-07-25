import { Route, Navigate } from 'react-router-dom';
import SuperAdminLayout from '../layouts/SuperAdminLayout';
import SuperAdminDashboard from '../pages/SuperAdminDashboard';

export const superAdminRoutes = (
  <Route path="/super-admin" element={<SuperAdminLayout />}>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<SuperAdminDashboard />} />
    <Route path="*" element={<div>Under Construction</div>} />
  </Route>
);
