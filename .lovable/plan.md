

## Problem

The catch-all error message on line 148 — "We couldn't complete this search right now. You won't be charged for this attempt." — is too vague. The edge function returns specific error messages (e.g., "Payment not yet verified", "Failed to deduct credit", "Authentication required", "User not found") but the frontend discards them and shows a generic message.

## Plan

### Improve error handling in `src/pages/DashboardNewCheck.tsx` (lines 137-150)

Replace the generic catch block with smarter error mapping that:

1. **Passes through the actual server error** when it's user-meaningful
2. **Maps known error strings** to friendly messages:
   - `"Payment not yet verified"` → "Your payment hasn't been verified yet. Please allow a few minutes for processing, then try again."
   - `"Invalid payment ID"` → "We couldn't find a valid payment for your account. Please purchase a package first."
   - `"Failed to deduct credit"` → "Something went wrong processing your credit. Please try again or contact support."
   - `"Authentication required"` → "You need to be signed in to run a check. Please log in and try again."
   - `"User not found"` → "We couldn't verify your account. Please log out, log back in, and try again."
   - Network/fetch errors → keep existing message about trying again
   - Unknown errors → "Something went wrong: [actual error]. You have not been charged. Please try again."
3. **Always include the real error** in the displayed message so the user knows what happened, instead of a dead-end generic line

This is a single-file change to the error handling block in `DashboardNewCheck.tsx`.

