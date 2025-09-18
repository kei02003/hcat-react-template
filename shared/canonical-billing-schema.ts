import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, integer, timestamp, boolean, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Core Transaction Model - Health Catalyst canonical structure
export const transactions = pgTable("transactions", {
  transaction_key: varchar("transaction_key").primaryKey().default(sql`gen_random_uuid()`),
  billing_account_key: varchar("billing_account_key").notNull(),
  encounter_key: varchar("encounter_key"),
  patient_key: varchar("patient_key").notNull(),
  performing_provider_key: varchar("performing_provider_key"),
  billing_provider_key: varchar("billing_provider_key"),
  payer_key: varchar("payer_key").notNull(),
  benefit_plan_key: varchar("benefit_plan_key"),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  
  // Financial details
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  quantity: decimal("quantity", { precision: 8, scale: 2 }).default('1'),
  
  // Transaction classification
  type_code: text("type_code").notNull(), // charge, adjustment, payment
  currency_code: text("currency_code").default('USD'),
  financial_class_code: text("financial_class_code").notNull(), // commercial, medicare, medicaid, selfpay
  
  // Procedure/Service codes
  cpt_code: text("cpt_code"),
  hcpcs_code: text("hcpcs_code"),
  ndc_code: text("ndc_code"),
  ubrev_code: text("ubrev_code"),
  cpt_modifiers: text("cpt_modifiers"),
  
  // Dates
  service_date: date("service_date").notNull(),
  post_date: date("post_date").notNull(),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('billing_system'),
});

// Billing Account Model - Health Catalyst canonical structure
export const accounts = pgTable("accounts", {
  billing_account_key: varchar("billing_account_key").primaryKey().default(sql`gen_random_uuid()`),
  patient_key: varchar("patient_key").notNull(),
  primary_encounter_key: varchar("primary_encounter_key"),
  primary_payer_key: varchar("primary_payer_key").notNull(),
  primary_benefit_plan_key: varchar("primary_benefit_plan_key"),
  attending_provider_key: varchar("attending_provider_key"),
  billing_location_key: varchar("billing_location_key"),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  
  // Account status
  status_code: text("status_code").notNull(), // open, closed, error, combined
  billing_status_code: text("billing_status_code").notNull(), // open, closed, billed, voided
  financial_class_code: text("financial_class_code").notNull(),
  
  // Encounter classification
  class_code: text("class_code").notNull(), // inpatient, outpatient, emergency
  admit_source_code: text("admit_source_code"),
  admit_priority_code: text("admit_priority_code"),
  discharge_disposition_code: text("discharge_disposition_code"),
  
  // Financial summary
  current_balance: decimal("current_balance", { precision: 12, scale: 2 }).default('0'),
  total_charges: decimal("total_charges", { precision: 12, scale: 2 }).default('0'),
  total_payments: decimal("total_payments", { precision: 12, scale: 2 }).default('0'),
  total_adjustments: decimal("total_adjustments", { precision: 12, scale: 2 }).default('0'),
  
  // Key dates
  admit_datetime: timestamp("admit_datetime"),
  discharge_datetime: timestamp("discharge_datetime"),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('billing_system'),
});

// Enhanced Payer Model
export const payers = pgTable("payers", {
  payer_key: varchar("payer_key").primaryKey().default(sql`gen_random_uuid()`),
  payer_name: text("payer_name").notNull(),
  financial_class_code: text("financial_class_code").notNull(),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  
  // Additional payer details
  payer_type: text("payer_type"), // government, commercial, managed_care
  contact_info: text("contact_info"),
  electronic_filing: boolean("electronic_filing").default(true),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('billing_system'),
});

// Benefit Plan Model
export const benefit_plans = pgTable("benefit_plans", {
  benefit_plan_key: varchar("benefit_plan_key").primaryKey().default(sql`gen_random_uuid()`),
  payer_key: varchar("payer_key").notNull(),
  plan_name: text("plan_name").notNull(),
  coverage_type_code: text("coverage_type_code").notNull(), // HMO, PPO, EPO, Indemnity
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  
  // Plan details
  effective_date: date("effective_date"),
  termination_date: date("termination_date"),
  is_active: boolean("is_active").default(true),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('billing_system'),
});

// Procedure Model
export const procedures = pgTable("procedures", {
  procedure_key: varchar("procedure_key").primaryKey().default(sql`gen_random_uuid()`),
  patient_key: varchar("patient_key").notNull(),
  billing_account_key: varchar("billing_account_key").notNull(),
  performing_provider_key: varchar("performing_provider_key"),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  
  // Procedure details
  procedure_rank: integer("procedure_rank"),
  is_principal: boolean("is_principal").default(false),
  category_code: text("category_code"), // surgical, diagnostic, therapeutic
  
  // Coding
  cpt_code: text("cpt_code"),
  local_code: text("local_code"),
  icd_code: text("icd_code"),
  
  // Dates
  performed_datetime: timestamp("performed_datetime"),
  recorded_datetime: timestamp("recorded_datetime").defaultNow(),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('clinical_system'),
});

// Diagnosis Model
export const diagnoses = pgTable("diagnoses", {
  diagnosis_key: varchar("diagnosis_key").primaryKey().default(sql`gen_random_uuid()`),
  billing_account_key: varchar("billing_account_key").notNull(),
  patient_key: varchar("patient_key").notNull(),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  
  // Diagnosis details
  diagnosis_rank: integer("diagnosis_rank"),
  is_principal: boolean("is_principal").default(false),
  
  // Coding
  local_code: text("local_code"),
  icd_code: text("icd_code").notNull(),
  use_code: text("use_code"), // admit, working, final
  present_on_admit_code: text("present_on_admit_code"), // Y, N, U, W
  
  // Dates
  diagnosis_datetime: timestamp("diagnosis_datetime"),
  recorded_datetime: timestamp("recorded_datetime").defaultNow(),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('clinical_system'),
});

// Enhanced Denial Remark Model (linking to canonical transactions)
export const denial_remarks = pgTable("denial_remarks", {
  denial_remark_key: varchar("denial_remark_key").primaryKey().default(sql`gen_random_uuid()`),
  transaction_key: varchar("transaction_key").notNull(),
  
  // Multi-tenant support
  org_id: varchar("org_id").notNull(),
  entity_id: varchar("entity_id").notNull(),
  
  // Denial details
  active: boolean("active").default(true),
  is_preventable: boolean("is_preventable").default(false),
  external_code: text("external_code"), // CARC/RARC codes
  
  // Classification
  status_code: text("status_code").notNull(), // active, resolved, appealed
  type_code: text("type_code").notNull(), // denial, remark, adjustment
  category_code: text("category_code").notNull(), // medical_necessity, authorization, coding
  
  // Processing details
  received_datetime: timestamp("received_datetime").notNull(),
  resolved_datetime: timestamp("resolved_datetime"),
  
  // Appeal tracking
  appeal_status: text("appeal_status"), // pending, submitted, approved, denied
  appeal_deadline: date("appeal_deadline"),
  appeal_submitted_date: date("appeal_submitted_date"),
  
  // Metadata
  meta_updated: timestamp("meta_updated").defaultNow(),
  meta_created: timestamp("meta_created").defaultNow(),
  meta_source: text("meta_source").default('era_processing'),
});

// Insert schemas
export const insertTransactionSchema = createInsertSchema(transactions).omit({
  transaction_key: true,
  meta_updated: true,
  meta_created: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  billing_account_key: true,
  meta_updated: true,
  meta_created: true,
});

export const insertPayerSchema = createInsertSchema(payers).omit({
  payer_key: true,
  meta_updated: true,
  meta_created: true,
});

export const insertBenefitPlanSchema = createInsertSchema(benefit_plans).omit({
  benefit_plan_key: true,
  meta_updated: true,
  meta_created: true,
});

export const insertProcedureSchema = createInsertSchema(procedures).omit({
  procedure_key: true,
  meta_updated: true,
  meta_created: true,
  recorded_datetime: true,
});

export const insertDiagnosisSchema = createInsertSchema(diagnoses).omit({
  diagnosis_key: true,
  meta_updated: true,
  meta_created: true,
  recorded_datetime: true,
});

export const insertDenialRemarkSchema = createInsertSchema(denial_remarks).omit({
  denial_remark_key: true,
  meta_updated: true,
  meta_created: true,
});

// Types
export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Account = typeof accounts.$inferSelect;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Payer = typeof payers.$inferSelect;
export type InsertPayer = z.infer<typeof insertPayerSchema>;
export type BenefitPlan = typeof benefit_plans.$inferSelect;
export type InsertBenefitPlan = z.infer<typeof insertBenefitPlanSchema>;
export type Procedure = typeof procedures.$inferSelect;
export type InsertProcedure = z.infer<typeof insertProcedureSchema>;
export type Diagnosis = typeof diagnoses.$inferSelect;
export type InsertDiagnosis = z.infer<typeof insertDiagnosisSchema>;
export type DenialRemark = typeof denial_remarks.$inferSelect;
export type InsertDenialRemark = z.infer<typeof insertDenialRemarkSchema>;