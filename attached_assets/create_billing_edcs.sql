
-- BILLING
DROP TABLE IF EXISTS public.account_v1;
CREATE TABLE public.account_v1 (
  billing_account_key TEXT,
  patient_key TEXT,
  primary_encounter_key TEXT,
  primary_payer_key TEXT,
  primary_benefit_plan_key TEXT,
  attending_provider_key TEXT,
  billing_location_key TEXT,
  status_code JSONB,
  financial_class_code JSONB,
  billing_status_code JSONB,
  class_code JSONB,
  admit_source_code JSONB,
  admit_priority_code JSONB,
  discharge_disposition_code JSONB,
  current_balance NUMERIC,
  total_charges NUMERIC,
  total_payments NUMERIC,
  total_adjustments NUMERIC,
  admit_datetime TIMESTAMPTZ,
  discharge_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.account_drg_v1;
CREATE TABLE public.account_drg_v1 (
  account_key TEXT,
  line_number INTEGER,
  patient_key TEXT,
  is_primary TEXT,
  drg_code JSONB,
  weight NUMERIC,
  severity_of_illness NUMERIC,
  risk_of_mortality NUMERIC,
  arithmetic_mean_los NUMERIC,
  geometric_mean_los NUMERIC,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.benefit_plan_v1;
CREATE TABLE public.benefit_plan_v1 (
  benefit_plan_key TEXT,
  payer_key TEXT,
  plan_name TEXT,
  coverage_type_code JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.denial_remark_v1;
CREATE TABLE public.denial_remark_v1 (
  denial_remark_key TEXT,
  billing_account_key TEXT,
  claim_line_key TEXT,
  transaction_key TEXT,
  reason_code JSONB,
  action_code JSONB,
  action_note TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.diagnosis_v1;
CREATE TABLE public.diagnosis_v1 (
  diagnosis_key TEXT,
  billing_account_key TEXT,
  encounter_key TEXT,
  diagnosis_sequence TEXT,
  icd_code JSONB,
  present_on_admit_code JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.payer_v1;
CREATE TABLE public.payer_v1 (
  payer_key TEXT,
  payer_name TEXT,
  payer_alias TEXT,
  payer_type_code JSONB,
  payer_function_code JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.procedure_v1;
CREATE TABLE public.procedure_v1 (
  procedure_key TEXT,
  billing_account_key TEXT,
  encounter_key TEXT,
  cpt_code JSONB,
  hcpcs_code JSONB,
  modifier_1_code JSONB,
  modifier_2_code JSONB,
  modifier_3_code JSONB,
  modifier_4_code JSONB,
  revenue_code JSONB,
  quantity NUMERIC,
  unit_price NUMERIC,
  total_charge_amount NUMERIC,
  discount_amount NUMERIC,
  net_charge_amount NUMERIC,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.transaction_v1;
CREATE TABLE public.transaction_v1 (
  transaction_key TEXT,
  billing_account_key TEXT,
  claim_line_key TEXT,
  payer_key TEXT,
  amount NUMERIC,
  debit_credit_indicator TEXT,
  type_code JSONB,
  currency_code JSONB,
  financial_class_code JSONB,
  cpt_code JSONB,
  hcpcs_code JSONB,
  ndc_code JSONB,
  ubrev_code JSONB,
  service_date TEXT,
  post_date TEXT,
  cpt_modifiers TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);