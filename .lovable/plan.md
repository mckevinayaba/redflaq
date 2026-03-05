

## Assessment

The `GBVResourcesSection.tsx` component already implements nearly everything in Prompt 1:

- All 9 province chips (clickable, single-select, no default)
- All national resources with `tel:` links
- All provincial resources for all 9 provinces with `tel:` links
- WhatsApp button for Rape Crisis Cape Town
- Category badges (Crisis, TCC, Counselling, Legal, Support)
- Accessibility: `aria-pressed`, `aria-label`, 44px min touch targets
- Mobile: chips wrap, cards stack vertically
- Fade-in animation on province selection

**One missing item**: "KZN Network on Violence Against Women: kznnetwork.co.za" is listed in Prompt 1 but not in the component's KZN data.

## Plan

**Single change** in `src/components/safety/GBVResourcesSection.tsx`:

Add the KZN Network entry to the `"KwaZulu-Natal"` array in `provincialResources`. Since it's a website (not a phone number), render it as an external link rather than a `tel:` link.

```typescript
// Add to KZN array:
{ name: "KZN Network on Violence Against Women", phone: "kznnetwork.co.za", category: "support" }
```

Update the `ResourceCard` component to detect non-phone entries (no digits in the phone field) and render as an external `https://` link instead of `tel:`.

No other changes needed. The structure, data, and functionality from Prompt 1 are already built and integrated into the Safety Tips page.

