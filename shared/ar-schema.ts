import { pgTable, varchar, text, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const arTrends = pgTable("ar_trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  actualAmount: decimal("actual_amount", { precision: 10, scale: 2 }),
  expectedAmount: decimal("expected_amount", { precision: 10, scale: 2 }),
  controlLimits: decimal("control_limits", { precision: 10, scale: 2 }),
  limitViolation: boolean("limit_violation").default(false),
  runViolation: boolean("run_violation").default(false),
  detectedChange: boolean("detected_change").default(false),
  measure: text("measure").notNull(), // AR 90+, AR 120+, etc.
});

export const arAging = pgTable("ar_aging", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ageCategory: text("age_category").notNull(), // 0-30, 31-60, 61-90, 90+
  amount: decimal("amount", { precision: 10, scale: 2 }),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  accountCount: integer("account_count"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialTrends = pgTable("financial_trends", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  netCollections: decimal("net_collections", { precision: 10, scale: 2 }),
  grossCharges: decimal("gross_charges", { precision: 10, scale: 2 }),
  adjustments: decimal("adjustments", { precision: 10, scale: 2 }),
  cashReceipts: decimal("cash_receipts", { precision: 10, scale: 2 }),
  daysSalesOutstanding: decimal("days_sales_outstanding", { precision: 5, scale: 2 }),
});

export const payerMix = pgTable("payer_mix", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerClass: text("payer_class").notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  amount: decimal("amount", { precision: 10, scale: 2 }),
  accountCount: integer("account_count"),
  avgDaysInAR: decimal("avg_days_in_ar", { precision: 5, scale: 2 }),
});

export const arMetrics = pgTable("ar_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }),
  previousValue: decimal("previous_value", { precision: 10, scale: 2 }),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  target: decimal("target", { precision: 10, scale: 2 }),
  status: text("status").$type<"positive" | "negative" | "neutral">().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertArTrendsSchema = createInsertSchema(arTrends).omit({
  id: true,
});

export const insertArAgingSchema = createInsertSchema(arAging).omit({
  id: true,
  updatedAt: true,
});

export const insertFinancialTrendsSchema = createInsertSchema(financialTrends).omit({
  id: true,
});

export const insertPayerMixSchema = createInsertSchema(payerMix).omit({
  id: true,
});

export const insertArMetricsSchema = createInsertSchema(arMetrics).omit({
  id: true,
  updatedAt: true,
});

// Types
export type ArTrends = typeof arTrends.$inferSelect;
export type InsertArTrends = z.infer<typeof insertArTrendsSchema>;
export type ArAging = typeof arAging.$inferSelect;
export type InsertArAging = z.infer<typeof insertArAgingSchema>;
export type FinancialTrends = typeof financialTrends.$inferSelect;
export type InsertFinancialTrends = z.infer<typeof insertFinancialTrendsSchema>;
export type PayerMix = typeof payerMix.$inferSelect;
export type InsertPayerMix = z.infer<typeof insertPayerMixSchema>;
export type ArMetrics = typeof arMetrics.$inferSelect;
export type InsertArMetrics = z.infer<typeof insertArMetricsSchema>;