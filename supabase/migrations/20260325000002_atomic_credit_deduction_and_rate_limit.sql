-- ═══════════════════════════════════════════════════════════════════
-- FIX: Atomic credit deduction + rate limiting
-- ═══════════════════════════════════════════════════════════════════
--
-- PROBLEM 1 — Credit deduction race condition
--   The search function used a read-then-write pattern:
--     1. SELECT credits_used, search_credits
--     2. Compare in application code
--     3. UPDATE credits_used = credits_used + 1
--   Two concurrent requests both complete step 1 before either
--   reaches step 3. Both see credits available. Both UPDATE.
--   Two searches are consumed for one credit.
--
--   The same pattern existed in three separate paths:
--   - manual_payments WHERE payment_id = X
--   - purchases WHERE email = Y AND credits_remaining > 0
--   - manual_payments WHERE email = Y AND credits_used < search_credits
--
-- FIX
--   deduct_search_credit() runs entirely inside PostgreSQL.
--   The critical pattern is:
--     UPDATE table
--     SET    counter = counter - 1  (or + 1)
--     WHERE  id = (subquery for best row)
--       AND  counter > 0            ← the atomic guard
--   If two transactions target the same row simultaneously,
--   PostgreSQL serializes them at the row lock. The second
--   transaction re-evaluates the WHERE after the first commits
--   and finds counter = 0 — updating 0 rows. No double-spend.
--
-- PROBLEM 2 — Supabase usage cost exposure
--   No rate limiting on the search endpoint means a single actor
--   can trigger hundreds of DB queries per minute, running up
--   Supabase compute and egress costs without limit.
--
-- FIX
--   Sliding-window rate limiter backed by a PostgreSQL table.
--   Uses minute-resolution buckets and atomic INSERT...ON CONFLICT.
--   The limiter is intentionally "soft" (a few requests may slip
--   through at exact window boundaries) — this is standard practice.
--   The credit deduction is the hard financial guard; the rate limiter
--   is the cost-protection layer.
-- ═══════════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────────────────────────
-- Rate limit bucket table
-- ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.rate_limit_buckets (
  key    TEXT                     NOT NULL,
  bucket TIMESTAMP WITH TIME ZONE NOT NULL,   -- truncated to minute
  count  INTEGER                  NOT NULL DEFAULT 0,
  PRIMARY KEY (key, bucket)
);

-- Index for fast window-sum queries
CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_key_bucket
  ON public.rate_limit_buckets (key, bucket);

-- RLS: this table must never be readable or writable by end users.
-- All access goes through the check_rate_limit SECURITY DEFINER function.
ALTER TABLE public.rate_limit_buckets ENABLE ROW LEVEL SECURITY;
-- (No policies — only the SECURITY DEFINER function can access it)


-- ─────────────────────────────────────────────────────────────────
-- check_rate_limit
--   Returns TRUE  if the request is allowed (counter incremented).
--   Returns FALSE if the caller has exceeded p_max_requests within
--   the last p_window_minutes.
--
--   Uses minute-resolution buckets: all requests within the same
--   calendar minute go into one row. The sliding window is
--   implemented by summing all buckets within the window.
--
--   Pruning: 1% of calls clean up expired buckets to keep the
--   table small without a dedicated cron job.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_key            TEXT,
  p_max_requests   INTEGER,
  p_window_minutes INTEGER
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_current_count INTEGER;
  v_bucket        TIMESTAMP WITH TIME ZONE;
BEGIN
  v_bucket := date_trunc('minute', NOW());

  -- Lazy pruning: run 1% of the time to avoid a dedicated cron job
  IF random() < 0.01 THEN
    DELETE FROM public.rate_limit_buckets
    WHERE bucket < NOW() - ((p_window_minutes + 60) || ' minutes')::interval;
  END IF;

  -- Sum requests across the sliding window
  SELECT COALESCE(SUM(count), 0)
  INTO   v_current_count
  FROM   public.rate_limit_buckets
  WHERE  key    = p_key
    AND  bucket >= NOW() - (p_window_minutes || ' minutes')::interval;

  IF v_current_count >= p_max_requests THEN
    RETURN FALSE;
  END IF;

  -- Atomically increment the current-minute bucket
  INSERT INTO public.rate_limit_buckets (key, bucket, count)
  VALUES (p_key, v_bucket, 1)
  ON CONFLICT (key, bucket)
  DO UPDATE SET count = rate_limit_buckets.count + 1;

  RETURN TRUE;
END;
$$;


-- ─────────────────────────────────────────────────────────────────
-- deduct_search_credit
--   Atomically deducts one search credit from the correct source.
--   Returns a single row: (success BOOLEAN, source TEXT, error TEXT).
--
--   Credit sources in priority order:
--     1. manual_payments identified by payment_id (guest flow)
--     2. purchases table identified by user email (dashboard flow)
--     3. manual_payments identified by user email (dashboard flow)
--
--   The atomic guard for each UPDATE is the same pattern:
--     UPDATE ... SET counter = counter ± 1
--     WHERE  id = (SELECT id ... LIMIT 1)
--       AND  counter_condition               ← evaluated AFTER row lock
--   Under READ COMMITTED (PostgreSQL default), the second of two
--   concurrent transactions re-reads the row after acquiring the lock
--   and finds the condition false — returning 0 rows updated.
-- ─────────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.deduct_search_credit(
  p_payment_id TEXT  DEFAULT NULL,
  p_user_id    UUID  DEFAULT NULL
)
RETURNS TABLE (success BOOLEAN, source TEXT, error TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_email  TEXT;
  v_rows        INTEGER;
BEGIN
  -- ── Path 1: guest payment_id flow ──────────────────────────────
  IF p_payment_id IS NOT NULL THEN
    UPDATE public.manual_payments
    SET    credits_used = credits_used + 1
    WHERE  payment_id   = p_payment_id
      AND  status       = 'verified'
      AND  credits_used < search_credits;

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    IF v_rows > 0 THEN
      RETURN QUERY SELECT true, 'payment_id'::TEXT, NULL::TEXT;
      RETURN;
    END IF;

    -- Explain why the update matched 0 rows
    IF EXISTS (
      SELECT 1 FROM public.manual_payments
      WHERE  payment_id   = p_payment_id
        AND  status       = 'verified'
        AND  credits_used >= search_credits
    ) THEN
      RETURN QUERY SELECT false, NULL::TEXT, 'No credits remaining'::TEXT;
    ELSIF EXISTS (
      SELECT 1 FROM public.manual_payments
      WHERE  payment_id = p_payment_id
        AND  status    != 'verified'
    ) THEN
      RETURN QUERY SELECT false, NULL::TEXT, 'Payment not yet verified'::TEXT;
    ELSE
      RETURN QUERY SELECT false, NULL::TEXT, 'Invalid payment ID'::TEXT;
    END IF;
    RETURN;
  END IF;

  -- ── Path 2: authenticated user_id flow ─────────────────────────
  IF p_user_id IS NOT NULL THEN
    -- Resolve email from auth.users (SECURITY DEFINER grants access)
    SELECT email INTO v_user_email
    FROM   auth.users
    WHERE  id = p_user_id;

    IF v_user_email IS NULL THEN
      RETURN QUERY SELECT false, NULL::TEXT, 'User not found'::TEXT;
      RETURN;
    END IF;

    -- Try purchases first (Yoco / Stripe payments)
    UPDATE public.purchases
    SET    credits_remaining = credits_remaining - 1
    WHERE  id = (
      SELECT id
      FROM   public.purchases
      WHERE  email             = v_user_email
        AND  status            = 'completed'
        AND  credits_remaining > 0
      ORDER  BY purchased_at ASC
      LIMIT  1
    )
    AND credits_remaining > 0;  -- re-checked after row lock

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    IF v_rows > 0 THEN
      RETURN QUERY SELECT true, 'purchase'::TEXT, NULL::TEXT;
      RETURN;
    END IF;

    -- Try manual_payments (admin-verified bank transfers)
    UPDATE public.manual_payments
    SET    credits_used = credits_used + 1
    WHERE  id = (
      SELECT id
      FROM   public.manual_payments
      WHERE  email        = v_user_email
        AND  status       = 'verified'
        AND  credits_used < search_credits
      ORDER  BY created_at ASC
      LIMIT  1
    )
    AND credits_used < search_credits;  -- re-checked after row lock

    GET DIAGNOSTICS v_rows = ROW_COUNT;

    IF v_rows > 0 THEN
      RETURN QUERY SELECT true, 'manual_payment'::TEXT, NULL::TEXT;
      RETURN;
    END IF;

    RETURN QUERY SELECT false, NULL::TEXT,
      'No credits available. Please purchase a check first.'::TEXT;
    RETURN;
  END IF;

  -- Neither p_payment_id nor p_user_id supplied
  RETURN QUERY SELECT false, NULL::TEXT, 'Authentication required'::TEXT;
END;
$$;
