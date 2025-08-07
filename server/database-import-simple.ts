import { db } from "./db";
import { sql } from "drizzle-orm";
import Papa from "papaparse";

export class SimpleCSVImportService {
  async importEntityToDatabase(entityType: string, csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    
    switch (entityType) {
      case 'revenue_cycle_accounts':
        return this.importRevenueCycleAccountsToDatabase(data);
      default:
        throw new Error(`Unsupported entity type: ${entityType}`);
    }
  }

  async importRevenueCycleAccountsToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
    let success = 0;
    const errors: string[] = [];
    
    for (const row of data) {
      try {
        // Use simple SQL insert that matches existing table structure
        await db.execute(sql`
          INSERT INTO revenue_cycle_accounts (
            hospital_account_id, 
            revenue_cycle_id,
            patient_id, 
            patient_nm,
            admit_dt, 
            discharge_dt,
            current_payor_id, 
            current_payor_nm,
            attending_provider_id, 
            attending_provider_nm,
            bill_status_cd,
            total_charge_amt,
            payor_balance_amt,
            patient_balance_amt,
            financial_class_cd,
            financial_class_dsc,
            ar_aging_days,
            liability_bucket_id,
            report_cat,
            report_grp,
            report_sub_grp1,
            report_sub_grp2,
            report_sub_grp3,
            facility_account_source_dsc,
            hospital_nm,
            revenue_location_nm,
            rev_cycle_month_year
          ) VALUES (
            ${row['Hospital Account ID'] || `HSP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`},
            ${row['Revenue Cycle ID'] || null},
            ${row['Patient ID'] || 'UNKNOWN'},
            ${row['Patient Name'] || 'UNKNOWN'},
            ${this.parseDate(row['Admit Date']) || new Date()},
            ${this.parseDate(row['Discharge Date']) || null},
            ${row['Current Payor ID'] || 'UNKNOWN'},
            ${row['Current Payor Name'] || 'UNKNOWN'},
            ${row['Attending Provider ID'] || null},
            ${row['Attending Provider Name'] || null},
            ${row['Bill Status Code'] || null},
            ${row['Total Charge Amount'] || null},
            ${row['Payor Balance Amount'] || null},
            ${row['Patient Balance Amount'] || null},
            ${row['Financial Class Code'] || null},
            ${row['Financial Class Description'] || null},
            ${this.parseInteger(row['AR Aging Days']) || null},
            ${row['Liability Bucket ID'] || null},
            ${row['Report Category'] || null},
            ${row['Report Group'] || null},
            ${row['Report Sub Group 1'] || null},
            ${row['Report Sub Group 2'] || null},
            ${row['Report Sub Group 3'] || null},
            ${row['Facility Account Source Description'] || null},
            ${row['Hospital Name'] || null},
            ${row['Revenue Location Name'] || null},
            ${row['Revenue Cycle Month Year'] || null}
          ) ON CONFLICT (hospital_account_id) DO NOTHING
        `);
        success++;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        errors.push(`Row ${success + errors.length + 1}: ${errorMessage}`);
      }
    }

    return { success, errors };
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
      const result = await db.execute(sql`
        SELECT 
          (SELECT COUNT(*) FROM revenue_cycle_accounts) as revenue_cycle_accounts,
          (SELECT COUNT(*) FROM clinical_decisions) as clinical_decisions,
          0 as denial_workflows,
          0 as preauthorization_data
      `);

      const counts = result.rows[0] as any;
      return {
        revenue_cycle_accounts: parseInt(String(counts.revenue_cycle_accounts || '0')),
        clinical_decisions: parseInt(String(counts.clinical_decisions || '0')),
        denial_workflows: 0,
        preauthorization_data: 0
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
}