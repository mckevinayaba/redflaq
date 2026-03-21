import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and auto-updates the user's credit balance.
 * Uses realtime subscriptions + polling fallback after payment redirect.
 */
export function useCredits(userEmail: string | undefined | null, userId: string | undefined | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [webhookDelayed, setWebhookDelayed] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!userEmail) return;
    const [{ data: p }, { data: m }] = await Promise.all([
      supabase.from("purchases").select("credits_remaining").eq("email", userEmail).eq("status", "completed"),
      supabase.from("manual_payments").select("search_credits, credits_used").eq("email", userEmail).eq("status", "verified"),
    ]);
    const pc = (p || []).reduce((s, r) => s + (r.credits_remaining || 0), 0);
    const mc = (m || []).reduce((s, r) => s + ((r.search_credits || 0) - (r.credits_used || 0)), 0);
    setCredits(pc + mc);
    setLoading(false);
    return pc + mc;
  }, [userEmail]);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  // Realtime subscription on purchases table
  useEffect(() => {
    if (!userEmail) return;
    const channel = supabase
      .channel('credit-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'purchases' }, () => {
        fetchCredits();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'manual_payments' }, () => {
        fetchCredits();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [userEmail, fetchCredits]);

  // Polling fallback: if coming from payment success, poll every 5s for 60s
  useEffect(() => {
    const fromPayment = new URLSearchParams(window.location.search).get("from_payment");
    if (!fromPayment || !userEmail) return;

    let elapsed = 0;
    const interval = setInterval(async () => {
      elapsed += 5;
      const total = await fetchCredits();
      if (total !== undefined && total > 0) {
        clearInterval(interval);
        setWebhookDelayed(false);
      }
      if (elapsed >= 60) {
        clearInterval(interval);
        // If still 0, show delayed message
        if (total === 0 || total === null) {
          setWebhookDelayed(true);
        }
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userEmail, fetchCredits]);

  return { credits, loading, fetchCredits, webhookDelayed };
}
