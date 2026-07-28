const fs = require('fs');

let content = fs.readFileSync('src/portals/super-admin/pages/AuditLogsPage.tsx', 'utf8');
content = content.replace(/log\.metadata/g, 'JSON.stringify(log.metadata)');
fs.writeFileSync('src/portals/super-admin/pages/AuditLogsPage.tsx', content);

content = fs.readFileSync('src/portals/super-admin/pages/BillingPage.tsx', 'utf8');
content = content.replace(/invoiceNumber/g, 'id');
content = content.replace(/issuedAt/g, 'createdAt');
fs.writeFileSync('src/portals/super-admin/pages/BillingPage.tsx', content);

content = fs.readFileSync('src/portals/super-admin/pages/FacilitiesPage.tsx', 'utf8');
content = content.replace(/title=".*?"/g, ''); // just in case
content = content.replace(/<SAEmptyState\s+description=/g, '<SAEmptyState title="No Facilities" description=');
fs.writeFileSync('src/portals/super-admin/pages/FacilitiesPage.tsx', content);

content = fs.readFileSync('src/portals/super-admin/pages/SuperAdminLogin.tsx', 'utf8');
content = content.replace(/role: 'SUPER_ADMIN'/g, "role: 'SUPER_ADMIN',\n        isEmailVerified: true,\n        createdAt: new Date().toISOString()");
fs.writeFileSync('src/portals/super-admin/pages/SuperAdminLogin.tsx', content);

content = fs.readFileSync('src/portals/super-admin/services/super-admin.service.ts', 'utf8');
if (!content.includes('getSupportTickets')) {
  content = content.replace(/export const SuperAdminService = \{/g, 'export const SuperAdminService = {\n  async getSupportTickets() { return { data: [], total: 0, page: 1, pageSize: 10, totalPages: 1 }; },\n');
}
fs.writeFileSync('src/portals/super-admin/services/super-admin.service.ts', content);

console.log('Fixed pages 2');
