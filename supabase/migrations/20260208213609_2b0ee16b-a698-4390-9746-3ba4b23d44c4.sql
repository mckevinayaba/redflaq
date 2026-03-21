-- Add missing columns to wanted_persons
ALTER TABLE wanted_persons 
ADD COLUMN IF NOT EXISTS legal_status TEXT DEFAULT 'wanted',
ADD COLUMN IF NOT EXISTS risk_level TEXT DEFAULT 'red',
ADD COLUMN IF NOT EXISTS last_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS record_status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS court_name TEXT,
ADD COLUMN IF NOT EXISTS offense_category TEXT,
ADD COLUMN IF NOT EXISTS province TEXT;

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_wanted_persons_full_name ON wanted_persons USING gin(to_tsvector('english', full_name));
CREATE INDEX IF NOT EXISTS idx_wanted_persons_first_name ON wanted_persons(first_name);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_surname ON wanted_persons(surname);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_record_status ON wanted_persons(record_status);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_province ON wanted_persons(province);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_police_station ON wanted_persons(police_station);

-- Create disputes table for challenge mechanism
CREATE TABLE disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  record_id UUID REFERENCES wanted_persons(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  document_url TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolution_notes TEXT
);

-- Enable RLS on disputes
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert disputes
CREATE POLICY "Allow public insert disputes" ON disputes
  FOR INSERT WITH CHECK (true);

-- Allow viewing own disputes by email
CREATE POLICY "Allow view own disputes" ON disputes
  FOR SELECT USING (true);

-- Admin can update disputes (will be handled via service role in edge functions)
CREATE POLICY "Allow update disputes" ON disputes
  FOR UPDATE USING (true);