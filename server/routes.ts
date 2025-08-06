import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { requirePermission, requireAnyPermission, requireRoleLevel, auditAction, type AuthenticatedRequest } from "./auth/middleware";
import { rbacService } from "./auth/rbac";
import { demoUserService } from "./demo-users";
import { insertMetricsSchema, insertDocumentationRequestSchema, insertPayerBehaviorSchema, insertRedundancyMatrixSchema, insertPredictiveAnalyticsSchema, insertDenialPredictionsSchema, insertRiskFactorsSchema } from "@shared/schema";
import { predictDenialRisk, generateSmartRecommendations, analyzeDenialPatterns } from "./openai";

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
  app.get('/api/auth/user', isAuthenticated, async (req: AuthenticatedRequest, res) => {
    try {
      const userId = req.user.claims.sub;
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

  app.get("/api/challenge-letters/:appealId", async (req, res) => {
    try {
      const { appealId } = req.params;
      const { appealCases, challengeLetterTemplate } = await import("./appeal-data");
      const appealCase = appealCases.find(appeal => appeal.id === appealId);
      
      if (!appealCase) {
        return res.status(404).json({ message: "Appeal case not found" });
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
