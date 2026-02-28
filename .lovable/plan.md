
## Logo "q" Color Change

The RedFlaq wordmark appears in **10 files** across the codebase. In each case, the word "Flaq" is rendered as a single `<span>`. The change is to split "Flaq" into "Fla" + "q", where only the "q" gets `color: '#DC2626'` (red).

### Files to update

There are two wordmark patterns used:

**Pattern A** — `Red` + `Flaq` (used in navbars/footers with Shield icon):
1. `src/components/landing/Navbar.tsx` (line 25)
2. `src/components/landing/NavbarHonest.tsx` (line 35)
3. `src/components/landing/FooterNew.tsx` (line 30)
4. `src/components/landing/FooterHonest.tsx` (line 19)
5. `src/components/Footer.tsx` (line 14)

**Pattern B** — `R` icon + `ed` + `Flaq` (used in Plinq/dashboard/auth screens):
6. `src/components/landing/NavbarPlinq.tsx` (line 103)
7. `src/components/landing/FooterPlinq.tsx` (line 41)
8. `src/components/dashboard/AppHeader.tsx` (line 40)
9. `src/pages/Signup.tsx` (line 227)
10. `src/pages/VerifyEmail.tsx` (line 68)

### Change applied to each

Every instance of `>Flaq</span>` becomes `>Fla<span style={{ color: '#DC2626' }}>q</span></span>` — inserting a nested red `<span>` around just the letter "q". Nothing else changes: no font, weight, size, spacing, or icon modifications.
