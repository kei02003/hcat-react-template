import { pgTable, varchar, decimal, timestamp, text, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Canonical Claims Header - Main claim record
export const canonicalClaimHeaders = pgTable('canonical_claim_headers', {
  claim_key: varchar('claim_key').primaryKey(), // CLM-{org}-{seq}
  org_id: varchar('org_id').notNull(), // Multi-tenant organization scoping
  entity_id: varchar('entity_id'), // Optional entity scoping within org
  
  // Claim identification
  claim_number: varchar('claim_number').notNull(), // External claim number
  patient_account_number: varchar('patient_account_number').notNull(), // Links to billing accounts
  payer_key: varchar('payer_key').notNull(), // Links to canonical payers
  
  // Patient demographics
  patient_name: varchar('patient_name').notNull(),
  patient_dob: varchar('patient_dob'), // YYYY-MM-DD format
  patient_gender: varchar('patient_gender'), // M, F, U
  patient_id: varchar('patient_id'), // MRN or patient identifier
  
  // Service details
  service_date_from: varchar('service_date_from').notNull(), // YYYY-MM-DD
  service_date_to: varchar('service_date_to'), // YYYY-MM-DD
  admission_date: varchar('admission_date'), // For inpatient claims
  discharge_date: varchar('discharge_date'), // For inpatient claims
  
  // Financial totals
  total_charge_amount: decimal('total_charge_amount', { precision: 10, scale: 2 }).notNull(),
  total_paid_amount: decimal('total_paid_amount', { precision: 10, scale: 2 }).default('0.00'),
  total_adjustment_amount: decimal('total_adjustment_amount', { precision: 10, scale: 2 }).default('0.00'),
  
  // Claim type and status
  claim_type: varchar('claim_type').notNull(), // institutional, professional, dental, pharmacy
  bill_type: varchar('bill_type'), // UB-04 bill type (e.g., 111, 121, 131)
  claim_frequency: varchar('claim_frequency').default('1'), // 1=original, 7=replacement, 8=void
  
  // Provider information
  rendering_provider_npi: varchar('rendering_provider_npi'),
  rendering_provider_name: varchar('rendering_provider_name'),
  billing_provider_npi: varchar('billing_provider_npi').notNull(),
  billing_provider_name: varchar('billing_provider_name').notNull(),
  
  // Facility information
  facility_name: varchar('facility_name'),
  facility_npi: varchar('facility_npi'),
  place_of_service: varchar('place_of_service'), // CMS place of service codes
  
  // Submission tracking
  original_submission_date: timestamp('original_submission_date').notNull(),
  current_submission_date: timestamp('current_submission_date').notNull(),
  clearinghouse: varchar('clearinghouse'), // Claims clearinghouse used
  
  // Status and processing
  current_status: varchar('current_status').notNull(), // submitted, processed, paid, denied, pending
  status_date: timestamp('status_date').notNull(),
  processing_note: text('processing_note'),
  
  // Authorization and eligibility
  prior_auth_number: varchar('prior_auth_number'),
  eligibility_verified: boolean('eligibility_verified').default(false),
  eligibility_verified_date: timestamp('eligibility_verified_date'),
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Canonical Claim Lines - Individual line items within claims
export const canonicalClaimLines = pgTable('canonical_claim_lines', {
  line_key: varchar('line_key').primaryKey(), // CLM-LINE-{org}-{seq}
  claim_key: varchar('claim_key').notNull(), // Links to claim header
  org_id: varchar('org_id').notNull(),
  
  // Line identification
  line_number: integer('line_number').notNull(), // Sequential line number within claim
  revenue_code: varchar('revenue_code'), // UB-04 revenue codes (e.g., 0450, 0636)
  
  // Procedure information
  procedure_code: varchar('procedure_code').notNull(), // CPT/HCPCS code
  procedure_description: varchar('procedure_description'),
  modifier_1: varchar('modifier_1'), // CPT modifiers
  modifier_2: varchar('modifier_2'),
  modifier_3: varchar('modifier_3'),
  modifier_4: varchar('modifier_4'),
  
  // Service details
  service_date: varchar('service_date').notNull(), // YYYY-MM-DD
  units: decimal('units', { precision: 8, scale: 2 }).notNull(),
  unit_type: varchar('unit_type'), // UN=units, MJ=minutes, ML=miles, etc.
  
  // Financial details
  charge_amount: decimal('charge_amount', { precision: 10, scale: 2 }).notNull(),
  allowed_amount: decimal('allowed_amount', { precision: 10, scale: 2 }),
  paid_amount: decimal('paid_amount', { precision: 10, scale: 2 }).default('0.00'),
  adjustment_amount: decimal('adjustment_amount', { precision: 10, scale: 2 }).default('0.00'),
  
  // Line status
  line_status: varchar('line_status').notNull(), // approved, denied, suspended, pending
  denial_reason_code: varchar('denial_reason_code'), // CARC codes
  denial_reason_description: varchar('denial_reason_description'),
  remark_code: varchar('remark_code'), // RARC codes
  
  // Provider for this line
  rendering_provider_npi: varchar('rendering_provider_npi'),
  rendering_provider_name: varchar('rendering_provider_name'),
  
  // Diagnosis pointers
  diagnosis_pointer_1: varchar('diagnosis_pointer_1'), // Points to diagnosis on claim
  diagnosis_pointer_2: varchar('diagnosis_pointer_2'),
  diagnosis_pointer_3: varchar('diagnosis_pointer_3'),
  diagnosis_pointer_4: varchar('diagnosis_pointer_4'),
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Canonical Claim Status - Status tracking and workflow
export const canonicalClaimStatus = pgTable('canonical_claim_status', {
  status_key: varchar('status_key').primaryKey(), // CLM-STATUS-{org}-{seq}
  claim_key: varchar('claim_key').notNull(),
  org_id: varchar('org_id').notNull(),
  
  // Status details
  status_code: varchar('status_code').notNull(), // submitted, acknowledged, processed, paid, denied
  status_description: varchar('status_description').notNull(),
  status_date: timestamp('status_date').notNull(),
  effective_date: timestamp('effective_date').notNull(),
  
  // Processing details
  clearinghouse_status: varchar('clearinghouse_status'), // accepted, rejected, forwarded
  payer_status: varchar('payer_status'), // received, processing, finalized
  processing_note: text('processing_note'),
  
  // Response tracking
  response_received: boolean('response_received').default(false),
  response_date: timestamp('response_date'),
  response_type: varchar('response_type'), // 277, 835, correspondence
  
  // Staff tracking
  assigned_to: varchar('assigned_to'), // Staff member handling this status
  priority_level: varchar('priority_level').default('normal'), // low, normal, high, urgent
  
  // Follow-up tracking
  follow_up_required: boolean('follow_up_required').default(false),
  follow_up_date: timestamp('follow_up_date'),
  days_in_status: integer('days_in_status'),
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Canonical Remittance - Payment and adjustment details from payers
export const canonicalRemittance = pgTable('canonical_remittance', {
  remittance_key: varchar('remittance_key').primaryKey(), // RMT-{org}-{seq}
  claim_key: varchar('claim_key').notNull(),
  org_id: varchar('org_id').notNull(),
  
  // Remittance identification
  remittance_advice_number: varchar('remittance_advice_number').notNull(), // ERA/835 number
  check_number: varchar('check_number'), // Physical check number if applicable
  check_date: varchar('check_date'), // YYYY-MM-DD
  
  // Payment details
  payment_method: varchar('payment_method').notNull(), // ACH, check, EFT, card
  payment_amount: decimal('payment_amount', { precision: 10, scale: 2 }).notNull(),
  payment_date: varchar('payment_date').notNull(), // YYYY-MM-DD
  
  // Adjustment details
  adjustment_reason_code: varchar('adjustment_reason_code'), // CARC codes
  adjustment_amount: decimal('adjustment_amount', { precision: 10, scale: 2 }).default('0.00'),
  adjustment_description: varchar('adjustment_description'),
  
  // Contractual details
  contractual_amount: decimal('contractual_amount', { precision: 10, scale: 2 }).default('0.00'),
  deductible_amount: decimal('deductible_amount', { precision: 10, scale: 2 }).default('0.00'),
  coinsurance_amount: decimal('coinsurance_amount', { precision: 10, scale: 2 }).default('0.00'),
  copay_amount: decimal('copay_amount', { precision: 10, scale: 2 }).default('0.00'),
  
  // Processing details
  processing_date: timestamp('processing_date').notNull(),
  posted_date: timestamp('posted_date'),
  posted_by: varchar('posted_by'), // Staff member who posted payment
  
  // Reference information
  claim_control_number: varchar('claim_control_number'), // Payer's internal claim number
  patient_responsibility: decimal('patient_responsibility', { precision: 10, scale: 2 }).default('0.00'),
  
  // Quality and audit
  remittance_source: varchar('remittance_source'), // electronic, paper, phone
  verification_status: varchar('verification_status').default('pending'), // pending, verified, exception
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Canonical Prior Authorization - Pre-approval tracking
export const canonicalPriorAuth = pgTable('canonical_prior_auth', {
  auth_key: varchar('auth_key').primaryKey(), // AUTH-{org}-{seq}
  org_id: varchar('org_id').notNull(),
  entity_id: varchar('entity_id'),
  
  // Authorization identification
  auth_number: varchar('auth_number'), // Payer-issued auth number (null for denied auths)
  reference_number: varchar('reference_number'), // Internal reference
  payer_key: varchar('payer_key').notNull(),
  
  // Patient information
  patient_name: varchar('patient_name').notNull(),
  patient_id: varchar('patient_id').notNull(), // MRN
  patient_dob: varchar('patient_dob'),
  
  // Service details
  procedure_code: varchar('procedure_code').notNull(),
  procedure_description: varchar('procedure_description'),
  diagnosis_code: varchar('diagnosis_code').notNull(),
  diagnosis_description: varchar('diagnosis_description'),
  
  // Authorization details
  auth_status: varchar('auth_status').notNull(), // pending, approved, denied, expired
  auth_type: varchar('auth_type').notNull(), // initial, modification, extension
  units_requested: integer('units_requested'),
  units_approved: integer('units_approved'),
  
  // Date tracking
  request_date: varchar('request_date').notNull(), // YYYY-MM-DD
  approval_date: varchar('approval_date'), // YYYY-MM-DD
  effective_date: varchar('effective_date'), // YYYY-MM-DD
  expiration_date: varchar('expiration_date'), // YYYY-MM-DD
  
  // Provider information
  requesting_provider_npi: varchar('requesting_provider_npi').notNull(),
  requesting_provider_name: varchar('requesting_provider_name').notNull(),
  
  // Clinical information
  clinical_notes: text('clinical_notes'),
  medical_necessity: text('medical_necessity'),
  supporting_documentation: jsonb('supporting_documentation'), // Array of document references
  
  // Processing tracking
  reviewer_name: varchar('reviewer_name'),
  review_date: timestamp('review_date'),
  denial_reason: text('denial_reason'),
  appeal_deadline: varchar('appeal_deadline'), // YYYY-MM-DD
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Canonical Eligibility - Insurance coverage verification
export const canonicalEligibility = pgTable('canonical_eligibility', {
  eligibility_key: varchar('eligibility_key').primaryKey(), // ELIG-{org}-{seq}
  org_id: varchar('org_id').notNull(),
  
  // Patient and payer information
  patient_id: varchar('patient_id').notNull(),
  patient_name: varchar('patient_name').notNull(),
  patient_dob: varchar('patient_dob'),
  payer_key: varchar('payer_key').notNull(),
  
  // Insurance details
  member_id: varchar('member_id').notNull(),
  group_number: varchar('group_number'),
  plan_name: varchar('plan_name'),
  policy_number: varchar('policy_number'),
  
  // Verification details
  verification_date: varchar('verification_date').notNull(), // YYYY-MM-DD
  verification_method: varchar('verification_method').notNull(), // electronic, phone, portal
  verification_status: varchar('verification_status').notNull(), // active, inactive, terminated
  
  // Coverage information
  effective_date: varchar('effective_date'), // YYYY-MM-DD
  termination_date: varchar('termination_date'), // YYYY-MM-DD
  copay_amount: decimal('copay_amount', { precision: 10, scale: 2 }),
  deductible_amount: decimal('deductible_amount', { precision: 10, scale: 2 }),
  deductible_met: decimal('deductible_met', { precision: 10, scale: 2 }),
  out_of_pocket_max: decimal('out_of_pocket_max', { precision: 10, scale: 2 }),
  out_of_pocket_met: decimal('out_of_pocket_met', { precision: 10, scale: 2 }),
  
  // Benefit details
  coverage_type: varchar('coverage_type'), // medical, dental, vision, pharmacy
  network_status: varchar('network_status'), // in-network, out-of-network, unknown
  prior_auth_required: boolean('prior_auth_required').default(false),
  referral_required: boolean('referral_required').default(false),
  
  // Additional coverage
  secondary_insurance: boolean('secondary_insurance').default(false),
  coordination_of_benefits: varchar('coordination_of_benefits'), // primary, secondary, tertiary
  
  // Staff tracking
  verified_by: varchar('verified_by').notNull(),
  verification_notes: text('verification_notes'),
  
  // Audit fields
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Zod schemas for validation
export const insertClaimHeaderSchema = createInsertSchema(canonicalClaimHeaders);
export const insertClaimLineSchema = createInsertSchema(canonicalClaimLines);
export const insertClaimStatusSchema = createInsertSchema(canonicalClaimStatus);
export const insertRemittanceSchema = createInsertSchema(canonicalRemittance);
export const insertPriorAuthSchema = createInsertSchema(canonicalPriorAuth);
export const insertEligibilitySchema = createInsertSchema(canonicalEligibility);

// TypeScript types
export type InsertClaimHeader = z.infer<typeof insertClaimHeaderSchema>;
export type InsertClaimLine = z.infer<typeof insertClaimLineSchema>;
export type InsertClaimStatus = z.infer<typeof insertClaimStatusSchema>;
export type InsertRemittance = z.infer<typeof insertRemittanceSchema>;
export type InsertPriorAuth = z.infer<typeof insertPriorAuthSchema>;
export type InsertEligibility = z.infer<typeof insertEligibilitySchema>;

export type SelectClaimHeader = typeof canonicalClaimHeaders.$inferSelect;
export type SelectClaimLine = typeof canonicalClaimLines.$inferSelect;
export type SelectClaimStatus = typeof canonicalClaimStatus.$inferSelect;
export type SelectRemittance = typeof canonicalRemittance.$inferSelect;
export type SelectPriorAuth = typeof canonicalPriorAuth.$inferSelect;
export type SelectEligibility = typeof canonicalEligibility.$inferSelect;