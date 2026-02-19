
-- Key-value store for site content and pricing settings
CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by text
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Staff can read all settings
CREATE POLICY "Staff can read settings"
ON public.site_settings
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin')
  OR public.has_role(auth.uid(), 'owner')
  OR public.has_role(auth.uid(), 'support')
);

-- Only admin/owner can write
CREATE POLICY "Admin can insert settings"
ON public.site_settings
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

CREATE POLICY "Admin can update settings"
ON public.site_settings
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'owner'));

-- Seed default content values
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_headline', '"Before you give him a spare key, give yourself clarity."'::jsonb),
  ('hero_subheadline', '"South Africa''s first instant public-record safety check — R99, results in under 60 seconds."'::jsonb),
  ('gbv_stat', '"1 in 3 South African women experience gender-based violence in the hands of an intimate partner during their lifetime."'::jsonb),
  ('founder_quote', '"We built RedFlaq because we believe every woman deserves the right to make informed decisions about who she lets into her life."'::jsonb),
  ('invite_message', '"Hey — I just found this tool that lets you check if someone has a public criminal record in SA. It''s called RedFlaq. Thought you might find it useful."'::jsonb),
  ('single_check_price', '99'::jsonb),
  ('pack_3_price', '249'::jsonb),
  ('pack_3_checks', '3'::jsonb),
  ('pack_5_price', '399'::jsonb),
  ('pack_5_checks', '5'::jsonb)
ON CONFLICT (key) DO NOTHING;
