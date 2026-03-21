
-- =============================================
-- FIX 1: Lock down RLS policies
-- =============================================

-- === manual_payments ===
-- DROP wide-open SELECT policy
DROP POLICY IF EXISTS "Allow view own payments" ON public.manual_payments;
-- Users can only see their own payments (by email matching their auth email)
CREATE POLICY "Users can view own payments"
  ON public.manual_payments FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
-- Staff can view all payments
CREATE POLICY "Staff can view all payments"
  ON public.manual_payments FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));

-- === purchases ===
DROP POLICY IF EXISTS "Allow public read purchases" ON public.purchases;
DROP POLICY IF EXISTS "Allow public update purchases" ON public.purchases;
DROP POLICY IF EXISTS "Allow public insert purchases" ON public.purchases;
-- Users see own purchases
CREATE POLICY "Users can view own purchases"
  ON public.purchases FOR SELECT TO authenticated
  USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
-- Staff can view all
CREATE POLICY "Staff can view all purchases"
  ON public.purchases FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- No public insert/update - only service_role (edge functions) should write

-- === searches ===
DROP POLICY IF EXISTS "Allow public read searches by search_id" ON public.searches;
DROP POLICY IF EXISTS "Users can view own searches" ON public.searches;
-- Users can view their own searches
CREATE POLICY "Users can view own searches"
  ON public.searches FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
-- Staff can view all searches
CREATE POLICY "Staff can view all searches"
  ON public.searches FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- Allow anonymous read by search_id for results page (scoped - requires knowing the search_id)
CREATE POLICY "Anyone can view search by search_id"
  ON public.searches FOR SELECT
  USING (search_id IS NOT NULL);

-- === disputes ===
DROP POLICY IF EXISTS "Allow view own disputes" ON public.disputes;
DROP POLICY IF EXISTS "Allow update disputes" ON public.disputes;
-- Users see only their own disputes (by email)
CREATE POLICY "Users can view own disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (user_email = (SELECT email FROM auth.users WHERE id = auth.uid()));
-- Staff can view all disputes
CREATE POLICY "Staff can view all disputes"
  ON public.disputes FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- Only staff can update disputes
CREATE POLICY "Staff can update disputes"
  ON public.disputes FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));

-- === human_verification_requests ===
DROP POLICY IF EXISTS "Allow public read own verification requests" ON public.human_verification_requests;
DROP POLICY IF EXISTS "Allow admin update verification requests" ON public.human_verification_requests;
DROP POLICY IF EXISTS "Allow public insert verification requests" ON public.human_verification_requests;
-- Only staff can view
CREATE POLICY "Staff can view verification requests"
  ON public.human_verification_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- Only staff can update
CREATE POLICY "Staff can update verification requests"
  ON public.human_verification_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role));
-- No public insert - service_role only via edge functions

-- === admin_events ===
DROP POLICY IF EXISTS "Allow read admin events" ON public.admin_events;
DROP POLICY IF EXISTS "Allow insert admin events" ON public.admin_events;
-- Only staff can read admin events
CREATE POLICY "Staff can view admin events"
  ON public.admin_events FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- No public insert - service_role only via edge functions

-- === duplicate_name_groups ===
DROP POLICY IF EXISTS "Allow public read duplicate groups" ON public.duplicate_name_groups;
DROP POLICY IF EXISTS "Allow insert duplicate groups" ON public.duplicate_name_groups;
-- Only staff can read
CREATE POLICY "Staff can view duplicate groups"
  ON public.duplicate_name_groups FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- No public insert - service_role only

-- === record_merge_log ===
DROP POLICY IF EXISTS "Allow public read merge logs" ON public.record_merge_log;
DROP POLICY IF EXISTS "Allow insert merge logs" ON public.record_merge_log;
-- Only staff can read
CREATE POLICY "Staff can view merge logs"
  ON public.record_merge_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
-- No public insert - service_role only

-- === partners ===
DROP POLICY IF EXISTS "Allow public view partners" ON public.partners;
-- Only staff can view partner applications (not public)
CREATE POLICY "Staff can view partners"
  ON public.partners FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'owner'::app_role) OR has_role(auth.uid(), 'support'::app_role));
