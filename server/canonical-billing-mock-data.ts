import {
  type InsertTransaction,
  type InsertAccount,
  type InsertPayer,
  type InsertBenefitPlan,
  type InsertProcedure,
  type InsertDiagnosis,
  type InsertDenialRemark
} from "@shared/schema";

// Realistic Healthcare Mock Data Generators for Canonical Billing Models

// Phase 1: Core Billing Foundation

export function generateSamplePayers(): InsertPayer[] {
  const now = new Date();
  return [
    {
      payer_key: "PAY-MEDICARE-001",
      payer_name: "Medicare Part A & B",
      financial_class_code: "government",
      org_id: "HC001",
      payer_type: "government",
      contact_info: "medicare.gov | 1-800-MEDICARE",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-BCBS-TX-001",
      payer_name: "Blue Cross Blue Shield of Texas",
      financial_class_code: "commercial",
      org_id: "HC001",
      payer_type: "commercial",
      contact_info: "bcbstx.com | 1-800-521-2227",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-AETNA-001",
      payer_name: "Aetna Better Health",
      financial_class_code: "commercial",
      org_id: "HC001",
      payer_type: "managed_care",
      contact_info: "aetna.com | 1-800-872-3862",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-UHC-001",
      payer_name: "UnitedHealthcare",
      financial_class_code: "commercial",
      org_id: "HC001",
      payer_type: "commercial",
      contact_info: "uhc.com | 1-888-815-2005",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-MEDICAID-TX-001",
      payer_name: "Texas Medicaid",
      financial_class_code: "medicaid",
      org_id: "HC001",
      payer_type: "government",
      contact_info: "hhs.texas.gov | 1-800-252-8263",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-SELFPAY-001",
      payer_name: "Self Pay / Uninsured",
      financial_class_code: "selfpay",
      org_id: "HC001",
      payer_type: "commercial",
      contact_info: "Patient Responsibility",
      electronic_filing: false,
      meta_updated: now,
      meta_created: now,
      meta_source: "billing_system"
    },
    // Add payers for other organizations
    {
      payer_key: "PAY-HUMANA-002",
      payer_name: "Humana Medicare Advantage",
      financial_class_code: "medicare",
      org_id: "HC002",
      payer_type: "managed_care",
      contact_info: "humana.com | 1-800-457-4708",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    },
    {
      payer_key: "PAY-CIGNA-PMC001",
      payer_name: "Cigna HealthCare",
      financial_class_code: "commercial",
      org_id: "PMC001",
      payer_type: "commercial",
      contact_info: "cigna.com | 1-800-244-6224",
      electronic_filing: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "payer_registry"
    }
  ];
}

export function generateSampleBenefitPlans(): InsertBenefitPlan[] {
  const now = new Date();
  const today = new Date();
  const nextYear = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());
  
  return [
    {
      benefit_plan_key: "PLAN-MEDICARE-A-001",
      payer_key: "PAY-MEDICARE-001",
      plan_name: "Medicare Part A - Hospital Insurance",
      coverage_type_code: "Indemnity",
      org_id: "HC001",
      effective_date: today,
      termination_date: nextYear,
      is_active: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "benefits_verification"
    },
    {
      benefit_plan_key: "PLAN-BCBS-PPO-001",
      payer_key: "PAY-BCBS-TX-001",
      plan_name: "Blue Cross PPO Plus",
      coverage_type_code: "PPO",
      org_id: "HC001",
      effective_date: today,
      termination_date: nextYear,
      is_active: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "benefits_verification"
    },
    {
      benefit_plan_key: "PLAN-AETNA-HMO-001",
      payer_key: "PAY-AETNA-001",
      plan_name: "Aetna HMO Select",
      coverage_type_code: "HMO",
      org_id: "HC001",
      effective_date: today,
      termination_date: nextYear,
      is_active: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "benefits_verification"
    },
    {
      benefit_plan_key: "PLAN-UHC-EPO-001",
      payer_key: "PAY-UHC-001",
      plan_name: "UnitedHealthcare EPO",
      coverage_type_code: "EPO",
      org_id: "HC001",
      effective_date: today,
      termination_date: nextYear,
      is_active: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "benefits_verification"
    },
    {
      benefit_plan_key: "PLAN-MEDICAID-TX-001",
      payer_key: "PAY-MEDICAID-TX-001",
      plan_name: "Texas Medicaid Traditional",
      coverage_type_code: "HMO",
      org_id: "HC001",
      effective_date: today,
      termination_date: nextYear,
      is_active: true,
      meta_updated: now,
      meta_created: now,
      meta_source: "benefits_verification"
    }
  ];
}

export function generateSampleAccounts(): InsertAccount[] {
  const now = new Date();
  const payers = ["PAY-MEDICARE-001", "PAY-BCBS-TX-001", "PAY-AETNA-001", "PAY-UHC-001", "PAY-MEDICAID-TX-001", "PAY-SELFPAY-001"];
  const plans = ["PLAN-MEDICARE-A-001", "PLAN-BCBS-PPO-001", "PLAN-AETNA-HMO-001", "PAY-UHC-EPO-001", "PLAN-MEDICAID-TX-001"];
  const organizations = ["HC001", "HC002", "PMC001"];
  const entities = ["entity_main", "entity_north", "entity_south"];
  
  const accounts: InsertAccount[] = [];
  
  organizations.forEach((orgId, orgIndex) => {
    entities.forEach((entityId, entityIndex) => {
      // Generate 5 accounts per org/entity combination (45 total accounts)
      for (let i = 0; i < 5; i++) {
        const accountIndex = orgIndex * 15 + entityIndex * 5 + i;
        const payerIndex = accountIndex % payers.length;
        const planIndex = accountIndex % plans.length;
        
        // Create realistic financial values
        const baseCharges = 2500 + (accountIndex * 347) % 15000; // $2.5K to $17.5K
        const paymentRate = 0.75 + (accountIndex * 0.03) % 0.25; // 75-100% payment rate
        const totalPayments = baseCharges * paymentRate;
        const adjustments = (baseCharges - totalPayments) * 0.6; // Some contractual adjustments
        const currentBalance = baseCharges - totalPayments - adjustments;
        
        // Set admission/discharge dates for realistic encounters
        const admitDate = new Date(now.getTime() - (30 + accountIndex * 2) * 24 * 60 * 60 * 1000);
        const dischargeDate = new Date(admitDate.getTime() + (1 + accountIndex % 5) * 24 * 60 * 60 * 1000);
        
        accounts.push({
          billing_account_key: `ACCT-${orgId}-${entityId}-${String(i + 1).padStart(3, '0')}`,
          patient_key: `PAT-${orgId}-${String(accountIndex + 1000).padStart(6, '0')}`,
          primary_encounter_key: `ENC-${orgId}-${String(accountIndex + 1).padStart(8, '0')}`,
          primary_payer_key: payers[payerIndex],
          primary_benefit_plan_key: planIndex < plans.length ? plans[planIndex] : undefined,
          attending_provider_key: `PROV-${orgId}-${String((accountIndex % 20) + 1).padStart(3, '0')}`,
          billing_location_key: `LOC-${orgId}-${entityId}`,
          org_id: orgId,
          entity_id: entityId,
          status_code: currentBalance > 0 ? "open" : "closed",
          billing_status_code: currentBalance > 0 ? "billed" : "closed",
          financial_class_code: payers[payerIndex].includes("MEDICARE") ? "medicare" : 
                                payers[payerIndex].includes("MEDICAID") ? "medicaid" :
                                payers[payerIndex].includes("SELFPAY") ? "selfpay" : "commercial",
          class_code: accountIndex % 3 === 0 ? "inpatient" : accountIndex % 3 === 1 ? "outpatient" : "emergency",
          admit_source_code: accountIndex % 4 === 0 ? "emergency_room" : "physician_referral",
          admit_priority_code: accountIndex % 5 === 0 ? "urgent" : "routine",
          discharge_disposition_code: accountIndex % 6 === 0 ? "home" : accountIndex % 6 === 1 ? "snf" : "home_health",
          current_balance: currentBalance.toFixed(2),
          total_charges: baseCharges.toFixed(2),
          total_payments: totalPayments.toFixed(2),
          total_adjustments: adjustments.toFixed(2),
          admit_datetime: admitDate,
          discharge_datetime: dischargeDate,
          meta_updated: now,
          meta_created: now,
          meta_source: "billing_system"
        });
      }
    });
  });
  
  return accounts;
}

export function generateSampleTransactions(accounts: InsertAccount[]): InsertTransaction[] {
  const now = new Date();
  const transactions: InsertTransaction[] = [];
  
  // Common CPT codes for realistic healthcare billing
  const commonCPTCodes = [
    { code: "99213", description: "Office visit, established patient, moderate complexity", amount: 165.00 },
    { code: "99214", description: "Office visit, established patient, moderate to high complexity", amount: 225.00 },
    { code: "99223", description: "Initial hospital care, high complexity", amount: 425.00 },
    { code: "73721", description: "MRI knee without contrast", amount: 1250.00 },
    { code: "80053", description: "Comprehensive metabolic panel", amount: 35.00 },
    { code: "85025", description: "Complete blood count with differential", amount: 25.00 },
    { code: "36415", description: "Venipuncture for collection", amount: 15.00 },
    { code: "29881", description: "Arthroscopy, knee, surgical", amount: 2150.00 },
    { code: "45378", description: "Colonoscopy, flexible, diagnostic", amount: 850.00 },
    { code: "77057", description: "Screening mammography, bilateral", amount: 280.00 }
  ];
  
  accounts.forEach((account, accountIndex) => {
    const numCharges = 2 + (accountIndex % 4); // 2-5 charges per account
    let accountTotal = 0;
    
    // Generate charge transactions
    for (let i = 0; i < numCharges; i++) {
      const cptIndex = (accountIndex + i) % commonCPTCodes.length;
      const cptInfo = commonCPTCodes[cptIndex];
      const serviceDate = new Date((account.admit_datetime || now).getTime() + i * 24 * 60 * 60 * 1000);
      
      const chargeAmount = cptInfo.amount * (0.9 + Math.random() * 0.2); // ±10% variation
      accountTotal += chargeAmount;
      
      transactions.push({
        transaction_key: `TXN-CHARGE-${account.billing_account_key}-${String(i + 1).padStart(3, '0')}`,
        billing_account_key: account.billing_account_key,
        encounter_key: account.primary_encounter_key,
        patient_key: account.patient_key,
        performing_provider_key: account.attending_provider_key,
        billing_provider_key: account.attending_provider_key,
        payer_key: account.primary_payer_key,
        benefit_plan_key: account.primary_benefit_plan_key,
        org_id: account.org_id,
        entity_id: account.entity_id,
        amount: chargeAmount.toFixed(2),
        quantity: "1.00",
        type_code: "charge",
        currency_code: "USD",
        financial_class_code: account.financial_class_code,
        cpt_code: cptInfo.code,
        hcpcs_code: undefined,
        ndc_code: undefined,
        ubrev_code: undefined,
        cpt_modifiers: i % 3 === 0 ? "25" : undefined, // Some modifiers for realism
        service_date: serviceDate,
        post_date: new Date(serviceDate.getTime() + 2 * 24 * 60 * 60 * 1000), // Posted 2 days later
        meta_updated: now,
        meta_created: now,
        meta_source: "billing_system"
      });
    }
    
    // Generate payment transactions
    const paymentAmount = accountTotal * (0.7 + Math.random() * 0.25); // 70-95% payment
    if (paymentAmount > 0) {
      transactions.push({
        transaction_key: `TXN-PAYMENT-${account.billing_account_key}-001`,
        billing_account_key: account.billing_account_key,
        encounter_key: account.primary_encounter_key,
        patient_key: account.patient_key,
        performing_provider_key: undefined,
        billing_provider_key: undefined,
        payer_key: account.primary_payer_key,
        benefit_plan_key: account.primary_benefit_plan_key,
        org_id: account.org_id,
        entity_id: account.entity_id,
        amount: paymentAmount.toFixed(2),
        quantity: "1.00",
        type_code: "payment",
        currency_code: "USD",
        financial_class_code: account.financial_class_code,
        cpt_code: undefined,
        hcpcs_code: undefined,
        ndc_code: undefined,
        ubrev_code: undefined,
        cpt_modifiers: undefined,
        service_date: account.admit_datetime || now,
        post_date: new Date(now.getTime() - (10 + accountIndex) * 24 * 60 * 60 * 1000), // Payment received 10+ days ago
        meta_updated: now,
        meta_created: now,
        meta_source: "era_processing"
      });
    }
    
    // Generate contractual adjustments
    const adjustmentAmount = accountTotal * (0.1 + Math.random() * 0.15); // 10-25% adjustment
    if (adjustmentAmount > 0) {
      transactions.push({
        transaction_key: `TXN-ADJUSTMENT-${account.billing_account_key}-001`,
        billing_account_key: account.billing_account_key,
        encounter_key: account.primary_encounter_key,
        patient_key: account.patient_key,
        performing_provider_key: undefined,
        billing_provider_key: undefined,
        payer_key: account.primary_payer_key,
        benefit_plan_key: account.primary_benefit_plan_key,
        org_id: account.org_id,
        entity_id: account.entity_id,
        amount: adjustmentAmount.toFixed(2),
        quantity: "1.00",
        type_code: "adjustment",
        currency_code: "USD",
        financial_class_code: account.financial_class_code,
        cpt_code: undefined,
        hcpcs_code: undefined,
        ndc_code: undefined,
        ubrev_code: undefined,
        cpt_modifiers: undefined,
        service_date: account.admit_datetime || now,
        post_date: new Date(now.getTime() - (5 + accountIndex) * 24 * 60 * 60 * 1000), // Adjustment processed 5+ days ago
        meta_updated: now,
        meta_created: now,
        meta_source: "era_processing"
      });
    }
  });
  
  return transactions;
}

// Phase 2: Clinical Integration
export function generateSampleProcedures(accounts: InsertAccount[]): InsertProcedure[] {
  const now = new Date();
  const procedures: InsertProcedure[] = [];
  
  const procedureTemplates = [
    { cpt: "99213", icd: "Z00.00", category: "diagnostic", principal: false },
    { cpt: "99223", icd: "I25.10", category: "diagnostic", principal: true },
    { cpt: "29881", icd: "M23.91", category: "surgical", principal: true },
    { cpt: "45378", icd: "K63.5", category: "diagnostic", principal: true },
    { cpt: "73721", icd: "M25.561", category: "diagnostic", principal: false },
    { cpt: "77057", icd: "Z12.31", category: "diagnostic", principal: false }
  ];
  
  accounts.forEach((account, accountIndex) => {
    const numProcedures = 1 + (accountIndex % 3); // 1-3 procedures per account
    
    for (let i = 0; i < numProcedures; i++) {
      const templateIndex = (accountIndex + i) % procedureTemplates.length;
      const template = procedureTemplates[templateIndex];
      const performedDate = account.admit_datetime || new Date(now.getTime() - accountIndex * 24 * 60 * 60 * 1000);
      
      procedures.push({
        procedure_key: `PROC-${account.billing_account_key}-${String(i + 1).padStart(3, '0')}`,
        patient_key: account.patient_key,
        billing_account_key: account.billing_account_key,
        performing_provider_key: account.attending_provider_key,
        org_id: account.org_id,
        entity_id: account.entity_id,
        procedure_rank: i + 1,
        is_principal: i === 0 && template.principal,
        category_code: template.category,
        cpt_code: template.cpt,
        local_code: undefined,
        icd_code: template.icd,
        performed_datetime: performedDate,
        recorded_datetime: new Date(performedDate.getTime() + 60 * 60 * 1000), // Recorded 1 hour later
        meta_updated: now,
        meta_created: now,
        meta_source: "clinical_system"
      });
    }
  });
  
  return procedures;
}

export function generateSampleDiagnoses(accounts: InsertAccount[]): InsertDiagnosis[] {
  const now = new Date();
  const diagnoses: InsertDiagnosis[] = [];
  
  const diagnosisTemplates = [
    { icd: "I25.10", description: "Atherosclerotic heart disease", principal: true },
    { icd: "E11.9", description: "Type 2 diabetes mellitus", principal: false },
    { icd: "I10", description: "Essential hypertension", principal: false },
    { icd: "M79.89", description: "Other specified soft tissue disorders", principal: false },
    { icd: "Z51.11", description: "Encounter for antineoplastic chemotherapy", principal: true },
    { icd: "K21.9", description: "Gastro-esophageal reflux disease", principal: false },
    { icd: "M25.561", description: "Pain in knee", principal: true },
    { icd: "J44.1", description: "Chronic obstructive pulmonary disease", principal: false }
  ];
  
  accounts.forEach((account, accountIndex) => {
    const numDiagnoses = 1 + (accountIndex % 4); // 1-4 diagnoses per account
    
    for (let i = 0; i < numDiagnoses; i++) {
      const templateIndex = (accountIndex + i) % diagnosisTemplates.length;
      const template = diagnosisTemplates[templateIndex];
      const diagnosisDate = account.admit_datetime || new Date(now.getTime() - accountIndex * 24 * 60 * 60 * 1000);
      
      diagnoses.push({
        diagnosis_key: `DIAG-${account.billing_account_key}-${String(i + 1).padStart(3, '0')}`,
        billing_account_key: account.billing_account_key,
        patient_key: account.patient_key,
        org_id: account.org_id,
        entity_id: account.entity_id,
        diagnosis_rank: i + 1,
        is_principal: i === 0 && template.principal,
        local_code: undefined,
        icd_code: template.icd,
        use_code: i === 0 ? "final" : "working",
        present_on_admit_code: accountIndex % 4 === 0 ? "Y" : accountIndex % 4 === 1 ? "N" : "U",
        diagnosis_datetime: diagnosisDate,
        recorded_datetime: new Date(diagnosisDate.getTime() + 30 * 60 * 1000), // Recorded 30 minutes later
        meta_updated: now,
        meta_created: now,
        meta_source: "clinical_system"
      });
    }
  });
  
  return diagnoses;
}

// Phase 3: Denial & Appeal Workflow
export function generateSampleDenialRemarks(transactions: InsertTransaction[]): InsertDenialRemark[] {
  const now = new Date();
  const denialRemarks: InsertDenialRemark[] = [];
  
  // Realistic denial codes and categories
  const denialTemplates = [
    { external_code: "CO-16", category: "medical_necessity", type: "denial", preventable: true },
    { external_code: "CO-197", category: "authorization", type: "denial", preventable: true },
    { external_code: "CO-4", category: "coding", type: "denial", preventable: true },
    { external_code: "CO-29", category: "timely_filing", type: "denial", preventable: false },
    { external_code: "CO-96", category: "eligibility", type: "denial", preventable: false },
    { external_code: "N-30", category: "documentation", type: "remark", preventable: true }
  ];
  
  // Generate denials for about 15% of charge transactions
  const chargeTransactions = transactions.filter(t => t.type_code === "charge");
  const deniedTransactions = chargeTransactions.filter((_, index) => index % 7 === 0); // ~14% denial rate
  
  deniedTransactions.forEach((transaction, index) => {
    const templateIndex = index % denialTemplates.length;
    const template = denialTemplates[templateIndex];
    const receivedDate = new Date(now.getTime() - (20 + index * 2) * 24 * 60 * 60 * 1000);
    const appealDeadline = new Date(receivedDate.getTime() + 365 * 24 * 60 * 60 * 1000); // 365 days to appeal
    
    denialRemarks.push({
      denial_remark_key: `DENIAL-${transaction.transaction_key}-001`,
      transaction_key: transaction.transaction_key,
      org_id: transaction.org_id,
      entity_id: transaction.entity_id,
      active: true,
      is_preventable: template.preventable,
      external_code: template.external_code,
      status_code: index % 5 === 0 ? "resolved" : index % 5 === 1 ? "appealed" : "active",
      type_code: template.type,
      category_code: template.category,
      received_datetime: receivedDate,
      resolved_datetime: index % 5 === 0 ? new Date(receivedDate.getTime() + 30 * 24 * 60 * 60 * 1000) : undefined,
      appeal_status: index % 4 === 0 ? "submitted" : index % 4 === 1 ? "approved" : index % 4 === 2 ? "denied" : undefined,
      appeal_deadline: appealDeadline,
      appeal_submitted_date: index % 3 === 0 ? new Date(receivedDate.getTime() + 15 * 24 * 60 * 60 * 1000) : undefined,
      meta_updated: now,
      meta_created: now,
      meta_source: "era_processing"
    });
  });
  
  return denialRemarks;
}

export function generateAllBillingMockData() {
  console.log("Generating comprehensive billing mock data...");
  
  // Phase 1: Core Billing Foundation
  const payers = generateSamplePayers();
  const benefitPlans = generateSampleBenefitPlans();
  const accounts = generateSampleAccounts();
  const transactions = generateSampleTransactions(accounts);
  
  // Phase 2: Clinical Integration
  const procedures = generateSampleProcedures(accounts);
  const diagnoses = generateSampleDiagnoses(accounts);
  
  // Phase 3: Denial & Appeal Workflow
  const denialRemarks = generateSampleDenialRemarks(transactions);
  
  return {
    payers,
    benefitPlans,
    accounts,
    transactions,
    procedures,
    diagnoses,
    denialRemarks,
    summary: {
      payers: payers.length,
      benefitPlans: benefitPlans.length,
      accounts: accounts.length,
      transactions: transactions.length,
      procedures: procedures.length,
      diagnoses: diagnoses.length,
      denialRemarks: denialRemarks.length
    }
  };
}