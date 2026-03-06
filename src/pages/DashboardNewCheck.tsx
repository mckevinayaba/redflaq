import { useState, useEffect } from "react";
import { validateSAIDNumber } from "@/utils/idValidation";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Shield, Clock, Lock, Heart, Info, AlertTriangle, Eye, EyeOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import BuyChecksModal from "@/components/BuyChecksModal";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const SA_PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal",
  "Limpopo", "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const REASONS = [
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
  const [searchParams] = useSearchParams();
  const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
  const [buyModalOpen, setBuyModalOpen] = useState(false);

  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [province, setProvince] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [reason, setReason] = useState("");
  const [consent, setConsent] = useState(false);
  const [discreetMode, setDiscreetMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formError, setFormError] = useState("");
  const [useIdNumber, setUseIdNumber] = useState(false);
  const [idNumber, setIdNumber] = useState("");

  // Fetch credit balance
  useEffect(() => {
    if (!user) return;
    const email = user.email || "";
    Promise.all([
      supabase.from("purchases").select("credits_remaining").eq("email", email).eq("status", "completed"),
      supabase.from("manual_payments").select("search_credits, credits_used").eq("email", email).eq("status", "verified"),
    ]).then(([{ data: p }, { data: m }]) => {
      const pc = (p || []).reduce((s, r) => s + (r.credits_remaining || 0), 0);
      const mc = (m || []).reduce((s, r) => s + ((r.search_credits || 0) - (r.credits_used || 0)), 0);
      const total = pc + mc;
      setCreditsRemaining(total);
      if (total <= 0) navigate("/pricing");
    });
  }, [user]);

  const sanitize = (s: string) => s.replace(/[<>"'`]/g, "").slice(0, 100);

  const validate = (): boolean => {
    if (!firstName.trim()) {
      setFormError("Please enter the person's first name.");
      return false;
    }
    if (!surname.trim()) {
      setFormError("Please enter the person's surname.");
      return false;
    }
    if (useIdNumber && idNumber.trim()) {
      const cleaned = idNumber.replace(/\s/g, '');
      const validation = validateSAIDNumber(cleaned);
      if (!validation.isValid) {
        setFormError(validation.errors[0]);
        return false;
      }
    }
    if (!reason) {
      setFormError("Choose a reason for your search so we can stay compliant and protect everyone's rights.");
      return false;
    }
    if (!consent) {
      setFormError("Please confirm you agree to the terms before searching.");
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

    const fullName = `${sanitize(firstName).trim()} ${sanitize(surname).trim()}`;

    try {
      const cleanedId = useIdNumber ? idNumber.replace(/\s/g, '') : undefined;
      const { data, error } = await supabase.functions.invoke("multi-parameter-search", {
        body: {
          full_name: fullName,
          sa_id_number: cleanedId || undefined,
          province: province || undefined,
          user_id: user?.id,
          discreet_mode: discreetMode,
        },
      });

      // supabase.functions.invoke returns error for non-2xx responses
      // Check both data and error for no-credits / redirect signals
      const noCredits =
        data?.redirect === '/pricing' ||
        error?.message?.toLowerCase()?.includes('no credits') ||
        error?.message?.toLowerCase()?.includes('402') ||
        (typeof error?.context?.body === 'string' && error.context.body.includes('redirect'));

      if (noCredits) {
        clearInterval(interval);
        setProgress(0);
        setIsSubmitting(false);
        setFormError("You don't have any search credits. Redirecting to pricing…");
        setTimeout(() => navigate("/pricing"), 2000);
        return;
      }

      if (error) {
        // Extract actual error message from edge function response body
        let actualMessage = error.message;
        try {
          const errorBody = await (error as any).context?.json();
          if (errorBody?.error) actualMessage = errorBody.error;
          if (errorBody?.redirect === '/pricing') {
            clearInterval(interval);
            setProgress(0);
            setIsSubmitting(false);
            setFormError("You don't have any search credits. Redirecting to pricing…");
            setTimeout(() => navigate("/pricing"), 2000);
            return;
          }
        } catch {}
        throw new Error(actualMessage);
      }

      if (data?.success) {
        clearInterval(interval);
        setProgress(100);
        if (discreetMode) {
          setTimeout(() => navigate(`/discreet-sent?email=${encodeURIComponent(user?.email || '')}&search_id=${data.searchId}`), 800);
        } else {
          setTimeout(() => navigate(`/results?search_id=${data.searchId}`), 800);
        }
      } else {
        throw new Error(data?.error || "Search failed");
      }
    } catch (err: any) {
      clearInterval(interval);
      setProgress(0);
      setIsSubmitting(false);
      const msg = err.message || "";
      const lower = msg.toLowerCase();

      const errorMap: [string, string][] = [
        ["no credits", "You don't have any search credits. Redirecting to pricing…"],
        ["purchase", "You don't have any search credits. Redirecting to pricing…"],
        ["402", "You don't have any search credits. Redirecting to pricing…"],
        ["payment not yet verified", "Your payment hasn't been verified yet. Please allow a few minutes for processing, then try again."],
        ["invalid payment", "We couldn't find a valid payment for your account. Please purchase a package first."],
        ["failed to deduct", "Something went wrong processing your credit. Please try again or contact support."],
        ["authentication required", "You need to be signed in to run a check. Please log in and try again."],
        ["user not found", "We couldn't verify your account. Please log out, log back in, and try again."],
        ["network", "We could not complete this search right now. You have not been charged. Please try again in a few minutes."],
        ["fetch", "We could not complete this search right now. You have not been charged. Please try again in a few minutes."],
      ];

      const matched = errorMap.find(([key]) => lower.includes(key));

      if (matched) {
        setFormError(matched[1]);
        if (lower.includes("no credits") || lower.includes("purchase") || lower.includes("402")) {
          setTimeout(() => navigate("/pricing"), 2000);
        }
      } else {
        setFormError(`Something went wrong: ${msg || "unknown error"}. You have not been charged. Please try again.`);
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
      <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Start a new safety check</h1>

      {/* Credit balance indicator */}
      {creditsRemaining !== null && creditsRemaining > 0 && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'hsl(var(--primary) / 0.1)' }}>
          <Shield className="h-4 w-4 text-primary" />
          <span className="font-body text-sm font-semibold text-primary">You have {creditsRemaining} check{creditsRemaining !== 1 ? "s" : ""} remaining</span>
        </div>
      )}
      {creditsRemaining !== null && creditsRemaining <= 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl border-2 border-destructive bg-destructive/10 mb-4">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <div>
            <p className="font-heading text-sm text-foreground">You have no checks remaining</p>
            <p className="font-body text-xs text-muted-foreground">Purchase checks to continue.</p>
          </div>
          <Link to="/pricing" className="ml-auto px-4 py-2 bg-primary text-primary-foreground font-body text-xs font-semibold rounded-lg hover:opacity-90 transition-colors whitespace-nowrap">Buy Checks</Link>
        </div>
      )}


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-xl border border-border p-5 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Error banner */}
              {formError && (
                <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <p className="font-body text-sm text-destructive">{formError}</p>
                </div>
              )}

              {/* First Name + Surname — split fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                    First Name <span className="text-destructive">*</span>
                    <InfoTip text="Enter the person's first name as it appears on official documents or social media." />
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. John"
                    value={firstName}
                    onChange={(e) => { setFirstName(e.target.value); setFormError(""); }}
                    maxLength={50}
                    required
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                    Surname <span className="text-destructive">*</span>
                    <InfoTip text="Enter the person's surname / family name." />
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Mokoena"
                    value={surname}
                    onChange={(e) => { setSurname(e.target.value); setFormError(""); }}
                    maxLength={50}
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>
              <p className="font-body text-xs text-muted-foreground -mt-4">
                RedFlaq only uses information that is already public, such as official warning lists. It does not access private SAPS fingerprint or internal criminal record databases.
              </p>

              {/* Optional ID Number */}
              <div className="p-4 rounded-lg bg-muted/40 border border-border">
                <label className="flex items-center gap-3 cursor-pointer">
                  <Checkbox
                    checked={useIdNumber}
                    onCheckedChange={(c) => { setUseIdNumber(c === true); if (!c) setIdNumber(""); setFormError(""); }}
                    disabled={isSubmitting}
                  />
                  <span className="font-body text-sm text-foreground font-medium">
                    I have their ID number <span className="text-muted-foreground font-normal">(improves accuracy)</span>
                  </span>
                </label>
                {useIdNumber && (
                  <div className="mt-4 pl-7">
                    <input
                      className={`${inputClass} font-mono tracking-wider`}
                      placeholder="e.g. 8001015009087"
                      value={idNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 13);
                        setIdNumber(v);
                        setFormError("");
                      }}
                      maxLength={13}
                      inputMode="numeric"
                      disabled={isSubmitting}
                    />
                    <p className="font-body text-xs text-muted-foreground mt-1.5">
                      13-digit South African ID number. This dramatically improves search accuracy and reduces false positives.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Province */}
                <div>
                  <label className="block font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-2">
                    Province (optional)
                  </label>
                  <select className={inputClass} value={province} onChange={(e) => setProvince(e.target.value)} disabled={isSubmitting}>
                    <option value="">Select province</option>
                    {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                  <p className="font-body text-xs text-muted-foreground mt-1.5">
                    If you know where they live or work, this can improve match accuracy.
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
                    Helps us separate people with the same name.
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
                  style={reason === REASONS[0] ? { color: 'hsl(var(--primary))' } : {}}
                >
                  <option value="">Select reason</option>
                  {REASONS.map((r, i) => (
                    <option key={r} value={r} style={i === 0 ? { color: 'hsl(var(--primary))', fontWeight: 600 } : {}}>
                      {r}
                    </option>
                  ))}
                </select>
                <p className="font-body text-xs text-muted-foreground mt-1.5">
                  We ask for your reason to respect everyone's rights and stay POPIA‑aware.
                </p>
              </div>

              {/* Discreet Mode Toggle */}
              <div className="flex items-start gap-4 p-4 rounded-lg border border-border bg-muted/30">
                <Switch
                  id="discreet-mode"
                  checked={discreetMode}
                  onCheckedChange={setDiscreetMode}
                  disabled={isSubmitting}
                  className="mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <label htmlFor="discreet-mode" className="font-body text-sm text-foreground cursor-pointer flex items-center gap-2 flex-wrap">
                    {discreetMode ? <Lock className="h-4 w-4 text-primary shrink-0" /> : <EyeOff className="h-4 w-4 text-muted-foreground shrink-0" />}
                    Send results to my email only (Discreet Mode)
                  </label>
                  <p className="font-body text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    Your results will not appear on screen. We'll email them to you privately so you can read them when it's safe to do so.
                  </p>
                </div>
              </div>

              {/* POPIA Consent */}
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
                    I understand this search is POPIA‑compliant and the person will not be notified.
                  </Label>
                </div>
                <p className="font-body text-xs text-muted-foreground mt-2 ml-7">
                  Your search is confidential. The person you check is not notified.
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!consent || !firstName.trim() || !surname.trim() || isSubmitting}
                className="w-full py-4 bg-primary text-primary-foreground font-body font-bold text-base rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Checking records… {progress}%
                  </>
                ) : (
                  <>
                    <Shield className="h-5 w-5" />
                    Verify this person
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
          <div className="border border-border rounded-xl p-6 sticky top-10" style={{ background: 'hsl(var(--primary) / 0.05)' }}>
            <Heart className="h-8 w-8 text-primary mb-4" />
            <p className="font-heading text-lg text-foreground mb-3">Why this matters</p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              1 in 3 South African women experience gender‑based violence in the hands of an intimate partner during their lifetime. RedFlaq helps you see serious public-record warnings sooner.
            </p>
            <p className="font-body text-sm text-muted-foreground leading-relaxed mb-4">
              Information does not guarantee safety, but it helps you spot serious warning signs.
            </p>

            {/* Data sources trust badges */}
            <div className="border-t border-border pt-4 mb-4">
              <p className="font-mono text-[10px] tracking-wider text-muted-foreground uppercase mb-3">Sources we check</p>
              <div className="space-y-2">
                {[
                  { emoji: "🚔", label: "SAPS Wanted Persons" },
                  { emoji: "⚖️", label: "SAFLII Court Judgments" },
                  { emoji: "📰", label: "Government Gazette" },
                  { emoji: "💰", label: "FIC Sanctions List" },
                ].map(({ emoji, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <span className="text-sm">{emoji}</span>
                    <span className="font-body text-xs text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>

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
