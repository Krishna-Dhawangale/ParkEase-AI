import type { AuthUser, Role, SubRole, Permission } from '../types/auth';

export const ROLE_DEFAULT_PERMISSIONS: Partial<Record<Role, Permission[]>> = {
  USER: [
    'SEARCH_PARKING',
    'SLOT_BOOK',
    'WALLET_USE',
    'TICKET_VIEW',
    'REVIEW_SUBMIT',
  ],
  OWNER: [
    'FACILITY_CREATE',
    'FACILITY_EDIT',
    'FACILITY_DELETE',
    'BOOKING_MANAGE',
    'CUSTOMER_MANAGE',
    'PRICING_EDIT',
    'STAFF_MANAGE',
    'SECURITY_CONTROL',
    'WORK_ORDER_MANAGE',
    'AUDIT_LOG_VIEW',
    'AI_INSIGHTS_VIEW',
    'STAFF_VIEW',
    'CUSTOMER_VIEW',
    'ANPR_VIEW',
    'GATE_CONTROL',
    'INCIDENT_REPORT',
    'WALKIN_BOOKING',
    'PAYMENT_COLLECT',
    'RECEIPT_PRINT',
    'WORK_ORDER_VIEW',
    'WORK_ORDER_UPDATE',
  ],
  SUPER_ADMIN: [
    'SUPER_ADMIN_ALL',
  ],
};

export const SUBROLE_DEFAULT_PERMISSIONS: Record<SubRole, Permission[]> = {
  FACILITY_ADMIN: ROLE_DEFAULT_PERMISSIONS.OWNER || [],
  MANAGER: [
    'BOOKING_MANAGE',
    'CUSTOMER_MANAGE',
    'CUSTOMER_VIEW',
    'STAFF_VIEW',
    'WORK_ORDER_VIEW',
    'WORK_ORDER_UPDATE',
    'SECURITY_VIEW' as Permission,
    'AUDIT_LOG_VIEW',
  ],
  SECURITY_GUARD: [
    'ANPR_VIEW',
    'GATE_CONTROL',
    'INCIDENT_REPORT',
    'WORK_ORDER_VIEW',
  ],
  CASHIER: [
    'WALKIN_BOOKING',
    'PAYMENT_COLLECT',
    'RECEIPT_PRINT',
    'TICKET_VIEW',
  ],
  MAINTENANCE_ENGINEER: [
    'WORK_ORDER_VIEW',
    'WORK_ORDER_UPDATE',
    'INCIDENT_REPORT',
  ],
};

/**
 * Check if a user possesses a specific permission.
 */
export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.role === 'SUPER_ADMIN' || user.permissions?.includes('SUPER_ADMIN_ALL')) {
    return true;
  }
  if (user.permissions && user.permissions.includes(permission)) {
    return true;
  }
  const defaultRolePerms = ROLE_DEFAULT_PERMISSIONS[user.role] || [];
  if (defaultRolePerms.includes(permission)) return true;

  if (user.subRole) {
    const subPerms = SUBROLE_DEFAULT_PERMISSIONS[user.subRole as SubRole] || [];
    if (subPerms.includes(permission)) return true;
  }

  return false;
}

/**
 * Check if a user possesses at least one of the specified permissions.
 */
export function hasAnyPermission(user: AuthUser | null, permissions: Permission[]): boolean {
  if (!user) return false;
  return permissions.some(perm => hasPermission(user, perm));
}

/**
 * Return resolved list of permissions for a given role and sub-role.
 */
export function resolveUserPermissions(role: Role, subRole?: SubRole): Permission[] {
  if (role === 'SUPER_ADMIN') return ['SUPER_ADMIN_ALL'];
  if (role === 'USER') return ROLE_DEFAULT_PERMISSIONS.USER || [];
  if (subRole && SUBROLE_DEFAULT_PERMISSIONS[subRole]) {
    return SUBROLE_DEFAULT_PERMISSIONS[subRole];
  }
  return ROLE_DEFAULT_PERMISSIONS.OWNER || [];
}
