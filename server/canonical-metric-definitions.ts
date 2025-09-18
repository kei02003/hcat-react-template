// Import from consolidated schema instead of old canonical-metric-schema
import { 
  type CanonicalMetric,
  type CanonicalMetricVersion, 
  type CanonicalResult,
  type CanonicalStagingResult,
  type CanonicalMetricLineage,
  type InsertCanonicalStagingResult,
  type InsertCanonicalMetricLineage,
  canonicalMetric,
  canonicalMetricVersion,
  canonicalResult,
  createGrainKey
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
    "Doc Request Response Time": "documentation_response_time_hc_v1"
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
        grain_keys: createGrainKey(orgId, entityId),
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
        grain_keys: createGrainKey(orgId, entityId),
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
        grain_keys: createGrainKey(orgId, entityId),
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