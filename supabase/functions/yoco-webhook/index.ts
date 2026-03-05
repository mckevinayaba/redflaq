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

  // Handle GET requests (Yoco may send a verification ping)
  if (req.method === "GET") {
    return new Response(JSON.stringify({ status: "ok" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    // Safely parse body - handle empty or non-JSON payloads
    let body: any;
    const rawBody = await req.text();
    
    if (!rawBody || rawBody.trim() === "") {
      console.log("Empty webhook body received, acknowledging");
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      body = JSON.parse(rawBody);
    } catch {
      console.error("Failed to parse webhook body:", rawBody.substring(0, 500));
      return new Response(JSON.stringify({ received: true, error: "Invalid JSON" }), {
        status: 200, // Return 200 so Yoco doesn't retry
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Yoco webhook received:", JSON.stringify(body));

    const eventType = body.type;
    const payload = body.payload || body;

    // Handle failed payments
    if (eventType === "payment.failed" || payload.status === "failed") {
      console.log("Payment failed event:", payload.id || "unknown");
      const metadata = payload.metadata || {};
      if (metadata.payment_id) {
        const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
        const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
        const supabase = createClient(supabaseUrl, supabaseKey);
        
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
      // Still return 200 to prevent Yoco retries
      return new Response(JSON.stringify({ received: true, error: "Missing metadata" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already processed (idempotency)
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
    // Always return 200 to prevent Yoco from retrying on our errors
    return new Response(
      JSON.stringify({ received: true, error: err instanceof Error ? err.message : "Webhook processing failed" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
