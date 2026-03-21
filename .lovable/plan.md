

## Add "Back" Navigation to Behavioral Signal Detection Page

### Problem
The Behavioral Signal Detection page (`/dashboard/behavioral-signals`) has no back link at the top. Users are stuck without an obvious way to return to the main dashboard.

### Fix

**File: `src/pages/BehavioralSignalDetection.tsx`**
- Add a "← Back to Dashboard" link above the page heading (line ~193), using `Link` from react-router-dom pointing to `/dashboard`
- Style it consistently with the existing pattern used across the site: JetBrains Mono, 11px, uppercase, purple (`#7C3AED`), with hover effect

The link will be inserted just before the `<h1>` inside the content area:

```
← BACK TO DASHBOARD
Behavioral Signal Detection
Identify warning signs that go beyond criminal records.
```

### Scope
- Single file edit: `src/pages/BehavioralSignalDetection.tsx`
- Matches the breadcrumb pattern already used in ToolLayout, AcademyArticle, BlogArticle, etc.

