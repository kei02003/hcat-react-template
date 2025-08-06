import type { Request, Response, NextFunction } from 'express';
import { rbacService } from './rbac';

export interface AuthenticatedRequest extends Request {
  user: {
    claims: {
      sub: string;
      email: string;
      first_name: string;
      last_name: string;
      profile_image_url: string;
    };
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
  permissions?: string[];
  roleLevel?: number;
}

/**
 * Middleware to check if user has required permission
 */
export function requirePermission(permission: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: 'Unauthorized - No user session' });
    }

    try {
      const hasPermission = await rbacService.hasPermission(req.user.claims.sub, permission);
      
      if (!hasPermission) {
        await rbacService.logAction(
          req.user.claims.sub,
          'access_denied',
          undefined,
          'permission',
          { permission, endpoint: req.originalUrl },
          req.ip,
          req.get('User-Agent')
        );
        
        return res.status(403).json({ 
          message: 'Access denied - Insufficient permissions',
          required: permission 
        });
      }

      // Cache permissions in request for performance
      if (!req.permissions) {
        const userWithPermissions = await rbacService.getUserWithPermissions(req.user.claims.sub);
        req.permissions = userWithPermissions?.permissions.map(p => p.name) || [];
        req.roleLevel = await rbacService.getUserRoleLevel(req.user.claims.sub) || 999;
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user has any of the required permissions
 */
export function requireAnyPermission(permissions: string[]) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: 'Unauthorized - No user session' });
    }

    try {
      const hasPermission = await rbacService.hasAnyPermission(req.user.claims.sub, permissions);
      
      if (!hasPermission) {
        await rbacService.logAction(
          req.user.claims.sub,
          'access_denied',
          undefined,
          'permission',
          { permissions, endpoint: req.originalUrl },
          req.ip,
          req.get('User-Agent')
        );
        
        return res.status(403).json({ 
          message: 'Access denied - Insufficient permissions',
          required: permissions 
        });
      }

      // Cache permissions in request for performance
      if (!req.permissions) {
        const userWithPermissions = await rbacService.getUserWithPermissions(req.user.claims.sub);
        req.permissions = userWithPermissions?.permissions.map(p => p.name) || [];
        req.roleLevel = await rbacService.getUserRoleLevel(req.user.claims.sub) || 999;
      }

      next();
    } catch (error) {
      console.error('Permission check failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check if user has minimum role level
 */
export function requireRoleLevel(maxLevel: number) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: 'Unauthorized - No user session' });
    }

    try {
      const userLevel = await rbacService.getUserRoleLevel(req.user.claims.sub);
      
      if (!userLevel || userLevel > maxLevel) {
        await rbacService.logAction(
          req.user.claims.sub,
          'access_denied',
          undefined,
          'role_level',
          { required: maxLevel, actual: userLevel, endpoint: req.originalUrl },
          req.ip,
          req.get('User-Agent')
        );
        
        return res.status(403).json({ 
          message: 'Access denied - Insufficient role level',
          required: maxLevel 
        });
      }

      req.roleLevel = userLevel;
      next();
    } catch (error) {
      console.error('Role level check failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

/**
 * Middleware to check department access
 */
export function requireDepartmentAccess(department: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user?.claims?.sub) {
      return res.status(401).json({ message: 'Unauthorized - No user session' });
    }

    try {
      const userWithPermissions = await rbacService.getUserWithPermissions(req.user.claims.sub);
      
      if (!userWithPermissions) {
        return res.status(403).json({ message: 'Access denied - User not found' });
      }

      // Check if user has cross-department role or specific department access
      const hasCrossDepartmentRole = userWithPermissions.roles.some(role => 
        !role.department || role.level <= 2 // Admin or Clinical Director
      );
      
      const hasDepartmentRole = userWithPermissions.roles.some(role => 
        role.department === department
      );

      if (!hasCrossDepartmentRole && !hasDepartmentRole) {
        await rbacService.logAction(
          req.user.claims.sub,
          'access_denied',
          undefined,
          'department',
          { department, endpoint: req.originalUrl },
          req.ip,
          req.get('User-Agent')
        );
        
        return res.status(403).json({ 
          message: 'Access denied - Department access required',
          required: department 
        });
      }

      next();
    } catch (error) {
      console.error('Department access check failed:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
}

/**
 * Audit middleware to log all actions
 */
export function auditAction(action: string, resourceType?: string) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.claims?.sub) {
      await rbacService.logAction(
        req.user.claims.sub,
        action,
        req.params.id || req.body.id,
        resourceType,
        { method: req.method, endpoint: req.originalUrl, body: req.body },
        req.ip,
        req.get('User-Agent')
      );
    }
    next();
  };
}