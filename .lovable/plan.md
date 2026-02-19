
# Fix: Make Signup and Sign-in Smoother

## Problem
The signup and sign-in technically work, but:
1. After signup, users must confirm their email before signing in -- there's no clear on-screen message explaining this (just a brief toast).
2. There's no visible success state after signing up -- the form just sits there looking the same.
3. If a user tries to sign in without confirming, they get a generic error ("Email not confirmed") with no guidance.

## Solution

### 1. Show a clear confirmation screen after signup
Instead of just a toast, replace the form with a visible confirmation message:
- Large envelope/email icon
- Heading: "Check your inbox"
- Body: "We sent a confirmation link to **[email]**. Click the link to activate your account, then come back and sign in."
- A "Resend email" button
- A "Back to sign in" link

### 2. Handle "Email not confirmed" sign-in error gracefully
When sign-in fails with "Email not confirmed":
- Show a specific message: "Your email hasn't been confirmed yet. Check your inbox for the confirmation link."
- Offer a "Resend confirmation email" button

### 3. Enable auto-confirm for faster testing (optional, your choice)
If you want to skip email confirmation entirely (users can sign up and immediately sign in), I can enable that. This is simpler but less secure.

## Technical Changes

### File: `src/pages/Signup.tsx`
- Add a `signupSuccess` state that toggles after successful signup
- When `signupSuccess` is true, render a confirmation card instead of the form
- In sign-in mode, detect `"Email not confirmed"` error and show a helpful message with a resend button
- Add a `handleResendConfirmation` function using `supabase.auth.resend()`

No database changes needed. No new files needed.
