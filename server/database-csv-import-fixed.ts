import { db } from "./db";
import { sql } from "drizzle-orm";
import { 
  revenueCycleAccounts, 
  clinicalDecisions, 
  denialWorkflows, 
  preauthorizationData 
} from "../shared/revenue-cycle-schema";
import Papa from "papaparse";

export class DatabaseCSVImportService {
  async importEntityToDatabase(entityType: string, csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    
    switch (entityType) {
      case 'revenue_cycle_accounts':
        return this.importRevenueCycleAccountsToDatabase(data);
      case 'clinical_decisions':
        return this.importClinicalDecisionsToDatabase(data);
      case 'denial_workflows':
        return this.importDenialWorkflowsToDatabase(data);
      case 'preauthorization_data':
        return this.importPreauthorizationDataToDatabase(data);
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  async importRevenueCycleAccountsToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
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

        await db.insert(revenueCycleAccounts).values(accountData).onConflictDoNothing();
        success++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Row ${success + errors.length + 1}: ${errorMessage}`);
      }
    }

    return { success, errors };
  }

  async importClinicalDecisionsToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
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
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Row ${success + errors.length + 1}: ${errorMessage}`);
      }
    }

    return { success, errors };
  }

  async importDenialWorkflowsToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
    // Implementation for denial workflows
    return { success: 0, errors: ['Not implemented yet'] };
  }

  async importPreauthorizationDataToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
    // Implementation for preauthorization data
    return { success: 0, errors: ['Not implemented yet'] };
  }

  async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        transformHeader: (header: string) => header.trim(),
        complete: (result) => {
          if (result.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${result.errors[0].message}`));
          } else {
            resolve(result.data);
          }
        },
        error: (error) => {
          reject(error);
        }
      });
    });
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
        revenue_cycle_accounts: parseInt(String(accountsCount[0]?.count || '0')),
        clinical_decisions: parseInt(String(decisionsCount[0]?.count || '0')),
        denial_workflows: parseInt(String(workflowsCount[0]?.count || '0')),
        preauthorization_data: parseInt(String(preauthCount[0]?.count || '0'))
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

  private parseDate(dateStr: string): Date | null {
    if (!dateStr || dateStr.trim() === '') return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  }

  private parseInteger(str: string): number | null {
    if (!str || str.trim() === '') return null;
    const num = parseInt(str, 10);
    return isNaN(num) ? null : num;
  }

  private parseJSON(str: string): any {
    if (!str || str.trim() === '') return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }
}