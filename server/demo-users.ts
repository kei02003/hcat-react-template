import { db } from "./db";
import { users, roles, permissions, userRoles, rolePermissions } from "@shared/auth-schema";
import { eq, sql } from "drizzle-orm";
import { rbacService } from "./auth/rbac";

export interface DemoUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  employeeId: string;
  department: string;
  jobTitle: string;
  phoneNumber: string;
  roles: string[];
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo_admin_001",
    email: "admin@healthcare.demo",
    firstName: "Sarah",
    lastName: "Anderson",
    profileImageUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP001",
    department: "IT Administration",
    jobTitle: "System Administrator",
    phoneNumber: "+1-555-0101",
    roles: ["system_administrator"]
  },
  {
    id: "demo_clinical_dir_002",
    email: "clinical.director@healthcare.demo", 
    firstName: "Dr. Michael",
    lastName: "Chen",
    profileImageUrl: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP002",
    department: "Clinical Operations",
    jobTitle: "Clinical Director",
    phoneNumber: "+1-555-0102",
    roles: ["clinical_director"]
  },
  {
    id: "demo_revenue_mgr_003",
    email: "revenue.manager@healthcare.demo",
    firstName: "Jennifer",
    lastName: "Martinez",
    profileImageUrl: "https://images.unsplash.com/photo-1594824388853-bb347f08e4db?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP003", 
    department: "Revenue Cycle",
    jobTitle: "Revenue Cycle Manager",
    phoneNumber: "+1-555-0103",
    roles: ["revenue_cycle_manager"]
  },
  {
    id: "demo_billing_mgr_004",
    email: "billing.manager@healthcare.demo",
    firstName: "Robert",
    lastName: "Thompson",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP004",
    department: "Billing Operations",
    jobTitle: "Billing Manager", 
    phoneNumber: "+1-555-0104",
    roles: ["billing_manager"]
  },
  {
    id: "demo_clinical_rev_005",
    email: "clinical.reviewer@healthcare.demo",
    firstName: "Dr. Lisa",
    lastName: "Wilson",
    profileImageUrl: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP005",
    department: "Clinical Review",
    jobTitle: "Clinical Reviewer",
    phoneNumber: "+1-555-0105", 
    roles: ["clinical_reviewer"]
  },
  {
    id: "demo_denial_spec_006",
    email: "denial.specialist@healthcare.demo",
    firstName: "Amanda",
    lastName: "Davis",
    profileImageUrl: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP006",
    department: "Denial Management",
    jobTitle: "Denial Specialist",
    phoneNumber: "+1-555-0106",
    roles: ["denial_specialist"]
  },
  {
    id: "demo_ar_spec_007", 
    email: "ar.specialist@healthcare.demo",
    firstName: "David",
    lastName: "Rodriguez",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP007",
    department: "Accounts Receivable",
    jobTitle: "AR Specialist",
    phoneNumber: "+1-555-0107",
    roles: ["ar_specialist"]
  },
  {
    id: "demo_collections_008",
    email: "collections@healthcare.demo",
    firstName: "Maria",
    lastName: "Garcia",
    profileImageUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP008",
    department: "Collections",
    jobTitle: "Collections Specialist", 
    phoneNumber: "+1-555-0108",
    roles: ["collections_specialist"]
  },
  {
    id: "demo_financial_009",
    email: "financial.analyst@healthcare.demo",
    firstName: "James",
    lastName: "Brown",
    profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP009",
    department: "Financial Analytics",
    jobTitle: "Financial Analyst",
    phoneNumber: "+1-555-0109",
    roles: ["financial_analyst"]
  },
  {
    id: "demo_readonly_010",
    email: "readonly.user@healthcare.demo",
    firstName: "Emily",
    lastName: "Taylor",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP010",
    department: "Quality Assurance",
    jobTitle: "Quality Analyst",
    phoneNumber: "+1-555-0110",
    roles: ["read_only_user"]
  },
  // Multi-role users for testing
  {
    id: "demo_multi_011",
    email: "multi.role@healthcare.demo",
    firstName: "Kevin",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP011",
    department: "Revenue Cycle",
    jobTitle: "Senior Revenue Analyst",
    phoneNumber: "+1-555-0111",
    roles: ["denial_specialist", "ar_specialist"] // Multiple roles
  },
  {
    id: "demo_supervisor_012",
    email: "supervisor@healthcare.demo",
    firstName: "Rachel",
    lastName: "White",
    profileImageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP012",
    department: "Revenue Cycle",
    jobTitle: "Revenue Supervisor", 
    phoneNumber: "+1-555-0112",
    roles: ["revenue_cycle_manager", "clinical_reviewer"] // Manager with clinical access
  }
];

export class DemoUserService {
  /**
   * Create all demo users with their roles and permissions
   */
  async createDemoUsers(): Promise<void> {
    console.log('Creating demo users...');

    try {
      // First ensure RBAC system is initialized
      await rbacService.initializeRolesAndPermissions();
      
      // Create each demo user
      for (const demoUser of DEMO_USERS) {
        await this.createDemoUser(demoUser);
      }

      console.log(`✓ Created ${DEMO_USERS.length} demo users successfully`);
      
      // Log user summary
      console.log('\n=== Demo Users Summary ===');
      for (const user of DEMO_USERS) {
        console.log(`${user.firstName} ${user.lastName} (${user.email}) - ${user.roles.join(', ')}`);
      }
      
    } catch (error) {
      console.error('Failed to create demo users:', error);
      throw error;
    }
  }

  /**
   * Create a single demo user with roles
   */
  private async createDemoUser(demoUser: DemoUser): Promise<void> {
    try {
      // Insert or update user
      await db
        .insert(users)
        .values({
          id: demoUser.id,
          email: demoUser.email,
          firstName: demoUser.firstName,
          lastName: demoUser.lastName,
          profileImageUrl: demoUser.profileImageUrl,
          employeeId: demoUser.employeeId,
          department: demoUser.department,
          jobTitle: demoUser.jobTitle,
          phoneNumber: demoUser.phoneNumber,
          isActive: true,
          lastLoginAt: new Date()
        })
        .onConflictDoUpdate({
          target: users.id,
          set: {
            email: demoUser.email,
            firstName: demoUser.firstName,
            lastName: demoUser.lastName,
            profileImageUrl: demoUser.profileImageUrl,
            employeeId: demoUser.employeeId,
            department: demoUser.department,
            jobTitle: demoUser.jobTitle,
            phoneNumber: demoUser.phoneNumber,
            updatedAt: new Date()
          }
        });

      // Assign roles to user
      for (const roleName of demoUser.roles) {
        const [role] = await db
          .select()
          .from(roles)
          .where(eq(roles.name, roleName))
          .limit(1);

        if (role) {
          await db
            .insert(userRoles)
            .values({
              userId: demoUser.id,
              roleId: role.id,
              isActive: true,
              assignedAt: new Date()
            })
            .onConflictDoNothing();
        } else {
          console.warn(`Role '${roleName}' not found for user ${demoUser.email}`);
        }
      }

      console.log(`✓ Created demo user: ${demoUser.firstName} ${demoUser.lastName} (${demoUser.email})`);

    } catch (error) {
      console.error(`Failed to create demo user ${demoUser.email}:`, error);
      throw error;
    }
  }

  /**
   * Get demo user by email (for easy testing)
   */
  async getDemoUserByEmail(email: string): Promise<DemoUser | null> {
    return DEMO_USERS.find(user => user.email === email) || null;
  }

  /**
   * List all demo users
   */
  async listDemoUsers(): Promise<DemoUser[]> {
    return DEMO_USERS;
  }

  /**
   * Remove all demo users (for cleanup)
   */
  async removeDemoUsers(): Promise<void> {
    try {
      const demoUserIds = DEMO_USERS.map(user => user.id);
      
      // Remove user roles
      await db.delete(userRoles).where(sql`${userRoles.userId} IN (${sql.join(demoUserIds.map(id => sql`${id}`), sql`, `)})`);
      
      // Remove users
      await db.delete(users).where(sql`${users.id} IN (${sql.join(demoUserIds.map(id => sql`${id}`), sql`, `)})`);
      
      console.log(`✓ Removed ${demoUserIds.length} demo users`);
    } catch (error) {
      console.error('Failed to remove demo users:', error);
      throw error;
    }
  }
}

export const demoUserService = new DemoUserService();