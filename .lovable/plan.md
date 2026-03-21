

## Plan: Remove ProblemAgitation Section

The `ProblemAgitation` component (screenshot content: "The truth South Africa isn't ready to hear" with 6 stat cards, emotional bridge, founder quote, and "RedFlaq is not another awareness campaign") will be removed from the landing page.

### Changes

**`src/pages/Index.tsx`**
- Remove the `ProblemAgitation` import (line 9)
- Remove `<ProblemAgitation />` usage (lines 90-91)

No other files reference or depend on `ProblemAgitation`, so removing it from Index.tsx is safe. The component file itself can remain (unused) or be deleted — either way nothing breaks.

