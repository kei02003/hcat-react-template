import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, jsonb, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const metrics = pgTable("metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  value: text("value").notNull(),
  previousValue: text("previous_value"),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  status: text("status").$type<"positive" | "negative" | "neutral">().default("neutral"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const documentationRequests = pgTable("documentation_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull(),
  patientName: text("patient_name").notNull(),
  payer: text("payer").notNull(),
  requestDate: timestamp("request_date").notNull(),
  documentType: text("document_type").notNull(),
  originalSubmissionDate: timestamp("original_submission_date"),
  status: text("status").$type<"already_submitted" | "new_required" | "partial_match" | "auto_response">().notNull(),
  isRedundant: boolean("is_redundant").default(false),
  amount: decimal("amount", { precision: 10, scale: 2 }),
});

export const payerBehavior = pgTable("payer_behavior", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerName: text("payer_name").notNull(),
  redundantRequestRate: decimal("redundant_request_rate", { precision: 5, scale: 2 }),
  topRequestType: text("top_request_type"),
  avgResponseTime: decimal("avg_response_time", { precision: 5, scale: 2 }),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  revenueImpact: decimal("revenue_impact", { precision: 10, scale: 2 }),
});

export const redundancyMatrix = pgTable("redundancy_matrix", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  documentType: text("document_type").notNull(),
  payer: text("payer").notNull(),
  count: integer("count").notNull(),
  redundancyRate: decimal("redundancy_rate", { precision: 5, scale: 2 }),
});

export const predictiveAnalytics = pgTable("predictive_analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull(),
  patientName: text("patient_name").notNull(),
  payer: text("payer").notNull(),
  procedureCode: text("procedure_code").notNull(),
  department: text("department").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  denialRiskScore: decimal("denial_risk_score", { precision: 5, scale: 2 }),
  documentationRiskScore: decimal("documentation_risk_score", { precision: 5, scale: 2 }),
  timelyFilingRiskScore: decimal("timely_filing_risk_score", { precision: 5, scale: 2 }),
  overallRiskScore: decimal("overall_risk_score", { precision: 5, scale: 2 }),
  riskLevel: text("risk_level").$type<"low" | "medium" | "high" | "critical">().notNull(),
  recommendedActions: text("recommended_actions").array(),
  predictedDenialReasons: text("predicted_denial_reasons").array(),
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const denialPredictions = pgTable("denial_predictions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  predictionDate: timestamp("prediction_date").notNull(),
  timeframe: text("timeframe").notNull(), // "next_week", "next_month", "next_quarter"
  predictedDenials: integer("predicted_denials").notNull(),
  predictedAmount: decimal("predicted_amount", { precision: 10, scale: 2 }),
  byPayer: text("by_payer").notNull(), // JSON string
  byDepartment: text("by_department").notNull(), // JSON string  
  byDenialType: text("by_denial_type").notNull(), // JSON string
  confidence: decimal("confidence", { precision: 5, scale: 2 }),
  actualDenials: integer("actual_denials"),
  actualAmount: decimal("actual_amount", { precision: 10, scale: 2 }),
  accuracy: decimal("accuracy", { precision: 5, scale: 2 }),
});

export const riskFactors = pgTable("risk_factors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  factorName: text("factor_name").notNull(),
  category: text("category").notNull(), // "payer", "procedure", "department", "timing", "documentation"
  weightScore: decimal("weight_score", { precision: 5, scale: 2 }),
  description: text("description").notNull(),
  isActive: boolean("is_active").default(true),
});

export const insertMetricsSchema = createInsertSchema(metrics).omit({
  id: true,
  updatedAt: true,
});

export const insertDocumentationRequestSchema = createInsertSchema(documentationRequests).omit({
  id: true,
});

export const insertPayerBehaviorSchema = createInsertSchema(payerBehavior).omit({
  id: true,
});

export const insertRedundancyMatrixSchema = createInsertSchema(redundancyMatrix).omit({
  id: true,
});

export const insertPredictiveAnalyticsSchema = createInsertSchema(predictiveAnalytics).omit({
  id: true,
  createdAt: true,
});

export const insertDenialPredictionsSchema = createInsertSchema(denialPredictions).omit({
  id: true,
});

export const insertRiskFactorsSchema = createInsertSchema(riskFactors).omit({
  id: true,
});

export type Metric = typeof metrics.$inferSelect;
export type InsertMetric = z.infer<typeof insertMetricsSchema>;
export type DocumentationRequest = typeof documentationRequests.$inferSelect;
export type InsertDocumentationRequest = z.infer<typeof insertDocumentationRequestSchema>;
export type PayerBehavior = typeof payerBehavior.$inferSelect;
export type InsertPayerBehavior = z.infer<typeof insertPayerBehaviorSchema>;
export type RedundancyMatrix = typeof redundancyMatrix.$inferSelect;
export type InsertRedundancyMatrix = z.infer<typeof insertRedundancyMatrixSchema>;
export type PredictiveAnalytics = typeof predictiveAnalytics.$inferSelect;
export type InsertPredictiveAnalytics = z.infer<typeof insertPredictiveAnalyticsSchema>;
export type DenialPredictions = typeof denialPredictions.$inferSelect;
export type InsertDenialPredictions = z.infer<typeof insertDenialPredictionsSchema>;
export type RiskFactors = typeof riskFactors.$inferSelect;
export type InsertRiskFactors = z.infer<typeof insertRiskFactorsSchema>;

// Template Management Schema
export const preAuthTemplates = pgTable("pre_auth_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  payerName: text("payer_name").notNull(),
  formType: text("form_type").notNull(), // e.g., "Inpatient Medical", "Outpatient", etc.
  originalFileName: text("original_file_name").notNull(),
  uploadDate: timestamp("upload_date").defaultNow(),
  status: text("status").$type<"processing" | "ready" | "error" | "mapping_required">().default("processing"),
  extractedText: text("extracted_text"),
  processingNotes: text("processing_notes").array().default(sql`ARRAY[]::text[]`),
  mappingProgress: integer("mapping_progress").default(0), // percentage 0-100
  createdBy: varchar("created_by").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const templateFields = pgTable("template_fields", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => preAuthTemplates.id, { onDelete: "cascade" }),
  label: text("label").notNull(),
  fieldType: text("field_type").$type<"text" | "textarea" | "date" | "select" | "checkbox" | "number">().notNull(),
  required: boolean("required").default(false),
  position: jsonb("position").$type<{ x: number; y: number; page: number }>().notNull(),
  options: text("options").array(), // for select fields
  mappingRules: text("mapping_rules").array(), // patient data field paths
  validationRules: jsonb("validation_rules").$type<{ pattern?: string; minLength?: number; maxLength?: number }>(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const templateMappingConfigs = pgTable("template_mapping_configs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  templateId: varchar("template_id").notNull().references(() => preAuthTemplates.id, { onDelete: "cascade" }),
  fieldId: varchar("field_id").notNull().references(() => templateFields.id, { onDelete: "cascade" }),
  patientDataPath: text("patient_data_path").notNull(), // e.g., "patient.firstName"
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // AI mapping confidence score
  isManualMapping: boolean("is_manual_mapping").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for template management
export const insertPreAuthTemplatesSchema = createInsertSchema(preAuthTemplates).omit({
  id: true,
  uploadDate: true,
  updatedAt: true,
});

export const insertTemplateFieldsSchema = createInsertSchema(templateFields).omit({
  id: true,
  createdAt: true,
});

export const insertTemplateMappingConfigsSchema = createInsertSchema(templateMappingConfigs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Template management types
export type PreAuthTemplate = typeof preAuthTemplates.$inferSelect;
export type InsertPreAuthTemplate = z.infer<typeof insertPreAuthTemplatesSchema>;
export type TemplateField = typeof templateFields.$inferSelect;
export type InsertTemplateField = z.infer<typeof insertTemplateFieldsSchema>;
export type TemplateMappingConfig = typeof templateMappingConfigs.$inferSelect;
export type InsertTemplateMappingConfig = z.infer<typeof insertTemplateMappingConfigsSchema>;

// Write-Off Analytics Schema
export const writeOffs = pgTable("write_offs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull(),
  patientName: text("patient_name").notNull(),
  patientId: text("patient_id").notNull(),
  payer: text("payer").notNull(),
  department: text("department").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  writeOffDate: timestamp("write_off_date").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  reason: text("reason").$type<"contractual" | "bad_debt" | "charity" | "admin" | "small_balance" | "prompt_pay" | "other">().notNull(),
  subReason: text("sub_reason"),
  status: text("status").$type<"pending" | "approved" | "posted" | "reversed">().default("pending"),
  badDebtFlag: boolean("bad_debt_flag").default(false),
  badDebtStage: text("bad_debt_stage").$type<"pre_collection" | "collection_agency" | "bankruptcy" | "deceased" | "other">(),
  agencyName: text("agency_name"),
  recoveryAmount: decimal("recovery_amount", { precision: 10, scale: 2 }),
  recoveryDate: timestamp("recovery_date"),
  agingDays: integer("aging_days"), // Days from service to write-off
  notes: text("notes").array().default(sql`ARRAY[]::text[]`),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertWriteOffsSchema = createInsertSchema(writeOffs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type WriteOff = typeof writeOffs.$inferSelect;
export type InsertWriteOff = z.infer<typeof insertWriteOffsSchema>;

// Canonical Metric System Tables
// Base metric definitions table
export const canonicalMetric = pgTable("canonical_metric", {
  metric_key: text("metric_key").primaryKey(),
  metric: text("metric").notNull(),
  metric_description: text("metric_description").notNull(),
  tags: jsonb("tags").$type<string[]>()
});

// Version-specific metric definitions table
export const canonicalMetricVersion = pgTable("canonical_metric_version", {
  metric_version_key: text("metric_version_key").primaryKey(),
  metric_key: text("metric_key").notNull().references(() => canonicalMetric.metric_key),
  version_number: text("version_number").notNull(),
  valid_from_datetime: timestamp("valid_from_datetime"),
  valid_to_datetime: timestamp("valid_to_datetime"),
  metric_version_name: text("metric_version_name").notNull(),
  metric_version_description: text("metric_version_description").notNull(),
  grain: jsonb("grain").$type<Record<string, string>>(),
  grain_description: text("grain_description"),
  domain: text("domain").notNull(),
  result_type: text("result_type"),
  result_unit: text("result_unit"),
  frequency: text("frequency"),
  source_category: text("source_category"),
  is_regulatory: boolean("is_regulatory"),
  regulatory_program: text("regulatory_program"),
  steward: text("steward").notNull(),
  developer: text("developer").notNull(),
  is_active: boolean("is_active"),
  metadata_schema: jsonb("metadata_schema").$type<Record<string, any>>(),
  required_metadata_fields: jsonb("required_metadata_fields").$type<string[]>(),
  created_datetime: timestamp("created_datetime").defaultNow(),
  updated_datetime: timestamp("updated_datetime").defaultNow()
});

// Final metric results table
export const canonicalResult = pgTable("canonical_result", {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys").$type<Record<string, string>>().notNull(),
  metric_version_key: text("metric_version_key").notNull().references(() => canonicalMetricVersion.metric_version_key),
  result_value_numeric: decimal("result_value_numeric", { precision: 15, scale: 4 }),
  result_value_datetime: timestamp("result_value_datetime"),
  result_value_text: text("result_value_text"),
  result_value_boolean: boolean("result_value_boolean"),
  result_value_json: jsonb("result_value_json").$type<Record<string, any>>(),
  measurement_period_start_datetime: timestamp("measurement_period_start_datetime"),
  measurement_period_end_datetime: timestamp("measurement_period_end_datetime"),
  as_of_datetime: timestamp("as_of_datetime"),
  result_metadata: jsonb("result_metadata").$type<Record<string, any>>(),
  calculated_at: timestamp("calculated_at"),
  calculation_version: text("calculation_version")
});

// Staging area for metric calculations (append-only)
export const canonicalStagingResult = pgTable("canonical_staging_result", {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys").$type<Record<string, string>>().notNull(),
  metric_version_key: text("metric_version_key").notNull().references(() => canonicalMetricVersion.metric_version_key),
  result_value_numeric: decimal("result_value_numeric", { precision: 15, scale: 4 }),
  result_value_datetime: timestamp("result_value_datetime"),
  result_value_text: text("result_value_text"),
  result_value_boolean: boolean("result_value_boolean"),
  result_value_json: jsonb("result_value_json").$type<Record<string, any>>(),
  measurement_period_start_datetime: timestamp("measurement_period_start_datetime"),
  measurement_period_end_datetime: timestamp("measurement_period_end_datetime"),
  as_of_datetime: timestamp("as_of_datetime"),
  result_metadata: jsonb("result_metadata").$type<Record<string, any>>(),
  calculated_at: timestamp("calculated_at"),
  calculation_version: text("calculation_version")
});

// Metric relationships and hierarchies
export const canonicalMetricLineage = pgTable("canonical_metric_lineage", {
  parent_result_key: text("parent_result_key").notNull().references(() => canonicalResult.result_key),
  child_result_key: text("child_result_key").notNull().references(() => canonicalResult.result_key),
  contribution_weight: decimal("contribution_weight", { precision: 5, scale: 4 })
}, (table) => ({
  pk: primaryKey(table.parent_result_key, table.child_result_key)
}));

// Insert schemas for canonical metrics
export const insertCanonicalMetricSchema = createInsertSchema(canonicalMetric);

export const insertCanonicalMetricVersionSchema = createInsertSchema(canonicalMetricVersion).omit({
  created_datetime: true,
  updated_datetime: true
}).extend({
  domain: z.enum(["Clinical", "Financial", "Operational", "Regulatory", "Quality"]),
  result_type: z.enum(["numeric", "percentage", "currency", "count", "ratio", "text", "boolean", "datetime", "json"]).optional(),
  frequency: z.enum(["real-time", "daily", "weekly", "monthly", "quarterly", "annually"]).optional()
});

// Ensure exactly one result value is populated and org_id is required in grain_keys
export const insertCanonicalResultSchema = createInsertSchema(canonicalResult).refine(
  (data) => {
    const valueFields = [
      data.result_value_numeric,
      data.result_value_datetime, 
      data.result_value_text,
      data.result_value_boolean,
      data.result_value_json
    ];
    const populatedValues = valueFields.filter(v => v !== null && v !== undefined);
    return populatedValues.length === 1;
  },
  { message: "Exactly one result_value field must be populated" }
).refine(
  (data) => data.grain_keys && data.grain_keys.org_id,
  { message: "grain_keys must include org_id for multi-tenant support" }
);

export const insertCanonicalStagingResultSchema = createInsertSchema(canonicalStagingResult).refine(
  (data) => {
    const valueFields = [
      data.result_value_numeric,
      data.result_value_datetime,
      data.result_value_text,
      data.result_value_boolean,
      data.result_value_json
    ];
    const populatedValues = valueFields.filter(v => v !== null && v !== undefined);
    return populatedValues.length === 1;
  },
  { message: "Exactly one result_value field must be populated" }
).refine(
  (data) => data.grain_keys && data.grain_keys.org_id,
  { message: "grain_keys must include org_id for multi-tenant support" }
);

export const insertCanonicalMetricLineageSchema = createInsertSchema(canonicalMetricLineage);

// Canonical metric types
export type CanonicalMetric = typeof canonicalMetric.$inferSelect;
export type CanonicalMetricVersion = typeof canonicalMetricVersion.$inferSelect;
export type CanonicalResult = typeof canonicalResult.$inferSelect;
export type CanonicalStagingResult = typeof canonicalStagingResult.$inferSelect;
export type CanonicalMetricLineage = typeof canonicalMetricLineage.$inferSelect;

export type InsertCanonicalMetric = z.infer<typeof insertCanonicalMetricSchema>;
export type InsertCanonicalMetricVersion = z.infer<typeof insertCanonicalMetricVersionSchema>;
export type InsertCanonicalResult = z.infer<typeof insertCanonicalResultSchema>;
export type InsertCanonicalStagingResult = z.infer<typeof insertCanonicalStagingResultSchema>;
export type InsertCanonicalMetricLineage = z.infer<typeof insertCanonicalMetricLineageSchema>;

// Grain key utilities for multi-tenant operations
export const createGrainKey = (orgId: string, entityId?: string, additionalKeys?: Record<string, string>): Record<string, string> => {
  const grain: Record<string, string> = {
    org_id: orgId
  };
  
  if (entityId) {
    grain.entity_id = entityId;
  }
  
  if (additionalKeys) {
    Object.assign(grain, additionalKeys);
  }
  
  return grain;
};

// Common metric result value getters
export const getCanonicalResultValue = (result: CanonicalResult) => {
  if (result.result_value_numeric !== null) return result.result_value_numeric;
  if (result.result_value_datetime !== null) return result.result_value_datetime;
  if (result.result_value_text !== null) return result.result_value_text;
  if (result.result_value_boolean !== null) return result.result_value_boolean;
  if (result.result_value_json !== null) return result.result_value_json;
  return null;
};

// Re-export canonical billing tables for database creation
export { 
  transactions, 
  accounts, 
  payers, 
  benefit_plans, 
  procedures, 
  diagnoses, 
  denial_remarks,
  type Transaction,
  type Account,
  type Payer,
  type BenefitPlan,
  type Procedure,
  type Diagnosis,
  type DenialRemark,
  type InsertTransaction,
  type InsertAccount,
  type InsertPayer,
  type InsertBenefitPlan,
  type InsertProcedure,
  type InsertDiagnosis,
  type InsertDenialRemark
} from "./canonical-billing-schema";

// Re-export canonical claims tables for database creation
export { 
  canonicalClaimHeaders,
  canonicalClaimLines,
  canonicalClaimStatus,
  canonicalRemittance,
  canonicalPriorAuth,
  canonicalEligibility,
  type SelectClaimHeader,
  type SelectClaimLine,
  type SelectClaimStatus,
  type SelectRemittance,
  type SelectPriorAuth,
  type SelectEligibility,
  type InsertClaimHeader,
  type InsertClaimLine,
  type InsertClaimStatus,
  type InsertRemittance,
  type InsertPriorAuth,
  type InsertEligibility
} from "./canonical-claims-schema";
