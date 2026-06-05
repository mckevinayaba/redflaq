import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetches and auto-updates the user's credit balance.
 *
 * Credits are consumed when running safety checks (1 credit = 1 check).
 * Sources: Yoco card payments, manual EFT payments verified by admin.
 *
 * Uses realtime subscriptions for instant UI updates + polling
 * fallback (5s intervals for 60s) after payment redirect to handle
 * webhook delivery delays from payment gateways.
 */
export function useCredits(userEmail: string | undefined | null, userId: string | undefined | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [webhookDelayed, setWebhookDelayed] = useState(false);

  const fetchCredits = useCallback(async () => {
    if (!userEmail) {
      setCredits(0);
      setLoading(false);
      return 0;
    }
    try {
      const [{ data: p, error: pErr }, { data: m, error: mErr }] = await Promise.all([
        supabase.from("purchases").select("credits_remaining").eq("email", userEmail).eq("status", "completed"),
        supabase.from("manual_payments").select("search_credits, credits_used").eq("email", userEmail).eq("status", "verified"),
      ]);
      if (pErr) console.error("useCredits purchases error:", pErr);
      if (mErr) console.error("useCredits manual_payments error:", mErr);
      const pc = (p || []).reduce((s, r) => s + (r.credits_remaining || 0), 0);
      const mc = (m || []).reduce((s, r) => s + ((r.search_credits || 0) - (r.credits_used || 0)), 0);
      const total = pc + mc;
      setCredits(total);
      return total;
    } catch (err) {
      console.error("useCredits fetch failed:", err);
      setCredits(0);
      return 0;
    } finally {
      setLoading(false);
    }
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
    const params = new URLSearchParams(window.location.search);
    const fromPayment = params.get("from_payment") || params.get("payment_id");
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
