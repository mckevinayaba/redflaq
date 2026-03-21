import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const PACKAGES: Record<string, { amount: number; credits: number; item: string }> = {
  single: { amount: 99, credits: 1, item: "RedFlaq Safety Check – 1 Check" },
  triple: { amount: 249, credits: 3, item: "RedFlaq Safety Pack – 3 Checks" },
  five: { amount: 399, credits: 5, item: "RedFlaq Family & Friends – 5 Checks" },
};

async function generateSignature(data: Record<string, string>, passphrase?: string): Promise<string> {
  // Build the parameter string in order
  const params = Object.entries(data)
    .filter(([_, v]) => v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");

  const signatureString = passphrase
    ? `${params}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : params;

  // MD5 hash
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(signatureString);
  const hashBuffer = await crypto.subtle.digest("MD5", dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

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

    const merchantId = Deno.env.get("PAYFAST_MERCHANT_ID")!;
    const merchantKey = Deno.env.get("PAYFAST_MERCHANT_KEY")!;
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || "";

    // Generate a unique payment ID
    const paymentId = `RF-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const baseUrl = Deno.env.get("APP_BASE_URL")
      || req.headers.get("origin")
      || "https://redflaq.lovable.app";

    // PayFast data — order matters for signature
    const pfData: Record<string, string> = {
      merchant_id: merchantId,
      merchant_key: merchantKey,
      return_url: `${baseUrl}/payment-success?payment_id=${paymentId}`,
      cancel_url: `${baseUrl}/payment-cancelled`,
      notify_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/payfast-itn`,
      email_address: email,
      m_payment_id: paymentId,
      amount: pkg.amount.toFixed(2),
      item_name: pkg.item,
      custom_str1: package_type,
      custom_int1: String(pkg.credits),
    };

    const signature = await generateSignature(pfData, passphrase || undefined);
    pfData.signature = signature;

    // Store pending payment in manual_payments
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from("manual_payments").insert({
      payment_id: paymentId,
      email,
      amount: pkg.amount,
      package_type,
      search_credits: pkg.credits,
      status: "pending",
      payment_method: "payfast",
    });

    // Build the PayFast redirect URL
    const pfHost = "https://www.payfast.co.za/eng/process";
    const formFields = Object.entries(pfData).map(
      ([k, v]) => `${k}=${encodeURIComponent(v)}`
    ).join("&");

    return new Response(
      JSON.stringify({
        success: true,
        payment_id: paymentId,
        redirect_url: `${pfHost}?${formFields}`,
        form_data: pfData,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("create-payfast-payment error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
