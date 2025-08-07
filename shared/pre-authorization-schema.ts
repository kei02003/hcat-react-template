import { sql } from 'drizzle-orm';
import {
  pgTable,
  varchar,
  text,
  timestamp,
  boolean,
  decimal,
  jsonb,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Pre-authorization requests table
export const preAuthRequests = pgTable("pre_auth_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  procedureCode: text("procedure_code").notNull(),
  procedureName: text("procedure_name").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  payer: text("payer").notNull(),
  payerId: text("payer_id").notNull(),
  status: text("status").$type<"pending" | "approved" | "denied" | "expired" | "resubmitted">().notNull().default("pending"),
  submissionDate: timestamp("submission_date").defaultNow(),
  responseDate: timestamp("response_date"),
  daysToComplete: integer("days_to_complete"),
  authorizationNumber: text("authorization_number"),
  estimatedCost: decimal("estimated_cost", { precision: 12, scale: 2 }),
  medicalNecessity: text("medical_necessity"),
  clinicalIndicators: jsonb("clinical_indicators"), // Store vital signs, lab results, etc.
  insurerCriteria: jsonb("insurer_criteria"), // Store BCBS guidelines, etc.
  physicianNotes: text("physician_notes"),
  department: text("department").notNull(),
  providerId: text("provider_id").notNull(),
  providerName: text("provider_name").notNull(),
  priority: text("priority").$type<"routine" | "urgent" | "emergent">().notNull().default("routine"),
  requiresReview: boolean("requires_review").default(false),
  reviewerId: text("reviewer_id"),
  reviewerNotes: text("reviewer_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurer criteria and guidelines table
export const insurerCriteria = pgTable("insurer_criteria", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  procedureCode: text("procedure_code").notNull(),
  procedureName: text("procedure_name").notNull(),
  criteriaType: text("criteria_type").$type<"medical_necessity" | "coverage_policy" | "documentation_requirements">().notNull(),
  criteria: jsonb("criteria").notNull(), // Store detailed criteria as JSON
  effectiveDate: timestamp("effective_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pre-auth workflow templates table
export const preAuthTemplates = pgTable("pre_auth_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  procedureCategory: text("procedure_category").notNull(),
  template: jsonb("template").notNull(), // Form structure and fields
  requiredDocuments: text("required_documents").array(),
  estimatedProcessingDays: integer("estimated_processing_days").default(3),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Procedure authorization requirements table
export const procedureAuthRequirements = pgTable("procedure_auth_requirements", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureCode: text("procedure_code").notNull(),
  procedureName: text("procedure_name").notNull(),
  category: text("category").notNull(),
  requiresAuth: boolean("requires_auth").default(false),
  payerSpecific: jsonb("payer_specific"), // Different requirements per payer
  clinicalCriteria: jsonb("clinical_criteria"),
  documentationRequired: text("documentation_required").array(),
  leadTimeRequired: integer("lead_time_required").default(3), // Days before procedure
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type PreAuthRequest = typeof preAuthRequests.$inferSelect;
export type InsertPreAuthRequest = typeof preAuthRequests.$inferInsert;
export type InsurerCriteria = typeof insurerCriteria.$inferSelect;
export type InsertInsurerCriteria = typeof insurerCriteria.$inferInsert;
export type PreAuthTemplate = typeof preAuthTemplates.$inferSelect;
export type InsertPreAuthTemplate = typeof preAuthTemplates.$inferInsert;
export type ProcedureAuthRequirement = typeof procedureAuthRequirements.$inferSelect;
export type InsertProcedureAuthRequirement = typeof procedureAuthRequirements.$inferInsert;

// Create insert schemas
export const insertPreAuthRequestSchema = createInsertSchema(preAuthRequests);
export const insertInsurerCriteriaSchema = createInsertSchema(insurerCriteria);
export const insertPreAuthTemplateSchema = createInsertSchema(preAuthTemplates);
export const insertProcedureAuthRequirementSchema = createInsertSchema(procedureAuthRequirements);

// Pre-auth timeline tracking table
export const preAuthTimeline = pgTable("pre_auth_timeline", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  procedureCode: text("procedure_code").notNull(),
  procedureName: text("procedure_name").notNull(),
  scheduledDate: timestamp("scheduled_date").notNull(),
  daysUntilProcedure: integer("days_until_procedure").notNull(),
  urgencyLevel: text("urgency_level").$type<"green" | "yellow" | "red">().notNull(),
  authRequiredBy: timestamp("auth_required_by").notNull(),
  currentStatus: text("current_status").$type<"flagged" | "submitted" | "approved" | "denied" | "expired">().default("flagged"),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  estimatedProcessingDays: integer("estimated_processing_days").default(3),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Compliance metrics tracking table
export const complianceMetrics = pgTable("compliance_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  period: text("period").notNull(), // "daily", "weekly", "monthly"
  periodDate: timestamp("period_date").notNull(),
  totalRequests: integer("total_requests").default(0),
  submittedOnTime: integer("submitted_on_time").default(0), // Within 3 days
  submittedLate: integer("submitted_late").default(0),
  compliancePercentage: decimal("compliance_percentage", { precision: 5, scale: 2 }),
  avgDaysToSubmission: decimal("avg_days_to_submission", { precision: 4, scale: 2 }),
  department: text("department"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Payer response analytics table
export const payerResponseAnalytics = pgTable("payer_response_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  avgResponseDays: decimal("avg_response_days", { precision: 4, scale: 2 }),
  approvalRate: decimal("approval_rate", { precision: 5, scale: 2 }),
  denialRate: decimal("denial_rate", { precision: 5, scale: 2 }),
  totalRequests: integer("total_requests").default(0),
  monthYear: text("month_year").notNull(), // "2025-01" format
  trendDirection: text("trend_direction").$type<"improving" | "declining" | "stable">().default("stable"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Documentation alerts table
export const documentationAlerts = pgTable("documentation_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  preAuthRequestId: text("pre_auth_request_id").notNull(),
  patientName: text("patient_name").notNull(),
  procedureName: text("procedure_name").notNull(),
  missingDocuments: text("missing_documents").array(),
  alertPriority: text("alert_priority").$type<"low" | "medium" | "high" | "critical">().default("medium"),
  daysOverdue: integer("days_overdue").default(0),
  payerName: text("payer_name").notNull(),
  directLink: text("direct_link"), // Link to required documentation
  isResolved: boolean("is_resolved").default(false),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

// Procedure flagging rules table  
export const procedureFlaggingRules = pgTable("procedure_flagging_rules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  procedureCode: text("procedure_code").notNull(),
  procedureName: text("procedure_name").notNull(),
  payerId: text("payer_id"),
  payerName: text("payer_name"),
  requiresAuth: boolean("requires_auth").default(true),
  autoFlag: boolean("auto_flag").default(true),
  leadTimeRequired: integer("lead_time_required").default(3), // Days before procedure
  criteriaChecks: jsonb("criteria_checks"), // Automated criteria to check
  riskLevel: text("risk_level").$type<"low" | "medium" | "high">().default("medium"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export new types
export type PreAuthTimeline = typeof preAuthTimeline.$inferSelect;
export type InsertPreAuthTimeline = typeof preAuthTimeline.$inferInsert;
export type ComplianceMetrics = typeof complianceMetrics.$inferSelect;
export type InsertComplianceMetrics = typeof complianceMetrics.$inferInsert;
export type PayerResponseAnalytics = typeof payerResponseAnalytics.$inferSelect;
export type InsertPayerResponseAnalytics = typeof payerResponseAnalytics.$inferInsert;
export type DocumentationAlerts = typeof documentationAlerts.$inferSelect;
export type InsertDocumentationAlerts = typeof documentationAlerts.$inferInsert;
export type ProcedureFlaggingRules = typeof procedureFlaggingRules.$inferSelect;
export type InsertProcedureFlaggingRules = typeof procedureFlaggingRules.$inferInsert;

// Export existing insert types
export type InsertPreAuthRequestType = z.infer<typeof insertPreAuthRequestSchema>;
export type InsertInsurerCriteriaType = z.infer<typeof insertInsurerCriteriaSchema>;
export type InsertPreAuthTemplateType = z.infer<typeof insertPreAuthTemplateSchema>;
export type InsertProcedureAuthRequirementType = z.infer<typeof insertProcedureAuthRequirementSchema>;

// Create new insert schemas
export const insertPreAuthTimelineSchema = createInsertSchema(preAuthTimeline);
export const insertComplianceMetricsSchema = createInsertSchema(complianceMetrics);
export const insertPayerResponseAnalyticsSchema = createInsertSchema(payerResponseAnalytics);
export const insertDocumentationAlertsSchema = createInsertSchema(documentationAlerts);
export const insertProcedureFlaggingRulesSchema = createInsertSchema(procedureFlaggingRules);

// Export new insert types
export type InsertPreAuthTimelineType = z.infer<typeof insertPreAuthTimelineSchema>;
export type InsertComplianceMetricsType = z.infer<typeof insertComplianceMetricsSchema>;
export type InsertPayerResponseAnalyticsType = z.infer<typeof insertPayerResponseAnalyticsSchema>;
export type InsertDocumentationAlertsType = z.infer<typeof insertDocumentationAlertsSchema>;
export type InsertProcedureFlaggingRulesType = z.infer<typeof insertProcedureFlaggingRulesSchema>;