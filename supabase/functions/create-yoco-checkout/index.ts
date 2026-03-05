import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACKAGES: Record<string, { amountCents: number; credits: number; label: string }> = {
  single: { amountCents: 9900, credits: 1, label: "1 Safety Check" },
  triple: { amountCents: 24900, credits: 3, label: "3 Safety Checks" },
  five: { amountCents: 39900, credits: 5, label: "5 Safety Checks" },
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

    // Create Yoco checkout session
    const yocoRes = await fetch("https://payments.yoco.com/api/checkouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${yocoSecretKey}`,
      },
      body: JSON.stringify({
        amount: pkg.amountCents,
        currency: "ZAR",
        successUrl: `${origin}/payment-success?payment_id=${paymentId}&email=${encodeURIComponent(email)}`,
        cancelUrl: `${origin}/payment-cancelled`,
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

    // Store pending payment
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
