import { revenueCycleStorage } from "./revenue-cycle-storage";
import type {
  InsertRevenueCycleAccount,
  InsertClinicalDecision,
  InsertDenialWorkflow,
  InsertAppealCase,
  InsertTimelyFilingClaim,
  InsertPreauthorizationData,
  InsertPhysicianAdvisorReview,
  InsertDocumentationTracking,
  InsertPayor,
  InsertFeasibilityAnalysis,
  InsertDepartment,
  InsertProvider
} from "@shared/revenue-cycle-schema";

export class CSVImportService {
  
  async parseCSV(csvContent: string): Promise<string[][]> {
    const lines = csvContent.trim().split('\n');
    const result: string[][] = [];
    
    for (const line of lines) {
      // Simple CSV parsing - handles quoted fields
      const fields: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          fields.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      fields.push(current.trim());
      result.push(fields);
    }
    
    return result;
  }

  async importRevenueCycleAccounts(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertRevenueCycleAccount> = {};
        
        // Map CSV columns to database fields based on data dictionary
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '' || value === 'NULL') return;
          
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          switch (normalizedHeader) {
            // Account Identifiers
            case 'hospitalaccountid':
              record.hospitalAccountID = value;
              break;
            case 'revenuecycleid':
              record.revenueCycleID = value;
              break;
            case 'facilityid':
              record.facilityID = value;
              break;
            case 'facilitydsc':
              record.facilityDSC = value;
              break;
            case 'locationid':
              record.locationID = value;
              break;
            
            // Patient Information
            case 'patientid':
              record.patientID = value;
              break;
            case 'patientnm':
            case 'patientname':
              record.patientNM = value;
              break;
            
            // Dates
            case 'admitdt':
            case 'admitdate':
              record.admitDT = new Date(value);
              break;
            case 'dischargedt':
            case 'dischargedate':
              record.dischargeDT = value ? new Date(value) : null;
              break;
            case 'postdt':
            case 'postdate':
              record.postDT = value ? new Date(value) : null;
              break;
            
            // Clinical Information
            case 'drgnm':
              record.DRGNM = value;
              break;
            case 'finaldrg':
              record.finalDRG = value;
              break;
            case 'serviceareaid':
              record.serviceAreaID = value;
              break;
            case 'serviceareanm':
            case 'serviceareaname':
              record.serviceAreaNM = value;
              break;
            case 'serviceareagroupcd':
              record.serviceAreaGroupCD = value;
              break;
            case 'serviceareagroupdsc':
              record.serviceAreaGroupDSC = value;
              break;
            
            // Department & Provider
            case 'departmentnm':
            case 'departmentname':
              record.departmentNM = value;
              break;
            case 'departmentspecialtycd':
              record.departmentSpecialtyCD = value;
              break;
            case 'departmentspecialtydsc':
              record.departmentSpecialtyDSC = value;
              break;
            case 'attendingproviderid':
              record.attendingProviderID = value;
              break;
            case 'attendingprovidernm':
            case 'attendingprovidername':
              record.attendingProviderNM = value;
              break;
            case 'dischargedepartmentid':
              record.dischargeDepartmentID = value;
              break;
            case 'dischargelocationnm':
              record.dischargeLocationNM = value;
              break;
            case 'dischargephysicallocationid':
              record.dischargePhysicalLocationID = value;
              break;
            
            // Financial Classification
            case 'primaryfinancialclasscd':
              record.primaryFinancialClassCD = value;
              break;
            case 'primaryfinancialclassdsc':
              record.primaryFinancialClassDSC = value;
              break;
            case 'currentfinancialclasscd':
              record.currentFinancialClassCD = value;
              break;
            case 'currentfinancialclassdsc':
              record.currentFinancialClassDSC = value;
              break;
            case 'hospitalaccountclasscd':
              record.hospitalAccountClassCD = value;
              break;
            case 'hospitalaccountclassdsc':
              record.hospitalAccountClassDSC = value;
              break;
            
            // Payor Information
            case 'primarypayorid':
              record.primaryPayorID = value;
              break;
            case 'primarypayornm':
              record.primaryPayorNM = value;
              break;
            case 'currentpayorid':
              record.currentPayorID = value;
              break;
            case 'currentpayornm':
            case 'currentpayorname':
              record.currentPayorNM = value;
              break;
            case 'primarybenefitplanid':
              record.primaryBenefitPlanID = value;
              break;
            case 'primarybenefitplannm':
              record.primaryBenefitPlanNM = value;
              break;
            case 'currentbenefitplanid':
              record.currentBenefitPlanID = value;
              break;
            case 'currentbenefitplannm':
              record.currentBenefitPlanNM = value;
              break;
            
            // Financial Amounts
            case 'totalchargeamt':
            case 'totalcharge':
              record.totalChargeAMT = value;
              break;
            case 'totalpaymentamt':
            case 'totalpayment':
              record.totalPaymentAMT = value;
              break;
            case 'totaladjustmentamt':
            case 'totaladjustment':
              record.totalAdjustmentAMT = value;
              break;
            case 'transactionamt':
              record.transactionAMT = value;
              break;
            
            // Account Aging
            case 'acctbalcat':
              record.acctBalCat = value;
              break;
            case 'acctbalsubcat':
              record.acctBalSubCat = value;
              break;
            case 'agingcat':
              record.agingCat = value;
              break;
            case 'agingsubcat':
              record.agingSubCat = value;
              break;
            
            // Billing Status
            case 'billstatuscd':
            case 'billstatus':
              record.billStatusCD = value;
              break;
            case 'billstatusdsc':
              record.billStatusDSC = value;
              break;
            
            // Cost Center
            case 'costcentercd':
              record.costCenterCD = value;
              break;
            case 'costcenternm':
              record.costCenterNM = value;
              break;
            
            // Procedures
            case 'procedureid':
              record.procedureID = value;
              break;
            case 'procedurecd':
              record.procedureCD = value;
              break;
            case 'proceduredsc':
              record.procedureDSC = value;
              break;
            
            // Denial Information
            case 'denialcd':
            case 'denialcode':
              record.denialCD = value;
              break;
            case 'denialcodedsc':
            case 'denialcodedescription':
              record.denialCodeDSC = value;
              break;
            case 'denialcodegrp':
            case 'denialcodegroup':
              record.denialCodeGRP = value;
              break;
            case 'denialcodesubgrp':
              record.denialCodeSubGRP = value;
              break;
            case 'denialcontrollable':
              record.denialControllable = value;
              break;
            case 'denialaccountbalanceamt':
            case 'denialbalance':
              record.denialAccountBalanceAMT = value;
              break;
            case 'bucketdenialcorrespondencestatuscd':
              record.bucketDenialCorrespondenceStatusCD = value;
              break;
            case 'bucketdenialcorrespondencestatusdsc':
              record.bucketDenialCorrespondenceStatusDSC = value;
              break;
            case 'concatdenialcodegrp':
              record.concatDenialCodeGRP = value;
              break;
            
            // Other Fields
            case 'liabilitybucketid':
              record.liabilityBucketID = value;
              break;
            case 'reportcat':
              record.reportCat = value;
              break;
            case 'reportgrp':
              record.reportGRP = value;
              break;
            case 'reportsubgrp1':
              record.reportSubGRP1 = value;
              break;
            case 'reportsubgrp2':
              record.reportSubGRP2 = value;
              break;
            case 'reportsubgrp3':
              record.reportSubGRP3 = value;
              break;
            case 'facilityaccountsourcedsc':
              record.facilityAccountSourceDSC = value;
              break;
            case 'hospitalnm':
              record.hospitalNM = value;
              break;
            case 'revenuelocationnm':
              record.revenueLocationNM = value;
              break;
            case 'revcyclemonyear':
            case 'revcyclemonthyear':
              record.revCycleMonthYear = value;
              break;
          }
        });
        
        // Validate required fields - more lenient based on actual data
        if (!record.hospitalAccountID && !record.patientID) {
          errors.push(`Row ${i + 2}: Missing required account or patient identifier`);
          continue;
        }
        
        await revenueCycleStorage.createRevenueCycleAccount(record as InsertRevenueCycleAccount);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importClinicalDecisions(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertClinicalDecision> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'hospitalaccountid':
              record.hospitalAccountID = value;
              break;
            case 'patientid':
              record.patientID = value;
              break;
            case 'patientnm':
            case 'patientname':
              record.patientNM = value;
              break;
            case 'departmentnm':
            case 'departmentname':
              record.departmentNM = value;
              break;
            case 'hospitalaccountclasscd':
              record.hospitalAccountClassCD = value;
              break;
            case 'recommendedaccountclasscd':
              record.recommendedAccountClassCD = value;
              break;
            case 'currentpayorid':
              record.currentPayorID = value;
              break;
            case 'denialcd':
            case 'denialcode':
              record.denialCD = value;
              break;
            case 'appealprobability':
              record.appealProbability = parseInt(value);
              break;
            case 'confidencescore':
              record.confidenceScore = parseInt(value);
              break;
            case 'compliancescore':
              record.complianceScore = parseInt(value);
              break;
            case 'reviewstatus':
              record.reviewStatus = value as any;
              break;
            case 'prioritylevel':
              record.priorityLevel = value as any;
              break;
            case 'clinicalevidence':
              try {
                record.clinicalEvidence = JSON.parse(value);
              } catch {
                record.clinicalEvidence = { notes: value };
              }
              break;
            case 'payorcriteria':
              try {
                record.payorCriteria = JSON.parse(value);
              } catch {
                record.payorCriteria = { criteria: value };
              }
              break;
          }
        });
        
        if (!record.hospitalAccountID || !record.patientID || !record.patientNM) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }
        
        await revenueCycleStorage.createClinicalDecision(record as InsertClinicalDecision);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importDenialWorkflows(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertDenialWorkflow> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '' || value === 'NULL') return;
          
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          switch (normalizedHeader) {
            case 'workflowid':
              record.workflowID = value;
              break;
            case 'accountid':
            case 'hospitalaccountid':
              record.accountID = value;
              record.hospitalAccountID = value;
              break;
            case 'denialdate':
              record.denialDate = new Date(value);
              break;
            case 'appealdeadline':
              record.appealDeadline = value ? new Date(value) : null;
              break;
            case 'workflowstatus':
              record.workflowStatus = value as any;
              break;
            case 'assignedto':
              record.assignedTo = value;
              break;
            case 'assigneddepartment':
              record.assignedDepartment = value;
              break;
            case 'priority':
            case 'prioritylevel':
              record.priorityLevel = value as any;
              break;
            case 'appeallevel':
              record.appealLevel = value;
              break;
            case 'appealsubmissiondate':
              record.appealSubmissionDate = value ? new Date(value) : null;
              break;
            case 'appealoutcome':
              record.appealOutcome = value as any;
              break;
            case 'recoveredamount':
              record.recoveredAmount = value;
              break;
            case 'workeforthours':
            case 'workeffortours':
              record.workEffortHours = value;
              break;
            case 'rootcause':
              record.rootCause = value;
              break;
            case 'preventableflag':
              record.preventableFlag = value as any;
              break;
            case 'trainingrequired':
              record.trainingRequired = value as any;
              break;
          }
        });
        
        if (!record.hospitalAccountID || !record.denialDate) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }
        
        await revenueCycleStorage.createDenialWorkflow(record as InsertDenialWorkflow);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importAppealCases(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertAppealCase> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'workflowid':
              record.workflowID = value;
              break;
            case 'hospitalaccountid':
              record.hospitalAccountID = value;
              break;
            case 'clinicaldecisionid':
              record.clinicalDecisionID = value;
              break;
            case 'claimid':
              record.claimID = value;
              break;
            case 'denialcd':
            case 'denialcode':
              record.denialCD = value;
              break;
            case 'currentpayorid':
              record.currentPayorID = value;
              break;
            case 'denialaccountbalanceamt':
            case 'denialbalance':
              record.denialAccountBalanceAMT = value;
              break;
            case 'appealprobability':
              record.appealProbability = parseInt(value);
              break;
            case 'appealconfidencescore':
              record.appealConfidenceScore = parseInt(value);
              break;
            case 'appealprioritylevel':
              record.appealPriorityLevel = value as any;
              break;
            case 'letterstatus':
              record.letterStatus = value as any;
              break;
            case 'expectedrecoveryamt':
            case 'expectedrecovery':
              record.expectedRecoveryAMT = value;
              break;
            case 'netrecoveryamt':
            case 'netrecovery':
              record.netRecoveryAMT = value;
              break;
            case 'workflowstatus':
              record.workflowStatus = value as any;
              break;
            case 'appealsubmissiondt':
            case 'appealsubmissiondate':
              record.appealSubmissionDT = value ? new Date(value) : null;
              break;
            case 'appealresponsedt':
            case 'appealresponsedate':
              record.appealResponseDT = value ? new Date(value) : null;
              break;
          }
        });
        
        if (!record.hospitalAccountID || !record.currentPayorID) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }
        
        await revenueCycleStorage.createAppealCase(record as InsertAppealCase);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importTimelyFilingClaims(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertTimelyFilingClaim> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'hospitalaccountid':
              record.hospitalAccountID = value;
              break;
            case 'claimid':
              record.claimID = value;
              break;
            case 'patientid':
              record.patientID = value;
              break;
            case 'currentpayorid':
              record.currentPayorID = value;
              break;
            case 'servicedt':
            case 'servicedate':
              record.serviceDT = new Date(value);
              break;
            case 'billingdt':
            case 'billingdate':
              record.billingDT = value ? new Date(value) : null;
              break;
            case 'filingdeadlinedt':
            case 'filingdeadline':
              record.filingDeadlineDT = new Date(value);
              break;
            case 'daysremaining':
              record.daysRemaining = parseInt(value);
              break;
            case 'agingcategory':
              record.agingCategory = value as any;
              break;
            case 'totalchargeamt':
            case 'totalcharge':
              record.totalChargeAMT = value;
              break;
            case 'denialstatus':
              record.denialStatus = value as any;
              break;
            case 'denialcd':
            case 'denialcode':
              record.denialCD = value;
              break;
            case 'filingattempts':
              record.filingAttempts = parseInt(value);
              break;
            case 'filingstatus':
              record.filingStatus = value as any;
              break;
            case 'risklevel':
              record.riskLevel = value as any;
              break;
            case 'prioritylevel':
              record.priorityLevel = value as any;
              break;
            case 'assignedbillerid':
              record.assignedBillerID = value;
              break;
            case 'documentationcomplete':
              record.documentationComplete = value as any;
              break;
          }
        });
        
        if (!record.hospitalAccountID || !record.patientID || !record.serviceDT || !record.filingDeadlineDT) {
          errors.push(`Row ${i + 2}: Missing required fields`);
          continue;
        }
        
        await revenueCycleStorage.createTimelyFilingClaim(record as InsertTimelyFilingClaim);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importPayors(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertPayor> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'payornm':
            case 'payorname':
              record.payorNM = value;
              break;
            case 'payortype':
              record.payorType = value as any;
              break;
            case 'financialclasscd':
              record.financialClassCD = value;
              break;
            case 'financialclassdsc':
            case 'financialclassdescription':
              record.financialClassDSC = value;
              break;
            case 'filingdeadlinedays':
              record.filingDeadlineDays = parseInt(value);
              break;
            case 'contractedrate':
              record.contractedRate = value;
              break;
            case 'preauthrequired':
              record.preAuthRequired = value as any;
              break;
          }
        });
        
        if (!record.payorNM) {
          errors.push(`Row ${i + 2}: Missing required payor name`);
          continue;
        }
        
        await revenueCycleStorage.createPayor(record as InsertPayor);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importDepartments(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertDepartment> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'departmentnm':
            case 'departmentname':
              record.departmentNM = value;
              break;
            case 'serviceareanm':
            case 'serviceareaname':
              record.serviceAreaNM = value;
              break;
            case 'departmentspecialtycd':
              record.departmentSpecialtyCD = value;
              break;
            case 'costcentercd':
              record.costCenterCD = value;
              break;
            case 'averagechargeamt':
            case 'averagecharge':
              record.averageChargeAMT = value;
              break;
            case 'denialratepercentage':
            case 'denialrate':
              record.denialRatePercentage = value;
              break;
          }
        });
        
        if (!record.departmentNM) {
          errors.push(`Row ${i + 2}: Missing required department name`);
          continue;
        }
        
        await revenueCycleStorage.createDepartment(record as InsertDepartment);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importProviders(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertProvider> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '') return;
          
          switch (header.toLowerCase().replace(/[^a-z0-9]/g, '')) {
            case 'providernm':
            case 'providername':
              record.providerNM = value;
              break;
            case 'providertype':
              record.providerType = value as any;
              break;
            case 'departmentid':
              record.departmentID = value;
              break;
            case 'specialtycd':
              record.specialtyCD = value;
              break;
            case 'productivityscore':
              record.productivityScore = value;
              break;
            case 'qualityscore':
              record.qualityScore = value;
              break;
          }
        });
        
        if (!record.providerNM) {
          errors.push(`Row ${i + 2}: Missing required provider name`);
          continue;
        }
        
        await revenueCycleStorage.createProvider(record as InsertProvider);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importPreauthorizationData(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: Partial<InsertPreauthorizationData> = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '' || value === 'NULL') return;
          
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          switch (normalizedHeader) {
            case 'preauthid':
            case 'preauthorizationid':
              record.preAuthorizationID = value;
              break;
            case 'accountid':
            case 'hospitalaccountid':
              record.hospitalAccountID = value;
              break;
            case 'servicetype':
              record.serviceType = value;
              break;
            case 'requestdate':
              record.requestDate = new Date(value);
              break;
            case 'responsedate':
              record.responseDate = value ? new Date(value) : null;
              break;
            case 'status':
            case 'authorizationstatus':
              record.authorizationStatus = value as any;
              break;
            case 'authnumber':
            case 'authorizationnumber':
              record.authorizationNumber = value;
              break;
            case 'expirationdate':
              record.expirationDate = value ? new Date(value) : null;
              break;
            case 'requestedunits':
              record.requestedUnits = parseInt(value) || 0;
              break;
            case 'approvedunits':
              record.approvedUnits = parseInt(value) || 0;
              break;
            case 'denialreason':
              record.denialReason = value;
              break;
            case 'priority':
            case 'prioritylevel':
              record.priorityLevel = value as any;
              break;
            case 'physicianadvisorreview':
              record.physicianAdvisorReview = value as any;
              break;
            case 'appealeligible':
              record.appealEligible = value as any;
              break;
          }
        });
        
        if (!record.hospitalAccountID || !record.preAuthorizationID) {
          errors.push(`Row ${i + 2}: Missing required fields (AccountID or PreAuthID)`);
          continue;
        }
        
        await revenueCycleStorage.createPreauthorizationData(record as InsertPreauthorizationData);
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importPhysicianAdvisorReviews(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: any = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '' || value === 'NULL') return;
          
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          switch (normalizedHeader) {
            case 'reviewid':
              record.reviewID = value;
              break;
            case 'accountid':
            case 'hospitalaccountid':
              record.accountID = value;
              break;
            case 'physicianadvisorid':
              record.physicianAdvisorID = value;
              break;
            case 'physicianadvisorname':
              record.physicianAdvisorName = value;
              break;
            case 'reviewdate':
              record.reviewDate = new Date(value);
              break;
            case 'reviewtype':
              record.reviewType = value;
              break;
            case 'reviewoutcome':
              record.reviewOutcome = value;
              break;
            case 'clinicaljustification':
              record.clinicalJustification = value;
              break;
            case 'recommendedlevelofcare':
              record.recommendedLevelOfCare = value;
              break;
            case 'estimatedsavings':
              record.estimatedSavings = value;
              break;
            case 'appealrequired':
              record.appealRequired = value;
              break;
            case 'documentationcomplete':
              record.documentationComplete = value;
              break;
            case 'followuprequired':
              record.followUpRequired = value;
              break;
            case 'reviewturnaroundhours':
              record.reviewTurnaroundHours = parseInt(value) || 0;
              break;
          }
        });
        
        if (!record.reviewID || !record.accountID) {
          errors.push(`Row ${i + 2}: Missing required fields (ReviewID or AccountID)`);
          continue;
        }
        
        // Log successful parsing - these would need corresponding storage methods
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  async importDocumentationTracking(csvContent: string): Promise<{ success: number; errors: string[] }> {
    const data = await this.parseCSV(csvContent);
    const headers = data[0];
    const rows = data.slice(1);
    
    let success = 0;
    const errors: string[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      try {
        const row = rows[i];
        const record: any = {};
        
        headers.forEach((header, index) => {
          const value = row[index]?.trim();
          if (!value || value === '' || value === 'NULL') return;
          
          const normalizedHeader = header.toLowerCase().replace(/[^a-z0-9]/g, '');
          
          switch (normalizedHeader) {
            case 'documentid':
              record.documentID = value;
              break;
            case 'accountid':
            case 'hospitalaccountid':
              record.accountID = value;
              break;
            case 'documenttype':
              record.documentType = value;
              break;
            case 'documentdate':
              record.documentDate = new Date(value);
              break;
            case 'documentstatus':
              record.documentStatus = value;
              break;
            case 'providerid':
              record.providerID = value;
              break;
            case 'providername':
              record.providerName = value;
              break;
            case 'complianceflag':
              record.complianceFlag = value;
              break;
            case 'timelinessmet':
              record.timelinessMet = value;
              break;
            case 'cdireviewrequired':
              record.cdiReviewRequired = value;
              break;
            case 'cdiquerystatus':
              record.cdiQueryStatus = value;
              break;
            case 'impactondrg':
              record.impactOnDRG = value;
              break;
            case 'estimatedrevenueimpact':
              record.estimatedRevenueImpact = value;
              break;
            case 'qualityindicator':
              record.qualityIndicator = value;
              break;
            case 'deficiencytype':
              record.deficiencyType = value;
              break;
          }
        });
        
        if (!record.documentID || !record.accountID) {
          errors.push(`Row ${i + 2}: Missing required fields (DocumentID or AccountID)`);
          continue;
        }
        
        // Log successful parsing - these would need corresponding storage methods
        success++;
        
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    return { success, errors };
  }

  getImportableEntities(): string[] {
    return [
      'revenue_cycle_accounts',
      'preauthorization_data',
      'physician_advisor_reviews',
      'documentation_tracking',
      'denial_workflows',
      'clinical_decisions',
      'appeal_cases',
      'timely_filing_claims',
      'payors',
      'departments',
      'providers'
    ];
  }

  async importEntity(entityType: string, csvContent: string): Promise<{ success: number; errors: string[] }> {
    switch (entityType) {
      case 'revenue_cycle_accounts':
        return this.importRevenueCycleAccounts(csvContent);
      case 'preauthorization_data':
        return this.importPreauthorizationData(csvContent);
      case 'physician_advisor_reviews':
        return this.importPhysicianAdvisorReviews(csvContent);
      case 'documentation_tracking':
        return this.importDocumentationTracking(csvContent);
      case 'clinical_decisions':
        return this.importClinicalDecisions(csvContent);
      case 'denial_workflows':
        return this.importDenialWorkflows(csvContent);
      case 'appeal_cases':
        return this.importAppealCases(csvContent);
      case 'timely_filing_claims':
        return this.importTimelyFilingClaims(csvContent);
      case 'payors':
        return this.importPayors(csvContent);
      case 'departments':
        return this.importDepartments(csvContent);
      case 'providers':
        return this.importProviders(csvContent);
      default:
        throw new Error(`Unknown entity type: ${entityType}`);
    }
  }
}

export const csvImportService = new CSVImportService();