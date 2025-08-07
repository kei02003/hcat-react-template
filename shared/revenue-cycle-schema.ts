import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Main Revenue Cycle Accounts table - the central entity
export const revenueCycleAccounts = pgTable("revenue_cycle_accounts", {
  hospitalAccountID: varchar("hospital_account_id").primaryKey(),
  revenueCycleID: varchar("revenue_cycle_id"),
  patientID: varchar("patient_id").notNull(),
  patientNM: text("patient_nm").notNull(),
  admitDT: timestamp("admit_dt").notNull(),
  dischargeDT: timestamp("discharge_dt"),
  currentPayorID: varchar("current_payor_id").notNull(),
  currentPayorNM: text("current_payor_nm").notNull(),
  currentFinancialClassCD: varchar("current_financial_class_cd"),
  attendingProviderID: varchar("attending_provider_id").notNull(),
  attendingProviderNM: text("attending_provider_nm").notNull(),
  departmentNM: text("department_nm").notNull(),
  serviceAreaNM: text("service_area_nm"),
  hospitalAccountClassCD: varchar("hospital_account_class_cd"),
  finalDRG: varchar("final_drg"),
  totalChargeAMT: decimal("total_charge_amt", { precision: 12, scale: 2 }),
  totalPaymentAMT: decimal("total_payment_amt", { precision: 12, scale: 2 }),
  totalAdjustmentAMT: decimal("total_adjustment_amt", { precision: 12, scale: 2 }),
  denialCD: varchar("denial_cd"),
  denialCodeDSC: text("denial_code_dsc"),
  denialCodeGRP: varchar("denial_code_grp"),
  denialAccountBalanceAMT: decimal("denial_account_balance_amt", { precision: 12, scale: 2 }),
  billStatusCD: varchar("bill_status_cd"),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Clinical Decisions table
export const clinicalDecisions = pgTable("clinical_decisions", {
  clinicalDecisionID: varchar("clinical_decision_id").primaryKey(),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  patientID: varchar("patient_id").notNull(),
  patientNM: text("patient_nm").notNull(),
  departmentNM: text("department_nm").notNull(),
  hospitalAccountClassCD: varchar("hospital_account_class_cd"),
  recommendedAccountClassCD: varchar("recommended_account_class_cd"),
  currentPayorID: varchar("current_payor_id").notNull(),
  denialCD: varchar("denial_cd"),
  appealProbability: integer("appeal_probability"),
  confidenceScore: integer("confidence_score"),
  complianceScore: integer("compliance_score"),
  clinicalEvidence: json("clinical_evidence"),
  payorCriteria: json("payor_criteria"),
  reviewStatus: text("review_status").$type<"pending" | "approved" | "denied" | "in_progress" | "completed">(),
  priorityLevel: text("priority_level").$type<"low" | "medium" | "high" | "critical">(),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Denial Workflows table
export const denialWorkflows = pgTable("denial_workflows", {
  workflowID: varchar("workflow_id").primaryKey(),
  accountID: varchar("account_id"),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  denialDate: timestamp("denial_date").notNull(),
  appealDeadline: timestamp("appeal_deadline"),
  workflowStatus: text("workflow_status").$type<"pending" | "in_progress" | "completed" | "cancelled" | "escalated">(),
  assignedTo: varchar("assigned_to"),
  priorityLevel: text("priority_level").$type<"low" | "medium" | "high" | "critical">(),
  appealLevel: varchar("appeal_level"),
  appealSubmissionDate: timestamp("appeal_submission_date"),
  appealOutcome: text("appeal_outcome").$type<"approved" | "denied" | "partial" | "pending">(),
  recoveredAmount: decimal("recovered_amount", { precision: 12, scale: 2 }),
  workEffortHours: decimal("work_effort_hours", { precision: 5, scale: 2 }),
  rootCause: text("root_cause"),
  preventableFlag: text("preventable_flag").$type<"yes" | "no" | "unknown">(),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Appeal Cases table
export const appealCases = pgTable("appeal_cases", {
  appealID: varchar("appeal_id").primaryKey(),
  workflowID: varchar("workflow_id").references(() => denialWorkflows.workflowID),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  clinicalDecisionID: varchar("clinical_decision_id").references(() => clinicalDecisions.clinicalDecisionID),
  claimID: varchar("claim_id"),
  denialCD: varchar("denial_cd"),
  currentPayorID: varchar("current_payor_id").notNull(),
  denialAccountBalanceAMT: decimal("denial_account_balance_amt", { precision: 12, scale: 2 }),
  appealProbability: integer("appeal_probability"),
  appealConfidenceScore: integer("appeal_confidence_score"),
  appealPriorityLevel: text("appeal_priority_level").$type<"low" | "medium" | "high" | "critical">(),
  clinicalEvidence: json("clinical_evidence"),
  payorCriteria: json("payor_criteria"),
  appealStrengthAnalysis: json("appeal_strength_analysis"),
  letterStatus: text("letter_status").$type<"draft" | "generated" | "reviewed" | "sent" | "responded">(),
  expectedRecoveryAMT: decimal("expected_recovery_amt", { precision: 12, scale: 2 }),
  netRecoveryAMT: decimal("net_recovery_amt", { precision: 12, scale: 2 }),
  workflowStatus: text("workflow_status").$type<"pending" | "in_progress" | "completed" | "cancelled">(),
  appealSubmissionDT: timestamp("appeal_submission_dt"),
  appealResponseDT: timestamp("appeal_response_dt"),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Timely Filing Claims table
export const timelyFilingClaims = pgTable("timely_filing_claims", {
  timelyFilingID: varchar("timely_filing_id").primaryKey(),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  claimID: varchar("claim_id"),
  patientID: varchar("patient_id").notNull(),
  currentPayorID: varchar("current_payor_id").notNull(),
  serviceDT: timestamp("service_dt").notNull(),
  billingDT: timestamp("billing_dt"),
  filingDeadlineDT: timestamp("filing_deadline_dt").notNull(),
  daysRemaining: integer("days_remaining"),
  agingCategory: text("aging_category").$type<"0-30" | "31-60" | "61-90" | "91-120" | "120+">(),
  totalChargeAMT: decimal("total_charge_amt", { precision: 12, scale: 2 }),
  denialStatus: text("denial_status").$type<"clean" | "denied" | "pending" | "under_review">(),
  denialCD: varchar("denial_cd"),
  filingAttempts: integer("filing_attempts").default(0),
  filingStatus: text("filing_status").$type<"not_filed" | "filed" | "rejected" | "processed" | "paid">(),
  riskLevel: text("risk_level").$type<"low" | "medium" | "high" | "critical">(),
  priorityLevel: text("priority_level").$type<"low" | "medium" | "high" | "critical">(),
  assignedBillerID: varchar("assigned_biller_id"),
  documentationComplete: text("documentation_complete").$type<"yes" | "no" | "partial">(),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Preauthorization Data table
export const preauthorizationData = pgTable("preauthorization_data", {
  preAuthID: varchar("pre_auth_id").primaryKey(),
  accountID: varchar("account_id"),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  serviceType: text("service_type"),
  procedureDate: timestamp("procedure_date"),
  requestDate: timestamp("request_date"),
  responseDate: timestamp("response_date"),
  daysBeforeProcedure: integer("days_before_procedure"),
  completedOnTime: text("completed_on_time").$type<"yes" | "no" | "not_applicable">(),
  status: text("status").$type<"pending" | "approved" | "denied" | "expired" | "cancelled">(),
  authNumber: varchar("auth_number"),
  requestedUnits: integer("requested_units"),
  approvedUnits: integer("approved_units"),
  denialReason: text("denial_reason"),
  priority: text("priority").$type<"routine" | "urgent" | "emergent">(),
  physicianAdvisorReview: text("physician_advisor_review").$type<"required" | "not_required" | "completed">(),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Physician Advisor Reviews table
export const physicianAdvisorReviews = pgTable("physician_advisor_reviews", {
  reviewID: varchar("review_id").primaryKey(),
  accountID: varchar("account_id"),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  physicianAdvisorID: varchar("physician_advisor_id").notNull(),
  physicianAdvisorName: text("physician_advisor_name").notNull(),
  reviewDate: timestamp("review_date").notNull(),
  reviewType: text("review_type").$type<"initial" | "concurrent" | "retrospective" | "appeal_support">(),
  reviewOutcome: text("review_outcome").$type<"upheld" | "overturned" | "modified" | "pending">(),
  clinicalJustification: text("clinical_justification"),
  recommendedLevelOfCare: text("recommended_level_of_care"),
  estimatedSavings: decimal("estimated_savings", { precision: 12, scale: 2 }),
  appealRequired: text("appeal_required").$type<"yes" | "no" | "pending">(),
  documentationComplete: text("documentation_complete").$type<"yes" | "no" | "partial">(),
  reviewTurnaroundHours: integer("review_turnaround_hours"),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Documentation Tracking table
export const documentationTracking = pgTable("documentation_tracking", {
  documentID: varchar("document_id").primaryKey(),
  accountID: varchar("account_id"),
  hospitalAccountID: varchar("hospital_account_id").notNull().references(() => revenueCycleAccounts.hospitalAccountID),
  documentType: text("document_type"),
  documentDate: timestamp("document_date"),
  documentStatus: text("document_status").$type<"pending" | "completed" | "incomplete" | "under_review">(),
  providerID: varchar("provider_id").notNull(),
  complianceFlag: text("compliance_flag").$type<"compliant" | "non_compliant" | "under_review">(),
  timelinessMet: text("timeliness_met").$type<"yes" | "no" | "pending">(),
  cdiReviewRequired: text("cdi_review_required").$type<"yes" | "no" | "completed">(),
  cdiQueryStatus: text("cdi_query_status").$type<"not_required" | "pending" | "responded" | "no_response">(),
  impactOnDRG: text("impact_on_drg").$type<"none" | "positive" | "negative" | "under_review">(),
  estimatedRevenueImpact: decimal("estimated_revenue_impact", { precision: 12, scale: 2 }),
  qualityIndicator: text("quality_indicator"),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Payors table
export const payors = pgTable("payors", {
  payorID: varchar("payor_id").primaryKey(),
  payorNM: text("payor_nm").notNull(),
  payorType: text("payor_type").$type<"commercial" | "medicare" | "medicaid" | "self_pay" | "other">(),
  financialClassCD: varchar("financial_class_cd"),
  financialClassDSC: text("financial_class_dsc"),
  filingDeadlineDays: integer("filing_deadline_days"),
  contractedRate: decimal("contracted_rate", { precision: 5, scale: 4 }),
  preAuthRequired: text("pre_auth_required").$type<"yes" | "no" | "selective">(),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Feasibility Analysis table
export const feasibilityAnalysis = pgTable("feasibility_analysis", {
  analysisID: varchar("analysis_id").primaryKey(),
  payorID: varchar("payor_id").notNull().references(() => payors.payorID),
  payorNM: text("payor_nm").notNull(),
  totalClaimCount: integer("total_claim_count"),
  totalClaimAMT: decimal("total_claim_amt", { precision: 15, scale: 2 }),
  totalDenialCount: integer("total_denial_count"),
  appealableAMT: decimal("appealable_amt", { precision: 15, scale: 2 }),
  appealRatePercentage: decimal("appeal_rate_percentage", { precision: 5, scale: 2 }),
  estimatedRecoveryAMT: decimal("estimated_recovery_amt", { precision: 15, scale: 2 }),
  redundantCount: integer("redundant_count"),
  redundancyRatePercentage: decimal("redundancy_rate_percentage", { precision: 5, scale: 2 }),
  totalWastedCostAMT: decimal("total_wasted_cost_amt", { precision: 12, scale: 2 }),
  roiPercentage: decimal("roi_percentage", { precision: 5, scale: 2 }),
  denialCategoryAnalysis: json("denial_category_analysis"),
  requestTypeAnalysis: json("request_type_analysis"),
  performanceMetrics: json("performance_metrics"),
  analysisDT: timestamp("analysis_dt").notNull(),
  periodStartDT: timestamp("period_start_dt").notNull(),
  periodEndDT: timestamp("period_end_dt").notNull(),
});

// Departments table
export const departments = pgTable("departments", {
  departmentID: varchar("department_id").primaryKey(),
  departmentNM: text("department_nm").notNull(),
  serviceAreaNM: text("service_area_nm"),
  departmentSpecialtyCD: varchar("department_specialty_cd"),
  costCenterCD: varchar("cost_center_cd"),
  averageChargeAMT: decimal("average_charge_amt", { precision: 10, scale: 2 }),
  denialRatePercentage: decimal("denial_rate_percentage", { precision: 5, scale: 2 }),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Providers table
export const providers = pgTable("providers", {
  providerID: varchar("provider_id").primaryKey(),
  providerNM: text("provider_nm").notNull(),
  providerType: text("provider_type").$type<"attending" | "consulting" | "resident" | "np" | "pa">(),
  departmentID: varchar("department_id").references(() => departments.departmentID),
  specialtyCD: varchar("specialty_cd"),
  productivityScore: decimal("productivity_score", { precision: 5, scale: 2 }),
  qualityScore: decimal("quality_score", { precision: 5, scale: 2 }),
  createdDT: timestamp("created_dt").defaultNow(),
  updatedDT: timestamp("updated_dt").defaultNow(),
});

// Create insert schemas
export const insertRevenueCycleAccountSchema = createInsertSchema(revenueCycleAccounts);
export const insertClinicalDecisionSchema = createInsertSchema(clinicalDecisions).omit({
  clinicalDecisionID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertDenialWorkflowSchema = createInsertSchema(denialWorkflows).omit({
  workflowID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertAppealCaseSchema = createInsertSchema(appealCases).omit({
  appealID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertTimelyFilingClaimSchema = createInsertSchema(timelyFilingClaims).omit({
  timelyFilingID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertPreauthorizationDataSchema = createInsertSchema(preauthorizationData).omit({
  preAuthID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertPhysicianAdvisorReviewSchema = createInsertSchema(physicianAdvisorReviews).omit({
  reviewID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertDocumentationTrackingSchema = createInsertSchema(documentationTracking).omit({
  documentID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertPayorSchema = createInsertSchema(payors).omit({
  payorID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertFeasibilityAnalysisSchema = createInsertSchema(feasibilityAnalysis).omit({
  analysisID: true,
});
export const insertDepartmentSchema = createInsertSchema(departments).omit({
  departmentID: true,
  createdDT: true,
  updatedDT: true,
});
export const insertProviderSchema = createInsertSchema(providers).omit({
  providerID: true,
  createdDT: true,
  updatedDT: true,
});

// Export types
export type RevenueCycleAccount = typeof revenueCycleAccounts.$inferSelect;
export type InsertRevenueCycleAccount = z.infer<typeof insertRevenueCycleAccountSchema>;
export type ClinicalDecision = typeof clinicalDecisions.$inferSelect;
export type InsertClinicalDecision = z.infer<typeof insertClinicalDecisionSchema>;
export type DenialWorkflow = typeof denialWorkflows.$inferSelect;
export type InsertDenialWorkflow = z.infer<typeof insertDenialWorkflowSchema>;
export type AppealCase = typeof appealCases.$inferSelect;
export type InsertAppealCase = z.infer<typeof insertAppealCaseSchema>;
export type TimelyFilingClaim = typeof timelyFilingClaims.$inferSelect;
export type InsertTimelyFilingClaim = z.infer<typeof insertTimelyFilingClaimSchema>;
export type PreauthorizationData = typeof preauthorizationData.$inferSelect;
export type InsertPreauthorizationData = z.infer<typeof insertPreauthorizationDataSchema>;
export type PhysicianAdvisorReview = typeof physicianAdvisorReviews.$inferSelect;
export type InsertPhysicianAdvisorReview = z.infer<typeof insertPhysicianAdvisorReviewSchema>;
export type DocumentationTracking = typeof documentationTracking.$inferSelect;
export type InsertDocumentationTracking = z.infer<typeof insertDocumentationTrackingSchema>;
export type Payor = typeof payors.$inferSelect;
export type InsertPayor = z.infer<typeof insertPayorSchema>;
export type FeasibilityAnalysis = typeof feasibilityAnalysis.$inferSelect;
export type InsertFeasibilityAnalysis = z.infer<typeof insertFeasibilityAnalysisSchema>;
export type Department = typeof departments.$inferSelect;
export type InsertDepartment = z.infer<typeof insertDepartmentSchema>;
export type Provider = typeof providers.$inferSelect;
export type InsertProvider = z.infer<typeof insertProviderSchema>;