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

  // Summary Dashboard routes
  app.get("/api/summary-metrics", async (req, res) => {
    try {
      const { period = "30d" } = req.query;
      
      // Mock summary metrics based on period
      const summaryMetrics = {
        totalRevenue: "$2.4M",
        revenueChange: period === "7d" ? 3.2 : period === "30d" ? 8.2 : 12.5,
        denialRate: 12.3,
        denialChange: period === "7d" ? -0.8 : period === "30d" ? -2.1 : -3.4,
        appealSuccessRate: 87.5,
        appealChange: period === "7d" ? 2.1 : period === "30d" ? 5.3 : 8.7,
        arDays: 42.1,
        arChange: period === "7d" ? -1.2 : period === "30d" ? -3.4 : -5.8,
        timelyFilingRate: 94.7,
        timelyFilingChange: period === "7d" ? 1.1 : period === "30d" ? 2.8 : 4.2
      };
      
      res.json(summaryMetrics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch summary metrics" });
    }
  });

  app.get("/api/recent-activity", async (req, res) => {
    try {
      const recentActivity = [
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

  // Import demo data for the redesigned pre-authorization module
  const {
    demoPreAuthTimeline,
    demoComplianceMetrics,
    demoPayerResponseAnalytics,
    demoDocumentationAlerts,
    demoStatusGridData,
    demoProcedureFlaggingRules,
    demoPayerCriteriaLibrary
  } = await import("./pre-auth-demo-data");

  // Redesigned Pre-Authorization Management API Endpoints

  // Get timeline data for interactive tracking view
  app.get("/api/pre-auth/timeline", isAuthenticated, async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string;
      
      // Filter demo data based on timeframe
      let filteredData = demoPreAuthTimeline;
      if (timeframe === "day") {
        filteredData = demoPreAuthTimeline.filter(item => item.daysUntilProcedure <= 1);
      } else if (timeframe === "week") {
        filteredData = demoPreAuthTimeline.filter(item => item.daysUntilProcedure <= 7);
      } else if (timeframe === "month") {
        filteredData = demoPreAuthTimeline.filter(item => item.daysUntilProcedure <= 30);
      }

      res.json(filteredData);
    } catch (error) {
      console.error("Error fetching timeline data:", error);
      res.status(500).json({ message: "Failed to fetch timeline data" });
    }
  });

  // Get compliance metrics for 3-day deadline tracking
  app.get("/api/pre-auth/compliance-metrics", isAuthenticated, async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string;
      
      // Return current compliance metrics
      res.json(demoComplianceMetrics);
    } catch (error) {
      console.error("Error fetching compliance metrics:", error);
      res.status(500).json({ message: "Failed to fetch compliance metrics" });
    }
  });

  // Get payer response analytics and trends
  app.get("/api/pre-auth/payer-analytics", isAuthenticated, async (req, res) => {
    try {
      const timeframe = req.query.timeframe as string;
      
      res.json(demoPayerResponseAnalytics);
    } catch (error) {
      console.error("Error fetching payer analytics:", error);
      res.status(500).json({ message: "Failed to fetch payer analytics" });
    }
  });

  // Get missing documentation alerts
  app.get("/api/pre-auth/missing-docs", async (req, res) => {
    try {
      // Filter alerts by priority and overdue status
      const sortedAlerts = demoDocumentationAlerts
        .filter(alert => !alert.isResolved)
        .sort((a, b) => {
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return priorityOrder[b.alertPriority] - priorityOrder[a.alertPriority];
        });

      res.json(sortedAlerts);
    } catch (error) {
      console.error("Error fetching documentation alerts:", error);
      res.status(500).json({ message: "Failed to fetch documentation alerts" });
    }
  });

  // Get status grid data for dashboard overview
  app.get("/api/pre-auth/status-grid", async (req, res) => {
    try {
      res.json(demoStatusGridData);
    } catch (error) {
      console.error("Error fetching status grid data:", error);
      res.status(500).json({ message: "Failed to fetch status grid data" });
    }
  });

  // Bulk submit pre-authorization requests
  app.post("/api/pre-auth/bulk-submit", isAuthenticated, async (req, res) => {
    try {
      const { requestIds } = req.body;
      
      if (!requestIds || !Array.isArray(requestIds)) {
        return res.status(400).json({ message: "Request IDs array is required" });
      }

      // Simulate bulk submission processing
      const results = requestIds.map(id => ({
        id,
        status: "submitted",
        submissionDate: new Date().toISOString(),
        message: "Successfully submitted to payer"
      }));

      res.json({
        success: true,
        submitted: results.length,
        results
      });
    } catch (error) {
      console.error("Error during bulk submission:", error);
      res.status(500).json({ message: "Failed to submit requests" });
    }
  });

  // Flag procedure for pre-authorization requirement
  app.post("/api/pre-auth/flag-procedure", isAuthenticated, async (req, res) => {
    try {
      const { procedureCode, patientId, payerId, scheduledDate } = req.body;
      
      if (!procedureCode || !patientId || !scheduledDate) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Check flagging rules
      const matchingRule = demoProcedureFlaggingRules.find(rule => 
        rule.procedureCode === procedureCode && 
        (rule.payerId === payerId || !rule.payerId)
      );

      if (!matchingRule) {
        return res.json({ 
          flagged: false, 
          message: "No pre-authorization required for this procedure" 
        });
      }

      // Calculate days until procedure and urgency
      const scheduledDateTime = new Date(scheduledDate);
      const currentDate = new Date();
      const daysUntil = Math.ceil((scheduledDateTime.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
      
      let urgencyLevel: "green" | "yellow" | "red" = "green";
      if (daysUntil <= 2) urgencyLevel = "red";
      else if (daysUntil <= 5) urgencyLevel = "yellow";

      const flaggedProcedure = {
        id: `flagged-${Date.now()}`,
        procedureCode,
        patientId,
        payerId,
        scheduledDate,
        daysUntilProcedure: daysUntil,
        urgencyLevel,
        flaggedDate: new Date().toISOString(),
        rule: matchingRule
      };

      res.json({
        flagged: true,
        procedure: flaggedProcedure,
        message: "Procedure flagged for pre-authorization"
      });
    } catch (error) {
      console.error("Error flagging procedure:", error);
      res.status(500).json({ message: "Failed to flag procedure" });
    }
  });

  // Get payer criteria library for quick reference
  app.get("/api/pre-auth/payer-criteria/:procedureCode", isAuthenticated, async (req, res) => {
    try {
      const { procedureCode } = req.params;
      const { payerId } = req.query;

      let criteria = demoPayerCriteriaLibrary.filter(c => 
        c.procedureCode === procedureCode && c.isActive
      );

      if (payerId) {
        criteria = criteria.filter(c => c.payerId === payerId);
      }

      res.json(criteria);
    } catch (error) {
      console.error("Error fetching payer criteria:", error);
      res.status(500).json({ message: "Failed to fetch payer criteria" });
    }
  });

  // Auto-generate pre-auth request form with patient data
  app.post("/api/pre-auth/generate-form", isAuthenticated, async (req, res) => {
    try {
      const { patientId, procedureCode, payerId } = req.body;

      if (!patientId || !procedureCode) {
        return res.status(400).json({ message: "Patient ID and procedure code are required" });
      }

      // Simulate form generation with auto-populated data
      const generatedForm = {
        formId: `form-${Date.now()}`,
        patientId,
        procedureCode,
        payerId,
        autoPopulatedFields: {
          patientName: "Auto-populated from patient record",
          memberID: "Auto-populated from insurance data",
          procedureName: "Auto-populated from procedure database",
          scheduledDate: "Auto-populated from scheduling system",
          diagnosis: "Auto-populated from clinical notes",
          clinicalJustification: "Auto-populated from physician notes"
        },
        requiredDocuments: [
          "Insurance verification",
          "Physician notes",
          "Diagnostic results",
          "Treatment history"
        ],
        estimatedProcessingTime: "3-5 business days",
        submissionDeadline: new Date(Date.now() + (3 * 24 * 60 * 60 * 1000)).toISOString()
      };

      res.json(generatedForm);
    } catch (error) {
      console.error("Error generating form:", error);
      res.status(500).json({ message: "Failed to generate form" });
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
