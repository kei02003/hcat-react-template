import { 
  type RevenueCycleAccount, 
  type InsertRevenueCycleAccount,
  type ClinicalDecision,
  type InsertClinicalDecision,
  type DenialWorkflow,
  type InsertDenialWorkflow,
  type AppealCase,
  type InsertAppealCase,
  type TimelyFilingClaim,
  type InsertTimelyFilingClaim,
  type PreauthorizationData,
  type InsertPreauthorizationData,
  type PhysicianAdvisorReview,
  type InsertPhysicianAdvisorReview,
  type DocumentationTracking,
  type InsertDocumentationTracking,
  type Payor,
  type InsertPayor,
  type FeasibilityAnalysis,
  type InsertFeasibilityAnalysis,
  type Department,
  type InsertDepartment,
  type Provider,
  type InsertProvider
} from "@shared/revenue-cycle-schema";
import { randomUUID } from "crypto";

export interface IRevenueCycleStorage {
  // Revenue Cycle Accounts
  getRevenueCycleAccounts(): Promise<RevenueCycleAccount[]>;
  createRevenueCycleAccount(data: InsertRevenueCycleAccount): Promise<RevenueCycleAccount>;
  updateRevenueCycleAccount(id: string, data: Partial<InsertRevenueCycleAccount>): Promise<RevenueCycleAccount | undefined>;
  getRevenueCycleAccountById(id: string): Promise<RevenueCycleAccount | undefined>;

  // Clinical Decisions
  getClinicalDecisions(): Promise<ClinicalDecision[]>;
  createClinicalDecision(data: InsertClinicalDecision): Promise<ClinicalDecision>;
  getClinicalDecisionsByAccount(accountId: string): Promise<ClinicalDecision[]>;

  // Denial Workflows
  getDenialWorkflows(): Promise<DenialWorkflow[]>;
  createDenialWorkflow(data: InsertDenialWorkflow): Promise<DenialWorkflow>;
  getDenialWorkflowsByAccount(accountId: string): Promise<DenialWorkflow[]>;

  // Appeal Cases
  getAppealCases(): Promise<AppealCase[]>;
  createAppealCase(data: InsertAppealCase): Promise<AppealCase>;
  getAppealCasesByAccount(accountId: string): Promise<AppealCase[]>;

  // Timely Filing Claims
  getTimelyFilingClaims(): Promise<TimelyFilingClaim[]>;
  createTimelyFilingClaim(data: InsertTimelyFilingClaim): Promise<TimelyFilingClaim>;
  getTimelyFilingClaimsByRisk(riskLevel: string): Promise<TimelyFilingClaim[]>;

  // Preauthorization Data
  getPreauthorizationData(): Promise<PreauthorizationData[]>;
  createPreauthorizationData(data: InsertPreauthorizationData): Promise<PreauthorizationData>;
  getPreauthorizationByStatus(status: string): Promise<PreauthorizationData[]>;

  // Physician Advisor Reviews
  getPhysicianAdvisorReviews(): Promise<PhysicianAdvisorReview[]>;
  createPhysicianAdvisorReview(data: InsertPhysicianAdvisorReview): Promise<PhysicianAdvisorReview>;

  // Documentation Tracking
  getDocumentationTracking(): Promise<DocumentationTracking[]>;
  createDocumentationTracking(data: InsertDocumentationTracking): Promise<DocumentationTracking>;

  // Payors
  getPayors(): Promise<Payor[]>;
  createPayor(data: InsertPayor): Promise<Payor>;

  // Feasibility Analysis
  getFeasibilityAnalysis(): Promise<FeasibilityAnalysis[]>;
  createFeasibilityAnalysis(data: InsertFeasibilityAnalysis): Promise<FeasibilityAnalysis>;
  getFeasibilityAnalysisByPayor(payorId: string): Promise<FeasibilityAnalysis[]>;

  // Departments
  getDepartments(): Promise<Department[]>;
  createDepartment(data: InsertDepartment): Promise<Department>;

  // Providers
  getProviders(): Promise<Provider[]>;
  createProvider(data: InsertProvider): Promise<Provider>;
}

export class MemoryRevenueCycleStorage implements IRevenueCycleStorage {
  private revenueCycleAccounts = new Map<string, RevenueCycleAccount>();
  private clinicalDecisions = new Map<string, ClinicalDecision>();
  private denialWorkflows = new Map<string, DenialWorkflow>();
  private appealCases = new Map<string, AppealCase>();
  private timelyFilingClaims = new Map<string, TimelyFilingClaim>();
  private preauthorizationData = new Map<string, PreauthorizationData>();
  private physicianAdvisorReviews = new Map<string, PhysicianAdvisorReview>();
  private documentationTracking = new Map<string, DocumentationTracking>();
  private payors = new Map<string, Payor>();
  private feasibilityAnalysis = new Map<string, FeasibilityAnalysis>();
  private departments = new Map<string, Department>();
  private providers = new Map<string, Provider>();

  constructor() {
    this.initializeWithSampleData();
  }

  private initializeWithSampleData() {
    // Initialize Payors first
    this.initializePayors();
    
    // Initialize Departments and Providers
    this.initializeDepartments();
    this.initializeProviders();
    
    // Initialize Revenue Cycle Accounts
    this.initializeRevenueCycleAccounts();
    
    // Initialize related entities
    this.initializeClinicalDecisions();
    this.initializeDenialWorkflows();
    this.initializeAppealCases();
    this.initializeTimelyFilingClaims();
    this.initializePreauthorizationData();
    this.initializePhysicianAdvisorReviews();
    this.initializeDocumentationTracking();
    this.initializeFeasibilityAnalysis();
  }

  private initializePayors() {
    const samplePayors: Array<Omit<Payor, 'payorID' | 'createdDT' | 'updatedDT'>> = [
      {
        payorNM: "Blue Cross Blue Shield",
        payorType: "commercial",
        financialClassCD: "COM01",
        financialClassDSC: "Commercial Insurance",
        filingDeadlineDays: 365,
        contractedRate: 0.85,
        preAuthRequired: "selective"
      },
      {
        payorNM: "Medicare",
        payorType: "medicare",
        financialClassCD: "MED01",
        financialClassDSC: "Medicare Part A & B",
        filingDeadlineDays: 365,
        contractedRate: 0.75,
        preAuthRequired: "no"
      },
      {
        payorNM: "Medicaid",
        payorType: "medicaid",
        financialClassCD: "MCD01",
        financialClassDSC: "State Medicaid",
        filingDeadlineDays: 180,
        contractedRate: 0.65,
        preAuthRequired: "yes"
      },
      {
        payorNM: "Aetna",
        payorType: "commercial",
        financialClassCD: "COM02",
        financialClassDSC: "Commercial Insurance",
        filingDeadlineDays: 180,
        contractedRate: 0.82,
        preAuthRequired: "selective"
      },
      {
        payorNM: "UnitedHealthcare",
        payorType: "commercial",
        financialClassCD: "COM03",
        financialClassDSC: "Commercial Insurance", 
        filingDeadlineDays: 365,
        contractedRate: 0.88,
        preAuthRequired: "yes"
      }
    ];

    samplePayors.forEach(payor => {
      const id = `PAY_${randomUUID().substring(0, 8).toUpperCase()}`;
      this.payors.set(id, {
        ...payor,
        payorID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeDepartments() {
    const sampleDepartments: Array<Omit<Department, 'departmentID' | 'createdDT' | 'updatedDT'>> = [
      {
        departmentNM: "Emergency Department",
        serviceAreaNM: "Emergency Services",
        departmentSpecialtyCD: "EM",
        costCenterCD: "CC001",
        averageChargeAMT: 2500.00,
        denialRatePercentage: 12.5
      },
      {
        departmentNM: "Cardiology",
        serviceAreaNM: "Cardiovascular Services",
        departmentSpecialtyCD: "CARD",
        costCenterCD: "CC002",
        averageChargeAMT: 8500.00,
        denialRatePercentage: 8.2
      },
      {
        departmentNM: "Orthopedic Surgery",
        serviceAreaNM: "Surgical Services",
        departmentSpecialtyCD: "ORTH",
        costCenterCD: "CC003",
        averageChargeAMT: 15000.00,
        denialRatePercentage: 6.8
      },
      {
        departmentNM: "Internal Medicine",
        serviceAreaNM: "Medical Services",
        departmentSpecialtyCD: "IM",
        costCenterCD: "CC004",
        averageChargeAMT: 3200.00,
        denialRatePercentage: 11.2
      }
    ];

    sampleDepartments.forEach(dept => {
      const id = `DEPT_${randomUUID().substring(0, 8).toUpperCase()}`;
      this.departments.set(id, {
        ...dept,
        departmentID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeProviders() {
    const sampleProviders: Array<Omit<Provider, 'providerID' | 'createdDT' | 'updatedDT'>> = [
      {
        providerNM: "Dr. Sarah Mitchell",
        providerType: "attending",
        departmentID: Array.from(this.departments.keys())[2], // Orthopedic Surgery
        specialtyCD: "ORTH",
        productivityScore: 92.5,
        qualityScore: 96.2
      },
      {
        providerNM: "Dr. Michael Chen",
        providerType: "attending",
        departmentID: Array.from(this.departments.keys())[1], // Cardiology
        specialtyCD: "CARD",
        productivityScore: 88.7,
        qualityScore: 94.8
      },
      {
        providerNM: "Dr. Lisa Rodriguez",
        providerType: "attending",
        departmentID: Array.from(this.departments.keys())[0], // Emergency Department
        specialtyCD: "EM",
        productivityScore: 95.2,
        qualityScore: 91.5
      },
      {
        providerNM: "Dr. James Wilson",
        providerType: "attending",
        departmentID: Array.from(this.departments.keys())[3], // Internal Medicine
        specialtyCD: "IM",
        productivityScore: 87.9,
        qualityScore: 93.7
      }
    ];

    sampleProviders.forEach(provider => {
      const id = `PROV_${randomUUID().substring(0, 8).toUpperCase()}`;
      this.providers.set(id, {
        ...provider,
        providerID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeRevenueCycleAccounts() {
    const payorIds = Array.from(this.payors.keys());
    const departmentNames = Array.from(this.departments.values()).map(d => d.departmentNM);
    const providerIds = Array.from(this.providers.keys());
    const providerNames = Array.from(this.providers.values()).map(p => p.providerNM);

    const sampleAccounts: Array<Omit<RevenueCycleAccount, 'hospitalAccountID' | 'createdDT' | 'updatedDT'>> = [
      {
        revenueCycleID: "RC2025001234",
        patientID: "PAT001789",
        patientNM: "Johnson, Robert M.",
        admitDT: new Date("2025-01-05T08:30:00"),
        dischargeDT: new Date("2025-01-08T14:20:00"),
        currentPayorID: payorIds[0],
        currentPayorNM: this.payors.get(payorIds[0])?.payorNM || "Blue Cross Blue Shield",
        currentFinancialClassCD: "COM01",
        attendingProviderID: providerIds[0],
        attendingProviderNM: providerNames[0],
        departmentNM: departmentNames[2], // Orthopedic Surgery
        serviceAreaNM: "Surgical Services",
        hospitalAccountClassCD: "IP",
        finalDRG: "470",
        totalChargeAMT: 25847.50,
        totalPaymentAMT: 21969.38,
        totalAdjustmentAMT: 1250.00,
        denialCD: "CO-27",
        denialCodeDSC: "Expenses incurred after coverage terminated",
        denialCodeGRP: "Coverage",
        denialAccountBalanceAMT: 2628.12,
        billStatusCD: "DENIED"
      },
      {
        revenueCycleID: "RC2025001235",
        patientID: "PAT002456",
        patientNM: "Williams, Maria C.",
        admitDT: new Date("2025-01-06T15:45:00"),
        dischargeDT: new Date("2025-01-07T11:30:00"),
        currentPayorID: payorIds[1],
        currentPayorNM: this.payors.get(payorIds[1])?.payorNM || "Medicare",
        currentFinancialClassCD: "MED01",
        attendingProviderID: providerIds[1],
        attendingProviderNM: providerNames[1],
        departmentNM: departmentNames[1], // Cardiology
        serviceAreaNM: "Cardiovascular Services",
        hospitalAccountClassCD: "IP",
        finalDRG: "287",
        totalChargeAMT: 18650.25,
        totalPaymentAMT: 13987.69,
        totalAdjustmentAMT: 950.00,
        denialCD: "CO-16",
        denialCodeDSC: "Claim/service lacks information",
        denialCodeGRP: "Documentation",
        denialAccountBalanceAMT: 3712.56,
        billStatusCD: "DENIED"
      },
      {
        revenueCycleID: "RC2025001236",
        patientID: "PAT003721",
        patientNM: "Davis, Thomas E.",
        admitDT: new Date("2025-01-07T22:15:00"),
        dischargeDT: new Date("2025-01-09T09:45:00"),
        currentPayorID: payorIds[3],
        currentPayorNM: this.payors.get(payorIds[3])?.payorNM || "Aetna",
        currentFinancialClassCD: "COM02",
        attendingProviderID: providerIds[2],
        attendingProviderNM: providerNames[2],
        departmentNM: departmentNames[0], // Emergency Department
        serviceAreaNM: "Emergency Services",
        hospitalAccountClassCD: "OP",
        finalDRG: null,
        totalChargeAMT: 5247.80,
        totalPaymentAMT: 4303.19,
        totalAdjustmentAMT: 200.00,
        denialCD: null,
        denialCodeDSC: null,
        denialCodeGRP: null,
        denialAccountBalanceAMT: 744.61,
        billStatusCD: "PAID"
      }
    ];

    sampleAccounts.forEach(account => {
      const id = `HSP_${randomUUID().substring(0, 12).toUpperCase()}`;
      this.revenueCycleAccounts.set(id, {
        ...account,
        hospitalAccountID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeClinicalDecisions() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    
    const sampleDecisions: Array<Omit<ClinicalDecision, 'clinicalDecisionID' | 'createdDT' | 'updatedDT'>> = [
      {
        hospitalAccountID: accountIds[0],
        patientID: "PAT001789",
        patientNM: "Johnson, Robert M.",
        departmentNM: "Orthopedic Surgery",
        hospitalAccountClassCD: "IP",
        recommendedAccountClassCD: "IP",
        currentPayorID: Array.from(this.payors.keys())[0],
        denialCD: "CO-27",
        appealProbability: 85,
        confidenceScore: 92,
        complianceScore: 96,
        clinicalEvidence: {
          vitalSigns: { stable: true, complications: false },
          procedures: ["Arthroscopic meniscectomy"],
          medications: ["Pain management", "Antibiotics"],
          length_of_stay: "3 days"
        },
        payorCriteria: {
          medical_necessity: "Met",
          prior_authorization: "Obtained",
          documentation: "Complete"
        },
        reviewStatus: "pending",
        priorityLevel: "high"
      }
    ];

    sampleDecisions.forEach(decision => {
      const id = `CD_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.clinicalDecisions.set(id, {
        ...decision,
        clinicalDecisionID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeDenialWorkflows() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    
    const sampleWorkflows: Array<Omit<DenialWorkflow, 'workflowID' | 'createdDT' | 'updatedDT'>> = [
      {
        accountID: "RC2025001234",
        hospitalAccountID: accountIds[0],
        denialDate: new Date("2025-01-09T10:30:00"),
        appealDeadline: new Date("2025-02-08T23:59:59"),
        workflowStatus: "in_progress",
        assignedTo: "denial.specialist@healthcare.demo",
        priorityLevel: "high",
        appealLevel: "Level 1",
        appealSubmissionDate: null,
        appealOutcome: null,
        recoveredAmount: null,
        workEffortHours: 2.5,
        rootCause: "Missing documentation",
        preventableFlag: "yes"
      }
    ];

    sampleWorkflows.forEach(workflow => {
      const id = `WF_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.denialWorkflows.set(id, {
        ...workflow,
        workflowID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeAppealCases() {
    const workflowIds = Array.from(this.denialWorkflows.keys());
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    const decisionIds = Array.from(this.clinicalDecisions.keys());
    
    const sampleAppeals: Array<Omit<AppealCase, 'appealID' | 'createdDT' | 'updatedDT'>> = [
      {
        workflowID: workflowIds[0],
        hospitalAccountID: accountIds[0],
        clinicalDecisionID: decisionIds[0],
        claimID: "CLM2025001789",
        denialCD: "CO-27",
        currentPayorID: Array.from(this.payors.keys())[0],
        denialAccountBalanceAMT: 2628.12,
        appealProbability: 85,
        appealConfidenceScore: 92,
        appealPriorityLevel: "high",
        clinicalEvidence: {
          supporting_documentation: "Complete surgical notes",
          medical_necessity: "Clearly documented",
          policy_compliance: "Met all requirements"
        },
        payorCriteria: {
          coverage_policy: "Active during service",
          authorization: "Pre-auth obtained"
        },
        appealStrengthAnalysis: {
          documentation_strength: 90,
          medical_necessity_strength: 95,
          policy_compliance_strength: 85
        },
        letterStatus: "draft",
        expectedRecoveryAMT: 2628.12,
        netRecoveryAMT: null,
        workflowStatus: "pending",
        appealSubmissionDT: null,
        appealResponseDT: null
      }
    ];

    sampleAppeals.forEach(appeal => {
      const id = `APP_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.appealCases.set(id, {
        ...appeal,
        appealID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeTimelyFilingClaims() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    const payorIds = Array.from(this.payors.keys());
    
    const sampleClaims: Array<Omit<TimelyFilingClaim, 'timelyFilingID' | 'createdDT' | 'updatedDT'>> = [
      {
        hospitalAccountID: accountIds[0],
        claimID: "CLM2025001789",
        patientID: "PAT001789",
        currentPayorID: payorIds[0],
        serviceDT: new Date("2025-01-05T08:30:00"),
        billingDT: new Date("2025-01-09T16:00:00"),
        filingDeadlineDT: new Date("2025-01-05T23:59:59"),
        daysRemaining: -4,
        agingCategory: "120+",
        totalChargeAMT: 25847.50,
        denialStatus: "denied",
        denialCD: "CO-27",
        filingAttempts: 1,
        filingStatus: "rejected",
        riskLevel: "critical",
        priorityLevel: "critical",
        assignedBillerID: "BILL001",
        documentationComplete: "no"
      }
    ];

    sampleClaims.forEach(claim => {
      const id = `TF_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.timelyFilingClaims.set(id, {
        ...claim,
        timelyFilingID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializePreauthorizationData() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    
    const samplePreauth: Array<Omit<PreauthorizationData, 'preAuthID' | 'createdDT' | 'updatedDT'>> = [
      {
        accountID: "RC2025001234",
        hospitalAccountID: accountIds[0],
        serviceType: "Arthroscopic Surgery",
        procedureDate: new Date("2025-01-05T10:00:00"),
        requestDate: new Date("2025-01-02T14:30:00"),
        responseDate: new Date("2025-01-03T11:15:00"),
        daysBeforeProcedure: 3,
        completedOnTime: "yes",
        status: "approved",
        authNumber: "AUTH2025001234",
        requestedUnits: 1,
        approvedUnits: 1,
        denialReason: null,
        priority: "routine",
        physicianAdvisorReview: "not_required"
      }
    ];

    samplePreauth.forEach(preauth => {
      const id = `PA_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.preauthorizationData.set(id, {
        ...preauth,
        preAuthID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializePhysicianAdvisorReviews() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    
    const sampleReviews: Array<Omit<PhysicianAdvisorReview, 'reviewID' | 'createdDT' | 'updatedDT'>> = [
      {
        accountID: "RC2025001234",
        hospitalAccountID: accountIds[0],
        physicianAdvisorID: "PHYS_ADV_001",
        physicianAdvisorName: "Dr. Amanda Thompson",
        reviewDate: new Date("2025-01-09T09:00:00"),
        reviewType: "retrospective",
        reviewOutcome: "upheld",
        clinicalJustification: "Surgical intervention was medically necessary based on patient symptoms and MRI findings.",
        recommendedLevelOfCare: "Inpatient",
        estimatedSavings: 0.00,
        appealRequired: "yes",
        documentationComplete: "yes",
        reviewTurnaroundHours: 4
      }
    ];

    sampleReviews.forEach(review => {
      const id = `PR_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.physicianAdvisorReviews.set(id, {
        ...review,
        reviewID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeDocumentationTracking() {
    const accountIds = Array.from(this.revenueCycleAccounts.keys());
    const providerIds = Array.from(this.providers.keys());
    
    const sampleDocs: Array<Omit<DocumentationTracking, 'documentID' | 'createdDT' | 'updatedDT'>> = [
      {
        accountID: "RC2025001234",
        hospitalAccountID: accountIds[0],
        documentType: "Operative Report",
        documentDate: new Date("2025-01-05T12:30:00"),
        documentStatus: "completed",
        providerID: providerIds[0],
        complianceFlag: "compliant",
        timelinessMet: "yes",
        cdiReviewRequired: "completed",
        cdiQueryStatus: "not_required",
        impactOnDRG: "none",
        estimatedRevenueImpact: 0.00,
        qualityIndicator: "High"
      }
    ];

    sampleDocs.forEach(doc => {
      const id = `DOC_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.documentationTracking.set(id, {
        ...doc,
        documentID: id,
        createdDT: new Date(),
        updatedDT: new Date()
      });
    });
  }

  private initializeFeasibilityAnalysis() {
    const payorIds = Array.from(this.payors.keys());
    const payorNames = Array.from(this.payors.values()).map(p => p.payorNM);
    
    const sampleAnalysis: Array<Omit<FeasibilityAnalysis, 'analysisID'>> = [
      {
        payorID: payorIds[0],
        payorNM: payorNames[0],
        totalClaimCount: 1250,
        totalClaimAMT: 2875000.00,
        totalDenialCount: 156,
        appealableAMT: 324500.00,
        appealRatePercentage: 68.50,
        estimatedRecoveryAMT: 222275.00,
        redundantCount: 23,
        redundancyRatePercentage: 14.74,
        totalWastedCostAMT: 8750.00,
        roiPercentage: 89.25,
        denialCategoryAnalysis: {
          coverage: 45,
          documentation: 67,
          medical_necessity: 32,
          authorization: 12
        },
        requestTypeAnalysis: {
          prior_auth: 78,
          medical_records: 45,
          clinical_notes: 23,
          lab_results: 10
        },
        performanceMetrics: {
          average_appeal_time: 14.5,
          success_rate: 68.5,
          cost_per_appeal: 125.50
        },
        analysisDT: new Date(),
        periodStartDT: new Date("2024-10-01"),
        periodEndDT: new Date("2024-12-31")
      }
    ];

    sampleAnalysis.forEach(analysis => {
      const id = `FA_${randomUUID().substring(0, 10).toUpperCase()}`;
      this.feasibilityAnalysis.set(id, {
        ...analysis,
        analysisID: id
      });
    });
  }

  // Implementation of interface methods
  async getRevenueCycleAccounts(): Promise<RevenueCycleAccount[]> {
    return Array.from(this.revenueCycleAccounts.values());
  }

  async createRevenueCycleAccount(data: InsertRevenueCycleAccount): Promise<RevenueCycleAccount> {
    const id = `HSP_${randomUUID().substring(0, 12).toUpperCase()}`;
    const account: RevenueCycleAccount = {
      ...data,
      hospitalAccountID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.revenueCycleAccounts.set(id, account);
    return account;
  }

  async updateRevenueCycleAccount(id: string, data: Partial<InsertRevenueCycleAccount>): Promise<RevenueCycleAccount | undefined> {
    const existing = this.revenueCycleAccounts.get(id);
    if (!existing) return undefined;
    
    const updated: RevenueCycleAccount = {
      ...existing,
      ...data,
      updatedDT: new Date()
    };
    this.revenueCycleAccounts.set(id, updated);
    return updated;
  }

  async getRevenueCycleAccountById(id: string): Promise<RevenueCycleAccount | undefined> {
    return this.revenueCycleAccounts.get(id);
  }

  async getClinicalDecisions(): Promise<ClinicalDecision[]> {
    return Array.from(this.clinicalDecisions.values());
  }

  async createClinicalDecision(data: InsertClinicalDecision): Promise<ClinicalDecision> {
    const id = `CD_${randomUUID().substring(0, 10).toUpperCase()}`;
    const decision: ClinicalDecision = {
      ...data,
      clinicalDecisionID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.clinicalDecisions.set(id, decision);
    return decision;
  }

  async getClinicalDecisionsByAccount(accountId: string): Promise<ClinicalDecision[]> {
    return Array.from(this.clinicalDecisions.values()).filter(d => d.hospitalAccountID === accountId);
  }

  async getDenialWorkflows(): Promise<DenialWorkflow[]> {
    return Array.from(this.denialWorkflows.values());
  }

  async createDenialWorkflow(data: InsertDenialWorkflow): Promise<DenialWorkflow> {
    const id = `WF_${randomUUID().substring(0, 10).toUpperCase()}`;
    const workflow: DenialWorkflow = {
      ...data,
      workflowID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.denialWorkflows.set(id, workflow);
    return workflow;
  }

  async getDenialWorkflowsByAccount(accountId: string): Promise<DenialWorkflow[]> {
    return Array.from(this.denialWorkflows.values()).filter(w => w.hospitalAccountID === accountId);
  }

  async getAppealCases(): Promise<AppealCase[]> {
    return Array.from(this.appealCases.values());
  }

  async createAppealCase(data: InsertAppealCase): Promise<AppealCase> {
    const id = `APP_${randomUUID().substring(0, 10).toUpperCase()}`;
    const appeal: AppealCase = {
      ...data,
      appealID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.appealCases.set(id, appeal);
    return appeal;
  }

  async getAppealCasesByAccount(accountId: string): Promise<AppealCase[]> {
    return Array.from(this.appealCases.values()).filter(a => a.hospitalAccountID === accountId);
  }

  async getTimelyFilingClaims(): Promise<TimelyFilingClaim[]> {
    return Array.from(this.timelyFilingClaims.values());
  }

  async createTimelyFilingClaim(data: InsertTimelyFilingClaim): Promise<TimelyFilingClaim> {
    const id = `TF_${randomUUID().substring(0, 10).toUpperCase()}`;
    const claim: TimelyFilingClaim = {
      ...data,
      timelyFilingID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.timelyFilingClaims.set(id, claim);
    return claim;
  }

  async getTimelyFilingClaimsByRisk(riskLevel: string): Promise<TimelyFilingClaim[]> {
    return Array.from(this.timelyFilingClaims.values()).filter(c => c.riskLevel === riskLevel);
  }

  async getPreauthorizationData(): Promise<PreauthorizationData[]> {
    return Array.from(this.preauthorizationData.values());
  }

  async createPreauthorizationData(data: InsertPreauthorizationData): Promise<PreauthorizationData> {
    const id = `PA_${randomUUID().substring(0, 10).toUpperCase()}`;
    const preauth: PreauthorizationData = {
      ...data,
      preAuthID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.preauthorizationData.set(id, preauth);
    return preauth;
  }

  async getPreauthorizationByStatus(status: string): Promise<PreauthorizationData[]> {
    return Array.from(this.preauthorizationData.values()).filter(p => p.status === status);
  }

  async getPhysicianAdvisorReviews(): Promise<PhysicianAdvisorReview[]> {
    return Array.from(this.physicianAdvisorReviews.values());
  }

  async createPhysicianAdvisorReview(data: InsertPhysicianAdvisorReview): Promise<PhysicianAdvisorReview> {
    const id = `PR_${randomUUID().substring(0, 10).toUpperCase()}`;
    const review: PhysicianAdvisorReview = {
      ...data,
      reviewID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.physicianAdvisorReviews.set(id, review);
    return review;
  }

  async getDocumentationTracking(): Promise<DocumentationTracking[]> {
    return Array.from(this.documentationTracking.values());
  }

  async createDocumentationTracking(data: InsertDocumentationTracking): Promise<DocumentationTracking> {
    const id = `DOC_${randomUUID().substring(0, 10).toUpperCase()}`;
    const doc: DocumentationTracking = {
      ...data,
      documentID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.documentationTracking.set(id, doc);
    return doc;
  }

  async getPayors(): Promise<Payor[]> {
    return Array.from(this.payors.values());
  }

  async createPayor(data: InsertPayor): Promise<Payor> {
    const id = `PAY_${randomUUID().substring(0, 8).toUpperCase()}`;
    const payor: Payor = {
      ...data,
      payorID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.payors.set(id, payor);
    return payor;
  }

  async getFeasibilityAnalysis(): Promise<FeasibilityAnalysis[]> {
    return Array.from(this.feasibilityAnalysis.values());
  }

  async createFeasibilityAnalysis(data: InsertFeasibilityAnalysis): Promise<FeasibilityAnalysis> {
    const id = `FA_${randomUUID().substring(0, 10).toUpperCase()}`;
    const analysis: FeasibilityAnalysis = {
      ...data,
      analysisID: id
    };
    this.feasibilityAnalysis.set(id, analysis);
    return analysis;
  }

  async getFeasibilityAnalysisByPayor(payorId: string): Promise<FeasibilityAnalysis[]> {
    return Array.from(this.feasibilityAnalysis.values()).filter(f => f.payorID === payorId);
  }

  async getDepartments(): Promise<Department[]> {
    return Array.from(this.departments.values());
  }

  async createDepartment(data: InsertDepartment): Promise<Department> {
    const id = `DEPT_${randomUUID().substring(0, 8).toUpperCase()}`;
    const department: Department = {
      ...data,
      departmentID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.departments.set(id, department);
    return department;
  }

  async getProviders(): Promise<Provider[]> {
    return Array.from(this.providers.values());
  }

  async createProvider(data: InsertProvider): Promise<Provider> {
    const id = `PROV_${randomUUID().substring(0, 8).toUpperCase()}`;
    const provider: Provider = {
      ...data,
      providerID: id,
      createdDT: new Date(),
      updatedDT: new Date()
    };
    this.providers.set(id, provider);
    return provider;
  }
}

export const revenueCycleStorage = new MemoryRevenueCycleStorage();