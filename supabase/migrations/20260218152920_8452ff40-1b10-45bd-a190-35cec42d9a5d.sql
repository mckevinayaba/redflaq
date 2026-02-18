
-- Step 1: Add new columns for OpenSanctions compatibility
ALTER TABLE public.wanted_persons
  ADD COLUMN IF NOT EXISTS aliases TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'South Africa',
  ADD COLUMN IF NOT EXISTS source_dataset TEXT,
  ADD COLUMN IF NOT EXISTS offense_categories TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS year_of_birth INTEGER,
  ADD COLUMN IF NOT EXISTS source_urls TEXT[] DEFAULT '{}'::TEXT[];

-- Step 2: Add indexes for new fields
CREATE INDEX IF NOT EXISTS idx_wanted_persons_country ON public.wanted_persons(country);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_source_dataset ON public.wanted_persons(source_dataset);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_offense_categories ON public.wanted_persons USING GIN(offense_categories);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_aliases ON public.wanted_persons USING GIN(aliases);

-- Step 3: Create admin_events audit log table
CREATE TABLE IF NOT EXISTS public.admin_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  details JSONB,
  performed_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.admin_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow insert admin events" ON public.admin_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow read admin events" ON public.admin_events
  FOR SELECT USING (true);
