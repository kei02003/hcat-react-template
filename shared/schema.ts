import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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
