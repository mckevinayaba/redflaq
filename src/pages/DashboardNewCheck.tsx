/**
 * ═══════════════════════════════════════════════════════════════════
 * VERIFY — NEW SAFETY CHECK FORM
 * ═══════════════════════════════════════════════════════════════════
 *
 * This is the core "Verify" feature — the criminal record check.
 * Users enter a person's name and optional identifying info, then
 * the system searches the RedFlaq Verified Public Records Network
 * (criminal records, court judgments, and official warning lists).
 *
 * CREDIT SYSTEM:
 * - Each check consumes 1 credit (purchased via Yoco)
 * - Admin users bypass credit checks for testing
 * - Credits are tracked across purchases and manual_payments tables
 *
 * POPIA COMPLIANCE:
 * - Users must select a legitimate purpose for the search
 * - Consent checkbox required before submission
 * - SA ID numbers are validated but never stored in full
 * - Discreet mode available to hide results from dashboard
 *
 * FLOW: Form → multi-parameter-search Edge Function → Results page
 * ═══════════════════════════════════════════════════════════════════
 */
import { useState, useEffect } from "react";
import { validateSAIDNumber } from "@/utils/idValidation";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
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

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '24px 28px',
};

const inputStyle: React.CSSProperties = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  color: '#d1d1d6',
  background: '#0d0d1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '10px 14px',
  outline: 'none',
  width: '100%',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  color: '#8b8b91',
  letterSpacing: '0.1em',
  textTransform: 'uppercase' as const,
  display: 'block',
  marginBottom: 8,
};

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

const ADMIN_EMAIL = "mckevin.ayaba@gmail.com";

export default function DashboardNewCheck() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { credits: creditsRemaining, loading: creditsLoading, webhookDelayed } = useCredits(user?.email, user?.id);
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

  const isAdmin = user?.email === ADMIN_EMAIL;
  const hasCredits = isAdmin || (creditsRemaining !== null && creditsRemaining > 0);

  const sanitize = (s: string) => s.replace(/[<>"'`]/g, "").slice(0, 100);

  const validate = (): boolean => {
    if (!firstName.trim()) { setFormError("Please enter the person's first name."); return false; }
    if (!surname.trim()) { setFormError("Please enter the person's surname."); return false; }
    if (useIdNumber && idNumber.trim()) {
      const cleaned = idNumber.replace(/\s/g, '');
      const validation = validateSAIDNumber(cleaned);
      if (!validation.isValid) { setFormError(validation.errors[0]); return false; }
    }
    if (!reason) { setFormError("Choose a reason for your search so we can stay compliant and protect everyone's rights."); return false; }
    if (!consent) { setFormError("Please confirm you agree to the terms before searching."); return false; }
    setFormError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    // Frontend credit guard (admin bypasses)
    if (!isAdmin && (creditsRemaining === null || creditsRemaining <= 0)) {
      setBuyModalOpen(true);
      return;
    }

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

      const noCredits =
        data?.redirect === '/pricing' ||
        error?.message?.toLowerCase()?.includes('no credits') ||
        error?.message?.toLowerCase()?.includes('402') ||
        (typeof error?.context?.body === 'string' && error.context.body.includes('redirect'));

      if (noCredits) {
        clearInterval(interval);
        setProgress(0);
        setIsSubmitting(false);
        setBuyModalOpen(true);
        return;
      }

      if (error) {
        let actualMessage = error.message;
        try {
          const errorBody = await (error as any).context?.json();
          if (errorBody?.error) actualMessage = errorBody.error;
          if (errorBody?.redirect === '/pricing') {
            clearInterval(interval);
            setProgress(0);
            setIsSubmitting(false);
            setBuyModalOpen(true);
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
        ["no credits", "You don't have any search credits."],
        ["purchase", "You don't have any search credits."],
        ["402", "You don't have any search credits."],
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
          setBuyModalOpen(true);
        }
      } else {
        setFormError(`Something went wrong: ${msg || "unknown error"}. You have not been charged. Please try again.`);
      }
    }
  };

  const inputClass = "w-full";

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
      <div style={{ marginBottom: 28 }}>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>New check</p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>Start a new safety check</h1>
      </div>

      {/* Credit balance indicator */}
      {creditsLoading ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(255,255,255,0.04)', marginBottom: 20 }}>
          <div style={{ width: 16, height: 16, border: '2px solid rgba(108,53,222,0.3)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span style={{ ...inter, fontSize: 14, color: '#8b8b91' }}>Loading balance…</span>
        </div>
      ) : isAdmin ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.25)', marginBottom: 20 }}>
          <Shield className="h-4 w-4" style={{ color: '#6C35DE' }} />
          <span style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#6C35DE' }}>Admin — Unlimited checks</span>
        </div>
      ) : hasCredits ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 20, background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.25)', marginBottom: 20 }}>
          <Shield className="h-4 w-4" style={{ color: '#6C35DE' }} />
          <span style={{ ...inter, fontSize: 14, fontWeight: 600, color: '#6C35DE' }}>You have {creditsRemaining} check{creditsRemaining !== 1 ? "s" : ""} remaining</span>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 16, borderRadius: 8, border: '1px solid rgba(192,57,43,0.4)', background: 'rgba(192,57,43,0.08)', marginBottom: 16 }}>
            <AlertTriangle className="h-5 w-5 shrink-0" style={{ color: '#C0392B' }} />
            <div style={{ flex: 1 }}>
              <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>You have no checks remaining</p>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Purchase checks to continue verifying.</p>
            </div>
            <button onClick={() => setBuyModalOpen(true)} style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff', background: '#6C35DE', border: 'none', padding: '9px 16px', borderRadius: 4, cursor: 'pointer', whiteSpace: 'nowrap' as const }}>Buy Checks</button>
          </div>
          {webhookDelayed && (
            <div style={{ padding: 16, borderRadius: 8, border: '1px solid rgba(217,119,6,0.4)', background: 'rgba(217,119,6,0.08)', marginBottom: 16 }}>
              <p style={{ ...inter, fontSize: 14, color: '#D97706' }}>
                <strong>Your payment was confirmed</strong> but credits are taking longer than expected. Please contact{" "}
                <a href="mailto:support@redflaq.com" style={{ color: '#6C35DE', textDecoration: 'underline' }}>support@redflaq.com</a> with your payment reference and we will manually add your credits immediately.
              </p>
            </div>
          )}
        </>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Form — only render if user has credits or is admin */}
        <div className="lg:col-span-2">
          {!hasCredits && !creditsLoading ? (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <Shield className="h-12 w-12 mx-auto mb-4" style={{ color: '#8b8b91' }} />
              <p style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>No checks available</p>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 24 }}>Purchase a package to start verifying people.</p>
              <button onClick={() => setBuyModalOpen(true)} style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', border: 'none', padding: '12px 24px', borderRadius: 4, cursor: 'pointer' }}>
                Buy Checks
              </button>
            </div>
          ) : (
            <div style={card}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {formError && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 16px', borderRadius: 6, background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)' }}>
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: '#C0392B' }} />
                    <p style={{ ...inter, fontSize: 14, color: '#C0392B' }}>{formError}</p>
                  </div>
                )}

                {/* First Name + Surname */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>
                      First Name <span style={{ color: '#C0392B' }}>*</span>
                      <InfoTip text="Enter the person's first name as it appears on official documents or social media." />
                    </label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="e.g. John"
                      value={firstName}
                      onChange={(e) => { setFirstName(e.target.value); setFormError(""); }}
                      onFocus={e => e.target.style.borderColor = '#6C35DE'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      maxLength={50}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>
                      Surname <span style={{ color: '#C0392B' }}>*</span>
                      <InfoTip text="Enter the person's surname / family name." />
                    </label>
                    <input
                      className={inputClass}
                      style={inputStyle}
                      placeholder="e.g. Mokoena"
                      value={surname}
                      onChange={(e) => { setSurname(e.target.value); setFormError(""); }}
                      onFocus={e => e.target.style.borderColor = '#6C35DE'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      maxLength={50}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: -12 }}>
                  RedFlaq only uses verified public records and official warning lists. It does not access private fingerprint or internal criminal record databases.
                </p>

                {/* Optional ID Number */}
                <div style={{ padding: 16, borderRadius: 6, background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                    <Checkbox checked={useIdNumber} onCheckedChange={(c) => { setUseIdNumber(c === true); if (!c) setIdNumber(""); setFormError(""); }} disabled={isSubmitting} />
                    <span style={{ ...inter, fontSize: 14, color: '#d1d1d6', fontWeight: 500 }}>
                      I have their ID number <span style={{ color: '#8b8b91', fontWeight: 400 }}>(improves accuracy)</span>
                    </span>
                  </label>
                  {useIdNumber && (
                    <div style={{ marginTop: 16, paddingLeft: 28 }}>
                      <input
                        className={inputClass}
                        style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}
                        placeholder="e.g. 8001015009087"
                        value={idNumber}
                        onChange={(e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, 13); setIdNumber(v); setFormError(""); }}
                        onFocus={e => e.target.style.borderColor = '#6C35DE'}
                        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                        maxLength={13}
                        inputMode="numeric"
                        disabled={isSubmitting}
                      />
                      <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8 }}>13-digit South African ID number. This dramatically improves search accuracy and reduces false positives.</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label style={labelStyle}>Province (optional)</label>
                    <select
                      className={inputClass}
                      style={inputStyle}
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                      onFocus={e => e.target.style.borderColor = '#6C35DE'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      disabled={isSubmitting}
                    >
                      <option value="">Select province</option>
                      {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8 }}>If you know where they live or work, this can improve match accuracy.</p>
                  </div>
                  <div>
                    <label style={labelStyle}>Age range (optional)</label>
                    <select
                      className={inputClass}
                      style={inputStyle}
                      value={ageRange}
                      onChange={(e) => setAgeRange(e.target.value)}
                      onFocus={e => e.target.style.borderColor = '#6C35DE'}
                      onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                      disabled={isSubmitting}
                    >
                      <option value="">Select age range</option>
                      <option value="18-25">18–25</option>
                      <option value="26-35">26–35</option>
                      <option value="36-45">36–45</option>
                      <option value="46-55">46–55</option>
                      <option value="56+">56+</option>
                    </select>
                    <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8 }}>Helps us separate people with the same name.</p>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label style={labelStyle}>
                    Reason for search <span style={{ color: '#C0392B' }}>*</span>
                  </label>
                  <select
                    className={inputClass}
                    style={{ ...inputStyle, ...(reason === REASONS[0] ? { color: '#6C35DE' } : {}) }}
                    value={reason}
                    onChange={(e) => { setReason(e.target.value); setFormError(""); }}
                    onFocus={e => e.target.style.borderColor = '#6C35DE'}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                    disabled={isSubmitting}
                  >
                    <option value="">Select reason</option>
                    {REASONS.map((r, i) => (
                      <option key={r} value={r} style={i === 0 ? { color: '#6C35DE', fontWeight: 600 } : {}}>{r}</option>
                    ))}
                  </select>
                  <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8 }}>We ask for your reason to respect everyone's rights and stay POPIA‑aware.</p>
                </div>

                {/* Discreet Mode */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: 16, borderRadius: 6, border: '1px solid rgba(255,255,255,0.08)', background: '#0d0d1a' }}>
                  <Switch id="discreet-mode" checked={discreetMode} onCheckedChange={setDiscreetMode} disabled={isSubmitting} className="mt-0.5" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <label htmlFor="discreet-mode" style={{ ...inter, fontSize: 14, color: '#d1d1d6', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const }}>
                      {discreetMode ? <Lock className="h-4 w-4 shrink-0" style={{ color: '#6C35DE' }} /> : <EyeOff className="h-4 w-4 shrink-0" style={{ color: '#8b8b91' }} />}
                      Send results to my email only (Discreet Mode)
                    </label>
                    <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8, lineHeight: 1.6 }}>
                      Your results will not appear on screen. We'll email them to you privately so you can read them when it's safe to do so.
                    </p>
                  </div>
                </div>

                {/* POPIA Consent */}
                <div style={{ paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <Checkbox id="consent" checked={consent} onCheckedChange={(c) => { setConsent(c === true); setFormError(""); }} className="mt-1" disabled={isSubmitting} />
                    <Label htmlFor="consent" style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, cursor: 'pointer' }}>
                      I confirm I have a legitimate reason to search this person and I agree to the{" "}
                      <Link to="/terms" style={{ color: '#6C35DE', textDecoration: 'underline' }} target="_blank">Terms of Service</Link> and{" "}
                      <Link to="/privacy" style={{ color: '#6C35DE', textDecoration: 'underline' }} target="_blank">Privacy Policy</Link>.
                      I understand this search is POPIA‑compliant and the person will not be notified.
                    </Label>
                  </div>
                  <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 8, marginLeft: 28 }}>Your search is confidential. The person you check is not notified.</p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!consent || !firstName.trim() || !surname.trim() || isSubmitting || (!isAdmin && (creditsRemaining === null || creditsRemaining <= 0))}
                  style={{
                    ...inter,
                    width: '100%',
                    padding: '14px 0',
                    fontSize: 15,
                    fontWeight: 700,
                    color: '#ffffff',
                    background: '#6C35DE',
                    border: 'none',
                    borderRadius: 4,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                    opacity: (!consent || !firstName.trim() || !surname.trim() || isSubmitting || (!isAdmin && (creditsRemaining === null || creditsRemaining <= 0))) ? 0.45 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div style={{ width: 20, height: 20, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
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
                <div style={{ display: 'flex', flexWrap: 'wrap' as const, justifyContent: 'center', gap: 24, paddingTop: 8 }}>
                  {[
                    { icon: Clock, text: "Results in <60s" },
                    { icon: Lock, text: "100% Confidential" },
                    { icon: Shield, text: "POPIA Compliant" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#8b8b91' }}>
                      <Icon className="h-3.5 w-3.5" />
                      <span style={{ ...mono, fontSize: 10, letterSpacing: '0.08em' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </form>
            </div>
          )}

          <p style={{ ...inter, fontSize: 12, color: '#8b8b91', textAlign: 'center', marginTop: 24, maxWidth: 520, margin: '24px auto 0', lineHeight: 1.7 }}>
            RedFlaq is a support tool, not a replacement for police, social workers or legal advice. If you are in immediate danger, contact emergency services or trusted support organisations.
          </p>
        </div>

        {/* Side card */}
        <div className="hidden lg:block">
          <div style={{ background: 'rgba(108,53,222,0.06)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8, padding: 24, position: 'sticky', top: 40 }}>
            <Heart className="h-8 w-8 mb-4" style={{ color: '#6C35DE' }} />
            <p style={{ ...inter, fontSize: 17, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>Why this matters</p>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, marginBottom: 16 }}>
              1 in 3 South African women experience gender‑based violence in the hands of an intimate partner during their lifetime. RedFlaq helps you see serious public-record warnings sooner.
            </p>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, marginBottom: 16 }}>
              Information does not guarantee safety, but it helps you spot serious warning signs.
            </p>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16, marginBottom: 16 }}>
              <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Sources we check</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14 }}>🛡️</span>
                <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>RedFlaq Verified Public Records Network</span>
              </div>
            </div>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, fontStyle: 'italic' }}>"You're not being paranoid. You're paying attention."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Support link */}
      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <a href="mailto:support@redflaq.com" style={{ ...inter, fontSize: 12, color: '#8b8b91', textDecoration: 'none' }}>
          Payment issue? Contact support@redflaq.com
        </a>
        <span style={{ color: '#8b8b91', margin: '0 8px' }}>·</span>
        <Link to="/dashboard/claim" style={{ ...inter, fontSize: 12, color: '#8b8b91', textDecoration: 'none' }}>
          Have a payment reference? Claim your checks
        </Link>
      </div>

      <BuyChecksModal open={buyModalOpen} onOpenChange={setBuyModalOpen} />
    </DashboardLayout>
  );
}
