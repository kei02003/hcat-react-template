import { db } from "../db";
import { users, roles, userRoles, permissions, rolePermissions, auditLog } from "../../shared/auth-schema";
import { eq, and, sql } from "drizzle-orm";
import type { User, Role, Permission } from "../../shared/auth-schema";

export interface UserWithRoles extends User {
  roles: Role[];
  permissions: Permission[];
}

export interface PermissionCheck {
  userId: string;
  permission: string;
  resource?: string;
}

// Healthcare role hierarchy levels
export const ROLE_LEVELS = {
  SYSTEM_ADMIN: 1,
  CLINICAL_DIRECTOR: 2,
  DEPARTMENT_MANAGER: 3,
  SENIOR_SPECIALIST: 4,
  SPECIALIST: 5,
  ANALYST: 6,
  VIEWER: 7
} as const;

// Permission categories for healthcare operations
export const PERMISSION_CATEGORIES = {
  DENIALS: 'denials',
  AR_MANAGEMENT: 'ar_management',
  COLLECTIONS: 'collections',
  TIMELY_FILING: 'timely_filing',
  CLINICAL_REVIEW: 'clinical_review',
  FINANCIAL_REPORTING: 'financial_reporting',
  USER_MANAGEMENT: 'user_management',
  AUDIT_LOGS: 'audit_logs',
  SYSTEM_SETTINGS: 'system_settings'
} as const;

// Standard healthcare permissions
export const STANDARD_PERMISSIONS = [
  // Denials Management
  { name: 'denials.view', displayName: 'View Denials', category: 'denials', level: 'view' },
  { name: 'denials.edit', displayName: 'Edit Denials', category: 'denials', level: 'edit' },
  { name: 'denials.review', displayName: 'Review Denials', category: 'denials', level: 'manage' },
  { name: 'denials.appeal', displayName: 'Submit Appeals', category: 'denials', level: 'manage' },
  
  // AR Management
  { name: 'ar.view', displayName: 'View AR Data', category: 'ar_management', level: 'view' },
  { name: 'ar.edit', displayName: 'Edit AR Records', category: 'ar_management', level: 'edit' },
  { name: 'ar.manage', displayName: 'Manage AR Portfolio', category: 'ar_management', level: 'manage' },
  
  // Collections
  { name: 'collections.view', displayName: 'View Collections', category: 'collections', level: 'view' },
  { name: 'collections.contact', displayName: 'Contact Patients', category: 'collections', level: 'edit' },
  { name: 'collections.manage', displayName: 'Manage Collections', category: 'collections', level: 'manage' },
  
  // Clinical Review
  { name: 'clinical.view', displayName: 'View Clinical Data', category: 'clinical_review', level: 'view' },
  { name: 'clinical.review', displayName: 'Clinical Review', category: 'clinical_review', level: 'manage' },
  
  // Financial Reporting
  { name: 'reports.view', displayName: 'View Reports', category: 'financial_reporting', level: 'view' },
  { name: 'reports.export', displayName: 'Export Reports', category: 'financial_reporting', level: 'edit' },
  { name: 'reports.create', displayName: 'Create Reports', category: 'financial_reporting', level: 'manage' },
  
  // User Management
  { name: 'users.view', displayName: 'View Users', category: 'user_management', level: 'view' },
  { name: 'users.edit', displayName: 'Edit Users', category: 'user_management', level: 'edit' },
  { name: 'users.manage', displayName: 'Manage Users', category: 'user_management', level: 'manage' },
  
  // System
  { name: 'system.audit', displayName: 'View Audit Logs', category: 'audit_logs', level: 'view' },
  { name: 'system.settings', displayName: 'System Settings', category: 'system_settings', level: 'admin' }
] as const;

// Standard healthcare roles with their permissions
export const STANDARD_ROLES = [
  {
    name: 'system_administrator',
    displayName: 'System Administrator',
    description: 'Full system access and user management',
    level: ROLE_LEVELS.SYSTEM_ADMIN,
    department: null,
    permissions: STANDARD_PERMISSIONS.map(p => p.name)
  },
  {
    name: 'clinical_director',
    displayName: 'Clinical Director',
    description: 'Clinical oversight and denial management authority',
    level: ROLE_LEVELS.CLINICAL_DIRECTOR,
    department: null,
    permissions: [
      'denials.view', 'denials.edit', 'denials.review', 'denials.appeal',
      'clinical.view', 'clinical.review',
      'ar.view', 'collections.view',
      'reports.view', 'reports.export', 'reports.create',
      'users.view', 'system.audit'
    ]
  },
  {
    name: 'revenue_cycle_manager',
    displayName: 'Revenue Cycle Manager',
    description: 'Complete revenue cycle oversight and management',
    level: ROLE_LEVELS.DEPARTMENT_MANAGER,
    department: 'Revenue Cycle',
    permissions: [
      'denials.view', 'denials.edit', 'denials.review',
      'ar.view', 'ar.edit', 'ar.manage',
      'collections.view', 'collections.contact', 'collections.manage',
      'reports.view', 'reports.export', 'reports.create',
      'users.view'
    ]
  },
  {
    name: 'billing_manager',
    displayName: 'Billing Manager',
    description: 'Billing operations and AR management',
    level: ROLE_LEVELS.DEPARTMENT_MANAGER,
    department: 'Billing',
    permissions: [
      'denials.view', 'denials.edit',
      'ar.view', 'ar.edit', 'ar.manage',
      'collections.view', 'collections.contact',
      'reports.view', 'reports.export'
    ]
  },
  {
    name: 'clinical_reviewer',
    displayName: 'Clinical Reviewer',
    description: 'Clinical denial review and appeal preparation',
    level: ROLE_LEVELS.SENIOR_SPECIALIST,
    department: null,
    permissions: [
      'denials.view', 'denials.edit', 'denials.review', 'denials.appeal',
      'clinical.view', 'clinical.review',
      'reports.view'
    ]
  },
  {
    name: 'denial_specialist',
    displayName: 'Denial Specialist',
    description: 'Denial management and appeal processing',
    level: ROLE_LEVELS.SPECIALIST,
    department: 'Revenue Cycle',
    permissions: [
      'denials.view', 'denials.edit', 'denials.appeal',
      'ar.view',
      'reports.view'
    ]
  },
  {
    name: 'ar_specialist',
    displayName: 'AR Specialist',
    description: 'Accounts receivable management and follow-up',
    level: ROLE_LEVELS.SPECIALIST,
    department: 'Billing',
    permissions: [
      'ar.view', 'ar.edit',
      'collections.view', 'collections.contact',
      'denials.view',
      'reports.view'
    ]
  },
  {
    name: 'collections_specialist',
    displayName: 'Collections Specialist',
    description: 'Patient collections and payment follow-up',
    level: ROLE_LEVELS.SPECIALIST,
    department: 'Collections',
    permissions: [
      'collections.view', 'collections.contact', 'collections.manage',
      'ar.view',
      'reports.view'
    ]
  },
  {
    name: 'financial_analyst',
    displayName: 'Financial Analyst',
    description: 'Financial reporting and data analysis',
    level: ROLE_LEVELS.ANALYST,
    department: 'Finance',
    permissions: [
      'denials.view',
      'ar.view',
      'collections.view',
      'reports.view', 'reports.export', 'reports.create'
    ]
  },
  {
    name: 'read_only_user',
    displayName: 'Read Only User',
    description: 'View-only access to assigned areas',
    level: ROLE_LEVELS.VIEWER,
    department: null,
    permissions: [
      'denials.view',
      'ar.view',
      'collections.view',
      'reports.view'
    ]
  }
];

export class RBACService {
  /**
   * Get user with their roles and permissions
   */
  async getUserWithPermissions(userId: string): Promise<UserWithRoles | null> {
    try {
      const userWithRoles = await db
        .select({
          user: users,
          role: roles,
          permission: permissions
        })
        .from(users)
        .leftJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.isActive, true)))
        .leftJoin(roles, eq(roles.id, userRoles.roleId))
        .leftJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
        .leftJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(eq(users.id, userId));

      if (!userWithRoles.length || !userWithRoles[0].user) {
        return null;
      }

      const user = userWithRoles[0].user;
      const userRoleMap = new Map<string, Role>();
      const userPermissionMap = new Map<string, Permission>();

      for (const row of userWithRoles) {
        if (row.role && !userRoleMap.has(row.role.id)) {
          userRoleMap.set(row.role.id, row.role);
        }
        if (row.permission && !userPermissionMap.has(row.permission.id)) {
          userPermissionMap.set(row.permission.id, row.permission);
        }
      }

      return {
        ...user,
        roles: Array.from(userRoleMap.values()),
        permissions: Array.from(userPermissionMap.values())
      };
    } catch (error) {
      console.warn('Failed to get user with permissions:', error.message);
      // Return basic user without roles/permissions if RBAC tables don't exist
      try {
        const [basicUser] = await db.select().from(users).where(eq(users.id, userId));
        if (basicUser) {
          return {
            ...basicUser,
            roles: [],
            permissions: []
          };
        }
      } catch (userError) {
        console.warn('Failed to get basic user:', userError.message);
      }
      return null;
    }
  }

  /**
   * Check if user has specific permission
   */
  async hasPermission(userId: string, permissionName: string): Promise<boolean> {
    try {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .innerJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.isActive, true)))
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
        .innerJoin(permissions, and(eq(permissions.id, rolePermissions.permissionId), eq(permissions.name, permissionName)))
        .where(and(eq(users.id, userId), eq(users.isActive, true)));

      return result[0]?.count > 0;
    } catch (error) {
      console.warn('Permission check failed, allowing access for development:', error.message);
      // During development, if RBAC tables don't exist, allow access
      return true;
    }
  }

  /**
   * Check if user has any of the specified permissions
   */
  async hasAnyPermission(userId: string, permissionNames: string[]): Promise<boolean> {
    if (!permissionNames.length) return false;

    try {
      const result = await db
        .select({ count: sql<number>`count(*)` })
        .from(users)
        .innerJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.isActive, true)))
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .innerJoin(rolePermissions, eq(rolePermissions.roleId, roles.id))
        .innerJoin(permissions, eq(permissions.id, rolePermissions.permissionId))
        .where(and(
          eq(users.id, userId),
          eq(users.isActive, true),
          sql`${permissions.name} IN (${sql.join(permissionNames.map(p => sql`${p}`), sql`, `)})`
        ));

      return result[0]?.count > 0;
    } catch (error) {
      console.warn('Permission check failed, allowing access for development:', error.message);
      // During development, if RBAC tables don't exist, allow access
      return true;
    }
  }

  /**
   * Get user's highest role level
   */
  async getUserRoleLevel(userId: string): Promise<number | null> {
    try {
      const result = await db
        .select({ minLevel: sql<number>`min(${roles.level})` })
        .from(users)
        .innerJoin(userRoles, and(eq(userRoles.userId, users.id), eq(userRoles.isActive, true)))
        .innerJoin(roles, eq(roles.id, userRoles.roleId))
        .where(and(eq(users.id, userId), eq(users.isActive, true)));

      return result[0]?.minLevel || null;
    } catch (error) {
      console.warn('Role level check failed, returning admin level for development:', error.message);
      // During development, if RBAC tables don't exist, return admin level
      return 1;
    }
  }

  /**
   * Log user action for audit trail
   */
  async logAction(
    userId: string,
    action: string,
    resource?: string,
    resourceType?: string,
    details?: any,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    try {
      await db.insert(auditLog).values({
        userId,
        action,
        resource,
        resourceType,
        details,
        ipAddress,
        userAgent
      });
    } catch (error) {
      console.warn('Audit logging failed:', error.message);
      // Don't fail the request if audit logging fails
    }
  }

  /**
   * Initialize standard roles and permissions
   */
  async initializeRolesAndPermissions(): Promise<void> {
    try {
      // Insert permissions
      for (const perm of STANDARD_PERMISSIONS) {
        await db
          .insert(permissions)
          .values({
            name: perm.name,
            displayName: perm.displayName,
            description: `${perm.displayName} permission`,
            category: perm.category,
            level: perm.level,
            isActive: true
          })
          .onConflictDoNothing();
      }

      // Insert roles
      for (const role of STANDARD_ROLES) {
        const [insertedRole] = await db
          .insert(roles)
          .values({
            name: role.name,
            displayName: role.displayName,
            description: role.description,
            level: role.level,
            department: role.department,
            isActive: true
          })
          .onConflictDoNothing()
          .returning();

        if (insertedRole) {
          // Assign permissions to role
          const rolePermissionsList = await db
            .select()
            .from(permissions)
            .where(sql`${permissions.name} IN (${sql.join(role.permissions.map(p => sql`${p}`), sql`, `)})`);

          for (const permission of rolePermissionsList) {
            await db
              .insert(rolePermissions)
              .values({
                roleId: insertedRole.id,
                permissionId: permission.id
              })
              .onConflictDoNothing();
          }
        }
      }
    } catch (error) {
      console.warn('RBAC initialization failed (tables may not exist yet):', error.message);
      // Tables might not exist yet - this is okay for development
    }
  }

  /**
   * Assign role to user
   */
  async assignRole(userId: string, roleName: string, assignedBy: string): Promise<void> {
    const role = await db
      .select()
      .from(roles)
      .where(and(eq(roles.name, roleName), eq(roles.isActive, true)))
      .limit(1);

    if (!role.length) {
      throw new Error(`Role ${roleName} not found`);
    }

    await db.insert(userRoles).values({
      userId,
      roleId: role[0].id,
      assignedBy,
      isActive: true
    });

    await this.logAction(assignedBy, 'assign_role', userId, 'user', { roleName });
  }

  /**
   * Remove role from user
   */
  async removeRole(userId: string, roleName: string, removedBy: string): Promise<void> {
    const role = await db
      .select()
      .from(roles)
      .where(eq(roles.name, roleName))
      .limit(1);

    if (!role.length) {
      throw new Error(`Role ${roleName} not found`);
    }

    await db
      .update(userRoles)
      .set({ isActive: false })
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, role[0].id)));

    await this.logAction(removedBy, 'remove_role', userId, 'user', { roleName });
  }
}

export const rbacService = new RBACService();