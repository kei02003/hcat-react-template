import { useAuth } from "@/hooks/useAuth";
import type { ReactNode } from "react";

interface RBACWrapperProps {
  children: ReactNode;
  requiredPermission?: string;
  requiredPermissions?: string[];
  requiredRoleLevel?: number;
  fallback?: ReactNode;
  requireAny?: boolean; // If true, user needs ANY of the permissions, if false, user needs ALL
}

export function RBACWrapper({
  children,
  requiredPermission,
  requiredPermissions = [],
  requiredRoleLevel,
  fallback = null,
  requireAny = true
}: RBACWrapperProps) {
  const { user, isLoading, isAuthenticated } = useAuth();

  // Show nothing while loading
  if (isLoading) {
    return null;
  }

  // Show fallback if not authenticated
  if (!isAuthenticated || !user) {
    return fallback;
  }

  const userPermissions = user.permissions?.map((p: any) => p.name) || [];
  const userRoleLevel = user.roles?.reduce((min: number, role: any) => 
    Math.min(min, role.level), 999) || 999;

  // Check single permission
  if (requiredPermission && !userPermissions.includes(requiredPermission)) {
    return fallback;
  }

  // Check multiple permissions
  if (requiredPermissions.length > 0) {
    const hasPermissions = requireAny
      ? requiredPermissions.some(permission => userPermissions.includes(permission))
      : requiredPermissions.every(permission => userPermissions.includes(permission));
    
    if (!hasPermissions) {
      return fallback;
    }
  }

  // Check role level (lower number = higher level)
  if (requiredRoleLevel && userRoleLevel > requiredRoleLevel) {
    return fallback;
  }

  return <>{children}</>;
}

// Convenience components for common permission checks
export function DenialsOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredPermission="denials.view" fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}

export function AROnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredPermission="ar.view" fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}

export function CollectionsOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredPermission="collections.view" fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}

export function ClinicalOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredPermission="clinical.view" fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}

export function ManagerOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredRoleLevel={3} fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}

export function AdminOnly({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  return (
    <RBACWrapper requiredRoleLevel={1} fallback={fallback}>
      {children}
    </RBACWrapper>
  );
}