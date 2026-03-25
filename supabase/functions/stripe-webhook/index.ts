import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  apiVersion: "2025-08-27.basil",
});

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200 });
  }

  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    let event: Stripe.Event;

    if (webhookSecret && signature) {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
    } else {
      // Fallback: parse without verification (dev mode)
      event = JSON.parse(body) as Stripe.Event;
      console.warn("No webhook secret configured — skipping signature verification");
    }

    console.log("Stripe webhook event:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata || {};
      const paymentId = metadata.payment_id;
      const packageType = metadata.package_type || "single";
      const credits = parseInt(metadata.credits || "1", 10);
      const email = metadata.email || session.customer_email || "";
      const amountTotal = (session.amount_total || 0) / 100;

      if (!paymentId) {
        console.error("No payment_id in session metadata");
        return new Response("Missing payment_id", { status: 400 });
      }

      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Update manual_payments
      await supabase
        .from("manual_payments")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
          reference: session.id,
          notes: `Stripe checkout completed, amount: ${amountTotal} ${session.currency?.toUpperCase()}`,
        })
        .eq("payment_id", paymentId);

      // Create purchase record
      const expiryDays: Record<string, number> = { single: 30, triple: 90, five: 180 };
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (expiryDays[packageType] || 30));

      await supabase.from("purchases").insert({
        purchase_id: paymentId,
        email,
        amount: amountTotal,
        credits_purchased: credits,
        credits_remaining: credits,
        package_type: packageType,
        status: "completed",
        currency: session.currency?.toUpperCase() || "ZAR",
        expires_at: expiresAt.toISOString(),
      });

      // Log admin event
      await supabase.from("admin_events").insert({
        event_type: "stripe_payment_confirmed",
        details: {
          payment_id: paymentId,
          stripe_session_id: session.id,
          amount: amountTotal,
          package_type: packageType,
          credits,
          email,
        },
      });

      // Send confirmation email
      if (email) {
        const packageLabels: Record<string, string> = {
          single: "Single Safety Check",
          triple: "Safety Pack (3 Checks)",
          five: "Family & Friends Pack (5 Checks)",
        };
        const packageLabel = packageLabels[packageType] || packageType;
        const expiryLabel = expiresAt.toLocaleDateString("en-ZA", { year: "numeric", month: "long", day: "numeric" });

        const emailHtml = `
          <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#dc2626;font-size:24px;margin:0;">RedFlaq</h1>
            </div>
            <h2 style="color:#111;font-size:20px;">Payment Confirmed ✅</h2>
            <p style="color:#333;font-size:15px;line-height:1.6;">
              Thank you for your purchase! Here's your receipt:
            </p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0;">
              <tr><td style="padding:8px 0;color:#666;">Package</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${packageLabel}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Amount Paid</td><td style="padding:8px 0;font-weight:bold;text-align:right;">R${amountTotal.toFixed(2)}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Credits</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${credits}</td></tr>
              <tr><td style="padding:8px 0;color:#666;">Valid Until</td><td style="padding:8px 0;font-weight:bold;text-align:right;">${expiryLabel}</td></tr>
            </table>
            <div style="text-align:center;margin:24px 0;">
              <a href="https://redflaq.com/search-form?payment_id=${paymentId}" style="display:inline-block;background:#dc2626;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:16px;">
                Start Your Safety Check →
              </a>
            </div>
            <p style="color:#999;font-size:12px;text-align:center;margin-top:32px;">
              Payment ID: ${paymentId}<br/>
              If you have questions, reply to this email or contact hello@redflaq.com
            </p>
          </div>
        `;

        try {
          const emailRes = await fetch(`${supabaseUrl}/functions/v1/send-email`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`,
            },
            body: JSON.stringify({
              to: email,
              subject: "Payment Confirmed — Your RedFlaq Safety Check Credits",
              html: emailHtml,
            }),
          });
          const emailData = await emailRes.json();
          console.log("Confirmation email result:", emailData);
        } catch (emailErr) {
          console.error("Failed to send confirmation email:", emailErr);
        }
      }

      console.log("Stripe webhook processed for:", paymentId);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Webhook error" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
});
