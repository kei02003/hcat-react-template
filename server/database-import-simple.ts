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
    
    console.log(`Starting import of ${data.length} revenue cycle records...`);
    
    // Process in batches for better performance
    const BATCH_SIZE = 50;
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length));
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(data.length / BATCH_SIZE)} (records ${i + 1}-${Math.min(i + BATCH_SIZE, data.length)})...`);
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
      try {
        // Map actual CSV column names to database schema
        const accountId = row['HospitalAccountID'] || row['Hospital Account ID'] || `HSP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const revenueCycleId = row['RevenueCycleID'] || row['Revenue Cycle ID'] || null;
        const patientId = row['AttendingProviderID'] || 'UNKNOWN'; // Using provider as patient for now
        const patientName = row['AttendingProviderNM'] || 'UNKNOWN';
        const admitDate = this.parseDate(row['AdmitDT'] || row['Admit Date']) || new Date();
        const dischargeDate = this.parseDate(row['DischargeDT'] || row['Discharge Date']) || null;
        const currentPayorId = row['CurrentPayorID'] || row['Current Payor ID'] || 'UNKNOWN';
        const currentPayorName = row['CurrentPayorNM'] || row['Current Payor Name'] || 'UNKNOWN';
        const attendingProviderId = row['AttendingProviderID'] || row['Attending Provider ID'] || null;
        const attendingProviderName = row['AttendingProviderNM'] || row['Attending Provider Name'] || null;
        const billStatusCode = row['BillStatusCD'] || row['Bill Status Code'] || null;
        const totalChargeAmount = row['TotalChargeAMT'] || row['Total Charge Amount'] || null;
        const payorBalanceAmount = row['TransactionAMT'] || row['Payor Balance Amount'] || null;
        const patientBalanceAmount = row['TotalAdjustmentAMT'] || row['Patient Balance Amount'] || null;
        const financialClassCode = row['CurrentFinancialClassCD'] || row['Financial Class Code'] || null;
        const financialClassDesc = row['CurrentFinancialClassDSC'] || row['Financial Class Description'] || null;
        const arAgingDays = this.parseAgingDays(row['AcctBalCat'] || row['AR Aging Days']) || null;
        const liabilityBucketId = row['LiabilityBucketID'] || row['Liability Bucket ID'] || null;
        const reportCategory = row['ReportCat'] || row['Report Category'] || null;
        const reportGroup = row['ReportGRP'] || row['Report Group'] || null;
        const reportSubGroup1 = row['ReportSubGRP1'] || row['Report Sub Group 1'] || null;
        const reportSubGroup2 = row['ReportSubGRP2'] || row['Report Sub Group 2'] || null;
        const reportSubGroup3 = row['ReportSubGRP3'] || row['Report Sub Group 3'] || null;
        const facilityAccountSourceDesc = row['FacilityAccountSourceDSC'] || row['Facility Account Source Description'] || null;
        const hospitalName = row['HospitalNM'] || row['Hospital Name'] || null;
        const revenueLocationName = row['RevenueLocationNM'] || row['Revenue Location Name'] || null;
        const revCycleMonthYear = row['RevCycle Month Year'] || row['Revenue Cycle Month Year'] || null;

        // Use simple SQL insert that matches existing table structure
        await db.execute(sql`
          INSERT INTO revenue_cycle_accounts (
            hospitalaccountid, 
            revenuecycleid,
            attendingproviderid, 
            attendingprovidernm,
            admitdt, 
            dischargedt,
            currentpayorid, 
            currentpayornm,
            billstatuscd,
            totalchargeamt,
            transactionamt,
            totaladjustmentamt,
            currentfinancialclasscd,
            currentfinancialclassdsc,
            acctbalcat,
            liabilitybucketid,
            reportcat,
            reportgrp,
            reportsubgrp1,
            reportsubgrp2,
            reportsubgrp3,
            facilityaccountsourcedsc,
            hospitalnm,
            revenuelocationnm,
            revcyclemonthyear
          ) VALUES (
            ${accountId},
            ${revenueCycleId},
            ${attendingProviderId},
            ${attendingProviderName},
            ${admitDate},
            ${dischargeDate},
            ${currentPayorId},
            ${currentPayorName},
            ${billStatusCode},
            ${totalChargeAmount},
            ${payorBalanceAmount},
            ${patientBalanceAmount},
            ${financialClassCode},
            ${financialClassDesc},
            ${row['AcctBalCat'] || null},
            ${liabilityBucketId},
            ${reportCategory},
            ${reportGroup},
            ${reportSubGroup1},
            ${reportSubGroup2},
            ${reportSubGroup3},
            ${facilityAccountSourceDesc},
            ${hospitalName},
            ${revenueLocationName},
            ${revCycleMonthYear}
          ) ON CONFLICT (hospitalaccountid) DO NOTHING
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

  private parseAgingDays(agingStr: string): number | null {
    if (!agingStr || agingStr.trim() === '') return null;
    
    // Handle aging categories like "120+", "91-120", "0-30", etc.
    if (agingStr.includes('+')) {
      const num = parseInt(agingStr.replace('+', ''), 10);
      return isNaN(num) ? null : num;
    }
    
    if (agingStr.includes('-')) {
      const parts = agingStr.split('-');
      const endNum = parseInt(parts[1], 10);
      return isNaN(endNum) ? null : endNum;
    }
    
    const num = parseInt(agingStr, 10);
    return isNaN(num) ? null : num;
  }
}