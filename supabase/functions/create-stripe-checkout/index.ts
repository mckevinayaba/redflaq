import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACKAGES: Record<string, { priceId: string; credits: number; type: string }> = {
  single: {
    priceId: "price_1T5Bu7Io1tKnsaAK6nODCitj",
    credits: 1,
    type: "single",
  },
  triple: {
    priceId: "price_1T5BuLIo1tKnsaAKdmSUzBBE",
    credits: 3,
    type: "triple",
  },
  five: {
    priceId: "price_1T5BuXIo1tKnsaAKBpB2lpMo",
    credits: 5,
    type: "five",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, package_type } = await req.json();

    if (!email || !email.includes("@")) {
      return new Response(JSON.stringify({ error: "Valid email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pkg = PACKAGES[package_type];
    if (!pkg) {
      return new Response(JSON.stringify({ error: "Invalid package type" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Check for existing Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    // Generate a unique payment ID for tracking
    const paymentId = `RF-STRIPE-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const origin = req.headers.get("origin") || "https://redflaq.lovable.app";

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : email,
      line_items: [{ price: pkg.priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${origin}/payment-success?session_id={CHECKOUT_SESSION_ID}&payment_id=${paymentId}`,
      cancel_url: `${origin}/payment-cancelled`,
      metadata: {
        payment_id: paymentId,
        package_type: package_type,
        credits: String(pkg.credits),
        email,
      },
    });

    // Store pending payment in manual_payments
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("manual_payments").insert({
      payment_id: paymentId,
      email,
      amount: session.amount_total ? session.amount_total / 100 : 0,
      package_type,
      search_credits: pkg.credits,
      status: "pending",
      payment_method: "stripe",
      reference: session.id,
    });

    return new Response(
      JSON.stringify({ url: session.url, payment_id: paymentId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-stripe-checkout error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
