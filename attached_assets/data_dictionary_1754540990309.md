# Revenue Cycle Management Data Dictionary

## Overview
This document describes the synthetic datasets generated for the Revenue Cycle Management application supporting physician advisors, preauthorization processes, denial management, and real-time documentation.

## Dataset: revenue_cycle_accounts.csv
Main revenue cycle account data containing financial, clinical, and administrative information.

| Field Name | Data Type | Description | Example Values |
|------------|-----------|-------------|----------------|
| **Account Identifiers** |
| HospitalAccountID | String | Unique hospital account identifier | HA001000 |
| RevenueCycleID | String | Revenue cycle tracking ID | RC001000 |
| FacilityID | String | Facility identifier | F001 |
| FacilityDSC | String | Facility description | Main Hospital, North Campus |
| LocationID | String | Location identifier | L001 |
| **Dates** |
| AdmitDT | DateTime | Admission date and time | 2024-01-15 14:30:00 |
| DischargeDT | DateTime | Discharge date and time | 2024-01-19 10:00:00 |
| PostDT | DateTime | Posting date for charges | 2024-01-20 09:00:00 |
| **Clinical Information** |
| DRGNM | String | DRG name/description | CHF, Pneumonia, Hip Replacement |
| FinalDRG | String | Final DRG code | 291, 193, 470 |
| ServiceAreaID | String | Service area identifier | SA001 |
| ServiceAreaNM | String | Service area name | Emergency, Surgery, ICU |
| ServiceAreaGroupCD | String | Service area group code | SG01 |
| ServiceAreaGroupDSC | String | Service area group description | Inpatient, Outpatient |
| **Department & Provider** |
| DepartmentNM | String | Department name | Cardiology, Orthopedics |
| DepartmentSpecialtyCD | String | Department specialty code | DS123 |
| DepartmentSpecialtyDSC | String | Department specialty description | Specialty 1 |
| AttendingProviderID | String | Attending provider ID | P1234 |
| AttendingProviderNM | String | Attending provider name | Dr. John Smith |
| DischargeDepartmentID | String | Discharge department ID | DD001 |
| DischargeLocationNM | String | Discharge location name | Main Hospital |
| DischargePhysicalLocationID | String | Physical location ID | PL001 |
| **Financial Classification** |
| PrimaryFinancialClassCD | String | Primary financial class code | FCMED, FCCOM |
| PrimaryFinancialClassDSC | String | Primary financial class description | Medicare, Commercial |
| CurrentFinancialClassCD | String | Current financial class code | FCMED |
| CurrentFinancialClassDSC | String | Current financial class description | Medicare |
| HospitalAccountClassCD | String | Account class code | IP, OP |
| HospitalAccountClassDSC | String | Account class description | Inpatient, Outpatient |
| **Payor Information** |
| PrimaryPayorID | String | Primary payor identifier | PAY100 |
| PrimaryPayorNM | String | Primary payor name | Medicare A, Blue Cross |
| CurrentPayorID | String | Current payor identifier | PAY100 |
| CurrentPayorNM | String | Current payor name | Medicare A |
| PrimaryBenefitPlanID | String | Primary benefit plan ID | BP1000 |
| PrimaryBenefitPlanNM | String | Primary benefit plan name | Medicare Plan A |
| CurrentBenefitPlanID | String | Current benefit plan ID | BP1000 |
| CurrentBenefitPlanNM | String | Current benefit plan name | Medicare Plan A |
| **Financial Amounts** |
| TotalChargeAMT | Decimal | Total charges | 45678.90 |
| TotalPaymentAMT | Decimal | Total payments received | 18271.56 |
| TotalAdjustmentAMT | Decimal | Total adjustments | 9135.78 |
| TransactionAMT | Decimal | Net transaction amount | 9135.78 |
| **Account Aging** |
| AcctBalCat | String | Account balance aging category | 0-30, 31-60, 61-90, 91-120, 120+ |
| AcctBalSubCat | String | Account balance aging subcategory | 0-15, 16-30, etc. |
| AgingCat | String | Aging category | 0-30, 31-60, 61-90 |
| AgingSubCat | String | Aging subcategory | 0-15, 16-30 |
| **Billing Status** |
| BillStatusCD | String | Billing status code | FINAL, PENDING |
| BillStatusDSC | String | Billing status description | Final Billed, Pending Review |
| **Cost Center** |
| CostCenterCD | String | Cost center code | CC123 |
| CostCenterNM | String | Cost center name | Cost Center Emergency |
| **Procedures** |
| ProcedureID | String | Procedure identifier | PROC12345 |
| ProcedureCD | String | Procedure code | 12345 |
| ProcedureDSC | String | Procedure description | Procedure for CHF |
| **Denial Information** |
| DenialCD | String | Denial code | D123 |
| DenialCodeDSC | String | Denial description | Medical Necessity, Authorization Required |
| DenialCodeGRP | String | Denial group | Clinical, Administrative |
| DenialCodeSubGRP | String | Denial subgroup | Initial, Appeal |
| DenialControllable | String | Is denial controllable | Y, N |
| DenialAccountBalanceAMT | Decimal | Account balance from denial | 18271.56 |
| BucketDenialCorrespondenceStatusCD | String | Denial correspondence status code | PEND |
| BucketDenialCorrespondenceStatusDSC | String | Denial correspondence status | Pending Response |
| ConcatDenialCodeGRP | String | Concatenated denial codes | Medical Necessity\|Review Required |
| **Other Fields** |
| LiabilityBucketID | String | Liability bucket identifier | LB01 |
| ReportCat | String | Report category | Revenue Cycle |
| ReportGRP | String | Report group | Accounts Receivable |
| ReportSubGRP1 | String | Report subgroup 1 | Aging Analysis |
| ReportSubGRP2 | String | Report subgroup 2 | Denial Management |
| ReportSubGRP3 | String | Report subgroup 3 | Medicare |
| FacilityAccountSourceDSC | String | Account source description | EMR System |
| HospitalNM | String | Hospital name | Main Hospital |
| RevenueLocationNM | String | Revenue location name | North Campus |
| RevCycle Month Year | String | Revenue cycle month-year | 2024-01 |

## Dataset: preauthorization_data.csv
Tracks preauthorization requests and their status.

| Field Name | Data Type | Description | Example Values |
|------------|-----------|-------------|----------------|
| PreAuthID | String | Preauthorization identifier | PA001000 |
| AccountID | String | Related account ID | HA001234 |
| ServiceType | String | Type of service requiring auth | Surgery, Imaging, Therapy |
| RequestDate | DateTime | Date authorization requested | 2024-01-10 |
| ResponseDate | DateTime | Date of authorization response | 2024-01-13 |
| Status | String | Authorization status | Approved, Denied, Pending, Partial |
| AuthNumber | String | Authorization number if approved | AUTH123456 |
| ExpirationDate | Date | Authorization expiration date | 2024-04-10 |
| RequestedUnits | Integer | Number of units requested | 10 |
| ApprovedUnits | Integer | Number of units approved | 8 |
| DenialReason | String | Reason if denied | Medical Necessity, Out of Network |
| Priority | String | Request priority | Urgent, Routine, Emergent |
| PhysicianAdvisorReview | String | Requires physician advisor review | Y, N |
| AppealEligible | String | Eligible for appeal | Y, N |

## Dataset: physician_advisor_reviews.csv
Physician advisor review activities and outcomes.

| Field Name | Data Type | Description | Example Values |
|------------|-----------|-------------|----------------|
| ReviewID | String | Review identifier | PAR001000 |
| AccountID | String | Related account ID | HA001234 |
| PhysicianAdvisorID | String | Physician advisor identifier | PA100 |
| PhysicianAdvisorName | String | Physician advisor name | Dr. Jane Doe |
| ReviewDate | DateTime | Date of review | 2024-01-15 |
| ReviewType | String | Type of review | Admission, Continued Stay, Level of Care |
| ReviewOutcome | String | Outcome of review | Approved, Downgraded, Denied |
| ClinicalJustification | String | Clinical justification | Meets InterQual Criteria |
| RecommendedLevelOfCare | String | Recommended care level | Inpatient, Observation, SNF |
| EstimatedSavings | Decimal | Estimated cost savings | 5000.00 |
| AppealRequired | String | Appeal required flag | Y, N |
| DocumentationComplete | String | Documentation complete flag | Y, N |
| FollowUpRequired | String | Follow-up required flag | Y, N |
| ReviewTurnaroundHours | Integer | Review turnaround time in hours | 24 |

## Dataset: documentation_tracking.csv
Real-time clinical documentation tracking.

| Field Name | Data Type | Description | Example Values |
|------------|-----------|-------------|----------------|
| DocumentID | String | Document identifier | DOC001000 |
| AccountID | String | Related account ID | HA001234 |
| DocumentType | String | Type of document | H&P, Progress Note, Discharge Summary |
| DocumentDate | DateTime | Document creation date | 2024-01-15 |
| DocumentStatus | String | Document status | Complete, Incomplete, Pending Signature |
| ProviderID | String | Provider identifier | P1234 |
| ProviderName | String | Provider name | Dr. John Smith |
| ComplianceFlag | String | Compliance status | Compliant, Non-Compliant, Warning |
| TimelinessMet | String | Timeliness requirement met | Y, N |
| CDIReviewRequired | String | CDI review required | Y, N |
| CDIQueryStatus | String | CDI query status | No Query, Query Sent, Response Received |
| ImpactOnDRG | String | Impacts DRG assignment | Y, N |
| EstimatedRevenueImpact | Decimal | Estimated revenue impact | 2500.00 |
| QualityIndicator | String | Quality indicator status | Met, Not Met, Partial, N/A |
| DeficiencyType | String | Type of deficiency | Missing Diagnosis, Incomplete Documentation |

## Dataset: denial_workflows.csv
Detailed denial management workflow tracking.

| Field Name | Data Type | Description | Example Values |
|------------|-----------|-------------|----------------|
| WorkflowID | String | Workflow identifier | WF12345 |
| AccountID | String | Related account ID | HA001234 |
| DenialDate | DateTime | Date of denial | 2024-01-10 |
| AppealDeadline | Date | Deadline for appeal | 2024-02-10 |
| WorkflowStatus | String | Current workflow status | Open, In Progress, Appealed, Closed-Won |
| AssignedTo | String | Person assigned to work denial | Jane Smith |
| AssignedDepartment | String | Department handling denial | Denial Management |
| PriorityLevel | String | Priority level | High, Medium, Low |
| AppealLevel | String | Level of appeal | First, Second, External, None |
| AppealSubmissionDate | Date | Date appeal submitted | 2024-01-25 |
| AppealOutcome | String | Outcome of appeal | Overturned, Upheld, Partial, Pending |
| RecoveredAmount | Decimal | Amount recovered | 15000.00 |
| WorkEffortHours | Decimal | Hours spent on denial | 5.5 |
| RootCause | String | Root cause of denial | Authorization Missing, Coding Error |
| PreventableFlag | String | Was denial preventable | Y, N |
| TrainingRequired | String | Training required flag | Y, N |

## Data Relationships

### Primary Keys and Foreign Keys
- `HospitalAccountID` / `AccountID`: Links all datasets to the main revenue cycle account
- `PreAuthID`: Unique identifier for preauthorization records
- `ReviewID`: Unique identifier for physician advisor reviews
- `DocumentID`: Unique identifier for documentation records
- `WorkflowID`: Unique identifier for denial workflows

### Key Relationships
1. **Account → Preauthorization**: One account can have multiple preauthorization requests
2. **Account → Physician Advisor Reviews**: One account can have multiple reviews
3. **Account → Documentation**: One account has multiple clinical documents
4. **Account → Denial Workflows**: Denied accounts have associated workflows

## Usage Notes
- All dates are in ISO 8601 format (YYYY-MM-DD HH:MM:SS)
- Currency amounts are in USD
- Flags use Y/N notation
- NULL values indicate the field is not applicable for that record
- This is synthetic data for development and testing purposes only