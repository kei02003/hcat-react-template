import { pgTable, varchar, text, integer, decimal, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const timelyFilingClaims = pgTable("timely_filing_claims", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull().unique(),
  patientName: text("patient_name").notNull(),
  patientId: text("patient_id").notNull(),
  serviceDate: date("service_date").notNull(),
  dischargeDate: date("discharge_date"),
  payerName: text("payer_name").notNull(),
  payerClass: text("payer_class").notNull(),
  claimAmount: decimal("claim_amount", { precision: 10, scale: 2 }),
  filingDeadline: date("filing_deadline").notNull(),
  daysRemaining: integer("days_remaining").notNull(),
  riskLevel: text("risk_level").$type<"Critical" | "High" | "Medium" | "Low">().notNull(),
  department: text("department").notNull(),
  assignedTo: text("assigned_to"),
  status: text("status").$type<"Pending" | "In Progress" | "Filed" | "Expired" | "On Hold">().notNull(),
  lastActionDate: timestamp("last_action_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const filingDeadlines = pgTable("filing_deadlines", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerName: text("payer_name").notNull(),
  payerClass: text("payer_class").notNull(),
  deadlineDays: integer("deadline_days").notNull(), // Days from service date
  gracePeriod: integer("grace_period").default(0),
  requiresPriorAuth: boolean("requires_prior_auth").default(false),
  electronicFiling: boolean("electronic_filing").default(true),
  specialRequirements: text("special_requirements"),
  contactInfo: text("contact_info"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const filingMetrics = pgTable("filing_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricDate: date("metric_date").notNull(),
  totalClaims: integer("total_claims").notNull(),
  claimsAtRisk: integer("claims_at_risk").notNull(),
  criticalClaims: integer("critical_claims").notNull(),
  expiredClaims: integer("expired_claims").notNull(),
  totalValue: decimal("total_value", { precision: 12, scale: 2 }),
  valueAtRisk: decimal("value_at_risk", { precision: 12, scale: 2 }),
  filingSuccessRate: decimal("filing_success_rate", { precision: 5, scale: 2 }),
  avgProcessingTime: decimal("avg_processing_time", { precision: 5, scale: 2 }),
});

export const filingAlerts = pgTable("filing_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  claimId: text("claim_id").notNull(),
  alertType: text("alert_type").$type<"Deadline Warning" | "Critical Deadline" | "Expired" | "Missing Documentation">().notNull(),
  alertMessage: text("alert_message").notNull(),
  priority: text("priority").$type<"Critical" | "High" | "Medium" | "Low">().notNull(),
  isResolved: boolean("is_resolved").default(false),
  assignedTo: text("assigned_to"),
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
});

export const departmentPerformance = pgTable("department_performance", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  department: text("department").notNull(),
  totalClaims: integer("total_claims").notNull(),
  filedOnTime: integer("filed_on_time").notNull(),
  expiredClaims: integer("expired_claims").notNull(),
  avgDaysToFile: decimal("avg_days_to_file", { precision: 5, scale: 2 }),
  successRate: decimal("success_rate", { precision: 5, scale: 2 }),
  valueAtRisk: decimal("value_at_risk", { precision: 12, scale: 2 }),
  monthYear: text("month_year").notNull(), // Format: "2024-12"
});

// Insert schemas
export const insertTimelyFilingClaimsSchema = createInsertSchema(timelyFilingClaims).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFilingDeadlinesSchema = createInsertSchema(filingDeadlines).omit({
  id: true,
  updatedAt: true,
});

export const insertFilingMetricsSchema = createInsertSchema(filingMetrics).omit({
  id: true,
});

export const insertFilingAlertsSchema = createInsertSchema(filingAlerts).omit({
  id: true,
  createdAt: true,
  resolvedAt: true,
});

export const insertDepartmentPerformanceSchema = createInsertSchema(departmentPerformance).omit({
  id: true,
});

// Types
export type TimelyFilingClaims = typeof timelyFilingClaims.$inferSelect;
export type InsertTimelyFilingClaims = z.infer<typeof insertTimelyFilingClaimsSchema>;
export type FilingDeadlines = typeof filingDeadlines.$inferSelect;
export type InsertFilingDeadlines = z.infer<typeof insertFilingDeadlinesSchema>;
export type FilingMetrics = typeof filingMetrics.$inferSelect;
export type InsertFilingMetrics = z.infer<typeof insertFilingMetricsSchema>;
export type FilingAlerts = typeof filingAlerts.$inferSelect;
export type InsertFilingAlerts = z.infer<typeof insertFilingAlertsSchema>;
export type DepartmentPerformance = typeof departmentPerformance.$inferSelect;
export type InsertDepartmentPerformance = z.infer<typeof insertDepartmentPerformanceSchema>;