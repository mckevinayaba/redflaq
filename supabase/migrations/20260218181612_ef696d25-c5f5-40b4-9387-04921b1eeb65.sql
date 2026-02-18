
-- Create searches table to persist search results
CREATE TABLE public.searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  search_id text UNIQUE NOT NULL,
  payment_id text,
  search_name text,
  search_id_number text,
  search_dob text,
  search_province text,
  search_case_number text,
  results jsonb NOT NULL DEFAULT '[]'::jsonb,
  matches_found integer NOT NULL DEFAULT 0,
  risk_level text NOT NULL DEFAULT 'GREEN',
  is_wanted boolean NOT NULL DEFAULT false,
  search_strategies text[] DEFAULT '{}'::text[],
  recommendation text,
  needs_human_verification boolean DEFAULT false,
  searched_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.searches ENABLE ROW LEVEL SECURITY;

-- Anyone can read their own search by search_id (public, no auth)
CREATE POLICY "Allow public read searches by search_id"
ON public.searches
FOR SELECT
USING (true);

-- Only service role can insert (via edge function)
-- No insert/update/delete policy for anon = only edge functions with service role can write
