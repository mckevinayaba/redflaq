import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

const DiscreetConfirmation = () => {
  const email = new URLSearchParams(window.location.search).get("email") || "your email";
  const searchId = new URLSearchParams(window.location.search).get("search_id") || "";
  const { user } = useAuth();
  const [hideDashboard, setHideDashboard] = useState(true);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [resending, setResending] = useState(false);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide from dashboard if checked
  useEffect(() => {
    if (hideDashboard && searchId) {
      supabase
        .from("searches")
        .update({ hidden_from_dashboard: true } as any)
        .eq("search_id", searchId)
        .then(() => {});
    }
  }, [hideDashboard, searchId]);

  const handleUnhide = async () => {
    if (!searchId) return;
    await supabase
      .from("searches")
      .update({ hidden_from_dashboard: false } as any)
      .eq("search_id", searchId);
    setHideDashboard(false);
    toast.success("Check will now appear in your dashboard.");
  };

  const handleResend = async () => {
    setResending(true);
    try {
      // Trigger resend by calling the edge function
      const { error } = await supabase.functions.invoke("multi-parameter-search", {
        body: {
          resend_email: true,
          search_id: searchId,
          user_id: user?.id,
        },
      });
      if (error) throw error;
      toast.success("Email resent! Check your inbox.");
    } catch {
      toast.error("Failed to resend. Please try again.");
    } finally {
      setResending(false);
    }
  };

  const formatTime = (s: number) => {
    if (s < 60) return `${s} second${s !== 1 ? "s" : ""} ago`;
    const m = Math.floor(s / 60);
    return `${m} minute${m !== 1 ? "s" : ""} ago`;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-3xl">🔒</span>
        </div>

        <h1 className="font-heading text-2xl sm:text-3xl text-foreground leading-snug">
          Your results have been sent privately to{" "}
          <span className="text-primary">{email}</span>.
        </h1>

        <p className="font-body text-base text-muted-foreground leading-relaxed">
          Check your inbox when you're ready — there's no rush.
        </p>

        {/* Email sent timer */}
        <div className="bg-muted/30 border border-border rounded-lg px-4 py-3 inline-flex flex-col items-center gap-2">
          <p className="font-body text-sm text-muted-foreground">
            📧 Email sent {formatTime(secondsAgo)}
          </p>
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-body text-sm text-primary hover:underline disabled:opacity-50"
          >
            {resending ? "Resending…" : "Didn't receive it? Resend email"}
          </button>
        </div>

        {/* Hide from dashboard option */}
        <div className="bg-muted/30 border border-border rounded-lg p-4 text-left">
          <div className="flex items-start gap-3">
            <Checkbox
              id="hide-dashboard"
              checked={hideDashboard}
              onCheckedChange={(c) => {
                if (c === true) {
                  setHideDashboard(true);
                } else {
                  handleUnhide();
                }
              }}
              className="mt-0.5"
            />
            <label htmlFor="hide-dashboard" className="cursor-pointer">
              <p className="font-body text-sm text-foreground font-medium">
                Hide this check from my dashboard
              </p>
              <p className="font-body text-xs text-muted-foreground mt-1">
                You can still access the report from the email link
              </p>
            </label>
          </div>
        </div>

        <hr className="border-border" />

        <p className="font-body text-sm text-muted-foreground">
          🆘 If you need support right now, call GBV Command Centre:{" "}
          <a href="tel:0800428428" className="font-bold text-foreground hover:underline">
            0800 428 428
          </a>{" "}
          — Free · 24/7
        </p>

        <a
          href="/"
          className="inline-block font-body text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          ← Back to redflaq.com
        </a>
      </div>
    </div>
  );
};

export default DiscreetConfirmation;
