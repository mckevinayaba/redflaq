

## Plan: Update WHATSAPP_VERIFY_TOKEN Secret

The `WHATSAPP_VERIFY_TOKEN` secret already exists in the project. We need to update its value to `redflaq_verify_2025` so it matches what you'll enter in the Meta Developer Dashboard.

### Steps

1. **Update the secret** `WHATSAPP_VERIFY_TOKEN` to `redflaq_verify_2025`

2. **You then configure Meta Developer Dashboard**:
   - Go to your WhatsApp app → Configuration → Webhook
   - **Callback URL**: `https://gewwxdmxrwyosddczezg.supabase.co/functions/v1/whatsapp-webhook`
   - **Verify token**: `redflaq_verify_2025`
   - Subscribe to the **`messages`** webhook field

No code changes needed — just the secret update and Meta configuration.

