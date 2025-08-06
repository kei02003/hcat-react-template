import { pgTable, varchar, text, integer, decimal, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { sql } from "drizzle-orm";
import { z } from "zod";

export const dischargeLocations = pgTable("discharge_locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  locationName: text("location_name").notNull(),
  systemPoint: text("system_point").notNull(),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }),
  actualValue: decimal("actual_value", { precision: 12, scale: 2 }),
  worseIndicator: boolean("worse_indicator").default(false),
  betterIndicator: boolean("better_indicator").default(false),
  directionOfGood: boolean("direction_of_good").default(false),
  forecastValue: decimal("forecast_value", { precision: 12, scale: 2 }),
  clusterGroup: text("cluster_group"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const financialClassBalances = pgTable("financial_class_balances", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  payerClass: text("payer_class").notNull(),
  hospitalA: decimal("hospital_a", { precision: 12, scale: 2 }),
  hospitalB: decimal("hospital_b", { precision: 12, scale: 2 }),
  hospitalC: decimal("hospital_c", { precision: 12, scale: 2 }),
  hospitalD: decimal("hospital_d", { precision: 12, scale: 2 }),
  totalBalance: decimal("total_balance", { precision: 12, scale: 2 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const agingSubcategories = pgTable("aging_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  ageRange: text("age_range").notNull(), // 0-30, 31-60, 60-90, 120+, 90-120
  percentageBalance: decimal("percentage_balance", { precision: 5, scale: 2 }),
  totalBalance: decimal("total_balance", { precision: 12, scale: 2 }),
  accountCount: integer("account_count"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collectionsMetrics = pgTable("collections_metrics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricName: text("metric_name").notNull(),
  currentValue: decimal("current_value", { precision: 12, scale: 2 }),
  targetValue: decimal("target_value", { precision: 12, scale: 2 }),
  previousValue: decimal("previous_value", { precision: 12, scale: 2 }),
  changePercentage: decimal("change_percentage", { precision: 5, scale: 2 }),
  status: text("status").$type<"positive" | "negative" | "neutral">().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const collectionsActivity = pgTable("collections_activity", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: text("account_id").notNull(),
  patientName: text("patient_name").notNull(),
  currentBalance: decimal("current_balance", { precision: 10, scale: 2 }),
  ageInDays: integer("age_in_days"),
  lastContactDate: timestamp("last_contact_date"),
  nextFollowUpDate: timestamp("next_follow_up_date"),
  collectionStatus: text("collection_status").notNull(), // Active, On Hold, Settled, Legal
  payerClass: text("payer_class").notNull(),
  dischargeLocation: text("discharge_location"),
  assignedCollector: text("assigned_collector"),
  priorityLevel: text("priority_level").$type<"High" | "Medium" | "Low">().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertDischargeLocationsSchema = createInsertSchema(dischargeLocations).omit({
  id: true,
  updatedAt: true,
});

export const insertFinancialClassBalancesSchema = createInsertSchema(financialClassBalances).omit({
  id: true,
  updatedAt: true,
});

export const insertAgingSubcategoriesSchema = createInsertSchema(agingSubcategories).omit({
  id: true,
  updatedAt: true,
});

export const insertCollectionsMetricsSchema = createInsertSchema(collectionsMetrics).omit({
  id: true,
  updatedAt: true,
});

export const insertCollectionsActivitySchema = createInsertSchema(collectionsActivity).omit({
  id: true,
  updatedAt: true,
});

// Types
export type DischargeLocations = typeof dischargeLocations.$inferSelect;
export type InsertDischargeLocations = z.infer<typeof insertDischargeLocationsSchema>;
export type FinancialClassBalances = typeof financialClassBalances.$inferSelect;
export type InsertFinancialClassBalances = z.infer<typeof insertFinancialClassBalancesSchema>;
export type AgingSubcategories = typeof agingSubcategories.$inferSelect;
export type InsertAgingSubcategories = z.infer<typeof insertAgingSubcategoriesSchema>;
export type CollectionsMetrics = typeof collectionsMetrics.$inferSelect;
export type InsertCollectionsMetrics = z.infer<typeof insertCollectionsMetricsSchema>;
export type CollectionsActivity = typeof collectionsActivity.$inferSelect;
export type InsertCollectionsActivity = z.infer<typeof insertCollectionsActivitySchema>;