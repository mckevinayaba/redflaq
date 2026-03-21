-- Add new fields for case numbers and protection orders
ALTER TABLE public.wanted_persons
ADD COLUMN IF NOT EXISTS protection_order_number VARCHAR(50),
ADD COLUMN IF NOT EXISTS court_case_number VARCHAR(50);

-- Create indexes for faster searching
CREATE INDEX IF NOT EXISTS idx_wanted_persons_case_number ON public.wanted_persons(case_number);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_protection_order ON public.wanted_persons(protection_order_number);
CREATE INDEX IF NOT EXISTS idx_wanted_persons_court_case ON public.wanted_persons(court_case_number);

-- Add comments for documentation
COMMENT ON COLUMN public.wanted_persons.case_number IS 'Police case number (e.g., CAS 123/2024)';
COMMENT ON COLUMN public.wanted_persons.protection_order_number IS 'Protection order number (e.g., PO 456/2024)';
COMMENT ON COLUMN public.wanted_persons.court_case_number IS 'Court case number (e.g., A 123/2024)';