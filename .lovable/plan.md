

## Problem

The search function works correctly on the backend, but **the frontend can't read error details from non-2xx responses**.

When `supabase.functions.invoke` gets a non-2xx response (402 no credits, 400 invalid payment, 401 auth required, etc.):
- `data` is `null`
- `error` is a `FunctionsHttpError` with `error.message` = `"Edge Function returned a non-2xx status code"` (generic)
- The **actual error body** (containing "No credits available", "Payment not yet verified", etc.) is in `error.context` — a Response object that must be parsed with `await error.context.json()`

The current code on line 124 does `throw new Error(error.message)` which throws the generic message. Then the error mapping tries to match "Edge Function returned a non-2xx status code" against patterns like "no credits" — **which never matches**. So it falls through to the generic catch-all.

This is why the user sees vague errors even after the error mapping was added. The mapping is correct but it never receives the actual error strings from the backend.

## Fix

Single change in `src/pages/DashboardNewCheck.tsx` — after getting `error` from `supabase.functions.invoke`, parse the actual response body from `error.context` before throwing:

```typescript
// After the noCredits check, before line 124:
if (error) {
  // Extract actual error message from edge function response body
  let actualMessage = error.message;
  try {
    const errorBody = await error.context?.json();
    if (errorBody?.error) actualMessage = errorBody.error;
    if (errorBody?.redirect === '/pricing') {
      // No credits — redirect
      clearInterval(interval);
      setProgress(0);
      setIsSubmitting(false);
      setFormError("You don't have any search credits. Redirecting to pricing…");
      setTimeout(() => navigate("/pricing"), 2000);
      return;
    }
  } catch {}
  throw new Error(actualMessage);
}
```

This ensures the error mapping in the catch block receives the real backend message ("Payment not yet verified", "No credits available", etc.) instead of the generic supabase wrapper message.

No other files need changes. The edge function and error mapping are both correct — only this bridge between them is broken.

