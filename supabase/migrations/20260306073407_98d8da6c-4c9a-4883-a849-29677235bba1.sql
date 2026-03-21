
-- Add reference claim columns to purchases (if not exist)
ALTER TABLE public.purchases 
  ADD COLUMN IF NOT EXISTS reference_claimed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS reference_claimed_by uuid,
  ADD COLUMN IF NOT EXISTS reference_claimed_at timestamp with time zone;

-- Add reference claim columns to manual_payments (if not exist)
ALTER TABLE public.manual_payments 
  ADD COLUMN IF NOT EXISTS reference_claimed boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS reference_claimed_by uuid,
  ADD COLUMN IF NOT EXISTS reference_claimed_at timestamp with time zone;

-- Create reference_claim_logs table
CREATE TABLE IF NOT EXISTS public.reference_claim_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_number text NOT NULL,
  user_id uuid NOT NULL,
  outcome text NOT NULL,
  credits_added integer DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.reference_claim_logs ENABLE ROW LEVEL SECURITY;

-- Users can view own claim logs
CREATE POLICY "Users can view own claim logs" ON public.reference_claim_logs
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- Users can insert own claim logs
CREATE POLICY "Users can insert own claim logs" ON public.reference_claim_logs
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Staff can view all claim logs
CREATE POLICY "Staff can view all claim logs" ON public.reference_claim_logs
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
