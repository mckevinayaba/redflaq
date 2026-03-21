
-- Add confidence tracking to wanted_persons
ALTER TABLE public.wanted_persons ADD COLUMN IF NOT EXISTS 
  identity_confidence_score INTEGER DEFAULT 0;
ALTER TABLE public.wanted_persons ADD COLUMN IF NOT EXISTS
  requires_human_verification BOOLEAN DEFAULT false;

-- Create human verification requests table
CREATE TABLE public.human_verification_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id TEXT,
  search_name TEXT NOT NULL,
  search_dob TEXT,
  search_id_number TEXT,
  search_province TEXT,
  possible_match_ids UUID[] DEFAULT '{}',
  additional_info TEXT,
  status TEXT DEFAULT 'pending',
  verified_match_id UUID REFERENCES public.wanted_persons(id),
  verification_notes TEXT,
  verified_by_admin TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

ALTER TABLE public.human_verification_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert verification requests"
  ON public.human_verification_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public read own verification requests"
  ON public.human_verification_requests FOR SELECT
  USING (true);

CREATE POLICY "Allow admin update verification requests"
  ON public.human_verification_requests FOR UPDATE
  USING (true);

-- Create duplicate name tracking table
CREATE TABLE public.duplicate_name_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  normalized_name TEXT NOT NULL,
  person_ids UUID[] NOT NULL,
  match_count INTEGER NOT NULL,
  flagged_for_review BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.duplicate_name_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read duplicate groups"
  ON public.duplicate_name_groups FOR SELECT
  USING (true);

CREATE POLICY "Allow insert duplicate groups"
  ON public.duplicate_name_groups FOR INSERT
  WITH CHECK (true);

CREATE INDEX idx_duplicate_names ON public.duplicate_name_groups(normalized_name);
