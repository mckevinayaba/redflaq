
-- Phase 1: Add columns to journal_entries
ALTER TABLE public.journal_entries
  ADD COLUMN IF NOT EXISTS about_person TEXT,
  ADD COLUMN IF NOT EXISTS abuse_types TEXT[],
  ADD COLUMN IF NOT EXISTS weapon_involved BOOLEAN,
  ADD COLUMN IF NOT EXISTS weapon_description TEXT,
  ADD COLUMN IF NOT EXISTS medical_attention BOOLEAN,
  ADD COLUMN IF NOT EXISTS medical_details TEXT,
  ADD COLUMN IF NOT EXISTS police_reported BOOLEAN,
  ADD COLUMN IF NOT EXISTS police_case_number TEXT,
  ADD COLUMN IF NOT EXISTS children_present BOOLEAN,
  ADD COLUMN IF NOT EXISTS emotional_state TEXT,
  ADD COLUMN IF NOT EXISTS statement_hash TEXT,
  ADD COLUMN IF NOT EXISTS hash_generated_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS statement_locked BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS last_edited_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN IF NOT EXISTS addendum_notes TEXT;

-- Add columns to journal_evidence
ALTER TABLE public.journal_evidence
  ADD COLUMN IF NOT EXISTS file_hash TEXT,
  ADD COLUMN IF NOT EXISTS hash_algorithm TEXT DEFAULT 'SHA-256',
  ADD COLUMN IF NOT EXISTS file_hash_generated_at TIMESTAMP WITH TIME ZONE;

-- Create affidavit_drafts table
CREATE TABLE IF NOT EXISTS public.affidavit_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  full_name TEXT NOT NULL,
  id_number TEXT,
  residential_address TEXT NOT NULL,
  telephone_number TEXT,
  purpose TEXT NOT NULL,
  about_person TEXT,
  relationship_to_person TEXT,
  statement_text TEXT NOT NULL,
  relief_sought TEXT[],
  related_entry_ids UUID[],
  draft_pdf_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.affidavit_drafts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own affidavit drafts" ON public.affidavit_drafts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create lock function
CREATE OR REPLACE FUNCTION public.lock_journal_entry_statement(entry_id UUID, computed_hash TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.journal_entries 
  SET 
    statement_hash = computed_hash,
    hash_generated_at = NOW(),
    statement_locked = TRUE
  WHERE id = entry_id AND user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
