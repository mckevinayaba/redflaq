

# Fix: Show user state clearly on landing page navbar

## Problem
When you're logged in and visit the landing page, the "Sign up free" and "Log in" buttons disappear (correct behaviour), but nothing replaces them. You only see "VERIFY NOW" with no indication that you're signed in or any way to reach your dashboard. This feels broken.

## Solution
When authenticated, replace the "Sign up free / Log in" buttons with:
- A **"Dashboard"** link that goes to `/dashboard`
- The same **user avatar button** used in the app header (showing your initial, with a dropdown for Dashboard, Account, Log out)

This way:
- Not logged in: you see "Log in", "Sign up free", "Verify Now"
- Logged in: you see "Dashboard", avatar dropdown, "Verify Now"

## Technical Details

### File: `src/components/landing/NavbarPlinq.tsx`
- Import `supabase` client and `useToast` for logout
- When `isAuthenticated` is true, render:
  - A "Dashboard" text link navigating to `/dashboard`
  - A circular avatar button (user initial) with a dropdown (Dashboard, Account, Log out) -- matching the app header style
- Keep "Verify Now" button visible in both states
- Apply the same logic to the mobile menu: show "Dashboard" and "Log out" instead of "Log in" and "Sign up free" when authenticated

