
-- CORE
DROP TABLE IF EXISTS public.location_v1;
CREATE TABLE public.location_v1 (
  location_key TEXT,
  managing_organization_key TEXT,
  parent_location_key TEXT,
  location_name TEXT,
  location_alias TEXT,
  location_address TEXT,
  status_code JSONB,
  location_type_code JSONB,
  location_function_code JSONB,
  location_specialty_code JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.organization_v1;
CREATE TABLE public.organization_v1 (
  organization_key TEXT,
  parent_organization_key TEXT,
  organization_name TEXT,
  organization_alias TEXT,
  npi TEXT,
  tin TEXT,
  organization_type_code JSONB,
  organization_function_code JSONB,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.patient_v1;
CREATE TABLE public.patient_v1 (
  patient_key TEXT,
  mastered_patient_key TEXT,
  identifier TEXT,
  patient_name TEXT,
  birth_datetime TIMESTAMPTZ,
  deceased_datetime TIMESTAMPTZ,
  sex_assigned_at_birth_code JSONB,
  gender_identity_code JSONB,
  sexual_orientation_code JSONB,
  marital_status_code JSONB,
  religion_code JSONB,
  tribal_affiliation_code JSONB,
  gender_code JSONB,
  race_code JSONB,
  ethnic_group_code JSONB,
  language_code JSONB,
  telecom_code JSONB,
  address_code JSONB,
  primary_care_provider TEXT,
  patient_role TEXT,
  role TEXT,
  is_subscriber TEXT,
  subscribing_member_key TEXT,
  is_deceased TEXT,
  is_test_record TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.patient_crosswalk_v1;
CREATE TABLE public.patient_crosswalk_v1 (
  mastered_patient_key TEXT,
  patient_key TEXT,
  match_confidence_score TEXT,
  match_algorithm TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.provider_v1;
CREATE TABLE public.provider_v1 (
  provider_key TEXT,
  mastered_provider_key TEXT,
  parent_organization_key TEXT,
  identifier TEXT,
  provider_name TEXT,
  birth_datetime TIMESTAMPTZ,
  deceased_datetime TIMESTAMPTZ,
  organization_name TEXT,
  alias TEXT,
  role TEXT,
  telecom_code JSONB,
  address_code JSONB,
  type_code JSONB,
  specialty_code JSONB,
  credential_code JSONB,
  role_subtype TEXT,
  function_code JSONB,
  gender_code JSONB,
  race_code JSONB,
  ethnic_group_code JSONB,
  language_code JSONB,
  is_test_record TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.provider_crosswalk_v1;
CREATE TABLE public.provider_crosswalk_v1 (
  mastered_provider_key TEXT,
  provider_key TEXT,
  primary_specialty_code JSONB,
  npi_code JSONB,
  match_confidence_score TEXT,
  match_algorithm TEXT,
  meta_updated TIMESTAMPTZ,
  meta_created TIMESTAMPTZ
);
COMMIT;