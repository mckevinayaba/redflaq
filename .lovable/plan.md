

## Store Resend API Key

**What happens now:**
1. You'll be prompted to paste your Resend API key into a secure input field
2. The key will be stored as a backend secret called `RESEND_API_KEY` — only accessible by backend functions, never exposed to the browser
3. The existing `send-email` function will immediately start sending real emails via Resend — no code changes needed

**After the key is stored:**
1. Wire up search completion emails (send results link when a check finishes)
2. Wire up welcome email on signup
3. Update admin dashboard to remove the hardcoded email warning

