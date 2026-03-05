

## Problems Identified

1. **Payment modal shows wrong price**: `useState(packageType)` on line 15 of `PaymentModal.tsx` only uses the prop as the *initial* value. If the modal was previously opened with a different package, React reuses the stale state because the component isn't unmounted/remounted between clicks. The displayed price doesn't match what the user clicked.

2. **Default selection is "3-pack" instead of "single"**: In `PricingPlinq.tsx` line 11, `selectedPackage` defaults to `"3-pack"`. This means when the modal opens, it pre-selects R249 regardless of which button was clicked (compounding issue #1).

3. **Close button barely visible**: The X button uses `text-muted-foreground` which blends into the white modal background.

## Plan

### Fix 1: Sync modal selection with prop (PaymentModal.tsx)
- Add a `useEffect` that updates `selectedPackage` whenever the `packageType` prop changes, so the radio selection and displayed price always match the button the user clicked.

### Fix 2: Default to "single" in PricingPlinq.tsx
- Change the initial `selectedPackage` state from `"3-pack"` to `"single"` so R99 is always the default if no specific button was clicked.

### Fix 3: Make close button visible (PaymentModal.tsx)
- Style the close button with a dark background circle (`bg-foreground/10` or similar) and darker icon color so it's clearly visible against the white modal. Add a hover state for better UX.

