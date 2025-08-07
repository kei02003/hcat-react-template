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

// Export insert types
export type InsertPreAuthRequestType = z.infer<typeof insertPreAuthRequestSchema>;
export type InsertInsurerCriteriaType = z.infer<typeof insertInsurerCriteriaSchema>;
export type InsertPreAuthTemplateType = z.infer<typeof insertPreAuthTemplateSchema>;
export type InsertProcedureAuthRequirementType = z.infer<typeof insertProcedureAuthRequirementSchema>;