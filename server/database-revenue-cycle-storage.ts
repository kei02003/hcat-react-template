import { 
  type RevenueCycleAccount, 
  type InsertRevenueCycleAccount,
  type ClinicalDecision,
  type InsertClinicalDecision,
  type DenialWorkflow,
  type InsertDenialWorkflow,
  type AppealCase,
  type InsertAppealCase,
  type TimelyFilingClaim,
  type InsertTimelyFilingClaim,
  type PreauthorizationData,
  type InsertPreauthorizationData,
  type PhysicianAdvisorReview,
  type InsertPhysicianAdvisorReview,
  type DocumentationTracking,
  type InsertDocumentationTracking,
  type Payor,
  type InsertPayor,
  type FeasibilityAnalysis,
  type InsertFeasibilityAnalysis,
  type Department,
  type InsertDepartment,
  type Provider,
  type InsertProvider,
  revenueCycleAccounts,
  clinicalDecisions,
  denialWorkflows,
  appealCases,
  timelyFilingClaims,
  preauthorizationData,
  physicianAdvisorReviews,
  documentationTracking,
  payors,
  feasibilityAnalysis,
  departments,
  providers
} from "@shared/revenue-cycle-schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import type { IRevenueCycleStorage } from "./revenue-cycle-storage";

export class DatabaseRevenueCycleStorage implements IRevenueCycleStorage {
  
  // Revenue Cycle Accounts
  async getRevenueCycleAccounts(): Promise<RevenueCycleAccount[]> {
    return await db.select().from(revenueCycleAccounts);
  }

  async createRevenueCycleAccount(data: InsertRevenueCycleAccount): Promise<RevenueCycleAccount> {
    const [account] = await db
      .insert(revenueCycleAccounts)
      .values(data)
      .returning();
    return account;
  }

  async updateRevenueCycleAccount(id: string, data: Partial<InsertRevenueCycleAccount>): Promise<RevenueCycleAccount | undefined> {
    const [updated] = await db
      .update(revenueCycleAccounts)
      .set(data)
      .where(eq(revenueCycleAccounts.hospitalAccountID, id))
      .returning();
    return updated;
  }

  async getRevenueCycleAccountById(id: string): Promise<RevenueCycleAccount | undefined> {
    const [account] = await db
      .select()
      .from(revenueCycleAccounts)
      .where(eq(revenueCycleAccounts.hospitalAccountID, id));
    return account;
  }

  // Clinical Decisions
  async getClinicalDecisions(): Promise<ClinicalDecision[]> {
    return await db.select().from(clinicalDecisions);
  }

  async createClinicalDecision(data: InsertClinicalDecision): Promise<ClinicalDecision> {
    const [decision] = await db
      .insert(clinicalDecisions)
      .values(data)
      .returning();
    return decision;
  }

  async getClinicalDecisionsByAccount(accountId: string): Promise<ClinicalDecision[]> {
    return await db
      .select()
      .from(clinicalDecisions)
      .where(eq(clinicalDecisions.hospitalAccountID, accountId));
  }

  // Denial Workflows
  async getDenialWorkflows(): Promise<DenialWorkflow[]> {
    return await db.select().from(denialWorkflows);
  }

  async createDenialWorkflow(data: InsertDenialWorkflow): Promise<DenialWorkflow> {
    const [workflow] = await db
      .insert(denialWorkflows)
      .values(data)
      .returning();
    return workflow;
  }

  async getDenialWorkflowsByAccount(accountId: string): Promise<DenialWorkflow[]> {
    return await db
      .select()
      .from(denialWorkflows)
      .where(eq(denialWorkflows.hospitalAccountID, accountId));
  }

  // Appeal Cases
  async getAppealCases(): Promise<AppealCase[]> {
    return await db.select().from(appealCases);
  }

  async createAppealCase(data: InsertAppealCase): Promise<AppealCase> {
    const [appeal] = await db
      .insert(appealCases)
      .values(data)
      .returning();
    return appeal;
  }

  async getAppealCasesByAccount(accountId: string): Promise<AppealCase[]> {
    return await db
      .select()
      .from(appealCases)
      .where(eq(appealCases.hospitalAccountID, accountId));
  }

  // Timely Filing Claims
  async getTimelyFilingClaims(): Promise<TimelyFilingClaim[]> {
    return await db.select().from(timelyFilingClaims);
  }

  async createTimelyFilingClaim(data: InsertTimelyFilingClaim): Promise<TimelyFilingClaim> {
    const [claim] = await db
      .insert(timelyFilingClaims)
      .values(data)
      .returning();
    return claim;
  }

  async getTimelyFilingClaimsByRisk(riskLevel: string): Promise<TimelyFilingClaim[]> {
    return await db
      .select()
      .from(timelyFilingClaims)
      .where(eq(timelyFilingClaims.riskLevel, riskLevel as any));
  }

  // Preauthorization Data
  async getPreauthorizationData(): Promise<PreauthorizationData[]> {
    return await db.select().from(preauthorizationData);
  }

  async createPreauthorizationData(data: InsertPreauthorizationData): Promise<PreauthorizationData> {
    const [preauth] = await db
      .insert(preauthorizationData)
      .values(data)
      .returning();
    return preauth;
  }

  async getPreauthorizationByStatus(status: string): Promise<PreauthorizationData[]> {
    return await db
      .select()
      .from(preauthorizationData)
      .where(eq(preauthorizationData.authorizationStatus, status as any));
  }

  // Physician Advisor Reviews
  async getPhysicianAdvisorReviews(): Promise<PhysicianAdvisorReview[]> {
    return await db.select().from(physicianAdvisorReviews);
  }

  async createPhysicianAdvisorReview(data: InsertPhysicianAdvisorReview): Promise<PhysicianAdvisorReview> {
    const [review] = await db
      .insert(physicianAdvisorReviews)
      .values(data)
      .returning();
    return review;
  }

  // Documentation Tracking
  async getDocumentationTracking(): Promise<DocumentationTracking[]> {
    return await db.select().from(documentationTracking);
  }

  async createDocumentationTracking(data: InsertDocumentationTracking): Promise<DocumentationTracking> {
    const [tracking] = await db
      .insert(documentationTracking)
      .values(data)
      .returning();
    return tracking;
  }

  // Payors
  async getPayors(): Promise<Payor[]> {
    return await db.select().from(payors);
  }

  async createPayor(data: InsertPayor): Promise<Payor> {
    const [payor] = await db
      .insert(payors)
      .values(data)
      .returning();
    return payor;
  }

  // Feasibility Analysis
  async getFeasibilityAnalysis(): Promise<FeasibilityAnalysis[]> {
    return await db.select().from(feasibilityAnalysis);
  }

  async createFeasibilityAnalysis(data: InsertFeasibilityAnalysis): Promise<FeasibilityAnalysis> {
    const [analysis] = await db
      .insert(feasibilityAnalysis)
      .values(data)
      .returning();
    return analysis;
  }

  // Departments
  async getDepartments(): Promise<Department[]> {
    return await db.select().from(departments);
  }

  async createDepartment(data: InsertDepartment): Promise<Department> {
    const [department] = await db
      .insert(departments)
      .values(data)
      .returning();
    return department;
  }

  // Providers
  async getProviders(): Promise<Provider[]> {
    return await db.select().from(providers);
  }

  async createProvider(data: InsertProvider): Promise<Provider> {
    const [provider] = await db
      .insert(providers)
      .values(data)
      .returning();
    return provider;
  }
}

// Export the database storage instance
export const databaseRevenueCycleStorage = new DatabaseRevenueCycleStorage();