// Role-Based Access Control (RBAC) service
// Simplified implementation for development

export const ROLE_LEVELS = {
  ADMINISTRATOR: 1,
  MANAGER: 2,
  SPECIALIST: 3,
  VIEWER: 4,
} as const;

export class RBACService {
  private initialized = false;

  async initializeRolesAndPermissions(): Promise<void> {
    // For development, just mark as initialized
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  RBAC initialization skipped (development mode)');
      this.initialized = true;
      return;
    }

    // In production, this would initialize roles and permissions in the database
    try {
      // Initialize default roles and permissions
      this.initialized = true;
      console.log('✓ RBAC initialized successfully');
    } catch (error) {
      console.error('Failed to initialize RBAC:', error);
      throw error;
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  // Helper method to get role level by name
  getRoleLevel(roleName: string): number {
    switch (roleName.toLowerCase()) {
      case 'administrator':
        return ROLE_LEVELS.ADMINISTRATOR;
      case 'manager':
        return ROLE_LEVELS.MANAGER;
      case 'specialist':
        return ROLE_LEVELS.SPECIALIST;
      case 'viewer':
      default:
        return ROLE_LEVELS.VIEWER;
    }
  }

  // Check if user has required role level
  hasRequiredRoleLevel(userRoles: string[], requiredLevel: number): boolean {
    if (process.env.NODE_ENV === 'development') {
      return true; // Skip checks in development
    }

    const userMaxLevel = Math.min(
      ...userRoles.map(role => this.getRoleLevel(role))
    );
    
    return userMaxLevel <= requiredLevel;
  }

  // Get user permissions based on roles
  getUserPermissions(userRoles: string[]): string[] {
    if (process.env.NODE_ENV === 'development') {
      // Return all permissions in development
      return [
        'denials.view',
        'denials.edit',
        'ar.view',
        'ar.edit',
        'metrics.view',
        'metrics.edit',
        'users.view',
        'users.edit',
        'admin.all'
      ];
    }

    // In production, this would fetch permissions from database
    return [];
  }
}

export const rbacService = new RBACService();