import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    console.log("Yoco webhook received:", JSON.stringify(body));

    const eventType = body.type;
    const payload = body.payload || body;

    // Only process successful payment events
    if (eventType !== "payment.succeeded" && payload.status !== "successful") {
      console.log("Ignoring non-success event:", eventType);
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
      return new Response(JSON.stringify({ error: "Missing metadata" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update manual_payments to verified
    const { error: updateError } = await supabase
      .from("manual_payments")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        verified_by: "yoco-webhook",
      })
      .eq("payment_id", paymentId);

    if (updateError) {
      console.error("Failed to update manual_payments:", updateError);
    }

    // Insert into purchases table for credit tracking
    const purchaseId = `PUR-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const amountZAR = payload.amount ? payload.amount / 100 : (credits === 1 ? 99 : credits === 3 ? 249 : 399);

    const { error: purchaseError } = await supabase.from("purchases").insert({
      purchase_id: purchaseId,
      email,
      amount: amountZAR,
      credits_purchased: credits,
      credits_remaining: credits,
      package_type: packageType,
      status: "completed",
      currency: "ZAR",
    });

    if (purchaseError) {
      console.error("Failed to insert purchase:", purchaseError);
    }

    console.log(`Payment ${paymentId} verified. ${credits} credits added for ${email}`);

    return new Response(JSON.stringify({ received: true, payment_id: paymentId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("yoco-webhook error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Webhook processing failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
