import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Clock, Lock, Heart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const SA_PROVINCES = [
  "", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const REASONS = [
  "", "Dating / Romantic interest", "Flat-share / Tenant", "Childcare provider",
  "Landlord", "Domestic worker", "Business partner", "Neighbour concern", "Other",
];

export default function DashboardNewCheck() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [province, setProvince] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [reason, setReason] = useState("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  const sanitize = (s: string) => s.replace(/[<>"'`]/g, "").slice(0, 100);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consent || !fullName.trim()) return;

    setIsSubmitting(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => (p >= 90 ? (clearInterval(interval), 90) : p + 5));
    }, 300);

    try {
      const { data, error } = await supabase.functions.invoke("multi-parameter-search", {
        body: {
          full_name: sanitize(fullName).trim(),
          province: province || undefined,
          user_id: user?.id,
        },
      });

      if (error) throw new Error(error.message);
      if (data?.success) {
        clearInterval(interval);
        setProgress(100);
        setTimeout(() => navigate(`/results?search_id=${data.searchId}`), 800);
      } else {
        throw new Error(data?.error || "Search failed");
      }
    } catch (err: any) {
      clearInterval(interval);
      setProgress(0);
      setIsSubmitting(false);
      alert(err.message || "Search failed. Please try again.");
    }
  };

  const inputClass = "w-full px-4 py-3 border-2 border-border rounded-lg text-sm font-body bg-background focus:outline-none focus:border-primary transition-colors";

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">New check</p>
      <h1 className="font-heading text-3xl text-foreground mb-8">Start a new safety check</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  className={inputClass}
                  placeholder="First name and surname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">Province</label>
                  <select className={inputClass} value={province} onChange={(e) => setProvince(e.target.value)} disabled={isSubmitting}>
                    <option value="">Select province (optional)</option>
                    {SA_PROVINCES.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">Age Range</label>
                  <select className={inputClass} value={ageRange} onChange={(e) => setAgeRange(e.target.value)} disabled={isSubmitting}>
                    <option value="">Select (optional)</option>
                    <option value="18-25">18–25</option>
                    <option value="26-35">26–35</option>
                    <option value="36-45">36–45</option>
                    <option value="46-55">46–55</option>
                    <option value="56+">56+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">Reason for search</label>
                <select className={inputClass} value={reason} onChange={(e) => setReason(e.target.value)} disabled={isSubmitting}>
                  <option value="">Select reason (optional)</option>
                  {REASONS.filter(Boolean).map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Consent */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(c) => setConsent(c === true)}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="consent" className="font-body text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I confirm I have a legitimate reason to search this person's public records and agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms</Link> and{" "}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link> (POPIA compliant).
                  </Label>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!consent || !fullName.trim() || isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground font-body font-bold text-base rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Checking records… {progress}%
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Verify this person — R99
                  </>
                )}
              </button>

              {/* Trust indicators */}
              <div className="flex flex-wrap justify-center gap-6 pt-2">
                {[
                  { icon: Clock, text: "Results in <60s" },
                  { icon: Lock, text: "100% Confidential" },
                  { icon: Shield, text: "POPIA Compliant" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className="h-3.5 w-3.5" />
                    <span className="font-mono text-[10px] tracking-wider">{text}</span>
                  </div>
                ))}
              </div>
            </form>
          </div>
        </div>

        {/* Side card */}
        <div className="hidden lg:block">
          <div className="bg-primary/5 border border-border rounded-xl p-6 sticky top-10">
            <Heart className="h-8 w-8 text-primary mb-4" />
            <p className="font-heading text-lg text-foreground mb-3">Why this matters</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              1 in 3 South African women experience physical violence from a partner. RedFlaq helps you see serious public-record warnings sooner.
            </p>
            <div className="border-t border-border pt-4">
              <p className="font-body text-xs text-muted-foreground leading-relaxed italic">
                "You're not being paranoid. You're paying attention."
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
