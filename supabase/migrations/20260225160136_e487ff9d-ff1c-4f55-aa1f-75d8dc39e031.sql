
-- Fix the overly permissive searches SELECT policy
DROP POLICY IF EXISTS "Anyone can view search by search_id" ON public.searches;

-- Fix remaining "always true" INSERT policies by scoping them properly

-- manual_payments: only authenticated users can create their own payment records
DROP POLICY IF EXISTS "Allow public insert" ON public.manual_payments;
CREATE POLICY "Authenticated users can insert own payments"
  ON public.manual_payments FOR INSERT TO authenticated
  WITH CHECK (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- manual_payments: fix update policy - only service_role should update (remove the always-true update)
DROP POLICY IF EXISTS "Allow update credits when verified" ON public.manual_payments;
