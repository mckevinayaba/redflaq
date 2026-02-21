
-- Create saflii_judgments table for indexed SAFLII criminal court judgments
CREATE TABLE public.saflii_judgments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  accused_name text NOT NULL,
  accused_surname text,
  accused_first_name text,
  name_normalized text,
  charge_keywords text[] DEFAULT '{}'::text[],
  court_code text,
  court_name text,
  province text,
  year integer,
  case_number text,
  case_title text,
  saflii_url text UNIQUE,
  is_criminal boolean DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Indexes for search performance
CREATE INDEX idx_saflii_name_normalized ON public.saflii_judgments (name_normalized);
CREATE INDEX idx_saflii_accused_surname ON public.saflii_judgments (accused_surname);
CREATE INDEX idx_saflii_province ON public.saflii_judgments (province);
CREATE INDEX idx_saflii_year ON public.saflii_judgments (year);
CREATE INDEX idx_saflii_charge_keywords ON public.saflii_judgments USING GIN (charge_keywords);

-- Enable RLS with public SELECT only
ALTER TABLE public.saflii_judgments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read saflii_judgments"
  ON public.saflii_judgments
  FOR SELECT
  USING (true);
