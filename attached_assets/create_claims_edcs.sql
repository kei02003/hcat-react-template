
-- CLAIM
DROP TABLE IF EXISTS public.contract_v1;
CREATE TABLE public.contract_v1 (
  contract_key INTEGER,
  source_instance_id TEXT,
  contract_hierarchy_level_01 TEXT,
  contract_hierarchy_level_02 TEXT,
  contract_hierarchy_level_03 TEXT,
  contract_hierarchy_level_04 TEXT,
  contract_hierarchy_level_05 TEXT,
  organization_code TEXT,
  payer_code TEXT,
  line_of_business TEXT,
  plan_name TEXT,
  is_medicare BOOLEAN,
  attribute_01 JSONB,
  attribute_02 JSONB,
  attribute_03 JSONB,
  attribute_04 JSONB,
  attribute_05 JSONB,
  attribute_06 JSONB,
  attribute_07 JSONB,
  attribute_08 JSONB,
  attribute_09 JSONB,
  attribute_10 JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.encounter_v1;
CREATE TABLE public.encounter_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.encounter_item_v1;
CREATE TABLE public.encounter_item_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.encounter_item_diagnosis_v1;
CREATE TABLE public.encounter_item_diagnosis_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.medical_claim_v1;
CREATE TABLE public.medical_claim_v1 (
  contract_key INTEGER,
  medical_claim_key TEXT,
  member_key TEXT,
  encounter_key TEXT,
  billing_provider_key TEXT,
  attending_provider_key TEXT,
  operating_provider_key TEXT,
  ordering_provider_key TEXT,
  bill_type_concept JSONB,
  principal_diagnosis_concept JSONB,
  principal_procedure_concept JSONB,
  aprdrg_concept JSONB,
  msdrg_concept JSONB,
  mdc_concept JSONB,
  otherdrg_code JSONB,
  claim_start_date DATE,
  claim_end_date DATE,
  admission_date DATE,
  discharge_date DATE,
  admission_type_code JSONB,
  admission_source_code JSONB,
  discharge_code JSONB,
  claim_type_code JSONB,
  original_claim_type_code JSONB,
  billing_provider_info JSONB,
  charge_amount NUMERIC,
  allowed_amount NUMERIC,
  paid_amount NUMERIC,
  coinsurance_amount NUMERIC,
  copay_amount NUMERIC,
  deductible_amount NUMERIC,
  is_inpatient_admit INTEGER,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medical_claim_diagnosis_v1;
CREATE TABLE public.medical_claim_diagnosis_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.medical_claim_item_v1;
CREATE TABLE public.medical_claim_item_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.medical_claim_procedure_v1;
CREATE TABLE public.medical_claim_procedure_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.member_v1;
CREATE TABLE public.member_v1 (
  contract_key INTEGER,
  member_key TEXT,
  edw_patient_key TEXT,
  subscriber_id TEXT,
  member_name JSONB,
  city_name TEXT,
  zip_code TEXT,
  county_code JSONB,
  state_code JSONB,
  country_code JSONB,
  phone_number TEXT,
  gender_code JSONB,
  race_code JSONB,
  ethnicity_code JSONB,
  language_code JSONB,
  marital_status_code JSONB,
  religion TEXT,
  ssn TEXT,
  mrn TEXT,
  beneficiary_medicare_status_code JSONB,
  beneficiary_dual_status_code JSONB,
  pcp_key TEXT,
  birth_date DATE,
  death_date DATE,
  hospice_start_date DATE,
  hospice_end_date DATE,
  is_deceased INTEGER,
  meta_created TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.member_enrollment_v1;
CREATE TABLE public.member_enrollment_v1 (
  contract_key INTEGER,
  member_key TEXT,
  member_year INTEGER,
  member_month INTEGER,
  member_month_start_date DATE,
  member_month_end_date DATE,
  member_quarter INTEGER,
  primary_care_provider_key TEXT,
  has_medical_coverage BOOLEAN,
  has_pharmacy_coverage BOOLEAN,
  has_behavioral_coverage BOOLEAN,
  allows_data_sharing BOOLEAN,
  is_member_attributed INTEGER,
  age_at_month_start INTEGER,
  report_grouper_01 TEXT,
  report_grouper_02 TEXT,
  report_grouper_03 TEXT,
  meta_created TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.member_enrollment_history_v1;
CREATE TABLE public.member_enrollment_history_v1 (
  __placeholder TEXT
);

DROP TABLE IF EXISTS public.pharmacy_claim_v1;
CREATE TABLE public.pharmacy_claim_v1 (
  contract_key INTEGER,
  pharmacy_claim_key TEXT,
  line_number INTEGER,
  member_key TEXT,
  pharmacy_provider_key TEXT,
  prescribing_provider_key TEXT,
  adjustment_type TEXT,
  drug_concept JSONB,
  claim_category_code JSONB,
  claim_type_code JSONB,
  filled_date DATE,
  paid_date DATE,
  filled_month INTEGER,
  filled_year INTEGER,
  dispense_unit_count NUMERIC,
  dispense_days_count INTEGER,
  prescription_id TEXT,
  daw_code TEXT,
  prescription_fill_sequence INTEGER,
  paid_amount NUMERIC,
  charge_amount NUMERIC,
  deductible_amount NUMERIC,
  allowed_amount NUMERIC,
  copay_amount NUMERIC,
  coinsurance_amount NUMERIC,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);