import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACKAGE_LABELS: Record<string, string> = {
  single: "One Safety Check",
  triple: "Safety Pack (3 Checks)",
  five: "Family & Friends (5 Checks)",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    let body: any;
    const rawBody = await req.text();

    if (!rawBody || rawBody.trim() === "") {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error("Failed to parse webhook body:", rawBody.substring(0, 500));
      return new Response(JSON.stringify({ received: true, error: "Invalid JSON" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Yoco webhook received:", JSON.stringify(body));

    const eventType = body.type;
    const payload = body.payload || body;

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle failed payments
    if (eventType === "payment.failed" || payload.status === "failed") {
      const metadata = payload.metadata || {};
      if (metadata.payment_id) {
        await supabase
          .from("manual_payments")
          .update({ status: "failed" })
          .eq("payment_id", metadata.payment_id);
      }
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Only process successful payment events
    if (eventType !== "payment.succeeded" && payload.status !== "successful") {
      console.log("Ignoring non-success event:", eventType, payload.status);
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const metadata = payload.metadata || {};
    const paymentId = metadata.payment_id;
    const email = metadata.email;
    const credits = parseInt(metadata.credits || "1", 10);
    const packageType = metadata.package_type || "single";

    if (!paymentId || !email) {
      console.error("Missing metadata in webhook:", metadata);
      return new Response(JSON.stringify({ received: true, error: "Missing metadata" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Idempotency check
    const { data: existingPayment } = await supabase
      .from("manual_payments")
      .select("status")
      .eq("payment_id", paymentId)
      .single();

    if (existingPayment?.status === "verified") {
      console.log(`Payment ${paymentId} already verified, skipping`);
      return new Response(JSON.stringify({ received: true, already_processed: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Update manual_payments to verified
    await supabase
      .from("manual_payments")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        verified_by: "yoco-webhook",
      })
      .eq("payment_id", paymentId);

    // Insert into purchases table
    const purchaseId = `PUR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const amountZAR = payload.amount ? payload.amount / 100 : (credits === 1 ? 99 : credits === 3 ? 249 : 399);

    await supabase.from("purchases").insert({
      purchase_id: purchaseId,
      email,
      amount: amountZAR,
      credits_purchased: credits,
      credits_remaining: credits,
      package_type: packageType,
      status: "completed",
      currency: "ZAR",
    });

    console.log(`Payment ${paymentId} verified. ${credits} credits added for ${email}`);

    // ── SEND EMAIL NOTIFICATIONS ──

    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    const packageLabel = PACKAGE_LABELS[packageType] || packageType;
    const now = new Date();
    const sastTime = now.toLocaleString("en-ZA", { timeZone: "Africa/Johannesburg" });

    // 1. Email to founder
    try {
      await supabase.functions.invoke("send-email", {
        body: {
          admin_password: adminPassword,
          to: "support@redflaq.com",
          subject: `New Payment Received — R${amountZAR} — ${email}`,
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <img src="https://redflaq.lovable.app/redflaq-logo-email.png" alt="RedFlaq" height="40" style="margin-bottom: 24px;" />
              <h2 style="color: #1a1a1a; margin: 0 0 20px;">💰 New Payment Received</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr><td style="padding: 8px 0; color: #666;">Customer Email</td><td style="padding: 8px 0; font-weight: 700;">${email}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Package</td><td style="padding: 8px 0; font-weight: 700;">${packageLabel}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Amount</td><td style="padding: 8px 0; font-weight: 700;">R${amountZAR}.00</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Credits</td><td style="padding: 8px 0; font-weight: 700;">${credits}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Date/Time (SAST)</td><td style="padding: 8px 0; font-weight: 700;">${sastTime}</td></tr>
                <tr><td style="padding: 8px 0; color: #666;">Payment Ref</td><td style="padding: 8px 0; font-weight: 700; font-family: monospace; font-size: 12px;">${paymentId}</td></tr>
              </table>
              <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
              <p style="font-size: 13px; color: #999;">Log in to your <a href="https://redflaq.lovable.app/admin" style="color: #7C3AED;">admin dashboard</a> to manage payments.</p>
            </div>
          `,
        },
      });
    } catch (e) {
      console.error("Failed to send founder payment email:", e);
    }

    // 2. Confirmation email to customer
    try {
      await supabase.functions.invoke("send-email", {
        body: {
          admin_password: adminPassword,
          to: email,
          subject: "Your RedFlaq checks are ready ✅",
          html: `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <div style="text-align: center; margin-bottom: 28px;">
                <img src="https://redflaq.lovable.app/redflaq-logo-email.png" alt="RedFlaq" height="44" />
              </div>
              <h2 style="font-size: 22px; color: #1a1a1a; text-align: center; margin: 0 0 8px;">Payment Confirmed! 🎉</h2>
              <p style="text-align: center; color: #666; font-size: 14px; margin-bottom: 24px;">Your safety checks are ready to use.</p>
              <div style="background: #F3F0FF; border: 1px solid #DDD6FE; border-radius: 8px; padding: 20px; margin-bottom: 24px;">
                <table style="width: 100%; font-size: 14px; border-collapse: collapse;">
                  <tr><td style="padding: 6px 0; color: #666;">Package</td><td style="padding: 6px 0; font-weight: 700; text-align: right;">${packageLabel}</td></tr>
                  <tr><td style="padding: 6px 0; color: #666;">Checks Available</td><td style="padding: 6px 0; font-weight: 700; text-align: right; color: #16A34A;">${credits}</td></tr>
                  <tr><td style="padding: 6px 0; color: #666;">Amount Paid</td><td style="padding: 6px 0; font-weight: 700; text-align: right;">R${amountZAR}.00</td></tr>
                </table>
              </div>
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://redflaq.com/signup?mode=signin" style="display: inline-block; background: #7C3AED; color: white; padding: 14px 36px; text-decoration: none; font-size: 15px; font-weight: 700; border-radius: 8px;">Start Verifying Now →</a>
              </div>
              <p style="font-size: 12px; color: #999; text-align: center; margin-top: 24px;">Reference: ${paymentId}</p>
              <hr style="border: none; border-top: 1px solid #E5E7EB; margin: 24px 0;" />
              <p style="font-size: 11px; color: #999; text-align: center;">
                RedFlaq · South African Background Checks · <a href="https://redflaq.com/privacy" style="color: #999;">Privacy</a> · <a href="https://redflaq.com/terms" style="color: #999;">Terms</a>
              </p>
            </div>
          `,
        },
      });
    } catch (e) {
      console.error("Failed to send customer confirmation email:", e);
    }

    return new Response(JSON.stringify({ received: true, payment_id: paymentId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("yoco-webhook error:", err);
    return new Response(
      JSON.stringify({ received: true, error: err instanceof Error ? err.message : "Webhook processing failed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
