CREATE TABLE public.conversion_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name TEXT NOT NULL,
  event_category TEXT,
  source TEXT,
  path TEXT,
  referrer TEXT,
  user_id UUID,
  session_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_conversion_events_event_name ON public.conversion_events(event_name);
CREATE INDEX idx_conversion_events_created_at ON public.conversion_events(created_at DESC);
CREATE INDEX idx_conversion_events_category ON public.conversion_events(event_category);

ALTER TABLE public.conversion_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can log conversion events"
ON public.conversion_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Staff can view conversion events"
ON public.conversion_events
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));