export function isUnauthorizedError(error: Error): boolean {
  return /^401: .*Unauthorized/.test(error.message);
}

export function isForbiddenError(error: Error): boolean {
  return /^403: .*Forbidden/.test(error.message) || /^403: .*Access denied/.test(error.message);
}

export function handleAuthError(error: Error, toast?: any) {
  if (isUnauthorizedError(error)) {
    if (toast) {
      toast({
        title: "Session Expired",
        description: "Please log in again to continue.",
        variant: "destructive",
      });
    }
    setTimeout(() => {
      window.location.href = "/api/login";
    }, 1000);
    return true;
  }
  
  if (isForbiddenError(error)) {
    if (toast) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to perform this action.",
        variant: "destructive",
      });
    }
    return true;
  }
  
  return false;
}

// Healthcare role definitions for UI purposes
export const HEALTHCARE_ROLES = {
  SYSTEM_ADMINISTRATOR: {
    name: 'system_administrator',
    displayName: 'System Administrator',
    level: 1,
    color: 'bg-[#f13c45]/20 text-[#f13c45]/95'
  },
  CLINICAL_DIRECTOR: {
    name: 'clinical_director',
    displayName: 'Clinical Director', 
    level: 2,
    color: 'bg-[#6e53a3]/20 text-[#6e53a3]'
  },
  REVENUE_CYCLE_MANAGER: {
    name: 'revenue_cycle_manager',
    displayName: 'Revenue Cycle Manager',
    level: 3,
    color: 'bg-[#006d9a]/20 text-[#006d9a]'
  },
  BILLING_MANAGER: {
    name: 'billing_manager',
    displayName: 'Billing Manager',
    level: 3,
    color: 'bg-green-100 text-green-800'
  },
  CLINICAL_REVIEWER: {
    name: 'clinical_reviewer',
    displayName: 'Clinical Reviewer',
    level: 4,
    color: 'bg-indigo-100 text-indigo-800'
  },
  DENIAL_SPECIALIST: {
    name: 'denial_specialist',
    displayName: 'Denial Specialist',
    level: 5,
    color: 'bg-[#f8961d]/20 text-[#f8961d]/95'
  },
  AR_SPECIALIST: {
    name: 'ar_specialist',
    displayName: 'AR Specialist',
    level: 5,
    color: 'bg-teal-100 text-teal-800'
  },
  COLLECTIONS_SPECIALIST: {
    name: 'collections_specialist',
    displayName: 'Collections Specialist',
    level: 5,
    color: 'bg-pink-100 text-pink-800'
  },
  FINANCIAL_ANALYST: {
    name: 'financial_analyst',
    displayName: 'Financial Analyst',
    level: 6,
    color: 'bg-cyan-100 text-cyan-800'
  },
  READ_ONLY_USER: {
    name: 'read_only_user',
    displayName: 'Read Only User',
    level: 7,
    color: 'bg-gray-100 text-gray-800'
  }
} as const;

export function getRoleDisplayInfo(roleName: string) {
  const role = Object.values(HEALTHCARE_ROLES).find(r => r.name === roleName);
  return role || {
    name: roleName,
    displayName: roleName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    level: 999,
    color: 'bg-gray-100 text-gray-800'
  };
}

// Permission categories for UI
export const PERMISSION_CATEGORIES = {
  DENIALS: 'denials',
  AR_MANAGEMENT: 'ar_management', 
  COLLECTIONS: 'collections',
  CLINICAL_REVIEW: 'clinical_review',
  FINANCIAL_REPORTING: 'financial_reporting',
  USER_MANAGEMENT: 'user_management',
  AUDIT_LOGS: 'audit_logs',
  SYSTEM_SETTINGS: 'system_settings'
} as const;

export function getCategoryDisplayName(category: string): string {
  switch (category) {
    case 'denials': return 'Denials Management';
    case 'ar_management': return 'AR Management';
    case 'collections': return 'Collections';
    case 'clinical_review': return 'Clinical Review';
    case 'financial_reporting': return 'Financial Reporting';
    case 'user_management': return 'User Management';
    case 'audit_logs': return 'Audit Logs';
    case 'system_settings': return 'System Settings';
    default: return category.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }
}

export function getPermissionLevelColor(level: string): string {
  switch (level) {
    case 'view': return 'bg-green-100 text-green-800';
    case 'edit': return 'bg-yellow-100 text-yellow-800';
    case 'manage': return 'bg-[#f8961d]/20 text-[#f8961d]/95';
    case 'admin': return 'bg-[#f13c45]/20 text-[#f13c45]/95';
    default: return 'bg-gray-100 text-gray-800';
  }
}