import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://redflaq.com",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description } = await req.json();
    if (!description || description.trim().length < 20) {
      return new Response(JSON.stringify({ error: "Description too short" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a behavioral safety analyst specializing in gender-based violence (GBV), coercive control, and relationship abuse patterns in a South African context.

Analyze the user's description for warning signs across these 5 categories:
1. Coercive Control - isolation, financial abuse, monitoring, controlling behaviour
2. Manipulation Patterns - gaslighting, love-bombing, future-faking, guilt-tripping
3. Escalation Indicators - verbal to physical escalation, property damage, threats
4. Digital Abuse - stalking, account control, image-based threats, phone monitoring
5. Social Engineering - triangulation, reputation attacks, turning others against victim

You must respond using the suggest_assessment tool.

Important guidelines:
- Be empathetic but direct
- Use South African context (reference local resources like GBV Command Centre 0800 428 428, SAPS 10111)
- Never minimise concerns
- Score from 0-100 where 0 is no risk and 100 is extreme danger
- risk_level must be one of: "minimal", "low", "medium", "high"
- Always include actionable next steps`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Please analyze the following situation for behavioral warning signs:\n\n"${description}"` },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "suggest_assessment",
              description: "Return structured behavioral signal assessment",
              parameters: {
                type: "object",
                properties: {
                  risk_level: { type: "string", enum: ["minimal", "low", "medium", "high"] },
                  risk_score: { type: "number", description: "0-100 risk score" },
                  categories_detected: {
                    type: "array",
                    items: { type: "string", enum: ["Coercive Control", "Manipulation", "Escalation", "Digital Abuse", "Social Engineering"] },
                  },
                  analysis: { type: "string", description: "Detailed analysis with actionable recommendations" },
                },
                required: ["risk_level", "risk_score", "categories_detected", "analysis"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "suggest_assessment" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI service temporarily unavailable." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    
    if (!toolCall) {
      throw new Error("No structured response from AI");
    }

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("analyze-behavioral-signals error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
