import { revenueCycleStorage } from "./revenue-cycle-storage";
import { db } from "./db";
import { 
  revenueCycleAccounts,
  clinicalDecisions,
  denialWorkflows,
  appealCases,
  timelyFilingClaims,
  preauthorizationData,
  physicianAdvisorReviews,
  documentationTracking,
  payors,
  feasibilityAnalysis,
  departments,
  providers
} from "../shared/revenue-cycle-schema";

export class DataMigrationService {
  
  async migrateAllData(): Promise<void> {
    console.log("Starting data migration from in-memory storage to database...");
    
    try {
      // Get all data from in-memory storage
      const [
        accounts,
        decisions,
        workflows,
        appeals,
        claims,
        preauth,
        reviews,
        docs,
        payorList,
        analysis,
        depts,
        providerList
      ] = await Promise.all([
        revenueCycleStorage.getRevenueCycleAccounts(),
        revenueCycleStorage.getClinicalDecisions(),
        revenueCycleStorage.getDenialWorkflows(),
        revenueCycleStorage.getAppealCases(),
        revenueCycleStorage.getTimelyFilingClaims(),
        revenueCycleStorage.getPreauthorizationData(),
        revenueCycleStorage.getPhysicianAdvisorReviews(),
        revenueCycleStorage.getDocumentationTracking(),
        revenueCycleStorage.getPayors(),
        revenueCycleStorage.getFeasibilityAnalysis(),
        revenueCycleStorage.getDepartments(),
        revenueCycleStorage.getProviders()
      ]);

      console.log(`Found ${accounts.length} revenue cycle accounts to migrate`);
      console.log(`Found ${decisions.length} clinical decisions to migrate`);
      console.log(`Found ${workflows.length} denial workflows to migrate`);
      console.log(`Found ${appeals.length} appeal cases to migrate`);
      console.log(`Found ${claims.length} timely filing claims to migrate`);
      console.log(`Found ${preauth.length} preauthorization records to migrate`);
      console.log(`Found ${reviews.length} physician advisor reviews to migrate`);
      console.log(`Found ${docs.length} documentation tracking records to migrate`);

      // Migrate revenue cycle accounts
      if (accounts.length > 0) {
        const accountsToInsert = accounts.map(account => ({
          hospital_account_id: account.hospitalAccountID,
          revenue_cycle_id: account.revenueCycleID,
          patient_id: account.patientID,
          patient_nm: account.patientNM,
          admit_dt: account.admitDT,
          discharge_dt: account.dischargeDT,
          current_payor_id: account.currentPayorID,
          current_payor_nm: account.currentPayorNM,
          attending_provider_id: account.attendingProviderID,
          attending_provider_nm: account.attendingProviderNM,
          bill_status_cd: account.billStatusCD,
          total_charge_amt: account.totalChargeAMT,
          payor_balance_amt: account.payorBalanceAMT,
          patient_balance_amt: account.patientBalanceAMT,
          financial_class_cd: account.financialClassCD,
          financial_class_dsc: account.financialClassDSC,
          ar_aging_days: account.arAgingDays,
          liability_bucket_id: account.liabilityBucketID,
          report_cat: account.reportCAT,
          report_grp: account.reportGRP,
          report_sub_grp1: account.reportSubGRP1,
          report_sub_grp2: account.reportSubGRP2,
          report_sub_grp3: account.reportSubGRP3,
          facility_account_source_dsc: account.facilityAccountSourceDSC,
          hospital_nm: account.hospitalNM,
          revenue_location_nm: account.revenueLocationNM,
          rev_cycle_month_year: account.revCycleMonthYear
        }));

        await db.insert(revenueCycleAccounts).values(accountsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${accounts.length} revenue cycle accounts`);
      }

      // Migrate clinical decisions
      if (decisions.length > 0) {
        const decisionsToInsert = decisions.map(decision => ({
          clinical_decision_id: decision.clinicalDecisionID,
          hospital_account_id: decision.hospitalAccountID,
          patient_id: decision.patientID,
          patient_nm: decision.patientNM,
          current_payor_id: decision.currentPayorID,
          department_nm: decision.departmentNM,
          hospital_account_class_cd: decision.hospitalAccountClassCD,
          denial_cd: decision.denialCD,
          appeal_probability: decision.appealProbability,
          confidence_score: decision.confidenceScore,
          compliance_score: decision.complianceScore,
          review_status: decision.reviewStatus,
          priority_level: decision.priorityLevel,
          clinical_evidence: decision.clinicalEvidence,
          payor_criteria: decision.payorCriteria,
          recommended_account_class_cd: decision.recommendedAccountClassCD
        }));

        await db.insert(clinicalDecisions).values(decisionsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${decisions.length} clinical decisions`);
      }

      // Migrate denial workflows
      if (workflows.length > 0) {
        const workflowsToInsert = workflows.map(workflow => ({
          workflow_id: workflow.workflowID,
          hospital_account_id: workflow.hospitalAccountID,
          account_id: workflow.accountID,
          denial_date: workflow.denialDate,
          appeal_deadline: workflow.appealDeadline,
          workflow_status: workflow.workflowStatus,
          assigned_to: workflow.assignedTo,
          assigned_department: workflow.assignedDepartment,
          priority_level: workflow.priorityLevel,
          appeal_level: workflow.appealLevel,
          appeal_submission_date: workflow.appealSubmissionDate,
          appeal_outcome: workflow.appealOutcome,
          recovered_amount: workflow.recoveredAmount,
          work_effort_hours: workflow.workEffortHours,
          root_cause: workflow.rootCause,
          preventable_flag: workflow.preventableFlag,
          training_required: workflow.trainingRequired
        }));

        await db.insert(denialWorkflows).values(workflowsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${workflows.length} denial workflows`);
      }

      // Migrate appeal cases
      if (appeals.length > 0) {
        const appealsToInsert = appeals.map(appeal => ({
          appeal_id: appeal.appealID,
          hospital_account_id: appeal.hospitalAccountID,
          current_payor_id: appeal.currentPayorID,
          denial_cd: appeal.denialCD,
          denial_account_balance_amt: appeal.denialAccountBalanceAMT,
          appeal_submission_dt: appeal.appealSubmissionDT,
          appeal_response_dt: appeal.appealResponseDT,
          appeal_outcome: appeal.appealOutcome,
          appeal_reason: appeal.appealReason,
          clinical_evidence: appeal.clinicalEvidence,
          success_probability: appeal.successProbability,
          estimated_recovery_amt: appeal.estimatedRecoveryAMT,
          workflow_id: appeal.workflowID,
          clinical_decision_id: appeal.clinicalDecisionID
        }));

        await db.insert(appealCases).values(appealsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${appeals.length} appeal cases`);
      }

      // Migrate timely filing claims
      if (claims.length > 0) {
        const claimsToInsert = claims.map(claim => ({
          timely_filing_id: claim.timelyFilingID,
          hospital_account_id: claim.hospitalAccountID,
          patient_id: claim.patientID,
          current_payor_id: claim.currentPayorID,
          service_dt: claim.serviceDT,
          filing_deadline_dt: claim.filingDeadlineDT,
          days_until_deadline: claim.daysUntilDeadline,
          risk_level: claim.riskLevel,
          total_charge_amt: claim.totalChargeAMT,
          denial_cd: claim.denialCD,
          filing_status: claim.filingStatus,
          department_nm: claim.departmentNM,
          assigned_user: claim.assignedUser,
          documentation_complete: claim.documentationComplete
        }));

        await db.insert(timelyFilingClaims).values(claimsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${claims.length} timely filing claims`);
      }

      // Migrate preauthorization data
      if (preauth.length > 0) {
        const preauthToInsert = preauth.map(auth => ({
          pre_authorization_id: auth.preAuthID,
          hospital_account_id: auth.hospitalAccountID,
          service_type: auth.serviceType,
          request_date: auth.requestDate,
          response_date: auth.responseDate,
          authorization_status: auth.status,
          authorization_number: auth.authorizationNumber,
          expiration_date: auth.expirationDate,
          requested_units: auth.requestedUnits,
          approved_units: auth.approvedUnits,
          denial_reason: auth.denialReason,
          priority_level: auth.priorityLevel,
          physician_advisor_review: auth.physicianAdvisorReview,
          appeal_eligible: auth.appealEligible
        }));

        await db.insert(preauthorizationData).values(preauthToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${preauth.length} preauthorization records`);
      }

      // Migrate physician advisor reviews
      if (reviews.length > 0) {
        const reviewsToInsert = reviews.map(review => ({
          review_id: review.reviewID,
          hospital_account_id: review.hospitalAccountID,
          account_id: review.accountID,
          physician_advisor_id: review.physicianAdvisorID,
          physician_advisor_name: review.physicianAdvisorName,
          review_date: review.reviewDate,
          review_type: review.reviewType,
          review_outcome: review.reviewOutcome,
          clinical_justification: review.clinicalJustification,
          recommended_level_of_care: review.recommendedLevelOfCare,
          estimated_savings: review.estimatedSavings,
          appeal_required: review.appealRequired,
          documentation_complete: review.documentationComplete,
          follow_up_required: review.followUpRequired,
          review_turnaround_hours: review.reviewTurnaroundHours
        }));

        await db.insert(physicianAdvisorReviews).values(reviewsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${reviews.length} physician advisor reviews`);
      }

      // Migrate documentation tracking
      if (docs.length > 0) {
        const docsToInsert = docs.map(doc => ({
          document_id: doc.documentID,
          hospital_account_id: doc.hospitalAccountID,
          account_id: doc.accountID,
          document_type: doc.documentType,
          document_date: doc.documentDate,
          document_status: doc.documentStatus,
          provider_id: doc.providerID,
          provider_name: doc.providerName,
          compliance_flag: doc.complianceFlag,
          timeliness_met: doc.timelinessMet,
          cdi_review_required: doc.cdiReviewRequired,
          cdi_query_status: doc.cdiQueryStatus,
          impact_on_drg: doc.impactOnDRG,
          estimated_revenue_impact: doc.estimatedRevenueImpact,
          quality_indicator: doc.qualityIndicator,
          deficiency_type: doc.deficiencyType
        }));

        await db.insert(documentationTracking).values(docsToInsert).onConflictDoNothing();
        console.log(`✓ Migrated ${docs.length} documentation tracking records`);
      }

      console.log("✅ Data migration completed successfully!");
      
      // Verify migration by counting records
      const counts = await this.verifyMigration();
      console.log("Migration verification:", counts);
      
    } catch (error) {
      console.error("❌ Data migration failed:", error);
      throw error;
    }
  }

  async verifyMigration(): Promise<Record<string, number>> {
    try {
      const [
        accountCount,
        decisionCount,
        workflowCount,
        appealCount,
        claimCount,
        preauthCount,
        reviewCount,
        docCount
      ] = await Promise.all([
        db.select().from(revenueCycleAccounts).then(rows => rows.length),
        db.select().from(clinicalDecisions).then(rows => rows.length),
        db.select().from(denialWorkflows).then(rows => rows.length),
        db.select().from(appealCases).then(rows => rows.length),
        db.select().from(timelyFilingClaims).then(rows => rows.length),
        db.select().from(preauthorizationData).then(rows => rows.length),
        db.select().from(physicianAdvisorReviews).then(rows => rows.length),
        db.select().from(documentationTracking).then(rows => rows.length)
      ]);

      return {
        revenue_cycle_accounts: accountCount,
        clinical_decisions: decisionCount,
        denial_workflows: workflowCount,
        appeal_cases: appealCount,
        timely_filing_claims: claimCount,
        preauthorization_data: preauthCount,
        physician_advisor_reviews: reviewCount,
        documentation_tracking: docCount
      };
    } catch (error) {
      console.error("Error verifying migration:", error);
      return {};
    }
  }

  async clearAllTables(): Promise<void> {
    console.log("Clearing all database tables...");
    try {
      await Promise.all([
        db.delete(revenueCycleAccounts),
        db.delete(clinicalDecisions),
        db.delete(denialWorkflows),
        db.delete(appealCases),
        db.delete(timelyFilingClaims),
        db.delete(preauthorizationData),
        db.delete(physicianAdvisorReviews),
        db.delete(documentationTracking)
      ]);
      console.log("✅ All tables cleared");
    } catch (error) {
      console.error("❌ Error clearing tables:", error);
      throw error;
    }
  }
}

export const dataMigrationService = new DataMigrationService();