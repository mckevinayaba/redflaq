

# Pre-Launch Audit: RedFlaq Website

## Overall Assessment
The site is **well-built and launch-ready** with most critical flows implemented correctly. Below are the findings organized by severity.

---

## CRITICAL ISSUES (Must fix before launch)

### 1. PaymentModal asks for email even when user is logged in
In `PaymentModal.tsx`, the user must manually type their email to pay. But they're already authenticated at this point (the pricing CTA in `PricingPlinq.tsx` redirects unauthenticated users to signup first). The modal should auto-fill the email from the logged-in user's session. Currently a user could type a different email, causing their credits to land on a different account than the one they're logged into.

**Fix:** Pass the authenticated user's email into `PaymentModal` and pre-fill it. Optionally make it read-only to prevent mismatches.

### 2. ResetPassword page uses different styling/branding
`ResetPassword.tsx` uses a white card on dark background (`#1a0a2e`) with `/redflaq-icon.png` (old logo), while the rest of the auth flow uses the official logo from `@/assets/redflaq-logo-official.png` and glassmorphic dark theme. This creates an inconsistent, unprofessional experience.

**Fix:** Update `ResetPassword.tsx` to match the Signup page's dark theme and use the official logo.

### 3. Password reset minimum is 6 chars, signup requires 8
`ResetPassword.tsx` allows passwords as short as 6 characters (`minLength={6}`), while signup enforces 8 characters. A user could reset to a 6-char password and then be unable to pass signup validation logic.

**Fix:** Update to `minLength={8}` in `ResetPassword.tsx`.

---

## HIGH PRIORITY (Should fix before launch)

### 4. No auth guard on Dashboard pages
`Dashboard.tsx`, `DashboardReports.tsx`, `DashboardAccount.tsx` check auth state via `useAuth()` and redirect to `/signup` if not authenticated — but this happens client-side after the page renders. There's a brief flash of the dashboard layout before redirect. This is functional but not ideal.

### 5. Signup `emailRedirectTo` points to `https://redflaq.com/?confirmed=true`
This is correct for production with a custom domain. However, if anyone tests on `redflaq.lovable.app`, the redirect will go to `redflaq.com` instead of the staging URL. This is fine for launch but worth noting for testing.

### 6. Yoco checkout origin fallback
In `create-yoco-checkout/index.ts`, the fallback origin is `https://redflaq.lovable.app`. For production with a custom domain, the `successUrl` and `cancelUrl` will use the request's `origin` header, which should be correct. But if the origin header is missing for any reason, it falls back to the lovable domain, which could cause confusion if you've fully migrated to `redflaq.com`.

---

## WORKING CORRECTLY (Verified)

### Authentication Flow
- **Signup**: Full name (2 words), email, password (8+ chars), confirm password, consent checkbox — all validated. Password strength meter and match indicator present.
- **Email verification**: Branded confirmation email via `auth-email-hook`. Redirects to `/?confirmed=true` which shows green banner. `/verify-email` page has resend + check status.
- **Sign in**: Handles unconfirmed email gracefully (yellow warning + resend). On success, checks credits → routes to dashboard or pricing.
- **Password reset**: Forgot password button on sign-in form, sends reset email, `/reset-password` page handles `type=recovery` hash.
- **Logout**: Works from navbar dropdown and mobile menu.

### Payment Flow
- **Pricing section**: 3 tiers (R99, R249, R399) with correct pricing and feature lists.
- **PaymentModal**: Package selector, email input, Yoco redirect with branded interstitial screen.
- **Yoco checkout creation**: Edge function creates checkout session, stores pending record in `manual_payments`.
- **Yoco webhook**: Idempotency check, updates `manual_payments` to verified, creates `purchases` record, sends email to founder + customer.
- **Payment success page**: Optimistic UI with 2s loading animation, package details, copyable reference.
- **Payment cancelled page**: Friendly messaging, retry button.
- **Credit system**: `useCredits` hook sums from `purchases` + `manual_payments`, has realtime subscription + polling fallback.

### Search Flow
- **DashboardNewCheck**: Form with first name, surname, optional ID number (SA ID validation), province, reason, consent, discreet mode toggle.
- **Credit validation**: Frontend guard + server-side mandatory check in `multi-parameter-search`. Admin bypass by email and role.
- **Credit deduction**: Deducts from `purchases` first (FIFO), then `manual_payments`. Only on successful search.
- **Results page**: Risk scoring, source attribution (SAPS, FIC, SAFLII, Gazette), confidence levels, dispute modal, PDF download, share controls.
- **Source links**: Fixed to use SAPS detail pages for `za_wanted` records.
- **Discreet mode**: Redirects to `/discreet-sent` confirmation instead of showing results directly.

### Dashboard
- Welcome screen with personalized greeting (fallback chain works).
- Credit balance card, monthly checks, latest result.
- Recent checks table with mobile-responsive card layout.
- My Payments section with transaction history.
- Referral programme stats.
- Reports page with risk level filter and hidden reports (password-protected).
- Account page with profile info, password reset, delete account.
- Claim reference page for recovering credits.

### Landing Page
- Navbar: Fixed position, scroll-aware, mobile hamburger, auth-aware (shows Dashboard/avatar when logged in).
- Hero: Women's Day campaign tag + existing copy.
- All sections render: TickerBar, TrustBar, PhotoGrid, Reality, Barrier, SearchOptions, HowItWorks, RiskLevels, Pricing, Testimonials, Community, WhyRedflaq (with ambassadors), FAQ, FinalCTA, Share, Advocacy, Footer.
- Auth guard on all CTAs via `useAuthGuard`.

### Static Pages
- About, Privacy, Terms, Dispute, Safety Tips, Blog, Partners — all routed correctly.
- Legacy redirects for `/tools/*` → `/safety-tips/*` and `/academy/*` → `/blog/*`.

### Admin
- Login, Dashboard, Users, Checks, Content, Pricing, Analytics, System, Gazette, Scraper, Import, Verify Payments, Merge Review — all routed.
- Role-based access via `user_roles` table and `has_role` function.

---

## SUMMARY OF REQUIRED FIXES

| # | Issue | Severity | File |
|---|-------|----------|------|
| 1 | Auto-fill email in PaymentModal from logged-in user | Critical | `PaymentModal.tsx`, `PricingPlinq.tsx` |
| 2 | ResetPassword page branding mismatch | High | `ResetPassword.tsx` |
| 3 | Reset password min length 6 vs signup 8 | High | `ResetPassword.tsx` |

Three fixes total. Everything else — signup, sign-in, payments, search, results, dashboard, credits, webhooks, email notifications — is working correctly and ready for launch.

