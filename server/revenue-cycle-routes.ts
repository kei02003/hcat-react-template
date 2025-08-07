import type { Express } from "express";
import { revenueCycleStorage } from "./revenue-cycle-storage";
import { csvImportService } from "./csv-import";
import { isAuthenticated } from "./replitAuth";
import { requirePermission, auditAction, type AuthenticatedRequest } from "./auth/middleware";
import multer from "multer";
import { 
  insertRevenueCycleAccountSchema,
  insertClinicalDecisionSchema,
  insertDenialWorkflowSchema,
  insertAppealCaseSchema,
  insertTimelyFilingClaimSchema,
  insertPreauthorizationDataSchema,
  insertPhysicianAdvisorReviewSchema,
  insertDocumentationTrackingSchema,
  insertPayorSchema,
  insertFeasibilityAnalysisSchema,
  insertDepartmentSchema,
  insertProviderSchema
} from "@shared/revenue-cycle-schema";

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
});

export function registerRevenueCycleRoutes(app: Express) {
  // Revenue Cycle Accounts
  app.get("/api/revenue-cycle/accounts", async (req, res) => {
    try {
      const accounts = await revenueCycleStorage.getRevenueCycleAccounts();
      res.json(accounts);
    } catch (error) {
      console.error("Error fetching revenue cycle accounts:", error);
      res.status(500).json({ message: "Failed to fetch accounts" });
    }
  });

  app.get("/api/revenue-cycle/accounts/:id", async (req, res) => {
    try {
      const account = await revenueCycleStorage.getRevenueCycleAccountById(req.params.id);
      if (!account) {
        return res.status(404).json({ message: "Account not found" });
      }
      res.json(account);
    } catch (error) {
      console.error("Error fetching account:", error);
      res.status(500).json({ message: "Failed to fetch account" });
    }
  });

  app.post("/api/revenue-cycle/accounts", async (req, res) => {
    try {
      const validatedData = insertRevenueCycleAccountSchema.parse(req.body);
      const account = await revenueCycleStorage.createRevenueCycleAccount(validatedData);
      res.status(201).json(account);
    } catch (error) {
      console.error("Error creating account:", error);
      res.status(400).json({ message: "Invalid account data" });
    }
  });

  // Clinical Decisions
  app.get("/api/revenue-cycle/clinical-decisions", async (req, res) => {
    try {
      const decisions = await revenueCycleStorage.getClinicalDecisions();
      res.json(decisions);
    } catch (error) {
      console.error("Error fetching clinical decisions:", error);
      res.status(500).json({ message: "Failed to fetch clinical decisions" });
    }
  });

  app.get("/api/revenue-cycle/clinical-decisions/account/:accountId", async (req, res) => {
    try {
      const decisions = await revenueCycleStorage.getClinicalDecisionsByAccount(req.params.accountId);
      res.json(decisions);
    } catch (error) {
      console.error("Error fetching clinical decisions for account:", error);
      res.status(500).json({ message: "Failed to fetch clinical decisions" });
    }
  });

  app.post("/api/revenue-cycle/clinical-decisions", async (req, res) => {
    try {
      const validatedData = insertClinicalDecisionSchema.parse(req.body);
      const decision = await revenueCycleStorage.createClinicalDecision(validatedData);
      res.status(201).json(decision);
    } catch (error) {
      console.error("Error creating clinical decision:", error);
      res.status(400).json({ message: "Invalid clinical decision data" });
    }
  });

  // Denial Workflows
  app.get("/api/revenue-cycle/denial-workflows", async (req, res) => {
    try {
      const workflows = await revenueCycleStorage.getDenialWorkflows();
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching denial workflows:", error);
      res.status(500).json({ message: "Failed to fetch denial workflows" });
    }
  });

  app.get("/api/revenue-cycle/denial-workflows/account/:accountId", async (req, res) => {
    try {
      const workflows = await revenueCycleStorage.getDenialWorkflowsByAccount(req.params.accountId);
      res.json(workflows);
    } catch (error) {
      console.error("Error fetching denial workflows for account:", error);
      res.status(500).json({ message: "Failed to fetch denial workflows" });
    }
  });

  app.post("/api/revenue-cycle/denial-workflows", async (req, res) => {
    try {
      const validatedData = insertDenialWorkflowSchema.parse(req.body);
      const workflow = await revenueCycleStorage.createDenialWorkflow(validatedData);
      res.status(201).json(workflow);
    } catch (error) {
      console.error("Error creating denial workflow:", error);
      res.status(400).json({ message: "Invalid denial workflow data" });
    }
  });

  // Appeal Cases
  app.get("/api/revenue-cycle/appeal-cases", async (req, res) => {
    try {
      const appeals = await revenueCycleStorage.getAppealCases();
      res.json(appeals);
    } catch (error) {
      console.error("Error fetching appeal cases:", error);
      res.status(500).json({ message: "Failed to fetch appeal cases" });
    }
  });

  app.get("/api/revenue-cycle/appeal-cases/account/:accountId", async (req, res) => {
    try {
      const appeals = await revenueCycleStorage.getAppealCasesByAccount(req.params.accountId);
      res.json(appeals);
    } catch (error) {
      console.error("Error fetching appeal cases for account:", error);
      res.status(500).json({ message: "Failed to fetch appeal cases" });
    }
  });

  app.post("/api/revenue-cycle/appeal-cases", async (req, res) => {
    try {
      const validatedData = insertAppealCaseSchema.parse(req.body);
      const appeal = await revenueCycleStorage.createAppealCase(validatedData);
      res.status(201).json(appeal);
    } catch (error) {
      console.error("Error creating appeal case:", error);
      res.status(400).json({ message: "Invalid appeal case data" });
    }
  });

  // Timely Filing Claims
  app.get("/api/revenue-cycle/timely-filing", async (req, res) => {
    try {
      const claims = await revenueCycleStorage.getTimelyFilingClaims();
      res.json(claims);
    } catch (error) {
      console.error("Error fetching timely filing claims:", error);
      res.status(500).json({ message: "Failed to fetch timely filing claims" });
    }
  });

  app.get("/api/revenue-cycle/timely-filing/risk/:riskLevel", async (req, res) => {
    try {
      const claims = await revenueCycleStorage.getTimelyFilingClaimsByRisk(req.params.riskLevel);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching timely filing claims by risk:", error);
      res.status(500).json({ message: "Failed to fetch timely filing claims" });
    }
  });

  app.post("/api/revenue-cycle/timely-filing", async (req, res) => {
    try {
      const validatedData = insertTimelyFilingClaimSchema.parse(req.body);
      const claim = await revenueCycleStorage.createTimelyFilingClaim(validatedData);
      res.status(201).json(claim);
    } catch (error) {
      console.error("Error creating timely filing claim:", error);
      res.status(400).json({ message: "Invalid timely filing claim data" });
    }
  });

  // Preauthorization Data
  app.get("/api/revenue-cycle/preauthorization", async (req, res) => {
    try {
      const preauth = await revenueCycleStorage.getPreauthorizationData();
      res.json(preauth);
    } catch (error) {
      console.error("Error fetching preauthorization data:", error);
      res.status(500).json({ message: "Failed to fetch preauthorization data" });
    }
  });

  app.get("/api/revenue-cycle/preauthorization/status/:status", async (req, res) => {
    try {
      const preauth = await revenueCycleStorage.getPreauthorizationByStatus(req.params.status);
      res.json(preauth);
    } catch (error) {
      console.error("Error fetching preauthorization by status:", error);
      res.status(500).json({ message: "Failed to fetch preauthorization data" });
    }
  });

  app.post("/api/revenue-cycle/preauthorization", async (req, res) => {
    try {
      const validatedData = insertPreauthorizationDataSchema.parse(req.body);
      const preauth = await revenueCycleStorage.createPreauthorizationData(validatedData);
      res.status(201).json(preauth);
    } catch (error) {
      console.error("Error creating preauthorization:", error);
      res.status(400).json({ message: "Invalid preauthorization data" });
    }
  });

  // Physician Advisor Reviews
  app.get("/api/revenue-cycle/physician-reviews", async (req, res) => {
    try {
      const reviews = await revenueCycleStorage.getPhysicianAdvisorReviews();
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching physician advisor reviews:", error);
      res.status(500).json({ message: "Failed to fetch physician advisor reviews" });
    }
  });

  app.post("/api/revenue-cycle/physician-reviews", async (req, res) => {
    try {
      const validatedData = insertPhysicianAdvisorReviewSchema.parse(req.body);
      const review = await revenueCycleStorage.createPhysicianAdvisorReview(validatedData);
      res.status(201).json(review);
    } catch (error) {
      console.error("Error creating physician advisor review:", error);
      res.status(400).json({ message: "Invalid physician advisor review data" });
    }
  });

  // Documentation Tracking
  app.get("/api/revenue-cycle/documentation", async (req, res) => {
    try {
      const docs = await revenueCycleStorage.getDocumentationTracking();
      res.json(docs);
    } catch (error) {
      console.error("Error fetching documentation tracking:", error);
      res.status(500).json({ message: "Failed to fetch documentation tracking" });
    }
  });

  app.post("/api/revenue-cycle/documentation", async (req, res) => {
    try {
      const validatedData = insertDocumentationTrackingSchema.parse(req.body);
      const doc = await revenueCycleStorage.createDocumentationTracking(validatedData);
      res.status(201).json(doc);
    } catch (error) {
      console.error("Error creating documentation tracking:", error);
      res.status(400).json({ message: "Invalid documentation tracking data" });
    }
  });

  // Payors
  app.get("/api/revenue-cycle/payors", async (req, res) => {
    try {
      const payors = await revenueCycleStorage.getPayors();
      res.json(payors);
    } catch (error) {
      console.error("Error fetching payors:", error);
      res.status(500).json({ message: "Failed to fetch payors" });
    }
  });

  app.post("/api/revenue-cycle/payors", async (req, res) => {
    try {
      const validatedData = insertPayorSchema.parse(req.body);
      const payor = await revenueCycleStorage.createPayor(validatedData);
      res.status(201).json(payor);
    } catch (error) {
      console.error("Error creating payor:", error);
      res.status(400).json({ message: "Invalid payor data" });
    }
  });

  // Feasibility Analysis
  app.get("/api/revenue-cycle/feasibility-analysis", async (req, res) => {
    try {
      const analysis = await revenueCycleStorage.getFeasibilityAnalysis();
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching feasibility analysis:", error);
      res.status(500).json({ message: "Failed to fetch feasibility analysis" });
    }
  });

  app.get("/api/revenue-cycle/feasibility-analysis/payor/:payorId", async (req, res) => {
    try {
      const analysis = await revenueCycleStorage.getFeasibilityAnalysisByPayor(req.params.payorId);
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching feasibility analysis by payor:", error);
      res.status(500).json({ message: "Failed to fetch feasibility analysis" });
    }
  });

  app.post("/api/revenue-cycle/feasibility-analysis", async (req, res) => {
    try {
      const validatedData = insertFeasibilityAnalysisSchema.parse(req.body);
      const analysis = await revenueCycleStorage.createFeasibilityAnalysis(validatedData);
      res.status(201).json(analysis);
    } catch (error) {
      console.error("Error creating feasibility analysis:", error);
      res.status(400).json({ message: "Invalid feasibility analysis data" });
    }
  });

  // Departments
  app.get("/api/revenue-cycle/departments", async (req, res) => {
    try {
      const departments = await revenueCycleStorage.getDepartments();
      res.json(departments);
    } catch (error) {
      console.error("Error fetching departments:", error);
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.post("/api/revenue-cycle/departments", async (req, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const department = await revenueCycleStorage.createDepartment(validatedData);
      res.status(201).json(department);
    } catch (error) {
      console.error("Error creating department:", error);
      res.status(400).json({ message: "Invalid department data" });
    }
  });

  // Providers
  app.get("/api/revenue-cycle/providers", async (req, res) => {
    try {
      const providers = await revenueCycleStorage.getProviders();
      res.json(providers);
    } catch (error) {
      console.error("Error fetching providers:", error);
      res.status(500).json({ message: "Failed to fetch providers" });
    }
  });

  app.post("/api/revenue-cycle/providers", async (req, res) => {
    try {
      const validatedData = insertProviderSchema.parse(req.body);
      const provider = await revenueCycleStorage.createProvider(validatedData);
      res.status(201).json(provider);
    } catch (error) {
      console.error("Error creating provider:", error);
      res.status(400).json({ message: "Invalid provider data" });
    }
  });

  // Dashboard Analytics - Combined endpoints for dashboard views
  app.get("/api/revenue-cycle/dashboard/overview", async (req, res) => {
    try {
      const [accounts, appeals, timelyFiling, preauth] = await Promise.all([
        revenueCycleStorage.getRevenueCycleAccounts(),
        revenueCycleStorage.getAppealCases(),
        revenueCycleStorage.getTimelyFilingClaims(),
        revenueCycleStorage.getPreauthorizationData()
      ]);

      const overview = {
        totalAccounts: accounts.length,
        deniedAccounts: accounts.filter(a => a.billStatusCD === 'DENIED').length,
        totalDenialAmount: accounts
          .filter(a => a.denialAccountBalanceAMT)
          .reduce((sum, a) => sum + Number(a.denialAccountBalanceAMT), 0),
        activeAppeals: appeals.filter(a => a.workflowStatus === 'pending' || a.workflowStatus === 'in_progress').length,
        criticalTimelyFiling: timelyFiling.filter(t => t.riskLevel === 'critical').length,
        pendingPreauth: preauth.filter(p => p.status === 'pending').length,
        accounts: accounts.slice(0, 10), // Recent accounts for preview
        appeals: appeals.slice(0, 5), // Recent appeals for preview
        timelyFilingRisks: timelyFiling.filter(t => t.riskLevel === 'high' || t.riskLevel === 'critical').slice(0, 5)
      };

      res.json(overview);
    } catch (error) {
      console.error("Error fetching dashboard overview:", error);
      res.status(500).json({ message: "Failed to fetch dashboard overview" });
    }
  });

  app.get("/api/revenue-cycle/dashboard/metrics", async (req, res) => {
    try {
      const [accounts, workflows, appeals, feasibility] = await Promise.all([
        revenueCycleStorage.getRevenueCycleAccounts(),
        revenueCycleStorage.getDenialWorkflows(),
        revenueCycleStorage.getAppealCases(),
        revenueCycleStorage.getFeasibilityAnalysis()
      ]);

      const metrics = {
        denialRate: accounts.length > 0 ? 
          (accounts.filter(a => a.billStatusCD === 'DENIED').length / accounts.length * 100).toFixed(2) : '0.00',
        appealSuccessRate: appeals.length > 0 ? 
          (appeals.filter(a => a.appealProbability && a.appealProbability > 70).length / appeals.length * 100).toFixed(2) : '0.00',
        averageAppealValue: appeals.length > 0 ? 
          (appeals.reduce((sum, a) => sum + Number(a.expectedRecoveryAMT || 0), 0) / appeals.length).toFixed(2) : '0.00',
        workflowEfficiency: workflows.length > 0 ? 
          (workflows.filter(w => w.workflowStatus === 'completed').length / workflows.length * 100).toFixed(2) : '0.00',
        totalRecoverable: appeals.reduce((sum, a) => sum + Number(a.expectedRecoveryAMT || 0), 0).toFixed(2),
        roi: feasibility.length > 0 ? 
          feasibility[0].roiPercentage?.toString() || '0.00' : '0.00'
      };

      res.json(metrics);
    } catch (error) {
      console.error("Error fetching dashboard metrics:", error);
      res.status(500).json({ message: "Failed to fetch dashboard metrics" });
    }
  });

  // CSV Import Routes
  app.get("/api/revenue-cycle/import/entities", async (req, res) => {
    try {
      const entities = csvImportService.getImportableEntities();
      res.json(entities);
    } catch (error) {
      console.error("Error fetching importable entities:", error);
      res.status(500).json({ message: "Failed to fetch importable entities" });
    }
  });

  app.post("/api/revenue-cycle/import/:entityType", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const entityType = req.params.entityType;
      const csvContent = req.file.buffer.toString('utf-8');
      
      const result = await csvImportService.importEntity(entityType, csvContent);
      
      res.json({
        message: `Import completed for ${entityType}`,
        success: result.success,
        errors: result.errors,
        total: result.success + result.errors.length
      });
      
    } catch (error) {
      console.error("Error importing CSV:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to import CSV data" 
      });
    }
  });

  app.post("/api/revenue-cycle/import/preview/:entityType", upload.single('csvFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No CSV file uploaded" });
      }

      const csvContent = req.file.buffer.toString('utf-8');
      const data = await csvImportService.parseCSV(csvContent);
      
      // Return first 5 rows for preview
      const preview = {
        headers: data[0] || [],
        rows: data.slice(1, 6),
        totalRows: data.length - 1
      };
      
      res.json(preview);
      
    } catch (error) {
      console.error("Error previewing CSV:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to preview CSV data" 
      });
    }
  });
}