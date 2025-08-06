import { type Metric, type InsertMetric, type DocumentationRequest, type InsertDocumentationRequest, type PayerBehavior, type InsertPayerBehavior, type RedundancyMatrix, type InsertRedundancyMatrix, type PredictiveAnalytics, type InsertPredictiveAnalytics, type DenialPredictions, type InsertDenialPredictions, type RiskFactors, type InsertRiskFactors } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
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
}

export class MemStorage implements IStorage {
  private metrics: Map<string, Metric>;
  private documentationRequests: Map<string, DocumentationRequest>;
  private payerBehavior: Map<string, PayerBehavior>;
  private redundancyMatrix: Map<string, RedundancyMatrix>;
  private predictiveAnalytics: Map<string, PredictiveAnalytics>;
  private denialPredictions: Map<string, DenialPredictions>;
  private riskFactors: Map<string, RiskFactors>;

  constructor() {
    this.metrics = new Map();
    this.documentationRequests = new Map();
    this.payerBehavior = new Map();
    this.redundancyMatrix = new Map();
    this.predictiveAnalytics = new Map();
    this.denialPredictions = new Map();
    this.riskFactors = new Map();
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
      updatedAt: new Date() 
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
      updatedAt: new Date() 
    };
    this.metrics.set(id, updated);
    return updated;
  }

  async getDocumentationRequests(): Promise<DocumentationRequest[]> {
    return Array.from(this.documentationRequests.values());
  }

  async createDocumentationRequest(insertRequest: InsertDocumentationRequest): Promise<DocumentationRequest> {
    const id = randomUUID();
    const request: DocumentationRequest = { ...insertRequest, id };
    this.documentationRequests.set(id, request);
    return request;
  }

  async updateDocumentationRequest(id: string, updateData: Partial<InsertDocumentationRequest>): Promise<DocumentationRequest | undefined> {
    const existing = this.documentationRequests.get(id);
    if (!existing) return undefined;
    
    const updated: DocumentationRequest = { ...existing, ...updateData };
    this.documentationRequests.set(id, updated);
    return updated;
  }

  async getPayerBehavior(): Promise<PayerBehavior[]> {
    return Array.from(this.payerBehavior.values());
  }

  async createPayerBehavior(insertBehavior: InsertPayerBehavior): Promise<PayerBehavior> {
    const id = randomUUID();
    const behavior: PayerBehavior = { ...insertBehavior, id };
    this.payerBehavior.set(id, behavior);
    return behavior;
  }

  async getRedundancyMatrix(): Promise<RedundancyMatrix[]> {
    return Array.from(this.redundancyMatrix.values());
  }

  async createRedundancyMatrix(insertMatrix: InsertRedundancyMatrix): Promise<RedundancyMatrix> {
    const id = randomUUID();
    const matrix: RedundancyMatrix = { ...insertMatrix, id };
    this.redundancyMatrix.set(id, matrix);
    return matrix;
  }

  async getPredictiveAnalytics(): Promise<PredictiveAnalytics[]> {
    return Array.from(this.predictiveAnalytics.values());
  }

  async createPredictiveAnalytics(insertAnalytics: InsertPredictiveAnalytics): Promise<PredictiveAnalytics> {
    const id = randomUUID();
    const analytics: PredictiveAnalytics = { ...insertAnalytics, id, createdAt: new Date() };
    this.predictiveAnalytics.set(id, analytics);
    return analytics;
  }

  async getDenialPredictions(): Promise<DenialPredictions[]> {
    return Array.from(this.denialPredictions.values());
  }

  async createDenialPredictions(insertPredictions: InsertDenialPredictions): Promise<DenialPredictions> {
    const id = randomUUID();
    const predictions: DenialPredictions = { ...insertPredictions, id };
    this.denialPredictions.set(id, predictions);
    return predictions;
  }

  async getRiskFactors(): Promise<RiskFactors[]> {
    return Array.from(this.riskFactors.values());
  }

  async createRiskFactors(insertFactors: InsertRiskFactors): Promise<RiskFactors> {
    const id = randomUUID();
    const factors: RiskFactors = { ...insertFactors, id };
    this.riskFactors.set(id, factors);
    return factors;
  }
}

export const storage = new MemStorage();
