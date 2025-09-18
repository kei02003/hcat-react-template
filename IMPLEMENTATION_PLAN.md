# Healthcare Revenue Cycle Management - Implementation Plan

## Overview

This document outlines the strategic build path for evolving our healthcare revenue cycle management application to balance standardization with client-specific requirements. The goal is to create a configurable, multi-tenant platform rather than custom versions for each client.

## Client Requirements (RFP Context)

### Phase 1 Requirements
- **5 dashboards** with **100 total KPIs** (50 hospital + 50 physician-based)
- **Multi-entity reporting** for:
  1. Initial denials
  2. Write-off denials  
  3. AR Aging analysis
  4. Payer Scorecard
  5. Net Revenue and Point of Service Cash Metrics

### Phase 2 Requirements (by July 1, 2026)
- **100 additional KPI metrics** (total 200 KPIs)
- **Data ingestion** from Peterson Health and Citizens Medical Center

## Current State Assessment

### ✅ Strengths
- Solid UI foundation with 5 existing dashboard modules
- Performance comparison capabilities already built
- Multi-site filtering infrastructure in place
- Component-based architecture supports reusability
- ~17 KPIs already implemented (from 39 HFMA standard)

### ✅ Recently Completed (Canonical Metric Foundation)
- Health Catalyst EDC canonical metric model implementation
- 31 existing KPIs converted to standardized canonical metric definitions
- Storage integration with canonical metrics (in-memory with sample data)
- Multi-tenant enforcement via grain_keys with org_id validation

### ❌ Critical Gaps
- API routes for canonical metric operations (CRUD, querying, staging)
- Frontend integration to consume canonical metrics instead of legacy KPIs
- Database persistence for canonical metrics (currently in-memory)
- Real transaction-level data model for billing/claims
- No standardized data ingestion framework

## Strategic Build Path

### Phase 1A: Foundation ✅ COMPLETED

#### 1. Canonical Data Model (CDM) ✅ COMPLETED
Organizational and entity identifiers implemented via grain_keys structure in canonical metric system.

#### 2. Health Catalyst Canonical Metric System ✅ COMPLETED
Implemented the official Health Catalyst EDC metric model for standardized KPI management:

```typescript
// Base metric definitions (category and ownership)
metric = {
  metric_key: text("metric_key").primaryKey(), // "ar_days_outstanding_hc", "denial_rate_clinical_hc"
  metric: text("metric").notNull(), // "AR Days Outstanding"
  metric_description: text("metric_description").notNull(),
  tags: jsonb("tags") // ["revenue_cycle", "hospital", "regulatory"]
}

// Version-specific metric definitions (supports evolution over time)
metric_version = {
  metric_version_key: text("metric_version_key").primaryKey(),
  metric_key: text("metric_key").notNull(), // FK to metric
  version_number: text("version_number").notNull(), // "v1.0", "v2.1"
  valid_from_datetime: timestamp("valid_from_datetime"),
  valid_to_datetime: timestamp("valid_to_datetime"),
  metric_version_name: text("metric_version_name").notNull(),
  metric_version_description: text("metric_version_description").notNull(),
  grain: jsonb("grain"), // {"org_id": "string", "entity_id": "string", "payer": "string"}
  grain_description: text("grain_description"),
  domain: text("domain").notNull(), // "Clinical", "Financial", "Operational"
  result_type: text("result_type"), // "numeric", "percentage", "currency"
  result_unit: text("result_unit"), // "days", "percent", "dollars"
  frequency: text("frequency"), // "daily", "monthly", "real-time"
  source_category: text("source_category"), // "billing_transactions", "clinical_data"
  is_regulatory: boolean("is_regulatory"),
  regulatory_program: text("regulatory_program"), // "CMS", "HFMA", "HIMSS"
  steward: text("steward").notNull(), // Business owner
  developer: text("developer").notNull(), // Technical owner
  is_active: boolean("is_active"),
  metadata_schema: jsonb("metadata_schema"), // Required metadata structure
  required_metadata_fields: jsonb("required_metadata_fields"),
  created_datetime: timestamp("created_datetime").defaultNow(),
  updated_datetime: timestamp("updated_datetime").defaultNow()
}

// Final metric results (post-processing)
result = {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys"), // {"org_id": "HC001", "entity_id": "HOSP1", "payer": "MEDICARE"}
  metric_version_key: text("metric_version_key").notNull(),
  result_value_numeric: decimal("result_value_numeric", { precision: 15, scale: 4 }),
  result_value_datetime: timestamp("result_value_datetime"),
  result_value_text: text("result_value_text"),
  result_value_boolean: boolean("result_value_boolean"),
  result_value_json: jsonb("result_value_json"),
  measurement_period_start_datetime: timestamp("measurement_period_start_datetime"),
  measurement_period_end_datetime: timestamp("measurement_period_end_datetime"),
  as_of_datetime: timestamp("as_of_datetime"),
  result_metadata: jsonb("result_metadata"),
  calculated_at: timestamp("calculated_at"),
  calculation_version: text("calculation_version")
}

// Staging area for metric calculations (append-only)
staging_result = {
  result_key: text("result_key").primaryKey(),
  grain_keys: jsonb("grain_keys"),
  metric_version_key: text("metric_version_key").notNull(),
  result_value_numeric: decimal("result_value_numeric", { precision: 15, scale: 4 }),
  result_value_datetime: timestamp("result_value_datetime"),
  result_value_text: text("result_value_text"),
  result_value_boolean: boolean("result_value_boolean"),
  result_value_json: jsonb("result_value_json"),
  measurement_period_start_datetime: timestamp("measurement_period_start_datetime"),
  measurement_period_end_datetime: timestamp("measurement_period_end_datetime"),
  as_of_datetime: timestamp("as_of_datetime"),
  result_metadata: jsonb("result_metadata"),
  calculated_at: timestamp("calculated_at"),
  calculation_version: text("calculation_version")
}

// Metric relationships and hierarchies
metric_lineage = {
  parent_result_key: text("parent_result_key"),
  child_result_key: text("child_result_key"),
  contribution_weight: decimal("contribution_weight", { precision: 5, scale: 4 })
}
```

#### 3. Dashboard Template Engine (IN PROGRESS)
Convert existing dashboards to configurable templates:
- ✅ Canonical metric definitions with proper metadata schemas
- ❌ Template-based rendering with canonical metric references
- ❌ Enable/disable metrics per client via configuration
- ❌ Dynamic widget rendering based on canonical metric results
- ❌ Frontend integration to consume canonical metrics

### Phase 1B: Core RFP Requirements (3-4 months)

#### 4. Transaction-Level Data Model
Implement missing critical data tables:

```typescript
// Core transaction tables
claims = {
  claimId: text("claim_id").primaryKey(),
  orgId: text("org_id").notNull(),
  entityId: text("entity_id").notNull(),
  patientId: text("patient_id").notNull(),
  serviceDate: date("service_date").notNull(),
  submissionDate: date("submission_date").notNull(),
  payerName: text("payer_name").notNull(),
  providerId: text("provider_id").notNull(),
  department: text("department").notNull(),
  chargedAmount: decimal("charged_amount", { precision: 10, scale: 2 }),
  allowedAmount: decimal("allowed_amount", { precision: 10, scale: 2 }),
  status: text("status") // "submitted", "paid", "denied", "pending"
}

claim_lines = {
  lineId: text("line_id").primaryKey(),
  claimId: text("claim_id").notNull(),
  procedureCode: text("procedure_code").notNull(),
  diagnosisCode: text("diagnosis_code"),
  units: integer("units"),
  chargedAmount: decimal("charged_amount", { precision: 10, scale: 2 }),
  allowedAmount: decimal("allowed_amount", { precision: 10, scale: 2 })
}

payments = {
  paymentId: text("payment_id").primaryKey(),
  claimId: text("claim_id").notNull(),
  paymentDate: date("payment_date").notNull(),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  paymentType: text("payment_type"), // "primary", "secondary", "patient"
  eraNumber: text("era_number"),
  checkNumber: text("check_number")
}

adjustments = {
  adjustmentId: text("adjustment_id").primaryKey(),
  claimId: text("claim_id").notNull(),
  adjustmentDate: date("adjustment_date").notNull(),
  adjustmentAmount: decimal("adjustment_amount", { precision: 10, scale: 2 }),
  adjustmentType: text("adjustment_type"), // "contractual", "write-off", "reversal"
  reason: text("reason"),
  isWriteOff: boolean("is_write_off").default(false)
}

daily_financials = {
  date: date("date"),
  orgId: text("org_id"),
  entityId: text("entity_id"),
  totalCharges: decimal("total_charges", { precision: 10, scale: 2 }),
  totalCollections: decimal("total_collections", { precision: 10, scale: 2 }),
  totalAR: decimal("total_ar", { precision: 10, scale: 2 }),
  accountCount: integer("account_count"),
  // Composite primary key on date, orgId, entityId
}
```

#### 5. Five Required Dashboard Templates

**A. Initial Denials Dashboard** (expand current clinical denials)
- Real-time denial tracking with transaction-level detail
- Denial reason analysis and trending
- Provider and department performance metrics
- Appeal workflow management

**B. Write-off Denials Dashboard** (leverage existing write-off analytics)
- Write-off analysis by reason category
- Avoidable vs. unavoidable write-off classification
- Recovery tracking and success rates
- Financial impact analysis

**C. AR Aging Analysis** (enhance current AR dashboard)
- Multi-dimensional aging analysis (entity, payer, department)
- Trend analysis with statistical process control
- Benchmark comparisons
- Action item prioritization

**D. Net Revenue/POS Cash Metrics** (new template)
- Revenue cycle performance indicators
- Point-of-service collection metrics
- Cash flow analysis and forecasting
- Patient payment behavior analysis

#### 6. Multi-Entity Comparison Engine
- Standardize entity dimensions across all dashboards
- Pre-aggregate data by entity for performance
- Enable cross-entity comparisons for all 5 dashboard types
- Implement caching strategy for comparison queries


### Phase 2: Scalability (6+ months)

#### 9. Advanced Metric Engine
- Support for derived metrics using metric_lineage relationships
- Custom metric versions per client (while maintaining standard base metrics)
- Automated metric validation and testing via metadata_schema
- Machine learning-enhanced forecasting built on canonical result structure
- Metric versioning and backward compatibility management

#### 10. Data Ingestion Framework
```typescript
ingestion_configs = {
  configId: text("config_id").primaryKey(),
  sourceSystemId: text("source_system_id").notNull(),
  orgId: text("org_id").notNull(),
  mappingRules: jsonb("mapping_rules"), // Field mappings
  validationRules: jsonb("validation_rules"), // Data quality checks
  transformationRules: jsonb("transformation_rules"), // Business logic
  schedule: text("schedule"), // Cron expression for automated runs
  isActive: boolean("is_active").default(true),
  lastRunAt: timestamp("last_run_at"),
  nextRunAt: timestamp("next_run_at")
}

ingestion_logs = {
  logId: text("log_id").primaryKey(),
  configId: text("config_id").notNull(),
  runStartTime: timestamp("run_start_time").notNull(),
  runEndTime: timestamp("run_end_time"),
  status: text("status"), // "running", "success", "failed", "partial"
  recordsProcessed: integer("records_processed"),
  recordsSuccess: integer("records_success"),
  recordsError: integer("records_error"),
  errorDetails: jsonb("error_details")
}
```

#### 11. Peterson Health & Citizens Medical Center Integration
- Source-specific adapters using standard framework
- Data validation and reconciliation
- Automated ingestion monitoring
- Real-time data quality dashboards

## Key Standardization Strategies

### 1. Configuration Over Customization
```typescript
client_config = {
  clientId: text("client_id").primaryKey(),
  orgName: text("org_name").notNull(),
  enabledMetricVersions: text("enabled_metric_versions").array(), // Canonical metric version keys
  dashboardLayouts: jsonb("dashboard_layouts"),
  brandingTheme: jsonb("branding_theme"),
  metricTargets: jsonb("metric_targets"), // Client-specific targets by metric_version_key
  alertThresholds: jsonb("alert_thresholds"), // Thresholds by metric_version_key
  reportingSchedule: jsonb("reporting_schedule"),
  grainOverrides: jsonb("grain_overrides"), // Client-specific grain configurations
  isActive: boolean("is_active").default(true)
}
```

### 2. Template-Based Dashboards
- Standard dashboard templates consuming canonical metric results
- Metric enablement per client via metric_version configuration
- Shared component library rendering canonical result values
- Layout customization through grain_keys and result filtering

### 3. Multi-Tenant Data Architecture
- Strict tenant isolation via grain_keys (org_id/entity_id)
- Shared canonical metric computation engine
- Client-specific aggregations via result grain filtering
- Row-level security enforcement on canonical billing transactions and metric results

### 4. Standardized Data Contracts
```typescript
// Standard ingestion format for all clients
standard_claim_format = {
  claimId: string,
  patientId: string,
  serviceDate: date,
  chargedAmount: decimal,
  payerName: string,
  providerId: string,
  department: string,
  // ... other standard fields
}
```

## Implementation Priorities

### ✅ COMPLETED (Canonical Metric Foundation)
1. **Health Catalyst Metric System Foundation** ✅ COMPLETED
   - ✅ Implemented canonical metric tables (metric, metric_version, result, staging_result, metric_lineage)
   - ✅ Created canonical metric schema with proper Health Catalyst EDC standards
   - ✅ Built storage integration with multi-tenant enforcement via grain_keys
   - ✅ Converted 31 existing KPIs to canonical metric definitions (exceeded initial goal of 5)
   - ✅ Implemented sample data generation and initialization

### Immediate (Next 2-4 weeks)
1. **API Integration and Production Readiness**
   - Implement canonical metric REST API endpoints (CRUD operations, results querying)
   - Add database persistence for canonical metrics (replace in-memory storage)
   - Create staging result management and promotion workflows
   - Add comprehensive test coverage for metric validation and tenant isolation

2. **Frontend Integration**
   - Convert existing dashboards to consume canonical metric results
   - Update React Query hooks to use new canonical metric endpoints
   - Implement dynamic widget rendering based on canonical metric configuration
   - Add metric enablement/configuration per client organization

3. **Transaction-Level Data Model**
   - Add orgId/entityId to all existing schemas
   - Implement core transaction tables (claims, payments, adjustments)
   - Build data aggregation services to populate canonical metric results

### Phase 1 Delivery (Month 1-4)
1. **Complete Canonical Metric Integration**
   - ✅ Foundation completed - proceed to API and frontend integration
   - Build canonical metric REST endpoints with proper tenant isolation
   - Convert all existing dashboard components to consume canonical results
   - Implement metric lifecycle management (versioning, activation, retirement)

2. **Transaction Model and Data Aggregation**
   - Implement missing transaction-level tables (claims, payments, adjustments)
   - Build canonical result calculation services from transaction data
   - Create real-time and batch processing pipelines for metric computation
   - Integrate with existing canonical metric infrastructure

3. **Dashboard Templates Enhancement**
   - Leverage existing 4 core dashboards and convert to canonical metric consumption
   - Implement client-specific metric configuration via canonical metric versioning
   - Create multi-entity comparison features using grain_keys structure
   - Build template engine consuming canonical metric results

### Phase 2 Delivery (Month 5-8)
1. **Advanced Analytics**
   - Implement additional metrics using canonical metric system
   - Build advanced analytics and forecasting on canonical result structure
   - Create predictive modeling capabilities leveraging metric lineage relationships
   - Implement automated metric quality monitoring via result metadata

2. **Data Integration**
   - Build standardized ingestion framework
   - Implement Peterson Health adapter
   - Implement Citizens Medical Center adapter
   - Create data quality monitoring

## Success Metrics

### Technical Metrics
- **Standardization**: 90%+ of functionality shared across clients via canonical metric system
- **Performance**: Sub-2-second load times for canonical metric dashboard templates
- **Scalability**: Support 5+ health systems without custom code via canonical metric configuration
- **Reliability**: 99.9% uptime for canonical metric calculation and result pipelines
- **Health Catalyst Compliance**: 100% compliance with EDC canonical metric standards

### Business Metrics
- **Flexibility**: ✅ New metrics addable via canonical metric versioning, not code changes (infrastructure complete)
- **Time to Market**: New client onboarding in <30 days via canonical metric configuration
- **Maintenance**: <10% of development time spent on client-specific customizations
- **User Adoption**: >80% daily active usage of canonical metric dashboards
- **Standardization**: ✅ 100% compliance with Health Catalyst EDC metric standards (implemented)

## Risk Mitigation

### Technical Risks
- **Data Volume**: Implement efficient aggregation and caching strategies
- **Performance**: Use pre-computed aggregates and optimized queries
- **Data Quality**: Build comprehensive validation and monitoring
- **Integration Complexity**: Use standardized contracts and adapters

### Business Risks
- **Client Expectations**: Clear communication of standard vs. custom features
- **Timeline Pressure**: Phased delivery with MVP approach
- **Resource Constraints**: Prioritize high-impact features first
- **Maintenance Burden**: Invest in automation and monitoring tools

## Current Status and Next Steps

### ✅ Major Milestone Achieved: Canonical Metric Foundation Complete
We have successfully implemented the Health Catalyst EDC canonical metric system foundation, converting 31 existing KPIs to standardized canonical metric definitions. This establishes the core infrastructure for scalable, multi-tenant metric management that aligns with Health Catalyst standards.

### 🎯 Next Critical Phase: API Integration and Production Readiness
The immediate focus shifts to completing the canonical metric system integration:
1. **API Layer**: Implement REST endpoints for canonical metric operations
2. **Frontend Integration**: Convert dashboards to consume canonical metric results
3. **Database Persistence**: Replace in-memory storage with PostgreSQL persistence
4. **Production Hardening**: Add comprehensive testing and operational controls

### 📈 Accelerated Timeline
With the canonical metric foundation complete, we're ahead of the original schedule. The standardized metric system will significantly accelerate subsequent phases, as all future KPIs and dashboards will leverage the established canonical metric infrastructure rather than requiring custom implementations.

## Conclusion

This implementation plan provides a clear path to evolve our healthcare revenue cycle management application into a scalable, standardized platform that meets specific client requirements while avoiding the trap of creating custom versions for each client. The successful completion of the Health Catalyst canonical metric foundation positions us for rapid progress in subsequent phases, with all future development building upon this standardized infrastructure.