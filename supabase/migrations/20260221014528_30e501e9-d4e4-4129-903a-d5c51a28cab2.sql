
-- Gazette records table for financial court orders
CREATE TABLE public.gazette_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  first_name TEXT,
  surname TEXT,
  id_number TEXT,
  name_normalized TEXT,
  record_type TEXT NOT NULL DEFAULT 'insolvency',
  gazette_number TEXT,
  gazette_date DATE,
  court_name TEXT,
  province TEXT,
  case_number TEXT,
  order_type TEXT,
  details TEXT,
  source_pdf_url TEXT,
  source_page_number INTEGER,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gazette_records ENABLE ROW LEVEL SECURITY;

-- Public read only
CREATE POLICY "Allow public read gazette_records"
  ON public.gazette_records FOR SELECT
  USING (true);

-- Indexes
CREATE INDEX idx_gazette_name_normalized ON public.gazette_records(name_normalized);
CREATE INDEX idx_gazette_surname ON public.gazette_records(surname);
CREATE INDEX idx_gazette_id_number ON public.gazette_records(id_number);

-- Storage bucket for gazette PDFs
INSERT INTO storage.buckets (id, name, public) VALUES ('gazette-pdfs', 'gazette-pdfs', false);

-- Staff can upload gazette PDFs
CREATE POLICY "Staff can upload gazette PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gazette-pdfs' AND (
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'owner'::app_role)
    )
  );

-- Staff can view gazette PDFs
CREATE POLICY "Staff can view gazette PDFs"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'gazette-pdfs' AND (
      has_role(auth.uid(), 'admin'::app_role) OR
      has_role(auth.uid(), 'owner'::app_role) OR
      has_role(auth.uid(), 'support'::app_role)
    )
  );

-- Insert feature flags into site_settings
INSERT INTO public.site_settings (key, value, updated_at)
VALUES 
  ('feature_gazette', '"coming_soon"'::jsonb, now()),
  ('feature_nrso', '"coming_soon"'::jsonb, now())
ON CONFLICT (key) DO NOTHING;
