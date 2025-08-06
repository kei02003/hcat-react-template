// Simple clinical decision data for demonstration
export const clinicalDecisionSample = [
  {
    id: "cd-001",
    patientName: "Martinez, Elena R.",
    patientId: "PAT-78901",
    admissionId: "ADM-2025-001",
    currentStatus: "observation",
    denialReason: "Inappropriate inpatient status - heart failure admission",
    payer: "Medicare Advantage",
    payerId: "MA-001",
    department: "Cardiology",
    clinicalIndicators: {
      vitalSigns: {
        systolicBP: 165,
        diastolicBP: 95,
        heartRate: 110,
        respiratoryRate: 24,
        oxygenSaturation: 88,
        temperature: 99.2
      },
      labResults: {
        troponinI: 0.8,
        bnp: 1250,
        creatinine: 1.8,
        sodium: 128,
        hemoglobin: 9.2
      },
      physicianNotes: [
        "Patient presents with acute decompensated heart failure with pulmonary edema",
        "Requires IV diuretics and close hemodynamic monitoring",
        "Patient has history of HFrEF with EF 25%, multiple hospitalizations",
        "Current episode triggered by medication non-adherence and dietary indiscretion"
      ],
      symptoms: [
        "Dyspnea at rest",
        "Orthopnea (3-pillow)",
        "Bilateral lower extremity edema",
        "Chest discomfort",
        "Fatigue"
      ],
      medications: [
        "Furosemide 40mg IV BID",
        "Lisinopril 10mg daily",
        "Metoprolol 25mg BID",
        "Spironolactone 25mg daily"
      ]
    },
    insurerCriteria: {
      inpatientRequirements: [
        "Requires IV medications that cannot be given in observation",
        "Patient requires intensive cardiac monitoring",
        "Hemodynamically unstable requiring frequent assessment",
        "Expected length of stay >24 hours with active treatment"
      ],
      observationCriteria: [
        "Stable vital signs with mild exacerbation",
        "Responds well to oral medications",
        "No acute complications expected",
        "Can be managed with <24 hour stay"
      ],
      exclusionFactors: [
        "Chronic stable heart failure without acute changes",
        "Social admissions without medical necessity",
        "Routine medication adjustments"
      ]
    },
    recommendedStatus: "inpatient",
    confidenceScore: 92,
    complianceScore: 96,
    aiRecommendations: [
      "Clinical indicators strongly support inpatient status: BNP >1000, oxygen saturation <90%, IV diuretic requirement",
      "Patient meets Medicare criteria for inpatient admission with acute decompensated heart failure",
      "Document hemodynamic instability and need for frequent monitoring in physician notes",
      "Emphasize IV medication requirement and expected >48 hour length of stay"
    ],
    reviewStatus: "pending",
    createdAt: "2025-01-08T00:00:00Z",
    updatedAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "cd-002",
    patientName: "Johnson, Robert K.",
    patientId: "PAT-45678",
    admissionId: "ADM-2025-002",
    currentStatus: "inpatient",
    denialReason: "Chest pain admission - insufficient justification for inpatient level",
    payer: "Aetna",
    payerId: "AETNA-002",
    department: "Emergency Medicine",
    clinicalIndicators: {
      vitalSigns: {
        systolicBP: 135,
        diastolicBP: 82,
        heartRate: 88,
        respiratoryRate: 16,
        oxygenSaturation: 98,
        temperature: 98.6
      },
      labResults: {
        troponinI: 0.02,
        bnp: 125,
        creatinine: 1.1,
        sodium: 140,
        hemoglobin: 13.8
      },
      physicianNotes: [
        "Patient presents with atypical chest discomfort, low risk features",
        "Normal ECG, negative cardiac enzymes x2",
        "Stress test scheduled outpatient, good functional capacity",
        "Pain resolved with antacids, likely gastroesophageal in origin"
      ],
      symptoms: [
        "Intermittent chest discomfort",
        "Non-radiating pain",
        "No shortness of breath",
        "Pain after eating"
      ],
      medications: [
        "Aspirin 81mg daily",
        "Omeprazole 20mg daily",
        "Simvastatin 20mg daily"
      ]
    },
    insurerCriteria: {
      inpatientRequirements: [
        "Positive cardiac biomarkers",
        "High-risk chest pain features",
        "Hemodynamic instability",
        "Complex interventions required"
      ],
      observationCriteria: [
        "Low-intermediate risk chest pain",
        "Serial cardiac enzymes needed",
        "Brief monitoring period sufficient",
        "Stress testing can be arranged outpatient"
      ],
      exclusionFactors: [
        "Normal cardiac enzymes with low risk features",
        "Stable vital signs throughout stay",
        "Non-cardiac chest pain likely"
      ]
    },
    recommendedStatus: "observation",
    confidenceScore: 88,
    complianceScore: 85,
    aiRecommendations: [
      "Patient meets observation criteria rather than inpatient: stable vitals, negative troponins, low TIMI risk score",
      "Consider changing status to observation with serial enzymes and monitoring",
      "Document any high-risk features if present to justify inpatient status",
      "Ensure proper risk stratification tools are documented (TIMI, HEART score)"
    ],
    reviewStatus: "needs_revision",
    createdAt: "2025-01-07T00:00:00Z",
    updatedAt: "2025-01-09T00:00:00Z"
  },
  {
    id: "cd-003",
    patientName: "Thompson, Sarah M.",
    patientId: "PAT-23456",
    admissionId: "ADM-2025-003",
    currentStatus: "inpatient",
    denialReason: "COPD exacerbation - questioning inpatient necessity",
    payer: "Blue Cross Blue Shield",
    payerId: "BCBS-003",
    department: "Pulmonology",
    clinicalIndicators: {
      vitalSigns: {
        systolicBP: 145,
        diastolicBP: 88,
        heartRate: 105,
        respiratoryRate: 28,
        oxygenSaturation: 85,
        temperature: 100.8
      },
      labResults: {
        troponinI: 0.01,
        bnp: 180,
        creatinine: 1.3,
        sodium: 138,
        hemoglobin: 11.5
      },
      physicianNotes: [
        "Acute COPD exacerbation with respiratory distress",
        "Requiring BiPAP and IV corticosteroids",
        "Chest X-ray shows hyperinflation with infiltrates",
        "Patient has severe COPD, FEV1 <30% predicted"
      ],
      symptoms: [
        "Severe dyspnea",
        "Productive cough with purulent sputum",
        "Wheezing",
        "Chest tightness",
        "Unable to speak full sentences"
      ],
      medications: [
        "Methylprednisolone 40mg IV q8h",
        "Albuterol/Ipratropium nebulizers",
        "BiPAP settings IPAP 14, EPAP 6",
        "Azithromycin 500mg daily"
      ]
    },
    insurerCriteria: {
      inpatientRequirements: [
        "Respiratory distress requiring BiPAP/ventilator support",
        "IV medications and intensive monitoring needed",
        "Oxygen saturation <90% on room air",
        "Inability to manage at home or observation level"
      ],
      observationCriteria: [
        "Mild exacerbation responsive to nebulizers",
        "Stable on room air or minimal oxygen",
        "Can take oral medications",
        "Expected rapid improvement"
      ],
      exclusionFactors: [
        "Chronic stable COPD without acute changes",
        "Medication refill admissions",
        "Social factors primary reason for admission"
      ]
    },
    recommendedStatus: "inpatient",
    confidenceScore: 95,
    complianceScore: 98,
    aiRecommendations: [
      "Strong justification for inpatient status: oxygen saturation 85%, requiring BiPAP support",
      "Patient meets inpatient criteria with severe COPD exacerbation and respiratory compromise",
      "Document severity of dyspnea, inability to perform ADLs, need for intensive respiratory therapy",
      "Emphasize BiPAP requirement and IV steroid necessity in clinical documentation"
    ],
    reviewStatus: "approved",
    createdAt: "2025-01-06T00:00:00Z",
    updatedAt: "2025-01-08T00:00:00Z"
  }
];