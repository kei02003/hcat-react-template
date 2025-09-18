import { pgTable, text, timestamp, boolean, jsonb, decimal, primaryKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Base metric definitions table
export const metric = pgTable("metric", {
  metric_key: text("metric_key").primaryKey(),
  metric: text("metric").notNull(),
  metric_description: text("metric_description").notNull(),
  tags: jsonb("tags").$type<string[]>()
});

// Version-specific metric definitions table
export const metric_version = pgTable("metric_version", {
  metric_version_key: text("metric_version_key").primaryKey(),
  metric_key: text("metric_key").notNull().references(() => metric.metric_key),
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
export const result = pgTable("result", {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys").$type<Record<string, string>>().notNull(),
  metric_version_key: text("metric_version_key").notNull().references(() => metric_version.metric_version_key),
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
export const staging_result = pgTable("staging_result", {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys").$type<Record<string, string>>().notNull(),
  metric_version_key: text("metric_version_key").notNull().references(() => metric_version.metric_version_key),
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
export const metric_lineage = pgTable("metric_lineage", {
  parent_result_key: text("parent_result_key").notNull().references(() => result.result_key),
  child_result_key: text("child_result_key").notNull().references(() => result.result_key),
  contribution_weight: decimal("contribution_weight", { precision: 5, scale: 4 })
}, (table) => ({
  pk: primaryKey(table.parent_result_key, table.child_result_key)
}));

// Insert schemas with validation
export const insertMetricSchema = createInsertSchema(metric);

export const insertMetricVersionSchema = createInsertSchema(metric_version).omit({
  created_datetime: true,
  updated_datetime: true
}).extend({
  domain: z.enum(["Clinical", "Financial", "Operational", "Regulatory", "Quality"]),
  result_type: z.enum(["numeric", "percentage", "currency", "count", "ratio", "text", "boolean", "datetime", "json"]).optional(),
  frequency: z.enum(["real-time", "daily", "weekly", "monthly", "quarterly", "annually"]).optional()
});

// Ensure exactly one result value is populated and org_id is required in grain_keys
export const insertResultSchema = createInsertSchema(result).refine(
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

export const insertStagingResultSchema = createInsertSchema(staging_result).refine(
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

export const insertMetricLineageSchema = createInsertSchema(metric_lineage);

// Types
export type Metric = typeof metric.$inferSelect;
export type MetricVersion = typeof metric_version.$inferSelect;
export type Result = typeof result.$inferSelect;
export type StagingResult = typeof staging_result.$inferSelect;
export type MetricLineage = typeof metric_lineage.$inferSelect;

export type InsertMetric = z.infer<typeof insertMetricSchema>;
export type InsertMetricVersion = z.infer<typeof insertMetricVersionSchema>;
export type InsertResult = z.infer<typeof insertResultSchema>;
export type InsertStagingResult = z.infer<typeof insertStagingResultSchema>;
export type InsertMetricLineage = z.infer<typeof insertMetricLineageSchema>;

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
export const getResultValue = (result: Result) => {
  if (result.result_value_numeric !== null) return result.result_value_numeric;
  if (result.result_value_datetime !== null) return result.result_value_datetime;
  if (result.result_value_text !== null) return result.result_value_text;
  if (result.result_value_boolean !== null) return result.result_value_boolean;
  if (result.result_value_json !== null) return result.result_value_json;
  return null;
};

// Metric domains (standardized)
export const METRIC_DOMAINS = {
  CLINICAL: "Clinical",
  FINANCIAL: "Financial", 
  OPERATIONAL: "Operational",
  REGULATORY: "Regulatory",
  QUALITY: "Quality"
} as const;

// Result types
export const RESULT_TYPES = {
  NUMERIC: "numeric",
  PERCENTAGE: "percentage", 
  CURRENCY: "currency",
  COUNT: "count",
  RATIO: "ratio",
  TEXT: "text",
  BOOLEAN: "boolean",
  DATETIME: "datetime",
  JSON: "json"
} as const;

// Frequency types
export const FREQUENCIES = {
  REAL_TIME: "real-time",
  DAILY: "daily",
  WEEKLY: "weekly", 
  MONTHLY: "monthly",
  QUARTERLY: "quarterly",
  ANNUALLY: "annually"
} as const;