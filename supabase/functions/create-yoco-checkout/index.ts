/**
 * ═══════════════════════════════════════════════════════════════════
 * YOCO CHECKOUT SESSION CREATOR
 * ═══════════════════════════════════════════════════════════════════
 *
 * Creates a Yoco Checkout session for purchasing safety check credits.
 * Called from the PaymentModal component when a user selects a package.
 *
 * PACKAGES:
 * - single: R99 → 1 credit
 * - triple: R249 → 3 credits
 * - five:   R399 → 5 credits
 *
 * FLOW:
 * 1. Validates email and package type
 * 2. Creates a Yoco Checkout session via their API
 * 3. Inserts a pending manual_payments record
 * 4. Returns the redirect URL for the hosted payment page
 *
 * SECURITY: verify_jwt = false (pre-auth purchase flow).
 * YOCO_SECRET_KEY is stored as a backend secret.
 * ═══════════════════════════════════════════════════════════════════
 */
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACKAGES: Record<string, { amountCents: number; credits: number; label: string; type: string }> = {
  single: { amountCents: 9900, credits: 1, label: "1 Safety Check", type: "single" },
  triple: { amountCents: 24900, credits: 3, label: "3 Safety Checks", type: "triple" },
  five: { amountCents: 39900, credits: 5, label: "5 Safety Checks", type: "five" },
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

    const yocoSecretKey = Deno.env.get("YOCO_SECRET_KEY");
    if (!yocoSecretKey) {
      throw new Error("YOCO_SECRET_KEY not configured");
    }

    const paymentId = `RF-YOCO-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const origin = req.headers.get("origin") || "https://redflaq.lovable.app";

    // Include package_type in success URL so the success page can show details optimistically
    const successUrl = `${origin}/payment-success?payment_id=${paymentId}&email=${encodeURIComponent(email)}&package_type=${package_type}`;

    const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        amount: pkg.amountCents,
        currency: "ZAR",
        successUrl,
        cancelUrl: `${origin}/payment-cancelled`,
        showPaymentMethods: true,
        metadata: {
          payment_id: paymentId,
          package_type,
          credits: String(pkg.credits),
          email,
        },
      }),
    });

    if (!yocoRes.ok) {
      const errBody = await yocoRes.text();
      console.error("Yoco API error:", yocoRes.status, errBody);
      throw new Error(`Yoco API error: ${yocoRes.status}`);
    }

    const yocoData = await yocoRes.json();

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("manual_payments").insert({
      payment_id: paymentId,
      email,
      amount: pkg.amountCents / 100,
      package_type,
      search_credits: pkg.credits,
      status: "pending",
      payment_method: "yoco",
      reference: yocoData.id,
    });

    return new Response(
      JSON.stringify({
        redirectUrl: yocoData.redirectUrl,
        payment_id: paymentId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-yoco-checkout error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
