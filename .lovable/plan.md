

## Problem

The HomepageDemo card changes height every time it transitions between states (Search, Scanning, Result, Actions, Journal) because each panel has different content height. On mobile, the two columns stack vertically, so this height change shifts **all content below the demo**, causing visible "shaking" while scrolling.

## Fix

Make the panel content use **absolute positioning** inside the demo card so state transitions don't change the card's height. Set a generous `minHeight` that accommodates the tallest panel (JournalPanel, roughly 520px on mobile).

**File: `src/components/landing/HomepageDemo.tsx`**

1. On the demo card container (line 123-132), change `position: "relative"` is already set, and keep `minHeight` but increase it to ~520 to fit the tallest panel on mobile.

2. On the inner fade wrapper (lines 133-138), add `position: "absolute"`, `inset: 0`, and matching padding so the content floats inside the card without affecting its height. This way all 5 panels occupy the same fixed space and transitions are purely visual — no layout reflow.

This is the same pattern used by carousel/slideshow components to prevent content-shift during auto-rotation.

