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
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Appeal generation requests table
export const appealRequests = pgTable("appeal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull(),
  denialId: text("denial_id").notNull(),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  payer: text("payer").notNull(),
  payerId: text("payer_id").notNull(),
  denialReason: text("denial_reason").notNull(),
  denialCode: text("denial_code").notNull(),
  denialDate: timestamp("denial_date").notNull(),
  claimAmount: decimal("claim_amount", { precision: 12, scale: 2 }).notNull(),
  appealType: text("appeal_type").$type<"peer_to_peer" | "written_appeal" | "external_review" | "expedited">().notNull(),
  appealLevel: text("appeal_level").$type<"first_level" | "second_level" | "external_review">().default("first_level"),
  successProbability: real("success_probability"), // 0-1 probability of successful appeal
  priorityScore: integer("priority_score"), // 1-100 priority ranking
  status: text("status").$type<"pending_generation" | "generated" | "reviewed" | "submitted" | "approved" | "denied" | "withdrawn">().default("pending_generation"),
  generatedAt: timestamp("generated_at"),
  submittedAt: timestamp("submitted_at"),
  responseDate: timestamp("response_date"),
  appealDeadline: timestamp("appeal_deadline").notNull(),
  daysUntilDeadline: integer("days_until_deadline"),
  assignedTo: text("assigned_to"),
  reviewedBy: text("reviewed_by"),
  approvedBy: text("approved_by"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated appeal letters table
export const appealLetters = pgTable("appeal_letters", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appealId: varchar("appeal_id").notNull(),
  templateId: varchar("template_id"),
  letterContent: text("letter_content").notNull(),
  clinicalEvidence: jsonb("clinical_evidence").notNull(),
  supportingDocuments: text("supporting_documents").array(),
  citedRegulations: text("cited_regulations").array(),
  keyArguments: text("key_arguments").array(),
  medicalNecessityJustification: text("medical_necessity_justification"),
  letterType: text("letter_type").$type<"initial_appeal" | "peer_to_peer_request" | "external_review" | "reconsideration">().notNull(),
  generationMethod: text("generation_method").$type<"ai_generated" | "template_based" | "manual">().notNull(),
  reviewStatus: text("review_status").$type<"pending" | "approved" | "needs_revision" | "rejected">().default("pending"),
  reviewerNotes: text("reviewer_notes"),
  isSubmitted: boolean("is_submitted").default(false),
  submissionMethod: text("submission_method").$type<"electronic" | "mail" | "fax" | "portal">(),
  confirmationNumber: text("confirmation_number"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Appeal letter templates table
export const appealLetterTemplates = pgTable("appeal_letter_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateName: text("template_name").notNull(),
  denialReasonCategory: text("denial_reason_category").notNull(),
  payerType: text("payer_type").$type<"medicare" | "medicaid" | "commercial" | "all">().default("all"),
  letterTemplate: text("letter_template").notNull(),
  requiredEvidence: text("required_evidence").array(),
  argumentStructure: jsonb("argument_structure"),
  regulatoryCitations: text("regulatory_citations").array(),
  successRate: real("success_rate"), // Historical success rate 0-1
  isActive: boolean("is_active").default(true),
  createdBy: text("created_by").notNull(),
  approvedBy: text("approved_by"),
  approvedAt: timestamp("approved_at"),
  lastUsed: timestamp("last_used"),
  usageCount: integer("usage_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinical evidence extraction table
export const clinicalEvidence = pgTable("clinical_evidence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appealId: varchar("appeal_id").notNull(),
  patientId: text("patient_id").notNull(),
  evidenceType: text("evidence_type").$type<"lab_results" | "vital_signs" | "medications" | "procedures" | "imaging" | "physician_notes" | "nursing_notes">().notNull(),
  evidenceSource: text("evidence_source").notNull(), // Chart section or document
  evidenceText: text("evidence_text").notNull(),
  clinicalSignificance: text("clinical_significance").notNull(),
  supportsDenialReversal: boolean("supports_denial_reversal").notNull(),
  relevanceScore: real("relevance_score"), // 0-1 relevance to appeal
  extractedBy: text("extracted_by").$type<"ai" | "manual" | "hybrid">().notNull(),
  verifiedBy: text("verified_by"),
  verifiedAt: timestamp("verified_at"),
  citationFormat: text("citation_format"), // How to cite in appeal letter
  isIncluded: boolean("is_included").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Appeal success tracking table
export const appealOutcomes = pgTable("appeal_outcomes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  appealId: varchar("appeal_id").notNull(),
  outcome: text("outcome").$type<"fully_approved" | "partially_approved" | "denied" | "pending" | "withdrawn">().notNull(),
  approvedAmount: decimal("approved_amount", { precision: 12, scale: 2 }),
  deniedAmount: decimal("denied_amount", { precision: 12, scale: 2 }),
  payerResponse: text("payer_response"),
  responseDate: timestamp("response_date").notNull(),
  daysTaken: integer("days_taken"),
  lessonsLearned: text("lessons_learned").array(),
  improvementSuggestions: text("improvement_suggestions").array(),
  appealStrengths: text("appeal_strengths").array(),
  appealWeaknesses: text("appeal_weaknesses").array(),
  nextLevelEligible: boolean("next_level_eligible").default(false),
  nextLevelDeadline: timestamp("next_level_deadline"),
  revenueRecovered: decimal("revenue_recovered", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Denial pattern analysis for better appeals
export const denialPatterns = pgTable("denial_patterns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  denialReason: text("denial_reason").notNull(),
  denialCode: text("denial_code").notNull(),
  patternDescription: text("pattern_description").notNull(),
  frequency: integer("frequency").notNull(),
  successfulAppealRate: real("successful_appeal_rate"),
  commonMissingEvidence: text("common_missing_evidence").array(),
  effectiveArguments: text("effective_arguments").array(),
  regulatoryReferences: text("regulatory_references").array(),
  recommendedActions: text("recommended_actions").array(),
  lastUpdated: timestamp("last_updated").defaultNow(),
  isActive: boolean("is_active").default(true),
});

// Export types
export type AppealRequest = typeof appealRequests.$inferSelect;
export type InsertAppealRequest = typeof appealRequests.$inferInsert;
export type AppealLetter = typeof appealLetters.$inferSelect;
export type InsertAppealLetter = typeof appealLetters.$inferInsert;
export type AppealLetterTemplate = typeof appealLetterTemplates.$inferSelect;
export type InsertAppealLetterTemplate = typeof appealLetterTemplates.$inferInsert;
export type ClinicalEvidence = typeof clinicalEvidence.$inferSelect;
export type InsertClinicalEvidence = typeof clinicalEvidence.$inferInsert;
export type AppealOutcome = typeof appealOutcomes.$inferSelect;
export type InsertAppealOutcome = typeof appealOutcomes.$inferInsert;
export type DenialPattern = typeof denialPatterns.$inferSelect;
export type InsertDenialPattern = typeof denialPatterns.$inferInsert;

// Create insert schemas
export const insertAppealRequestSchema = createInsertSchema(appealRequests);
export const insertAppealLetterSchema = createInsertSchema(appealLetters);
export const insertAppealLetterTemplateSchema = createInsertSchema(appealLetterTemplates);
export const insertClinicalEvidenceSchema = createInsertSchema(clinicalEvidence);
export const insertAppealOutcomeSchema = createInsertSchema(appealOutcomes);
export const insertDenialPatternSchema = createInsertSchema(denialPatterns);

// Export insert types
export type InsertAppealRequestType = z.infer<typeof insertAppealRequestSchema>;
export type InsertAppealLetterType = z.infer<typeof insertAppealLetterSchema>;
export type InsertAppealLetterTemplateType = z.infer<typeof insertAppealLetterTemplateSchema>;
export type InsertClinicalEvidenceType = z.infer<typeof insertClinicalEvidenceSchema>;
export type InsertAppealOutcomeType = z.infer<typeof insertAppealOutcomeSchema>;
export type InsertDenialPatternType = z.infer<typeof insertDenialPatternSchema>;