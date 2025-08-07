// Demo data for the redesigned pre-authorization management module

export const demoPreAuthTimeline = [
  {
    id: "timeline-001",
    patientId: "PAT-1234",
    patientName: "Maria Rodriguez",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    scheduledDate: "2025-02-15",
    daysUntilProcedure: 12,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-12",
    currentStatus: "flagged" as const,
    payerId: "bcbs-001",
    payerName: "Blue Cross Blue Shield",
    estimatedProcessingDays: 3
  },
  {
    id: "timeline-002", 
    patientId: "PAT-5678",
    patientName: "James Wilson",
    procedureCode: "92928",
    procedureName: "Coronary Stent Placement",
    scheduledDate: "2025-01-28",
    daysUntilProcedure: 2,
    urgencyLevel: "red" as const,
    authRequiredBy: "2025-01-25",
    currentStatus: "submitted" as const,
    payerId: "uhc-001",
    payerName: "United Healthcare",
    estimatedProcessingDays: 5
  },
  {
    id: "timeline-003",
    patientId: "PAT-9012",
    patientName: "Sarah Johnson",
    procedureCode: "29881",
    procedureName: "Arthroscopic Knee Surgery",
    scheduledDate: "2025-03-05",
    daysUntilProcedure: 35,
    urgencyLevel: "green" as const,
    authRequiredBy: "2025-03-02",
    currentStatus: "approved" as const,
    payerId: "medicare-001",
    payerName: "Medicare",
    estimatedProcessingDays: 7
  },
  {
    id: "timeline-004",
    patientId: "PAT-3456",
    patientName: "David Brown",
    procedureCode: "47563",
    procedureName: "Laparoscopic Cholecystectomy",
    scheduledDate: "2025-02-08",
    daysUntilProcedure: 5,
    urgencyLevel: "red" as const,
    authRequiredBy: "2025-02-05",
    currentStatus: "flagged" as const,
    payerId: "medicaid-001",
    payerName: "Medicaid",
    estimatedProcessingDays: 4
  },
  {
    id: "timeline-005",
    patientId: "PAT-7890",
    patientName: "Emma Davis",
    procedureCode: "19307",
    procedureName: "Breast Reconstruction",
    scheduledDate: "2025-02-20",
    daysUntilProcedure: 17,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-17",
    currentStatus: "submitted" as const,
    payerId: "bcbs-001",
    payerName: "Blue Cross Blue Shield", 
    estimatedProcessingDays: 3
  }
];

export const demoComplianceMetrics = {
  id: "compliance-001",
  period: "weekly",
  periodDate: "2025-01-26",
  totalRequests: 47,
  submittedOnTime: 38,
  submittedLate: 9,
  compliancePercentage: 80.85,
  avgDaysToSubmission: 2.7,
  department: "All"
};

export const demoPayerResponseAnalytics = [
  {
    id: "payer-001",
    payerId: "bcbs-001",
    payerName: "Blue Cross Blue Shield",
    avgResponseDays: 3.2,
    approvalRate: 87.5,
    denialRate: 12.5,
    totalRequests: 156,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  },
  {
    id: "payer-002",
    payerId: "uhc-001", 
    payerName: "United Healthcare",
    avgResponseDays: 4.1,
    approvalRate: 82.3,
    denialRate: 17.7,
    totalRequests: 134,
    monthYear: "2025-01",
    trendDirection: "stable" as const
  },
  {
    id: "payer-003",
    payerId: "medicare-001",
    payerName: "Medicare",
    avgResponseDays: 5.8,
    approvalRate: 91.2,
    denialRate: 8.8,
    totalRequests: 89,
    monthYear: "2025-01", 
    trendDirection: "declining" as const
  },
  {
    id: "payer-004",
    payerId: "medicaid-001",
    payerName: "Medicaid",
    avgResponseDays: 6.5,
    approvalRate: 79.4,
    denialRate: 20.6,
    totalRequests: 67,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  }
];

export const demoDocumentationAlerts = [
  {
    id: "alert-001",
    preAuthRequestId: "pre-001",
    patientName: "Maria Rodriguez",
    procedureName: "Total Knee Replacement",
    missingDocuments: [
      "Operative Report",
      "X-ray Images", 
      "Insurance Verification"
    ],
    alertPriority: "high" as const,
    daysOverdue: 3,
    payerName: "Blue Cross Blue Shield",
    directLink: "/documents/pre-001",
    isResolved: false,
    assignedTo: "Sarah Johnson"
  },
  {
    id: "alert-002",
    preAuthRequestId: "pre-002",
    patientName: "James Wilson",
    procedureName: "Coronary Stent Placement", 
    missingDocuments: [
      "Cardiac Catheterization Report",
      "EKG Results"
    ],
    alertPriority: "critical" as const,
    daysOverdue: 5,
    payerName: "United Healthcare",
    directLink: "/documents/pre-002",
    isResolved: false,
    assignedTo: "Dr. Michael Chen"
  },
  {
    id: "alert-003",
    preAuthRequestId: "pre-003", 
    patientName: "David Brown",
    procedureName: "Laparoscopic Cholecystectomy",
    missingDocuments: [
      "Ultrasound Report",
      "Lab Results",
      "Physician Notes"
    ],
    alertPriority: "medium" as const,
    daysOverdue: 1,
    payerName: "Medicaid",
    directLink: "/documents/pre-003",
    isResolved: false,
    assignedTo: "Amanda Davis"
  },
  {
    id: "alert-004",
    preAuthRequestId: "pre-004",
    patientName: "Emma Davis",
    procedureName: "Breast Reconstruction",
    missingDocuments: [
      "Pathology Report"
    ],
    alertPriority: "low" as const,
    daysOverdue: 0,
    payerName: "Blue Cross Blue Shield",
    directLink: "/documents/pre-004", 
    isResolved: false,
    assignedTo: "Jennifer Martinez"
  }
];

export const demoStatusGridData = [
  {
    status: "pending",
    count: 23,
    percentage: 42.6,
    trend: "up" as const,
    color: "#f59e0b"
  },
  {
    status: "approved", 
    count: 18,
    percentage: 33.3,
    trend: "stable" as const,
    color: "#10b981"
  },
  {
    status: "denied",
    count: 8,
    percentage: 14.8,
    trend: "down" as const,
    color: "#ef4444"
  },
  {
    status: "expired",
    count: 5,
    percentage: 9.3,
    trend: "up" as const,
    color: "#6b7280"
  }
];

export const demoProcedureFlaggingRules = [
  {
    id: "rule-001",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    payerId: "bcbs-001",
    payerName: "Blue Cross Blue Shield",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 3,
    criteriaChecks: {
      minAge: 18,
      maxAge: 85,
      requiredDiagnoses: ["M17.11", "M17.12"],
      exclusionCriteria: ["active_infection", "insufficient_bone_stock"]
    },
    riskLevel: "medium" as const,
    isActive: true
  },
  {
    id: "rule-002", 
    procedureCode: "92928",
    procedureName: "Coronary Stent Placement",
    payerId: null,
    payerName: null,
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 1,
    criteriaChecks: {
      urgentCriteria: ["acute_mi", "unstable_angina"],
      requiredStudies: ["cardiac_cath", "ekg"]
    },
    riskLevel: "high" as const,
    isActive: true
  }
];

export const demoPayerCriteriaLibrary = [
  {
    id: "criteria-001",
    payerId: "bcbs-001",
    payerName: "Blue Cross Blue Shield",
    procedureCode: "27447",
    procedureName: "Total Knee Replacement",
    criteriaType: "medical_necessity" as const,
    criteria: {
      clinicalRequirements: [
        "Documented osteoarthritis with radiographic evidence",
        "Failed conservative treatment for 6+ months",
        "Significant functional limitation documented",
        "Pain level 7/10 or higher for 3+ months"
      ],
      exclusionCriteria: [
        "Active infection at surgical site",
        "Insufficient bone stock",
        "Medical contraindications to anesthesia",
        "Pregnancy"
      ],
      requiredDocumentation: [
        "X-rays showing joint space narrowing",
        "Physical therapy records",
        "Pain medication trial documentation", 
        "Functional assessment scores"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: null,
    isActive: true
  },
  {
    id: "criteria-002",
    payerId: "uhc-001", 
    payerName: "United Healthcare",
    procedureCode: "92928",
    procedureName: "Coronary Stent Placement",
    criteriaType: "coverage_policy" as const,
    criteria: {
      coverageRequirements: [
        "Documented coronary artery disease >70% stenosis",
        "Symptoms refractory to medical therapy",
        "Vessel diameter >2.5mm",
        "Life expectancy >1 year"
      ],
      priorAuthRequired: [
        "Non-emergent procedures only",
        "Must have cardiology consultation",
        "Stress test within 6 months",
        "Echo within 1 year"
      ],
      emergencyExceptions: [
        "STEMI presentation",
        "Unstable angina with high risk features",
        "Cardiogenic shock"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: null,
    isActive: true
  }
];