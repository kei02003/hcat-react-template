import { eq, sql } from "drizzle-orm";

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
    id: "demo_ar_specialist_006",
    email: "ar.specialist@healthcare.demo",
    firstName: "David",
    lastName: "Rodriguez",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP006",
    department: "Accounts Receivable",
    jobTitle: "AR Specialist",
    phoneNumber: "+1-555-0106", 
    roles: ["ar_specialist"]
  },
  {
    id: "demo_collections_007",
    email: "collections@healthcare.demo",
    firstName: "Maria",
    lastName: "Garcia",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP007",
    department: "Collections",
    jobTitle: "Collections Specialist",
    phoneNumber: "+1-555-0107",
    roles: ["collections_specialist"]
  },
  {
    id: "demo_billing_spec_008",
    email: "billing.specialist@healthcare.demo",
    firstName: "James",
    lastName: "Taylor",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP008",
    department: "Billing Operations",
    jobTitle: "Billing Specialist",
    phoneNumber: "+1-555-0108",
    roles: ["billing_specialist"]
  },
  {
    id: "demo_denials_spec_009",
    email: "denials.specialist@healthcare.demo",
    firstName: "Amanda",
    lastName: "White",
    profileImageUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP009",
    department: "Denials Management",
    jobTitle: "Denials Specialist",
    phoneNumber: "+1-555-0109",
    roles: ["denials_specialist"]
  },
  {
    id: "demo_coder_010",
    email: "coder@healthcare.demo",
    firstName: "Kevin",
    lastName: "Brown",
    profileImageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP010",
    department: "Health Information Management",
    jobTitle: "Medical Coder",
    phoneNumber: "+1-555-0110",
    roles: ["medical_coder"]
  },
  {
    id: "demo_analyst_011",
    email: "analyst@healthcare.demo",
    firstName: "Rachel",
    lastName: "Davis",
    profileImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP011",
    department: "Business Intelligence",
    jobTitle: "Data Analyst",
    phoneNumber: "+1-555-0111",
    roles: ["data_analyst"]
  },
  {
    id: "demo_viewer_012",
    email: "viewer@healthcare.demo",
    firstName: "Alex",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face",
    employeeId: "EMP012",
    department: "Operations",
    jobTitle: "Operations Coordinator",
    phoneNumber: "+1-555-0112",
    roles: ["readonly_user"]
  }
];

export class DemoUserService {
  async createDemoUser(userData: DemoUser): Promise<void> {
    try {
      // Simply log demo user creation (no database persistence)
      console.log(`Demo user created: ${userData.firstName} ${userData.lastName} (${userData.email})`);
    } catch (error) {
      console.error(`Failed to create demo user ${userData.email}:`, error);
      throw error;
    }
  }

  async createDemoUsers(): Promise<void> {
    try {
      for (const userData of DEMO_USERS) {
        await this.createDemoUser(userData);
      }
      console.log(`✓ Created ${DEMO_USERS.length} demo users`);
    } catch (error) {
      console.error("Failed to create demo users:", error);
      throw error;
    }
  }

  async listDemoUsers(): Promise<DemoUser[]> {
    // Return static demo user list (no database query)
    return DEMO_USERS;
  }

  async getUserById(userId: string): Promise<DemoUser | null> {
    // Find user in static list
    return DEMO_USERS.find(user => user.id === userId) || null;
  }
}

export const demoUserService = new DemoUserService();