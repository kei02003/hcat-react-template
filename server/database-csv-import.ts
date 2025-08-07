import { db } from "./db";
import Papa from "papaparse";

export class DatabaseCSVImportService {
  
  async importRevenueCycleAccountsToDatabase(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const results = Papa.parse(csvContent, { header: true, skipEmptyLines: true });
    const data = results.data as any[];
    
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        await db.raw(`
          INSERT INTO revenue_cycle_accounts (
            hospital_account_id, revenue_cycle_id, patient_id, patient_nm, 
            admit_dt, discharge_dt, current_payor_id, current_payor_nm,
            attending_provider_id, attending_provider_nm, bill_status_cd,
            total_charge_amt, payor_balance_amt, patient_balance_amt,
            financial_class_cd, financial_class_dsc, ar_aging_days,
            liability_bucket_id, report_cat, report_grp, report_sub_grp1,
            report_sub_grp2, report_sub_grp3, facility_account_source_dsc,
            hospital_nm, revenue_location_nm, rev_cycle_month_year
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, 
            $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27
          ) ON CONFLICT (hospital_account_id) DO UPDATE SET
            revenue_cycle_id = EXCLUDED.revenue_cycle_id,
            patient_nm = EXCLUDED.patient_nm,
            current_payor_nm = EXCLUDED.current_payor_nm,
            updated_dt = NOW()
        `, [
          row['Hospital Account ID'] || `HSP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          row['Revenue Cycle ID'] || null,
          row['Patient ID'] || 'UNKNOWN',
          row['Patient Name'] || 'UNKNOWN',
          this.parseDate(row['Admit Date']) || new Date(),
          this.parseDate(row['Discharge Date']) || null,
          row['Current Payor ID'] || 'UNKNOWN',
          row['Current Payor Name'] || 'UNKNOWN',
          row['Attending Provider ID'] || null,
          row['Attending Provider Name'] || null,
          row['Bill Status Code'] || null,
          row['Total Charge Amount'] || null,
          row['Payor Balance Amount'] || null,
          row['Patient Balance Amount'] || null,
          row['Financial Class Code'] || null,
          row['Financial Class Description'] || null,
          this.parseInteger(row['AR Aging Days']) || null,
          row['Liability Bucket ID'] || null,
          row['Report Category'] || null,
          row['Report Group'] || null,
          row['Report Sub Group 1'] || null,
          row['Report Sub Group 2'] || null,
          row['Report Sub Group 3'] || null,
          row['Facility Account Source Description'] || null,
          row['Hospital Name'] || null,
          row['Revenue Location Name'] || null,
          row['Revenue Cycle Month Year'] || null
        ]);
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
        await db.raw(`
          INSERT INTO clinical_decisions (
            clinical_decision_id, hospital_account_id, patient_id, patient_nm,
            current_payor_id, department_nm, hospital_account_class_cd,
            denial_cd, appeal_probability, confidence_score, compliance_score,
            review_status, priority_level, clinical_evidence, payor_criteria,
            recommended_account_class_cd
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16
          ) ON CONFLICT (clinical_decision_id) DO UPDATE SET
            review_status = EXCLUDED.review_status,
            updated_dt = NOW()
        `, [
          row['Clinical Decision ID'] || `CD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          row['Hospital Account ID'] || 'UNKNOWN',
          row['Patient ID'] || 'UNKNOWN',
          row['Patient Name'] || 'UNKNOWN',
          row['Current Payor ID'] || 'UNKNOWN',
          row['Department Name'] || 'UNKNOWN',
          row['Hospital Account Class Code'] || null,
          row['Denial Code'] || null,
          this.parseInteger(row['Appeal Probability']) || null,
          this.parseInteger(row['Confidence Score']) || null,
          this.parseInteger(row['Compliance Score']) || null,
          row['Review Status'] || null,
          row['Priority Level'] || null,
          this.parseJSON(row['Clinical Evidence']) || null,
          this.parseJSON(row['Payor Criteria']) || null,
          row['Recommended Account Class Code'] || null
        ]);
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
      // Use a simpler approach that works with our database setup
      const accountsResult = await db.raw('SELECT COUNT(*) as count FROM revenue_cycle_accounts');
      const decisionsResult = await db.raw('SELECT COUNT(*) as count FROM clinical_decisions');
      const workflowsResult = await db.raw('SELECT COUNT(*) as count FROM denial_workflows');
      const preauthResult = await db.raw('SELECT COUNT(*) as count FROM preauthorization_data');

      return {
        revenue_cycle_accounts: parseInt(accountsResult.rows?.[0]?.count || accountsResult[0]?.[0]?.count || '0'),
        clinical_decisions: parseInt(decisionsResult.rows?.[0]?.count || decisionsResult[0]?.[0]?.count || '0'),
        denial_workflows: parseInt(workflowsResult.rows?.[0]?.count || workflowsResult[0]?.[0]?.count || '0'),
        preauthorization_data: parseInt(preauthResult.rows?.[0]?.count || preauthResult[0]?.[0]?.count || '0')
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