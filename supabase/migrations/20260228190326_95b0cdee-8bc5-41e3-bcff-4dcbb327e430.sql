
-- Add hidden_from_dashboard column to searches
ALTER TABLE public.searches ADD COLUMN hidden_from_dashboard boolean NOT NULL DEFAULT false;

-- Create secure_report_links table for discreet mode secure links
CREATE TABLE public.secure_report_links (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token text NOT NULL UNIQUE,
  search_id text NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone NOT NULL DEFAULT (now() + interval '7 days'),
  viewed boolean NOT NULL DEFAULT false
);

-- Index for fast token lookup
CREATE INDEX idx_secure_report_links_token ON public.secure_report_links (token);

-- Enable RLS
ALTER TABLE public.secure_report_links ENABLE ROW LEVEL SECURITY;

-- Users can only view their own links
CREATE POLICY "Users can view own secure links"
  ON public.secure_report_links
  FOR SELECT
  USING (auth.uid() = user_id);

-- Staff can view all
CREATE POLICY "Staff can view all secure links"
  ON public.secure_report_links
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role) OR
    has_role(auth.uid(), 'owner'::app_role) OR
    has_role(auth.uid(), 'support'::app_role)
  );
