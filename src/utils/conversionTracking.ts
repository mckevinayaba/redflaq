import { supabase } from "@/integrations/supabase/client";

export type ConversionCategory = "cta" | "pricing" | "form" | "navigation";

const SESSION_KEY = "rf_session_id";

const getSessionId = (): string => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `s_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
};

/**
 * Logs a conversion event to Lovable Cloud (conversion_events table).
 * Fire-and-forget — never throws, never blocks UI.
 */
export const trackConversion = async (
  eventName: string,
  category: ConversionCategory,
  source: string,
  metadata: Record<string, unknown> = {}
): Promise<void> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from("conversion_events").insert({
      event_name: eventName,
      event_category: category,
      source,
      path: typeof window !== "undefined" ? window.location.pathname : null,
      referrer: typeof document !== "undefined" ? document.referrer || null : null,
      user_id: user?.id ?? null,
      session_id: getSessionId(),
      metadata,
    });
  } catch (err) {
    // Silent — analytics must never break UX
    console.warn("[conversion] failed", err);
  }
};
