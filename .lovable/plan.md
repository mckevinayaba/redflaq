

# Fix Stale "Paystack" Text and Hardcoded URL

## Change 1: Update DemoResult.tsx text

**File:** `src/pages/DemoResult.tsx`, line 83

Change:
> "Once Paystack is integrated, you'll be able to run real checks..."

To:
> "Once PayFast is integrated, you'll be able to run real checks..."

## Change 2: Make base URL dynamic in create-payfast-payment

**File:** `supabase/functions/create-payfast-payment/index.ts`, line 65

Currently hardcoded:
```
const baseUrl = "https://redflaq.lovable.app";
```

Replace with logic that:
1. Reads from a backend secret `APP_BASE_URL` if set (e.g. `https://redflaq.com` for production)
2. Falls back to the request's `Origin` header (so preview environments work automatically)
3. Final fallback to the current hardcoded value

```typescript
const baseUrl = Deno.env.get("APP_BASE_URL")
  || req.headers.get("origin")
  || "https://redflaq.lovable.app";
```

We will also store `APP_BASE_URL` as a backend secret so you can set it to `https://redflaq.com` when your domain is live.

## Technical Summary

| File | Line | Change |
|---|---|---|
| `src/pages/DemoResult.tsx` | 83 | "Paystack" to "PayFast" |
| `supabase/functions/create-payfast-payment/index.ts` | 65 | Dynamic base URL from secret/origin header |
| Backend secrets | -- | Add `APP_BASE_URL` secret |

No other files are affected. The edge function will be redeployed automatically after the change.
