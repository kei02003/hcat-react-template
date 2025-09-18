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

### ❌ Critical Gaps
- Mock data throughout - no real transaction-level data model
- No configurable KPI engine or registry system
- Limited multi-entity aggregation capabilities  
- Missing physician-specific KPIs entirely
- No standardized data ingestion framework

## Strategic Build Path

### Phase 1A: Foundation (Immediate - 2-3 months)

#### 1. Canonical Data Model (CDM)
Add organizational and entity identifiers to all fact tables:

```typescript
// Add to all fact tables:
orgId: text("org_id").notNull(), // Client organization
entityId: text("entity_id").notNull(), // Hospital/facility
```

#### 2. KPI Registry System
Create a centralized KPI definition and management system:

```typescript
kpiRegistry = {
  kpiId: text("kpi_id").primaryKey(),
  name: text("name").notNull(),
  category: text("category"), // "hospital" | "physician" | "operational"
  formula: text("formula").notNull(), // SQL or expression
  numerator: text("numerator"),
  denominator: text("denominator"),
  dimensions: text("dimensions").array(), // ["entity", "department", "payer"]
  isStandard: boolean("is_standard").default(true),
  dataRequirements: jsonb("data_requirements"), // Required tables/fields
  calculationFrequency: text("calculation_frequency"), // "real-time" | "daily" | "monthly"
  targets: jsonb("targets"), // Industry benchmarks/targets
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow()
}
```

#### 3. Dashboard Template Engine
Convert existing dashboards to configurable templates:
- Template-based rendering with KPI ID references
- Enable/disable KPIs per client via configuration
- Dynamic widget rendering based on enabled KPIs
- Shared layout and styling configurations

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

**D. Payer Scorecard** (new template)
- Payer performance metrics (payment speed, denial rates)
- Contract compliance monitoring
- Relationship health scoring
- Negotiation support analytics

**E. Net Revenue/POS Cash Metrics** (new template)
- Revenue cycle performance indicators
- Point-of-service collection metrics
- Cash flow analysis and forecasting
- Patient payment behavior analysis

#### 6. Multi-Entity Comparison Engine
- Standardize entity dimensions across all dashboards
- Pre-aggregate data by entity for performance
- Enable cross-entity comparisons for all 5 dashboard types
- Implement caching strategy for comparison queries

### Phase 1C: Physician KPIs (2-3 months)

#### 7. Provider-Level Data Model
```typescript
provider_performance = {
  providerId: text("provider_id").notNull(),
  orgId: text("org_id").notNull(),
  entityId: text("entity_id").notNull(),
  specialty: text("specialty"),
  department: text("department"),
  reportingPeriod: date("reporting_period"),
  
  // Productivity metrics
  totalCharges: decimal("total_charges", { precision: 10, scale: 2 }),
  totalCollections: decimal("total_collections", { precision: 10, scale: 2 }),
  totalRVUs: decimal("total_rvus", { precision: 8, scale: 2 }),
  patientEncounters: integer("patient_encounters"),
  
  // Quality metrics
  denialRate: decimal("denial_rate", { precision: 5, scale: 2 }),
  appealsSuccessRate: decimal("appeals_success_rate", { precision: 5, scale: 2 }),
  avgLengthOfStay: decimal("avg_length_of_stay", { precision: 5, scale: 2 }),
  
  // Financial metrics
  revenuePerRVU: decimal("revenue_per_rvu", { precision: 8, scale: 2 }),
  costPerCase: decimal("cost_per_case", { precision: 8, scale: 2 }),
  profitMargin: decimal("profit_margin", { precision: 5, scale: 2 })
}
```

#### 8. Physician Dashboard Templates
- Provider productivity metrics and benchmarking
- Clinical quality indicators and outcomes
- Revenue per provider analysis
- Specialty-specific performance metrics

### Phase 2: Scalability (6+ months)

#### 9. Advanced KPI Engine
- Support for computed/derived KPIs
- Custom formulas per client (while maintaining standard base)
- Automated KPI validation and testing
- Machine learning-enhanced forecasting

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
  enabledKpis: text("enabled_kpis").array(),
  dashboardLayouts: jsonb("dashboard_layouts"),
  brandingTheme: jsonb("branding_theme"),
  targets: jsonb("targets"), // Client-specific KPI targets
  alertThresholds: jsonb("alert_thresholds"),
  reportingSchedule: jsonb("reporting_schedule"),
  isActive: boolean("is_active").default(true)
}
```

### 2. Template-Based Dashboards
- Standard dashboard templates with configurable widgets
- KPI enablement per client without code changes
- Shared component library for consistency
- Layout customization through configuration

### 3. Multi-Tenant Data Architecture
- Strict tenant isolation with orgId/entityId
- Shared KPI computation engine
- Client-specific aggregations and caching
- Row-level security enforcement

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

### Immediate (Month 1-2)
1. **Data Model Foundation**
   - Add orgId/entityId to all existing schemas
   - Implement core transaction tables (claims, payments, adjustments)
   - Update storage interfaces for multi-tenant support

2. **KPI Registry Foundation**
   - Create KPI registry table and basic CRUD operations
   - Implement KPI computation service framework
   - Convert 5 existing KPIs to registry-driven approach

### Phase 1 Delivery (Month 3-6)
1. **Complete Transaction Model**
   - Implement all missing transaction-level tables
   - Build data aggregation and calculation services
   - Create real-time and batch processing pipelines

2. **Dashboard Templates**
   - Build 5 required dashboard templates
   - Implement dynamic widget rendering
   - Create multi-entity comparison features

3. **Physician KPIs**
   - Add 50 physician-specific KPIs to registry
   - Build provider performance data model
   - Create physician dashboard templates

### Phase 2 Delivery (Month 7-12)
1. **Advanced Analytics**
   - Implement 100 additional KPIs
   - Build advanced analytics and forecasting
   - Create predictive modeling capabilities

2. **Data Integration**
   - Build standardized ingestion framework
   - Implement Peterson Health adapter
   - Implement Citizens Medical Center adapter
   - Create data quality monitoring

## Success Metrics

### Technical Metrics
- **Standardization**: 90%+ of functionality shared across clients
- **Performance**: Sub-2-second load times for dashboard templates
- **Scalability**: Support 5+ health systems without custom code
- **Reliability**: 99.9% uptime for data processing pipelines

### Business Metrics
- **Flexibility**: New KPIs addable via configuration, not code changes
- **Time to Market**: New client onboarding in <30 days
- **Maintenance**: <10% of development time spent on client-specific customizations
- **User Adoption**: >80% daily active usage of core dashboards

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

## Conclusion

This implementation plan provides a clear path to evolve our healthcare revenue cycle management application into a scalable, standardized platform that meets specific client requirements while avoiding the trap of creating custom versions for each client. The phased approach allows for incremental delivery and validation while building toward a comprehensive, enterprise-ready solution.