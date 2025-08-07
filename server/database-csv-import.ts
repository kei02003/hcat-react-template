import { db } from "./db";
import { eq, sql } from "drizzle-orm";
import { 
  revenueCycleAccounts, 
  clinicalDecisions, 
  denialWorkflows, 
  preauthorizationData 
} from "../shared/revenue-cycle-schema";
import Papa from "papaparse";

export class DatabaseCSVImportService {
  
  async importRevenueCycleAccountsToDatabase(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const results = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const data = results.data as any[];
    
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        // Use proper Drizzle ORM syntax instead of raw SQL
        // Map CSV columns to database schema fields
        const accountData = {
          hospitalAccountID: row['Hospital Account ID'] || `HSP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          revenueCycleID: row['Revenue Cycle ID'] || null,
          patientID: row['Patient ID'] || 'UNKNOWN',
          patientNM: row['Patient Name'] || 'UNKNOWN',
          admitDT: this.parseDate(row['Admit Date']) || new Date(),
          dischargeDT: this.parseDate(row['Discharge Date']) || null,
          currentPayorID: row['Current Payor ID'] || 'UNKNOWN',
          currentPayorNM: row['Current Payor Name'] || 'UNKNOWN',
          currentFinancialClassCD: row['Financial Class Code'] || null,
          attendingProviderID: row['Attending Provider ID'] || 'UNKNOWN',
          attendingProviderNM: row['Attending Provider Name'] || 'UNKNOWN',
          departmentNM: row['Department Name'] || 'UNKNOWN',
          serviceAreaNM: row['Service Area Name'] || null,
          hospitalAccountClassCD: row['Hospital Account Class Code'] || null,
          finalDRG: row['Final DRG'] || null,
          totalChargeAMT: row['Total Charge Amount'] || null,
          totalPaymentAMT: row['Total Payment Amount'] || null,
          totalAdjustmentAMT: row['Total Adjustment Amount'] || null,
          denialCD: row['Denial Code'] || null,
          denialCodeDSC: row['Denial Code Description'] || null,
          denialCodeGRP: row['Denial Code Group'] || null,
          denialAccountBalanceAMT: row['Denial Account Balance Amount'] || null,
          billStatusCD: row['Bill Status Code'] || null
        };

        // Insert or update using Drizzle ORM
        await db.insert(revenueCycleAccounts).values(accountData).onConflictDoNothing();
        success++;
      } catch (error) {
        errors.push(`Row ${success + errors.length + 1}: ${error.message}`);
      }
    }
    
    return { success, errors };
  }

  async importClinicalDecisionsToDatabase(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const results = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const data = results.data as any[];
    
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        const decisionData = {
          clinicalDecisionID: row['Clinical Decision ID'] || `CD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          hospitalAccountID: row['Hospital Account ID'] || 'UNKNOWN',
          patientID: row['Patient ID'] || 'UNKNOWN',
          patientNM: row['Patient Name'] || 'UNKNOWN',
          departmentNM: row['Department Name'] || 'UNKNOWN',
          hospitalAccountClassCD: row['Hospital Account Class Code'] || null,
          recommendedAccountClassCD: row['Recommended Account Class Code'] || null,
          currentPayorID: row['Current Payor ID'] || 'UNKNOWN',
          denialCD: row['Denial Code'] || null,
          appealProbability: this.parseInteger(row['Appeal Probability']) || null,
          confidenceScore: this.parseInteger(row['Confidence Score']) || null,
          complianceScore: this.parseInteger(row['Compliance Score']) || null,
          clinicalEvidence: this.parseJSON(row['Clinical Evidence']) || null,
          payorCriteria: this.parseJSON(row['Payor Criteria']) || null,
          reviewStatus: row['Review Status'] || null,
          priorityLevel: row['Priority Level'] || null
        };

        await db.insert(clinicalDecisions).values(decisionData).onConflictDoNothing();
        success++;
      } catch (error) {
        errors.push(`Row ${success + errors.length + 1}: ${error.message}`);
      }
    }
    
    return { success, errors };
  }

  async importDenialWorkflowsToDatabase(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const results = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const data = results.data as any[];
    
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        await db.raw(`
          INSERT INTO denial_workflows (
            workflow_id, hospital_account_id, account_id, denial_date,
            appeal_deadline, workflow_status, assigned_to, assigned_department,
            priority_level, appeal_level, appeal_submission_date, appeal_outcome,
            recovered_amount, work_effort_hours, root_cause, preventable_flag,
            training_required
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17
          ) ON CONFLICT (workflow_id) DO UPDATE SET
            workflow_status = EXCLUDED.workflow_status,
            updated_dt = NOW()
        `, [
          row['Workflow ID'] || `WF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          row['Hospital Account ID'] || 'UNKNOWN',
          row['Account ID'] || null,
          this.parseDate(row['Denial Date']) || new Date(),
          this.parseDate(row['Appeal Deadline']) || null,
          row['Workflow Status'] || null,
          row['Assigned To'] || null,
          row['Assigned Department'] || null,
          row['Priority Level'] || null,
          row['Appeal Level'] || null,
          this.parseDate(row['Appeal Submission Date']) || null,
          row['Appeal Outcome'] || null,
          row['Recovered Amount'] || null,
          row['Work Effort Hours'] || null,
          row['Root Cause'] || null,
          row['Preventable Flag'] || null,
          row['Training Required'] || null
        ]);
        success++;
      } catch (error) {
        errors.push(`Row ${success + errors.length + 1}: ${error.message}`);
      }
    }
    
    return { success, errors };
  }

  async importPreauthorizationDataToDatabase(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const results = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const data = results.data as any[];
    
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        await db.raw(`
          INSERT INTO preauthorization_data (
            pre_authorization_id, hospital_account_id, service_type, request_date,
            response_date, authorization_status, authorization_number, expiration_date,
            requested_units, approved_units, denial_reason, priority_level,
            physician_advisor_review, appeal_eligible
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
          ) ON CONFLICT (pre_authorization_id) DO UPDATE SET
            authorization_status = EXCLUDED.authorization_status,
            updated_dt = NOW()
        `, [
          row['Pre-Authorization ID'] || `PA_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          row['Hospital Account ID'] || 'UNKNOWN',
          row['Service Type'] || null,
          this.parseDate(row['Request Date']) || null,
          this.parseDate(row['Response Date']) || null,
          row['Authorization Status'] || null,
          row['Authorization Number'] || null,
          this.parseDate(row['Expiration Date']) || null,
          this.parseInteger(row['Requested Units']) || 0,
          this.parseInteger(row['Approved Units']) || 0,
          row['Denial Reason'] || null,
          row['Priority Level'] || null,
          row['Physician Advisor Review'] || null,
          row['Appeal Eligible'] || null
        ]);
        success++;
      } catch (error) {
        errors.push(`Row ${success + errors.length + 1}: ${error.message}`);
      }
    }
    
    return { success, errors };
  }

  async importEntityToDatabase(entityType: string, csvContent: string): Promise<{ success: number; errors: string[] }> {
    switch (entityType) {
      case 'revenue_cycle_accounts':
        return await this.importRevenueCycleAccountsToDatabase(csvContent);
      case 'clinical_decisions':
        return await this.importClinicalDecisionsToDatabase(csvContent);
      case 'denial_workflows':
        return await this.importDenialWorkflowsToDatabase(csvContent);
      case 'preauthorization_data':
        return await this.importPreauthorizationDataToDatabase(csvContent);
      default:
        return { success: 0, errors: [`Unknown entity type: ${entityType}`] };
    }
  }

  private parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '' || dateStr === 'NULL') return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private parseInteger(str: string): number | null {
    if (!str || str.trim() === '' || str === 'NULL') return null;
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }

  private parseJSON(str: string): any {
    if (!str || str.trim() === '' || str === 'NULL') return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }

  async getTableCounts(): Promise<Record<string, number>> {
    try {
      // Use Drizzle ORM to count records
      const [accountsCount, decisionsCount, workflowsCount, preauthCount] = await Promise.all([
        db.select({ count: sql`count(*)` }).from(revenueCycleAccounts),
        db.select({ count: sql`count(*)` }).from(clinicalDecisions),
        db.select({ count: sql`count(*)` }).from(denialWorkflows),
        db.select({ count: sql`count(*)` }).from(preauthorizationData)
      ]);

      return {
        revenue_cycle_accounts: parseInt(accountsCount[0]?.count || '0'),
        clinical_decisions: parseInt(decisionsCount[0]?.count || '0'),
        denial_workflows: parseInt(workflowsCount[0]?.count || '0'),
        preauthorization_data: parseInt(preauthCount[0]?.count || '0')
      };
    } catch (error) {
      console.error('Error getting table counts:', error);
      return {
        revenue_cycle_accounts: 0,
        clinical_decisions: 0,
        denial_workflows: 0,
        preauthorization_data: 0
      };
    }
  }
}

export const databaseCSVImportService = new DatabaseCSVImportService();