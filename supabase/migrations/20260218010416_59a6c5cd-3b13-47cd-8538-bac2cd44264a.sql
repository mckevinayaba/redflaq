
-- Add cross-referencing columns to wanted_persons
ALTER TABLE public.wanted_persons
  ADD COLUMN IF NOT EXISTS name_normalized TEXT,
  ADD COLUMN IF NOT EXISTS sa_id_partial TEXT,
  ADD COLUMN IF NOT EXISTS saps_case_numbers TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS court_case_numbers TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS protection_order_refs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS gazette_notice_refs TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS alleged_offenses TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS found_in_saps BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS found_in_saflii BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS found_in_gazettes BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS photo_source TEXT,
  ADD COLUMN IF NOT EXISTS merged_from_records UUID[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS needs_human_review BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS last_known_address TEXT;

-- Create indexes for fast cross-referencing searches
CREATE INDEX IF NOT EXISTS idx_wanted_name_normalized ON public.wanted_persons(name_normalized);
CREATE INDEX IF NOT EXISTS idx_wanted_sa_id_partial ON public.wanted_persons(sa_id_partial);
CREATE INDEX IF NOT EXISTS idx_wanted_saps_cases ON public.wanted_persons USING GIN(saps_case_numbers);
CREATE INDEX IF NOT EXISTS idx_wanted_court_cases ON public.wanted_persons USING GIN(court_case_numbers);
CREATE INDEX IF NOT EXISTS idx_wanted_province ON public.wanted_persons(province);

-- Create record_merge_log table for tracking cross-references
CREATE TABLE public.record_merge_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  final_record_id UUID REFERENCES public.wanted_persons(id) ON DELETE SET NULL,
  source_1_type TEXT,
  source_1_data JSONB,
  source_2_type TEXT,
  source_2_data JSONB,
  match_confidence INTEGER,
  match_criteria TEXT[],
  matched_by TEXT,
  matched_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on record_merge_log
ALTER TABLE public.record_merge_log ENABLE ROW LEVEL SECURITY;

-- Admin read access for merge logs
CREATE POLICY "Allow public read merge logs"
  ON public.record_merge_log FOR SELECT
  USING (true);

-- Service role insert for merge logs (edge functions)
CREATE POLICY "Allow insert merge logs"
  ON public.record_merge_log FOR INSERT
  WITH CHECK (true);

-- Populate name_normalized for existing records
UPDATE public.wanted_persons
  SET name_normalized = LOWER(REGEXP_REPLACE(full_name, '\s+', '', 'g'));

-- Populate sa_id_partial for existing records with ID numbers
UPDATE public.wanted_persons
  SET sa_id_partial = RIGHT(id_number, 4)
  WHERE id_number IS NOT NULL AND LENGTH(id_number) >= 4;

-- Populate saps_case_numbers from existing case_number
UPDATE public.wanted_persons
  SET saps_case_numbers = ARRAY[case_number],
      found_in_saps = true
  WHERE case_number IS NOT NULL AND case_number != '';

-- Populate court_case_numbers from existing court_case_number
UPDATE public.wanted_persons
  SET court_case_numbers = ARRAY[court_case_number]
  WHERE court_case_number IS NOT NULL AND court_case_number != '';

-- Populate protection_order_refs from existing protection_order_number
UPDATE public.wanted_persons
  SET protection_order_refs = ARRAY[protection_order_number]
  WHERE protection_order_number IS NOT NULL AND protection_order_number != '';

-- Populate alleged_offenses from existing charges
UPDATE public.wanted_persons
  SET alleged_offenses = ARRAY[charges]
  WHERE charges IS NOT NULL AND charges != '';
