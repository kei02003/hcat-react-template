import { pgTable, varchar, text, integer, decimal, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const clinicalDenials = pgTable("clinical_denials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  denialId: text("denial_id").notNull().unique(),
  claimId: text("claim_id").notNull(),
  patientName: text("patient_name").notNull(),
  patientId: text("patient_id").notNull(),
  serviceDate: date("service_date").notNull(),
  admissionDate: date("admission_date"),
  dischargeDate: date("discharge_date"),
  payerName: text("payer_name").notNull(),
  payerClass: text("payer_class").notNull(),
  deniedAmount: decimal("denied_amount", { precision: 10, scale: 2 }),
  denialReason: text("denial_reason").notNull(),
  denialCode: text("denial_code").notNull(),
  denialCategory: text("denial_category").$type<"Medical Necessity" | "Authorization" | "Coverage" | "Coding" | "Documentation" | "Eligibility" | "Timely Filing">().notNull(),
  clinicalReasonCode: text("clinical_reason_code"),
  department: text("department").notNull(),
  providerId: text("provider_id"),
  providerName: text("provider_name"),
  diagnosisCode: text("diagnosis_code"),
  procedureCode: text("procedure_code"),
  denialDate: date("denial_date").notNull(),
  appealDeadline: date("appeal_deadline"),
  status: text("status").$type<"Under Review" | "Appeal Submitted" | "Pending Documentation" | "Overturned" | "Upheld" | "Closed">().notNull(),
  appealLevel: text("appeal_level").$type<"First Level" | "Second Level" | "Third Level" | "External Review">(),
  assignedReviewer: text("assigned_reviewer"),
  reviewNotes: text("review_notes"),
  actionRequired: text("action_required"),
  lastActionDate: timestamp("last_action_date"),
  resolutionDate: timestamp("resolution_date"),
  recoveredAmount: decimal("recovered_amount", { precision: 10, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const denialReasons = pgTable("denial_reasons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  org_id: varchar("org_id").notNull(),
  reasonCode: text("reason_code").notNull().unique(),
  reasonDescription: text("reason_description").notNull(),
  category: text("category").notNull(),
  payerSpecific: boolean("payer_specific").default(false),
  payerName: text("payer_name"),
  actionGuidance: text("action_guidance"),
  preventionStrategy: text("prevention_strategy"),
  appealSuccess: decimal("appeal_success_rate", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

export const clinicalReviewers = pgTable("clinical_reviewers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  reviewerId: text("reviewer_id").notNull().unique(),
  reviewerName: text("reviewer_name").notNull(),
  credentials: text("credentials"),
  specialization: text("specialization"),
  department: text("department"),
  activeReviews: integer("active_reviews").default(0),
  totalReviews: integer("total_reviews").default(0),
  appealSuccessRate: decimal("appeal_success_rate", { precision: 5, scale: 2 }),
  avgReviewTime: decimal("avg_review_time", { precision: 5, scale: 2 }),
  isActive: boolean("is_active").default(true),
});

export const denialTrends = pgTable("denial_trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  trendDate: date("trend_date").notNull(),
  totalDenials: integer("total_denials").notNull(),
  deniedAmount: decimal("denied_amount", { precision: 12, scale: 2 }),
  appealedDenials: integer("appealed_denials").notNull(),
  overturnedDenials: integer("overturned_denials").notNull(),
  recoveredAmount: decimal("recovered_amount", { precision: 12, scale: 2 }),
  medicalNecessityDenials: integer("medical_necessity_denials").notNull(),
  authorizationDenials: integer("authorization_denials").notNull(),
  coverageDenials: integer("coverage_denials").notNull(),
  codingDenials: integer("coding_denials").notNull(),
  documentationDenials: integer("documentation_denials").notNull(),
  overturnRate: decimal("overturn_rate", { precision: 5, scale: 2 }),
});

export const denialAppeal = pgTable("denial_appeal", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  appealId: text("appeal_id").notNull().unique(),
  denialId: text("denial_id").notNull(),
  appealLevel: text("appeal_level").$type<"First Level" | "Second Level" | "Third Level" | "External Review">().notNull(),
  submissionDate: date("submission_date").notNull(),
  appealDeadline: date("appeal_deadline").notNull(),
  appealAmount: decimal("appeal_amount", { precision: 10, scale: 2 }),
  appealReason: text("appeal_reason").notNull(),
  supportingDocuments: text("supporting_documents"),
  clinicalJustification: text("clinical_justification"),
  status: text("status").$type<"Submitted" | "Under Review" | "Approved" | "Denied" | "Partial Approval">().notNull(),
  reviewerNotes: text("reviewer_notes"),
  decisionDate: date("decision_date"),
  approvedAmount: decimal("approved_amount", { precision: 10, scale: 2 }),
  deniedAmount: decimal("denied_amount", { precision: 10, scale: 2 }),
  nextActionRequired: text("next_action_required"),
  assignedClinician: text("assigned_clinician"),
});

// Insert schemas
export const insertClinicalDenialsSchema = createInsertSchema(clinicalDenials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertDenialReasonsSchema = createInsertSchema(denialReasons).omit({
  id: true,
});

export const insertClinicalReviewersSchema = createInsertSchema(clinicalReviewers).omit({
  id: true,
});

export const insertDenialTrendsSchema = createInsertSchema(denialTrends).omit({
  id: true,
});

export const insertDenialAppealSchema = createInsertSchema(denialAppeal).omit({
  id: true,
});

// Types
export type ClinicalDenials = typeof clinicalDenials.$inferSelect;
export type InsertClinicalDenials = z.infer<typeof insertClinicalDenialsSchema>;
export type DenialReasons = typeof denialReasons.$inferSelect;
export type InsertDenialReasons = z.infer<typeof insertDenialReasonsSchema>;
export type ClinicalReviewers = typeof clinicalReviewers.$inferSelect;
export type InsertClinicalReviewers = z.infer<typeof insertClinicalReviewersSchema>;
export type DenialTrends = typeof denialTrends.$inferSelect;
export type InsertDenialTrends = z.infer<typeof insertDenialTrendsSchema>;
export type DenialAppeal = typeof denialAppeal.$inferSelect;
export type InsertDenialAppeal = z.infer<typeof insertDenialAppealSchema>;