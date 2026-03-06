import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Search, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";

export default function ClaimReference() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: "success" | "error"; message: string; credits?: number } | null>(null);

  const handleClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reference.trim() || !user) return;

    setLoading(true);
    setResult(null);
    const ref = reference.trim();
    const userId = user.id;

    try {
      // Search in purchases
      const { data: purchases } = await supabase
        .from("purchases")
        .select("*")
        .eq("purchase_id", ref)
        .eq("status", "completed")
        .limit(1);

      // Search in manual_payments
      const { data: manualPayments } = await supabase
        .from("manual_payments")
        .select("*")
        .eq("payment_id", ref)
        .eq("status", "verified")
        .limit(1);

      const purchase = purchases?.[0];
      const manual = manualPayments?.[0];

      if (!purchase && !manual) {
        setResult({ type: "error", message: "Reference not found. Check your confirmation email or contact support@redflaq.com" });
        await supabase.from("reference_claim_logs" as any).insert({
          reference_number: ref, user_id: userId, outcome: "not_found", credits_added: 0,
        });
        setLoading(false);
        return;
      }

      const isPurchase = !!purchase;
      const record = purchase || manual;
      const creditsLeft = isPurchase
        ? ((record as any).credits_remaining || 0)
        : (((record as any).search_credits || 0) - ((record as any).credits_used || 0));

      if (creditsLeft <= 0) {
        setResult({ type: "error", message: "You have already used all checks from this payment. Purchase more checks to continue." });
        await supabase.from("reference_claim_logs" as any).insert({
          reference_number: ref, user_id: userId, outcome: "already_used", credits_added: 0,
        });
        setLoading(false);
        return;
      }

      // Check if already claimed by different user
      if (record.reference_claimed && record.reference_claimed_by && record.reference_claimed_by !== userId) {
        setResult({ type: "error", message: "This reference is linked to another account. Contact support@redflaq.com" });
        await supabase.from("reference_claim_logs" as any).insert({
          reference_number: ref, user_id: userId, outcome: "already_used", credits_added: 0,
        });
        setLoading(false);
        return;
      }

      // Claim the reference
      if (isPurchase) {
        await supabase.from("purchases").update({
          reference_claimed: true,
          reference_claimed_by: userId,
          reference_claimed_at: new Date().toISOString(),
        } as any).eq("id", record.id);
      } else {
        await supabase.from("manual_payments").update({
          reference_claimed: true,
          reference_claimed_by: userId,
          reference_claimed_at: new Date().toISOString(),
        } as any).eq("id", record.id);
      }

      await supabase.from("reference_claim_logs" as any).insert({
        reference_number: ref, user_id: userId, outcome: "success", credits_added: creditsLeft,
      });

      setResult({
        type: "success",
        message: `${creditsLeft} check${creditsLeft !== 1 ? "s" : ""} have been added to your account. You can now run your search.`,
        credits: creditsLeft,
      });

      setTimeout(() => navigate("/dashboard/new-check"), 2500);
    } catch {
      setResult({ type: "error", message: "Something went wrong. Please try again or contact support@redflaq.com" });
    }
    setLoading(false);
  };

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Payment Recovery</p>
      <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Claim your payment</h1>
      <p className="font-body text-sm text-muted-foreground mb-6 max-w-lg">
        Enter the payment reference from your confirmation email to recover your check credits.
      </p>

      <div className="max-w-md">
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <form onSubmit={handleClaim} className="space-y-4">
            <div>
              <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                Payment Reference
              </label>
              <input
                className="w-full px-4 py-3 border-2 border-border rounded-lg text-sm font-mono bg-background focus:outline-none focus:border-primary transition-colors"
                placeholder="e.g. yoco_abc123 or PAY-12345"
                value={reference}
                onChange={(e) => { setReference(e.target.value); setResult(null); }}
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={!reference.trim() || loading}
              className="w-full py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Looking up reference…</>
              ) : (
                <><Search className="h-4 w-4" /> Claim Credits</>
              )}
            </button>
          </form>

          {result && (
            <div className={`mt-4 p-4 rounded-lg border flex items-start gap-3 ${
              result.type === "success"
                ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-800"
                : "bg-destructive/10 border-destructive/30"
            }`}>
              {result.type === "success" ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
              )}
              <p className={`font-body text-sm ${result.type === "success" ? "text-green-800 dark:text-green-200" : "text-destructive"}`}>
                {result.message}
              </p>
            </div>
          )}
        </div>

        <p className="font-body text-xs text-muted-foreground mt-4 text-center">
          Can't find your reference? Check the confirmation email from RedFlaq or contact{" "}
          <a href="mailto:support@redflaq.com" className="text-primary hover:underline">support@redflaq.com</a>
        </p>
      </div>
    </DashboardLayout>
  );
}
