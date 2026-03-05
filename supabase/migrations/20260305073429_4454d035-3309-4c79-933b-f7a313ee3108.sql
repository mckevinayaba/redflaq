
CREATE TABLE public.gbv_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  province TEXT,
  city TEXT,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  address TEXT,
  hours TEXT,
  services TEXT[] DEFAULT '{}'::TEXT[],
  notes TEXT,
  priority INTEGER DEFAULT 0,
  icon TEXT DEFAULT '📞',
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.gbv_resources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read gbv_resources" ON public.gbv_resources
  FOR SELECT USING (true);

CREATE POLICY "Admin can manage gbv_resources" ON public.gbv_resources
  FOR ALL USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));
