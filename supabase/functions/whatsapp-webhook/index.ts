import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const VALID_PROVINCES = [
  "gauteng",
  "western cape",
  "kwazulu natal",
  "kwazulu-natal",
  "eastern cape",
  "limpopo",
  "mpumalanga",
  "north west",
  "free state",
  "northern cape",
];

const GREETINGS = [
  "hi",
  "hello",
  "hey",
  "redflaq",
  "check",
  "verify",
  "help",
  "start",
  "menu",
];

// ── Supabase client (service role for edge function) ──
function getSupabase() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
}

// ── Meta WhatsApp Send API ──
async function sendWhatsAppMessage(to: string, text: string): Promise<{ ok: boolean; error?: string }> {
  const token = Deno.env.get("WHATSAPP_ACCESS_TOKEN")!;
  const phoneId = Deno.env.get("WHATSAPP_PHONE_NUMBER_ID")!;

  try {
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
          to,
          type: "text",
          text: { body: text },
        }),
      }
    );

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Meta send error:", res.status, errBody);
      return { ok: false, error: `${res.status}: ${errBody}` };
    }

    return { ok: true };
  } catch (err) {
    console.error("Meta send fetch error:", err);
    return { ok: false, error: String(err) };
  }
}

// ── Log message ──
async function logMessage(
  supabase: ReturnType<typeof getSupabase>,
  phone: string,
  text: string,
  direction: "inbound" | "outbound",
  sendError?: string
) {
  await supabase
    .from("whatsapp_messages")
    .insert({
      phone_number: phone,
      message_text: sendError ? `[SEND FAILED: ${sendError}] ${text}` : text,
      direction,
    });
}

// ── Get or create conversation ──
async function getOrCreateConversation(
  supabase: ReturnType<typeof getSupabase>,
  phone: string
) {
  const { data } = await supabase
    .from("whatsapp_conversations")
    .select("*")
    .eq("phone_number", phone)
    .maybeSingle();

  if (data) return data;

  const { data: newConvo } = await supabase
    .from("whatsapp_conversations")
    .insert({ phone_number: phone, current_state: "START" })
    .select()
    .single();

  return newConvo;
}

// ── Update conversation state ──
async function updateConvo(
  supabase: ReturnType<typeof getSupabase>,
  phone: string,
  updates: Record<string, unknown>
) {
  await supabase
    .from("whatsapp_conversations")
    .update({ ...updates, updated_at: new Date().toISOString(), last_message_at: new Date().toISOString() })
    .eq("phone_number", phone);
}

// ── Get random opening ──
async function getRandomOpening(supabase: ReturnType<typeof getSupabase>) {
  const { data } = await supabase
    .from("whatsapp_openings")
    .select("opening_text")
    .eq("active", true);

  if (!data || data.length === 0) return "Welcome to RedFlaq. Reply 1 to run a safety check.";
  return data[Math.floor(Math.random() * data.length)].opening_text;
}

// ── State machine messages ──
const CONSENT_MSG = `RedFlaq is for legitimate safety decisions only.

Dating.

Hiring.

Allowing someone near your children.

Trust decisions that affect your safety.

Do you consent to use RedFlaq for a legitimate safety purpose?

Reply YES to continue.`;

const CHECK_NAME_MSG = `What is the full name of the person you want to check?`;

const CHECK_PROVINCE_MSG = `Which province should we use for the search?

Reply with:

Gauteng
Western Cape
KwaZulu Natal
Eastern Cape
Limpopo
Mpumalanga
North West
Free State
Northern Cape`;

function buildCheckLink(name: string, province: string): string {
  return `https://redflaq.com/dashboard/new-check?name=${encodeURIComponent(name)}&province=${encodeURIComponent(province)}&source=whatsapp&utm_source=whatsapp&utm_medium=bot&utm_campaign=check_start`;
}

function buildCheckSentMsg(link: string): string {
  return `Here is your RedFlaq check link.

It is already filled in with the details you gave me.

Complete your check here:

${link}

Your free account helps you:

save this check

use My Safety Journal

keep your records in one place

prepare earlier if something escalates`;
}

const SIGNUP_MSG = `Most people only think about safety when something already feels wrong.

By then, it is already serious.

A free RedFlaq account gives you:

• a place to save every check you run

• a private Safety Journal to document things early

• a record you control if something escalates

Because the reality is simple:

people are often only believed when they have proof.

Create your free account here:

https://redflaq.com/signup?source=whatsapp&utm_source=whatsapp&utm_medium=bot&utm_campaign=signup`;

const WHY_MSG = `South Africans are aware of gender based violence.

But awareness has not changed behavior.

People still trust without checking.

Meeting in a public place has not stopped it.

Sharing your location has not stopped it.

A good first impression has not stopped it.

RedFlaq exists for one moment:

before trust is given.

Check first.

Document early.

Protect yourself earlier.`;

const HELP_MSG = `If you are in immediate danger, go to a safe place now or contact emergency services.

You can access support resources here:

https://redflaq.com/safety-tips?source=whatsapp&utm_source=whatsapp&utm_medium=bot&utm_campaign=help

You are not alone.`;

const SHARE_MSG = `Someone in your life is about to trust someone they have not checked.

Send this to 3 people you care about:

Before you trust someone, RedFlaq first.

Check before the date.

Check before the hire.

Check before someone enters your home.

Start here:

https://redflaq.com/whatsapp?utm_source=whatsapp&utm_medium=bot&utm_campaign=share`;

const ERROR_MSG = `Something went wrong while processing your request.

Please try again in a moment or continue here:

https://redflaq.com/whatsapp`;

// ── Process state machine ──
async function processStateMachine(
  supabase: ReturnType<typeof getSupabase>,
  convo: Record<string, unknown>,
  msgText: string
): Promise<{ reply: string; newState: string; updates: Record<string, unknown> }> {
  const state = convo.current_state as string;
  const inputLower = msgText.toLowerCase();
  let reply = "";
  let newState = state;
  const updates: Record<string, unknown> = {};

  switch (state) {
    case "START": {
      reply = await getRandomOpening(supabase);
      newState = "MENU";
      break;
    }

    case "MENU": {
      if (inputLower === "1") {
        reply = CONSENT_MSG;
        newState = "CHECK_CONSENT";
      } else if (inputLower === "2") {
        reply = SIGNUP_MSG;
        newState = "MENU";
      } else if (inputLower === "3") {
        reply = WHY_MSG + "\n\nWhat would you like to do?\n\n1. Run a safety check now\n2. Create your free RedFlaq account\n3. Why RedFlaq exists\n4. Get help now\n5. Share this tool";
        newState = "MENU";
      } else if (inputLower === "4") {
        reply = HELP_MSG;
        newState = "MENU";
      } else if (inputLower === "5") {
        reply = SHARE_MSG;
        newState = "MENU";
      } else if (GREETINGS.some((g) => inputLower.includes(g))) {
        reply = await getRandomOpening(supabase);
        newState = "MENU";
      } else {
        reply = "Please reply with a number from 1 to 5:\n\n1. Run a safety check now\n2. Create your free RedFlaq account\n3. Why RedFlaq exists\n4. Get help now\n5. Share this tool";
        newState = "MENU";
      }
      break;
    }

    case "CHECK_CONSENT": {
      if (inputLower === "yes" || inputLower === "y") {
        reply = CHECK_NAME_MSG;
        newState = "CHECK_NAME";
        updates.consent_given = true;
      } else {
        reply = "No problem. You can return anytime.\n\nWhat would you like to do?\n\n1. Run a safety check now\n2. Create your free RedFlaq account\n3. Why RedFlaq exists\n4. Get help now\n5. Share this tool";
        newState = "MENU";
      }
      break;
    }

    case "CHECK_NAME": {
      if (msgText.length < 2) {
        reply = "Please enter the full name of the person you want to check.";
      } else {
        updates.name_entered = msgText;
        reply = CHECK_PROVINCE_MSG;
        newState = "CHECK_PROVINCE";
      }
      break;
    }

    case "CHECK_PROVINCE": {
      const matched = VALID_PROVINCES.find(
        (p) => inputLower.replace(/-/g, " ").includes(p) || p.includes(inputLower.replace(/-/g, " "))
      );
      if (matched) {
        const province = matched
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
        updates.province_entered = province;
        const link = buildCheckLink((convo.name_entered as string) || msgText, province);
        updates.last_generated_link = link;
        reply = buildCheckSentMsg(link);
        newState = "CHECK_SENT";
      } else {
        reply = "I did not recognise that province. " + CHECK_PROVINCE_MSG;
      }
      break;
    }

    case "CHECK_SENT":
    case "FOLLOWUP_SENT": {
      reply = "Welcome back.\n\nWhat would you like to do?\n\n1. Run a safety check now\n2. Create your free RedFlaq account\n3. Why RedFlaq exists\n4. Get help now\n5. Share this tool";
      newState = "MENU";
      break;
    }

    default: {
      reply = await getRandomOpening(supabase);
      newState = "MENU";
    }
  }

  return { reply, newState, updates };
}

// ── Main handler ──
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // GET = Meta webhook verification
  if (req.method === "GET") {
    const url = new URL(req.url);
    const mode = url.searchParams.get("hub.mode");
    const token = url.searchParams.get("hub.verify_token");
    const challenge = url.searchParams.get("hub.challenge");
    const verifyToken = Deno.env.get("WHATSAPP_VERIFY_TOKEN");

    if (mode === "subscribe" && token === verifyToken) {
      console.log("Webhook verified");
      return new Response(challenge, { status: 200 });
    }
    return new Response("Forbidden", { status: 403 });
  }

  // POST = incoming messages
  if (req.method === "POST") {
    // Clone request body early so error handler can read it
    const bodyText = await req.text();
    let from: string | undefined;

    try {
      const body = JSON.parse(bodyText);

      // Meta sends various webhook events; extract message
      const entry = body?.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;

      // Check for status updates (delivery receipts) — acknowledge but skip
      if (!value?.messages || value.messages.length === 0) {
        return new Response(JSON.stringify({ status: "ok" }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const message = value.messages[0];
      from = message.from; // sender phone number
      const msgText = (message.text?.body || "").trim();

      console.log(`Inbound from ${from}: "${msgText}"`);

      const supabase = getSupabase();

      // Log inbound
      await logMessage(supabase, from!, msgText, "inbound");

      // Get or create conversation
      const convo = await getOrCreateConversation(supabase, from!);
      if (!convo) throw new Error("Failed to get/create conversation");

      // Process state machine
      const { reply, newState, updates } = await processStateMachine(supabase, convo, msgText);

      // Update conversation state
      updates.current_state = newState;
      await updateConvo(supabase, from!, updates);

      // Send reply
      const sendResult = await sendWhatsAppMessage(from!, reply);

      // Log outbound (with failure info if send failed)
      await logMessage(supabase, from!, reply, "outbound", sendResult.ok ? undefined : sendResult.error);

      if (!sendResult.ok) {
        console.error(`Failed to send reply to ${from}: ${sendResult.error}`);
      }

      return new Response(JSON.stringify({ status: "ok" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("WhatsApp webhook error:", error);

      // Try to send error message if we have the sender
      if (!from) {
        try {
          const body = JSON.parse(bodyText);
          from = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from;
        } catch (_) {
          // ignore parse error
        }
      }

      if (from) {
        await sendWhatsAppMessage(from, ERROR_MSG);
      }

      return new Response(JSON.stringify({ status: "error" }), {
        status: 200, // Return 200 to Meta so they don't retry
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  }

  return new Response("Method not allowed", { status: 405 });
});
