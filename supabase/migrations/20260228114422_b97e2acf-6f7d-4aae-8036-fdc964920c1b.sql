
-- Fix purchases SELECT policies
DROP POLICY "Users can view own purchases" ON public.purchases;
DROP POLICY "Staff can view all purchases" ON public.purchases;

CREATE POLICY "Users can view own purchases" ON public.purchases
  FOR SELECT TO authenticated
  USING ((email)::text = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

CREATE POLICY "Staff can view all purchases" ON public.purchases
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));

-- Fix manual_payments SELECT policies
DROP POLICY "Users can view own payments" ON public.manual_payments;
DROP POLICY "Staff can view all payments" ON public.manual_payments;

CREATE POLICY "Users can view own payments" ON public.manual_payments
  FOR SELECT TO authenticated
  USING ((email)::text = (SELECT email FROM auth.users WHERE id = auth.uid())::text);

CREATE POLICY "Staff can view all payments" ON public.manual_payments
  FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));

-- Fix manual_payments INSERT policy
DROP POLICY "Authenticated users can insert own payments" ON public.manual_payments;

CREATE POLICY "Authenticated users can insert own payments" ON public.manual_payments
  FOR INSERT TO authenticated
  WITH CHECK ((email)::text = (SELECT email FROM auth.users WHERE id = auth.uid())::text);
