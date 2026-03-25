import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://redflaq.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) {
      throw new Error("YOCO_SECRET_KEY not configured");
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const webhookUrl = `${supabaseUrl}/functions/v1/yoco-webhook`;

    console.log("Registering Yoco webhook:", webhookUrl);

    // First, list existing webhooks to avoid duplicates
    const listRes = await fetch("https://payments.yoco.com/api/webhooks", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
    });

    if (listRes.ok) {
      const existing = await listRes.json();
      console.log("Existing webhooks:", JSON.stringify(existing));

      // Check if our webhook is already registered
      const webhooks = Array.isArray(existing) ? existing : (existing.webhooks || []);
      const alreadyRegistered = webhooks.some(
        (wh: any) => wh.url === webhookUrl
      );

      if (alreadyRegistered) {
        console.log("Webhook already registered, skipping.");
        return new Response(
          JSON.stringify({ success: true, message: "Webhook already registered", webhookUrl }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    } else {
      const errText = await listRes.text();
      console.log("Could not list existing webhooks:", listRes.status, errText);
    }

    // Register the webhook
    const registerRes = await fetch("https://payments.yoco.com/api/webhooks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        name: "RedFlaq Payment Webhook",
        url: webhookUrl,
        events: ["payment.succeeded", "payment.failed"],
      }),
    });

    const registerBody = await registerRes.text();
    console.log("Yoco webhook registration response:", registerRes.status, registerBody);

    if (!registerRes.ok) {
      throw new Error(`Yoco webhook registration failed: ${registerRes.status} - ${registerBody}`);
    }

    const result = JSON.parse(registerBody);

    // Yoco returns a `secret` field in the registration response.
    // This is the HMAC signing secret for verifying incoming webhook requests.
    // REQUIRED ACTION: copy the value below and set it as YOCO_WEBHOOK_SECRET
    // in your Supabase project secrets (Settings → Edge Functions → Secrets).
    if (result.secret) {
      console.log("=== YOCO WEBHOOK SIGNING SECRET (store as YOCO_WEBHOOK_SECRET) ===");
      console.log(result.secret);
      console.log("=================================================================");
    } else {
      console.warn("Yoco registration response did not include a 'secret' field. Check the full response:", JSON.stringify(result));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Webhook registered successfully. Copy webhook_secret into YOCO_WEBHOOK_SECRET Supabase secret.",
        webhookUrl,
        webhook_secret: result.secret ?? null,
        yocoResponse: result,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("register-yoco-webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Registration failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
