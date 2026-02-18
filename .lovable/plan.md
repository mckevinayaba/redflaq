

## Fix: Spacebar Not Working in Full Name Field

### Problem
The `sanitizeInput` function on line 96 of `SearchFormHonest.tsx` calls `.trim()`, which strips trailing spaces. Since this function runs on every keystroke (line 295: `onChange={(e) => setFullName(sanitizeInput(e.target.value))}`), pressing the spacebar after typing "ishmael" immediately removes the space before you can type the surname.

### Solution
Move `.trim()` out of `sanitizeInput` so it only runs at validation/submission time, not on every keystroke. The `sanitizeInput` function should only strip dangerous characters while typing, and trim whitespace only when the form is submitted or validated.

### Technical Details

**File: `src/pages/SearchFormHonest.tsx`**

1. Remove `.trim()` from `sanitizeInput` (line 97) -- keep the dangerous character stripping and length limit
2. Add `.trim()` to the `handleSubmit` function where `sanitizeInput` is called for the search body (line 178), so whitespace is cleaned before submission
3. The `onBlur` validator already trims via `name.trim()` on line 105, so blur validation is fine

This is a one-line fix that preserves all security sanitization while allowing normal typing with spaces.

