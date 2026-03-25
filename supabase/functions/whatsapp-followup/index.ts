import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendWhatsAppMessage } from "../_shared/whatsapp-send.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Auth guard: only allow service-role or matching anon key from cron
    const authHeader = req.headers.get("authorization") || "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const token = authHeader.replace("Bearer ", "");
    if (token !== anonKey && token !== serviceKey) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Find conversations in CHECK_SENT state where last_message_at > 2 hours ago
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString();

    const { data: staleConvos } = await supabase
      .from("whatsapp_conversations")
      .select("*")
      .eq("current_state", "CHECK_SENT")
      .lt("last_message_at", twoHoursAgo)
      .not("last_generated_link", "is", null);

    if (!staleConvos || staleConvos.length === 0) {
      return new Response(JSON.stringify({ sent: 0 }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let sent = 0;

    for (const convo of staleConvos) {
      const reminder = `You started a RedFlaq safety check but did not finish it.

Most people only act after something feels wrong.

You are acting before.

Complete your check here:

${convo.last_generated_link}`;

      const result = await sendWhatsAppMessage(convo.phone_number, reminder);

      if (result.ok) {
        // Log outbound
        await supabase
          .from("whatsapp_messages")
          .insert({
            phone_number: convo.phone_number,
            message_text: reminder,
            direction: "outbound",
          });

        // Move to FOLLOWUP_SENT and update last_message_at
        await supabase
          .from("whatsapp_conversations")
          .update({
            current_state: "FOLLOWUP_SENT",
            updated_at: new Date().toISOString(),
            last_message_at: new Date().toISOString(),
          })
          .eq("id", convo.id);

        sent++;
      }
    }

    return new Response(JSON.stringify({ sent }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Followup error:", error);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
