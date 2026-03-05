

## Issues Found in Email

From the screenshot, I can see three problems:

1. **Broken logo image** -- The email references `https://redflaq.co.za/redflaq-logo-email.png` but the app is hosted at `redflaq.lovable.app`. The logo file exists in `public/` but the email URL points to a domain that likely doesn't serve it. Need to either use the Lovable published URL or host the logo on a reliable CDN/image host.

2. **Duplicated name in subject and body** -- Shows "Mckevin Ayaba Mckevin Ayaba". The `full_name` variable on line 93 of `DashboardNewCheck.tsx` constructs `firstName + surname`. This value is sent correctly as `full_name` to the edge function. The duplication likely comes from the email body on line 842: `${full_name || 'your search'}` -- which should be fine. I need to check if there's a form state issue where both `firstName` and `surname` contain the full name, OR the name is being doubled somewhere in the search flow. Most likely the user entered "Mckevin Ayaba" in first name AND "Mckevin Ayaba" in surname fields. However, the email subject line should handle this gracefully.

3. **"Result: Clear" with "1 record found"** -- The email shows green "Result: Clear" but says "1 record found". This is the same contradictory bug from the results page. The edge function's `calculateRiskScore` should force minimum YELLOW when records exist (line 193), but the deployed version may not have this fix yet, or the function needs redeployment.

## Plan

### Fix 1: Logo URL -- Use published Lovable URL
- Change all email logo references from `https://redflaq.co.za/redflaq-logo-email.png` to `https://redflaq.lovable.app/redflaq-logo-email.png` in `supabase/functions/multi-parameter-search/index.ts` (lines 799 and 836)
- Also update in `supabase/functions/send-welcome-email/index.ts`

### Fix 2: Email risk badge must match records
- In the email HTML template (line 841), add logic: if `matches.length > 0` but `riskLabel` is still "Clear", override to at minimum "Low Risk" with yellow color. This mirrors the scoring fix but applies it directly to the email template as a safeguard.

### Fix 3: Prevent name duplication  
- Add a `deduplicateName` helper in the edge function that detects and removes repeated name segments before using `full_name` in the email subject/body (e.g., "Mckevin Ayaba Mckevin Ayaba" → "Mckevin Ayaba")

### Fix 4: Redeploy edge function
- Deploy the updated `multi-parameter-search` and `send-welcome-email` functions

