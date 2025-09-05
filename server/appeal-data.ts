// Appeal generation data with high-probability cases
export const appealCases = [
  {
    id: "appeal-001",
    patientName: "Martinez, Elena R.",
    patientId: "PAT-78901",
    admissionId: "ADM-2025-001",
    claimId: "CLM-2025-001",
    denialId: "DEN-2025-001",
    payer: "Medicare Advantage",
    payerId: "MA-001",
    denialReason: "Inappropriate inpatient status - heart failure admission",
    denialCode: "DRG-291",
    denialDate: "2025-01-05T00:00:00Z",
    appealProbability: 92, // High probability >70%
    denialAmount: "$12,450.00",
    department: "Cardiology",
    attendingPhysician: "Dr. Sarah Johnson, MD",
    clinicalEvidence: {
      vitalSigns: {
        findings: [
          "Oxygen saturation 88% on room air (hypoxia documented)",
          "Respiratory rate 24 breaths/minute (tachypnea)",
          "Blood pressure 165/95 mmHg (hypertension)",
          "Heart rate 110 bpm (tachycardia)"
        ],
        supportingDocumentation: "Nursing flow sheets 1/3/25 0800-2400"
      },
      labResults: {
        findings: [
          "BNP elevated at 1,250 pg/mL (normal <100)",
          "Troponin I 0.8 ng/mL (elevated, indicating cardiac stress)",
          "Creatinine 1.8 mg/dL (acute kidney injury)",
          "Sodium 128 mEq/L (hyponatremia)"
        ],
        supportingDocumentation: "Laboratory results 1/3/25 0600"
      },
      medications: {
        findings: [
          "Furosemide 40mg IV BID (IV diuretics documented)",
          "Required continuous IV access for diuretic therapy",
          "Unable to convert to oral diuretics due to poor absorption"
        ],
        supportingDocumentation: "Medication administration record 1/3/25-1/5/25"
      },
      imaging: {
        findings: [
          "Chest X-ray: Bilateral pulmonary edema",
          "Cardiomegaly with increased cardiac silhouette",
          "Pleural effusions bilateral"
        ],
        supportingDocumentation: "Radiology report 1/3/25 by Dr. Michael Chen"
      },
      physicianNotes: {
        findings: [
          "Patient requires intensive monitoring for hemodynamic status",
          "IV diuretic therapy essential due to severity of fluid overload",
          "Risk of acute respiratory failure without close observation",
          "Multiple comorbidities requiring inpatient level care"
        ],
        supportingDocumentation: "Progress notes 1/3/25-1/5/25 Dr. Sarah Johnson"
      }
    },
    insurerCriteria: {
      medicalNecessity: [
        "Patient with acute decompensated heart failure",
        "Requires IV medications not available in observation",
        "Hemodynamic instability requiring frequent monitoring",
        "Expected length of stay >24 hours with active treatment"
      ],
      supportingGuidelines: [
        "Medicare LCD L33831 - Heart Failure Admissions",
        "CMS Guidelines for Observation vs Inpatient Status",
        "American Heart Association Guidelines for Acute HF Management"
      ]
    },
    appealStrength: {
      strongPoints: [
        "Clear documentation of hypoxia (O2 sat 88%)",
        "IV diuretic requirement documented",
        "Hemodynamic instability with vital sign abnormalities",
        "Appropriate physician documentation of medical necessity"
      ],
      medicalJustification: "Patient meets inpatient criteria with acute decompensated heart failure requiring IV diuretics, hemodynamic monitoring, and intensive nursing care",
      regulatorySupport: "Meets Medicare guidelines for inpatient admission under acute heart failure protocols"
    },
    generatedLetter: {
      letterType: "initial_appeal",
      priority: "high",
      expectedOutcome: "overturn",
      confidenceScore: 92,
      generatedDate: "2025-01-09T00:00:00Z",
      submissionDeadline: "2025-02-05T23:59:59Z"
    },
    status: "pending_generation",
    createdAt: "2025-01-08T00:00:00Z",
    updatedAt: "2025-01-08T00:00:00Z"
  },
  {
    id: "appeal-002",
    patientName: "Thompson, Sarah M.",
    patientId: "PAT-23456",
    admissionId: "ADM-2025-003",
    claimId: "CLM-2025-003",
    denialId: "DEN-2025-003",
    payer: "Blue Cross Blue Shield",
    payerId: "BCBS-003",
    denialReason: "COPD exacerbation - questioning inpatient necessity",
    denialCode: "DRG-190",
    denialDate: "2025-01-06T00:00:00Z",
    appealProbability: 95, // Very high probability
    denialAmount: "$8,750.00",
    department: "Pulmonology",
    attendingPhysician: "Dr. Robert Martinez, MD",
    clinicalEvidence: {
      vitalSigns: {
        findings: [
          "Oxygen saturation 85% on room air (severe hypoxia)",
          "Respiratory rate 28 breaths/minute (severe tachypnea)",
          "Temperature 100.8°F (fever indicating infection)",
          "Heart rate 105 bpm (tachycardia)"
        ],
        supportingDocumentation: "Vital signs flow sheet 1/6/25 0000-2400"
      },
      respiratorySupport: {
        findings: [
          "BiPAP therapy required (IPAP 14, EPAP 6)",
          "Unable to maintain adequate oxygenation without BiPAP",
          "Frequent respiratory therapy interventions",
          "Arterial blood gas showing respiratory acidosis"
        ],
        supportingDocumentation: "Respiratory therapy notes 1/6/25-1/8/25"
      },
      medications: {
        findings: [
          "Methylprednisolone 40mg IV q8h (IV steroids required)",
          "Continuous nebulizer treatments every 2 hours",
          "IV antibiotics for concurrent pneumonia"
        ],
        supportingDocumentation: "Pharmacy records and MAR 1/6/25-1/8/25"
      },
      imaging: {
        findings: [
          "Chest X-ray: Hyperinflation with bilateral infiltrates",
          "Evidence of pneumonia complicating COPD exacerbation",
          "Comparison shows significant worsening from baseline"
        ],
        supportingDocumentation: "Radiology report 1/6/25 Dr. Lisa Chen"
      }
    },
    insurerCriteria: {
      medicalNecessity: [
        "Severe COPD exacerbation with respiratory failure",
        "Requires BiPAP support not available in observation",
        "IV medications and intensive respiratory monitoring",
        "Complex medical management requiring inpatient care"
      ],
      supportingGuidelines: [
        "COPD Clinical Practice Guidelines",
        "Medicare Coverage Determination for Respiratory Failure",
        "Joint Commission Standards for Respiratory Care"
      ]
    },
    appealStrength: {
      strongPoints: [
        "Severe hypoxia documented (O2 sat 85%)",
        "BiPAP requirement clearly documented",
        "IV steroid therapy medically necessary",
        "Respiratory failure meets inpatient criteria"
      ],
      medicalJustification: "Patient with severe COPD exacerbation requiring BiPAP support, IV steroids, and intensive respiratory monitoring",
      regulatorySupport: "Meets all criteria for inpatient admission under respiratory failure protocols"
    },
    generatedLetter: {
      letterType: "initial_appeal",
      priority: "high",
      expectedOutcome: "overturn",
      confidenceScore: 95,
      generatedDate: "2025-01-09T00:00:00Z",
      submissionDeadline: "2025-02-06T23:59:59Z"
    },
    status: "generated",
    createdAt: "2025-01-06T00:00:00Z",
    updatedAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "appeal-003",
    patientName: "Johnson, Robert K.",
    patientId: "PAT-45678",
    admissionId: "ADM-2025-002",
    claimId: "CLM-2025-002",
    denialId: "DEN-2025-002",
    payer: "Aetna",
    payerId: "AETNA-002",
    denialReason: "Chest pain admission - insufficient justification for inpatient level",
    denialCode: "DRG-313",
    denialDate: "2025-01-07T00:00:00Z",
    appealProbability: 45, // Low probability <70%
    denialAmount: "$6,200.00",
    department: "Emergency Medicine",
    attendingPhysician: "Dr. Amanda Wilson, MD",
    clinicalEvidence: {
      vitalSigns: {
        findings: [
          "Vital signs stable throughout admission",
          "No hemodynamic compromise documented",
          "Normal oxygen saturation 98%"
        ],
        supportingDocumentation: "Nursing assessment 1/7/25"
      },
      labResults: {
        findings: [
          "Troponin I negative x2 (0.02 ng/mL)",
          "Normal BNP (125 pg/mL)",
          "No acute cardiac injury markers"
        ],
        supportingDocumentation: "Lab results 1/7/25"
      },
      imaging: {
        findings: [
          "Normal ECG without acute changes",
          "Chest X-ray normal",
          "No evidence of acute coronary syndrome"
        ],
        supportingDocumentation: "Cardiology consultation 1/7/25"
      }
    },
    appealStrength: {
      strongPoints: [
        "Patient required cardiac monitoring",
        "Rule out acute coronary syndrome protocol followed"
      ],
      weakPoints: [
        "Normal cardiac enzymes",
        "Stable vital signs",
        "Low-risk chest pain features",
        "Could have been managed in observation"
      ],
      medicalJustification: "Limited justification for inpatient status given normal cardiac workup",
      regulatorySupport: "Does not meet typical inpatient criteria for chest pain"
    },
    status: "not_recommended",
    createdAt: "2025-01-07T00:00:00Z",
    updatedAt: "2025-01-07T00:00:00Z"
  },
  {
    id: "appeal-004",
    patientName: "Brown, David A.",
    patientId: "PAT-67123",
    admissionId: "ADM-2024-067",
    claimId: "CLM-24-067123",
    denialId: "DN-24-067123",
    payer: "Aetna",
    payerId: "AETNA-001",
    denialReason: "LCD Coverage - N432",
    denialCode: "LCD-432",
    denialDate: "2024-11-10T00:00:00Z",
    appealProbability: 78, // Good probability >70%
    denialAmount: "$29,300.00",
    department: "General Surgery",
    attendingPhysician: "Dr. Amanda Wilson, MD",
    clinicalEvidence: {
      vitalSigns: {
        findings: [
          "Blood pressure 140/90 mmHg (hypertension)",
          "Heart rate 95 bpm (mild tachycardia)",
          "Temperature 99.8°F (low-grade fever)",
          "Oxygen saturation 96% on room air"
        ],
        supportingDocumentation: "Vital signs flow sheet 10/12/24 0600-2200"
      },
      labResults: {
        findings: [
          "White cell count 12,800/μL (elevated, indicating infection)",
          "Hemoglobin 10.2 g/dL (mild anemia)",
          "Platelets 420,000/μL (thrombocytosis)",
          "ESR 45 mm/hr (elevated inflammatory markers)"
        ],
        supportingDocumentation: "Laboratory results 10/12/24 0800"
      },
      imaging: {
        findings: [
          "CT abdomen/pelvis: acute appendicitis with wall thickening",
          "No evidence of perforation or abscess formation",
          "Mild fluid collection in pelvis",
          "Appendiceal wall enhancement consistent with acute inflammation"
        ],
        supportingDocumentation: "Radiology report 10/12/24 by Dr. Jennifer Lee"
      },
      physicianNotes: {
        findings: [
          "Patient presents with classic signs of acute appendicitis",
          "Clinical presentation warrants urgent surgical intervention",
          "Meets criteria for laparoscopic appendectomy",
          "No contraindications to surgical approach"
        ],
        supportingDocumentation: "Progress notes 10/12/24 Dr. Amanda Wilson"
      }
    },
    insurerCriteria: {
      medicalNecessity: [
        "Patient with acute appendicitis confirmed by imaging",
        "Clinical signs consistent with inflammatory process",
        "Urgent surgical intervention medically necessary",
        "Standard of care treatment for acute appendicitis"
      ],
      supportingGuidelines: [
        "Aetna Clinical Policy Bulletin - Appendectomy",
        "American College of Surgeons Guidelines for Acute Appendicitis",
        "Society of American Gastrointestinal Surgeons Practice Guidelines"
      ]
    },
    appealStrength: {
      strongPoints: [
        "Clear radiologic evidence of acute appendicitis",
        "Elevated white cell count supporting infection",
        "Standard of care surgical intervention",
        "Appropriate clinical documentation and imaging"
      ],
      medicalJustification: "Patient meets all criteria for acute appendicitis requiring urgent laparoscopic appendectomy as standard of care treatment",
      regulatorySupport: "Meets Aetna guidelines for medically necessary surgical intervention for acute appendicitis"
    },
    generatedLetter: {
      letterType: "initial_appeal",
      priority: "standard",
      expectedOutcome: "partial_approval",
      confidenceScore: 78,
      generatedDate: "2024-11-25T00:00:00Z",
      submissionDeadline: "2025-01-09T23:59:59Z"
    },
    status: "pending_generation",
    createdAt: "2024-11-25T00:00:00Z",
    updatedAt: "2024-11-25T00:00:00Z"
  }
];

// Performance metrics for demonstration
export const performanceMetrics = {
  challengeLetterProduction: {
    current: 98.4, // Current percentage
    target: 100.0, // Target: 100% of unreasonable denials challenged within 5 days
    totalUnreasonableDenials: 125,
    challengedWithin5Days: 123,
    status: "on_track",
    timeframe: "Last 30 days"
  },
  denialReduction: {
    current: 22.3, // Current percentage reduction
    target: 20.0, // Target: 20% reduction in denials from clinical necessity/DRG/prior authorization issues
    previousPeriodDenials: 187,
    currentPeriodDenials: 145,
    reductionAmount: 42,
    status: "exceeded",
    categories: {
      clinicalNecessity: { reduction: 24.1, count: 15 },
      drgCoding: { reduction: 18.7, count: 12 },
      priorAuthorization: { reduction: 23.8, count: 15 }
    },
    timeframe: "Quarter over quarter comparison"
  },
  appealOutcomes: {
    totalAppeals: 156,
    successfulAppeals: 142,
    successRate: 91.0,
    averageProcessingTime: 12.4, // days
    recoveredAmount: 1847250.00, // dollars
    pendingAppeals: 14
  },
  timeliness: {
    within5Days: 123,
    within10Days: 2,
    beyond10Days: 0,
    averageDays: 3.2
  }
};

export const challengeLetterTemplate = {
  header: {
    template: `
[Date]

[Insurance Company Name]
[Address]
[City, State, ZIP]

RE: Appeal for Claim Denial
Patient: [Patient Name]
Member ID: [Patient ID]  
Claim Number: [Claim ID]
Date of Service: [Service Date]
Provider: [Attending Physician]
    `
  },
  introduction: {
    template: `
Dear Medical Review Team,

We are formally appealing your denial decision for the above-referenced claim. Based on our comprehensive review of the medical record and applicable coverage criteria, we believe this denial should be overturned. The patient's clinical presentation clearly supported the medical necessity for inpatient admission and the services provided.
    `
  },
  clinicalSummary: {
    template: `
CLINICAL SUMMARY:
[Patient Name] is a [age]-year-old patient who presented with [primary diagnosis]. The patient's clinical condition required inpatient level of care based on the following documented findings:

• [Key Clinical Finding 1]
• [Key Clinical Finding 2]  
• [Key Clinical Finding 3]
• [Key Clinical Finding 4]
    `
  },
  medicalNecessity: {
    template: `
MEDICAL NECESSITY JUSTIFICATION:
The inpatient admission was medically necessary based on the following criteria:

1. SEVERITY OF CONDITION: [Clinical evidence of severity]
2. TREATMENT REQUIREMENTS: [IV medications, monitoring needs]
3. HEMODYNAMIC STATUS: [Vital sign abnormalities, instability]
4. EXPECTED LENGTH OF STAY: [Duration and complexity of care]
    `
  },
  regulatorySupport: {
    template: `
REGULATORY AND CLINICAL GUIDELINES:
This admission meets established criteria under:
• [Relevant LCD/NCD References]
• [Professional Society Guidelines]
• [CMS Coverage Determinations]
    `
  },
  conclusion: {
    template: `
CONCLUSION:
Based on the comprehensive clinical evidence presented above, we respectfully request that you reverse your denial decision. The patient's condition clearly warranted inpatient level of care, and all services provided were medically necessary and appropriate.

We request expedited review of this appeal given the clinical complexity of the case. Please contact our utilization review department at [phone] if you require additional clinical information.

Thank you for your prompt attention to this matter.

Sincerely,

[Physician Name, MD]
[Title]
[Department]
[Contact Information]
    `
  }
};