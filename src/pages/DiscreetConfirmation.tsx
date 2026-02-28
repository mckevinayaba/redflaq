import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Lock, Mail, Eye, EyeOff, ArrowLeft, Phone, RefreshCw } from "lucide-react";

const DiscreetConfirmation = () => {
  const email = new URLSearchParams(window.location.search).get("email") || "your email";
  const searchId = new URLSearchParams(window.location.search).get("search_id") || "";
  const { user } = useAuth();
  const [hideDashboard, setHideDashboard] = useState(true);
  const [secondsAgo, setSecondsAgo] = useState(0);
  const [resending, setResending] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

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
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-10">
        
        {/* Lock Icon — elegant circle */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center border border-primary/10 shadow-[0_8px_32px_-8px_hsl(var(--primary)/0.2)]">
              <Lock className="w-8 h-8 text-primary" strokeWidth={1.8} />
            </div>
            {/* Subtle pulse ring */}
            <div className="absolute inset-0 rounded-full border border-primary/10 animate-ping opacity-20" style={{ animationDuration: '3s' }} />
          </div>
        </div>

        {/* Heading */}
        <div className="text-center space-y-4">
          <h1 className="font-heading text-2xl sm:text-3xl text-foreground leading-tight tracking-tight">
            Your results have been sent<br />privately to{" "}
            <span className="text-primary font-semibold">{email}</span>.
          </h1>
          <p className="font-body text-base text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Check your inbox when you're ready — there's no rush.
          </p>
        </div>

        {/* Email Status Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="font-body text-sm font-medium text-foreground">
                Email delivered
              </p>
              <p className="font-body text-xs text-muted-foreground">
                {formatTime(secondsAgo)}
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-3">
            <button
              onClick={handleResend}
              disabled={resending}
              className="flex items-center gap-2 font-body text-sm text-primary hover:text-primary/80 transition-colors disabled:opacity-50 group"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
              {resending ? "Resending…" : "Didn't receive it? Resend"}
            </button>
          </div>
        </div>

        {/* Hide from Dashboard Card */}
        <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
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
              className="mt-0.5 border-primary/40 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <label htmlFor="hide-dashboard" className="cursor-pointer flex-1">
              <div className="flex items-center gap-2 mb-1">
                {hideDashboard ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
                <p className="font-body text-sm text-foreground font-medium">
                  Hide this check from my dashboard
                </p>
              </div>
              <p className="font-body text-xs text-muted-foreground leading-relaxed pl-6">
                You can still access the report from the email link
              </p>
            </label>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground font-body">support</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        {/* GBV Support */}
        <div className="bg-destructive/5 border border-destructive/15 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5">
              <Phone className="w-4 h-4 text-destructive" />
            </div>
            <div>
              <p className="font-body text-sm text-foreground leading-relaxed">
                If you need support right now, call the <strong>GBV Command Centre</strong>:
              </p>
              <a
                href="tel:0800428428"
                className="inline-block mt-2 font-heading text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
              >
                0800 428 428
              </a>
              <p className="font-body text-xs text-muted-foreground mt-1">Free · 24/7 · Confidential</p>
            </div>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center pt-2">
          <a
            href="/"
            className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to redflaq.com
          </a>
        </div>
      </div>
    </div>
  );
};

export default DiscreetConfirmation;
