// Demo data for the redesigned pre-authorization management module

export const demoPreAuthTimeline = [
  {
    id: "timeline-001",
    patientId: "MRN-458721",
    patientName: "Patricia Chen, Age 67",
    procedureCode: "27447",
    procedureName: "Total Knee Arthroplasty (Right)",
    scheduledDate: "2025-02-18",
    daysUntilProcedure: 15,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-15",
    currentStatus: "flagged" as const,
    payerId: "bcbs-medicare",
    payerName: "BCBS Medicare Advantage",
    estimatedProcessingDays: 5
  },
  {
    id: "timeline-002", 
    patientId: "MRN-692134",
    patientName: "Robert Martinez, Age 58",
    procedureCode: "33533",
    procedureName: "Coronary Artery Bypass (CABG x3)",
    scheduledDate: "2025-01-30",
    daysUntilProcedure: 4,
    urgencyLevel: "red" as const,
    authRequiredBy: "2025-01-27",
    currentStatus: "submitted" as const,
    payerId: "uhc-commercial",
    payerName: "United Healthcare Commercial",
    estimatedProcessingDays: 3
  },
  {
    id: "timeline-003",
    patientId: "MRN-847293",
    patientName: "Jennifer Walsh, Age 42",
    procedureCode: "29881",
    procedureName: "Arthroscopy Knee with Meniscectomy",
    scheduledDate: "2025-03-12",
    daysUntilProcedure: 42,
    urgencyLevel: "green" as const,
    authRequiredBy: "2025-03-09",
    currentStatus: "approved" as const,
    payerId: "aetna-ppo",
    payerName: "Aetna Better Health PPO",
    estimatedProcessingDays: 7
  },
  {
    id: "timeline-004",
    patientId: "MRN-351784",
    patientName: "Michael Thompson, Age 53",
    procedureCode: "47562",
    procedureName: "Laparoscopic Cholecystectomy",
    scheduledDate: "2025-02-06",
    daysUntilProcedure: 3,
    urgencyLevel: "red" as const,
    authRequiredBy: "2025-02-03",
    currentStatus: "flagged" as const,
    payerId: "medicaid-managed",
    payerName: "Medicaid Managed Care",
    estimatedProcessingDays: 2
  },
  {
    id: "timeline-005",
    patientId: "MRN-729456",
    patientName: "Susan Rodriguez, Age 48",
    procedureCode: "19307",
    procedureName: "Mastectomy with Immediate Reconstruction",
    scheduledDate: "2025-02-25",
    daysUntilProcedure: 22,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-22",
    currentStatus: "submitted" as const,
    payerId: "cigna-healthspring",
    payerName: "Cigna HealthSpring", 
    estimatedProcessingDays: 4
  },
  {
    id: "timeline-006",
    patientId: "MRN-163928",
    patientName: "David Kim, Age 71",
    procedureCode: "43775",
    procedureName: "Laparoscopic Gastric Bypass",
    scheduledDate: "2025-03-20",
    daysUntilProcedure: 50,
    urgencyLevel: "green" as const,
    authRequiredBy: "2025-03-17",
    currentStatus: "approved" as const,
    payerId: "medicare-traditional",
    payerName: "Medicare Fee-for-Service",
    estimatedProcessingDays: 14
  },
  {
    id: "timeline-007",
    patientId: "MRN-892475",
    patientName: "Lisa Jackson, Age 35",
    procedureCode: "58571",
    procedureName: "Laparoscopic Hysterectomy",
    scheduledDate: "2025-02-14",
    daysUntilProcedure: 11,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-11",
    currentStatus: "denied" as const,
    payerId: "bcbs-federal",
    payerName: "BCBS Federal Employee Program",
    estimatedProcessingDays: 5
  },
  {
    id: "timeline-008",
    patientId: "MRN-645123",
    patientName: "Carlos Hernandez, Age 62",
    procedureCode: "92928",
    procedureName: "Percutaneous Coronary Intervention (PCI)",
    scheduledDate: "2025-01-29",
    daysUntilProcedure: 3,
    urgencyLevel: "red" as const,
    authRequiredBy: "2025-01-26",
    currentStatus: "approved" as const,
    payerId: "humana-medicare",
    payerName: "Humana Medicare Advantage",
    estimatedProcessingDays: 2
  },
  {
    id: "timeline-009",
    patientId: "MRN-378951",
    patientName: "Angela Foster, Age 39",
    procedureCode: "64483",
    procedureName: "Transforaminal Epidural Injection",
    scheduledDate: "2025-02-11",
    daysUntilProcedure: 8,
    urgencyLevel: "yellow" as const,
    authRequiredBy: "2025-02-08",
    currentStatus: "flagged" as const,
    payerId: "anthem-commercial",
    payerName: "Anthem Commercial",
    estimatedProcessingDays: 3
  },
  {
    id: "timeline-010",
    patientId: "MRN-156742",
    patientName: "Thomas Wilson, Age 59",
    procedureCode: "63047",
    procedureName: "Lumbar Laminectomy L4-L5",
    scheduledDate: "2025-03-05",
    daysUntilProcedure: 35,
    urgencyLevel: "green" as const,
    authRequiredBy: "2025-03-02",
    currentStatus: "expired" as const,
    payerId: "tricare-standard",
    payerName: "TRICARE Standard",
    estimatedProcessingDays: 10
  }
];

export const demoComplianceMetrics = {
  id: "compliance-001",
  period: "weekly",
  periodDate: "2025-01-26",
  totalRequests: 127,
  submittedOnTime: 102,
  submittedLate: 25,
  compliancePercentage: 80.31,
  avgDaysToSubmission: 2.4,
  department: "All Departments",
  departmentBreakdown: {
    "Orthopedic Surgery": { total: 34, onTime: 28, rate: 82.35 },
    "Cardiothoracic Surgery": { total: 18, onTime: 16, rate: 88.89 },
    "General Surgery": { total: 25, onTime: 19, rate: 76.00 },
    "Interventional Cardiology": { total: 15, onTime: 13, rate: 86.67 },
    "Oncology Surgery": { total: 21, onTime: 17, rate: 80.95 },
    "Pain Management": { total: 14, onTime: 9, rate: 64.29 }
  }
};

export const demoPayerResponseAnalytics = [
  {
    id: "payer-001",
    payerId: "bcbs-medicare",
    payerName: "BCBS Medicare Advantage",
    avgResponseDays: 4.2,
    approvalRate: 84.7,
    denialRate: 15.3,
    totalRequests: 289,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  },
  {
    id: "payer-002",
    payerId: "uhc-commercial", 
    payerName: "United Healthcare Commercial",
    avgResponseDays: 2.8,
    approvalRate: 91.2,
    denialRate: 8.8,
    totalRequests: 234,
    monthYear: "2025-01",
    trendDirection: "stable" as const
  },
  {
    id: "payer-003",
    payerId: "medicare-traditional",
    payerName: "Medicare Fee-for-Service",
    avgResponseDays: 7.3,
    approvalRate: 88.9,
    denialRate: 11.1,
    totalRequests: 156,
    monthYear: "2025-01", 
    trendDirection: "declining" as const
  },
  {
    id: "payer-004",
    payerId: "medicaid-managed",
    payerName: "Medicaid Managed Care",
    avgResponseDays: 5.1,
    approvalRate: 76.4,
    denialRate: 23.6,
    totalRequests: 142,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  },
  {
    id: "payer-005",
    payerId: "aetna-ppo",
    payerName: "Aetna Better Health PPO",
    avgResponseDays: 3.4,
    approvalRate: 89.1,
    denialRate: 10.9,
    totalRequests: 187,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  },
  {
    id: "payer-006",
    payerId: "cigna-healthspring",
    payerName: "Cigna HealthSpring",
    avgResponseDays: 4.8,
    approvalRate: 82.6,
    denialRate: 17.4,
    totalRequests: 98,
    monthYear: "2025-01",
    trendDirection: "stable" as const
  },
  {
    id: "payer-007",
    payerId: "humana-medicare",
    payerName: "Humana Medicare Advantage",
    avgResponseDays: 3.9,
    approvalRate: 86.7,
    denialRate: 13.3,
    totalRequests: 121,
    monthYear: "2025-01",
    trendDirection: "improving" as const
  },
  {
    id: "payer-008",
    payerId: "anthem-commercial",
    payerName: "Anthem Commercial",
    avgResponseDays: 3.1,
    approvalRate: 90.5,
    denialRate: 9.5,
    totalRequests: 167,
    monthYear: "2025-01",
    trendDirection: "stable" as const
  }
];

export const demoDocumentationAlerts = [
  {
    id: "alert-001",
    preAuthRequestId: "PA-2025-001847",
    patientName: "Patricia Chen, Age 67",
    procedureName: "Total Knee Arthroplasty (Right)",
    missingDocuments: [
      "Pre-operative X-rays (Weight-bearing AP/Lateral)",
      "Physical Therapy Records (6+ months)",
      "Conservative Treatment Documentation",
      "BMI Documentation (<40 required)"
    ],
    alertPriority: "high" as const,
    daysOverdue: 2,
    payerName: "BCBS Medicare Advantage",
    directLink: "/pre-auth/documents/PA-2025-001847",
    isResolved: false,
    assignedTo: "Jennifer Martinez, Prior Auth Specialist"
  },
  {
    id: "alert-002",
    preAuthRequestId: "PA-2025-001863",
    patientName: "Robert Martinez, Age 58",
    procedureName: "Coronary Artery Bypass (CABG x3)", 
    missingDocuments: [
      "Cardiac Catheterization Report with Vessel Assessment",
      "Ejection Fraction Documentation (Echo/MUGA)",
      "Surgical Risk Assessment",
      "Anesthesia Clearance"
    ],
    alertPriority: "critical" as const,
    daysOverdue: 1,
    payerName: "United Healthcare Commercial",
    directLink: "/pre-auth/documents/PA-2025-001863",
    isResolved: false,
    assignedTo: "Dr. Michael Chen, Cardiothoracic Surgery"
  },
  {
    id: "alert-003",
    preAuthRequestId: "PA-2025-001829", 
    patientName: "Lisa Jackson, Age 35",
    procedureName: "Laparoscopic Hysterectomy",
    missingDocuments: [
      "Pelvic Ultrasound Report",
      "Failed Conservative Management Documentation",
      "Gynecologic Oncology Clearance (if indicated)",
      "Pathology from Previous Biopsies"
    ],
    alertPriority: "high" as const,
    daysOverdue: 4,
    payerName: "BCBS Federal Employee Program",
    directLink: "/pre-auth/documents/PA-2025-001829",
    isResolved: false,
    assignedTo: "Amanda Davis, Denial Management"
  },
  {
    id: "alert-004",
    preAuthRequestId: "PA-2025-001756",
    patientName: "Susan Rodriguez, Age 48",
    procedureName: "Mastectomy with Immediate Reconstruction",
    missingDocuments: [
      "Oncology Multidisciplinary Team Notes",
      "Genetic Counseling Report (if BRCA+)",
      "Plastic Surgery Consultation",
      "Insurance Verification for Reconstruction Coverage"
    ],
    alertPriority: "medium" as const,
    daysOverdue: 1,
    payerName: "Cigna HealthSpring",
    directLink: "/pre-auth/documents/PA-2025-001756", 
    isResolved: false,
    assignedTo: "Rachel White, Revenue Cycle Supervisor"
  },
  {
    id: "alert-005",
    preAuthRequestId: "PA-2025-001692",
    patientName: "Angela Foster, Age 39",
    procedureName: "Transforaminal Epidural Injection",
    missingDocuments: [
      "MRI Lumbar Spine (within 6 months)",
      "Physical Therapy Trial Documentation",
      "Pain Management Consultation Notes",
      "Functional Assessment Scores"
    ],
    alertPriority: "medium" as const,
    daysOverdue: 0,
    payerName: "Anthem Commercial",
    directLink: "/pre-auth/documents/PA-2025-001692",
    isResolved: false,
    assignedTo: "David Rodriguez, AR Specialist"
  },
  {
    id: "alert-006",
    preAuthRequestId: "PA-2025-001534",
    patientName: "David Kim, Age 71",
    procedureName: "Laparoscopic Gastric Bypass",
    missingDocuments: [
      "Psychological Evaluation",
      "Nutritionist Consultation",
      "Bariatric Surgery Program Documentation",
      "Comorbidity Documentation (DM, HTN, Sleep Apnea)"
    ],
    alertPriority: "low" as const,
    daysOverdue: 0,
    payerName: "Medicare Fee-for-Service",
    directLink: "/pre-auth/documents/PA-2025-001534",
    isResolved: false,
    assignedTo: "Maria Garcia, Collections Specialist"
  }
];

export const demoStatusGridData = [
  {
    status: "pending",
    count: 87,
    percentage: 45.3,
    trend: "up" as const,
    color: "#f59e0b"
  },
  {
    status: "approved", 
    count: 64,
    percentage: 33.3,
    trend: "stable" as const,
    color: "#10b981"
  },
  {
    status: "submitted",
    count: 28,
    percentage: 14.6,
    trend: "up" as const,
    color: "#3b82f6"
  },
  {
    status: "denied",
    count: 9,
    percentage: 4.7,
    trend: "down" as const,
    color: "#ef4444"
  },
  {
    status: "expired",
    count: 4,
    percentage: 2.1,
    trend: "stable" as const,
    color: "#6b7280"
  }
];

export const demoProcedureFlaggingRules = [
  {
    id: "rule-001",
    procedureCode: "27447",
    procedureName: "Total Knee Arthroplasty",
    payerId: "all-payers",
    payerName: "All Major Payers",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 5,
    criteriaChecks: {
      minAge: 18,
      maxAge: 85,
      requiredDiagnoses: ["M17.11", "M17.12", "M17.0", "M17.9"],
      requiredDocumentation: ["xray_weightbearing", "conservative_treatment_6mo", "pt_records"],
      exclusionCriteria: ["active_infection", "insufficient_bone_stock", "bmi_over_40"]
    },
    riskLevel: "medium" as const,
    isActive: true
  },
  {
    id: "rule-002", 
    procedureCode: "33533",
    procedureName: "Coronary Artery Bypass Graft",
    payerId: "all-payers",
    payerName: "All Major Payers",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 3,
    criteriaChecks: {
      requiredStudies: ["cardiac_cath", "echo_or_muga", "stress_test"],
      clinicalCriteria: ["multivessel_disease", "ef_documentation"],
      exclusionCriteria: ["active_substance_abuse", "terminal_illness"]
    },
    riskLevel: "high" as const,
    isActive: true
  },
  {
    id: "rule-003",
    procedureCode: "19307",
    procedureName: "Mastectomy with Reconstruction",
    payerId: "commercial-payers",
    payerName: "Commercial Insurance",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 7,
    criteriaChecks: {
      requiredSpecialists: ["oncology", "plastic_surgery"],
      requiredDocumentation: ["pathology_report", "tumor_board_notes"],
      coverageRequirements: ["whca_compliance", "immediate_reconstruction_covered"]
    },
    riskLevel: "medium" as const,
    isActive: true
  },
  {
    id: "rule-004",
    procedureCode: "43775",
    procedureName: "Laparoscopic Gastric Bypass",
    payerId: "all-payers",
    payerName: "All Major Payers",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 10,
    criteriaChecks: {
      requiredBMI: ">=35_with_comorbidities_or_>=40",
      requiredProgram: "bariatric_surgery_center_of_excellence",
      requiredEvaluations: ["psychological", "nutritionist", "medical_clearance"],
      exclusionCriteria: ["active_substance_abuse", "untreated_eating_disorder"]
    },
    riskLevel: "high" as const,
    isActive: true
  },
  {
    id: "rule-005",
    procedureCode: "64483",
    procedureName: "Transforaminal Epidural Injection",
    payerId: "most-payers",
    payerName: "Most Commercial/Medicare",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 3,
    criteriaChecks: {
      requiredImaging: "mri_within_6_months",
      conservativeTreatment: "pt_trial_documented",
      maxFrequency: "3_injections_per_year",
      exclusionCriteria: ["infection_at_site", "bleeding_disorder"]
    },
    riskLevel: "low" as const,
    isActive: true
  },
  {
    id: "rule-006",
    procedureCode: "58571",
    procedureName: "Laparoscopic Hysterectomy",
    payerId: "commercial-payers",
    payerName: "Commercial Insurance",
    requiresAuth: true,
    autoFlag: true,
    leadTimeRequired: 5,
    criteriaChecks: {
      requiredDocumentation: ["pelvic_exam", "imaging_studies", "failed_conservative_mgmt"],
      medicalNecessity: ["abnormal_bleeding", "fibroids", "endometriosis", "malignancy"],
      exclusionCriteria: ["pregnancy", "pelvic_inflammatory_disease"]
    },
    riskLevel: "medium" as const,
    isActive: true
  }
];

export const demoPayerCriteriaLibrary = [
  {
    id: "criteria-001",
    payerId: "bcbs-medicare",
    payerName: "BCBS Medicare Advantage",
    procedureCode: "27447",
    procedureName: "Total Knee Arthroplasty",
    criteriaType: "medical_necessity" as const,
    criteria: {
      clinicalRequirements: [
        "Documented moderate to severe osteoarthritis with radiographic evidence (Kellgren-Lawrence Grade 3-4)",
        "Failed conservative treatment for minimum 6 months including NSAIDs, PT, injections",
        "Significant functional limitation documented with standardized assessment tools (KOOS, WOMAC)",
        "Pain level persistently 6/10 or higher despite optimal medical management",
        "BMI <40 or approval through bariatric surgery committee if >40"
      ],
      exclusionCriteria: [
        "Active infection at surgical site or systemic",
        "Insufficient bone stock for implant fixation",
        "Medical contraindications to general anesthesia",
        "Active malignancy with life expectancy <2 years",
        "Pregnancy or potential pregnancy"
      ],
      requiredDocumentation: [
        "Weight-bearing X-rays (AP, lateral, sunrise views) within 6 months",
        "Physical therapy records documenting 6+ weeks of treatment",
        "Pain medication trial documentation including contraindications", 
        "Functional assessment scores (KOOS, WOMAC, or equivalent)",
        "Bone density scan if indicated (age >65 or risk factors)"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: "2025-12-31",
    isActive: true
  },
  {
    id: "criteria-002",
    payerId: "uhc-commercial", 
    payerName: "United Healthcare Commercial",
    procedureCode: "33533",
    procedureName: "Coronary Artery Bypass Graft",
    criteriaType: "coverage_policy" as const,
    criteria: {
      coverageRequirements: [
        "Left main stenosis >50% or multivessel disease with >70% stenosis",
        "Symptoms refractory to optimal medical therapy",
        "Ejection fraction >30% (or >20% with viable myocardium demonstrated)",
        "Life expectancy >5 years with good functional status",
        "Coronary anatomy suitable for surgical revascularization"
      ],
      priorAuthRequired: [
        "All non-emergent CABG procedures require prior authorization",
        "Heart team evaluation with interventional cardiology input",
        "Stress test or cardiac catheterization within 6 months",
        "Echocardiogram or MUGA within 1 year",
        "Pulmonary function tests if indicated"
      ],
      emergencyExceptions: [
        "STEMI with cardiogenic shock",
        "Unstable angina with hemodynamic compromise",
        "Mechanical complications of acute MI",
        "Failed emergent PCI with ongoing ischemia"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: null,
    isActive: true
  },
  {
    id: "criteria-003",
    payerId: "medicare-traditional",
    payerName: "Medicare Fee-for-Service",
    procedureCode: "43775",
    procedureName: "Laparoscopic Gastric Bypass",
    criteriaType: "ncd_coverage" as const,
    criteria: {
      coverageRequirements: [
        "BMI ≥35 with high-risk comorbidities OR BMI ≥40",
        "Documented failure of non-surgical weight loss methods for ≥6 months",
        "Psychological evaluation documenting understanding and commitment",
        "Performed at Medicare-approved Bariatric Surgery Center of Excellence",
        "Age 18-65 (case-by-case review for >65)"
      ],
      requiredComorbidities: [
        "Type 2 diabetes mellitus",
        "Coronary heart disease", 
        "Sleep apnea",
        "Hypertension requiring medication"
      ],
      requiredDocumentation: [
        "Complete medical history and physical examination",
        "Nutritionist evaluation and dietary counseling documentation",
        "Psychological evaluation by qualified mental health professional",
        "Endocrinology consultation if diabetic",
        "Cardiology clearance if cardiac comorbidities"
      ],
      exclusionCriteria: [
        "Active substance abuse within 2 years",
        "Untreated major psychiatric disorder",
        "Medical contraindications to general anesthesia",
        "Portal hypertension or cirrhosis",
        "Pregnancy"
      ]
    },
    effectiveDate: "2024-01-01",
    expirationDate: null,
    isActive: true
  },
  {
    id: "criteria-004",
    payerId: "aetna-ppo",
    payerName: "Aetna Better Health PPO",
    procedureCode: "64483",
    procedureName: "Transforaminal Epidural Steroid Injection",
    criteriaType: "medical_necessity" as const,
    criteria: {
      clinicalRequirements: [
        "Radicular pain consistent with nerve root compression",
        "MRI or CT evidence of spinal pathology correlating with symptoms",
        "Failed conservative treatment for minimum 6 weeks",
        "Functional impairment documented with validated assessment tools",
        "No contraindications to steroid injection"
      ],
      conservativeTreatment: [
        "Physical therapy for minimum 6 weeks",
        "Trial of NSAIDs (unless contraindicated)",
        "Activity modification and ergonomic assessment",
        "Consider oral steroid trial if appropriate"
      ],
      requiredDocumentation: [
        "MRI lumbar spine within 6 months showing pathology",
        "Physical therapy records documenting treatment and response",
        "Pain diagram and functional assessment scores",
        "Medication trial documentation including response and side effects"
      ],
      limitations: [
        "Maximum 3 injections per spinal region per 12-month period",
        "Minimum 2-week interval between injections in same region",
        "Must be performed under fluoroscopic or CT guidance",
        "Prior authorization required for bilateral or multilevel injections"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: null,
    isActive: true
  },
  {
    id: "criteria-005",
    payerId: "cigna-healthspring",
    payerName: "Cigna HealthSpring",
    procedureCode: "19307",
    procedureName: "Mastectomy with Immediate Reconstruction",
    criteriaType: "coverage_policy" as const,
    criteria: {
      coverageRequirements: [
        "Breast cancer diagnosis confirmed by pathology OR prophylactic for BRCA+ with genetic counseling",
        "Multidisciplinary team evaluation including oncology and plastic surgery",
        "Medical clearance for extended surgical procedure",
        "Patient counseling regarding risks, benefits, and alternatives documented",
        "Compliance with Women's Health and Cancer Rights Act (WHCRA)"
      ],
      reconstructiveOptions: [
        "Immediate tissue expander placement with delayed implant exchange",
        "Immediate direct-to-implant reconstruction if appropriate",
        "Autologous tissue reconstruction (DIEP, TRAM, latissimus dorsi)",
        "Combination techniques as medically necessary"
      ],
      requiredDocumentation: [
        "Pathology report confirming malignancy OR genetic testing results",
        "Oncology consultation notes and treatment plan",
        "Plastic surgery consultation with reconstruction plan",
        "Anesthesia evaluation for extended procedure",
        "Patient consent documentation including WHCRA rights"
      ],
      qualityMetrics: [
        "Board-certified plastic surgeon with breast reconstruction experience",
        "Hospital accreditation for complex reconstructive procedures",
        "Availability of immediate postoperative monitoring",
        "Established protocols for complications management"
      ]
    },
    effectiveDate: "2025-01-01",
    expirationDate: null,
    isActive: true
  }
];