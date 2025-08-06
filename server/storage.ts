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
    // Initialize with empty state - no mock data
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
