import { useQuery } from "@tanstack/react-query";

interface UserClaims {
  sub: string;
  email: string;
  first_name: string;
  last_name: string;
  profile_image_url: string;
}

interface Permission {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: string;
  level: string;
}

interface Role {
  id: string;
  name: string;
  displayName: string;
  description: string;
  level: number;
  department: string | null;
}

interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  phoneNumber: string;
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
  roles: Role[];
  permissions: Permission[];
}

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  const hasPermission = (permission: string): boolean => {
    return user?.permissions?.some(p => p.name === permission) || false;
  };

  const hasAnyPermission = (permissions: string[]): boolean => {
    if (!permissions.length) return false;
    return permissions.some(permission => hasPermission(permission));
  };

  const hasRole = (roleName: string): boolean => {
    return user?.roles?.some(r => r.name === roleName) || false;
  };

  const hasRoleLevel = (maxLevel: number): boolean => {
    if (!user?.roles?.length) return false;
    const userLevel = Math.min(...user.roles.map(r => r.level));
    return userLevel <= maxLevel;
  };

  const getRoleLevel = (): number => {
    if (!user?.roles?.length) return 999;
    return Math.min(...user.roles.map(r => r.level));
  };

  const getPrimaryRole = (): Role | null => {
    if (!user?.roles?.length) return null;
    return user.roles.reduce((primary, role) => 
      role.level < primary.level ? role : primary
    );
  };

  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasRoleLevel,
    getRoleLevel,
    getPrimaryRole
  };
}