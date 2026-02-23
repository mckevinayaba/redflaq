import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

async function generateSignature(data: Record<string, string>, passphrase?: string): Promise<string> {
  const params = Object.entries(data)
    .filter(([k, v]) => k !== "signature" && v !== "")
    .map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, "+")}`)
    .join("&");

  const signatureString = passphrase
    ? `${params}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : params;

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
    // PayFast sends application/x-www-form-urlencoded
    const body = await req.text();
    const params = new URLSearchParams(body);
    const pfData: Record<string, string> = {};
    params.forEach((value, key) => {
      pfData[key] = value;
    });

    console.log("PayFast ITN received:", JSON.stringify(pfData));

    // 1. Verify signature
    const passphrase = Deno.env.get("PAYFAST_PASSPHRASE") || "";
    const receivedSignature = pfData.signature || "";
    const calculatedSignature = await generateSignature(pfData, passphrase || undefined);

    if (calculatedSignature !== receivedSignature) {
      console.error("Signature mismatch:", { received: receivedSignature, calculated: calculatedSignature });
      return new Response("Signature mismatch", { status: 400 });
    }

    // 2. Check payment status
    const paymentStatus = pfData.payment_status;
    if (paymentStatus !== "COMPLETE") {
      console.log("Payment not complete, status:", paymentStatus);
      // Still acknowledge receipt
      return new Response("OK", { status: 200 });
    }

    // 3. Extract payment details
    const paymentId = pfData.m_payment_id;
    const amountGross = parseFloat(pfData.amount_gross || "0");
    const packageType = pfData.custom_str1 || "single";
    const credits = parseInt(pfData.custom_int1 || "1", 10);

    if (!paymentId) {
      console.error("No payment ID in ITN");
      return new Response("Missing payment ID", { status: 400 });
    }

    // 4. Update payment record
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Update manual_payments status to verified
    const { error: updateError } = await supabase
      .from("manual_payments")
      .update({
        status: "verified",
        verified_at: new Date().toISOString(),
        reference: pfData.pf_payment_id || "",
        notes: `PayFast ITN: ${paymentStatus}, amount: ${amountGross}`,
      })
      .eq("payment_id", paymentId);

    if (updateError) {
      console.error("Error updating manual_payments:", updateError);
    }

    // Also create a purchase record for credits tracking
    const { data: existingPayment } = await supabase
      .from("manual_payments")
      .select("email")
      .eq("payment_id", paymentId)
      .single();

    if (existingPayment) {
      // Calculate expiry based on package
      const expiryDays: Record<string, number> = { single: 30, triple: 90, five: 180 };
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (expiryDays[packageType] || 30));

      await supabase.from("purchases").insert({
        purchase_id: paymentId,
        email: existingPayment.email,
        amount: amountGross,
        credits_purchased: credits,
        credits_remaining: credits,
        package_type: packageType,
        status: "completed",
        currency: "ZAR",
        expires_at: expiresAt.toISOString(),
      });
    }

    // Log admin event
    await supabase.from("admin_events").insert({
      event_type: "payfast_payment_confirmed",
      details: {
        payment_id: paymentId,
        pf_payment_id: pfData.pf_payment_id,
        amount: amountGross,
        package_type: packageType,
        credits,
        email: existingPayment?.email,
      },
    });

    console.log("PayFast ITN processed successfully for:", paymentId);
    return new Response("OK", { status: 200 });
  } catch (err) {
    console.error("PayFast ITN error:", err);
    return new Response("Server error", { status: 500 });
  }
});
