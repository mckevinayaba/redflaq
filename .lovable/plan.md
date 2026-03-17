

## Update WhatsApp Access Token

**What**: Replace the expired `WHATSAPP_ACCESS_TOKEN` with your new permanent System User token.

**Steps**:
1. Update the `WHATSAPP_ACCESS_TOKEN` secret with the value you provide
2. Test the webhook by sending a simulated inbound message to confirm outbound delivery now works

That's it — no code changes needed. The `whatsapp-webhook` edge function already uses `Deno.env.get("WHATSAPP_ACCESS_TOKEN")` so the new token will take effect immediately.

