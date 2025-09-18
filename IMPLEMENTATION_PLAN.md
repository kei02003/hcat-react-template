# Healthcare Revenue Cycle Management - Implementation Plan

## Overview

This document outlines the strategic build path for evolving our healthcare revenue cycle management application using a modern data lakehouse architecture with Databricks. Based on the Health Catalyst Claims EDC canonical model analysis, we are pivoting from a traditional REST API approach to a direct lakehouse integration that aligns with enterprise healthcare data standards.

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
- **Health Catalyst Claims EDC model analysis** - identified enterprise lakehouse architecture requirements

### 🔄 Architecture Pivot: Traditional API → Databricks Lakehouse
**Analysis of Health Catalyst Claims EDC revealed:**
- Complex data model with 10+ entities (contract, encounter, encounter_item, medical_claim, member, etc.)
- Extensive use of `struct<>` data types optimized for analytical workloads
- dbt-style configuration designed for modern data platforms
- Multi-tenant isolation via organization_code in contract entity
- Rich financial and clinical data perfect for canonical metric calculations

### ❌ Updated Critical Gaps
- Databricks workspace setup and Delta Lake table creation
- Direct lakehouse integration for canonical metric calculations
- Frontend integration with Databricks SQL Warehouse instead of REST APIs
- Health Catalyst Claims EDC implementation in Delta Lake
- Databricks job orchestration for canonical metric pipeline

## Strategic Build Path

### Phase 1A: Foundation ✅ COMPLETED + Architecture Pivot

#### 1. Canonical Metric System ✅ COMPLETED
Implemented Health Catalyst EDC canonical metric model with multi-tenant grain_keys structure.

#### 2. Claims EDC Analysis ✅ COMPLETED
Analyzed Health Catalyst Claims EDC model revealing enterprise lakehouse architecture requirements:

```yaml
# Health Catalyst Claims EDC Models (10+ entities)
contract:          # Multi-tenant isolation via organization_code
encounter:         # Patient encounters with clinical coding
encounter_item:    # Detailed line items with financial data
medical_claim:     # Claims with comprehensive billing information
member:            # Patient demographics and enrollment
pharmacy_claim:    # Prescription drug claims
# ... additional models
```

#### 3. Architecture Decision ✅ COMPLETED
**Databricks Lakehouse Architecture Selected** based on:
- Health Catalyst Claims EDC designed for analytical workloads
- Complex `struct<>` data types requiring modern data platform
- Enterprise-scale multi-tenant data model
- Direct integration with canonical metric calculations

#### 4. Health Catalyst Canonical Metric System ✅ COMPLETED
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

#### 5. Lakehouse Integration Architecture (NEW PRIORITY)
Databricks-first approach replacing traditional API layer:
- ✅ Canonical metric definitions compatible with Delta Lake
- ❌ Databricks workspace setup and Delta Lake table creation
- ❌ Health Catalyst Claims EDC implementation in Delta Lake
- ❌ Frontend integration with Databricks SQL Warehouse
- ❌ Canonical metric calculation jobs in Databricks

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
   - ✅ Analyzed Health Catalyst Claims EDC model and identified lakehouse architecture requirements

### Immediate (Next 2-4 weeks) - Databricks Lakehouse Setup
1. **Databricks Infrastructure Setup**
   - Configure Databricks workspace with appropriate access controls
   - Set up Delta Lake storage for Health Catalyst Claims EDC models
   - Implement Unity Catalog for data governance and lineage tracking
   - Configure Databricks SQL Warehouse for frontend queries

2. **Health Catalyst Claims EDC Implementation**
   - Create Delta Lake tables for all 10+ Claims EDC models
   - Implement multi-tenant row-level security via organization_code
   - Set up data ingestion pipelines for claims transaction data
   - Validate data model with sample healthcare transaction data

3. **Canonical Metric Calculation Pipeline**
   - Build Databricks jobs for canonical metric calculations from Claims EDC data
   - Implement staging → result promotion workflows in Delta Lake
   - Create automated metric calculation schedules (daily/real-time)
   - Set up metric lineage tracking and audit logging

### Phase 1 Delivery (Month 1-4) - Lakehouse Integration
1. **Complete Databricks Integration**
   - ✅ Canonical metric foundation completed
   - Implement Databricks SQL Warehouse integration for frontend queries
   - Build canonical metric calculation pipelines in Databricks
   - Set up automated data quality monitoring and alerting

2. **Claims EDC Data Model Implementation**
   - Deploy complete Health Catalyst Claims EDC model in Delta Lake
   - Implement sophisticated multi-tenant data isolation and security
   - Build real-time and batch data ingestion from healthcare systems
   - Create comprehensive data validation and quality checks

3. **Frontend Lakehouse Integration**
   - Replace REST API calls with direct Databricks SQL Warehouse queries
   - Implement efficient caching layer for dashboard performance
   - Build dynamic dashboards consuming canonical metric results from Delta Lake
   - Create client-specific metric configuration via canonical metric versioning

### Phase 2 Delivery (Month 5-8) - Advanced Analytics & ML
1. **Advanced Lakehouse Analytics**
   - Implement additional canonical metrics using Databricks ML capabilities
   - Build predictive modeling and forecasting using MLflow
   - Create real-time streaming analytics for claims processing
   - Implement advanced data lineage tracking with Unity Catalog

2. **Enterprise Data Integration**
   - Build standardized Claims EDC ingestion framework using Databricks workflows
   - Implement Peterson Health Claims EDC adapter with Delta Live Tables
   - Implement Citizens Medical Center Claims EDC adapter
   - Create comprehensive data quality monitoring and automated remediation

3. **ML-Powered Healthcare Analytics**
   - Develop denial prediction models using canonical claims data
   - Build revenue optimization recommendations
   - Implement automated anomaly detection for financial metrics
   - Create patient risk stratification models integrated with canonical metrics


## Success Metrics

### Technical Metrics
- **Lakehouse Performance**: Sub-second queries on petabyte-scale Claims EDC data
- **Scalability**: Auto-scaling Databricks clusters supporting unlimited health systems
- **Data Processing**: Real-time and batch canonical metric calculations
- **Reliability**: 99.9% uptime for Databricks lakehouse infrastructure
- **Health Catalyst Compliance**: 100% compliance with Claims EDC and canonical metric standards
- **ML Integration**: Built-in MLflow for predictive healthcare analytics

### Business Metrics
- **Flexibility**: ✅ New metrics via Databricks jobs and canonical metric versioning (no code changes)
- **Time to Market**: New client onboarding in <14 days via Claims EDC data ingestion
- **Maintenance**: <5% of development time on customizations (lakehouse eliminates API maintenance)
- **User Adoption**: >90% daily active usage with real-time lakehouse dashboards
- **Standardization**: ✅ 100% Health Catalyst Claims EDC and canonical metric compliance
- **Advanced Analytics**: Built-in ML capabilities for predictive healthcare insights

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

## Current Status and Databricks Pivot

### ✅ Major Milestone: Canonical Metric Foundation + Lakehouse Architecture Decision
We have successfully implemented the Health Catalyst EDC canonical metric system foundation, converting 31 existing KPIs to standardized canonical metric definitions. The analysis of the Health Catalyst Claims EDC model revealed that a **Databricks lakehouse architecture** is the optimal approach for enterprise healthcare data integration.

### 🎯 Next Critical Phase: Databricks Lakehouse Implementation
The immediate focus shifts to implementing the modern data lakehouse architecture:
1. **Databricks Setup**: Configure workspace, Delta Lake, and SQL Warehouse
2. **Claims EDC Implementation**: Deploy Health Catalyst Claims EDC model in Delta Lake
3. **Metric Pipeline**: Build canonical metric calculation jobs in Databricks
4. **Frontend Integration**: Connect dashboards directly to Databricks SQL Warehouse

### 🚀 Architecture Advantages
The Databricks lakehouse approach provides significant advantages:
- **Enterprise Scale**: Handle petabytes of healthcare claims data
- **Real-time Analytics**: Streaming and batch processing capabilities
- **ML Integration**: Built-in MLflow for predictive healthcare analytics
- **Cost Efficiency**: Eliminate API infrastructure and database maintenance
- **Health Catalyst Alignment**: Direct compatibility with Claims EDC standards

### 📈 Accelerated Development Timeline
The lakehouse architecture will dramatically accelerate development:
- **No API Development**: Direct SQL queries eliminate REST endpoint complexity
- **Auto-scaling**: Databricks handles infrastructure scaling automatically
- **Built-in Analytics**: Advanced analytics and ML capabilities included
- **Standardized Data**: Health Catalyst Claims EDC provides enterprise data standards

## Conclusion

This updated implementation plan pivots to a modern Databricks lakehouse architecture that aligns perfectly with Health Catalyst's enterprise data standards. The combination of canonical metrics and Claims EDC in a lakehouse environment creates a powerful, scalable platform that can handle enterprise healthcare data volumes while providing advanced analytics capabilities. This approach eliminates traditional API complexity while providing superior performance and built-in ML capabilities for predictive healthcare insights.