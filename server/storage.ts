import { type Metric, type InsertMetric, type DocumentationRequest, type InsertDocumentationRequest, type PayerBehavior, type InsertPayerBehavior, type RedundancyMatrix, type InsertRedundancyMatrix, type PredictiveAnalytics, type InsertPredictiveAnalytics, type DenialPredictions, type InsertDenialPredictions, type RiskFactors, type InsertRiskFactors, type PreAuthTemplate, type InsertPreAuthTemplate, type TemplateField, type InsertTemplateField, type TemplateMappingConfig, type InsertTemplateMappingConfig } from "@shared/schema";
import { type DepartmentPerformance } from "@shared/timely-filing-schema";
import { users, type User, type UpsertUser } from "../shared/auth-schema";

// Import new module types
import {
  type PreAuthRequest,
  type InsertPreAuthRequest,
  type InsurerCriteria,
  type InsertInsurerCriteria,
  type ProcedureAuthRequirement,
  type InsertProcedureAuthRequirement,
} from "@shared/pre-authorization-schema";

import {
  type PatientStatusMonitoring,
  type InsertPatientStatusMonitoring,
  type ClinicalIndicator,
  type InsertClinicalIndicator,
  type MedicalRecordAnalysis,
  type InsertMedicalRecordAnalysis,
  type ClinicalAlert,
  type InsertClinicalAlert,
} from "@shared/clinical-decision-schema";

import {
  type AppealRequest,
  type InsertAppealRequest,
  type AppealLetter,
  type InsertAppealLetter,
  type AppealOutcome,
  type InsertAppealOutcome,
  type DenialPattern,
  type InsertDenialPattern,
} from "@shared/appeal-generation-schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

// Define ClinicalDecision type for the demo
interface ClinicalDecision {
  id: string;
  patientName: string;
  patientId: string;
  admissionId: string;
  currentStatus: "inpatient" | "observation" | "outpatient" | "emergency";
  denialReason: string;
  payer: string;
  payerId: string;
  department: string;
  clinicalIndicators: {
    vitalSigns: {
      systolicBP: number;
      diastolicBP: number;
      heartRate: number;
      respiratoryRate: number;
      oxygenSaturation: number;
      temperature: number;
    };
    labResults: {
      troponinI: number;
      bnp: number;
      creatinine: number;
      sodium: number;
      hemoglobin: number;
    };
    physicianNotes: string[];
    symptoms: string[];
    medications: string[];
  };
  insurerCriteria: {
    inpatientRequirements: string[];
    observationCriteria: string[];
    exclusionFactors: string[];
  };
  recommendedStatus: "inpatient" | "observation" | "outpatient";
  confidenceScore: number;
  complianceScore: number;
  aiRecommendations: string[];
  reviewStatus: "pending" | "approved" | "needs_revision" | "escalated";
  createdAt: Date;
  updatedAt: Date;
}

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Metrics
  getMetrics(): Promise<Metric[]>;
  createMetric(metric: InsertMetric): Promise<Metric>;
  updateMetric(id: string, metric: Partial<InsertMetric>): Promise<Metric | undefined>;
  
  // Documentation Requests
  getDocumentationRequests(): Promise<DocumentationRequest[]>;
  createDocumentationRequest(request: InsertDocumentationRequest): Promise<DocumentationRequest>;
  updateDocumentationRequest(id: string, request: Partial<InsertDocumentationRequest>): Promise<DocumentationRequest | undefined>;
  
  // Payer Behavior
  getPayerBehavior(): Promise<PayerBehavior[]>;
  createPayerBehavior(behavior: InsertPayerBehavior): Promise<PayerBehavior>;
  
  // Redundancy Matrix
  getRedundancyMatrix(): Promise<RedundancyMatrix[]>;
  createRedundancyMatrix(matrix: InsertRedundancyMatrix): Promise<RedundancyMatrix>;
  
  // Predictive Analytics
  getPredictiveAnalytics(): Promise<PredictiveAnalytics[]>;
  createPredictiveAnalytics(analytics: InsertPredictiveAnalytics): Promise<PredictiveAnalytics>;
  
  // Denial Predictions
  getDenialPredictions(): Promise<DenialPredictions[]>;
  createDenialPredictions(predictions: InsertDenialPredictions): Promise<DenialPredictions>;
  
  // Risk Factors
  getRiskFactors(): Promise<RiskFactors[]>;
  createRiskFactors(factors: InsertRiskFactors): Promise<RiskFactors>;
  
  // Department Performance
  getDepartmentPerformance(): Promise<DepartmentPerformance[]>;
  
  // Pre-Authorization Management
  getPreAuthRequests(): Promise<PreAuthRequest[]>;
  createPreAuthRequest(request: InsertPreAuthRequest): Promise<PreAuthRequest>;
  updatePreAuthRequest(id: string, request: Partial<InsertPreAuthRequest>): Promise<PreAuthRequest | undefined>;
  getInsurerCriteria(): Promise<InsurerCriteria[]>;
  getProcedureAuthRequirements(): Promise<ProcedureAuthRequirement[]>;
  
  // Clinical Decision Support
  getPatientStatusMonitoring(): Promise<PatientStatusMonitoring[]>;
  createPatientStatusMonitoring(monitoring: InsertPatientStatusMonitoring): Promise<PatientStatusMonitoring>;
  getClinicalIndicators(patientId?: string): Promise<ClinicalIndicator[]>;
  getMedicalRecordAnalysis(): Promise<MedicalRecordAnalysis[]>;
  getClinicalAlerts(): Promise<ClinicalAlert[]>;
  
  // Clinical Decision Support
  getClinicalDecisions(): Promise<ClinicalDecision[]>;
  
  // Appeal Generation
  getAppealRequests(): Promise<AppealRequest[]>;
  createAppealRequest(request: InsertAppealRequest): Promise<AppealRequest>;
  getAppealLetters(): Promise<AppealLetter[]>;
  createAppealLetter(letter: InsertAppealLetter): Promise<AppealLetter>;
  getAppealOutcomes(): Promise<AppealOutcome[]>;
  getDenialPatterns(): Promise<DenialPattern[]>;
  
  // Template Management
  getPreAuthTemplates(): Promise<PreAuthTemplate[]>;
  createPreAuthTemplate(template: InsertPreAuthTemplate): Promise<PreAuthTemplate>;
  updatePreAuthTemplate(id: string, template: Partial<InsertPreAuthTemplate>): Promise<PreAuthTemplate | undefined>;
  deletePreAuthTemplate(id: string): Promise<void>;
  getTemplateFields(templateId: string): Promise<TemplateField[]>;
  createTemplateField(field: InsertTemplateField): Promise<TemplateField>;
  updateTemplateField(id: string, field: Partial<InsertTemplateField>): Promise<TemplateField | undefined>;
  getTemplateMappingConfigs(templateId: string): Promise<TemplateMappingConfig[]>;
  createTemplateMappingConfig(config: InsertTemplateMappingConfig): Promise<TemplateMappingConfig>;
  updateTemplateMappingConfig(id: string, config: Partial<InsertTemplateMappingConfig>): Promise<TemplateMappingConfig | undefined>;
}

export class MemStorage implements IStorage {
  private metrics: Map<string, Metric>;
  private documentationRequests: Map<string, DocumentationRequest>;
  private payerBehavior: Map<string, PayerBehavior>;
  private redundancyMatrix: Map<string, RedundancyMatrix>;
  private predictiveAnalytics: Map<string, PredictiveAnalytics>;
  private denialPredictions: Map<string, DenialPredictions>;
  private riskFactors: Map<string, RiskFactors>;
  private preAuthRequests: Map<string, PreAuthRequest>;
  private insurerCriteria: Map<string, InsurerCriteria>;
  private procedureAuthRequirements: Map<string, ProcedureAuthRequirement>;
  private patientStatusMonitoring: Map<string, PatientStatusMonitoring>;
  private clinicalIndicators: Map<string, ClinicalIndicator>;
  private medicalRecordAnalysis: Map<string, MedicalRecordAnalysis>;
  private clinicalAlerts: Map<string, ClinicalAlert>;
  private appealRequests: Map<string, AppealRequest>;
  private appealLetters: Map<string, AppealLetter>;
  private appealOutcomes: Map<string, AppealOutcome>;
  private denialPatterns: Map<string, DenialPattern>;
  private clinicalDecisions: Map<string, ClinicalDecision>;
  private preAuthTemplates: Map<string, PreAuthTemplate>;
  private templateFields: Map<string, TemplateField>;
  private templateMappingConfigs: Map<string, TemplateMappingConfig>;

  constructor() {
    this.metrics = new Map();
    this.documentationRequests = new Map();
    this.payerBehavior = new Map();
    this.redundancyMatrix = new Map();
    this.predictiveAnalytics = new Map();
    this.denialPredictions = new Map();
    this.riskFactors = new Map();
    this.preAuthRequests = new Map();
    this.insurerCriteria = new Map();
    this.procedureAuthRequirements = new Map();
    this.patientStatusMonitoring = new Map();
    this.clinicalIndicators = new Map();
    this.medicalRecordAnalysis = new Map();
    this.clinicalAlerts = new Map();
    this.appealRequests = new Map();
    this.appealLetters = new Map();
    this.appealOutcomes = new Map();
    this.denialPatterns = new Map();
    this.clinicalDecisions = new Map();
    this.preAuthTemplates = new Map();
    this.templateFields = new Map();
    this.templateMappingConfigs = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample healthcare data
    this.initializeMetrics();
    this.initializeDocumentationRequests();
    this.initializePayerBehavior();
    this.initializeRedundancyMatrix();
    this.initializePredictiveAnalytics();
    this.initializeDenialPredictions();
    this.initializeRiskFactors();
    this.initializePreAuthRequests();
    this.initializePatientStatusMonitoring();
    this.initializeClinicalDecisions();
    this.initializeAppealRequests();
  }

  private initializeMetrics() {
    const metricsData = [
      { name: "Total AR", value: "$912.79K", previousValue: "$399.46K", changePercentage: "128.51", status: "positive" as const },
      { name: "AR Days", value: "44.7", previousValue: "40.4", changePercentage: "10.73", status: "positive" as const },
      { name: "Denied Dollars", value: "$57.32K", previousValue: "$51.35K", changePercentage: "11.62", status: "negative" as const },
      { name: "Documentation Requests", value: "342", previousValue: "298", changePercentage: "14.77", status: "negative" as const },
      { name: "Redundant Doc Requests", value: "128", previousValue: "95", changePercentage: "34.74", status: "negative" as const },
      { name: "Timely Filing at Risk", value: "$142.5K", previousValue: "$118.2K", changePercentage: "20.54", status: "negative" as const },
      { name: "Appeal Window Expiring", value: "$38.2K", previousValue: "$42.1K", changePercentage: "-9.26", status: "positive" as const },
      { name: "Auto-Detected Duplicates", value: "89", previousValue: "67", changePercentage: "32.84", status: "positive" as const },
      { name: "Clean Claim Rate", value: "88%", previousValue: "85%", changePercentage: "3.53", status: "positive" as const },
      { name: "Doc Request Response Time", value: "6.2 days", previousValue: "7.1 days", changePercentage: "-12.68", status: "positive" as const },
      { name: "Payments", value: "($232.62K)", previousValue: "($185.58K)", changePercentage: "-25.35", status: "negative" as const },
    ];

    metricsData.forEach(metric => {
      const id = randomUUID();
      this.metrics.set(id, { 
        id,
        name: metric.name,
        value: metric.value,
        previousValue: metric.previousValue,
        changePercentage: metric.changePercentage,
        status: metric.status,
        updatedAt: new Date() 
      });
    });
  }

  private initializeDocumentationRequests() {
    const requestsData = [
      {
        claimId: "CLM-45821",
        patientName: "Smith, John",
        payer: "BCBS",
        requestDate: new Date("2024-12-20"),
        documentType: "Operative Report",
        originalSubmissionDate: new Date("2024-11-15"),
        status: "already_submitted" as const,
        isRedundant: true,
        amount: "12450.00"
      },
      {
        claimId: "CLM-45822",
        patientName: "Johnson, Mary",
        payer: "Medicare",
        requestDate: new Date("2024-12-19"),
        documentType: "Lab Results",
        originalSubmissionDate: null,
        status: "new_required" as const,
        isRedundant: false,
        amount: "3250.00"
      },
      {
        claimId: "CLM-45823",
        patientName: "Davis, Robert",
        payer: "Medicaid",
        requestDate: new Date("2024-12-18"),
        documentType: "Physician Notes",
        originalSubmissionDate: new Date("2024-12-01"),
        status: "partial_match" as const,
        isRedundant: false,
        amount: "8900.00"
      },
      {
        claimId: "CLM-45824",
        patientName: "Wilson, Sarah",
        payer: "Commercial",
        requestDate: new Date("2024-12-17"),
        documentType: "Prior Authorization",
        originalSubmissionDate: new Date("2024-11-28"),
        status: "auto_response" as const,
        isRedundant: true,
        amount: "15600.00"
      },
    ];

    requestsData.forEach(request => {
      const id = randomUUID();
      this.documentationRequests.set(id, { 
        id,
        claimId: request.claimId,
        patientName: request.patientName,
        payer: request.payer,
        requestDate: request.requestDate,
        documentType: request.documentType,
        originalSubmissionDate: request.originalSubmissionDate,
        status: request.status,
        isRedundant: request.isRedundant,
        amount: request.amount
      });
    });
  }

  private initializePayerBehavior() {
    const payerData = [
      {
        payerName: "Medicare",
        redundantRequestRate: "31.00",
        topRequestType: "Lab Results",
        avgResponseTime: "5.20",
        successRate: "78.00",
        revenueImpact: "23400.00"
      },
      {
        payerName: "Medicaid", 
        redundantRequestRate: "42.00",
        topRequestType: "Medical Records",
        avgResponseTime: "7.10",
        successRate: "65.00",
        revenueImpact: "31700.00"
      },
      {
        payerName: "BCBS",
        redundantRequestRate: "73.00",
        topRequestType: "Operative Reports",
        avgResponseTime: "8.90",
        successRate: "52.00",
        revenueImpact: "45100.00"
      },
      {
        payerName: "Commercial",
        redundantRequestRate: "22.00",
        topRequestType: "Prior Authorization",
        avgResponseTime: "3.80",
        successRate: "89.00",
        revenueImpact: "12300.00"
      },
    ];

    payerData.forEach(behavior => {
      const id = randomUUID();
      this.payerBehavior.set(id, { 
        id,
        payerName: behavior.payerName,
        redundantRequestRate: behavior.redundantRequestRate,
        topRequestType: behavior.topRequestType,
        avgResponseTime: behavior.avgResponseTime,
        successRate: behavior.successRate,
        revenueImpact: behavior.revenueImpact
      });
    });
  }

  private initializeRedundancyMatrix() {
    const matrixData = [
      { documentType: "Medical Records", payer: "Medicare", count: 23, redundancyRate: "45.00" },
      { documentType: "Medical Records", payer: "Medicaid", count: 18, redundancyRate: "32.00" },
      { documentType: "Medical Records", payer: "BCBS", count: 31, redundancyRate: "67.00" },
      { documentType: "Medical Records", payer: "Commercial", count: 12, redundancyRate: "15.00" },
      { documentType: "Prior Authorization", payer: "Medicare", count: 15, redundancyRate: "28.00" },
      { documentType: "Prior Authorization", payer: "Medicaid", count: 22, redundancyRate: "41.00" },
      { documentType: "Prior Authorization", payer: "BCBS", count: 8, redundancyRate: "18.00" },
      { documentType: "Prior Authorization", payer: "Commercial", count: 19, redundancyRate: "35.00" },
      { documentType: "Physician Notes", payer: "Medicare", count: 9, redundancyRate: "12.00" },
      { documentType: "Physician Notes", payer: "Medicaid", count: 14, redundancyRate: "29.00" },
      { documentType: "Physician Notes", payer: "BCBS", count: 27, redundancyRate: "52.00" },
      { documentType: "Physician Notes", payer: "Commercial", count: 11, redundancyRate: "21.00" },
      { documentType: "Lab Results", payer: "Medicare", count: 17, redundancyRate: "31.00" },
      { documentType: "Lab Results", payer: "Medicaid", count: 35, redundancyRate: "58.00" },
      { documentType: "Lab Results", payer: "BCBS", count: 16, redundancyRate: "34.00" },
      { documentType: "Lab Results", payer: "Commercial", count: 7, redundancyRate: "19.00" },
      { documentType: "Imaging", payer: "Medicare", count: 5, redundancyRate: "11.00" },
      { documentType: "Imaging", payer: "Medicaid", count: 12, redundancyRate: "26.00" },
      { documentType: "Imaging", payer: "BCBS", count: 14, redundancyRate: "31.00" },
      { documentType: "Imaging", payer: "Commercial", count: 8, redundancyRate: "17.00" },
      { documentType: "Operative Reports", payer: "Medicare", count: 13, redundancyRate: "29.00" },
      { documentType: "Operative Reports", payer: "Medicaid", count: 6, redundancyRate: "14.00" },
      { documentType: "Operative Reports", payer: "BCBS", count: 42, redundancyRate: "73.00" },
      { documentType: "Operative Reports", payer: "Commercial", count: 15, redundancyRate: "28.00" },
    ];

    matrixData.forEach(matrix => {
      const id = randomUUID();
      this.redundancyMatrix.set(id, { 
        id,
        documentType: matrix.documentType,
        payer: matrix.payer,
        count: matrix.count,
        redundancyRate: matrix.redundancyRate
      });
    });
  }

  private initializePredictiveAnalytics() {
    const analyticsData = [
      {
        claimId: "CLM-45825",
        patientName: "Brown, Michael",
        payer: "BCBS",
        procedureCode: "29827",
        department: "Orthopedics",
        amount: "18500.00",
        denialRiskScore: "85.50",
        documentationRiskScore: "92.30",
        timelyFilingRiskScore: "15.20",
        overallRiskScore: "87.40",
        riskLevel: "critical" as const,
        recommendedActions: ["Attach operative report", "Include surgeon notes", "Submit prior auth documentation"],
        predictedDenialReasons: ["Missing operative report", "Insufficient documentation"],
        confidence: "89.20"
      },
      {
        claimId: "CLM-45826",
        patientName: "Taylor, Lisa",
        payer: "Medicare",
        procedureCode: "93306",
        department: "Cardiology",
        amount: "3250.00",
        denialRiskScore: "45.20",
        documentationRiskScore: "38.10",
        timelyFilingRiskScore: "72.80",
        overallRiskScore: "52.30",
        riskLevel: "medium" as const,
        recommendedActions: ["File within 3 days", "Include ECG results"],
        predictedDenialReasons: ["Timely filing risk"],
        confidence: "76.50"
      },
      {
        claimId: "CLM-45827",
        patientName: "Anderson, David",
        payer: "Commercial",
        procedureCode: "80053",
        department: "Laboratory",
        amount: "425.00",
        denialRiskScore: "12.30",
        documentationRiskScore: "8.50",
        timelyFilingRiskScore: "5.20",
        overallRiskScore: "15.40",
        riskLevel: "low" as const,
        recommendedActions: ["Standard processing"],
        predictedDenialReasons: [],
        confidence: "94.80"
      }
    ];

    analyticsData.forEach(analytics => {
      const id = randomUUID();
      this.predictiveAnalytics.set(id, {
        id,
        claimId: analytics.claimId,
        patientName: analytics.patientName,
        payer: analytics.payer,
        procedureCode: analytics.procedureCode,
        department: analytics.department,
        amount: analytics.amount,
        denialRiskScore: analytics.denialRiskScore,
        documentationRiskScore: analytics.documentationRiskScore,
        timelyFilingRiskScore: analytics.timelyFilingRiskScore,
        overallRiskScore: analytics.overallRiskScore,
        riskLevel: analytics.riskLevel,
        recommendedActions: analytics.recommendedActions,
        predictedDenialReasons: analytics.predictedDenialReasons,
        confidence: analytics.confidence,
        createdAt: new Date()
      });
    });
  }

  private initializeDenialPredictions() {
    const predictionsData = [
      {
        predictionDate: new Date("2024-12-25"),
        timeframe: "next_week",
        predictedDenials: 23,
        predictedAmount: "145600.00",
        byPayer: JSON.stringify({ "Medicare": 8, "Medicaid": 6, "BCBS": 12, "Commercial": 4 }),
        byDepartment: JSON.stringify({ "Orthopedics": 9, "Cardiology": 5, "Surgery": 7, "Emergency": 2 }),
        byDenialType: JSON.stringify({ "Documentation": 12, "Timely Filing": 4, "Clinical": 7 }),
        confidence: "82.30",
        actualDenials: null,
        actualAmount: null,
        accuracy: null
      },
      {
        predictionDate: new Date("2024-12-25"),
        timeframe: "next_month",
        predictedDenials: 98,
        predictedAmount: "620800.00",
        byPayer: JSON.stringify({ "Medicare": 32, "Medicaid": 25, "BCBS": 48, "Commercial": 18 }),
        byDepartment: JSON.stringify({ "Orthopedics": 38, "Cardiology": 22, "Surgery": 28, "Emergency": 10 }),
        byDenialType: JSON.stringify({ "Documentation": 51, "Timely Filing": 17, "Clinical": 30 }),
        confidence: "78.60",
        actualDenials: null,
        actualAmount: null,
        accuracy: null
      }
    ];

    predictionsData.forEach(prediction => {
      const id = randomUUID();
      this.denialPredictions.set(id, {
        id,
        predictionDate: prediction.predictionDate,
        timeframe: prediction.timeframe,
        predictedDenials: prediction.predictedDenials,
        predictedAmount: prediction.predictedAmount,
        byPayer: prediction.byPayer,
        byDepartment: prediction.byDepartment,
        byDenialType: prediction.byDenialType,
        confidence: prediction.confidence,
        actualDenials: prediction.actualDenials,
        actualAmount: prediction.actualAmount,
        accuracy: prediction.accuracy
      });
    });
  }

  private initializeRiskFactors() {
    const riskFactorsData = [
      {
        factorName: "BCBS Operative Reports",
        category: "payer",
        weightScore: "85.30",
        description: "BCBS has 73% redundant request rate for operative reports",
        isActive: true
      },
      {
        factorName: "Orthopedic Procedures",
        category: "procedure",
        weightScore: "78.20",
        description: "Orthopedic procedures have 3x higher documentation request rate",
        isActive: true
      },
      {
        factorName: "End of Month Filing",
        category: "timing",
        weightScore: "65.40",
        description: "Claims filed in last week of month show higher denial rates",
        isActive: true
      },
      {
        factorName: "Missing Prior Auth",
        category: "documentation",
        weightScore: "92.10",
        description: "Claims without prior authorization have 92% denial rate",
        isActive: true
      },
      {
        factorName: "Emergency Department Claims",
        category: "department",
        weightScore: "42.30",
        description: "ED claims have moderate denial risk due to documentation gaps",
        isActive: true
      }
    ];

    riskFactorsData.forEach(factor => {
      const id = randomUUID();
      this.riskFactors.set(id, {
        id,
        factorName: factor.factorName,
        category: factor.category,
        weightScore: factor.weightScore,
        description: factor.description,
        isActive: factor.isActive
      });
    });
  }

  async getMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
  }

  async createMetric(insertMetric: InsertMetric): Promise<Metric> {
    const id = randomUUID();
    const metric: Metric = { 
      ...insertMetric, 
      id, 
      updatedAt: new Date(),
      previousValue: insertMetric.previousValue ?? null,
      changePercentage: insertMetric.changePercentage ?? null,
      status: (insertMetric.status as "positive" | "negative" | "neutral" | null) ?? null
    };
    this.metrics.set(id, metric);
    return metric;
  }

  async updateMetric(id: string, updateData: Partial<InsertMetric>): Promise<Metric | undefined> {
    const existing = this.metrics.get(id);
    if (!existing) return undefined;
    
    const updated: Metric = { 
      ...existing, 
      ...updateData, 
      updatedAt: new Date(),
      previousValue: updateData.previousValue ?? existing.previousValue,
      changePercentage: updateData.changePercentage ?? existing.changePercentage,
      status: (updateData.status as "positive" | "negative" | "neutral" | null) ?? existing.status
    };
    this.metrics.set(id, updated);
    return updated;
  }

  async getDocumentationRequests(): Promise<DocumentationRequest[]> {
    return Array.from(this.documentationRequests.values());
  }

  async createDocumentationRequest(insertRequest: InsertDocumentationRequest): Promise<DocumentationRequest> {
    const id = randomUUID();
    const request: DocumentationRequest = { 
      ...insertRequest, 
      id,
      originalSubmissionDate: insertRequest.originalSubmissionDate ?? null,
      isRedundant: insertRequest.isRedundant ?? null,
      amount: insertRequest.amount ?? null
    };
    this.documentationRequests.set(id, request);
    return request;
  }

  async updateDocumentationRequest(id: string, updateData: Partial<InsertDocumentationRequest>): Promise<DocumentationRequest | undefined> {
    const existing = this.documentationRequests.get(id);
    if (!existing) return undefined;
    
    const updated: DocumentationRequest = { 
      ...existing, 
      ...updateData,
      originalSubmissionDate: updateData.originalSubmissionDate ?? existing.originalSubmissionDate,
      isRedundant: updateData.isRedundant ?? existing.isRedundant,
      amount: updateData.amount ?? existing.amount
    };
    this.documentationRequests.set(id, updated);
    return updated;
  }

  async getPayerBehavior(): Promise<PayerBehavior[]> {
    return Array.from(this.payerBehavior.values());
  }

  async createPayerBehavior(insertBehavior: InsertPayerBehavior): Promise<PayerBehavior> {
    const id = randomUUID();
    const behavior: PayerBehavior = { 
      ...insertBehavior, 
      id,
      redundantRequestRate: insertBehavior.redundantRequestRate ?? null,
      topRequestType: insertBehavior.topRequestType ?? null,
      avgResponseTime: insertBehavior.avgResponseTime ?? null,
      successRate: insertBehavior.successRate ?? null,
      revenueImpact: insertBehavior.revenueImpact ?? null
    };
    this.payerBehavior.set(id, behavior);
    return behavior;
  }

  async getRedundancyMatrix(): Promise<RedundancyMatrix[]> {
    return Array.from(this.redundancyMatrix.values());
  }

  async createRedundancyMatrix(insertMatrix: InsertRedundancyMatrix): Promise<RedundancyMatrix> {
    const id = randomUUID();
    const matrix: RedundancyMatrix = { 
      ...insertMatrix, 
      id,
      redundancyRate: insertMatrix.redundancyRate ?? null
    };
    this.redundancyMatrix.set(id, matrix);
    return matrix;
  }

  async getPredictiveAnalytics(): Promise<PredictiveAnalytics[]> {
    return Array.from(this.predictiveAnalytics.values());
  }

  async createPredictiveAnalytics(insertAnalytics: InsertPredictiveAnalytics): Promise<PredictiveAnalytics> {
    const id = randomUUID();
    const analytics: PredictiveAnalytics = { 
      ...insertAnalytics, 
      id, 
      createdAt: new Date(),
      amount: insertAnalytics.amount ?? null,
      denialRiskScore: insertAnalytics.denialRiskScore ?? null,
      documentationRiskScore: insertAnalytics.documentationRiskScore ?? null,
      timelyFilingRiskScore: insertAnalytics.timelyFilingRiskScore ?? null,
      overallRiskScore: insertAnalytics.overallRiskScore ?? null,
      recommendedActions: insertAnalytics.recommendedActions ?? null,
      predictedDenialReasons: insertAnalytics.predictedDenialReasons ?? null,
      confidence: insertAnalytics.confidence ?? null,
      riskLevel: insertAnalytics.riskLevel as "low" | "medium" | "high" | "critical"
    };
    this.predictiveAnalytics.set(id, analytics);
    return analytics;
  }

  async getDenialPredictions(): Promise<DenialPredictions[]> {
    return Array.from(this.denialPredictions.values());
  }

  async createDenialPredictions(insertPredictions: InsertDenialPredictions): Promise<DenialPredictions> {
    const id = randomUUID();
    const predictions: DenialPredictions = { 
      ...insertPredictions, 
      id,
      confidence: insertPredictions.confidence ?? null,
      predictedAmount: insertPredictions.predictedAmount ?? null,
      actualDenials: insertPredictions.actualDenials ?? null,
      actualAmount: insertPredictions.actualAmount ?? null,
      accuracy: insertPredictions.accuracy ?? null
    };
    this.denialPredictions.set(id, predictions);
    return predictions;
  }

  async getRiskFactors(): Promise<RiskFactors[]> {
    return Array.from(this.riskFactors.values());
  }

  async createRiskFactors(insertFactors: InsertRiskFactors): Promise<RiskFactors> {
    const id = randomUUID();
    const factors: RiskFactors = { 
      ...insertFactors, 
      id,
      isActive: insertFactors.isActive ?? null,
      weightScore: insertFactors.weightScore ?? null
    };
    this.riskFactors.set(id, factors);
    return factors;
  }

  async getDepartmentPerformance(): Promise<DepartmentPerformance[]> {
    return [
      {
        id: "dp-001",
        department: "Emergency Department",
        totalClaims: 3420,
        filedOnTime: 3180,
        expiredClaims: 45,
        avgDaysToFile: "12.3",
        successRate: "93.0",
        valueAtRisk: "890000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-002", 
        department: "Cardiology",
        totalClaims: 2890,
        filedOnTime: 2765,
        expiredClaims: 28,
        avgDaysToFile: "8.7",
        successRate: "95.7",
        valueAtRisk: "420000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-003",
        department: "Orthopedics", 
        totalClaims: 2156,
        filedOnTime: 2087,
        expiredClaims: 19,
        avgDaysToFile: "9.2",
        successRate: "96.8",
        valueAtRisk: "315000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-004",
        department: "General Surgery",
        totalClaims: 1876,
        filedOnTime: 1743,
        expiredClaims: 52,
        avgDaysToFile: "15.1",
        successRate: "92.9", 
        valueAtRisk: "1240000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-005",
        department: "Oncology",
        totalClaims: 1654,
        filedOnTime: 1587,
        expiredClaims: 23,
        avgDaysToFile: "7.8",
        successRate: "95.9",
        valueAtRisk: "380000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-006",
        department: "Radiology",
        totalClaims: 1423,
        filedOnTime: 1356,
        expiredClaims: 31,
        avgDaysToFile: "11.4",
        successRate: "95.3",
        valueAtRisk: "490000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-007", 
        department: "Laboratory",
        totalClaims: 1298,
        filedOnTime: 1189,
        expiredClaims: 67,
        avgDaysToFile: "18.6",
        successRate: "91.6",
        valueAtRisk: "1580000.00",
        monthYear: "2024-12"
      },
      {
        id: "dp-008",
        department: "Physical Therapy",
        totalClaims: 987,
        filedOnTime: 934,
        expiredClaims: 18,
        avgDaysToFile: "10.2",
        successRate: "94.6",
        valueAtRisk: "280000.00",
        monthYear: "2024-12"
      }
    ];
  }

  // Initialize new module data
  private initializeClinicalDecisions() {
    // Sample clinical decision cases for denied claim screening
    const clinicalDecisions = [
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
        createdAt: new Date("2025-01-08"),
        updatedAt: new Date("2025-01-09")
      }
    ];

    clinicalDecisions.forEach(decision => {
      this.clinicalDecisions.set(decision.id, decision as any);
    });
  }

  // Initialize new module data
  private initializePreAuthRequests() {
    // Sample insurer criteria (BCBS medical necessity guidelines)
    const bcbsCriteria: InsurerCriteria = {
      id: "ins-001",
      payerId: "BCBS",
      payerName: "Blue Cross Blue Shield",
      procedureCode: "CPT-29881",
      procedureName: "Arthroscopy, knee, surgical; with meniscectomy",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "Mechanical symptoms (locking, catching, giving way)",
          "Failed conservative treatment for 6+ weeks",
          "MRI confirmation of meniscal tear",
          "Functional limitation documented"
        ],
        timeFrameRequired: 72,
        authValidityDays: 30,
        denialReasons: [
          "Insufficient conservative treatment",
          "Lack of MRI documentation",
          "Procedure not medically necessary"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };
    
    const aetnaCriteria: InsurerCriteria = {
      id: "ins-002",
      payerId: "AETNA",
      payerName: "Aetna",
      procedureCode: "CPT-64483",
      procedureName: "Injection, anesthetic agent; transforaminal epidural",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "Radicular pain correlating with imaging findings",
          "Failed oral medications and physical therapy",
          "No more than 3 injections per 6-month period",
          "Documented functional impairment"
        ],
        timeFrameRequired: 48,
        authValidityDays: 90,
        denialReasons: [
          "Exceeded injection frequency limits",
          "Insufficient prior treatment documentation",
          "Imaging does not correlate with symptoms"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    // Additional BCBS criteria for more procedures
    const bcbsKneeCriteria: InsurerCriteria = {
      id: "ins-003",
      payerId: "BCBS",
      payerName: "Blue Cross Blue Shield",
      procedureCode: "CPT-27447",
      procedureName: "Arthroplasty, knee, condyle and plateau; medial compartment",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "Documented bone-on-bone osteoarthritis on imaging",
          "Failed conservative treatment for minimum 12 months",
          "Significant functional limitation affecting activities of daily living",
          "BMI under 40 or documented medical clearance",
          "Patient age appropriate for procedure longevity"
        ],
        timeFrameRequired: 72,
        authValidityDays: 30,
        denialReasons: [
          "Conservative treatment period insufficient",
          "BMI above acceptable limits without clearance",
          "Functional limitation not adequately documented"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    const bcbsGeneralCriteria: InsurerCriteria = {
      id: "ins-004",
      payerId: "BCBS",
      payerName: "Blue Cross Blue Shield",
      procedureCode: "CPT-43280",
      procedureName: "Laparoscopy, surgical, esophagogastroduodenoscopy",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "BMI ≥35 with documented comorbidities or BMI ≥40",
          "Documented 6-month physician-supervised weight loss attempt",
          "Psychological evaluation completed",
          "No contraindications to surgery documented"
        ],
        timeFrameRequired: 168, // 7 days
        authValidityDays: 60,
        denialReasons: [
          "BMI criteria not met",
          "Insufficient weight loss documentation",
          "Missing psychological evaluation"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    // Additional insurer criteria for more diverse scenarios
    const medicareCriteria: InsurerCriteria = {
      id: "ins-005",
      payerId: "MEDICARE",
      payerName: "Medicare",
      procedureCode: "CPT-93458",
      procedureName: "Catheter placement in coronary artery for coronary angiography",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: false,
        medicalNecessityCriteria: [
          "Documented chest pain with positive stress test",
          "Previous MI or known CAD with worsening symptoms",
          "High-risk features on non-invasive testing"
        ],
        timeFrameRequired: 24,
        authValidityDays: 365,
        denialReasons: [
          "Routine screening without symptoms",
          "Recent normal stress test <6 months"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    const medicaidCriteria: InsurerCriteria = {
      id: "ins-006",
      payerId: "MEDICAID",
      payerName: "Medicaid",
      procedureCode: "CPT-70553",
      procedureName: "MRI brain without and with contrast",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "Neurological symptoms warranting investigation",
          "Failed initial diagnostic workup",
          "Clinical indication documented by neurologist"
        ],
        timeFrameRequired: 72,
        authValidityDays: 30,
        denialReasons: [
          "Insufficient clinical documentation",
          "Alternative imaging not attempted first",
          "Non-urgent indication"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    const uhcCriteria: InsurerCriteria = {
      id: "ins-007",
      payerId: "UHC",
      payerName: "UnitedHealthcare",
      procedureCode: "CPT-19307",
      procedureName: "Mastectomy, modified radical",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: true,
        medicalNecessityCriteria: [
          "Confirmed malignancy with pathology report",
          "Multidisciplinary team recommendation",
          "Staging studies completed"
        ],
        timeFrameRequired: 48,
        authValidityDays: 60,
        denialReasons: [
          "Incomplete staging workup",
          "Missing oncology consultation"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    const cignaCriteria: InsurerCriteria = {
      id: "ins-008",
      payerId: "CIGNA",
      payerName: "Cigna",
      procedureCode: "CPT-47562",
      procedureName: "Laparoscopy, surgical; cholecystectomy",
      criteriaType: "medical_necessity",
      criteria: {
        requiresAuth: false,
        medicalNecessityCriteria: [
          "Symptomatic cholelithiasis",
          "Conservative management failed",
          "No contraindications to surgery"
        ],
        timeFrameRequired: 0,
        authValidityDays: 90,
        denialReasons: [
          "Asymptomatic gallstones",
          "High surgical risk without benefit"
        ]
      },
      effectiveDate: new Date("2024-01-01"),
      expirationDate: null,
      isActive: true,
      updatedAt: new Date()
    };

    this.insurerCriteria.set(bcbsCriteria.id, bcbsCriteria);
    this.insurerCriteria.set(aetnaCriteria.id, aetnaCriteria);
    this.insurerCriteria.set(bcbsKneeCriteria.id, bcbsKneeCriteria);
    this.insurerCriteria.set(bcbsGeneralCriteria.id, bcbsGeneralCriteria);
    this.insurerCriteria.set(medicareCriteria.id, medicareCriteria);
    this.insurerCriteria.set(medicaidCriteria.id, medicaidCriteria);
    this.insurerCriteria.set(uhcCriteria.id, uhcCriteria);
    this.insurerCriteria.set(cignaCriteria.id, cignaCriteria);

    // Sample procedure authorization requirements
    const procedures: ProcedureAuthRequirement[] = [
      {
        id: "proc-001",
        procedureCode: "CPT-29881", 
        procedureName: "Arthroscopy, knee, surgical; with meniscectomy",
        category: "Orthopedic Surgery",
        requiresAuth: true,

        averageProcessingDays: 3,
        approvalRate: 85.2,
        commonDenialReasons: [
          "Insufficient conservative treatment documentation",
          "Missing MRI results",
          "Procedure not meeting medical necessity criteria"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-002",
        procedureCode: "CPT-64483",
        procedureName: "Injection, anesthetic agent; transforaminal epidural", 
        category: "Pain Management",
        requiresAuth: true,

        averageProcessingDays: 2,
        approvalRate: 92.1,
        commonDenialReasons: [
          "Frequency limits exceeded",
          "Inadequate prior treatment documentation"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-003",
        procedureCode: "CPT-27447",
        procedureName: "Arthroplasty, knee, condyle and plateau; medial OR lateral compartment",
        category: "Orthopedic Surgery",
        requiresAuth: true,
 
        averageProcessingDays: 5,
        approvalRate: 78.9,
        commonDenialReasons: [
          "Alternative treatments not exhausted",
          "Insufficient severity documentation",
          "Patient not meeting age/activity criteria"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-004",
        procedureCode: "CPT-43280", 
        procedureName: "Laparoscopy, surgical, esophagogastroduodenoscopy",
        category: "Bariatric Surgery",
        requiresAuth: true,

        averageProcessingDays: 7,
        approvalRate: 82.4,
        commonDenialReasons: [
          "BMI criteria not met",
          "Insufficient supervised weight loss documentation",
          "Missing psychological evaluation"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-005",
        procedureCode: "CPT-93458",
        procedureName: "Catheter placement in coronary artery for coronary angiography",
        category: "Cardiology",
        requiresAuth: false,

        averageProcessingDays: 1,
        approvalRate: 96.8,
        commonDenialReasons: [
          "Routine screening without symptoms",
          "Recent normal stress test"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-006",
        procedureCode: "CPT-70553",
        procedureName: "MRI brain without and with contrast",
        category: "Radiology",
        requiresAuth: true,

        averageProcessingDays: 3,
        approvalRate: 89.2,
        commonDenialReasons: [
          "Insufficient clinical documentation",
          "Alternative imaging not attempted first"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-007",
        procedureCode: "CPT-19307",
        procedureName: "Mastectomy, modified radical",
        category: "Oncology",
        requiresAuth: true,

        averageProcessingDays: 2,
        approvalRate: 94.7,
        commonDenialReasons: [
          "Incomplete staging workup",
          "Missing oncology consultation"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "proc-008",
        procedureCode: "CPT-47562",
        procedureName: "Laparoscopy, surgical; cholecystectomy",
        category: "General Surgery",
        requiresAuth: false,

        averageProcessingDays: 0,
        approvalRate: 98.1,
        commonDenialReasons: [
          "Asymptomatic gallstones",
          "High surgical risk without benefit"
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    procedures.forEach(proc => {
      this.procedureAuthRequirements.set(proc.id, proc);
    });

    // Sample pre-authorization requests - diverse scenarios for demo
    const preAuthRequests: PreAuthRequest[] = [
      {
        id: "pre-001",
        patientId: "PAT-12345",
        patientName: "Johnson, Robert M.",
        procedureCode: "CPT-29881",
        procedureName: "Arthroscopy, knee, surgical; with meniscectomy",
        scheduledDate: new Date("2025-08-15"),
        payer: "Blue Cross Blue Shield",
        payerId: "BCBS",
        status: "pending",
        submissionDate: new Date("2025-01-10"),
        responseDate: null,
        daysToComplete: 5,
        authorizationNumber: null,
        estimatedCost: "12500.00",
        medicalNecessity: "Patient presents with mechanical symptoms of right knee locking and catching. Conservative treatment with PT for 8 weeks has failed. MRI shows complex medial meniscal tear with functional limitation.",
        clinicalIndicators: { diagnosis: "M23.201 - Derangement of medial meniscus due to old tear, right knee" },
        insurerCriteria: null,
        physicianNotes: "Conservative treatment attempted for 8 weeks with no improvement",
        department: "Orthopedics",
        providerId: "DR-001",
        providerName: "Dr. Sarah Mitchell",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-002", 
        patientId: "PAT-67890",
        patientName: "Williams, Maria C.",
        procedureCode: "CPT-64483", 
        procedureName: "Injection, anesthetic agent; transforaminal epidural",
        scheduledDate: new Date("2025-08-22"),
        payer: "Aetna",
        payerId: "AETNA",
        status: "approved",
        submissionDate: new Date("2025-01-09"),
        responseDate: new Date("2025-01-10"),
        daysToComplete: 1,
        authorizationNumber: "AETNA-PA-2025-001234",
        estimatedCost: "2800.00",
        medicalNecessity: "Patient has L4-L5 radiculopathy with correlating MRI findings. Failed 6 weeks of oral medications and physical therapy. Documented functional impairment affecting daily activities.",
        clinicalIndicators: { diagnosis: "M54.16 - Radiculopathy, lumbar region" },
        insurerCriteria: null,
        physicianNotes: "Failed conservative treatment for 6 weeks",
        department: "Pain Management",
        providerId: "DR-002",
        providerName: "Dr. James Park",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-003",
        patientId: "PAT-11111",
        patientName: "Davis, Thomas E.",
        procedureCode: "CPT-27447",
        procedureName: "Arthroplasty, knee, condyle and plateau; medial compartment",
        scheduledDate: new Date("2025-08-28"),
        payer: "Blue Cross Blue Shield",
        payerId: "BCBS",
        status: "pending",
        submissionDate: new Date("2025-01-08"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "45000.00",
        medicalNecessity: "Severe osteoarthritis with bone-on-bone contact. Failed conservative treatment including injections, PT, and medications over 12 months. Significant functional limitation and pain affecting quality of life.",
        clinicalIndicators: { diagnosis: "M17.11 - Unilateral primary osteoarthritis, right knee" },
        insurerCriteria: null,
        physicianNotes: "Failed 12 months of conservative treatment",
        department: "Orthopedics",
        providerId: "DR-001", 
        providerName: "Dr. Sarah Mitchell",
        priority: "urgent",
        requiresReview: true,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-004",
        patientId: "PAT-22333",
        patientName: "Anderson, Jennifer L.",
        procedureCode: "CPT-93458",
        procedureName: "Catheter placement in coronary artery for coronary angiography",
        scheduledDate: new Date("2025-09-05"),
        payer: "Medicare",
        payerId: "MEDICARE",
        status: "approved",
        submissionDate: new Date("2025-01-09"),
        responseDate: new Date("2025-01-10"),
        daysToComplete: 1,
        authorizationNumber: "MEDICARE-2025-789456",
        estimatedCost: "8900.00",
        medicalNecessity: "Patient presents with unstable angina and positive stress test. High-risk features on EKG and elevated troponins. Urgent cardiac catheterization indicated for diagnosis and potential intervention.",
        clinicalIndicators: { diagnosis: "I25.10 - Atherosclerotic heart disease of native coronary artery" },
        insurerCriteria: null,
        physicianNotes: "Unstable angina with positive stress test",
        department: "Cardiology",
        providerId: "DR-003",
        providerName: "Dr. Michael Chen",
        priority: "urgent",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-005",
        patientId: "PAT-33444",
        patientName: "Rodriguez, Carmen S.",
        procedureCode: "CPT-70553",
        procedureName: "MRI brain without and with contrast",
        scheduledDate: new Date("2025-09-12"),
        payer: "Medicaid",
        payerId: "MEDICAID",
        status: "pending",
        submissionDate: new Date("2025-01-08"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "3200.00",
        medicalNecessity: "Patient with recent stroke presenting with new neurological deficits. CT scan inconclusive. MRI needed to evaluate extent of brain injury and guide treatment planning.",
        clinicalIndicators: { diagnosis: "G93.1 - Anoxic brain damage, not elsewhere classified" },
        insurerCriteria: null,
        physicianNotes: "Recent stroke with neurological deficits, CT inconclusive",
        department: "Neurology",
        providerId: "DR-004",
        providerName: "Dr. Lisa Thompson",
        priority: "routine",
        requiresReview: true,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-006",
        patientId: "PAT-44555",
        patientName: "Thompson, Michael R.",
        procedureCode: "CPT-19307",
        procedureName: "Mastectomy, modified radical",
        scheduledDate: new Date("2025-09-20"),
        payer: "UnitedHealthcare",
        payerId: "UHC",
        status: "pending",
        submissionDate: new Date("2025-01-08"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "32000.00",
        medicalNecessity: "Newly diagnosed invasive ductal carcinoma, grade 2. Multidisciplinary team recommends modified radical mastectomy. Patient completed staging studies and oncology consultation.",
        clinicalIndicators: { diagnosis: "C50.911 - Malignant neoplasm of unspecified site of right female breast" },
        insurerCriteria: null,
        physicianNotes: "Invasive ductal carcinoma, multidisciplinary team recommendation",
        department: "Oncology",
        providerId: "DR-005",
        providerName: "Dr. Patricia Williams",
        priority: "urgent",
        requiresReview: true,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-007",
        patientId: "PAT-55666",
        patientName: "Garcia, Pablo J.",
        procedureCode: "CPT-47562",
        procedureName: "Laparoscopy, surgical; cholecystectomy",
        scheduledDate: new Date("2025-09-28"),
        payer: "Cigna",
        payerId: "CIGNA",
        status: "approved",
        submissionDate: new Date("2025-01-09"),
        responseDate: new Date("2025-01-11"),
        daysToComplete: 2,
        authorizationNumber: "CIGNA-PA-20250109",
        estimatedCost: "15600.00",
        medicalNecessity: "Symptomatic cholelithiasis with recurrent biliary colic. Conservative management with diet modification failed. Patient experiences frequent pain episodes affecting daily activities.",
        clinicalIndicators: { diagnosis: "K80.20 - Calculus of gallbladder without obstruction" },
        insurerCriteria: null,
        physicianNotes: "Recurrent biliary colic, conservative management failed",
        department: "General Surgery",
        providerId: "DR-006",
        providerName: "Dr. Robert Kumar",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-008",
        patientId: "PAT-66777",
        patientName: "Brown, Elizabeth M.",
        procedureCode: "CPT-43280",
        procedureName: "Laparoscopy, surgical, esophagogastroduodenoscopy",
        scheduledDate: new Date("2025-10-05"),
        payer: "Blue Cross Blue Shield",
        payerId: "BCBS",
        status: "denied",
        submissionDate: new Date("2025-01-07"),
        responseDate: new Date("2025-02-08"),
        daysToComplete: 32,
        authorizationNumber: null,
        estimatedCost: "28500.00",
        medicalNecessity: "Patient with BMI 42, hypertension, and diabetes. Documented 4-month physician-supervised weight loss program. Psychology evaluation pending.",
        clinicalIndicators: { diagnosis: "E66.01 - Morbid obesity due to excess calories" },
        insurerCriteria: null,
        physicianNotes: "BMI 42, 4-month weight loss program completed",
        department: "Bariatric Surgery",
        providerId: "DR-007",
        providerName: "Dr. Amanda Davis",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: "Denied due to incomplete psychology evaluation",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-009",
        patientId: "PAT-77888",
        patientName: "Lee, Christopher H.",
        procedureCode: "CPT-64483",
        procedureName: "Injection, anesthetic agent; transforaminal epidural",
        scheduledDate: new Date("2025-10-15"),
        payer: "Aetna",
        payerId: "AETNA",
        status: "pending",
        submissionDate: new Date("2025-01-10"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "2950.00",
        medicalNecessity: "C6-C7 radiculopathy with arm pain and weakness. Failed conservative treatment with medications and PT for 8 weeks. MRI shows disc herniation with nerve root compression.",
        clinicalIndicators: { diagnosis: "M54.12 - Radiculopathy, cervical region" },
        insurerCriteria: null,
        physicianNotes: "Failed 8 weeks of conservative treatment",
        department: "Pain Management",
        providerId: "DR-002",
        providerName: "Dr. James Park",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-010",
        patientId: "PAT-88999",
        patientName: "Wilson, Margaret A.",
        procedureCode: "CPT-93458",
        procedureName: "Catheter placement in coronary artery for coronary angiography",
        scheduledDate: new Date("2025-10-25"),
        payer: "Medicare",
        payerId: "MEDICARE",
        status: "approved",
        submissionDate: new Date("2025-01-09"),
        responseDate: new Date("2025-01-29"),
        daysToComplete: 20,
        authorizationNumber: "MEDICARE-2025-654321",
        estimatedCost: "7800.00",
        medicalNecessity: "Pre-operative cardiac clearance for patient scheduled for major oncologic surgery. Baseline cardiac function assessment needed due to history of hypertension and planned chemotherapy.",
        clinicalIndicators: { diagnosis: "Z51.11 - Encounter for antineoplastic chemotherapy" },
        insurerCriteria: null,
        physicianNotes: "Pre-operative cardiac clearance for oncologic surgery",
        department: "Cardiology",
        providerId: "DR-003",
        providerName: "Dr. Michael Chen",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-011",
        patientId: "PAT-99000",
        patientName: "Martinez, Diego F.",
        procedureCode: "CPT-19307",
        procedureName: "Mastectomy, modified radical",
        scheduledDate: new Date("2025-11-02"),
        payer: "UnitedHealthcare",
        payerId: "UHC",
        status: "pending",
        submissionDate: new Date("2025-01-09"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "29800.00",
        medicalNecessity: "Aggressive triple-negative breast cancer with rapid progression. Multidisciplinary team recommends urgent surgical intervention before neoadjuvant chemotherapy.",
        clinicalIndicators: { diagnosis: "C50.912 - Malignant neoplasm of unspecified site of left female breast" },
        insurerCriteria: null,
        physicianNotes: "Aggressive triple-negative breast cancer, urgent intervention needed",
        department: "Oncology",
        providerId: "DR-005",
        providerName: "Dr. Patricia Williams",
        priority: "urgent",
        requiresReview: true,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "pre-012",
        patientId: "PAT-00111",
        patientName: "Taylor, Susan R.",
        procedureCode: "CPT-70553",
        procedureName: "MRI brain without and with contrast",
        scheduledDate: new Date("2025-11-06"),
        payer: "Medicaid",
        payerId: "MEDICAID",
        status: "pending",
        submissionDate: new Date("2025-01-08"),
        responseDate: null,
        daysToComplete: null,
        authorizationNumber: null,
        estimatedCost: "3100.00",
        medicalNecessity: "Patient with refractory cluster headaches not responding to standard therapy. Neurologist requests MRI to rule out secondary causes and evaluate for potential surgical interventions.",
        clinicalIndicators: { diagnosis: "G44.009 - Cluster headache syndrome, unspecified, not intractable" },
        insurerCriteria: null,
        physicianNotes: "Refractory cluster headaches, unresponsive to standard therapy",
        department: "Neurology",
        providerId: "DR-004",
        providerName: "Dr. Lisa Thompson",
        priority: "routine",
        requiresReview: false,
        reviewerId: null,
        reviewerNotes: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    preAuthRequests.forEach(req => {
      this.preAuthRequests.set(req.id, req);
    });

    // Initialize template management data
    this.initializeTemplates();
  }

  private initializePatientStatusMonitoring() {
    // Sample patient monitoring data will be added here
  }

  private initializeAppealRequests() {
    // Sample appeal requests will be added here
  }

  private initializeTemplates() {
    // Nevada Medicaid Pre-Authorization Template (based on attached PDF)
    const nevadaMedicaidTemplate: PreAuthTemplate = {
      id: "tmpl-001",
      name: "Nevada Medicaid Prior Auth FA-8",
      payerName: "Nevada Medicaid",
      formType: "Inpatient Medical and Surgical",
      originalFileName: "NV_MCAID_PriorAuth_FA-8.pdf",
      uploadDate: new Date("2024-12-07"),
      status: "ready",
      extractedText: "Prior Authorization Request Nevada Medicaid and Nevada Check Up Inpatient Medical and Surgical...",
      processingNotes: [
        "Successfully extracted 25 form fields",
        "Identified required fields: 18",
        "Auto-mapped 23 fields to patient data",
        "Requires manual mapping for 2 specialty fields"
      ],
      mappingProgress: 95,
      createdBy: "demo_admin_001",
      updatedAt: new Date()
    };

    this.preAuthTemplates.set(nevadaMedicaidTemplate.id, nevadaMedicaidTemplate);

    // Template fields for Nevada Medicaid form
    const templateFields: TemplateField[] = [
      {
        id: "field-001",
        templateId: "tmpl-001",
        label: "Recipient Name (Last, First, MI)",
        fieldType: "text",
        required: true,
        position: { x: 100, y: 200, page: 1 },
        mappingRules: ["patient.lastName + ', ' + patient.firstName + ' ' + patient.middleInitial"],
        createdAt: new Date()
      },
      {
        id: "field-002",
        templateId: "tmpl-001",
        label: "Recipient ID",
        fieldType: "text",
        required: true,
        position: { x: 100, y: 220, page: 1 },
        mappingRules: ["patient.medicaidId", "patient.memberID"],
        createdAt: new Date()
      },
      {
        id: "field-003",
        templateId: "tmpl-001",
        label: "DOB",
        fieldType: "date",
        required: true,
        position: { x: 400, y: 220, page: 1 },
        mappingRules: ["patient.dateOfBirth"],
        createdAt: new Date()
      },
      {
        id: "field-004",
        templateId: "tmpl-001",
        label: "Address",
        fieldType: "text",
        required: false,
        position: { x: 100, y: 240, page: 1 },
        mappingRules: ["patient.address.street"],
        createdAt: new Date()
      },
      {
        id: "field-005",
        templateId: "tmpl-001",
        label: "Phone",
        fieldType: "text",
        required: false,
        position: { x: 400, y: 240, page: 1 },
        mappingRules: ["patient.phoneNumber"],
        createdAt: new Date()
      },
      {
        id: "field-006",
        templateId: "tmpl-001",
        label: "City",
        fieldType: "text",
        required: false,
        position: { x: 100, y: 260, page: 1 },
        mappingRules: ["patient.address.city"],
        createdAt: new Date()
      },
      {
        id: "field-007",
        templateId: "tmpl-001",
        label: "State",
        fieldType: "text",
        required: false,
        position: { x: 250, y: 260, page: 1 },
        mappingRules: ["patient.address.state"],
        createdAt: new Date()
      },
      {
        id: "field-008",
        templateId: "tmpl-001",
        label: "Zip Code",
        fieldType: "text",
        required: false,
        position: { x: 350, y: 260, page: 1 },
        mappingRules: ["patient.address.zipCode"],
        createdAt: new Date()
      },
      {
        id: "field-009",
        templateId: "tmpl-001",
        label: "Ordering Provider Name",
        fieldType: "text",
        required: true,
        position: { x: 100, y: 320, page: 1 },
        mappingRules: ["provider.ordering.name"],
        createdAt: new Date()
      },
      {
        id: "field-010",
        templateId: "tmpl-001",
        label: "NPI",
        fieldType: "text",
        required: true,
        position: { x: 400, y: 320, page: 1 },
        mappingRules: ["provider.ordering.npi"],
        createdAt: new Date()
      },
      {
        id: "field-011",
        templateId: "tmpl-001",
        label: "Facility Name",
        fieldType: "text",
        required: true,
        position: { x: 100, y: 380, page: 1 },
        mappingRules: ["provider.facility.name"],
        createdAt: new Date()
      },
      {
        id: "field-012",
        templateId: "tmpl-001",
        label: "Service Type",
        fieldType: "select",
        required: true,
        position: { x: 100, y: 450, page: 1 },
        options: ["Medical", "Surgical", "Maternity", "Pediatric", "Observation"],
        mappingRules: ["service.type"],
        createdAt: new Date()
      },
      {
        id: "field-013",
        templateId: "tmpl-001",
        label: "Estimated Admission Date",
        fieldType: "date",
        required: true,
        position: { x: 100, y: 480, page: 1 },
        mappingRules: ["procedure.scheduledDate", "admission.estimatedDate"],
        createdAt: new Date()
      },
      {
        id: "field-014",
        templateId: "tmpl-001",
        label: "Admission Diagnosis 1",
        fieldType: "text",
        required: true,
        position: { x: 100, y: 520, page: 1 },
        mappingRules: ["diagnosis.primary.code"],
        createdAt: new Date()
      },
      {
        id: "field-015",
        templateId: "tmpl-001",
        label: "Severity of Illness",
        fieldType: "textarea",
        required: true,
        position: { x: 100, y: 200, page: 2 },
        mappingRules: ["clinical.symptoms", "clinical.labFindings"],
        createdAt: new Date()
      },
      {
        id: "field-016",
        templateId: "tmpl-001",
        label: "Intensity of Service",
        fieldType: "textarea",
        required: true,
        position: { x: 100, y: 300, page: 2 },
        mappingRules: ["treatment.plan", "clinical.services"],
        createdAt: new Date()
      },
      {
        id: "field-017",
        templateId: "tmpl-001",
        label: "Discharge Plan",
        fieldType: "textarea",
        required: false,
        position: { x: 100, y: 400, page: 2 },
        mappingRules: ["service.dischargeplan"],
        createdAt: new Date()
      }
    ];

    templateFields.forEach(field => {
      this.templateFields.set(field.id, field);
    });

    // Template mapping configurations
    const mappingConfigs: TemplateMappingConfig[] = [
      {
        id: "mapping-001",
        templateId: "tmpl-001",
        fieldId: "field-001",
        patientDataPath: "patient.fullName",
        confidence: 100.0,
        isManualMapping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mapping-002",
        templateId: "tmpl-001",
        fieldId: "field-002",
        patientDataPath: "insurance.memberId",
        confidence: 95.0,
        isManualMapping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mapping-003",
        templateId: "tmpl-001",
        fieldId: "field-003",
        patientDataPath: "patient.dateOfBirth",
        confidence: 100.0,
        isManualMapping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "mapping-004",
        templateId: "tmpl-001",
        fieldId: "field-009",
        patientDataPath: "provider.ordering.name",
        confidence: 90.0,
        isManualMapping: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mappingConfigs.forEach(config => {
      this.templateMappingConfigs.set(config.id, config);
    });
  }

  // Pre-Authorization Management methods
  async getPreAuthRequests(): Promise<PreAuthRequest[]> {
    return Array.from(this.preAuthRequests.values());
  }

  async createPreAuthRequest(request: InsertPreAuthRequest): Promise<PreAuthRequest> {
    const id = randomUUID();
    const preAuthRequest: PreAuthRequest = { 
      id, 
      ...request, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.preAuthRequests.set(id, preAuthRequest);
    return preAuthRequest;
  }

  async updatePreAuthRequest(id: string, request: Partial<InsertPreAuthRequest>): Promise<PreAuthRequest | undefined> {
    const existing = this.preAuthRequests.get(id);
    if (!existing) return undefined;
    const updated: PreAuthRequest = { ...existing, ...request, updatedAt: new Date() };
    this.preAuthRequests.set(id, updated);
    return updated;
  }

  async getInsurerCriteria(): Promise<InsurerCriteria[]> {
    return Array.from(this.insurerCriteria.values());
  }

  async getProcedureAuthRequirements(): Promise<ProcedureAuthRequirement[]> {
    return Array.from(this.procedureAuthRequirements.values());
  }

  // Clinical Decision Support methods
  async getPatientStatusMonitoring(): Promise<PatientStatusMonitoring[]> {
    return Array.from(this.patientStatusMonitoring.values());
  }

  async createPatientStatusMonitoring(monitoring: InsertPatientStatusMonitoring): Promise<PatientStatusMonitoring> {
    const id = randomUUID();
    const statusMonitoring: PatientStatusMonitoring = { 
      id, 
      ...monitoring, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.patientStatusMonitoring.set(id, statusMonitoring);
    return statusMonitoring;
  }

  async getClinicalIndicators(patientId?: string): Promise<ClinicalIndicator[]> {
    const indicators = Array.from(this.clinicalIndicators.values());
    return patientId ? indicators.filter(i => i.patientId === patientId) : indicators;
  }

  async getMedicalRecordAnalysis(): Promise<MedicalRecordAnalysis[]> {
    return Array.from(this.medicalRecordAnalysis.values());
  }

  async getClinicalAlerts(): Promise<ClinicalAlert[]> {
    return Array.from(this.clinicalAlerts.values());
  }

  // Appeal Generation methods
  async getAppealRequests(): Promise<AppealRequest[]> {
    return Array.from(this.appealRequests.values());
  }

  async createAppealRequest(request: InsertAppealRequest): Promise<AppealRequest> {
    const id = randomUUID();
    const appealRequest: AppealRequest = { 
      id, 
      ...request, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.appealRequests.set(id, appealRequest);
    return appealRequest;
  }

  async getAppealLetters(): Promise<AppealLetter[]> {
    return Array.from(this.appealLetters.values());
  }

  async createAppealLetter(letter: InsertAppealLetter): Promise<AppealLetter> {
    const id = randomUUID();
    const appealLetter: AppealLetter = { 
      id, 
      ...letter, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.appealLetters.set(id, appealLetter);
    return appealLetter;
  }

  async getAppealOutcomes(): Promise<AppealOutcome[]> {
    return Array.from(this.appealOutcomes.values());
  }

  async getDenialPatterns(): Promise<DenialPattern[]> {
    return Array.from(this.denialPatterns.values());
  }

  async getClinicalDecisions(): Promise<ClinicalDecision[]> {
    return Array.from(this.clinicalDecisions.values());
  }

  // Template Management methods
  async getPreAuthTemplates(): Promise<PreAuthTemplate[]> {
    return Array.from(this.preAuthTemplates.values());
  }

  async createPreAuthTemplate(template: InsertPreAuthTemplate): Promise<PreAuthTemplate> {
    const id = randomUUID();
    const preAuthTemplate: PreAuthTemplate = { 
      id, 
      ...template, 
      uploadDate: new Date(), 
      updatedAt: new Date() 
    };
    this.preAuthTemplates.set(id, preAuthTemplate);
    return preAuthTemplate;
  }

  async updatePreAuthTemplate(id: string, template: Partial<InsertPreAuthTemplate>): Promise<PreAuthTemplate | undefined> {
    const existing = this.preAuthTemplates.get(id);
    if (!existing) return undefined;
    const updated: PreAuthTemplate = { ...existing, ...template, updatedAt: new Date() };
    this.preAuthTemplates.set(id, updated);
    return updated;
  }

  async deletePreAuthTemplate(id: string): Promise<void> {
    this.preAuthTemplates.delete(id);
    // Also delete associated template fields and mapping configs
    const fieldsToDelete = Array.from(this.templateFields.values()).filter(f => f.templateId === id);
    fieldsToDelete.forEach(field => {
      this.templateFields.delete(field.id);
      // Delete mapping configs for this field
      const configsToDelete = Array.from(this.templateMappingConfigs.values()).filter(c => c.fieldId === field.id);
      configsToDelete.forEach(config => this.templateMappingConfigs.delete(config.id));
    });
  }

  async getTemplateFields(templateId: string): Promise<TemplateField[]> {
    return Array.from(this.templateFields.values()).filter(f => f.templateId === templateId);
  }

  async createTemplateField(field: InsertTemplateField): Promise<TemplateField> {
    const id = randomUUID();
    const templateField: TemplateField = { 
      id, 
      ...field, 
      createdAt: new Date() 
    };
    this.templateFields.set(id, templateField);
    return templateField;
  }

  async updateTemplateField(id: string, field: Partial<InsertTemplateField>): Promise<TemplateField | undefined> {
    const existing = this.templateFields.get(id);
    if (!existing) return undefined;
    const updated: TemplateField = { ...existing, ...field };
    this.templateFields.set(id, updated);
    return updated;
  }

  async getTemplateMappingConfigs(templateId: string): Promise<TemplateMappingConfig[]> {
    const templateFields = Array.from(this.templateFields.values()).filter(f => f.templateId === templateId);
    const fieldIds = templateFields.map(f => f.id);
    return Array.from(this.templateMappingConfigs.values()).filter(c => fieldIds.includes(c.fieldId));
  }

  async createTemplateMappingConfig(config: InsertTemplateMappingConfig): Promise<TemplateMappingConfig> {
    const id = randomUUID();
    const mappingConfig: TemplateMappingConfig = { 
      id, 
      ...config, 
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.templateMappingConfigs.set(id, mappingConfig);
    return mappingConfig;
  }

  async updateTemplateMappingConfig(id: string, config: Partial<InsertTemplateMappingConfig>): Promise<TemplateMappingConfig | undefined> {
    const existing = this.templateMappingConfigs.get(id);
    if (!existing) return undefined;
    const updated: TemplateMappingConfig = { ...existing, ...config, updatedAt: new Date() };
    this.templateMappingConfigs.set(id, updated);
    return updated;
  }

  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    // In memory storage doesn't support user operations - redirect to database
    return undefined;
  }

  async upsertUser(user: UpsertUser): Promise<User> {
    // In memory storage doesn't support user operations - redirect to database
    throw new Error("User operations require database storage");
  }
}

// Database storage implementation for production use
export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Other operations would delegate to MemStorage for now
  private memStorage = new MemStorage();

  async getMetrics(): Promise<Metric[]> {
    return this.memStorage.getMetrics();
  }

  async createMetric(metric: InsertMetric): Promise<Metric> {
    return this.memStorage.createMetric(metric);
  }

  async updateMetric(id: string, metric: Partial<InsertMetric>): Promise<Metric | undefined> {
    return this.memStorage.updateMetric(id, metric);
  }

  async getDocumentationRequests(): Promise<DocumentationRequest[]> {
    return this.memStorage.getDocumentationRequests();
  }

  async createDocumentationRequest(request: InsertDocumentationRequest): Promise<DocumentationRequest> {
    return this.memStorage.createDocumentationRequest(request);
  }

  async updateDocumentationRequest(id: string, request: Partial<InsertDocumentationRequest>): Promise<DocumentationRequest | undefined> {
    return this.memStorage.updateDocumentationRequest(id, request);
  }

  async getPayerBehavior(): Promise<PayerBehavior[]> {
    return this.memStorage.getPayerBehavior();
  }

  async createPayerBehavior(behavior: InsertPayerBehavior): Promise<PayerBehavior> {
    return this.memStorage.createPayerBehavior(behavior);
  }

  async getRedundancyMatrix(): Promise<RedundancyMatrix[]> {
    return this.memStorage.getRedundancyMatrix();
  }

  async createRedundancyMatrix(matrix: InsertRedundancyMatrix): Promise<RedundancyMatrix> {
    return this.memStorage.createRedundancyMatrix(matrix);
  }

  async getPredictiveAnalytics(): Promise<PredictiveAnalytics[]> {
    return this.memStorage.getPredictiveAnalytics();
  }

  async createPredictiveAnalytics(analytics: InsertPredictiveAnalytics): Promise<PredictiveAnalytics> {
    return this.memStorage.createPredictiveAnalytics(analytics);
  }

  async getDenialPredictions(): Promise<DenialPredictions[]> {
    return this.memStorage.getDenialPredictions();
  }

  async createDenialPredictions(predictions: InsertDenialPredictions): Promise<DenialPredictions> {
    return this.memStorage.createDenialPredictions(predictions);
  }

  async getRiskFactors(): Promise<RiskFactors[]> {
    return this.memStorage.getRiskFactors();
  }

  async createRiskFactors(factors: InsertRiskFactors): Promise<RiskFactors> {
    return this.memStorage.createRiskFactors(factors);
  }

  async getDepartmentPerformance(): Promise<DepartmentPerformance[]> {
    return this.memStorage.getDepartmentPerformance();
  }

  // Pre-Authorization Management methods
  async getPreAuthRequests(): Promise<PreAuthRequest[]> {
    return this.memStorage.getPreAuthRequests();
  }

  async createPreAuthRequest(request: InsertPreAuthRequest): Promise<PreAuthRequest> {
    return this.memStorage.createPreAuthRequest(request);
  }

  async updatePreAuthRequest(id: string, request: Partial<InsertPreAuthRequest>): Promise<PreAuthRequest | undefined> {
    return this.memStorage.updatePreAuthRequest(id, request);
  }

  async getInsurerCriteria(): Promise<InsurerCriteria[]> {
    return this.memStorage.getInsurerCriteria();
  }

  async getProcedureAuthRequirements(): Promise<ProcedureAuthRequirement[]> {
    return this.memStorage.getProcedureAuthRequirements();
  }

  // Clinical Decision Support methods
  async getPatientStatusMonitoring(): Promise<PatientStatusMonitoring[]> {
    return this.memStorage.getPatientStatusMonitoring();
  }

  async createPatientStatusMonitoring(monitoring: InsertPatientStatusMonitoring): Promise<PatientStatusMonitoring> {
    return this.memStorage.createPatientStatusMonitoring(monitoring);
  }

  async getClinicalIndicators(patientId?: string): Promise<ClinicalIndicator[]> {
    return this.memStorage.getClinicalIndicators(patientId);
  }

  async getMedicalRecordAnalysis(): Promise<MedicalRecordAnalysis[]> {
    return this.memStorage.getMedicalRecordAnalysis();
  }

  async getClinicalAlerts(): Promise<ClinicalAlert[]> {
    return this.memStorage.getClinicalAlerts();
  }

  async getClinicalDecisions(): Promise<ClinicalDecision[]> {
    return this.memStorage.getClinicalDecisions();
  }

  // Appeal Generation methods
  async getAppealRequests(): Promise<AppealRequest[]> {
    return this.memStorage.getAppealRequests();
  }

  async createAppealRequest(request: InsertAppealRequest): Promise<AppealRequest> {
    return this.memStorage.createAppealRequest(request);
  }

  async getAppealLetters(): Promise<AppealLetter[]> {
    return this.memStorage.getAppealLetters();
  }

  async createAppealLetter(letter: InsertAppealLetter): Promise<AppealLetter> {
    return this.memStorage.createAppealLetter(letter);
  }

  async getAppealOutcomes(): Promise<AppealOutcome[]> {
    return this.memStorage.getAppealOutcomes();
  }

  async getDenialPatterns(): Promise<DenialPattern[]> {
    return this.memStorage.getDenialPatterns();
  }

  // Template Management methods
  async getPreAuthTemplates(): Promise<PreAuthTemplate[]> {
    return this.memStorage.getPreAuthTemplates();
  }

  async createPreAuthTemplate(template: InsertPreAuthTemplate): Promise<PreAuthTemplate> {
    return this.memStorage.createPreAuthTemplate(template);
  }

  async updatePreAuthTemplate(id: string, template: Partial<InsertPreAuthTemplate>): Promise<PreAuthTemplate | undefined> {
    return this.memStorage.updatePreAuthTemplate(id, template);
  }

  async deletePreAuthTemplate(id: string): Promise<void> {
    return this.memStorage.deletePreAuthTemplate(id);
  }

  async getTemplateFields(templateId: string): Promise<TemplateField[]> {
    return this.memStorage.getTemplateFields(templateId);
  }

  async createTemplateField(field: InsertTemplateField): Promise<TemplateField> {
    return this.memStorage.createTemplateField(field);
  }

  async updateTemplateField(id: string, field: Partial<InsertTemplateField>): Promise<TemplateField | undefined> {
    return this.memStorage.updateTemplateField(id, field);
  }

  async getTemplateMappingConfigs(templateId: string): Promise<TemplateMappingConfig[]> {
    return this.memStorage.getTemplateMappingConfigs(templateId);
  }

  async createTemplateMappingConfig(config: InsertTemplateMappingConfig): Promise<TemplateMappingConfig> {
    return this.memStorage.createTemplateMappingConfig(config);
  }

  async updateTemplateMappingConfig(id: string, config: Partial<InsertTemplateMappingConfig>): Promise<TemplateMappingConfig | undefined> {
    return this.memStorage.updateTemplateMappingConfig(id, config);
  }
}

export const storage = new MemStorage();
