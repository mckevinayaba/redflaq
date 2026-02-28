import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Lock, AlertTriangle } from "lucide-react";

export default function SecureReportView() {
  const { token } = useParams<{ token: string }>();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<"loading" | "login" | "expired" | "unauthorized" | "ready">("loading");
  const [searchId, setSearchId] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      setStatus("login");
      return;
    }

    if (!token) {
      setStatus("expired");
      return;
    }

    const verify = async () => {
      // Use service role via edge function to verify token
      const { data, error } = await supabase.functions.invoke("verify-secure-link", {
        body: { token, user_id: user.id },
      });

      if (error || !data?.success) {
        setStatus(data?.reason === "unauthorized" ? "unauthorized" : "expired");
        return;
      }

      setSearchId(data.search_id);
      setStatus("ready");
    };

    verify();
  }, [token, user, authLoading]);

  useEffect(() => {
    if (status === "ready" && searchId) {
      navigate(`/results?search_id=${searchId}`, { replace: true });
    }
  }, [status, searchId, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-body text-muted-foreground">Verifying your secure link…</p>
        </div>
      </div>
    );
  }

  if (status === "login") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <Lock className="h-12 w-12 text-primary mx-auto" />
          <h1 className="font-heading text-2xl text-foreground">Login required</h1>
          <p className="font-body text-muted-foreground">
            This is a secure report link. Please log in to your RedFlaq account to view it.
          </p>
          <button
            onClick={() => navigate(`/signup?redirect=/reports/view/${token}`)}
            className="px-6 py-3 bg-primary text-primary-foreground font-body font-semibold rounded-lg hover:bg-primary/90"
          >
            Log in to view report
          </button>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto" />
          <h1 className="font-heading text-2xl text-foreground">Access denied</h1>
          <p className="font-body text-muted-foreground">
            This report belongs to a different account. Please log in with the account that ran this check.
          </p>
        </div>
      </div>
    );
  }

  // expired
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center space-y-6">
        <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto" />
        <h1 className="font-heading text-2xl text-foreground">Link expired or invalid</h1>
        <p className="font-body text-muted-foreground">
          This secure link has expired or is no longer valid. Report links expire after 7 days.
        </p>
        <p className="font-body text-sm text-muted-foreground">
          Need help? Contact us at{" "}
          <a href="mailto:support@redflaq.co.za" className="text-primary hover:underline">support@redflaq.co.za</a>
        </p>
      </div>
    </div>
  );
}
