import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import AdminLayout from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { Save, RotateCcw } from "lucide-react";

interface SettingField {
  key: string;
  label: string;
  type: "text" | "textarea";
  placeholder: string;
}

const contentFields: SettingField[] = [
  { key: "hero_headline", label: "Hero Headline", type: "text", placeholder: "Main headline on landing page" },
  { key: "hero_subheadline", label: "Hero Sub-headline", type: "textarea", placeholder: "Supporting text below the headline" },
  { key: "gbv_stat", label: "GBV Statistic Text", type: "textarea", placeholder: "The key GBV statistic displayed on the site" },
  { key: "founder_quote", label: "Founder Quote", type: "textarea", placeholder: "Quote shown in the community/about section" },
  { key: "invite_message", label: "Default Invite/Share Message", type: "textarea", placeholder: "Pre-filled message when users share RedFlaq" },
];

export default function AdminContentPage() {
  const { isAdmin } = useUserRole();
  const { toast } = useToast();
  const [values, setValues] = useState<Record<string, string>>({});
  const [originals, setOriginals] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    const keys = contentFields.map(f => f.key);
    const { data } = await supabase
      .from("site_settings" as any)
      .select("key, value")
      .in("key", keys);

    const map: Record<string, string> = {};
    (data || []).forEach((row: any) => {
      map[row.key] = typeof row.value === "string" ? row.value : JSON.stringify(row.value);
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
    toast({ title: "Content saved", description: `${changed.length} field(s) updated.` });
  };

  const hasChanges = Object.keys(values).some(k => values[k] !== originals[k]);

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl text-foreground">Content & Copy</h1>
            <p className="font-body text-sm text-muted-foreground mt-1">
              Edit the text displayed on the RedFlaq website
            </p>
          </div>
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
              disabled={!hasChanges || saving || !isAdmin}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-body bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Save className="h-3.5 w-3.5" /> {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {!isAdmin && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <p className="font-body text-sm text-amber-800">
              You have view-only access. Only Admins and the Owner can edit content.
            </p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {contentFields.map(field => (
              <div key={field.key} className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                  {field.label}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    value={values[field.key] || ""}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    disabled={!isAdmin}
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60 resize-none"
                  />
                ) : (
                  <input
                    value={values[field.key] || ""}
                    onChange={e => setValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                    placeholder={field.placeholder}
                    disabled={!isAdmin}
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-60"
                  />
                )}
                {values[field.key] !== originals[field.key] && (
                  <p className="font-mono text-[10px] text-primary mt-1">Modified</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
