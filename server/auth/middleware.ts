import type { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    employeeId?: string;
    department?: string;
    jobTitle?: string;
    phoneNumber?: string;
    roles?: string[];
    permissions?: string[];
    expires_at?: number;
  };
}

export function requirePermission(permission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // For development, skip authentication checks
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    if (!req.user.permissions?.includes(permission)) {
      return res.status(403).json({ message: `Permission '${permission}' required` });
    }
    
    next();
  };
}

export function requireAnyPermission(permissions: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // For development, skip authentication checks
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const hasAnyPermission = permissions.some(permission => 
      req.user?.permissions?.includes(permission)
    );
    
    if (!hasAnyPermission) {
      return res.status(403).json({ message: `One of permissions '${permissions.join(', ')}' required` });
    }
    
    next();
  };
}

export function requireRoleLevel(level: number) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // For development, skip authentication checks
    if (process.env.NODE_ENV === 'development') {
      return next();
    }
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // This is a simplified check - in a real app you'd check role levels from the database
    next();
  };
}

export function auditAction(action: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    // Log the action for audit purposes
    console.log(`[AUDIT] User ${req.user?.id || 'anonymous'} performed action: ${action}`);
    next();
  };
}

export function isAuthenticated(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // For development, skip authentication checks
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  
  next();
}