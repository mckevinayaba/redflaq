import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://redflaq.com",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
    const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;

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

      const res = await fetch(
        `https://graph.facebook.com/v21.0/${phoneId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: convo.phone_number,
            type: "text",
            text: { body: reminder },
          }),
        }
      );

      if (res.ok) {
        // Log outbound
        await supabase
          .from("whatsapp_messages")
          .insert({
            phone_number: convo.phone_number,
            message_text: reminder,
            direction: "outbound",
          });

        // Move to MENU so we don't send again
        await supabase
          .from("whatsapp_conversations")
          .update({
            current_state: "FOLLOWUP_SENT",
            updated_at: new Date().toISOString(),
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
