

## Root Cause

All RLS policies on `purchases` and `manual_payments` are set as **RESTRICTIVE** (`Permissive: No`). Restrictive policies require **ALL** policies to pass simultaneously. A regular user can never satisfy both "Users can view own" AND "Staff can view all" at the same time, so they get 403.

The same issue affects the INSERT policy on `manual_payments`.

## Fix

Drop and recreate the SELECT policies on both tables (and the INSERT policy on `manual_payments`) as **PERMISSIVE** policies instead of restrictive ones. The SQL logic stays identical — only the policy type changes.

### Migration SQL

```sql
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
```

No code changes needed — `useAuthGuard` queries are correct, they're just being blocked by the restrictive policy type.

