ALTER TABLE public.searches
  ADD COLUMN IF NOT EXISTS risk_score integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS risk_factors text[] DEFAULT '{}'::text[];