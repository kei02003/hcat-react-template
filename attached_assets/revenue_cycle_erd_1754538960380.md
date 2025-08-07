# Revenue Cycle Ecosystem Entity Relationship Diagram

## ERD Overview
This document describes the complete entity relationships for the integrated revenue cycle management system.

```mermaid
erDiagram
    REVENUE_CYCLE_ACCOUNTS ||--o{ CLINICAL_DECISIONS : has
    REVENUE_CYCLE_ACCOUNTS ||--o{ DENIAL_WORKFLOWS : generates
    REVENUE_CYCLE_ACCOUNTS ||--o{ APPEAL_CASES : creates
    REVENUE_CYCLE_ACCOUNTS ||--o{ TIMELY_FILING_CLAIMS : tracks
    REVENUE_CYCLE_ACCOUNTS ||--o{ PREAUTHORIZATION_DATA : requires
    REVENUE_CYCLE_ACCOUNTS ||--o{ DOCUMENTATION_TRACKING : contains
    REVENUE_CYCLE_ACCOUNTS ||--o{ PHYSICIAN_ADVISOR_REVIEWS : triggers
    
    DENIAL_WORKFLOWS ||--o| APPEAL_CASES : leads_to
    CLINICAL_DECISIONS ||--o| APPEAL_CASES : supports
    CLINICAL_DECISIONS ||--o| PHYSICIAN_ADVISOR_REVIEWS : initiates
    
    PAYORS ||--o{ REVENUE_CYCLE_ACCOUNTS : covers
    PAYORS ||--o{ FEASIBILITY_ANALYSIS : analyzed_in
    PAYORS ||--o{ TIMELY_FILING_CLAIMS : sets_deadlines
    
    DEPARTMENTS ||--o{ REVENUE_CYCLE_ACCOUNTS : treats_in
    DEPARTMENTS ||--o{ FEASIBILITY_ANALYSIS : performance_tracked
    
    PROVIDERS ||--o{ REVENUE_CYCLE_ACCOUNTS : attends
    PROVIDERS ||--o{ PHYSICIAN_ADVISOR_REVIEWS : reviews
    
    REVENUE_CYCLE_ACCOUNTS {
        string HospitalAccountID PK
        string RevenueCycleID
        string PatientID
        string PatientNM
        datetime AdmitDT
        datetime DischargeDT
        string CurrentPayorID FK
        string CurrentPayorNM
        string CurrentFinancialClassCD
        string AttendingProviderID FK
        string AttendingProviderNM
        string DepartmentNM FK
        string ServiceAreaNM
        string HospitalAccountClassCD
        string FinalDRG
        decimal TotalChargeAMT
        decimal TotalPaymentAMT
        decimal TotalAdjustmentAMT
        string DenialCD
        string DenialCodeDSC
        string DenialCodeGRP
        decimal DenialAccountBalanceAMT
        string BillStatusCD
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    CLINICAL_DECISIONS {
        string ClinicalDecisionID PK
        string HospitalAccountID FK
        string PatientID
        string PatientNM
        string DepartmentNM
        string HospitalAccountClassCD
        string RecommendedAccountClassCD
        string CurrentPayorID FK
        string DenialCD
        integer AppealProbability
        integer ConfidenceScore
        integer ComplianceScore
        json ClinicalEvidence
        json PayorCriteria
        string ReviewStatus
        string PriorityLevel
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    DENIAL_WORKFLOWS {
        string WorkflowID PK
        string AccountID FK
        string HospitalAccountID FK
        datetime DenialDate
        datetime AppealDeadline
        string WorkflowStatus
        string AssignedTo
        string PriorityLevel
        string AppealLevel
        datetime AppealSubmissionDate
        string AppealOutcome
        decimal RecoveredAmount
        decimal WorkEffortHours
        string RootCause
        string PreventableFlag
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    APPEAL_CASES {
        string AppealID PK
        string WorkflowID FK
        string HospitalAccountID FK
        string ClinicalDecisionID FK
        string ClaimID
        string DenialCD
        string CurrentPayorID FK
        decimal DenialAccountBalanceAMT
        integer AppealProbability
        integer AppealConfidenceScore
        string AppealPriorityLevel
        json ClinicalEvidence
        json PayorCriteria
        json AppealStrengthAnalysis
        string LetterStatus
        decimal ExpectedRecoveryAMT
        decimal NetRecoveryAMT
        string WorkflowStatus
        datetime AppealSubmissionDT
        datetime AppealResponseDT
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    TIMELY_FILING_CLAIMS {
        string TimelyFilingID PK
        string HospitalAccountID FK
        string ClaimID
        string PatientID
        string CurrentPayorID FK
        datetime ServiceDT
        datetime BillingDT
        datetime FilingDeadlineDT
        integer DaysRemaining
        string AgingCategory
        decimal TotalChargeAMT
        string DenialStatus
        string DenialCD
        integer FilingAttempts
        string FilingStatus
        string RiskLevel
        string PriorityLevel
        string AssignedBillerID
        string DocumentationComplete
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    PREAUTHORIZATION_DATA {
        string PreAuthID PK
        string AccountID FK
        string HospitalAccountID FK
        string ServiceType
        datetime ProcedureDate
        datetime RequestDate
        datetime ResponseDate
        integer DaysBeforeProcedure
        string CompletedOnTime
        string Status
        string AuthNumber
        integer RequestedUnits
        integer ApprovedUnits
        string DenialReason
        string Priority
        string PhysicianAdvisorReview
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    PHYSICIAN_ADVISOR_REVIEWS {
        string ReviewID PK
        string AccountID FK
        string HospitalAccountID FK
        string PhysicianAdvisorID FK
        string PhysicianAdvisorName
        datetime ReviewDate
        string ReviewType
        string ReviewOutcome
        string ClinicalJustification
        string RecommendedLevelOfCare
        decimal EstimatedSavings
        string AppealRequired
        string DocumentationComplete
        integer ReviewTurnaroundHours
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    DOCUMENTATION_TRACKING {
        string DocumentID PK
        string AccountID FK
        string HospitalAccountID FK
        string DocumentType
        datetime DocumentDate
        string DocumentStatus
        string ProviderID FK
        string ComplianceFlag
        string TimelinessMet
        string CDIReviewRequired
        string CDIQueryStatus
        string ImpactOnDRG
        decimal EstimatedRevenueImpact
        string QualityIndicator
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    PAYORS {
        string PayorID PK
        string PayorNM
        string PayorType
        string FinancialClassCD
        string FinancialClassDSC
        integer FilingDeadlineDays
        decimal ContractedRate
        string PreAuthRequired
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    FEASIBILITY_ANALYSIS {
        string AnalysisID PK
        string PayorID FK
        string PayorNM
        integer TotalClaimCount
        decimal TotalClaimAMT
        integer TotalDenialCount
        decimal AppealableAMT
        decimal AppealRatePercentage
        decimal EstimatedRecoveryAMT
        integer RedundantCount
        decimal RedundancyRatePercentage
        decimal TotalWastedCostAMT
        decimal ROIPercentage
        json DenialCategoryAnalysis
        json RequestTypeAnalysis
        json PerformanceMetrics
        datetime AnalysisDT
        datetime PeriodStartDT
        datetime PeriodEndDT
    }
    
    DEPARTMENTS {
        string DepartmentID PK
        string DepartmentNM
        string ServiceAreaNM
        string DepartmentSpecialtyCD
        string CostCenterCD
        decimal AverageChargeAMT
        decimal DenialRatePercentage
        datetime CreatedDT
        datetime UpdatedDT
    }
    
    PROVIDERS {
        string ProviderID PK
        string ProviderNM
        string ProviderType
        string DepartmentID FK
        string SpecialtyCD
        decimal ProductivityScore
        decimal QualityScore
        datetime CreatedDT
        datetime UpdatedDT
    }
```

## Key Relationships

### Primary Entity: REVENUE_CYCLE_ACCOUNTS
The central entity that connects all revenue cycle processes:
- **One-to-Many** with Clinical Decisions, Denial Workflows, Appeals, Timely Filing
- **Many-to-One** with Payors, Departments, Providers

### Appeal Flow
1. `REVENUE_CYCLE_ACCOUNTS` → `DENIAL_WORKFLOWS` (when denial occurs)
2. `DENIAL_WORKFLOWS` → `APPEAL_CASES` (when appeal initiated)
3. `CLINICAL_DECISIONS` → `APPEAL_CASES` (provides supporting evidence)

### Clinical Decision Support Flow
1. `REVENUE_CYCLE_ACCOUNTS` → `CLINICAL_DECISIONS` (analysis triggered)
2. `CLINICAL_DECISIONS` → `PHYSICIAN_ADVISOR_REVIEWS` (when review needed)
3. `PHYSICIAN_ADVISOR_REVIEWS` → `APPEAL_CASES` (supports appeals)

### Timely Filing Management
- `TIMELY_FILING_CLAIMS` tracks each claim's filing status
- Links to `PAYORS` for deadline rules
- Links to `REVENUE_CYCLE_ACCOUNTS` for claim details

### Feasibility Analysis
- `FEASIBILITY_ANALYSIS` aggregates data by `PAYORS`
- Analyzes patterns across `DEPARTMENTS`
- Identifies optimization opportunities

## Data Flow Patterns

### 1. Denial to Appeal
```
Account → Denial Recorded → Workflow Created → Clinical Review → Appeal Generated → Letter Sent → Response Tracked
```

### 2. Preauthorization to Service
```
Service Scheduled → PreAuth Required → Request Submitted → Response Received → Service Delivered → Claim Filed
```

### 3. Documentation to Reimbursement
```
Service Provided → Documentation Created → CDI Review → Coding Assigned → Claim Submitted → Payment/Denial
```

### 4. Feasibility to Action
```
Historical Data → Payer Analysis → Opportunity Identification → Prioritization → Implementation → ROI Tracking
```

## Index Strategy

### Primary Keys
- All tables use surrogate keys (ID fields)
- Format: EntityTypeID (e.g., HospitalAccountID, AppealID)

### Foreign Key Indexes
- HospitalAccountID (most joined field)
- CurrentPayorID (payer analysis)
- DepartmentNM (department performance)
- WorkflowID (workflow tracking)

### Query Optimization Indexes
- Composite: (PayorID, DenialCD) for denial analysis
- Composite: (AgingCategory, PriorityLevel) for worklist
- Composite: (ServiceDT, FilingDeadlineDT) for deadline tracking
- Single: AppealProbability for high-value targeting

## Data Integrity Rules

### Referential Integrity
- All foreign keys must reference existing parent records
- Cascade updates for ID changes
- Restrict deletes for historical data

### Business Rules
1. **Appeal Creation**: Only denied accounts can have appeals
2. **Status Transitions**: Must follow defined workflow states
3. **Date Validations**: ServiceDT < BillingDT < FilingDeadlineDT
4. **Amount Validations**: DenialAmount <= TotalChargeAmount
5. **Probability Ranges**: All percentages 0-100

## Security Considerations

### PHI/PII Fields
- PatientID, PatientNM (encrypted at rest)
- ProviderNM (role-based access)
- Clinical evidence (audit logged)

### Audit Requirements
- All updates tracked with timestamps
- User actions logged
- Data changes versioned

## Performance Metrics

### Expected Volumes (Annual)
- Revenue Cycle Accounts: 45,000
- Clinical Decisions: 30,000
- Appeals: 5,500
- Timely Filing Claims: 12,000
- Feasibility Analyses: 60 (monthly × payers)

### Query Performance Targets
- Account lookup: <100ms
- Denial analysis: <500ms
- Feasibility report: <2s
- Bulk updates: <5s for 1000 records