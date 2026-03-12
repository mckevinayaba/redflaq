

## Problem

The Safety Tips page (`/safety-tips`) uses dark purple gradient backgrounds (`#0F0624` → `#1B0D3A`) throughout — hero, safety card grid, red flags section, provincial resources, and footer CTA. The user wants it to match the **light landing page style** used on the homepage: warm beige (`#F5F0EB`) background with white cards (`#FFFFFF`), `#E6E0DA` borders, and purple accents (`#6B4EFF`) — no dark blue-black containers.

## What Changes

Convert every dark section on the Safety Tips page to the warm beige + white card design system. No text, layout, or functionality changes.

### Files to update

| File | Current problem | Fix |
|------|----------------|-----|
| **SafetyTips.tsx** | Hero uses dark gradient; "Before You Check" red flags section uses dark gradient; Footer CTA uses dark gradient | Hero → beige bg with white text becoming dark text; Red flags → white cards on beige; Footer CTA → white card with purple accents |
| **SafetyCardGrid.tsx** | Entire container uses dark gradient; cards use semi-transparent dark surfaces | Container → beige; cards → white bg with `#E6E0DA` border; "Get Help Now" keeps red accent but on white card |
| **GBVResourcesSection.tsx** | National helplines container uses `#0F0624` dark bg | National helplines → white card with left purple border; province chips already correct |
| **ProvincialResourcesSection.tsx** | Entire section uses dark gradient; resource cards use dark transparent bg | Section → beige; resource cards → white with `#E6E0DA` border; text → dark `#2B2B2B` / `#6B7280` |

### Design tokens to use everywhere

- Page/section background: `#F5F0EB`
- Card background: `#FFFFFF`
- Card border: `1px solid #E6E0DA`
- Card shadow: `0 2px 8px rgba(0,0,0,0.05)`
- Card border-radius: `20px`
- Headlines: `#1F1F1F`
- Body text: `#555555` or `#6B7280`
- Accent: `#6B4EFF`
- Icon circles: `#F1ECFF` background, `#6B4EFF` icon
- Emergency "Get Help Now" card: keeps red accent (`#E53935`) as border-left or subtle highlight, not full red gradient
- Section labels: purple mono text with line accent (same as landing page)

### Hero section specifically

Replace the dark gradient with the same warm beige (`#F5F0EB`) used on the homepage hero. Headline text becomes `#1F1F1F`, subtext becomes `#555555`, "Safety" keyword stays `#6B4EFF`. Button stays purple pill style.

### Summary

This is a styling-only pass across 4 files. Every dark `#0F0624`/`#1B0D3A` background gets replaced with the light design system. All card surfaces become white. All text colors flip from white/`#C8C3D6` to dark `#1F1F1F`/`#6B7280`. No layout, content, or functionality changes.

