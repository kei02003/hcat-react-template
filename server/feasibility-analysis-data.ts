// Feasibility analysis data for appeal and redundant request opportunities by payer
export const payerAnalysis = [
  {
    payerId: "MEDICARE-001",
    payerName: "Medicare",
    payerType: "Government",
    totalClaims: 2847,
    appealOpportunities: {
      totalDenials: 421,
      appealableCount: 312,
      appealRate: 74.1,
      averageAppealValue: 4250.00,
      totalAppealValue: 1326000.00,
      highProbabilityAppeals: 187,
      mediumProbabilityAppeals: 94,
      lowProbabilityAppeals: 31,
      denialCategories: {
        clinicalNecessity: { count: 142, appealRate: 85.2, avgValue: 5100.00 },
        timelyFiling: { count: 89, appealRate: 45.8, avgValue: 3200.00 },
        drgCoding: { count: 78, appealRate: 91.0, avgValue: 4800.00 },
        priorAuthorization: { count: 56, appealRate: 78.6, avgValue: 3900.00 },
        documentation: { count: 56, appealRate: 67.9, avgValue: 3600.00 }
      },
      successProbability: {
        overall: 78.4,
        byCategory: {
          clinicalNecessity: 82.1,
          timelyFiling: 41.2,
          drgCoding: 89.5,
          priorAuthorization: 75.8,
          documentation: 69.3
        }
      },
      estimatedRecovery: 1039440.00,
      roi: 312.5 // Return on investment percentage
    },
    redundantRequestOpportunities: {
      totalRequests: 1847,
      redundantCount: 547,
      redundancyRate: 29.6,
      avgProcessingCost: 45.00,
      totalWastedCost: 24615.00,
      requestTypes: {
        medicalRecords: { total: 456, redundant: 142, rate: 31.1, avgCost: 65.00 },
        labResults: { total: 378, redundant: 118, rate: 31.2, avgCost: 35.00 },
        imagingReports: { total: 289, redundant: 87, rate: 30.1, avgCost: 75.00 },
        physicianNotes: { total: 234, redundant: 67, rate: 28.6, avgCost: 55.00 },
        dischargeSummary: { total: 198, redundant: 58, rate: 29.3, avgCost: 40.00 },
        pathologyReports: { total: 156, redundant: 43, rate: 27.6, avgCost: 85.00 },
        consultReports: { total: 136, redundant: 32, rate: 23.5, avgCost: 60.00 }
      },
      automationPotential: {
        highPriority: 342, // Can be automated immediately
        mediumPriority: 123, // Requires process changes
        lowPriority: 82, // Complex cases requiring review
        estimatedSavings: 18461.25, // 75% of wasteful costs
        implementationCost: 12000.00,
        paybackPeriod: 7.8 // months
      }
    },
    performanceMetrics: {
      denialTrend: -12.3, // Percentage change over last quarter
      appealSuccessTrend: 8.7,
      redundancyTrend: -15.2,
      averageResolutionTime: 18.4, // days
      staffHoursPerAppeal: 3.2,
      staffHoursPerRedundantRequest: 1.8
    }
  },
  {
    payerId: "BCBS-001",
    payerName: "Blue Cross Blue Shield",
    payerType: "Commercial",
    totalClaims: 1923,
    appealOpportunities: {
      totalDenials: 298,
      appealableCount: 247,
      appealRate: 82.9,
      averageAppealValue: 3875.00,
      totalAppealValue: 957125.00,
      highProbabilityAppeals: 156,
      mediumProbabilityAppeals: 67,
      lowProbabilityAppeals: 24,
      denialCategories: {
        clinicalNecessity: { count: 89, appealRate: 89.9, avgValue: 4600.00 },
        priorAuthorization: { count: 67, appealRate: 91.0, avgValue: 4200.00 },
        drgCoding: { count: 54, appealRate: 87.0, avgValue: 4100.00 },
        documentation: { count: 48, appealRate: 75.0, avgValue: 3200.00 },
        timelyFiling: { count: 40, appealRate: 52.5, avgValue: 2800.00 }
      },
      successProbability: {
        overall: 81.7,
        byCategory: {
          clinicalNecessity: 85.4,
          priorAuthorization: 88.1,
          drgCoding: 83.3,
          documentation: 72.9,
          timelyFiling: 48.6
        }
      },
      estimatedRecovery: 782072.25,
      roi: 318.7
    },
    redundantRequestOpportunities: {
      totalRequests: 1245,
      redundantCount: 398,
      redundancyRate: 32.0,
      avgProcessingCost: 52.00,
      totalWastedCost: 20696.00,
      requestTypes: {
        medicalRecords: { total: 312, redundant: 106, rate: 34.0, avgCost: 70.00 },
        priorAuthDocuments: { total: 245, redundant: 81, rate: 33.1, avgCost: 55.00 },
        labResults: { total: 198, redundant: 67, rate: 33.8, avgCost: 40.00 },
        imagingReports: { total: 167, redundant: 52, rate: 31.1, avgCost: 80.00 },
        physicianNotes: { total: 134, redundant: 38, rate: 28.4, avgCost: 60.00 },
        dischargeSummary: { total: 109, redundant: 32, rate: 29.4, avgCost: 45.00 },
        consultReports: { total: 80, redundant: 22, rate: 27.5, avgCost: 65.00 }
      },
      automationPotential: {
        highPriority: 298,
        mediumPriority: 67,
        lowPriority: 33,
        estimatedSavings: 15522.00,
        implementationCost: 9500.00,
        paybackPeriod: 7.3
      }
    },
    performanceMetrics: {
      denialTrend: -8.9,
      appealSuccessTrend: 12.4,
      redundancyTrend: -18.7,
      averageResolutionTime: 14.6,
      staffHoursPerAppeal: 2.8,
      staffHoursPerRedundantRequest: 1.6
    }
  },
  {
    payerId: "AETNA-001",
    payerName: "Aetna",
    payerType: "Commercial",
    totalClaims: 1456,
    appealOpportunities: {
      totalDenials: 234,
      appealableCount: 198,
      appealRate: 84.6,
      averageAppealValue: 4125.00,
      totalAppealValue: 816750.00,
      highProbabilityAppeals: 127,
      mediumProbabilityAppeals: 52,
      lowProbabilityAppeals: 19,
      denialCategories: {
        priorAuthorization: { count: 78, appealRate: 93.6, avgValue: 4800.00 },
        clinicalNecessity: { count: 64, appealRate: 87.5, avgValue: 4300.00 },
        drgCoding: { count: 42, appealRate: 85.7, avgValue: 3900.00 },
        documentation: { count: 31, appealRate: 71.0, avgValue: 3400.00 },
        timelyFiling: { count: 19, appealRate: 47.4, avgValue: 3100.00 }
      },
      successProbability: {
        overall: 83.2,
        byCategory: {
          priorAuthorization: 90.1,
          clinicalNecessity: 84.8,
          drgCoding: 81.9,
          documentation: 68.4,
          timelyFiling: 42.1
        }
      },
      estimatedRecovery: 679599.00,
      roi: 325.4
    },
    redundantRequestOpportunities: {
      totalRequests: 987,
      redundantCount: 287,
      redundancyRate: 29.1,
      avgProcessingCost: 48.00,
      totalWastedCost: 13776.00,
      requestTypes: {
        priorAuthDocuments: { total: 234, redundant: 78, rate: 33.3, avgCost: 65.00 },
        medicalRecords: { total: 198, redundant: 62, rate: 31.3, avgCost: 60.00 },
        labResults: { total: 156, redundant: 47, rate: 30.1, avgCost: 35.00 },
        imagingReports: { total: 134, redundant: 38, rate: 28.4, avgCost: 75.00 },
        physicianNotes: { total: 112, redundant: 31, rate: 27.7, avgCost: 55.00 },
        dischargeSummary: { total: 89, redundant: 21, rate: 23.6, avgCost: 40.00 },
        consultReports: { total: 64, redundant: 10, rate: 15.6, avgCost: 70.00 }
      },
      automationPotential: {
        highPriority: 215,
        mediumPriority: 48,
        lowPriority: 24,
        estimatedSavings: 10332.00,
        implementationCost: 8000.00,
        paybackPeriod: 9.3
      }
    },
    performanceMetrics: {
      denialTrend: -6.7,
      appealSuccessTrend: 15.2,
      redundancyTrend: -22.1,
      averageResolutionTime: 12.8,
      staffHoursPerAppeal: 2.5,
      staffHoursPerRedundantRequest: 1.4
    }
  },
  {
    payerId: "UHC-001",
    payerName: "UnitedHealthcare",
    payerType: "Commercial",
    totalClaims: 2134,
    appealOpportunities: {
      totalDenials: 387,
      appealableCount: 301,
      appealRate: 77.8,
      averageAppealValue: 3950.00,
      totalAppealValue: 1188950.00,
      highProbabilityAppeals: 178,
      mediumProbabilityAppeals: 87,
      lowProbabilityAppeals: 36,
      denialCategories: {
        clinicalNecessity: { count: 134, appealRate: 82.1, avgValue: 4200.00 },
        priorAuthorization: { count: 98, appealRate: 86.7, avgValue: 4400.00 },
        drgCoding: { count: 67, appealRate: 79.1, avgValue: 3800.00 },
        documentation: { count: 54, appealRate: 70.4, avgValue: 3300.00 },
        timelyFiling: { count: 34, appealRate: 44.1, avgValue: 2900.00 }
      },
      successProbability: {
        overall: 79.6,
        byCategory: {
          clinicalNecessity: 81.3,
          priorAuthorization: 84.7,
          drgCoding: 76.9,
          documentation: 67.2,
          timelyFiling: 38.9
        }
      },
      estimatedRecovery: 946204.20,
      roi: 308.9
    },
    redundantRequestOpportunities: {
      totalRequests: 1567,
      redundantCount: 456,
      redundancyRate: 29.1,
      avgProcessingCost: 49.00,
      totalWastedCost: 22344.00,
      requestTypes: {
        medicalRecords: { total: 398, redundant: 127, rate: 31.9, avgCost: 65.00 },
        priorAuthDocuments: { total: 287, redundant: 89, rate: 31.0, avgCost: 60.00 },
        labResults: { total: 234, redundant: 78, rate: 33.3, avgCost: 40.00 },
        imagingReports: { total: 198, redundant: 58, rate: 29.3, avgCost: 70.00 },
        physicianNotes: { total: 167, redundant: 45, rate: 26.9, avgCost: 55.00 },
        dischargeSummary: { total: 156, redundant: 34, rate: 21.8, avgCost: 45.00 },
        consultReports: { total: 127, redundant: 25, rate: 19.7, avgCost: 75.00 }
      },
      automationPotential: {
        highPriority: 342,
        mediumPriority: 78,
        lowPriority: 36,
        estimatedSavings: 16758.00,
        implementationCost: 11000.00,
        paybackPeriod: 7.9
      }
    },
    performanceMetrics: {
      denialTrend: -9.4,
      appealSuccessTrend: 11.8,
      redundancyTrend: -16.9,
      averageResolutionTime: 15.7,
      staffHoursPerAppeal: 2.9,
      staffHoursPerRedundantRequest: 1.7
    }
  },
  {
    payerId: "MEDICAID-001",
    payerName: "Medicaid",
    payerType: "Government",
    totalClaims: 1789,
    appealOpportunities: {
      totalDenials: 298,
      appealableCount: 187,
      appealRate: 62.8,
      averageAppealValue: 2850.00,
      totalAppealValue: 532950.00,
      highProbabilityAppeals: 89,
      mediumProbabilityAppeals: 67,
      lowProbabilityAppeals: 31,
      denialCategories: {
        clinicalNecessity: { count: 98, appealRate: 71.4, avgValue: 3200.00 },
        timelyFiling: { count: 78, appealRate: 38.5, avgValue: 2400.00 },
        documentation: { count: 67, appealRate: 65.7, avgValue: 2800.00 },
        drgCoding: { count: 34, appealRate: 82.4, avgValue: 3400.00 },
        priorAuthorization: { count: 21, appealRate: 76.2, avgValue: 3100.00 }
      },
      successProbability: {
        overall: 65.4,
        byCategory: {
          clinicalNecessity: 69.8,
          timelyFiling: 32.1,
          documentation: 58.9,
          drgCoding: 78.3,
          priorAuthorization: 71.4
        }
      },
      estimatedRecovery: 348449.30,
      roi: 185.7
    },
    redundantRequestOpportunities: {
      totalRequests: 1234,
      redundantCount: 387,
      redundancyRate: 31.4,
      avgProcessingCost: 42.00,
      totalWastedCost: 16254.00,
      requestTypes: {
        medicalRecords: { total: 345, redundant: 115, rate: 33.3, avgCost: 55.00 },
        labResults: { total: 267, redundant: 89, rate: 33.3, avgCost: 30.00 },
        physicianNotes: { total: 198, redundant: 67, rate: 33.8, avgCost: 50.00 },
        dischargeSummary: { total: 156, redundant: 48, rate: 30.8, avgCost: 35.00 },
        imagingReports: { total: 134, redundant: 38, rate: 28.4, avgCost: 60.00 },
        pathologyReports: { total: 89, redundant: 21, rate: 23.6, avgCost: 70.00 },
        consultReports: { total: 45, redundant: 9, rate: 20.0, avgCost: 45.00 }
      },
      automationPotential: {
        highPriority: 290,
        mediumPriority: 67,
        lowPriority: 30,
        estimatedSavings: 12190.50,
        implementationCost: 7500.00,
        paybackPeriod: 7.4
      }
    },
    performanceMetrics: {
      denialTrend: -5.2,
      appealSuccessTrend: 7.8,
      redundancyTrend: -12.4,
      averageResolutionTime: 24.6,
      staffHoursPerAppeal: 4.1,
      staffHoursPerRedundantRequest: 2.2
    }
  }
];

// Aggregate feasibility metrics across all payers
export const feasibilityMetrics = {
  totalAnalysis: {
    totalPayers: 5,
    totalClaims: 10149,
    totalDenials: 1638,
    totalAppealOpportunities: 1245,
    totalRedundantRequests: 2075,
    overallAppealRate: 76.0,
    overallRedundancyRate: 30.3
  },
  financialImpact: {
    totalAppealValue: 4821775.00,
    estimatedRecovery: 3795764.75,
    totalWastedCosts: 97685.00,
    potentialSavings: 73263.25,
    netFinancialBenefit: 3869028.00,
    implementationCost: 48000.00,
    overallROI: 8060.0
  },
  operationalImpact: {
    totalStaffHoursWasted: 4556.5,
    staffHoursSavings: 3417.4,
    averageResolutionTime: 17.2,
    processEfficiencyGain: 23.8,
    workloadReduction: 1688 // Total cases that could be automated
  },
  payerComparison: {
    highestAppealRate: { payer: "Aetna", rate: 84.6 },
    lowestAppealRate: { payer: "Medicaid", rate: 62.8 },
    highestRedundancyRate: { payer: "Blue Cross Blue Shield", rate: 32.0 },
    lowestRedundancyRate: { payer: "Aetna", rate: 29.1 },
    bestROI: { payer: "Aetna", roi: 325.4 },
    fastestResolution: { payer: "Aetna", time: 12.8 }
  },
  recommendedPrioritization: [
    {
      payer: "Aetna",
      priority: 1,
      reasoning: "Highest appeal rate (84.6%) and ROI (325.4%), fastest resolution time",
      estimatedImpact: 689931.00
    },
    {
      payer: "Blue Cross Blue Shield", 
      priority: 2,
      reasoning: "High appeal rate (82.9%) and strong ROI (318.7%), manageable complexity",
      estimatedImpact: 797594.25
    },
    {
      payer: "Medicare",
      priority: 3,
      reasoning: "Large volume opportunity, good appeal rate (74.1%), established processes",
      estimatedImpact: 1057901.25
    },
    {
      payer: "UnitedHealthcare",
      priority: 4,
      reasoning: "Good volume and appeal rate (77.8%), moderate implementation complexity",
      estimatedImpact: 962962.20
    },
    {
      payer: "Medicaid",
      priority: 5,
      reasoning: "Lower appeal rates (62.8%) and longer resolution times, but significant volume",
      estimatedImpact: 360639.80
    }
  ]
};