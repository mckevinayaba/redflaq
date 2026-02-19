import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Clock, Lock, Heart, Info } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SA_PROVINCES = [
  "", "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const REASONS = [
  "",
  "💜 Potential romantic partner",
  "Sharing my apartment / flat-mate",
  "Tenant or landlord screening",
  "Childcare or home helper",
  "Business or investment partner",
  "Employer or employee verification",
  "Other legitimate purpose",
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
  const [formError, setFormError] = useState("");

  const sanitize = (s: string) => s.replace(/[<>"'`]/g, "").slice(0, 100);

  const validate = (): boolean => {
    const name = fullName.trim();
    if (!name) {
      setFormError("Please enter the person's full name so we can search accurately.");
      return false;
    }
    if (!name.includes(" ")) {
      setFormError("Use both name and surname. This helps us find the correct person.");
      return false;
    }
    if (!reason) {
      setFormError("Choose a reason for your search so we can stay compliant and protect everyone's rights.");
      return false;
    }
    if (!consent) {
      setFormError("Please fill in all required fields so we can search public records accurately.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

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
      const msg = err.message || "";
      if (msg.toLowerCase().includes("network") || msg.toLowerCase().includes("fetch")) {
        setFormError("We could not complete this search right now. You have not been charged. Please try again in a few minutes.");
      } else {
        setFormError("We couldn't complete this search right now. You won't be charged for this attempt.");
      }
    }
  };

  const inputClass = "w-full px-4 py-3 border-2 border-border rounded-lg text-sm font-body bg-background focus:outline-none focus:border-primary transition-colors";

  const InfoTip = ({ text }: { text: string }) => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help inline-block ml-1.5" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">
          <p className="text-xs leading-relaxed">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );

  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">New check</p>
      <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">Start a new safety check</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-5 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error banner */}
              {formError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3">
                  <p className="font-body text-sm text-destructive">{formError}</p>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                  Full Name <span className="text-destructive">*</span>
                  <InfoTip text="RedFlaq only uses information that is already public, such as official warning lists. It does not access private SAPS fingerprint or internal criminal record databases." />
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. John David Mokoena"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFormError(""); }}
                  maxLength={100}
                  required
                  disabled={isSubmitting}
                />
                <p className="font-body text-xs text-muted-foreground mt-1.5">
                  Use the name they share on official documents or social media. A full name helps us find the right public record.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Province */}
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                    Province (optional)
                  </label>
                  <select className={inputClass} value={province} onChange={(e) => setProvince(e.target.value)} disabled={isSubmitting}>
                    <option value="">Select province</option>
                    {SA_PROVINCES.filter(Boolean).map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <p className="font-body text-xs text-muted-foreground mt-1.5">
                    If you know where they live or work, choose the province. This can improve match accuracy.
                  </p>
                </div>
                {/* Age Range */}
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                    Age range (optional)
                  </label>
                  <select className={inputClass} value={ageRange} onChange={(e) => setAgeRange(e.target.value)} disabled={isSubmitting}>
                    <option value="">Select age range</option>
                    <option value="18-25">18–25</option>
                    <option value="26-35">26–35</option>
                    <option value="36-45">36–45</option>
                    <option value="46-55">46–55</option>
                    <option value="56+">56+</option>
                  </select>
                  <p className="font-body text-xs text-muted-foreground mt-1.5">
                    Choose their approximate age range if you know it. This helps us separate people with the same name.
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                  Reason for search <span className="text-destructive">*</span>
                </label>
                <select
                  className={inputClass}
                  value={reason}
                  onChange={(e) => { setReason(e.target.value); setFormError(""); }}
                  disabled={isSubmitting}
                  style={reason === REASONS[1] ? { color: 'hsl(var(--primary))' } : {}}
                >
                  <option value="">Select reason</option>
                  {REASONS.filter(Boolean).map((r, i) => (
                    <option key={r} value={r} style={i === 0 ? { color: 'hsl(var(--primary))', fontWeight: 600 } : {}}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="font-body text-xs text-muted-foreground mt-1.5">
                  We ask for your reason to respect everyone's rights and stay POPIA‑aware. Choose the option that best fits your situation.
                </p>
              </div>

              {/* Consent */}
              <div className="pt-4 border-t border-border">
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="consent"
                    checked={consent}
                    onCheckedChange={(c) => { setConsent(c === true); setFormError(""); }}
                    className="mt-1"
                    disabled={isSubmitting}
                  />
                  <Label htmlFor="consent" className="font-body text-sm text-muted-foreground leading-relaxed cursor-pointer">
                    I confirm I have a legitimate reason to search this person and I agree to the{" "}
                    <Link to="/terms" className="text-primary hover:underline" target="_blank">Terms of Service</Link> and{" "}
                    <Link to="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>.
                  </Label>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-2 ml-7">
                  Your search is confidential. The person you check is not notified.
                </p>
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

          {/* Safety footer */}
          <p className="font-body text-xs text-muted-foreground text-center mt-6 max-w-lg mx-auto leading-relaxed">
            RedFlaq is a support tool, not a replacement for police, social workers or legal advice. If you are in immediate danger, contact emergency services or trusted support organisations.
          </p>
        </div>

        {/* Side card */}
        <div className="hidden lg:block">
          <div className="bg-primary/5 border border-border rounded-xl p-6 sticky top-10">
            <Heart className="h-8 w-8 text-primary mb-4" />
            <p className="font-heading text-lg text-foreground mb-3">Why this matters</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              1 in 3 South African women experience gender‑based violence in the hands of an intimate partner during their lifetime. RedFlaq helps you see serious public-record warnings sooner.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              Information does not guarantee safety, but it helps you spot serious warning signs.
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
