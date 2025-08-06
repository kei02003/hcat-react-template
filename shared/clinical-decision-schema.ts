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

// Patient status monitoring table
export const patientStatusMonitoring = pgTable("patient_status_monitoring", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  patientName: text("patient_name").notNull(),
  admissionId: text("admission_id").notNull(),
  currentStatus: text("current_status").$type<"inpatient" | "observation" | "outpatient" | "emergency">().notNull(),
  recommendedStatus: text("recommended_status").$type<"inpatient" | "observation" | "outpatient" | "emergency">(),
  admissionDate: timestamp("admission_date").notNull(),
  dischargeDate: timestamp("discharge_date"),
  length_of_stay: integer("length_of_stay"), // Hours
  primaryDiagnosis: text("primary_diagnosis").notNull(),
  secondaryDiagnoses: text("secondary_diagnoses").array(),
  drg: text("drg"),
  payer: text("payer").notNull(),
  payerId: text("payer_id").notNull(),
  department: text("department").notNull(),
  attendingPhysician: text("attending_physician").notNull(),
  clinicalIndicators: jsonb("clinical_indicators"), // Vital signs, lab results
  lastAssessment: timestamp("last_assessment").defaultNow(),
  statusChangeRecommendations: jsonb("status_change_recommendations"),
  alertsTriggered: text("alerts_triggered").array(),
  complianceScore: real("compliance_score"), // 0-1 alignment with insurer criteria
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Clinical indicators tracking table
export const clinicalIndicators = pgTable("clinical_indicators", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  admissionId: text("admission_id").notNull(),
  recordedDateTime: timestamp("recorded_datetime").notNull(),
  indicatorType: text("indicator_type").$type<"vital_signs" | "lab_results" | "medications" | "procedures" | "imaging">().notNull(),
  indicatorName: text("indicator_name").notNull(),
  value: text("value").notNull(),
  unit: text("unit"),
  normalRange: text("normal_range"),
  isAbnormal: boolean("is_abnormal").default(false),
  clinicalSignificance: text("clinical_significance"),
  supportingDocumentation: text("supporting_documentation"),
  enteredBy: text("entered_by").notNull(),
  verifiedBy: text("verified_by"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical record analysis table
export const medicalRecordAnalysis = pgTable("medical_record_analysis", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  admissionId: text("admission_id").notNull(),
  claimId: text("claim_id"),
  denialId: text("denial_id"),
  analysisType: text("analysis_type").$type<"status_validation" | "denial_review" | "coding_support" | "documentation_check">().notNull(),
  analysisResults: jsonb("analysis_results").notNull(),
  clinicalEvidence: jsonb("clinical_evidence"),
  documentationGaps: text("documentation_gaps").array(),
  recommendedActions: text("recommended_actions").array(),
  confidenceScore: real("confidence_score"), // 0-1 confidence in recommendations
  reviewStatus: text("review_status").$type<"pending" | "reviewed" | "approved" | "rejected">().default("pending"),
  reviewedBy: text("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  reviewerNotes: text("reviewer_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Real-time alerts table
export const clinicalAlerts = pgTable("clinical_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: text("patient_id").notNull(),
  admissionId: text("admission_id").notNull(),
  alertType: text("alert_type").$type<"status_change" | "documentation_gap" | "coding_opportunity" | "denial_risk">().notNull(),
  priority: text("priority").$type<"low" | "medium" | "high" | "critical">().notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  triggerConditions: jsonb("trigger_conditions"),
  recommendedActions: text("recommended_actions").array(),
  assignedTo: text("assigned_to"),
  status: text("status").$type<"active" | "acknowledged" | "resolved" | "dismissed">().default("active"),
  acknowledgedBy: text("acknowledged_by"),
  acknowledgedAt: timestamp("acknowledged_at"),
  resolvedBy: text("resolved_by"),
  resolvedAt: timestamp("resolved_at"),
  resolutionNotes: text("resolution_notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insurer-specific clinical criteria table
export const insurerClinicalCriteria = pgTable("insurer_clinical_criteria", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerId: text("payer_id").notNull(),
  payerName: text("payer_name").notNull(),
  conditionCode: text("condition_code").notNull(),
  conditionName: text("condition_name").notNull(),
  statusCriteria: jsonb("status_criteria"), // Inpatient vs observation criteria
  documentationRequirements: jsonb("documentation_requirements"),
  clinicalThresholds: jsonb("clinical_thresholds"), // Lab values, vital sign ranges
  excludedCriteria: jsonb("excluded_criteria"),
  effectiveDate: timestamp("effective_date").notNull(),
  expirationDate: timestamp("expiration_date"),
  isActive: boolean("is_active").default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Export types
export type PatientStatusMonitoring = typeof patientStatusMonitoring.$inferSelect;
export type InsertPatientStatusMonitoring = typeof patientStatusMonitoring.$inferInsert;
export type ClinicalIndicator = typeof clinicalIndicators.$inferSelect;
export type InsertClinicalIndicator = typeof clinicalIndicators.$inferInsert;
export type MedicalRecordAnalysis = typeof medicalRecordAnalysis.$inferSelect;
export type InsertMedicalRecordAnalysis = typeof medicalRecordAnalysis.$inferInsert;
export type ClinicalAlert = typeof clinicalAlerts.$inferSelect;
export type InsertClinicalAlert = typeof clinicalAlerts.$inferInsert;
export type InsurerClinicalCriteria = typeof insurerClinicalCriteria.$inferSelect;
export type InsertInsurerClinicalCriteria = typeof insurerClinicalCriteria.$inferInsert;

// Create insert schemas
export const insertPatientStatusMonitoringSchema = createInsertSchema(patientStatusMonitoring);
export const insertClinicalIndicatorSchema = createInsertSchema(clinicalIndicators);
export const insertMedicalRecordAnalysisSchema = createInsertSchema(medicalRecordAnalysis);
export const insertClinicalAlertSchema = createInsertSchema(clinicalAlerts);
export const insertInsurerClinicalCriteriaSchema = createInsertSchema(insurerClinicalCriteria);

// Export insert types
export type InsertPatientStatusMonitoringType = z.infer<typeof insertPatientStatusMonitoringSchema>;
export type InsertClinicalIndicatorType = z.infer<typeof insertClinicalIndicatorSchema>;
export type InsertMedicalRecordAnalysisType = z.infer<typeof insertMedicalRecordAnalysisSchema>;
export type InsertClinicalAlertType = z.infer<typeof insertClinicalAlertSchema>;
export type InsertInsurerClinicalCriteriaType = z.infer<typeof insertInsurerClinicalCriteriaSchema>;