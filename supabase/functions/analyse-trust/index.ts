import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Evidence Card verdict states — no "CLEAR" or "SAFE" (would imply guaranteed safety)
type Verdict = "STOP" | "PAUSE" | "PROCEED_WITH_CARE";

type EvidenceCard = {
  verdict: Verdict;
  headline: string; // 1-sentence plain-English headline
  // Section 1: What we found
  patterns_detected: Array<{
    name: string;
    explanation: string;
    severity: "high" | "medium" | "low";
  }>;
  // Section 2: Signals breakdown
  signals: Array<{
    category: string;
    observation: string;
  }>;
  // Section 3: What this means in context
  context_note: string;
  // Section 4: Questions to ask before trusting
  questions_to_ask: string[];
  // Section 5: What to do next
  next_steps: Array<{
    action: string;
    resource?: string; // SA-specific resource if applicable
  }>;
  // Meta — not shown prominently in UI but available for logging/debugging
  intent_context: string; // echoed intent label
  limitations: string; // mandatory epistemic caveat
};

const SYSTEM_PROMPT = `You are RedFlaq's AI trust analyst. You help South Africans assess risk before they trust someone with their money, home, or safety.

Your job is to identify scam patterns, manipulation tactics, and warning signals in text the user provides — then give them clear, actionable guidance.

South African scam context you know well:
- Marketplace scams (Facebook Marketplace, OLX, Gumtree): fake buyers, false POP (proof of payment), overpayment, fake escrow
- Rental scams: phantom properties, upfront deposit demands without viewings, landlords abroad
- Job scams: upfront fees for materials, laptops, uniforms or training; work-from-home with high pay claims
- Advance fee fraud (419): "receive funds into your account", unexpected inheritance, lottery winnings
- Romance scams: intense online relationships that pivot to money requests, often claiming to be abroad
- Investment scams: guaranteed returns, crypto doubling, forex trading with upfront deposits
- SIM swap / account takeover: urgency around banking details, OTP requests
- Business email compromise: invoice redirection, changed banking details from "suppliers"
- Loan scams: upfront admin/insurance fees for loans

Verdict guidance:
- STOP: Multiple strong warning patterns; high probability of fraud or danger
- PAUSE: Some warning signals that need verification before proceeding
- PROCEED_WITH_CARE: Situation is plausible but user should take precautions

Important rules:
- Never say something is "safe", "clear", or give the impression the person can proceed without risk
- Never fabricate patterns that aren't in the text
- Be direct but not alarmist — base conclusions on what the text actually says
- Use plain South African English (not formal legal language)
- Always include at least one question to ask and one next step
- The limitations field must always note that this is not a guarantee of safety`;

type AiProvider = "lovable_gateway" | "anthropic_direct";

type ImageInput = {
  base64: string;      // raw base64, no data URL prefix
  mimeType: string;    // e.g. "image/jpeg"
};

async function callAI(
  userText: string,
  intentLabel: string,
  provider: AiProvider,
  image?: ImageInput,
): Promise<EvidenceCard> {
  const contextPrefix = intentLabel ? `Context: I am about to ${intentLabel}.\n\n` : "";
  const textPart = image
    ? `${contextPrefix}I am sending you a screenshot. Please analyse it for scam patterns, red flags, and warning signals, then give your assessment.\n\nAdditional context from the user: ${userText || "(none)"}`
    : `${contextPrefix}Here is the situation I want to check:\n\n${userText}`;

  // Build the user message — vision content when image is provided
  type ContentPart =
    | { type: "text"; text: string }
    | { type: "image_url"; image_url: { url: string; detail: string } };

  const userContent: ContentPart[] | string = image
    ? [
        {
          type: "image_url",
          image_url: {
            url: `data:${image.mimeType};base64,${image.base64}`,
            detail: "high",
          },
        },
        { type: "text", text: textPart },
      ]
    : textPart;

  const toolSchema = {
    type: "function",
    function: {
      name: "return_evidence_card",
      description: "Return a structured Evidence Card assessment",
      parameters: {
        type: "object",
        properties: {
          verdict: {
            type: "string",
            enum: ["STOP", "PAUSE", "PROCEED_WITH_CARE"],
            description: "Overall verdict. No CLEAR or SAFE option.",
          },
          headline: {
            type: "string",
            description:
              "One direct sentence summarising the key finding, e.g. 'This matches the classic upfront fee job scam.'",
          },
          patterns_detected: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string", description: "Short name for the pattern, e.g. 'Upfront fee demand'" },
                explanation: {
                  type: "string",
                  description: "1-2 sentences explaining what this pattern is and why it appears here",
                },
                severity: { type: "string", enum: ["high", "medium", "low"] },
              },
              required: ["name", "explanation", "severity"],
              additionalProperties: false,
            },
            description: "Named scam/warning patterns found in the text. Empty array if none.",
          },
          signals: {
            type: "array",
            items: {
              type: "object",
              properties: {
                category: {
                  type: "string",
                  description:
                    "Signal category, e.g. 'Urgency pressure', 'Upfront payment request', 'Too good to be true'",
                },
                observation: {
                  type: "string",
                  description: "What specifically in the text triggered this signal",
                },
              },
              required: ["category", "observation"],
              additionalProperties: false,
            },
            description: "Specific signals observed in the text.",
          },
          context_note: {
            type: "string",
            description:
              "2-3 sentences explaining what this situation typically means in a South African context — why these signals matter here.",
          },
          questions_to_ask: {
            type: "array",
            items: { type: "string" },
            description:
              "3-5 specific questions the user should ask or steps to verify before trusting. Plain language.",
          },
          next_steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                action: { type: "string", description: "What to do, in plain language" },
                resource: {
                  type: "string",
                  description:
                    "Optional SA resource or contact number, e.g. 'SAPS: 10111', 'FNB Fraud Line: 087 575 9444'",
                },
              },
              required: ["action"],
              additionalProperties: false,
            },
            description: "Actionable next steps. At least one must be included.",
          },
          intent_context: {
            type: "string",
            description: "Echo the intent back, e.g. 'Pay seller' or 'General check'",
          },
          limitations: {
            type: "string",
            description:
              "Mandatory caveat: what this analysis cannot guarantee. Must mention that it is not a clearance or guarantee of safety.",
          },
        },
        required: [
          "verdict",
          "headline",
          "patterns_detected",
          "signals",
          "context_note",
          "questions_to_ask",
          "next_steps",
          "intent_context",
          "limitations",
        ],
        additionalProperties: false,
      },
    },
  };

  if (provider === "lovable_gateway") {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userContent },
        ],
        tools: [toolSchema],
        tool_choice: { type: "function", function: { name: "return_evidence_card" } },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("Lovable gateway error:", res.status, body);
      if (res.status === 429) throw new Error("RATE_LIMITED");
      if (res.status === 402) throw new Error("QUOTA_EXCEEDED");
      throw new Error(`AI_GATEWAY_ERROR:${res.status}`);
    }

    const data = await res.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("NO_STRUCTURED_RESPONSE");
    return JSON.parse(toolCall.function.arguments) as EvidenceCard;
  }

  // anthropic_direct fallback — uses Messages API directly
  const ANTHROPIC_KEY = Deno.env.get("ANTHROPIC_API_KEY");
  if (!ANTHROPIC_KEY) throw new Error("ANTHROPIC_API_KEY is not configured");

  // Anthropic vision format differs from OpenAI format
  type AnthropicContent =
    | { type: "text"; text: string }
    | { type: "image"; source: { type: "base64"; media_type: string; data: string } };

  const anthropicContent: AnthropicContent[] = image
    ? [
        {
          type: "image",
          source: { type: "base64", media_type: image.mimeType, data: image.base64 },
        },
        { type: "text", text: typeof userContent === "string" ? userContent : textPart },
      ]
    : [{ type: "text", text: textPart }];

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_KEY,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: anthropicContent }],
      tools: [
        {
          name: "return_evidence_card",
          description: toolSchema.function.description,
          input_schema: toolSchema.function.parameters,
        },
      ],
      tool_choice: { type: "tool", name: "return_evidence_card" },
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("Anthropic direct error:", res.status, body);
    throw new Error(`ANTHROPIC_ERROR:${res.status}`);
  }

  const data = await res.json();
  const toolUse = data.content?.find((b: { type: string }) => b.type === "tool_use");
  if (!toolUse) throw new Error("NO_STRUCTURED_RESPONSE_ANTHROPIC");
  return toolUse.input as EvidenceCard;
}

const INTENT_LABELS: Record<string, string> = {
  pay_seller: "pay a seller",
  accept_payment: "accept payment",
  rent: "rent a property",
  hire: "hire someone",
  meet: "meet someone in person",
  job_offer: "evaluate a job offer",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { text, intent, image_base64, image_mime_type } = await req.json();

    const hasImage = typeof image_base64 === "string" && image_base64.length > 0;
    const hasText = typeof text === "string" && text.trim().length > 0;

    // Require at least text OR image
    if (!hasText && !hasImage) {
      return new Response(
        JSON.stringify({ error: "Provide text, an image, or both." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Text-only minimum length applies when no image is provided
    if (!hasImage && hasText && text.trim().length < 20) {
      return new Response(
        JSON.stringify({ error: "Text must be at least 20 characters." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (hasText && text.trim().length > 4000) {
      return new Response(
        JSON.stringify({ error: "Text exceeds 4000 character limit." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Validate image: max ~800KB base64 (~600KB binary) to stay within edge function limits
    if (hasImage && image_base64.length > 1_100_000) {
      return new Response(
        JSON.stringify({ error: "Image too large. Please reduce the file size and try again." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    const mimeType: string = allowedMimes.includes(image_mime_type) ? image_mime_type : "image/jpeg";

    const image: ImageInput | undefined = hasImage
      ? { base64: image_base64, mimeType }
      : undefined;

    const intentLabel = intent && INTENT_LABELS[intent] ? INTENT_LABELS[intent] : "";
    const cleanText = hasText ? text.trim() : "(No text — see image)";

    // Try primary provider, fall back to Anthropic direct if unavailable
    let card: EvidenceCard;
    try {
      card = await callAI(cleanText, intentLabel, "lovable_gateway", image);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg === "RATE_LIMITED" || msg === "QUOTA_EXCEEDED" || msg.startsWith("AI_GATEWAY_ERROR")) {
        console.warn("Primary AI provider failed, trying Anthropic direct:", msg);
        card = await callAI(cleanText, intentLabel, "anthropic_direct", image);
      } else {
        throw err;
      }
    }

    return new Response(JSON.stringify(card), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyse-trust error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";

    if (msg === "RATE_LIMITED") {
      return new Response(
        JSON.stringify({ error: "Service is busy. Please try again in a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    return new Response(
      JSON.stringify({ error: "Analysis failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
