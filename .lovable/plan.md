

## Navigation & Link Integrity Fix

### Problems Found

1. **No "Back to Home" link at top of subpages** — Pages like About, Safety Tips, Blog, Pricing, Shop, Terms, Privacy, Partners, Dispute, and Coming Soon pages all use NavbarPlinq (which has the logo linking home) but lack an explicit "← Back to Home" breadcrumb or back button at the top of their content area.

2. **No "Back to Home" at bottom of subpages** — The footer has anchor links (`#who-redflaq-helps`, `#how-it-works`, `#faq`) that use raw `<a>` tags instead of React Router navigation. When clicked from subpages (e.g. `/about`, `/blog`), these navigate to `/about#who-redflaq-helps` instead of `/#who-redflaq-helps`, breaking the intended scroll behavior.

3. **Dashboard "Back to homepage" opens in new tab** — `DashboardLayout.tsx` line 54-61 uses `target="_blank"` on the back-to-homepage link, which is unexpected. Users should return in the same tab.

4. **Dispute page uses old Footer** — `Dispute.tsx` imports the legacy `Footer` component instead of `FooterPlinq`, creating visual inconsistency.

5. **Results page uses old Footer** — Same issue in `ResultsPageUpdated.tsx`.

6. **Footer anchor links broken on subpages** — All `#`-prefixed hrefs in FooterPlinq (e.g. `#how-it-works`, `#who-redflaq-helps`, `#faq`) use plain `<a>` tags. From any page other than `/`, these resolve to the current path + anchor instead of homepage + anchor.

---

### Plan

#### 1. Fix footer anchor links to work from any page
**File: `src/components/landing/FooterPlinq.tsx`**
- Replace raw `<a>` tags with a click handler that uses React Router `navigate()` for anchor links
- For `#`-prefixed hrefs, navigate to `/#anchor` when not on homepage, or scroll smoothly when already on homepage
- Import `useNavigate` and `useLocation` from react-router-dom

#### 2. Fix Dashboard back link — remove `target="_blank"`
**File: `src/components/dashboard/DashboardLayout.tsx`**
- Change the "Back to redflaq.com homepage" link from `<a href="/" target="_blank">` to a React Router `<Link to="/">` that navigates in the same tab

#### 3. Standardize Dispute page footer
**File: `src/pages/Dispute.tsx`**
- Replace `import Footer from "@/components/Footer"` with `import FooterPlinq from "@/components/landing/FooterPlinq"` and use `<FooterPlinq />` in the JSX

#### 4. Standardize Results page footer
**File: `src/pages/ResultsPageUpdated.tsx`**
- Same footer swap as Dispute page

#### 5. Add a "← Back to Home" breadcrumb on subpages that lack one
**Files**: About, Pricing, Blog, Shop, Partners, Terms, Privacy, Dispute, Coming Soon pages
- Add a small breadcrumb/back link (`← Home`) just below the hero/header area on pages that don't already have one (ToolLayout already has this pattern — replicate it)

---

### Technical Details

- Footer link handler pattern:
  ```typescript
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname === '/') {
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + href);
      }
    }
    // Route links (starting with /) work normally via <a>
  };
  ```

- Dashboard back link: simple `<Link to="/">` replacing the `<a target="_blank">` pattern

- Breadcrumb style: matches existing ToolLayout pattern (JetBrains Mono, 11px, purple, uppercase)

