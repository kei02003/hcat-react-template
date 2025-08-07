import { db } from './db';
import { sql } from 'drizzle-orm';
import Papa from 'papaparse';

export class SimpleCSVImportService {
  async importEntityToDatabase(entityType: string, csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    
    switch (entityType) {
      case 'revenue_cycle_accounts':
        return this.importRevenueCycleAccountsToDatabase(data);
      case 'timely_filing_claims':
        return this.importTimelyFilingClaimsToDatabase(data);
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
          const patientId = row['AttendingProviderID'] || 'UNKNOWN';
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
    }

    return { success, errors };
  }

  async importTimelyFilingClaimsToDatabase(data: any[]): Promise<{ success: number; errors: string[] }> {
    let success = 0;
    const errors: string[] = [];
    
    console.log(`Starting import of ${data.length} timely filing claims records...`);
    
    const BATCH_SIZE = 25;
    
    for (let i = 0; i < data.length; i += BATCH_SIZE) {
      const batch = data.slice(i, Math.min(i + BATCH_SIZE, data.length));
      console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(data.length / BATCH_SIZE)} (records ${i + 1}-${Math.min(i + BATCH_SIZE, data.length)})...`);
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        try {
          const timelyFilingId = row['TimelyFilingID'] || `TF_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          const hospitalAccountId = row['HospitalAccountID'] || null;
          const claimId = row['ClaimID'] || null;
          const patientId = row['PatientID'] || null;
          const patientName = row['PatientNM'] || null;
          const accountNumber = row['AccountNumber'] || null;
          const totalChargeAmount = row['TotalChargeAMT'] || null;
          const currentPayorId = row['CurrentPayorID'] || null;
          const currentPayorName = row['CurrentPayorNM'] || null;
          const currentFinancialClassCode = row['CurrentFinancialClassCD'] || null;
          const currentFinancialClassDesc = row['CurrentFinancialClassDSC'] || null;
          const serviceDate = this.parseDate(row['ServiceDT']) || null;
          const billingDate = this.parseDate(row['BillingDT']) || null;
          const filingDeadlineDate = this.parseDate(row['FilingDeadlineDT']) || null;
          const lastFilingDate = this.parseDate(row['LastFilingDT']) || null;
          const daysRemaining = this.parseInteger(row['DaysRemaining']) || null;
          const daysFromService = this.parseInteger(row['DaysFromService']) || null;
          const agingCategory = row['AgingCategory'] || null;
          const agingDays = this.parseInteger(row['AgingDays']) || null;
          const departmentName = row['DepartmentNM'] || null;
          const serviceAreaName = row['ServiceAreaNM'] || null;
          const procedureCode = row['ProcedureCD'] || null;
          const procedureDesc = row['ProcedureDSC'] || null;
          const denialStatus = row['DenialStatus'] || null;
          const denialCode = row['DenialCD'] || null;
          const denialCodeDesc = row['DenialCodeDSC'] || null;
          const denialCodeGroup = row['DenialCodeGRP'] || null;
          const denialDate = this.parseDate(row['DenialDT']) || null;
          const denialAccountBalanceAmount = row['DenialAccountBalanceAMT'] || null;
          const denialControllable = row['DenialControllable'] || null;
          const filingAttempts = this.parseInteger(row['FilingAttempts']) || null;
          const firstFilingDate = this.parseDate(row['FirstFilingDT']) || null;
          const filingDelayDays = this.parseInteger(row['FilingDelayDays']) || null;
          const filingStatus = row['FilingStatus'] || null;

          // Log the data being inserted for the first few records
          if (success < 3) {
            console.log(`Inserting record ${success + 1}:`, {
              timelyFilingId,
              hospitalAccountId,
              claimId,
              patientId,
              currentPayorId,
              serviceDate,
              billingDate,
              filingDeadlineDate,
              daysRemaining,
              agingCategory,
              totalChargeAmount,
              denialStatus,
              denialCode,
              filingAttempts,
              filingStatus
            });
          }

          await db.execute(sql`
            INSERT INTO timely_filing_claims (
              timelyfilingid,
              hospitalaccountid,
              claimid,
              patientid,
              currentpayorid,
              servicedt,
              billingdt,
              filingdeadlinedt,
              daysremaining,
              agingcategory,
              totalchargeamt,
              denialstatus,
              denialcd,
              filingattempts,
              filingstatus,
              createddt,
              updateddt
            ) VALUES (
              ${timelyFilingId},
              ${hospitalAccountId},
              ${claimId},
              ${patientId},
              ${currentPayorId},
              ${serviceDate},
              ${billingDate},
              ${filingDeadlineDate},
              ${daysRemaining},
              ${agingCategory},
              ${totalChargeAmount},
              ${denialStatus},
              ${denialCode},
              ${filingAttempts},
              ${filingStatus},
              ${new Date()},
              ${new Date()}
            ) ON CONFLICT (timelyfilingid) DO NOTHING
          `);
          success++;
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          errors.push(`Row ${i + j + 1}: ${errorMessage}`);
        }
      }
    }

    return { success, errors };
  }

  async parseCSV(content: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      Papa.parse(content, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results.data as any[]);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
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

  async getTableCounts(): Promise<Record<string, number>> {
    try {
      const result = await db.execute(sql`
        SELECT 
          (SELECT COUNT(*) FROM revenue_cycle_accounts) as revenue_cycle_accounts,
          (SELECT COUNT(*) FROM clinical_decisions) as clinical_decisions,
          (SELECT COUNT(*) FROM timely_filing_claims) as timely_filing_claims,
          0 as denial_workflows,
          0 as preauthorization_data
      `);

      const counts = result.rows[0] as any;
      return {
        revenue_cycle_accounts: parseInt(String(counts.revenue_cycle_accounts || '0')),
        clinical_decisions: parseInt(String(counts.clinical_decisions || '0')),
        timely_filing_claims: parseInt(String(counts.timely_filing_claims || '0')),
        denial_workflows: 0,
        preauthorization_data: 0
      };
    } catch (error) {
      console.error('Error getting table counts:', error);
      return {
        revenue_cycle_accounts: 0,
        clinical_decisions: 0,
        timely_filing_claims: 0,
        denial_workflows: 0,
        preauthorization_data: 0
      };
    }
  }
}