-- Create wanted_persons table to store SAPS scraped data
CREATE TABLE public.wanted_persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  surname VARCHAR(100),
  id_number VARCHAR(13),
  charges TEXT NOT NULL,
  photo_url TEXT,
  detail_page_url TEXT,
  last_known_location VARCHAR(255),
  case_number VARCHAR(100),
  police_station VARCHAR(255),
  date_wanted DATE,
  is_active BOOLEAN DEFAULT TRUE,
  source_url TEXT DEFAULT 'https://www.saps.gov.za/crimestop/wanted/list.php',
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for efficient searching
CREATE INDEX idx_wanted_full_name ON public.wanted_persons(LOWER(full_name));
CREATE INDEX idx_wanted_first_name ON public.wanted_persons(LOWER(first_name));
CREATE INDEX idx_wanted_surname ON public.wanted_persons(LOWER(surname));
CREATE INDEX idx_wanted_id_number ON public.wanted_persons(id_number);
CREATE INDEX idx_wanted_active ON public.wanted_persons(is_active);

-- Enable Row Level Security (public data, readable by all)
ALTER TABLE public.wanted_persons ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (wanted persons are public information)
CREATE POLICY "Allow public read access to wanted persons"
ON public.wanted_persons
FOR SELECT
USING (true);

-- Create trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_wanted_persons_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_wanted_persons_updated_at
BEFORE UPDATE ON public.wanted_persons
FOR EACH ROW
EXECUTE FUNCTION public.update_wanted_persons_updated_at();