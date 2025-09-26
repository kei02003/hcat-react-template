
-- METRIC_STORE
DROP TABLE IF EXISTS public.metric_v1;
CREATE TABLE public.metric_v1 (
  metric_key TEXT,
  metric TEXT,
  metric_description TEXT,
  tags JSONB
);

DROP TABLE IF EXISTS public.metric_version_v1;
CREATE TABLE public.metric_version_v1 (
  metric_version_key TEXT,
  metric_key TEXT,
  version_number INTEGER,
  valid_from_datetime TIMESTAMPTZ,
  valid_to_datetime TIMESTAMPTZ,
  metric_version_name TEXT,
  metric_version_description TEXT,
  grain JSONB,
  grain_description TEXT,
  domain TEXT,
  result_type TEXT,
  result_unit TEXT,
  frequency TEXT,
  source_category TEXT,
  is_regulatory BOOLEAN,
  regulatory_program TEXT,
  steward TEXT,
  developer TEXT,
  is_active BOOLEAN,
  metadata_schema JSONB,
  required_metadata_fields JSONB,
  created_datetime TIMESTAMPTZ,
  updated_datetime TIMESTAMPTZ
);

DROP TABLE IF EXISTS public.result_v1;
CREATE TABLE public.result_v1 (
  result_key TEXT,
  grain_keys JSONB,
  metric_version_key TEXT,
  result_value_numeric NUMERIC,
  result_value_datetime TIMESTAMPTZ,
  result_value_text TEXT,
  result_value_boolean BOOLEAN,
  result_value_json JSONB,
  measurement_period_start_datetime TIMESTAMPTZ,
  measurement_period_end_datetime TIMESTAMPTZ,
  as_of_datetime TIMESTAMPTZ,
  result_metadata JSONB,
  calculated_at TIMESTAMPTZ,
  calculation_version TEXT
);

DROP TABLE IF EXISTS public.staging_result_v1;
CREATE TABLE public.staging_result_v1 (
  result_key TEXT,
  grain_keys JSONB,
  metric_version_key TEXT,
  result_value_numeric NUMERIC,
  result_value_datetime TIMESTAMPTZ,
  result_value_text TEXT,
  result_value_boolean BOOLEAN,
  result_value_json JSONB,
  measurement_period_start_datetime TIMESTAMPTZ,
  measurement_period_end_datetime TIMESTAMPTZ,
  as_of_datetime TIMESTAMPTZ,
  result_metadata JSONB,
  calculated_at TIMESTAMPTZ,
  calculation_version TEXT
);

DROP TABLE IF EXISTS public.metric_lineage_v1;
CREATE TABLE public.metric_lineage_v1 (
  parent_result_key TEXT,
  child_result_key TEXT,
  contribution_weight NUMERIC
);