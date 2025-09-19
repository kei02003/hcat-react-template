// Import from consolidated schema instead of old canonical-metric-schema
import { 
  type CanonicalMetric,
  type CanonicalMetricVersion, 
  type CanonicalResult,
  type CanonicalStagingResult,
  type CanonicalMetricLineage,
  type InsertCanonicalResult,
  type InsertCanonicalStagingResult,
  type InsertCanonicalMetricLineage,
  canonicalMetric,
  canonicalMetricVersion,
  canonicalResult,
  createGrainKey as createSchemaGrainKey
} from "@shared/schema";

// Constants moved here to avoid duplication
export const METRIC_DOMAINS = {
  REVENUE_CYCLE: "revenue_cycle",
  CLINICAL: "clinical", 
  OPERATIONAL: "operational",
  FINANCIAL: "financial",
  COMPLIANCE: "compliance",
  QUALITY: "quality",
  REGULATORY: "regulatory"
} as const;

export const RESULT_TYPES = {
  NUMERIC: "numeric",
  TEXT: "text", 
  BOOLEAN: "boolean",
  DATETIME: "datetime",
  JSON: "json",
  CURRENCY: "currency",
  PERCENTAGE: "percentage"
} as const;

export const FREQUENCIES = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly", 
  QUARTERLY: "quarterly",
  ANNUAL: "annual"
} as const;

export function createGrainKey(parts: Record<string, string>): string {
  return Object.entries(parts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join('|');
}

// Use new schema types
type InsertMetric = typeof canonicalMetric.$inferInsert;
type InsertMetricVersion = typeof canonicalMetricVersion.$inferInsert; 
type InsertResult = typeof canonicalResult.$inferInsert;

// Core Revenue Cycle Metrics based on Health Catalyst standards
export const CANONICAL_METRICS: InsertMetric[] = [
  {
    metric_key: "total_ar_hc",
    metric: "Total Accounts Receivable",
    metric_description: "Total outstanding receivables across all payers and entities",
    tags: ["revenue_cycle", "financial", "ar_management"]
  },
  {
    metric_key: "ar_days_outstanding_hc", 
    metric: "AR Days Outstanding",
    metric_description: "Average number of days claims remain outstanding in accounts receivable",
    tags: ["revenue_cycle", "financial", "ar_management", "cycle_time"]
  },
  {
    metric_key: "denial_rate_hc",
    metric: "Denial Rate", 
    metric_description: "Percentage of claims denied by payers",
    tags: ["revenue_cycle", "clinical", "quality", "denial_management"]
  },
  {
    metric_key: "appeal_success_rate_hc",
    metric: "Appeal Success Rate",
    metric_description: "Percentage of appeals that result in overturned denials and payment",
    tags: ["revenue_cycle", "clinical", "appeal_management"]
  },
  {
    metric_key: "clean_claim_rate_hc",
    metric: "Clean Claim Rate",
    metric_description: "Percentage of claims submitted without errors requiring rework",
    tags: ["revenue_cycle", "operational", "quality"]
  },
  {
    metric_key: "collection_rate_hc",
    metric: "Collection Rate", 
    metric_description: "Percentage of billed amounts successfully collected",
    tags: ["revenue_cycle", "financial"]
  },
  {
    metric_key: "timely_filing_rate_hc",
    metric: "Timely Filing Rate",
    metric_description: "Percentage of claims filed within payer deadlines",
    tags: ["revenue_cycle", "operational", "compliance"]
  },
  {
    metric_key: "documentation_request_volume_hc",
    metric: "Documentation Request Volume", 
    metric_description: "Total number of additional documentation requests from payers",
    tags: ["revenue_cycle", "clinical", "documentation"]
  },
  {
    metric_key: "redundant_documentation_rate_hc",
    metric: "Redundant Documentation Rate",
    metric_description: "Percentage of documentation requests that are redundant or previously submitted",
    tags: ["revenue_cycle", "operational", "efficiency"]
  },
  {
    metric_key: "days_sales_outstanding_hc",
    metric: "Days Sales Outstanding", 
    metric_description: "Average number of days to collect receivables",
    tags: ["revenue_cycle", "financial", "cash_flow"]
  },
  // Operational Efficiency Metrics
  {
    metric_key: "clean_claim_first_pass_rate_hc",
    metric: "Clean Claim First-Pass Rate",
    metric_description: "Percentage of claims processed without errors or rework on first submission",
    tags: ["operational", "efficiency", "quality", "claims_processing"]
  },
  {
    metric_key: "days_to_final_bill_hc",
    metric: "Days to Final Bill",
    metric_description: "Average number of days from service date to final bill generation",
    tags: ["operational", "efficiency", "billing_cycle", "dnfb"]
  },
  {
    metric_key: "cash_posting_lag_hc",
    metric: "Cash Posting Lag",
    metric_description: "Average days between payment receipt and posting to patient accounts",
    tags: ["operational", "efficiency", "cash_management", "posting"]
  },
  {
    metric_key: "documentation_tat_hc",
    metric: "Documentation Turnaround Time",
    metric_description: "Average days to respond to payer documentation requests",
    tags: ["operational", "efficiency", "documentation", "response_time"]
  },
  {
    metric_key: "electronic_filing_adoption_hc",
    metric: "Electronic Filing Adoption Rate",
    metric_description: "Percentage of claims filed electronically versus paper/fax",
    tags: ["operational", "efficiency", "automation", "edi"]
  },
  // AR Aging & Cash Flow Metrics
  {
    metric_key: "aged_ar_30_days_hc",
    metric: "Aged A/R > 30 days",
    metric_description: "Total accounts receivable outstanding for more than 30 days",
    tags: ["financial", "ar_aging", "cash_flow", "collections"]
  },
  {
    metric_key: "aged_ar_120_days_hc", 
    metric: "Aged A/R > 120 days",
    metric_description: "Total accounts receivable outstanding for more than 120 days",
    tags: ["financial", "ar_aging", "cash_flow", "collections", "high_risk"]
  },
  {
    metric_key: "days_in_ar_dollars_hc",
    metric: "Days in Account Dollars in AR",
    metric_description: "Average number of days accounts receivable dollars have been outstanding",
    tags: ["financial", "ar_aging", "cycle_time", "performance"]
  },
  {
    metric_key: "days_cash_drgs_hc",
    metric: "Days Cash Dollars DRGs", 
    metric_description: "Days from discharge to cash collection for DRG-based payments",
    tags: ["financial", "cash_flow", "cycle_time", "drg", "inpatient"]
  },
  {
    metric_key: "gross_cash_collection_hc",
    metric: "Gross Cash Collection",
    metric_description: "Total gross cash collected across all payment sources",
    tags: ["financial", "cash_flow", "collections", "gross_revenue"]
  },
  {
    metric_key: "net_cash_collection_hc",
    metric: "Net Cash Collection", 
    metric_description: "Net cash collected after contractual adjustments and write-offs",
    tags: ["financial", "cash_flow", "collections", "net_revenue"]
  },
  // DNFB Management Metrics
  {
    metric_key: "discharged_not_final_billed_hc",
    metric: "Discharged Not Final Billed (DNFB)",
    metric_description: "Total value of discharged accounts not yet final billed",
    tags: ["operational", "billing", "dnfb", "cycle_time", "revenue_cycle"]
  },
  {
    metric_key: "days_discharged_dnfb_hc",
    metric: "Days Discharged DNFB", 
    metric_description: "Average days from discharge to final bill for DNFB accounts",
    tags: ["operational", "billing", "dnfb", "cycle_time", "turnaround"]
  },
  {
    metric_key: "gross_dnfb_dollars_hc",
    metric: "Gross DNFB Dollars",
    metric_description: "Total gross dollar value of accounts in DNFB status",
    tags: ["financial", "billing", "dnfb", "gross_revenue", "working_capital"]
  },
  // Patient Payment Metrics
  {
    metric_key: "patient_cash_payments_hc",
    metric: "Patient Cash Payments",
    metric_description: "Total cash payments received directly from patients",
    tags: ["financial", "patient_payments", "cash_flow", "self_pay", "collections"]
  },
  {
    metric_key: "copay_collections_hc",
    metric: "Copay Collections",
    metric_description: "Insurance copayment amounts collected from patients",
    tags: ["financial", "patient_payments", "copay", "insurance", "collections"]
  },
  {
    metric_key: "pos_collections_hc",
    metric: "Point of Service Collections",
    metric_description: "Patient payments collected at the time of service delivery",
    tags: ["operational", "patient_payments", "pos", "collections", "access"]
  },
  {
    metric_key: "patient_financial_responsibility_hc",
    metric: "Patient Financial Responsibility",
    metric_description: "Total amount patients are financially responsible for after insurance",
    tags: ["financial", "patient_payments", "responsibility", "deductible", "coinsurance"]
  },
  // Denial Management Metrics
  {
    metric_key: "total_denial_amounts_hc",
    metric: "Total Denial Amounts",
    metric_description: "Total dollar value of claims denied by payers",
    tags: ["operational", "denials", "claims", "payer_relations", "revenue_impact"]
  },
  {
    metric_key: "denial_rate_by_reason_hc",
    metric: "Denial Rate by Reason",
    metric_description: "Percentage of claims denied by specific denial reasons and payer",
    tags: ["quality", "denials", "reason_analysis", "prevention", "patterns"]
  },
  {
    metric_key: "denial_aging_days_hc",
    metric: "Denial Aging Days",
    metric_description: "Average days that denied claims have been outstanding without resolution",
    tags: ["operational", "denials", "aging", "cycle_time", "collections"]
  },
  {
    metric_key: "appeal_volumes_hc",
    metric: "Appeal Volumes",
    metric_description: "Total number of appeals filed for denied claims",
    tags: ["operational", "appeals", "volumes", "workflow", "management"]
  },
  // Financial Performance Metrics
  {
    metric_key: "charity_care_amount_hc",
    metric: "Charity Care Amount",
    metric_description: "Total dollar value of care provided as charity care to qualifying patients",
    tags: ["financial", "charity_care", "uncompensated", "community_benefit", "revenue_impact"]
  },
  {
    metric_key: "uncompensated_care_rate_hc",
    metric: "Uncompensated Care Rate",
    metric_description: "Percentage of total care provided that is uncompensated (bad debt + charity care)",
    tags: ["financial", "uncompensated_care", "charity_care", "bad_debt", "percentage"]
  },
  {
    metric_key: "uninsured_collection_rate_hc",
    metric: "Uninsured Collection Rate",
    metric_description: "Collection success rate for uninsured and self-pay patients",
    tags: ["financial", "uninsured", "self_pay", "collections", "patient_payments"]
  },
  {
    metric_key: "payment_rate_by_payer_hc",
    metric: "Payment Rate by Payer",
    metric_description: "Payment success rate and timing by different payer categories and types",
    tags: ["financial", "payer_performance", "payment_rates", "payer_relations", "benchmarking"]
  },
  {
    metric_key: "charge_lag_days_hc",
    metric: "Charge Lag Days",
    metric_description: "Average time in days from service delivery to charge capture in the billing system",
    tags: ["billing_cycle", "charge_capture", "operational_efficiency", "revenue_timing", "process_metrics"]
  },
  {
    metric_key: "final_bill_processing_time_hc",
    metric: "Final Bill Processing Time", 
    metric_description: "Time from patient discharge to completion of final bill processing and submission",
    tags: ["billing_cycle", "discharge_processing", "final_billing", "operational_efficiency", "process_metrics"]
  }
];

// Metric versions with proper Health Catalyst EDC structure
export const CANONICAL_METRIC_VERSIONS: InsertMetricVersion[] = [
  {
    metric_version_key: "total_ar_hc_v1",
    metric_key: "total_ar_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Total Accounts Receivable - Standard",
    metric_version_description: "Standard calculation of total outstanding accounts receivable aggregated by organization and entity",
    grain: {
      "org_id": "string",
      "entity_id": "string", 
      "payer": "string"
    },
    grain_description: "Organization, facility, and payer level aggregation",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_transactions",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      required_fields: ["org_id", "entity_id", "calculation_date"],
      optional_fields: ["payer", "department", "aging_bucket"]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "ar_days_outstanding_hc_v1",
    metric_key: "ar_days_outstanding_hc",
    version_number: "v1.0", 
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "AR Days Outstanding - Standard",
    metric_version_description: "Standard calculation using weighted average based on outstanding balances",
    grain: {
      "org_id": "string",
      "entity_id": "string"
    },
    grain_description: "Organization and facility level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager", 
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      calculation_method: ["weighted_average"],
      exclude_zero_balances: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "denial_rate_hc_v1",
    metric_key: "denial_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Denial Rate - Clinical Focus",
    metric_version_description: "Clinical denial rate excluding technical and administrative denials",
    grain: {
      "org_id": "string", 
      "entity_id": "string",
      "department": "string",
      "payer": "string"
    },
    grain_description: "Organization, facility, department, and payer level",
    domain: METRIC_DOMAINS.CLINICAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "CMS",
    steward: "Clinical Director",
    developer: "Health Catalyst Platform", 
    is_active: true,
    metadata_schema: {
      exclude_categories: [["technical", "administrative"]],
      include_appeals: [false]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "appeal_success_rate_hc_v1",
    metric_key: "appeal_success_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Appeal Success Rate - All Levels",
    metric_version_description: "Success rate across all appeal levels including first, second, and external review",
    grain: {
      "org_id": "string",
      "entity_id": "string", 
      "appeal_level": "string"
    },
    grain_description: "Organization, facility, and appeal level",
    domain: METRIC_DOMAINS.CLINICAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent", 
    frequency: FREQUENCIES.MONTHLY,
    source_category: "appeal_outcomes",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Clinical Director",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      success_definition: ["payment_received_or_denial_overturned"],
      include_partial_wins: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "clean_claim_rate_hc_v1", 
    metric_key: "clean_claim_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Clean Claim Rate - First Pass",
    metric_version_description: "Percentage of claims accepted on first submission without edits or rejections",
    grain: {
      "org_id": "string",
      "entity_id": "string", 
      "department": "string"
    },
    grain_description: "Organization, facility, and department level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "billing_transactions", 
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Billing Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      rejection_types: [["edit", "denial", "return"]],
      first_pass_only: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "collection_rate_hc_v1",
    metric_key: "collection_rate_hc", 
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Collection Rate - Net",
    metric_version_description: "Net collection rate excluding contractual adjustments and bad debt write-offs",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string"
    },
    grain_description: "Organization, facility, and payer level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "HFMA", 
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      calculation_method: ["net_collections_over_net_charges"],
      exclude_contractuals: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "timely_filing_rate_hc_v1",
    metric_key: "timely_filing_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Timely Filing Rate - Compliance",
    metric_version_description: "Percentage of claims filed within payer-specific deadlines",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "department": "string"
    },
    grain_description: "Organization, facility, payer, and department level",
    domain: METRIC_DOMAINS.REGULATORY,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "CMS",
    steward: "Compliance Officer",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      deadline_source: ["payer_specific_rules"],
      exclude_resubmissions: [false]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  // Operational Efficiency Metric Versions
  {
    metric_version_key: "clean_claim_first_pass_rate_hc_v1",
    metric_key: "clean_claim_first_pass_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Clean Claim First-Pass Rate - Standard",
    metric_version_description: "Percentage of claims processed correctly on first submission without edits, rejections, or rework",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string"
    },
    grain_description: "Organization, facility, and department level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.DAILY,
    source_category: "claims_processing",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Operations Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      clean_criteria: ["no_edits", "no_rejections", "first_pass_acceptance"],
      exclusions: ["resubmissions", "appeals"]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "days_to_final_bill_hc_v1", 
    metric_key: "days_to_final_bill_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Days to Final Bill - DNFB",
    metric_version_description: "Average days from service date to final bill generation (discharged not final billed reduction)",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "bill_type": "string"
    },
    grain_description: "Organization, facility, department, and bill type level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_cycle",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform", 
    is_active: true,
    metadata_schema: {
      calculation_method: ["service_to_final_bill"],
      exclude_holds: ["clinical_holds", "insurance_verification"]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "cash_posting_lag_hc_v1",
    metric_key: "cash_posting_lag_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Cash Posting Lag - Operations",
    metric_version_description: "Average days between payment receipt and posting to patient accounts",
    grain: {
      "org_id": "string", 
      "entity_id": "string",
      "payment_method": "string"
    },
    grain_description: "Organization, facility, and payment method level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "cash_management",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Cash Posting Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      payment_types: ["check", "eft", "credit_card", "cash"],
      business_days_only: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "documentation_tat_hc_v1",
    metric_key: "documentation_tat_hc", 
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Documentation Turnaround Time - Response",
    metric_version_description: "Average days to respond to payer documentation requests",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "document_type": "string"
    },
    grain_description: "Organization, facility, payer, and document type level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "documentation_management",
    is_regulatory: true,
    regulatory_program: "CMS",
    steward: "HIM Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      response_criteria: ["document_submitted", "request_fulfilled"],
      exclude_redundant: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "electronic_filing_adoption_hc_v1",
    metric_key: "electronic_filing_adoption_hc",
    version_number: "v1.0", 
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Electronic Filing Adoption - EDI Rate",
    metric_version_description: "Percentage of claims filed electronically vs. paper/fax/manual methods",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "submission_method": "string"
    },
    grain_description: "Organization, facility, payer, and submission method level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "claims_submission",
    is_regulatory: false,
    regulatory_program: null,
    steward: "EDI Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      electronic_methods: ["edi_837", "clearinghouse", "portal"],
      manual_methods: ["paper", "fax", "manual_entry"]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  // AR Aging & Cash Flow Metric Versions
  {
    metric_version_key: "aged_ar_30_days_hc_v1",
    metric_key: "aged_ar_30_days_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Aged A/R > 30 days - Standard",
    metric_version_description: "Total accounts receivable outstanding for more than 30 days from service date",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "aging_bucket": "string"
    },
    grain_description: "Organization, facility, payer, and aging bucket level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "accounts_receivable",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      aging_categories: ["31-60", "61-90", "91-120", "120+"],
      exclude_zero_balances: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "aged_ar_120_days_hc_v1",
    metric_key: "aged_ar_120_days_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Aged A/R > 120 days - High Risk",
    metric_version_description: "Total accounts receivable outstanding for more than 120 days, considered high collection risk",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "financial_class": "string"
    },
    grain_description: "Organization, facility, payer, and financial class level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "accounts_receivable",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Collections Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      risk_level: ["high", "critical"],
      collection_actions: ["letters", "calls", "agency"]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "days_in_ar_dollars_hc_v1",
    metric_key: "days_in_ar_dollars_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Days in Account Dollars in AR - Weighted",
    metric_version_description: "Weighted average days accounts receivable dollars have been outstanding",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string"
    },
    grain_description: "Organization, facility, and department level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "accounts_receivable",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      calculation_method: ["dollar_weighted_average"],
      exclude_adjustments: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "days_cash_drgs_hc_v1",
    metric_key: "days_cash_drgs_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Days Cash Dollars DRGs - Inpatient Cycle",
    metric_version_description: "Average days from discharge to cash collection for DRG-based inpatient payments",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "drg_code": "string",
      "payer": "string"
    },
    grain_description: "Organization, facility, DRG, and payer level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "cash_collections",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Inpatient Revenue Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      encounter_types: ["inpatient", "observation"],
      payment_types: ["primary", "secondary"]
    },
    required_metadata_fields: ["org_id", "entity_id", "measurement_period"]
  },
  {
    metric_version_key: "gross_cash_collection_hc_v1",
    metric_key: "gross_cash_collection_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Gross Cash Collection - Total",
    metric_version_description: "Total gross cash collected across all payment sources and types",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "payment_type": "string"
    },
    grain_description: "Organization, facility, payer, and payment type level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "cash_collections",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Cash Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      payment_methods: ["check", "eft", "card", "cash"],
      include_patient_payments: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "collection_date"]
  },
  {
    metric_version_key: "net_cash_collection_hc_v1",
    metric_key: "net_cash_collection_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Net Cash Collection - Adjusted",
    metric_version_description: "Net cash collected after contractual adjustments, write-offs, and refunds",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "financial_class": "string"
    },
    grain_description: "Organization, facility, payer, and financial class level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "cash_collections",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      adjustment_types: ["contractual", "write_off", "refund"],
      net_calculation: ["gross_cash_minus_adjustments"]
    },
    required_metadata_fields: ["org_id", "entity_id", "collection_date"]
  },
  // DNFB Management Metric Versions
  {
    metric_version_key: "discharged_not_final_billed_hc_v1",
    metric_key: "discharged_not_final_billed_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Discharged Not Final Billed - Standard",
    metric_version_description: "Total value of discharged patient accounts not yet final billed, excluding voided accounts",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "discharge_disposition": "string"
    },
    grain_description: "Organization, facility, department, and discharge disposition level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_workflow",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      exclude_accounts: ["voided", "combined", "error"],
      billing_status: ["discharged_not_billed", "pending_final_review"]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "days_discharged_dnfb_hc_v1",
    metric_key: "days_discharged_dnfb_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Days Discharged DNFB - Turnaround",
    metric_version_description: "Average days from discharge date to final bill submission for DNFB accounts",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "financial_class": "string"
    },
    grain_description: "Organization, facility, department, and financial class level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_workflow",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Billing Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      calculation_method: ["weighted_average_by_charges"],
      exclude_same_day: [false]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "gross_dnfb_dollars_hc_v1",
    metric_key: "gross_dnfb_dollars_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Gross DNFB Dollars - Working Capital",
    metric_version_description: "Total gross dollar value of accounts in DNFB status representing working capital impact",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "service_line": "string",
      "dnfb_age_bucket": "string"
    },
    grain_description: "Organization, facility, service line, and DNFB age bucket level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_workflow",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "CFO",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      aging_buckets: ["0-3", "4-7", "8-14", "15+"],
      include_charges: ["professional", "facility", "ancillary"]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  // Patient Payment Metric Versions
  {
    metric_version_key: "patient_cash_payments_hc_v1",
    metric_key: "patient_cash_payments_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Patient Cash Payments - Total",
    metric_version_description: "Total cash payments received directly from patients including self-pay and patient responsibility portions",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "financial_class": "string",
      "payment_method": "string"
    },
    grain_description: "Organization, facility, financial class, and payment method level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "payments",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      payment_types: ["cash", "check", "credit_card", "debit_card", "ach"],
      exclude_refunds: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "payment_date"]
  },
  {
    metric_version_key: "copay_collections_hc_v1",
    metric_key: "copay_collections_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Copay Collections - Insurance",
    metric_version_description: "Insurance copayment amounts collected from patients at time of service or post-service",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer_type": "string",
      "collection_timing": "string"
    },
    grain_description: "Organization, facility, payer type, and collection timing level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "payments",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      timing_options: ["pos", "post_service", "statement"],
      payer_categories: ["commercial", "medicare", "medicaid", "other"]
    },
    required_metadata_fields: ["org_id", "entity_id", "payment_date"]
  },
  {
    metric_version_key: "pos_collections_hc_v1",
    metric_key: "pos_collections_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Point of Service Collections - Access",
    metric_version_description: "Patient payments collected at the time of service delivery including copays, deductibles, and self-pay amounts",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "encounter_type": "string"
    },
    grain_description: "Organization, facility, department, and encounter type level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "access_workflow",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Access Services Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      encounter_types: ["outpatient", "emergency", "inpatient", "observation"],
      collection_components: ["copay", "deductible", "coinsurance", "self_pay"]
    },
    required_metadata_fields: ["org_id", "entity_id", "service_date"]
  },
  {
    metric_version_key: "patient_financial_responsibility_hc_v1",
    metric_key: "patient_financial_responsibility_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Patient Financial Responsibility - Total",
    metric_version_description: "Total amount patients are financially responsible for including deductibles, coinsurance, copays, and self-pay portions",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "financial_class": "string",
      "responsibility_type": "string"
    },
    grain_description: "Organization, facility, financial class, and responsibility type level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_workflow",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      responsibility_components: ["deductible", "coinsurance", "copay", "self_pay", "non_covered"],
      include_estimated: [true, false]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  // Denial Management Metric Versions
  {
    metric_version_key: "total_denial_amounts_hc_v1",
    metric_key: "total_denial_amounts_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Total Denial Amounts - Revenue Impact",
    metric_version_description: "Total dollar value of claims denied by payers with breakdown by denial category and payer type",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "denial_category": "string"
    },
    grain_description: "Organization, facility, payer, and denial category level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.DAILY,
    source_category: "claims_workflow",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Denial Management Specialist",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      denial_categories: ["clinical", "administrative", "authorization", "billing", "eligibility"],
      include_pending_appeals: [true, false]
    },
    required_metadata_fields: ["org_id", "entity_id", "denial_date"]
  },
  {
    metric_version_key: "denial_rate_by_reason_hc_v1",
    metric_key: "denial_rate_by_reason_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Denial Rate by Reason - Pattern Analysis",
    metric_version_description: "Percentage of claims denied by specific denial reasons with payer and service line breakdown for prevention analysis",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "denial_reason_code": "string"
    },
    grain_description: "Organization, facility, payer, and denial reason code level",
    domain: METRIC_DOMAINS.QUALITY,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.WEEKLY,
    source_category: "claims_workflow",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Quality Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      reason_categories: ["medical_necessity", "authorization", "coding", "eligibility", "timely_filing"],
      include_soft_denials: [true, false]
    },
    required_metadata_fields: ["org_id", "entity_id", "analysis_period"]
  },
  {
    metric_version_key: "denial_aging_days_hc_v1",
    metric_key: "denial_aging_days_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Denial Aging Days - Collections Timing",
    metric_version_description: "Average days that denied claims have been outstanding without resolution, critical for collections priority",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "denial_category": "string",
      "aging_bucket": "string"
    },
    grain_description: "Organization, facility, denial category, and aging bucket level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "claims_workflow",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Collections Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      aging_buckets: ["0-30", "31-60", "61-90", "91-120", "120+"],
      exclude_appeals_in_progress: [true, false]
    },
    required_metadata_fields: ["org_id", "entity_id", "calculation_date"]
  },
  {
    metric_version_key: "appeal_volumes_hc_v1",
    metric_key: "appeal_volumes_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Appeal Volumes - Workflow Management",
    metric_version_description: "Total number of appeals filed for denied claims with breakdown by appeal level and payer",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer": "string",
      "appeal_level": "string"
    },
    grain_description: "Organization, facility, payer, and appeal level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "count",
    frequency: FREQUENCIES.DAILY,
    source_category: "appeals_workflow",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Appeals Coordinator",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      appeal_levels: ["first_level", "second_level", "third_level", "external_review"],
      include_auto_appeals: [true, false]
    },
    required_metadata_fields: ["org_id", "entity_id", "filing_date"]
  },
  // Financial Performance Metric Versions
  {
    metric_version_key: "charity_care_amount_hc_v1",
    metric_key: "charity_care_amount_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Charity Care Amount - Community Benefit",
    metric_version_description: "Total dollar value of care provided as charity care to qualifying patients based on financial hardship criteria",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "charity_care_category": "string"
    },
    grain_description: "Organization, facility, department, and charity care category level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.CURRENCY,
    result_unit: "dollars",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "financial_assistance",
    is_regulatory: true,
    regulatory_program: "IRS_990",
    steward: "Chief Financial Officer",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      qualification_criteria: ["income_based", "hardship_based", "emergency_care"],
      reporting_requirements: ["irs_990", "community_benefit"]
    },
    required_metadata_fields: ["org_id", "entity_id", "approval_date"]
  },
  {
    metric_version_key: "uncompensated_care_rate_hc_v1",
    metric_key: "uncompensated_care_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Uncompensated Care Rate - Financial Impact",
    metric_version_description: "Percentage of total care provided that is uncompensated including bad debt write-offs and charity care",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "service_line": "string"
    },
    grain_description: "Organization, facility, and service line level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "financial_reporting",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      components: ["charity_care", "bad_debt", "uninsured_discounts"],
      calculation_method: ["uncompensated_over_gross_charges"]
    },
    required_metadata_fields: ["org_id", "entity_id", "reporting_period"]
  },
  {
    metric_version_key: "uninsured_collection_rate_hc_v1",
    metric_key: "uninsured_collection_rate_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Uninsured Collection Rate - Self-Pay Performance",
    metric_version_description: "Collection success rate for uninsured and self-pay patients after financial assistance programs",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "patient_class": "string",
      "collection_agency": "string"
    },
    grain_description: "Organization, facility, patient class, and collection agency level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "patient_collections",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Patient Financial Services Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      patient_classes: ["uninsured", "self_pay", "underinsured"],
      collection_methods: ["internal", "external_agency", "payment_plans"]
    },
    required_metadata_fields: ["org_id", "entity_id", "discharge_date"]
  },
  {
    metric_version_key: "payment_rate_by_payer_hc_v1",
    metric_key: "payment_rate_by_payer_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Payment Rate by Payer - Performance Benchmarking",
    metric_version_description: "Payment success rate and timing analysis by different payer categories for contract negotiation and performance monitoring",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "payer_category": "string",
      "contract_type": "string"
    },
    grain_description: "Organization, facility, payer category, and contract type level",
    domain: METRIC_DOMAINS.FINANCIAL,
    result_type: RESULT_TYPES.PERCENTAGE,
    result_unit: "percent",
    frequency: FREQUENCIES.MONTHLY,
    source_category: "payer_performance",
    is_regulatory: false,
    regulatory_program: null,
    steward: "Payer Relations Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      payer_categories: ["commercial", "government", "managed_care", "workers_comp"],
      contract_types: ["fee_for_service", "capitation", "bundled_payment", "value_based"]
    },
    required_metadata_fields: ["org_id", "entity_id", "contract_effective_date"]
  },
  {
    metric_version_key: "charge_lag_days_hc_v1",
    metric_key: "charge_lag_days_hc",
    version_number: "v1.0",
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Charge Lag Days - Service to Capture",
    metric_version_description: "Average time from service delivery to charge capture in billing system, critical for revenue cycle efficiency",
    grain: {
      "org_id": "string",
      "entity_id": "string",
      "department": "string",
      "service_category": "string"
    },
    grain_description: "Organization, facility, department, and service category level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      service_categories: ["inpatient", "outpatient", "emergency", "surgical", "ancillary"],
      lag_thresholds: ["1_day", "3_days", "7_days"],
      exclude_weekends: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "service_date", "charge_capture_date"]
  },
  {
    metric_version_key: "final_bill_processing_time_hc_v1",
    metric_key: "final_bill_processing_time_hc",
    version_number: "v1.0", 
    valid_from_datetime: new Date("2024-01-01"),
    valid_to_datetime: null,
    metric_version_name: "Final Bill Processing Time - Discharge to Completion",
    metric_version_description: "Time from patient discharge to completion of final bill processing and submission, measuring billing cycle efficiency",
    grain: {
      "org_id": "string",
      "entity_id": "string", 
      "department": "string",
      "patient_class": "string"
    },
    grain_description: "Organization, facility, department, and patient class level",
    domain: METRIC_DOMAINS.OPERATIONAL,
    result_type: RESULT_TYPES.NUMERIC,
    result_unit: "days",
    frequency: FREQUENCIES.DAILY,
    source_category: "billing_transactions",
    is_regulatory: true,
    regulatory_program: "HFMA",
    steward: "Revenue Cycle Manager",
    developer: "Health Catalyst Platform",
    is_active: true,
    metadata_schema: {
      patient_classes: ["inpatient", "outpatient", "emergency", "observation"],
      processing_stages: ["coding_complete", "bill_review", "final_submission"],
      exclude_holds: [true]
    },
    required_metadata_fields: ["org_id", "entity_id", "discharge_date", "final_bill_date"]
  }
];

// Utility function to convert existing metric data to canonical results
export function convertMetricToCanonicalResult(
  metricName: string,
  value: string | number,
  orgId: string,
  entityId?: string,
  additionalGrainKeys?: Record<string, string>,
  measurementPeriodStart?: Date,
  measurementPeriodEnd?: Date
): InsertResult {
  const metricVersionKey = getMetricVersionKeyByName(metricName);
  const resultKey = `${metricVersionKey}-${orgId}-${entityId || 'all'}-${Date.now()}`;
  
  const grainKeys = {
    org_id: orgId,
    entity_id: entityId || 'all',
    ...additionalGrainKeys
  };
  
  // Determine the appropriate result value field based on the metric type
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.-]/g, '')) : value;
  const isPercentage = typeof value === 'string' && value.includes('%');
  const isCurrency = typeof value === 'string' && (value.includes('$') || value.includes('K') || value.includes('M'));
  
  let resultValue: Partial<InsertResult> = {};
  
  if (isCurrency) {
    resultValue.result_value_numeric = numericValue.toString();
  } else if (isPercentage) {
    resultValue.result_value_numeric = numericValue.toString();
  } else if (typeof numericValue === 'number' && !isNaN(numericValue)) {
    resultValue.result_value_numeric = numericValue.toString();
  } else {
    resultValue.result_value_text = value.toString();
  }
  
  return {
    result_key: resultKey,
    grain_keys: grainKeys,
    metric_version_key: metricVersionKey,
    measurement_period_start_datetime: measurementPeriodStart || new Date(),
    measurement_period_end_datetime: measurementPeriodEnd || new Date(),
    as_of_datetime: new Date(),
    calculated_at: new Date(),
    calculation_version: "v1.0",
    result_metadata: {
      source: ["legacy_conversion"],
      original_metric_name: [metricName]
    },
    ...resultValue
  };
}

// Helper function to map legacy metric names to canonical metric version keys
function getMetricVersionKeyByName(metricName: string): string {
  const nameMapping: Record<string, string> = {
    "Total AR": "total_ar_hc_v1",
    "AR Days": "ar_days_outstanding_hc_v1", 
    "AR Days Outstanding": "ar_days_outstanding_hc_v1",
    "Days Sales Outstanding": "days_sales_outstanding_hc_v1",
    "Denial Rate": "denial_rate_hc_v1",
    "Appeal Success Rate": "appeal_success_rate_hc_v1",
    "Clean Claim Rate": "clean_claim_rate_hc_v1",
    "Collection Rate": "collection_rate_hc_v1",
    "Net Collection Rate": "collection_rate_hc_v1",
    "Timely Filing Rate": "timely_filing_rate_hc_v1",
    "Documentation Requests": "documentation_request_volume_hc_v1",
    "Redundant Doc Requests": "redundant_documentation_rate_hc_v1",
    "Doc Request Response Time": "documentation_response_time_hc_v1",
    // Operational Efficiency Metrics
    "Clean Claim First-Pass Rate": "clean_claim_first_pass_rate_hc_v1",
    "Days to Final Bill": "days_to_final_bill_hc_v1",
    "Cash Posting Lag": "cash_posting_lag_hc_v1",
    "Documentation TAT": "documentation_tat_hc_v1",
    "Electronic Filing Adoption": "electronic_filing_adoption_hc_v1"
  };
  
  return nameMapping[metricName] || "unknown_metric_v1";
}

// Generate sample staging results (data in process of validation)
export function generateSampleStagingResults(): InsertCanonicalStagingResult[] {
  const now = new Date();
  const oneHour = 60 * 60 * 1000;
  const stagingResults: InsertCanonicalStagingResult[] = [];

  // Create staging results representing data being processed for different orgs
  const organizations = ["HC001", "HC002", "PMC001"];
  const entities = ["entity_main", "entity_north", "entity_south"];

  organizations.forEach((orgId, orgIndex) => {
    entities.forEach((entityId, entityIndex) => {
      // Generate staging results for key metrics
      stagingResults.push({
        result_key: `staging-total_ar_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 1000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId),
        metric_version_key: "total_ar_hc_v1",
        result_value_numeric: "2847291.75", // Higher values for staging (not yet validated)
        measurement_period_start_datetime: new Date(now.getTime() - 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 30 * 60 * 1000), // 30 mins ago
        calculation_version: "v1.1",
        result_metadata: {
          source: ["staging_etl_pipeline"],
          validation_status: ["pending"],
          data_quality_score: [0.92],
          processing_stage: ["extraction_complete", "validation_pending"]
        }
      });

      stagingResults.push({
        result_key: `staging-denial_rate_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 2000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId),
        metric_version_key: "denial_rate_hc_v1",
        result_value_numeric: "0.0847", // Slightly different from final results
        measurement_period_start_datetime: new Date(now.getTime() - 7 * 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 45 * 60 * 1000), // 45 mins ago
        calculation_version: "v1.1",
        result_metadata: {
          source: ["payer_response_staging"],
          validation_status: ["pending"],
          outlier_detection: ["within_bounds"],
          processing_stage: ["calculation_complete", "quality_check_pending"]
        }
      });

      stagingResults.push({
        result_key: `staging-clean_claim_rate_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 3000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId),
        metric_version_key: "clean_claim_rate_hc_v1",
        result_value_numeric: "0.8934", // Raw calculation before adjustments
        measurement_period_start_datetime: new Date(now.getTime() - 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 20 * 60 * 1000), // 20 mins ago
        calculation_version: "v1.1",
        result_metadata: {
          source: ["billing_system_staging"],
          validation_status: ["in_progress"],
          business_rules_applied: ["pending"],
          processing_stage: ["raw_calculation", "business_rules_pending"]
        }
      });

      // Operational Efficiency Metrics Staging Data
      stagingResults.push({
        result_key: `staging-clean_claim_first_pass_rate_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 4000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId, { department: "surgery" }),
        metric_version_key: "clean_claim_first_pass_rate_hc_v1",
        result_value_numeric: "0.9234", // 92.34% first-pass rate
        measurement_period_start_datetime: new Date(now.getTime() - 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 15 * 60 * 1000), // 15 mins ago
        calculation_version: "v1.0",
        result_metadata: {
          source: ["claims_processing_staging"],
          validation_status: ["pending"],
          processing_stage: ["calculation_complete", "validation_pending"],
          department: ["surgery"]
        }
      });

      stagingResults.push({
        result_key: `staging-days_to_final_bill_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 5000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId, { department: "emergency", bill_type: "inpatient" }),
        metric_version_key: "days_to_final_bill_hc_v1",
        result_value_numeric: "3.7", // 3.7 days average to final bill
        measurement_period_start_datetime: new Date(now.getTime() - 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 12 * 60 * 1000), // 12 mins ago
        calculation_version: "v1.0",
        result_metadata: {
          source: ["billing_cycle_staging"],
          validation_status: ["in_progress"],
          processing_stage: ["calculation_complete", "business_rules_pending"],
          department: ["emergency"],
          bill_type: ["inpatient"]
        }
      });

      stagingResults.push({
        result_key: `staging-cash_posting_lag_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 6000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId, { payment_method: "eft" }),
        metric_version_key: "cash_posting_lag_hc_v1",
        result_value_numeric: "1.2", // 1.2 days average posting lag
        measurement_period_start_datetime: new Date(now.getTime() - 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 8 * 60 * 1000), // 8 mins ago
        calculation_version: "v1.0",
        result_metadata: {
          source: ["cash_management_staging"],
          validation_status: ["pending"],
          processing_stage: ["calculation_complete", "validation_pending"],
          payment_method: ["eft"]
        }
      });

      stagingResults.push({
        result_key: `staging-documentation_tat_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 7000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId, { payer: "Aetna", document_type: "medical_records" }),
        metric_version_key: "documentation_tat_hc_v1",
        result_value_numeric: "4.8", // 4.8 days average response time
        measurement_period_start_datetime: new Date(now.getTime() - 7 * 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 25 * 60 * 1000), // 25 mins ago
        calculation_version: "v1.0",
        result_metadata: {
          source: ["documentation_staging"],
          validation_status: ["pending"],
          processing_stage: ["calculation_complete", "outlier_detection_pending"],
          payer: ["Aetna"],
          document_type: ["medical_records"]
        }
      });

      stagingResults.push({
        result_key: `staging-electronic_filing_adoption_hc_v1-${orgId}-${entityId}-${Date.now() + orgIndex * 8000 + entityIndex}`,
        grain_keys: createSchemaGrainKey(orgId, entityId, { payer: "BCBS", submission_method: "edi_837" }),
        metric_version_key: "electronic_filing_adoption_hc_v1",
        result_value_numeric: "0.9567", // 95.67% electronic filing rate
        measurement_period_start_datetime: new Date(now.getTime() - 30 * 24 * oneHour),
        measurement_period_end_datetime: new Date(now.getTime() - oneHour),
        as_of_datetime: new Date(now.getTime() - oneHour),
        calculated_at: new Date(now.getTime() - 18 * 60 * 1000), // 18 mins ago
        calculation_version: "v1.0",
        result_metadata: {
          source: ["edi_staging"],
          validation_status: ["pending"],
          processing_stage: ["calculation_complete", "trend_analysis_pending"],
          payer: ["BCBS"],
          submission_method: ["edi_837"]
        }
      });
    });
  });

  return stagingResults;
}

// Generate sample metric lineage (relationships between metrics)
export function generateSampleMetricLineage(existingResults: InsertCanonicalResult[]): InsertCanonicalMetricLineage[] {
  const lineageData: InsertCanonicalMetricLineage[] = [];

  // Find relevant result keys for building relationships
  const totalArResults = existingResults.filter(r => r.metric_version_key === "total_ar_hc_v1");
  const denialRateResults = existingResults.filter(r => r.metric_version_key === "denial_rate_hc_v1");
  const cleanClaimResults = existingResults.filter(r => r.metric_version_key === "clean_claim_rate_hc_v1");
  const appealSuccessResults = existingResults.filter(r => r.metric_version_key === "appeal_success_rate_hc_v1");
  const collectionRateResults = existingResults.filter(r => r.metric_version_key === "collection_rate_hc_v1");
  const daysOutstandingResults = existingResults.filter(r => r.metric_version_key === "ar_days_outstanding_hc_v1");

  // Create lineage relationships showing metric dependencies
  // Total AR contributes to AR Days Outstanding
  totalArResults.forEach(totalAr => {
    const matchingDaysOutstanding = daysOutstandingResults.find(days => 
      days.grain_keys.org_id === totalAr.grain_keys.org_id && 
      days.grain_keys.entity_id === totalAr.grain_keys.entity_id
    );
    
    if (matchingDaysOutstanding) {
      lineageData.push({
        parent_result_key: totalAr.result_key,
        child_result_key: matchingDaysOutstanding.result_key,
        contribution_weight: "0.7500" // Major component
      });
    }
  });

  // Clean Claim Rate influences Denial Rate
  cleanClaimResults.forEach(cleanClaim => {
    const matchingDenialRate = denialRateResults.find(denial => 
      denial.grain_keys.org_id === cleanClaim.grain_keys.org_id && 
      denial.grain_keys.entity_id === cleanClaim.grain_keys.entity_id
    );
    
    if (matchingDenialRate) {
      lineageData.push({
        parent_result_key: cleanClaim.result_key,
        child_result_key: matchingDenialRate.result_key,
        contribution_weight: "0.6200" // Strong negative correlation
      });
    }
  });

  // Denial Rate feeds into Appeal Success Rate
  denialRateResults.forEach(denialRate => {
    const matchingAppealSuccess = appealSuccessResults.find(appeal => 
      appeal.grain_keys.org_id === denialRate.grain_keys.org_id && 
      appeal.grain_keys.entity_id === denialRate.grain_keys.entity_id
    );
    
    if (matchingAppealSuccess) {
      lineageData.push({
        parent_result_key: denialRate.result_key,
        child_result_key: matchingAppealSuccess.result_key,
        contribution_weight: "0.4300" // Moderate influence
      });
    }
  });

  // Appeal Success Rate contributes to Collection Rate
  appealSuccessResults.forEach(appealSuccess => {
    const matchingCollectionRate = collectionRateResults.find(collection => 
      collection.grain_keys.org_id === appealSuccess.grain_keys.org_id && 
      collection.grain_keys.entity_id === appealSuccess.grain_keys.entity_id
    );
    
    if (matchingCollectionRate) {
      lineageData.push({
        parent_result_key: appealSuccess.result_key,
        child_result_key: matchingCollectionRate.result_key,
        contribution_weight: "0.3800" // Supporting factor
      });
    }
  });

  // AR Days Outstanding affects Collection Rate
  daysOutstandingResults.forEach(daysOutstanding => {
    const matchingCollectionRate = collectionRateResults.find(collection => 
      collection.grain_keys.org_id === daysOutstanding.grain_keys.org_id && 
      collection.grain_keys.entity_id === daysOutstanding.grain_keys.entity_id
    );
    
    if (matchingCollectionRate) {
      lineageData.push({
        parent_result_key: daysOutstanding.result_key,
        child_result_key: matchingCollectionRate.result_key,
        contribution_weight: "0.5900" // Significant inverse relationship
      });
    }
  });

  return lineageData;
}

// Sample canonical results for demo purposes
export function generateSampleCanonicalResults(orgId: string = "HC001", entityId: string = "HOSP1"): InsertResult[] {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return [
    convertMetricToCanonicalResult("Total AR", "$8.2M", orgId, entityId, {}, monthStart, monthEnd),
    convertMetricToCanonicalResult("AR Days", "44.7", orgId, entityId, {}, monthStart, monthEnd),
    convertMetricToCanonicalResult("Denial Rate", "12.3%", orgId, entityId, { department: "Cardiology" }, monthStart, monthEnd),
    convertMetricToCanonicalResult("Appeal Success Rate", "87.5%", orgId, entityId, { appeal_level: "first_level" }, monthStart, monthEnd),
    convertMetricToCanonicalResult("Clean Claim Rate", "88%", orgId, entityId, { department: "Emergency" }, monthStart, monthEnd),
    convertMetricToCanonicalResult("Collection Rate", "94.2%", orgId, entityId, { payer: "Medicare" }, monthStart, monthEnd),
    convertMetricToCanonicalResult("Timely Filing Rate", "94.7%", orgId, entityId, { payer: "BCBS", department: "Orthopedics" }, monthStart, monthEnd)
  ];
}