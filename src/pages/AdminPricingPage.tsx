import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw, CreditCard } from "lucide-react";

interface PricingField {
  key: string;
  label: string;
  prefix?: string;
  suffix?: string;
  type: "currency" | "number";
}

const pricingFields: PricingField[] = [
  { key: "single_check_price", label: "Single Check Price", prefix: "R", type: "currency" },
  { key: "pack_3_checks", label: "3-Check Pack — Number of Checks", type: "number" },
  { key: "pack_3_price", label: "3-Check Pack — Price", prefix: "R", type: "currency" },
  { key: "pack_5_checks", label: "5-Check Pack — Number of Checks", type: "number" },
  { key: "pack_5_price", label: "5-Check Pack — Price", prefix: "R", type: "currency" },
];

export default function AdminPricingPage() {
  const { isAdmin, isSupport } = useUserRole();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, number>>({});
  const [originals, setOriginals] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const keys = pricingFields.map(f => f.key);
    const { data } = await supabase
      .from("site_settings" as any)
      .select("key, value")
      .in("key", keys);

    const map: Record<string, number> = {};
    (data || []).forEach((row: any) => {
      map[row.key] = typeof row.value === "number" ? row.value : Number(row.value);
    });
    setValues(map);
    setOriginals(map);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const changed = Object.entries(values).filter(([k, v]) => v !== originals[k]);

    for (const [key, val] of changed) {
      await supabase
        .from("site_settings" as any)
        .update({ value: val, updated_at: new Date().toISOString() } as any)
        .eq("key", key);
    }

    setOriginals({ ...values });
    setSaving(false);
    toast({ title: "Pricing saved", description: `${changed.length} field(s) updated.` });
  };

  const hasChanges = Object.keys(values).some(k => values[k] !== originals[k]);
  const viewOnly = !isAdmin;

  // Compute per-check savings
  const singlePrice = values.single_check_price || 99;
  const pack3Total = values.pack_3_price || 249;
  const pack3Checks = values.pack_3_checks || 3;
  const pack5Total = values.pack_5_price || 399;
  const pack5Checks = values.pack_5_checks || 5;
  const pack3PerCheck = pack3Checks > 0 ? (pack3Total / pack3Checks).toFixed(0) : "—";
  const pack5PerCheck = pack5Checks > 0 ? (pack5Total / pack5Checks).toFixed(0) : "—";

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-foreground">Pricing & Plans</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Manage check prices and pack configurations
            </p>
          </div>
          {!viewOnly && (
            <div className="flex gap-2">
              {hasChanges && (
                <button
                  onClick={() => setValues({ ...originals })}
                  className="flex items-center gap-1.5 px-3 py-2 text-sm font-body border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" /> Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-body bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          )}
        </div>

        {viewOnly && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-body text-sm text-amber-800">
              You have view-only access. Only Admins and the Owner can edit pricing.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Pricing fields */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <h2 className="font-heading text-lg text-foreground">Check Pricing</h2>
              </div>
              {pricingFields.map(field => (
                <div key={field.key}>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-1.5">
                    {field.label}
                  </label>
                  <div className="relative">
                    {field.prefix && (
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-body text-sm text-muted-foreground">{field.prefix}</span>
                    )}
                    <input
                      type="number"
                      value={values[field.key] ?? ""}
                      onChange={e => setValues(prev => ({ ...prev, [field.key]: Number(e.target.value) }))}
                      disabled={viewOnly}
                      className={`w-full ${field.prefix ? "pl-8" : "pl-4"} pr-4 py-2.5 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60`}
                    />
                  </div>
                  {values[field.key] !== originals[field.key] && (
                    <p className="font-mono text-[10px] text-primary mt-1">Modified</p>
                  )}
                </div>
              ))}
            </div>

            {/* Summary preview */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
              <h3 className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-4">Pricing Preview</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="border border-border rounded-lg p-4 text-center">
                  <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase">Single Check</p>
                  <p className="font-heading text-2xl text-foreground mt-1">R{singlePrice}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">per check</p>
                </div>
                <div className="border rounded-lg p-4 text-center" style={{ borderColor: 'hsl(var(--primary) / 0.3)', background: 'hsl(var(--primary) / 0.05)' }}>
                  <p className="font-mono text-[10px] tracking-wider text-primary uppercase">{pack3Checks}-Check Pack</p>
                  <p className="font-heading text-2xl text-foreground mt-1">R{pack3Total}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">R{pack3PerCheck} per check</p>
                </div>
                <div className="border rounded-lg p-4 text-center" style={{ borderColor: 'hsl(var(--primary) / 0.3)', background: 'hsl(var(--primary) / 0.05)' }}>
                  <p className="font-mono text-[10px] tracking-wider text-primary uppercase">{pack5Checks}-Check Pack</p>
                  <p className="font-heading text-2xl text-foreground mt-1">R{pack5Total}</p>
                  <p className="font-body text-xs text-muted-foreground mt-1">R{pack5PerCheck} per check</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
