-- Auto-generated Postgres DDL to create empty tables for all clinical public models
BEGIN;
CREATE SCHEMA IF NOT EXISTS public;

DROP TABLE IF EXISTS public.allergy_v1;
CREATE TABLE public.allergy_v1 (
  allergy_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  note TEXT,
  rxnorm_concept JSONB,
  snomed_concept JSONB,
  med_rt_concept JSONB,
  local_concept JSONB,
  type_code JSONB,
  status_code JSONB,
  category_code JSONB,
  criticality_code JSONB,
  verification_status_code JSONB,
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.allergy_code_v1;
CREATE TABLE public.allergy_code_v1 (
  allergy_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.appointment_v1;
CREATE TABLE public.appointment_v1 (
  appointment_key TEXT,
  patient_key TEXT,
  location_key TEXT,
  provider_key TEXT,
  replaces_appointment_key TEXT,
  minutes_duration INTEGER,
  checkin_time TIMESTAMPTZ,
  checkout_time TIMESTAMPTZ,
  roomed_time TIMESTAMPTZ,
  status_code JSONB,
  canceled_reason_code JSONB,
  specialty_code JSONB,
  type_code JSONB,
  reason_code JSONB,
  scheduled_datetime TIMESTAMPTZ,
  canceled_datetime TIMESTAMPTZ,
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.diagnosis_v1;
CREATE TABLE public.diagnosis_v1 (
  diagnosis_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  rank TEXT,
  text TEXT,
  is_principal TEXT,
  icd_concept JSONB,
  snomed_concept JSONB,
  local_concept JSONB,
  status_code JSONB,
  type_code JSONB,
  present_on_admit_code JSONB,
  diagnosis_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.diagnosis_code_v1;
CREATE TABLE public.diagnosis_code_v1 (
  diagnosis_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.encounter_v1;
CREATE TABLE public.encounter_v1 (
  encounter_key TEXT,
  patient_key TEXT,
  service_location_key TEXT,
  admit_location_key TEXT,
  discharge_location_key TEXT,
  primary_encounter_key TEXT,
  primary_billing_account_key TEXT,
  performing_provider_key TEXT,
  admitting_provider_key TEXT,
  discharging_provider_key TEXT,
  status_code JSONB,
  priority_code JSONB,
  class_code JSONB,
  type_code JSONB,
  admit_source_code JSONB,
  admit_priority_code JSONB,
  discharge_disposition_code JSONB,
  service_datetime TIMESTAMPTZ,
  admit_datetime TIMESTAMPTZ,
  discharge_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.encounter_event_v1;
CREATE TABLE public.encounter_event_v1 (
  encounter_event_key TEXT,
  patient_key TEXT,
  location_key TEXT,
  performing_provider_key TEXT,
  status_code JSONB,
  category_code JSONB,
  encounter_code JSONB,
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.encounter_patient_location_v1;
CREATE TABLE public.encounter_patient_location_v1 (
  encounter_patient_location_key TEXT,
  location_key TEXT,
  status_code JSONB,
  start_datetime TIMESTAMPTZ,
  end_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.immunization_v1;
CREATE TABLE public.immunization_v1 (
  immunization_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  location_key TEXT,
  performing_provider_key TEXT,
  note TEXT,
  lot_number TEXT,
  manufacturer TEXT,
  dose_amount TEXT,
  cvx_concept JSONB,
  snomed_concept JSONB,
  local_concept JSONB,
  status_code JSONB,
  route_code JSONB,
  site_code JSONB,
  unit_code JSONB,
  reason_code JSONB,
  amount_code JSONB,
  vaccine_code JSONB,
  administered_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.immunization_code_v1;
CREATE TABLE public.immunization_code_v1 (
  immunization_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.lab_result_v1;
CREATE TABLE public.lab_result_v1 (
  lab_result_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  service_request_key TEXT,
  specimen_taken_location_key TEXT,
  specimen_collector_provider_key TEXT,
  ordering_provider_key TEXT,
  performing_provider_key TEXT,
  note TEXT,
  body_site_code JSONB,
  interpretation_code JSONB,
  specimen_source_code JSONB,
  category_code JSONB,
  status_code JSONB,
  result_datatype_code JSONB,
  result_value_code JSONB,
  reference_range_code JSONB,
  local_concept JSONB,
  snomed_concept JSONB,
  loinc_concept JSONB,
  specimen_taken_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  result_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.lab_result_code_v1;
CREATE TABLE public.lab_result_code_v1 (
  lab_result_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_administration_v1;
CREATE TABLE public.medication_administration_v1 (
  medication_administration_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  service_request_key TEXT,
  location_key TEXT,
  performing_provider_key TEXT,
  dosage_amount TEXT,
  dose_unit TEXT,
  note TEXT,
  route_code JSONB,
  status_code JSONB,
  reason_code JSONB,
  local_concept JSONB,
  ndc_concept JSONB,
  rxnorm_concept JSONB,
  administered_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_administration_code_v1;
CREATE TABLE public.medication_administration_code_v1 (
  medication_administration_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_request_v1;
CREATE TABLE public.medication_request_v1 (
  medication_request_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  ordering_provider_key TEXT,
  authorizing_provider_key TEXT,
  quantity TEXT,
  repeats_allowed TEXT,
  days_supply TEXT,
  dose_form TEXT,
  dosage_instruction TEXT,
  note TEXT,
  class_code JSONB,
  intent_code JSONB,
  priority_code JSONB,
  local_concept JSONB,
  ndc_concept JSONB,
  rxnorm_concept JSONB,
  status_code JSONB,
  category_code JSONB,
  written_datetime TIMESTAMPTZ,
  expected_start_datetime TIMESTAMPTZ,
  expected_end_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_request_code_v1;
CREATE TABLE public.medication_request_code_v1 (
  medication_request_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_statement_v1;
CREATE TABLE public.medication_statement_v1 (
  medication_statement_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  performing_provider_key TEXT,
  effective_dosage TEXT,
  note TEXT,
  status_code JSONB,
  category_code JSONB,
  route_code JSONB,
  dose_unit_code JSONB,
  local_concept JSONB,
  ndc_concept JSONB,
  rxnorm_concept JSONB,
  started_datetime TIMESTAMPTZ,
  stopped_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.medication_statement_code_v1;
CREATE TABLE public.medication_statement_code_v1 (
  medication_statement_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.observation_v1;
CREATE TABLE public.observation_v1 (
  observation_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  service_request_key TEXT,
  performing_provider_key TEXT,
  text TEXT,
  flag TEXT,
  data_absent_reason TEXT,
  loinc_concept JSONB,
  snomed_concept JSONB,
  local_concept JSONB,
  body_site_code JSONB,
  interpretation_code JSONB,
  category_code JSONB,
  status_code JSONB,
  result_datatype_code JSONB,
  result_value_code JSONB,
  reference_range_code JSONB,
  result_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.observation_code_v1;
CREATE TABLE public.observation_code_v1 (
  observation_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.problem_v1;
CREATE TABLE public.problem_v1 (
  problem_key TEXT,
  patient_key TEXT,
  recorded_by_provider_key TEXT,
  note TEXT,
  icd_concept JSONB,
  snomed_concept JSONB,
  local_concept JSONB,
  status_code JSONB,
  verification_status_code JSONB,
  onset_datetime TIMESTAMPTZ,
  abatement_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.problem_code_v1;
CREATE TABLE public.problem_code_v1 (
  problem_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.procedure_v1;
CREATE TABLE public.procedure_v1 (
  procedure_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  performing_provider_key TEXT,
  text TEXT,
  performing_location_key TEXT,
  is_reported TEXT,
  rank TEXT,
  local_concept JSONB,
  icd_concept JSONB,
  snomed_concept JSONB,
  cpt_concept JSONB,
  hcpcs_concept JSONB,
  status_code JSONB,
  category_code JSONB,
  performed_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.procedure_code_v1;
CREATE TABLE public.procedure_code_v1 (
  procedure_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.service_request_v1;
CREATE TABLE public.service_request_v1 (
  service_request_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  location_key TEXT,
  ordering_provider_key TEXT,
  authorizing_provider_key TEXT,
  quantity TEXT,
  is_modified TEXT,
  is_reordered TEXT,
  class_code JSONB,
  intent_code JSONB,
  priority_code JSONB,
  order_set_code JSONB,
  specimen_code JSONB,
  local_concept JSONB,
  cpt_concept JSONB,
  status_code JSONB,
  category_code JSONB,
  request_datetime TIMESTAMPTZ,
  expected_start_datetime TIMESTAMPTZ,
  expected_end_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.service_request_code_v1;
CREATE TABLE public.service_request_code_v1 (
  service_request_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.social_history_v1;
CREATE TABLE public.social_history_v1 (
  social_history_key TEXT,
  patient_key TEXT,
  encounter_key TEXT,
  recorded_by_provider_key TEXT,
  note TEXT,
  statement_unit_code JSONB,
  statement_value_code JSONB,
  snomed_concept JSONB,
  status_code JSONB,
  statement_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.social_history_code_v1;
CREATE TABLE public.social_history_code_v1 (
  social_history_key TEXT,
  system TEXT,
  concept JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.vital_sign_v1;
CREATE TABLE public.vital_sign_v1 (
  vital_sign_key TEXT,
  patient_key TEXT,
  service_request_key TEXT,
  performing_provider_key TEXT,
  interpretation TEXT,
  text TEXT,
  reporting_source_code JSONB,
  result_value_code JSONB,
  reference_range_code JSONB,
  snomed_concept JSONB,
  loinc_concept JSONB,
  local_concept JSONB,
  status_code JSONB,
  result_unit_code JSONB,
  taken_datetime TIMESTAMPTZ,
  recorded_datetime TIMESTAMPTZ,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);
COMMIT;

