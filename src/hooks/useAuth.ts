/**
 * Authentication hook — manages user session state via Lovable Cloud.
 *
 * POPIA COMPLIANCE:
 * - Session data is stored in localStorage (user's device only)
 * - Auto-refresh ensures tokens expire and rotate
 * - No personally identifiable information is cached beyond the session
 */
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, user: session?.user ?? null, loading, isAuthenticated: !!session };
}
