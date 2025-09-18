import { 
  type InsertClaimHeader,
  type InsertClaimLine,
  type InsertClaimStatus,
  type InsertRemittance,
  type InsertPriorAuth,
  type InsertEligibility
} from "@shared/canonical-claims-schema";

// Sample medical procedure codes with descriptions
const PROCEDURE_CODES = [
  { code: "99213", description: "Office visit, established patient, moderate complexity" },
  { code: "99214", description: "Office visit, established patient, high complexity" },
  { code: "99232", description: "Hospital inpatient care, subsequent" },
  { code: "99291", description: "Critical care, first hour" },
  { code: "71020", description: "Chest X-ray, frontal view" },
  { code: "80053", description: "Comprehensive metabolic panel" },
  { code: "85025", description: "Complete blood count with differential" },
  { code: "93000", description: "Electrocardiogram, routine" },
  { code: "29881", description: "Arthroscopy, knee, surgical" },
  { code: "47562", description: "Laparoscopic cholecystectomy" },
  { code: "99202", description: "New patient office visit, straightforward" },
  { code: "99233", description: "Hospital inpatient care, high complexity" },
  { code: "76700", description: "Ultrasound, abdominal, complete" },
  { code: "45378", description: "Colonoscopy, diagnostic" },
  { code: "20610", description: "Arthrocentesis, major joint" }
];

// Sample diagnosis codes with descriptions
const DIAGNOSIS_CODES = [
  { code: "Z00.00", description: "Encounter for general adult medical examination" },
  { code: "I10", description: "Essential hypertension" },
  { code: "E11.9", description: "Type 2 diabetes mellitus without complications" },
  { code: "M79.3", description: "Panniculitis, unspecified" },
  { code: "J44.0", description: "Chronic obstructive pulmonary disease with acute lower respiratory infection" },
  { code: "N39.0", description: "Urinary tract infection, site not specified" },
  { code: "K21.9", description: "Gastro-esophageal reflux disease without esophagitis" },
  { code: "M25.511", description: "Pain in right shoulder" },
  { code: "R06.02", description: "Shortness of breath" },
  { code: "I25.10", description: "Atherosclerotic heart disease of native coronary artery without angina pectoris" }
];

// Sample clearinghouses
const CLEARINGHOUSES = [
  "Change Healthcare",
  "Availity",
  "Trizetto",
  "Optum",
  "TriZetto Gateway",
  "Office Ally"
];

// Sample denial reason codes (CARC codes)
const DENIAL_REASONS = [
  { code: "CO-11", description: "The diagnosis is inconsistent with the procedure" },
  { code: "CO-16", description: "Claim/service lacks information or has submission/billing error" },
  { code: "CO-18", description: "Duplicate claim/service" },
  { code: "CO-27", description: "Expenses incurred after coverage terminated" },
  { code: "CO-29", description: "The time limit for filing has expired" },
  { code: "CO-50", description: "These are non-covered services" },
  { code: "CO-96", description: "Non-covered charge(s)" },
  { code: "CO-197", description: "Precertification/authorization/notification absent" },
  { code: "PR-1", description: "Deductible Amount" },
  { code: "PR-2", description: "Coinsurance Amount" }
];

// Sample revenue codes for institutional claims
const REVENUE_CODES = [
  { code: "0450", description: "Emergency Room" },
  { code: "0636", description: "Drugs requiring detailed coding" },
  { code: "0730", description: "EKG/ECG" },
  { code: "0320", description: "Radiology - diagnostic" },
  { code: "0250", description: "Pharmacy" },
  { code: "0300", description: "Laboratory" },
  { code: "0410", description: "Occupational therapy" },
  { code: "0420", description: "Physical therapy" },
  { code: "0200", description: "Intensive care" },
  { code: "0110", description: "Room and board - private" }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateClaimNumber(orgId: string, sequence: number): string {
  return `CLM-${orgId}-${String(sequence).padStart(6, '0')}`;
}

function generateDateWithin(startDate: Date, endDate: Date): string {
  const start = startDate.getTime();
  const end = endDate.getTime();
  const randomTime = start + Math.random() * (end - start);
  return new Date(randomTime).toISOString().split('T')[0];
}

function generateCurrency(min: number = 100, max: number = 5000): string {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// Generate sample claim headers with realistic healthcare scenarios
export function generateSampleClaimHeaders(orgId: string, count: number = 20): InsertClaimHeader[] {
  const headers: InsertClaimHeader[] = [];
  const baseDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  // Sample patient names for realistic scenarios
  const patientNames = [
    "Smith, John", "Johnson, Mary", "Williams, Robert", "Brown, Linda",
    "Davis, Michael", "Miller, Elizabeth", "Wilson, David", "Moore, Susan",
    "Taylor, James", "Anderson, Patricia", "Thomas, Christopher", "Jackson, Nancy",
    "White, Matthew", "Harris, Lisa", "Martin, Daniel", "Thompson, Karen",
    "Garcia, Anthony", "Martinez, Betty", "Robinson, Mark", "Clark, Helen"
  ];
  
  const payerKeys = [
    `PAY-AETNA-001`, `PAY-BCBS-001`, `PAY-UHC-001`, 
    `PAY-CIGNA-001`, `PAY-HUMANA-001`, `PAY-MEDICARE-001`
  ];
  
  for (let i = 0; i < count; i++) {
    const claimNumber = generateClaimNumber(orgId, i + 1);
    const serviceDate = generateDateWithin(baseDate, endDate);
    const submissionDate = new Date(new Date(serviceDate).getTime() + Math.random() * 30 * 24 * 60 * 60 * 1000);
    const totalCharges = parseFloat(generateCurrency(500, 15000));
    
    // Some claims are fully paid, some partially, some denied
    const paymentScenario = Math.random();
    let totalPaid = 0;
    let totalAdjustment = 0;
    let status = "submitted";
    
    if (paymentScenario < 0.4) { // 40% fully paid
      totalPaid = totalCharges * (0.7 + Math.random() * 0.25); // 70-95% of charges
      totalAdjustment = totalCharges - totalPaid;
      status = "paid";
    } else if (paymentScenario < 0.7) { // 30% partially paid
      totalPaid = totalCharges * (0.3 + Math.random() * 0.4); // 30-70% of charges
      totalAdjustment = totalCharges * (0.1 + Math.random() * 0.2); // 10-30% adjustments
      status = "processed";
    } else if (paymentScenario < 0.9) { // 20% denied
      totalPaid = 0;
      totalAdjustment = 0;
      status = "denied";
    } else { // 10% pending
      totalPaid = 0;
      totalAdjustment = 0;
      status = "pending";
    }
    
    const header: InsertClaimHeader = {
      claim_key: `CLM-${orgId}-${String(i + 1).padStart(6, '0')}`,
      org_id: orgId,
      entity_id: `ENT-${orgId}-001`,
      claim_number: claimNumber,
      patient_account_number: `ACC-${orgId}-${String(Math.floor(Math.random() * 50) + 1).padStart(6, '0')}`,
      payer_key: getRandomElement(payerKeys),
      
      // Patient demographics
      patient_name: getRandomElement(patientNames),
      patient_dob: generateDateWithin(new Date('1940-01-01'), new Date('2010-01-01')),
      patient_gender: Math.random() > 0.5 ? 'M' : 'F',
      patient_id: `MRN${String(Math.floor(Math.random() * 999999) + 100000)}`,
      
      // Service details
      service_date_from: serviceDate,
      service_date_to: serviceDate,
      admission_date: Math.random() > 0.7 ? serviceDate : null, // 30% inpatient
      discharge_date: Math.random() > 0.7 && Math.random() > 0.7 ? 
        generateDateWithin(new Date(serviceDate), new Date(new Date(serviceDate).getTime() + 7 * 24 * 60 * 60 * 1000)) : null,
      
      // Financial totals
      total_charge_amount: totalCharges.toFixed(2),
      total_paid_amount: totalPaid.toFixed(2),
      total_adjustment_amount: totalAdjustment.toFixed(2),
      
      // Claim type and status
      claim_type: Math.random() > 0.6 ? 'professional' : 'institutional',
      bill_type: Math.random() > 0.6 ? '111' : getRandomElement(['121', '131', '141']),
      claim_frequency: Math.random() > 0.9 ? '7' : '1', // 10% replacement claims
      
      // Provider information
      rendering_provider_npi: `NPI${String(Math.floor(Math.random() * 999999999) + 1000000000)}`,
      rendering_provider_name: `Dr. ${getRandomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'])}`,
      billing_provider_npi: `NPI${String(Math.floor(Math.random() * 999999999) + 1000000000)}`,
      billing_provider_name: `${orgId} Medical Center`,
      
      // Facility information
      facility_name: `${orgId} Hospital`,
      facility_npi: `NPI${String(Math.floor(Math.random() * 999999999) + 1000000000)}`,
      place_of_service: getRandomElement(['11', '21', '22', '23']), // Office, inpatient, outpatient, ER
      
      // Submission tracking
      original_submission_date: submissionDate,
      current_submission_date: submissionDate,
      clearinghouse: getRandomElement(CLEARINGHOUSES),
      
      // Status and processing
      current_status: status,
      status_date: submissionDate,
      processing_note: status === 'denied' ? 'Claim denied - see line item details' : 
                      status === 'paid' ? 'Claim processed successfully' : 
                      'Claim under review',
      
      // Authorization and eligibility
      prior_auth_number: Math.random() > 0.7 ? `AUTH${String(Math.floor(Math.random() * 999999) + 100000)}` : null,
      eligibility_verified: Math.random() > 0.2, // 80% verified
      eligibility_verified_date: Math.random() > 0.2 ? new Date(submissionDate.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      
      // Audit fields
      created_at: submissionDate,
      updated_at: submissionDate
    };
    
    headers.push(header);
  }
  
  return headers;
}

// Generate sample claim lines for each claim header
export function generateSampleClaimLines(claimHeaders: InsertClaimHeader[]): InsertClaimLine[] {
  const lines: InsertClaimLine[] = [];
  let lineSequence = 1;
  
  for (const header of claimHeaders) {
    const lineCount = Math.floor(Math.random() * 5) + 1; // 1-5 lines per claim
    const claimCharges = parseFloat(header.total_charge_amount);
    
    for (let i = 0; i < lineCount; i++) {
      const procedure = getRandomElement(PROCEDURE_CODES);
      const lineCharges = lineCount === 1 ? claimCharges : (claimCharges / lineCount) * (0.5 + Math.random());
      
      // Calculate line-level payments based on claim totals
      const claimPaymentRatio = parseFloat(header.total_paid_amount) / parseFloat(header.total_charge_amount);
      const linePaid = lineCharges * claimPaymentRatio;
      const lineAdjustment = lineCharges * (parseFloat(header.total_adjustment_amount) / parseFloat(header.total_charge_amount));
      
      // Determine line status based on claim status
      let lineStatus = "approved";
      let denialCode = null;
      let denialDescription = null;
      
      if (header.current_status === 'denied') {
        lineStatus = Math.random() > 0.5 ? "denied" : "approved";
        if (lineStatus === "denied") {
          const denial = getRandomElement(DENIAL_REASONS);
          denialCode = denial.code;
          denialDescription = denial.description;
        }
      } else if (header.current_status === 'pending') {
        lineStatus = "pending";
      }
      
      const line: InsertClaimLine = {
        line_key: `CLM-LINE-${header.org_id}-${String(lineSequence++).padStart(8, '0')}`,
        claim_key: header.claim_key,
        org_id: header.org_id,
        
        line_number: i + 1,
        revenue_code: header.claim_type === 'institutional' ? getRandomElement(REVENUE_CODES).code : null,
        
        // Procedure information
        procedure_code: procedure.code,
        procedure_description: procedure.description,
        modifier_1: Math.random() > 0.8 ? getRandomElement(['25', '26', 'TC', 'LT', 'RT']) : null,
        modifier_2: null,
        modifier_3: null,
        modifier_4: null,
        
        // Service details
        service_date: header.service_date_from,
        units: (Math.random() * 3 + 0.5).toFixed(2),
        unit_type: 'UN',
        
        // Financial details
        charge_amount: lineCharges.toFixed(2),
        allowed_amount: lineCharges.toFixed(2),
        paid_amount: linePaid.toFixed(2),
        adjustment_amount: lineAdjustment.toFixed(2),
        
        // Line status
        line_status: lineStatus,
        denial_reason_code: denialCode,
        denial_reason_description: denialDescription,
        remark_code: lineStatus === "denied" ? getRandomElement(['N1', 'N2', 'N3']) : null,
        
        // Provider for this line
        rendering_provider_npi: header.rendering_provider_npi,
        rendering_provider_name: header.rendering_provider_name,
        
        // Diagnosis pointers
        diagnosis_pointer_1: '1',
        diagnosis_pointer_2: Math.random() > 0.6 ? '2' : null,
        diagnosis_pointer_3: null,
        diagnosis_pointer_4: null,
        
        // Audit fields
        created_at: header.created_at,
        updated_at: header.updated_at
      };
      
      lines.push(line);
    }
  }
  
  return lines;
}

// Generate sample claim status records
export function generateSampleClaimStatus(claimHeaders: InsertClaimHeader[]): InsertClaimStatus[] {
  const statusRecords: InsertClaimStatus[] = [];
  let statusSequence = 1;
  
  for (const header of claimHeaders) {
    const submissionDate = header.original_submission_date;
    const statusProgression = [
      { code: 'submitted', description: 'Claim submitted to payer' },
      { code: 'acknowledged', description: 'Claim received by payer' },
      { code: 'processing', description: 'Claim under review' }
    ];
    
    // Add final status based on claim
    if (header.current_status === 'paid') {
      statusProgression.push({ code: 'processed', description: 'Claim processed successfully' });
      statusProgression.push({ code: 'paid', description: 'Payment issued' });
    } else if (header.current_status === 'denied') {
      statusProgression.push({ code: 'denied', description: 'Claim denied' });
    } else if (header.current_status === 'pending') {
      statusProgression.push({ code: 'pending', description: 'Claim pending additional information' });
    }
    
    // Generate status records with realistic timing
    let currentDate = new Date(submissionDate);
    
    for (let i = 0; i < statusProgression.length; i++) {
      const status = statusProgression[i];
      
      // Add realistic delays between status changes
      if (i > 0) {
        const daysDelay = Math.floor(Math.random() * 7) + 1; // 1-7 days between status changes
        currentDate = new Date(currentDate.getTime() + daysDelay * 24 * 60 * 60 * 1000);
      }
      
      const statusRecord: InsertClaimStatus = {
        status_key: `CLM-STATUS-${header.org_id}-${String(statusSequence++).padStart(8, '0')}`,
        claim_key: header.claim_key,
        org_id: header.org_id,
        
        status_code: status.code,
        status_description: status.description,
        status_date: currentDate,
        effective_date: currentDate,
        
        clearinghouse_status: i === 0 ? 'accepted' : (i === 1 ? 'forwarded' : null),
        payer_status: i >= 1 ? (i === statusProgression.length - 1 ? 'finalized' : 'processing') : null,
        processing_note: status.description,
        
        response_received: i > 1,
        response_date: i > 1 ? currentDate : null,
        response_type: i > 1 ? (Math.random() > 0.5 ? '277' : '835') : null,
        
        assigned_to: `staff_${Math.floor(Math.random() * 10) + 1}`,
        priority_level: header.current_status === 'denied' ? 'high' : 'normal',
        
        follow_up_required: status.code === 'pending' || status.code === 'denied',
        follow_up_date: (status.code === 'pending' || status.code === 'denied') ? 
          new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) : null,
        days_in_status: Math.floor((new Date().getTime() - currentDate.getTime()) / (24 * 60 * 60 * 1000)),
        
        created_at: currentDate,
        updated_at: currentDate
      };
      
      statusRecords.push(statusRecord);
    }
  }
  
  return statusRecords;
}

// Generate sample remittance records for paid claims
export function generateSampleRemittance(claimHeaders: InsertClaimHeader[]): InsertRemittance[] {
  const remittanceRecords: InsertRemittance[] = [];
  let remittanceSequence = 1;
  
  const paidClaims = claimHeaders.filter(h => h.current_status === 'paid' || parseFloat(h.total_paid_amount) > 0);
  
  for (const header of paidClaims) {
    const paidAmount = parseFloat(header.total_paid_amount);
    const adjustmentAmount = parseFloat(header.total_adjustment_amount);
    const paymentDate = new Date(header.status_date.getTime() + Math.random() * 14 * 24 * 60 * 60 * 1000);
    
    const remittance: InsertRemittance = {
      remittance_key: `RMT-${header.org_id}-${String(remittanceSequence++).padStart(8, '0')}`,
      claim_key: header.claim_key,
      org_id: header.org_id,
      
      remittance_advice_number: `ERA${String(Math.floor(Math.random() * 9999999) + 1000000)}`,
      check_number: Math.random() > 0.7 ? `CHK${String(Math.floor(Math.random() * 999999) + 100000)}` : null,
      check_date: paymentDate.toISOString().split('T')[0],
      
      payment_method: getRandomElement(['ACH', 'EFT', 'check']),
      payment_amount: paidAmount.toFixed(2),
      payment_date: paymentDate.toISOString().split('T')[0],
      
      adjustment_reason_code: adjustmentAmount > 0 ? getRandomElement(['CO-45', 'CO-96', 'PR-1', 'PR-2']).split('-')[1] : null,
      adjustment_amount: adjustmentAmount.toFixed(2),
      adjustment_description: adjustmentAmount > 0 ? 'Contractual adjustment per fee schedule' : null,
      
      contractual_amount: (adjustmentAmount * 0.7).toFixed(2),
      deductible_amount: (adjustmentAmount * 0.15).toFixed(2),
      coinsurance_amount: (adjustmentAmount * 0.10).toFixed(2),
      copay_amount: (adjustmentAmount * 0.05).toFixed(2),
      
      processing_date: paymentDate,
      posted_date: new Date(paymentDate.getTime() + Math.random() * 3 * 24 * 60 * 60 * 1000),
      posted_by: `staff_${Math.floor(Math.random() * 10) + 1}`,
      
      claim_control_number: `CCN${String(Math.floor(Math.random() * 99999999) + 10000000)}`,
      patient_responsibility: (parseFloat(header.total_charge_amount) - paidAmount - adjustmentAmount).toFixed(2),
      
      remittance_source: 'electronic',
      verification_status: 'verified',
      
      created_at: paymentDate,
      updated_at: paymentDate
    };
    
    remittanceRecords.push(remittance);
  }
  
  return remittanceRecords;
}

// Generate sample prior authorization records
export function generateSamplePriorAuth(orgId: string, count: number = 15): InsertPriorAuth[] {
  const authRecords: InsertPriorAuth[] = [];
  const baseDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  const patientNames = [
    "Smith, John", "Johnson, Mary", "Williams, Robert", "Brown, Linda",
    "Davis, Michael", "Miller, Elizabeth", "Wilson, David", "Moore, Susan",
    "Taylor, James", "Anderson, Patricia", "Thomas, Christopher", "Jackson, Nancy"
  ];
  
  const authRequiredProcedures = [
    { code: "29881", description: "Arthroscopy, knee, surgical" },
    { code: "47562", description: "Laparoscopic cholecystectomy" },
    { code: "76700", description: "Ultrasound, abdominal, complete" },
    { code: "45378", description: "Colonoscopy, diagnostic" },
    { code: "99232", description: "Hospital inpatient care, subsequent" }
  ];
  
  const payerKeys = [`PAY-AETNA-001`, `PAY-BCBS-001`, `PAY-UHC-001`];
  
  for (let i = 0; i < count; i++) {
    const requestDate = generateDateWithin(baseDate, endDate);
    const procedure = getRandomElement(authRequiredProcedures);
    const diagnosis = getRandomElement(DIAGNOSIS_CODES);
    
    // Determine authorization status
    const statusRandom = Math.random();
    let authStatus = "approved";
    let approvalDate = null;
    let expirationDate = null;
    let unitsApproved = null;
    
    if (statusRandom < 0.7) { // 70% approved
      authStatus = "approved";
      approvalDate = generateDateWithin(new Date(requestDate), new Date(new Date(requestDate).getTime() + 5 * 24 * 60 * 60 * 1000));
      expirationDate = generateDateWithin(new Date(approvalDate), new Date(new Date(approvalDate).getTime() + 90 * 24 * 60 * 60 * 1000));
      unitsApproved = Math.floor(Math.random() * 10) + 1;
    } else if (statusRandom < 0.85) { // 15% denied
      authStatus = "denied";
    } else { // 15% pending
      authStatus = "pending";
    }
    
    const auth: InsertPriorAuth = {
      auth_key: `AUTH-${orgId}-${String(i + 1).padStart(6, '0')}`,
      org_id: orgId,
      entity_id: `ENT-${orgId}-001`,
      
      auth_number: authStatus === 'approved' ? `AUTH${String(Math.floor(Math.random() * 999999) + 100000)}` : null,
      reference_number: `REF${String(Math.floor(Math.random() * 999999) + 100000)}`,
      payer_key: getRandomElement(payerKeys),
      
      patient_name: getRandomElement(patientNames),
      patient_id: `MRN${String(Math.floor(Math.random() * 999999) + 100000)}`,
      patient_dob: generateDateWithin(new Date('1940-01-01'), new Date('2010-01-01')),
      
      procedure_code: procedure.code,
      procedure_description: procedure.description,
      diagnosis_code: diagnosis.code,
      diagnosis_description: diagnosis.description,
      
      auth_status: authStatus,
      auth_type: Math.random() > 0.9 ? 'modification' : 'initial',
      units_requested: Math.floor(Math.random() * 10) + 1,
      units_approved: unitsApproved,
      
      request_date: requestDate,
      approval_date: approvalDate,
      effective_date: approvalDate,
      expiration_date: expirationDate,
      
      requesting_provider_npi: `NPI${String(Math.floor(Math.random() * 999999999) + 1000000000)}`,
      requesting_provider_name: `Dr. ${getRandomElement(['Smith', 'Johnson', 'Williams', 'Brown', 'Davis'])}`,
      
      clinical_notes: `Patient requires ${procedure.description.toLowerCase()} due to ${diagnosis.description.toLowerCase()}`,
      medical_necessity: "Procedure is medically necessary based on current symptoms and diagnostic findings",
      supporting_documentation: { documents: ["medical_records", "imaging_results", "lab_results"] },
      
      reviewer_name: authStatus !== 'pending' ? `Reviewer_${Math.floor(Math.random() * 5) + 1}` : null,
      review_date: authStatus !== 'pending' ? new Date(new Date(requestDate).getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000) : null,
      denial_reason: authStatus === 'denied' ? 'Medical necessity not established' : null,
      appeal_deadline: authStatus === 'denied' ? generateDateWithin(new Date(), new Date(Date.now() + 60 * 24 * 60 * 60 * 1000)) : null,
      
      created_at: new Date(requestDate),
      updated_at: new Date(requestDate)
    };
    
    authRecords.push(auth);
  }
  
  return authRecords;
}

// Generate sample eligibility verification records
export function generateSampleEligibility(orgId: string, count: number = 25): InsertEligibility[] {
  const eligibilityRecords: InsertEligibility[] = [];
  const baseDate = new Date('2024-01-01');
  const endDate = new Date('2024-12-31');
  
  const patientNames = [
    "Smith, John", "Johnson, Mary", "Williams, Robert", "Brown, Linda",
    "Davis, Michael", "Miller, Elizabeth", "Wilson, David", "Moore, Susan",
    "Taylor, James", "Anderson, Patricia", "Thomas, Christopher", "Jackson, Nancy"
  ];
  
  const payerKeys = [
    `PAY-AETNA-001`, `PAY-BCBS-001`, `PAY-UHC-001`, 
    `PAY-CIGNA-001`, `PAY-HUMANA-001`, `PAY-MEDICARE-001`
  ];
  
  const planNames = [
    "HMO Gold Plus", "PPO Select", "EPO Advantage", 
    "Medicare Advantage", "Medicaid Managed Care", "High Deductible Plan"
  ];
  
  for (let i = 0; i < count; i++) {
    const verificationDate = generateDateWithin(baseDate, endDate);
    const isActive = Math.random() > 0.1; // 90% active coverage
    
    const eligibility: InsertEligibility = {
      eligibility_key: `ELIG-${orgId}-${String(i + 1).padStart(6, '0')}`,
      org_id: orgId,
      
      patient_id: `MRN${String(Math.floor(Math.random() * 999999) + 100000)}`,
      patient_name: getRandomElement(patientNames),
      patient_dob: generateDateWithin(new Date('1940-01-01'), new Date('2010-01-01')),
      payer_key: getRandomElement(payerKeys),
      
      member_id: `MEM${String(Math.floor(Math.random() * 999999999) + 100000000)}`,
      group_number: `GRP${String(Math.floor(Math.random() * 99999) + 10000)}`,
      plan_name: getRandomElement(planNames),
      policy_number: `POL${String(Math.floor(Math.random() * 9999999) + 1000000)}`,
      
      verification_date: verificationDate,
      verification_method: getRandomElement(['electronic', 'phone', 'portal']),
      verification_status: isActive ? 'active' : getRandomElement(['inactive', 'terminated']),
      
      effective_date: isActive ? generateDateWithin(new Date('2023-01-01'), new Date(verificationDate)) : null,
      termination_date: !isActive ? generateDateWithin(new Date(verificationDate), new Date('2024-12-31')) : null,
      copay_amount: isActive ? parseFloat(generateCurrency(15, 50)) : null,
      deductible_amount: isActive ? parseFloat(generateCurrency(500, 3000)) : null,
      deductible_met: isActive ? parseFloat(generateCurrency(0, 1500)) : null,
      out_of_pocket_max: isActive ? parseFloat(generateCurrency(3000, 8000)) : null,
      out_of_pocket_met: isActive ? parseFloat(generateCurrency(0, 2000)) : null,
      
      coverage_type: getRandomElement(['medical', 'dental', 'vision']),
      network_status: isActive ? getRandomElement(['in-network', 'out-of-network']) : 'unknown',
      prior_auth_required: Math.random() > 0.7,
      referral_required: Math.random() > 0.8,
      
      secondary_insurance: Math.random() > 0.8,
      coordination_of_benefits: Math.random() > 0.8 ? getRandomElement(['primary', 'secondary']) : 'primary',
      
      verified_by: `staff_${Math.floor(Math.random() * 10) + 1}`,
      verification_notes: isActive ? 'Coverage verified - patient has active benefits' : 'Coverage terminated or inactive',
      
      created_at: new Date(verificationDate),
      updated_at: new Date(verificationDate)
    };
    
    eligibilityRecords.push(eligibility);
  }
  
  return eligibilityRecords;
}

// Generate complete claims dataset for an organization
export function generateCompleteClaimsDataset(orgId: string): {
  claimHeaders: InsertClaimHeader[];
  claimLines: InsertClaimLine[];
  claimStatus: InsertClaimStatus[];
  remittance: InsertRemittance[];
  priorAuth: InsertPriorAuth[];
  eligibility: InsertEligibility[];
} {
  console.log(`Generating comprehensive claims dataset for organization: ${orgId}`);
  
  // Generate claim headers first
  const claimHeaders = generateSampleClaimHeaders(orgId, 20);
  
  // Generate dependent records based on claim headers
  const claimLines = generateSampleClaimLines(claimHeaders);
  const claimStatus = generateSampleClaimStatus(claimHeaders);
  const remittance = generateSampleRemittance(claimHeaders);
  
  // Generate independent records
  const priorAuth = generateSamplePriorAuth(orgId, 15);
  const eligibility = generateSampleEligibility(orgId, 25);
  
  console.log(`Generated claims data for ${orgId}:`);
  console.log(`- ${claimHeaders.length} claim headers`);
  console.log(`- ${claimLines.length} claim lines`);
  console.log(`- ${claimStatus.length} status records`);
  console.log(`- ${remittance.length} remittance records`);
  console.log(`- ${priorAuth.length} prior authorizations`);
  console.log(`- ${eligibility.length} eligibility verifications`);
  
  return {
    claimHeaders,
    claimLines,
    claimStatus,
    remittance,
    priorAuth,
    eligibility
  };
}