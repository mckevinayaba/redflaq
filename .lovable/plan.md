

## Plan: Update Hero Pill Text

**Current state**: The hero has two separate elements:
1. A pill badge: `♡ Built for South African women facing GBVF`
2. A sub-line paragraph below it: `Built for South African women facing GBVF. Designed for anyone protecting the people they love.`

**Changes**:
1. **Update the pill text** (line 48) to contain the full message: `Built for South African women facing GBVF. Designed for anyone protecting the people they love.`
2. **Remove the separate sub-line paragraph** (lines 51-61) since its content is now merged into the pill
3. The pill keeps its existing purple styling (`#7C3AED` text, light purple background, pill shape with `♡` icon)
4. May need to slightly adjust pill padding/border-radius since the text is longer — possibly change from `borderRadius: 50` (circle ends) to `borderRadius: 24` (rounded rectangle) so it wraps nicely on mobile

**Files to edit**: `src/components/landing/HeroPlinq.tsx` — lines 33-61

