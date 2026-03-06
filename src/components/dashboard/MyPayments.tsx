import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreditCard, Copy, Check } from "lucide-react";
import { toast } from "sonner";

const PACKAGE_LABELS: Record<string, string> = {
  single: "1 Check",
  triple: "3 Checks",
  five: "5 Checks",
};

interface PaymentRecord {
  id: string;
  payment_id: string;
  amount: number;
  package_type: string | null;
  search_credits: number | null;
  credits_used: number | null;
  status: string | null;
  created_at: string | null;
}

interface PurchaseRecord {
  id: string;
  purchase_id: string;
  amount: number;
  package_type: string;
  credits_purchased: number;
  credits_remaining: number;
  status: string | null;
  purchased_at: string | null;
}

export default function MyPayments({ email }: { email: string }) {
  const [manualPayments, setManualPayments] = useState<PaymentRecord[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (!email) return;
    Promise.all([
      supabase.from("manual_payments").select("id, payment_id, amount, package_type, search_credits, credits_used, status, created_at").eq("email", email).order("created_at", { ascending: false }).limit(20),
      supabase.from("purchases").select("id, purchase_id, amount, package_type, credits_purchased, credits_remaining, status, purchased_at").eq("email", email).order("purchased_at", { ascending: false }).limit(20),
    ]).then(([{ data: mp }, { data: pu }]) => {
      setManualPayments(mp || []);
      setPurchases(pu || []);
      setLoading(false);
    });
  }, [email]);

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopiedId(ref);
    toast.success("Reference copied!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return null;

  // Merge into unified list
  const allPayments = [
    ...purchases.map(p => ({
      key: p.id,
      ref: p.purchase_id,
      date: p.purchased_at,
      pkg: PACKAGE_LABELS[p.package_type] || p.package_type,
      amount: p.amount,
      status: p.status || "pending",
      remaining: p.credits_remaining,
      total: p.credits_purchased,
    })),
    ...manualPayments.map(m => ({
      key: m.id,
      ref: m.payment_id,
      date: m.created_at,
      pkg: PACKAGE_LABELS[m.package_type || "single"] || m.package_type || "—",
      amount: m.amount,
      status: m.status || "pending",
      remaining: (m.search_credits || 0) - (m.credits_used || 0),
      total: m.search_credits || 0,
    })),
  ].sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  // Deduplicate by ref (purchases and manual_payments may share similar refs)
  const seen = new Set<string>();
  const unique = allPayments.filter(p => {
    if (seen.has(p.ref)) return false;
    seen.add(p.ref);
    return true;
  });

  if (unique.length === 0) return null;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm mb-6 sm:mb-8">
      <div className="px-4 sm:px-6 py-4 border-b border-border flex items-center gap-3">
        <CreditCard className="h-5 w-5 text-primary" />
        <h2 className="font-heading text-base sm:text-lg text-foreground">My Payments</h2>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden divide-y divide-border">
        {unique.map(p => (
          <div key={p.key} className="px-4 py-4 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="font-body text-sm text-foreground font-medium">{p.pkg}</p>
                <p className="font-body text-xs text-muted-foreground">{p.date ? new Date(p.date).toLocaleDateString("en-ZA") : "—"}</p>
              </div>
              <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold whitespace-nowrap ${
                p.status === "completed" || p.status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {p.status === "completed" || p.status === "verified" ? "Confirmed" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-body text-xs text-muted-foreground">R{p.amount} · {p.remaining}/{p.total} checks left</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-muted-foreground truncate">{p.ref}</span>
              <button onClick={() => copyRef(p.ref)} className="shrink-0 p-1 hover:bg-muted rounded transition-colors" title="Copy reference">
                {copiedId === p.ref ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Date</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Package</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Amount</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Reference</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Status</th>
              <th className="text-left px-6 py-3 font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Remaining</th>
            </tr>
          </thead>
          <tbody>
            {unique.map(p => (
              <tr key={p.key} className="border-b border-border last:border-0 hover:bg-muted transition-colors">
                <td className="px-6 py-4 font-body text-sm text-muted-foreground">{p.date ? new Date(p.date).toLocaleDateString("en-ZA") : "—"}</td>
                <td className="px-6 py-4 font-body text-sm text-foreground font-medium">{p.pkg}</td>
                <td className="px-6 py-4 font-body text-sm text-foreground">R{p.amount}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] text-muted-foreground">{p.ref}</span>
                    <button onClick={() => copyRef(p.ref)} className="shrink-0 p-1 hover:bg-muted rounded transition-colors" title="Copy reference">
                      {copiedId === p.ref ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold ${
                    p.status === "completed" || p.status === "verified" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {p.status === "completed" || p.status === "verified" ? "Confirmed" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm text-foreground">{p.remaining}/{p.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
