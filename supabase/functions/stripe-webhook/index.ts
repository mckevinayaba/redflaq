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
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
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
