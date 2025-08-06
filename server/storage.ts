import { type Metric, type InsertMetric, type DocumentationRequest, type InsertDocumentationRequest, type PayerBehavior, type InsertPayerBehavior, type RedundancyMatrix, type InsertRedundancyMatrix } from "@shared/schema";
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
}

export class MemStorage implements IStorage {
  private metrics: Map<string, Metric>;
  private documentationRequests: Map<string, DocumentationRequest>;
  private payerBehavior: Map<string, PayerBehavior>;
  private redundancyMatrix: Map<string, RedundancyMatrix>;

  constructor() {
    this.metrics = new Map();
    this.documentationRequests = new Map();
    this.payerBehavior = new Map();
    this.redundancyMatrix = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize with sample healthcare data
    this.initializeMetrics();
    this.initializeDocumentationRequests();
    this.initializePayerBehavior();
    this.initializeRedundancyMatrix();
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
        ...metric, 
        id, 
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
      this.documentationRequests.set(id, { ...request, id });
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
      this.payerBehavior.set(id, { ...behavior, id });
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
      this.redundancyMatrix.set(id, { ...matrix, id });
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
}

export const storage = new MemStorage();
