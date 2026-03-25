// Shared WhatsApp Meta API send helper
// Used by whatsapp-webhook and whatsapp-followup

export async function sendWhatsAppMessage(
  to: string,
  text: string
): Promise<{ ok: boolean; error?: string }> {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
  const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;

  try {
    const res = await fetch(
      `https://graph.facebook.com/v21.0/${phoneId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to,
          type: "text",
          text: { body: text },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Meta send error:", res.status, errBody);
      return { ok: false, error: `${res.status}: ${errBody}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("Meta send fetch error:", err);
    return { ok: false, error: String(err) };
  }
}

/**
 * Sanitize user name input:
 * - Strip control characters
 * - Cap at 100 characters
 * - Trim whitespace
 */
export function sanitizeName(input: string): string {
  return input
    .replace(/[\x00-\x1F\x7F]/g, "") // strip control chars
    .trim()
    .slice(0, 100);
}
