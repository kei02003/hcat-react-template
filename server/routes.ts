import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requirePermission, requireAnyPermission, requireRoleLevel, auditAction, type AuthenticatedRequest } from "./auth/middleware";
import { rbacService } from "./auth/rbac";
import { demoUserService } from "./demo-users";
import { insertMetricsSchema, insertDocumentationRequestSchema, insertPayerBehaviorSchema, insertRedundancyMatrixSchema, insertPredictiveAnalyticsSchema, insertDenialPredictionsSchema, insertRiskFactorsSchema } from "@shared/schema";
import { predictDenialRisk, generateSmartRecommendations, analyzeDenialPatterns } from "./openai";

// Function to generate dynamic appeal cases for missing denial IDs
function generateDynamicAppealCase(denialId: string) {
  // Extract patient info from denial ID to create realistic data
  const patientNames = [
    "Anderson, Robert K.", "Baker, Jennifer L.", "Clark, Michael A.", 
    "Davis, Sarah M.", "Evans, David J.", "Foster, Lisa R.",
    "Garcia, Maria C.", "Harris, James P.", "Johnson, Emma S.",
    "King, Christopher T.", "Lewis, Amanda D.", "Martinez, Carlos F."
  ];
  
  const departments = ["Cardiology", "Pulmonology", "Emergency", "Surgery", "Orthopedics", "Radiology"];
  const payers = ["Medicare", "Blue Cross Blue Shield", "Aetna", "UnitedHealthcare", "Humana"];
  const physicians = ["Dr. Sarah Johnson", "Dr. Michael Chen", "Dr. Lisa Rodriguez", "Dr. Robert Martinez", "Dr. Amanda Wilson"];
  
  // Generate random but consistent data based on denial ID hash
  const hashCode = denialId.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const patientIndex = Math.abs(hashCode) % patientNames.length;
  const deptIndex = Math.abs(hashCode * 2) % departments.length;
  const payerIndex = Math.abs(hashCode * 3) % payers.length;
  const physicianIndex = Math.abs(hashCode * 4) % physicians.length;
  
  return {
    id: `appeal-${denialId}`,
    patientName: patientNames[patientIndex],
    patientId: `PAT-${Math.abs(hashCode).toString().substring(0, 5)}`,
    admissionId: `ADM-${denialId.substring(0, 7)}`,
    claimId: `CLM-${denialId.substring(3)}`,
    denialId: denialId,
    payer: payers[payerIndex],
    payerId: `${payers[payerIndex].split(' ')[0].toUpperCase()}-001`,
    denialReason: "Medical Necessity - Clinical Documentation Required",
    denialCode: "M80",
    denialDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    appealProbability: Math.floor(Math.random() * 30) + 70, // 70-99% for high probability
    denialAmount: `$${(Math.random() * 50000 + 10000).toFixed(0)}.00`,
    department: departments[deptIndex],
    attendingPhysician: physicians[physicianIndex],
    clinicalEvidence: {
      vitalSigns: {
        findings: [
          "Documented abnormal vital signs requiring monitoring",
          "Blood pressure readings indicating medical intervention needed",
          "Respiratory rate demonstrating clinical concern"
        ],
        supportingDocumentation: "Nursing flow sheets and vital sign records"
      },
      labResults: {
        findings: [
          "Laboratory values indicating acute medical condition",
          "Abnormal findings requiring immediate attention",
          "Blood work supporting medical necessity"
        ],
        supportingDocumentation: "Laboratory reports and pathology results"
      },
      medications: {
        findings: [
          "Medications requiring hospital-level administration",
          "IV therapy not suitable for outpatient setting",
          "Complex medication management needed"
        ],
        supportingDocumentation: "Medication administration records"
      },
      imaging: {
        findings: [
          "Radiological evidence supporting admission",
          "Imaging results demonstrating acute findings",
          "Diagnostic studies confirming medical necessity"
        ],
        supportingDocumentation: "Radiology reports and imaging studies"
      },
      physicianNotes: {
        findings: [
          "Physician documentation supporting inpatient level care",
          "Clinical assessment indicating hospital admission required",
          "Medical decision-making documented for inpatient status"
        ],
        supportingDocumentation: "Progress notes and physician assessments"
      }
    },
    insurerCriteria: {
      medicalNecessity: [
        "Patient condition requires inpatient level monitoring",
        "Treatment cannot be safely provided in outpatient setting",
        "Clinical indicators support medical necessity",
        "Standard of care requires hospital admission"
      ],
      supportingGuidelines: [
        "Medicare Guidelines for Medical Necessity",
        "Clinical Practice Guidelines",
        "Evidence-based medical standards"
      ]
    },
    appealStrength: {
      strongPoints: [
        "Clear clinical documentation supporting admission",
        "Objective medical evidence of necessity",
        "Appropriate physician assessment and care plan",
        "Meets all criteria for inpatient level care"
      ],
      medicalJustification: "Patient meets all criteria for medically necessary inpatient admission with appropriate clinical documentation",
      regulatorySupport: "Meets all applicable guidelines for inpatient medical necessity"
    },
    generatedLetter: {
      letterType: "initial_appeal",
      priority: "standard",
      expectedOutcome: "overturn",
      confidenceScore: Math.floor(Math.random() * 30) + 70,
      generatedDate: new Date().toISOString(),
      submissionDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    status: "pending_generation",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);
  
  // Initialize RBAC system
  await rbacService.initializeRolesAndPermissions();
  
  // Create demo users for testing (only in development)
  if (process.env.NODE_ENV === 'development') {
    try {
      await demoUserService.createDemoUsers();
    } catch (error) {
      console.warn('Demo users creation skipped (tables may not exist yet)');
    }
  }

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req, res) => {
    try {
      const user = req.user as any;
      const userId = user.claims.sub;
      const userWithPermissions = await rbacService.getUserWithPermissions(userId);
      res.json(userWithPermissions);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Demo users management (development only)
  if (process.env.NODE_ENV === 'development') {
    app.get('/api/demo-users', async (req, res) => {
      try {
        const users = await demoUserService.listDemoUsers();
        res.json(users);
      } catch (error) {
        res.status(500).json({ message: "Failed to list demo users" });
      }
    });

    app.post('/api/demo-users/create', async (req, res) => {
      try {
        await demoUserService.createDemoUsers();
        res.json({ message: "Demo users created successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to create demo users" });
      }
    });

    app.delete('/api/demo-users', async (req, res) => {
      try {
        await demoUserService.removeDemoUsers();
        res.json({ message: "Demo users removed successfully" });
      } catch (error) {
        res.status(500).json({ message: "Failed to remove demo users" });
      }
    });

    app.post('/api/demo/reset', async (req, res) => {
      try {
        // Import appeal data to reset statuses
        const { appealCases } = await import('./appeal-data.js');
        
        // Reset all appeal cases to initial state
        appealCases.forEach(appealCase => {
          appealCase.status = "pending_generation";
          appealCase.updatedAt = appealCase.createdAt;
        });
        
        res.json({ 
          message: "Demo reset completed successfully",
          resetCount: appealCases.length,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error("Demo reset error:", error);
        res.status(500).json({ message: "Failed to reset demo state" });
      }
    });
  }

  // Metrics routes (authentication disabled for now)
  app.get("/api/metrics", 
    async (_req, res) => {
      try {
        const metrics = await storage.getMetrics();
        res.json(metrics);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch metrics" });
      }
    }
  );

  app.post("/api/metrics", 
    async (req, res) => {
      try {
        const validatedData = insertMetricsSchema.parse(req.body);
        const metric = await storage.createMetric(validatedData);
        res.json(metric);
      } catch (error) {
        res.status(400).json({ message: "Invalid metric data" });
      }
    }
  );

  // Documentation requests routes (require denials permissions)
  app.get("/api/documentation-requests", 
    async (_req, res) => {
      try {
        const requests = await storage.getDocumentationRequests();
        res.json(requests);
      } catch (error) {
        res.status(500).json({ message: "Failed to fetch documentation requests" });
      }
    }
  );

  app.post("/api/documentation-requests",
    async (req, res) => {
      try {
        const validatedData = insertDocumentationRequestSchema.parse(req.body);
        const request = await storage.createDocumentationRequest(validatedData);
        res.json(request);
      } catch (error) {
        res.status(400).json({ message: "Invalid documentation request data" });
      }
    }
  );

  // Payer behavior routes
  app.get("/api/payer-behavior", async (req, res) => {
    try {
      const behavior = await storage.getPayerBehavior();
      res.json(behavior);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payer behavior data" });
    }
  });

  app.post("/api/payer-behavior", async (req, res) => {
    try {
      const validatedData = insertPayerBehaviorSchema.parse(req.body);
      const behavior = await storage.createPayerBehavior(validatedData);
      res.json(behavior);
    } catch (error) {
      res.status(400).json({ message: "Invalid payer behavior data" });
    }
  });

  // Redundancy matrix routes
  app.get("/api/redundancy-matrix", async (req, res) => {
    try {
      const matrix = await storage.getRedundancyMatrix();
      res.json(matrix);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch redundancy matrix data" });
    }
  });

  app.post("/api/redundancy-matrix", async (req, res) => {
    try {
      const validatedData = insertRedundancyMatrixSchema.parse(req.body);
      const matrix = await storage.createRedundancyMatrix(validatedData);
      res.json(matrix);
    } catch (error) {
      res.status(400).json({ message: "Invalid redundancy matrix data" });
    }
  });

  // Predictive Analytics routes
  app.get("/api/predictive-analytics", async (req, res) => {
    try {
      const analytics = await storage.getPredictiveAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch predictive analytics" });
    }
  });

  app.post("/api/predictive-analytics", async (req, res) => {
    try {
      const validatedData = insertPredictiveAnalyticsSchema.parse(req.body);
      const analytics = await storage.createPredictiveAnalytics(validatedData);
      res.json(analytics);
    } catch (error) {
      res.status(400).json({ message: "Invalid predictive analytics data" });
    }
  });

  // Denial Predictions routes
  app.get("/api/denial-predictions", async (req, res) => {
    try {
      const predictions = await storage.getDenialPredictions();
      res.json(predictions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch denial predictions" });
    }
  });

  app.post("/api/denial-predictions", async (req, res) => {
    try {
      const validatedData = insertDenialPredictionsSchema.parse(req.body);
      const predictions = await storage.createDenialPredictions(validatedData);
      res.json(predictions);
    } catch (error) {
      res.status(400).json({ message: "Invalid denial predictions data" });
    }
  });

  // Risk Factors routes
  app.get("/api/risk-factors", async (req, res) => {
    try {
      const factors = await storage.getRiskFactors();
      res.json(factors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch risk factors" });
    }
  });

  app.post("/api/risk-factors", async (req, res) => {
    try {
      const validatedData = insertRiskFactorsSchema.parse(req.body);
      const factors = await storage.createRiskFactors(validatedData);
      res.json(factors);
    } catch (error) {
      res.status(400).json({ message: "Invalid risk factors data" });
    }
  });

  // Department performance routes  
  app.get("/api/department-performance", async (req, res) => {
    try {
      const performance = await storage.getDepartmentPerformance();
      res.json(performance);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch department performance" });
    }
  });

  // Pre-Authorization Management routes
  app.get("/api/pre-auth-requests", async (req, res) => {
    try {
      const requests = await storage.getPreAuthRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pre-auth requests" });
    }
  });

  app.get("/api/insurer-criteria", async (req, res) => {
    try {
      const criteria = await storage.getInsurerCriteria();
      res.json(criteria);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch insurer criteria" });
    }
  });

  app.get("/api/procedure-auth-requirements", async (req, res) => {
    try {
      const requirements = await storage.getProcedureAuthRequirements();
      res.json(requirements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch procedure auth requirements" });
    }
  });

  // Update pre-auth request status
  app.patch("/api/pre-auth-requests/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { status, flaggedAt, reviewerNotes } = req.body;
      
      const updatedRequest = await storage.updatePreAuthRequest(id, {
        status,
        // flaggedAt,
        reviewerNotes,
        updatedAt: new Date()
      });
      
      res.json(updatedRequest);
    } catch (error) {
      console.error("Failed to update pre-auth request:", error);
      res.status(500).json({ message: "Failed to update pre-auth request" });
    }
  });

  // Clinical Decision Support routes
  app.get("/api/patient-status-monitoring", async (req, res) => {
    try {
      const monitoring = await storage.getPatientStatusMonitoring();
      res.json(monitoring);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient status monitoring" });
    }
  });

  app.get("/api/clinical-indicators", async (req, res) => {
    try {
      const patientId = req.query.patientId as string;
      const indicators = await storage.getClinicalIndicators(patientId);
      res.json(indicators);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinical indicators" });
    }
  });

  app.get("/api/medical-record-analysis", async (req, res) => {
    try {
      const analysis = await storage.getMedicalRecordAnalysis();
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch medical record analysis" });
    }
  });

  app.get("/api/clinical-alerts", async (req, res) => {
    try {
      const alerts = await storage.getClinicalAlerts();
      res.json(alerts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinical alerts" });
    }
  });

  // Appeal Generation routes
  app.get("/api/appeal-cases", async (req, res) => {
    try {
      const { appealCases } = await import("./appeal-data");
      // Filter for high-probability appeals (>70%)
      const highProbabilityAppeals = appealCases.filter(appeal => appeal.appealProbability > 70);
      res.json(highProbabilityAppeals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appeal cases" });
    }
  });

  app.get("/api/appeal-metrics", async (req, res) => {
    try {
      const { performanceMetrics } = await import("./appeal-data");
      res.json(performanceMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appeal metrics" });
    }
  });

  // Timely Filing routes
  app.get("/api/timely-filing-claims", async (req, res) => {
    try {
      const { timelyFilingClaims } = await import("./timely-filing-data");
      const { agingCategory, denialStatus, department, assignedBiller, payer } = req.query;
      
      let filteredClaims = [...timelyFilingClaims];
      
      // Filter by aging category
      if (agingCategory && agingCategory !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.agingCategory === agingCategory);
      }
      
      // Filter by denial status
      if (denialStatus && denialStatus !== 'all') {
        if (denialStatus === 'denied') {
          filteredClaims = filteredClaims.filter(claim => claim.denialStatus === 'denied');
        } else if (denialStatus === 'at_risk') {
          filteredClaims = filteredClaims.filter(claim => claim.daysRemaining <= 14 && claim.denialStatus !== 'denied');
        }
      }
      
      // Filter by department
      if (department && department !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.department === department);
      }
      
      // Filter by assigned biller
      if (assignedBiller && assignedBiller !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.assignedBiller === assignedBiller);
      }
      
      // Filter by payer
      if (payer && payer !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.payer === payer);
      }
      
      res.json(filteredClaims);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timely filing claims" });
    }
  });

  app.get("/api/timely-filing-metrics", async (req, res) => {
    try {
      const { timelyFilingMetrics, agingCategories } = await import("./timely-filing-data");
      res.json({ metrics: timelyFilingMetrics, categories: agingCategories });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch timely filing metrics" });
    }
  });

  // Feasibility Analysis routes
  app.get("/api/feasibility-analysis", async (req, res) => {
    try {
      const { payerAnalysis, feasibilityMetrics } = await import("./feasibility-analysis-data");
      res.json({ payerAnalysis, feasibilityMetrics });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch feasibility analysis" });
    }
  });

  app.get("/api/payer-analysis/:payerId", async (req, res) => {
    try {
      const { payerAnalysis } = await import("./feasibility-analysis-data");
      const { payerId } = req.params;
      
      const payer = payerAnalysis.find(p => p.payerId === payerId);
      if (!payer) {
        return res.status(404).json({ message: "Payer not found" });
      }
      
      res.json(payer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payer analysis" });
    }
  });

  app.get("/api/challenge-letters/:appealId", async (req, res) => {
    try {
      const { appealId } = req.params;
      const { appealCases, challengeLetterTemplate } = await import("./appeal-data");
      
      // Handle both appeal IDs (appeal-001) and denial IDs (DN-25-001234)
      let appealCase = appealCases.find(appeal => appeal.id === appealId);
      
      // If not found by appeal ID, try to find by denial ID
      if (!appealCase) {
        appealCase = appealCases.find(appeal => appeal.denialId === appealId);
      }
      
      // If still not found, generate a dynamic appeal case
      if (!appealCase) {
        appealCase = generateDynamicAppealCase(appealId);
      }

      // Generate challenge letter with specific clinical evidence
      const challengeLetter = generateChallengeLetter(appealCase, challengeLetterTemplate);
      
      res.json({
        appealCase,
        challengeLetter,
        clinicalEvidence: appealCase.clinicalEvidence,
        appealProbability: appealCase.appealProbability
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to generate challenge letter" });
    }
  });

  // Generate challenge letter endpoint
  app.post("/api/challenge-letters/generate", async (req, res) => {
    try {
      const { denialId, notes, urgency } = req.body;
      const { appealCases, challengeLetterTemplate } = await import("./appeal-data");
      
      // Find appeal case by denial ID
      let appealCase = appealCases.find(appeal => appeal.denialId === denialId);
      
      // If not found, generate a dynamic appeal case
      if (!appealCase) {
        appealCase = generateDynamicAppealCase(denialId);
      }

      // Generate challenge letter with specific clinical evidence
      const challengeLetter = generateChallengeLetter(appealCase, challengeLetterTemplate);
      
      // Update the case status to indicate letter has been generated
      appealCase.status = "letter_generated";
      appealCase.updatedAt = new Date().toISOString();
      
      res.json({
        appealCase,
        challengeLetter,
        clinicalEvidence: appealCase.clinicalEvidence,
        appealProbability: appealCase.appealProbability,
        success: true,
        message: "Appeal letter generated successfully"
      });
    } catch (error) {
      console.error("Error generating challenge letter:", error);
      res.status(500).json({ message: "Failed to generate challenge letter" });
    }
  });

  // Clinical decision routes
  app.get("/api/clinical-decisions", async (req, res) => {
    try {
      // Import the clinical decision sample data
      const { clinicalDecisionSample } = await import("./simple-clinical-data");
      res.json(clinicalDecisionSample);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch clinical decisions" });
    }
  });

  app.get("/api/appeal-requests", async (req, res) => {
    try {
      const requests = await storage.getAppealRequests();
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appeal requests" });
    }
  });

  app.get("/api/appeal-letters", async (req, res) => {
    try {
      const letters = await storage.getAppealLetters();
      res.json(letters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appeal letters" });
    }
  });

  app.get("/api/appeal-outcomes", async (req, res) => {
    try {
      const outcomes = await storage.getAppealOutcomes();
      res.json(outcomes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch appeal outcomes" });
    }
  });

  app.get("/api/denial-patterns", async (req, res) => {
    try {
      const patterns = await storage.getDenialPatterns();
      res.json(patterns);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch denial patterns" });
    }
  });

  // Summary Dashboard routes
  app.get("/api/summary-metrics", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      
      // Enhanced period-based metrics with more realistic variations
      const getMetricsForPeriod = (periodType: string) => {
        switch (periodType) {
          case "7d":
            return {
              totalRevenue: "$580K",
              revenueChange: 3.2,
              denialRate: 11.8,
              denialChange: -0.8,
              appealSuccessRate: 89.2,
              appealChange: 2.1,
              arDays: 41.5,
              arChange: -1.2,
              timelyFilingRate: 96.1,
              timelyFilingChange: 1.1
            };
          case "90d":
            return {
              totalRevenue: "$7.2M",
              revenueChange: 12.5,
              denialRate: 11.2,
              denialChange: -3.4,
              appealSuccessRate: 91.8,
              appealChange: 8.7,
              arDays: 39.8,
              arChange: -5.8,
              timelyFilingRate: 97.3,
              timelyFilingChange: 4.2
            };
          default: // 30d
            return {
              totalRevenue: "$2.4M",
              revenueChange: 8.2,
              denialRate: 12.3,
              denialChange: -2.1,
              appealSuccessRate: 87.5,
              appealChange: 5.3,
              arDays: 42.1,
              arChange: -3.4,
              timelyFilingRate: 94.7,
              timelyFilingChange: 2.8
            };
        }
      };
      
      const summaryMetrics = getMetricsForPeriod(period as string);
      res.json(summaryMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch summary metrics" });
    }
  });

  app.get("/api/recent-activity", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      
      // Generate period-specific activity data
      const now = new Date();
      const getActivityForPeriod = (periodType: string) => {
        const baseActivities = [
          {
            id: "1",
            type: "appeal",
            message: "Elena Martinez appeal approved - $12,450 recovered",
            timestamp: "2025-01-08 14:30",
            priority: "high",
            status: "completed"
          },
          {
            id: "2", 
            type: "denial",
            message: "New denial received: Johnson, Michael R. - Medical necessity",
            timestamp: "2025-01-08 13:15",
            priority: "medium",
            status: "pending"
          },
          {
            id: "3",
            type: "filing",
            message: "Critical: Thompson, Robert K. filing deadline in 5 days",
            timestamp: "2025-01-08 12:45",
            priority: "high",
            status: "overdue"
          },
          {
            id: "4",
            type: "collection",
            message: "Payment received: $8,750 - Wilson, Sarah M.",
            timestamp: "2025-01-08 11:20",
            priority: "low",
            status: "completed"
          },
          {
            id: "5",
            type: "appeal",
            message: "Sarah Thompson appeal generated - 95% success probability",
            timestamp: "2025-01-08 10:15",
            priority: "medium",
            status: "pending"
          }
        ];
        
        if (periodType === "7d") {
          return baseActivities.slice(0, 3); // Show fewer activities for 7 days
        } else if (periodType === "90d") {
          // Add more historical activities for 90 days
          return [
            ...baseActivities,
            {
              id: "6",
              type: "collection",
              message: "Large payment received: $25,000 - Insurance settlement",
              timestamp: "2025-01-07 16:45",
              priority: "high",
              status: "completed"
            },
            {
              id: "7",
              type: "denial",
              message: "Complex case resolved: Rodriguez, Maria A. - Prior auth issue",
              timestamp: "2025-01-06 09:30",
              priority: "medium",
              status: "completed"
            }
          ];
        }
        return baseActivities; // Default 30d
      };
      
      const recentActivity = getActivityForPeriod(period as string);
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent activity" });
    }
  });

  // AI-powered routes
  app.post("/api/ai/predict-denial-risk", async (req, res) => {
    try {
      const prediction = await predictDenialRisk(req.body);
      res.json(prediction);
    } catch (error) {
      res.status(500).json({ message: "Failed to predict denial risk", error: (error as Error).message });
    }
  });

  app.post("/api/ai/generate-recommendations", async (req, res) => {
    try {
      const recommendations = await generateSmartRecommendations(req.body);
      res.json(recommendations);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate recommendations", error: (error as Error).message });
    }
  });

  app.post("/api/ai/analyze-patterns", async (req, res) => {
    try {
      const analysis = await analyzeDenialPatterns(req.body.denialData);
      res.json(analysis);
    } catch (error) {
      res.status(500).json({ message: "Failed to analyze patterns", error: (error as Error).message });
    }
  });

  // Template Management API routes
  app.get("/api/pre-auth-templates", async (req, res) => {
    try {
      const templates = await storage.getPreAuthTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.post("/api/pre-auth-templates", async (req, res) => {
    try {
      const template = await storage.createPreAuthTemplate(req.body);
      res.json(template);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/pre-auth-templates/:id", async (req, res) => {
    try {
      const template = await storage.updatePreAuthTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/pre-auth-templates/:id", async (req, res) => {
    try {
      await storage.deletePreAuthTemplate(req.params.id);
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  app.get("/api/template-fields/:templateId", async (req, res) => {
    try {
      const fields = await storage.getTemplateFields(req.params.templateId);
      res.json(fields);
    } catch (error) {
      console.error("Error fetching template fields:", error);
      res.status(500).json({ message: "Failed to fetch template fields" });
    }
  });

  app.post("/api/template-fields", async (req, res) => {
    try {
      const field = await storage.createTemplateField(req.body);
      res.json(field);
    } catch (error) {
      console.error("Error creating template field:", error);
      res.status(500).json({ message: "Failed to create template field" });
    }
  });

  app.put("/api/template-fields/:id", async (req, res) => {
    try {
      const field = await storage.updateTemplateField(req.params.id, req.body);
      if (!field) {
        return res.status(404).json({ message: "Template field not found" });
      }
      res.json(field);
    } catch (error) {
      console.error("Error updating template field:", error);
      res.status(500).json({ message: "Failed to update template field" });
    }
  });

  app.get("/api/template-mapping-configs/:templateId", async (req, res) => {
    try {
      const configs = await storage.getTemplateMappingConfigs(req.params.templateId);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching mapping configs:", error);
      res.status(500).json({ message: "Failed to fetch mapping configs" });
    }
  });

  app.post("/api/template-mapping-configs", async (req, res) => {
    try {
      const config = await storage.createTemplateMappingConfig(req.body);
      res.json(config);
    } catch (error) {
      console.error("Error creating mapping config:", error);
      res.status(500).json({ message: "Failed to create mapping config" });
    }
  });

  app.put("/api/template-mapping-configs/:id", async (req, res) => {
    try {
      const config = await storage.updateTemplateMappingConfig(req.params.id, req.body);
      if (!config) {
        return res.status(404).json({ message: "Mapping config not found" });
      }
      res.json(config);
    } catch (error) {
      console.error("Error updating mapping config:", error);
      res.status(500).json({ message: "Failed to update mapping config" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to generate challenge letters
function generateChallengeLetter(appealCase: any, template: any): string {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Extract key clinical findings based on appeal type
  let keyClinicalFindings = [];
  if (appealCase.clinicalEvidence.vitalSigns) {
    keyClinicalFindings.push(...appealCase.clinicalEvidence.vitalSigns.findings);
  }
  if (appealCase.clinicalEvidence.medications) {
    keyClinicalFindings.push(...appealCase.clinicalEvidence.medications.findings);
  }
  if (appealCase.clinicalEvidence.respiratorySupport) {
    keyClinicalFindings.push(...appealCase.clinicalEvidence.respiratorySupport.findings);
  }

  // Build the complete letter
  let challengeLetter = template.header.template
    .replace('[Date]', currentDate)
    .replace('[Insurance Company Name]', appealCase.payer)
    .replace('[Patient Name]', appealCase.patientName)
    .replace('[Patient ID]', appealCase.patientId)
    .replace('[Claim ID]', appealCase.claimId)
    .replace('[Service Date]', new Date(appealCase.createdAt).toLocaleDateString())
    .replace('[Attending Physician]', appealCase.attendingPhysician);

  challengeLetter += template.introduction.template;

  let clinicalSummary = template.clinicalSummary.template
    .replace('[Patient Name]', appealCase.patientName.split(',')[0])
    .replace('[primary diagnosis]', appealCase.denialReason.toLowerCase())
    .replace('[Key Clinical Finding 1]', keyClinicalFindings[0] || 'Clinical instability documented')
    .replace('[Key Clinical Finding 2]', keyClinicalFindings[1] || 'Intensive monitoring required')
    .replace('[Key Clinical Finding 3]', keyClinicalFindings[2] || 'IV medications necessary')
    .replace('[Key Clinical Finding 4]', keyClinicalFindings[3] || 'Complex medical management needed');

  challengeLetter += clinicalSummary;

  // Customize medical necessity section based on case type
  let medicalNecessity = template.medicalNecessity.template;
  if (appealCase.denialReason.includes('heart failure')) {
    medicalNecessity = medicalNecessity
      .replace('[Clinical evidence of severity]', 'Acute decompensated heart failure with BNP >1000 and hypoxia (O2 sat 88%)')
      .replace('[IV medications, monitoring needs]', 'IV diuretic therapy required (Furosemide 40mg IV BID) with hemodynamic monitoring')
      .replace('[Vital sign abnormalities, instability]', 'Tachycardia (HR 110), hypertension (165/95), and respiratory distress')
      .replace('[Duration and complexity of care]', 'Required 72+ hours of intensive cardiac monitoring and IV therapy');
  } else if (appealCase.denialReason.includes('COPD')) {
    medicalNecessity = medicalNecessity
      .replace('[Clinical evidence of severity]', 'Severe COPD exacerbation with respiratory failure (O2 sat 85%)')
      .replace('[IV medications, monitoring needs]', 'BiPAP support and IV steroid therapy (Methylprednisolone 40mg q8h)')
      .replace('[Vital sign abnormalities, instability]', 'Severe hypoxia, tachypnea (RR 28), and fever (100.8°F)')
      .replace('[Duration and complexity of care]', 'Required 48+ hours of intensive respiratory support and monitoring');
  }

  challengeLetter += medicalNecessity;

  let regulatorySupport = template.regulatorySupport.template;
  if (appealCase.insurerCriteria.supportingGuidelines) {
    const guidelines = appealCase.insurerCriteria.supportingGuidelines.join('\n• ');
    regulatorySupport = regulatorySupport
      .replace('[Relevant LCD/NCD References]', guidelines.split('\n')[0])
      .replace('[Professional Society Guidelines]', guidelines.split('\n')[1] || 'American College of Cardiology Guidelines')
      .replace('[CMS Coverage Determinations]', guidelines.split('\n')[2] || 'CMS Manual System Guidelines');
  }

  challengeLetter += regulatorySupport;

  challengeLetter += template.conclusion.template
    .replace('[Physician Name, MD]', appealCase.attendingPhysician)
    .replace('[Title]', 'Attending Physician')
    .replace('[Department]', appealCase.department)
    .replace('[Contact Information]', 'medical.records@hospital.org | (555) 123-4567')
    .replace('[phone]', '(555) 123-4567');

  return challengeLetter;
}
