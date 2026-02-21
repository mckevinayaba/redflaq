import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useAuthGuard() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const guardedAction = async (pendingSearchQuery?: string) => {
    // Save pending search if provided
    if (pendingSearchQuery) {
      sessionStorage.setItem("pendingSearch", pendingSearchQuery);
    }

    if (!isAuthenticated || !user) {
      // Flag that user came from a CTA so signup page can show banner
      sessionStorage.setItem("fromCTA", "true");
      navigate("/signup");
      return false;
    }

    // Check email verification
    const { data: { user: freshUser } } = await supabase.auth.getUser();
    if (!freshUser?.email_confirmed_at) {
      navigate("/verify-email");
      return false;
    }

    // Check if user has active credits (subscription equivalent)
    const { data: purchases } = await supabase
      .from("purchases")
      .select("credits_remaining")
      .eq("email", user.email || "")
      .eq("status", "completed")
      .gt("credits_remaining", 0)
      .limit(1);

    const { data: manualPayments } = await supabase
      .from("manual_payments")
      .select("search_credits, credits_used")
      .eq("email", user.email || "")
      .eq("status", "verified")
      .limit(1);

    const hasCredits =
      (purchases && purchases.length > 0) ||
      (manualPayments && manualPayments.some(p => (p.search_credits || 0) - (p.credits_used || 0) > 0));

    if (!hasCredits) {
      sessionStorage.setItem("fromCTA", "true");
      navigate("/pricing");
      return false;
    }

    // User is fully authenticated, verified, and has credits
    // Restore pending search if exists
    const pending = sessionStorage.getItem("pendingSearch");
    if (pending) {
      sessionStorage.removeItem("pendingSearch");
      navigate("/dashboard/new-check");
    } else {
      navigate("/dashboard/new-check");
    }
    return true;
  };

  return { guardedAction, isAuthenticated, user };
}
