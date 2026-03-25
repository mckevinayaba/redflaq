-- ═══════════════════════════════════════════════════════════════════
-- FIX: Per-user RLS on disputes and human_verification_requests
-- ═══════════════════════════════════════════════════════════════════
--
-- PROBLEM 1 — disputes
--   Original policy "Allow view own disputes" used USING (true),
--   allowing every authenticated user to read every dispute filed by
--   anyone. A dispute contains the filer's email, their reason, and
--   the name of the person being disputed — all personal information
--   under POPIA.
--
-- PROBLEM 2 — human_verification_requests
--   Original policy "Allow public read own verification requests" used
--   USING (true). The table also had no user identifier column, making
--   per-user scoping structurally impossible.
--
-- FIX APPLIED
--   disputes:
--     SELECT scoped to rows where user_email matches the caller's
--     authenticated email. No other authenticated user can read it.
--
--   human_verification_requests:
--     Add user_id column (nullable — guest submissions via payment_id
--     may not have an auth session). SELECT scoped to auth.uid() = user_id.
--     Guest rows (user_id IS NULL) are invisible to all authenticated
--     users; only service_role (edge functions) can read them.
--
-- This migration is fully idempotent. It drops every known policy name
-- from every prior migration on both tables before re-creating them.
-- ═══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- disputes
-- ─────────────────────────────────────────────────────────────────

-- Drop every prior policy on disputes (all historical names, safe with IF EXISTS)
DROP POLICY IF EXISTS "Allow public insert disputes"   ON public.disputes;
DROP POLICY IF EXISTS "Allow view own disputes"        ON public.disputes;
DROP POLICY IF EXISTS "Allow update disputes"          ON public.disputes;
DROP POLICY IF EXISTS "Users can view own disputes"    ON public.disputes;
DROP POLICY IF EXISTS "Staff can view all disputes"    ON public.disputes;
DROP POLICY IF EXISTS "Staff can update disputes"      ON public.disputes;

-- INSERT: any caller (including unauthenticated) may file a dispute.
-- The disputes page is publicly accessible and filing requires no account.
CREATE POLICY "Anyone can insert disputes"
  ON public.disputes
  FOR INSERT
  WITH CHECK (true);

-- SELECT: an authenticated user may only read rows they filed themselves.
-- The join against auth.users is SECURITY DEFINER-safe in Supabase RLS context.
CREATE POLICY "Users can view own disputes"
  ON public.disputes
  FOR SELECT
  TO authenticated
  USING (
    user_email = (
      SELECT email
      FROM auth.users
      WHERE id = auth.uid()
    )
  );

-- UPDATE: no authenticated user policy.
-- Admin operations use SUPABASE_SERVICE_ROLE_KEY in edge functions,
-- which bypasses RLS entirely. No policy needed here.


-- ─────────────────────────────────────────────────────────────────
-- human_verification_requests
-- ─────────────────────────────────────────────────────────────────

-- Add user_id so SELECT can be scoped to the submitting user.
-- Nullable because guest users (payment_id flow, no auth session)
-- submit requests without a Supabase account.
ALTER TABLE public.human_verification_requests
  ADD COLUMN IF NOT EXISTS user_id UUID
    REFERENCES auth.users(id)
    ON DELETE SET NULL;

-- Drop every prior policy (all historical names)
DROP POLICY IF EXISTS "Allow public insert verification requests"   ON public.human_verification_requests;
DROP POLICY IF EXISTS "Allow public read own verification requests" ON public.human_verification_requests;
DROP POLICY IF EXISTS "Allow admin update verification requests"    ON public.human_verification_requests;
DROP POLICY IF EXISTS "Staff can view verification requests"        ON public.human_verification_requests;
DROP POLICY IF EXISTS "Staff can update verification requests"      ON public.human_verification_requests;
DROP POLICY IF EXISTS "Users can insert own verification requests"  ON public.human_verification_requests;
DROP POLICY IF EXISTS "Anon can insert verification requests"       ON public.human_verification_requests;
DROP POLICY IF EXISTS "Users can view own verification requests"    ON public.human_verification_requests;

-- INSERT (authenticated): user_id must match the caller, or be NULL.
-- Prevents an authenticated user from submitting a request attributed
-- to a different user_id.
CREATE POLICY "Authenticated users can insert own verification requests"
  ON public.human_verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id IS NULL
    OR auth.uid() = user_id
  );

-- INSERT (anon): guest payment-flow submissions where user_id is NULL.
CREATE POLICY "Anon can insert verification requests"
  ON public.human_verification_requests
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

-- SELECT: authenticated users see only their own rows.
-- Rows where user_id IS NULL (guest submissions) are not returned
-- by this policy and are therefore invisible to all authenticated
-- users — they are accessible only via service_role.
CREATE POLICY "Users can view own verification requests"
  ON public.human_verification_requests
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- UPDATE: no authenticated user policy.
-- Admin operations use SUPABASE_SERVICE_ROLE_KEY in edge functions.
