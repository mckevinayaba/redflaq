import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Shield, Sparkles, Check, X, Loader2, Eye, EyeOff } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, Math.min(4, Math.ceil(local.length / 2)));
  return `${visible}${"•".repeat(Math.max(local.length - visible.length, 2))}@${domain}`;
}

function getPasswordStrength(pw: string): { label: string; color: string; percent: number } {
  if (!pw) return { label: "", color: "", percent: 0 };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return { label: "Weak", color: "#EF4444", percent: 25 };
  if (score <= 2) return { label: "Fair", color: "#F97316", percent: 50 };
  if (score <= 3) return { label: "Good", color: "#EAB308", percent: 75 };
  return { label: "Strong", color: "#22C55E", percent: 100 };
}

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showCTABanner, setShowCTABanner] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailConfirmedBanner, setEmailConfirmedBanner] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signin") setMode("signin");
    if (searchParams.get("confirmed") === "true") {
      setMode("signin");
      setEmailConfirmedBanner(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const fromCTA = sessionStorage.getItem("fromCTA");
    if (fromCTA) setShowCTABanner(true);
  }, []);

  // Listen for auth state to catch email confirmation redirect
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        // If user just confirmed email via link, they'll be signed in
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user?.email_confirmed_at) {
            // Pre-fill email for convenience
            setEmail(user.email || "");
            setEmailConfirmedBanner(true);
            setMode("signin");
          }
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  // Validation helpers
  const nameWords = fullName.trim().split(/\s+/).filter(Boolean);
  const nameValid = nameWords.length >= 2;
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 8;
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
  const pwStrength = getPasswordStrength(password);

  const handleBlur = (field: string) => setTouched(t => ({ ...t, [field]: true }));
  const scrollToField = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => e.target.scrollIntoView({ behavior: "smooth", block: "center" }), 300);
  };

  const handleResendConfirmation = async () => {
    const targetEmail = email.trim();
    if (!targetEmail) {
      toast({ title: "Enter your email", description: "Please enter the email you signed up with.", variant: "destructive" });
      return;
    }
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: targetEmail });
    if (error) toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    else toast({ title: "Email sent ✓", description: "Check your inbox for the confirmation link." });
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup") {
      if (!nameValid || !emailValid || !passwordValid || !passwordsMatch || !consent) {
        setTouched({ name: true, email: true, password: true, confirmPassword: true, consent: true });
        return;
      }
    }
    setLoading(true);
    setEmailNotConfirmed(false);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { data: { full_name: fullName.trim() }, emailRedirectTo: `https://redflaq.com/?confirmed=true` },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        const referrerId = sessionStorage.getItem("referrer_id");
        if (referrerId) {
          await supabase.from("referrals").insert({ referrer_user_id: referrerId, referred_email: email.trim(), status: "signed_up" });
          sessionStorage.removeItem("referrer_id");
        }
        // Welcome content is now part of the confirmation email — no separate welcome email needed
        setSignupSuccess(true);
      }
    } else {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) setEmailNotConfirmed(true);
        else toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        const freshUser = signInData.user;
        if (!freshUser?.email_confirmed_at) { navigate("/verify-email"); }
        else {
          const userEmail = freshUser.email || "";
          const { data: purchases } = await supabase.from("purchases").select("credits_remaining").eq("email", userEmail).eq("status", "completed").gt("credits_remaining", 0).limit(1);
          const { data: manualPayments } = await supabase.from("manual_payments").select("search_credits, credits_used").eq("email", userEmail).eq("status", "verified").limit(1);
          const hasCredits = (purchases && purchases.length > 0) || (manualPayments && manualPayments.some(p => (p.search_credits || 0) - (p.credits_used || 0) > 0));
          if (!hasCredits && sessionStorage.getItem("fromCTA")) navigate("/pricing");
          else if (!hasCredits) {
            const firstName = freshUser.user_metadata?.full_name?.split(" ")[0] || "";
            if (firstName) { setWelcomeName(firstName); setShowWelcome(true); }
            else navigate("/dashboard");
          } else {
            const pending = sessionStorage.getItem("pendingSearch");
            if (pending) { sessionStorage.removeItem("pendingSearch"); sessionStorage.removeItem("fromCTA"); }
            navigate("/dashboard/new-check");
          }
        }
      }
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(124,58,237,0.2)',
    padding: '14px 16px', fontFamily: "'Syne', sans-serif", fontSize: 15,
    color: '#FFFFFF', width: '100%', outline: 'none', borderRadius: 12,
    transition: 'border-color 0.2s',
  };
  const inputErrorStyle: React.CSSProperties = { ...inputStyle, borderColor: '#EF4444' };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)',
    display: 'block', marginBottom: 8,
  };

  // Welcome modal
  if (showWelcome) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)', borderRadius: 24, padding: '48px 32px', backdropFilter: 'blur(12px)' }}>
            <div style={{ width: 64, height: 64, background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={32} style={{ color: '#A855F7' }} />
            </div>
            <h1 className="font-heading text-[26px] sm:text-[28px] mb-2" style={{ color: '#FFFFFF' }}>
              Welcome to RedFlaq, {welcomeName}
            </h1>
            <p className="font-body text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Your free safety account is ready. Start by documenting an incident, running a safety check, or exploring your dashboard.
            </p>
            <button onClick={() => navigate("/dashboard")}
              className="w-full font-body font-bold text-[15px] flex items-center justify-center gap-2 transition-all"
              style={{ background: '#7C3AED', color: 'white', padding: '16px 24px', border: 'none', cursor: 'pointer', borderRadius: 50, boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
              <Shield size={18} /> Go to Dashboard
            </button>
            <button onClick={() => navigate("/dashboard/journal/new")}
              className="font-body text-sm mt-4" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              Or document an incident →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── SUCCESS STATE (in-place transform) ───
  if (signupSuccess) {
    return (
      <div style={{ background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%' }}>
          <Link to="/" className="flex items-center mb-8 justify-center">
            <img src={redflaqLogo} alt="RedFlaq" style={{ height: 52, width: 'auto', display: 'block' }} />
          </Link>
          <div style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 24, padding: '48px 28px', backdropFilter: 'blur(16px)', textAlign: 'center' }}>
            {/* Animated envelope */}
            <div style={{
              width: 80, height: 80, background: 'rgba(34,197,94,0.12)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px',
              animation: 'pulse 2s ease-in-out infinite',
            }}>
              <Mail size={40} style={{ color: '#22C55E' }} />
            </div>

            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#FFFFFF', marginBottom: 12 }}>
              You're almost in
            </h1>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#A855F7', marginBottom: 20, fontWeight: 400 }}>
              Check your email
            </h2>

            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 8 }}>
              We just sent a confirmation link to
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#FFFFFF', fontWeight: 700, marginBottom: 16, letterSpacing: '0.02em' }}>
              {maskEmail(email)}
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 8 }}>
              Click the link in that email to activate your account — it only takes a second.
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 32 }}>
              Check your <strong style={{ color: 'rgba(255,255,255,0.55)' }}>spam</strong> or <strong style={{ color: 'rgba(255,255,255,0.55)' }}>junk</strong> folder if you don't see it within 2 minutes.
            </p>

            <button onClick={handleResendConfirmation} disabled={resending}
              style={{
                width: '100%', background: 'transparent', border: '1.5px solid rgba(124,58,237,0.3)',
                padding: '14px 24px', fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
                color: '#A855F7', cursor: resending ? 'not-allowed' : 'pointer',
                opacity: resending ? 0.7 : 1, borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {resending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Resend confirmation email"}
            </button>

            <button onClick={() => { setSignupSuccess(false); setMode("signin"); }}
              className="font-body text-sm mt-5 flex items-center justify-center gap-1.5 mx-auto"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
              Already confirmed? Sign in →
            </button>
          </div>
          <div className="text-center mt-6">
            <Link to="/" className="font-body text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>← Back to home</Link>
          </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.06); opacity: 0.85; } }`}</style>
      </div>
    );
  }

  // ─── MAIN FORM ───
  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)', width: '60%', height: '50%', background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 10 }}>
        <Link to="/" className="flex items-center mb-8 justify-center">
          <img src={redflaqLogo} alt="RedFlaq" style={{ height: 52, width: 'auto', display: 'block' }} />
        </Link>

        <div style={{ background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 24, padding: '36px 28px', backdropFilter: 'blur(16px)' }}>
          
          {/* Email confirmed banner */}
          {emailConfirmedBanner && (
            <div style={{
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              padding: '12px 16px', marginBottom: 20, borderRadius: 12,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Check size={18} style={{ color: '#22C55E', flexShrink: 0 }} />
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#86EFAC', fontWeight: 600, margin: 0 }}>
                Your email is confirmed! Sign in to continue.
              </p>
              <button onClick={() => setEmailConfirmedBanner(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', marginLeft: 'auto', padding: 0 }}>
                <X size={14} />
              </button>
            </div>
          )}

          {showCTABanner && (
            <div style={{
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
              padding: '12px 16px', marginBottom: 24, borderRadius: 12,
              fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#A855F7', fontWeight: 600, textAlign: 'center',
            }}>
              Create a free account to run your first safety check.
            </div>
          )}

          <h1 className="font-heading text-[26px] sm:text-[30px] mb-2" style={{ color: '#FFFFFF' }}>
            {mode === "signup" ? "Create your free safety account" : "Welcome back"}
          </h1>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {mode === "signup" ? "No credit card required. Built for South African women and communities." : "Sign in to continue."}
          </p>

          {/* What You Get — signup only */}
          {mode === "signup" && (
            <div style={{ display: 'grid', gap: 12, marginBottom: 24 }}>
              {[
                { icon: "📝", title: "My Safety Journal", desc: "A private, time-stamped journal where you can record incidents, worries and patterns. Add photos, videos or audio, and export your entries to share with a lawyer, social worker or trusted person." },
                { icon: "🔍", title: "Saved Checks", desc: "Keep a history of everyone you have checked on RedFlaq. Re-download reports, show them to someone you trust, and track your own safety decisions over time." },
                { icon: "🆘", title: "All Safety Resources", desc: "Instant access to GBV helplines, provincial resources, protection order information and practical safety tips for dating, parenting, tenants, domestic workers and more." },
              ].map((card) => (
                <div key={card.title} style={{
                  background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)',
                  borderRadius: 12, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{card.icon}</span>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#FFFFFF', marginBottom: 4 }}>{card.title}</p>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{card.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Email not confirmed warning */}
          {emailNotConfirmed && (
            <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', padding: 14, marginBottom: 20, borderRadius: 12 }}>
              <p className="font-body text-[13px] leading-relaxed mb-2" style={{ color: '#FDE68A' }}>
                Please confirm your email first. Check your inbox for the confirmation link we sent you.
              </p>
              <button onClick={handleResendConfirmation} disabled={resending}
                className="font-body text-[13px] font-bold flex items-center gap-1.5" style={{ background: 'none', border: 'none', color: '#A855F7', cursor: 'pointer', padding: 0 }}>
                {resending ? <><Loader2 size={12} className="animate-spin" /> Sending...</> : "Resend confirmation email"}
              </button>
            </div>
          )}

          <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  style={touched.name && !nameValid ? inputErrorStyle : inputStyle}
                  placeholder="e.g. Nomsa Dlamini"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; scrollToField(e); }}
                  onBlur={(e) => { handleBlur("name"); e.currentTarget.style.borderColor = touched.name && !nameValid ? '#EF4444' : 'rgba(124,58,237,0.2)'; }}
                  required
                />
                {touched.name && !nameValid && <p className="font-body text-[12px] mt-1" style={{ color: '#EF4444' }}>Please enter your full name (first name and surname).</p>}
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address *</label>
              <input
                style={touched.email && !emailValid ? inputErrorStyle : inputStyle}
                type="email" placeholder="you@example.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; scrollToField(e); }}
                onBlur={(e) => { handleBlur("email"); e.currentTarget.style.borderColor = touched.email && !emailValid ? '#EF4444' : 'rgba(124,58,237,0.2)'; }}
                required
              />
              {touched.email && !emailValid && <p className="font-body text-[12px] mt-1" style={{ color: '#EF4444' }}>Please enter a valid email address.</p>}
            </div>

            <div>
              <label style={labelStyle}>Password *</label>
              <div style={{ position: 'relative' }}>
                <input
                  style={touched.password && !passwordValid ? { ...inputErrorStyle, paddingRight: 44 } : { ...inputStyle, paddingRight: 44 }}
                  type={showPassword ? "text" : "password"} placeholder="At least 8 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; scrollToField(e); }}
                  onBlur={(e) => { handleBlur("password"); e.currentTarget.style.borderColor = touched.password && !passwordValid ? '#EF4444' : 'rgba(124,58,237,0.2)'; }}
                  minLength={8} required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {touched.password && !passwordValid && <p className="font-body text-[12px] mt-1" style={{ color: '#EF4444' }}>Password must be at least 8 characters.</p>}
              {/* Password strength indicator */}
              {mode === "signup" && password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pwStrength.percent}%`, background: pwStrength.color, borderRadius: 2, transition: 'all 0.3s ease' }} />
                  </div>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 11, color: pwStrength.color, marginTop: 4, fontWeight: 600 }}>{pwStrength.label}</p>
                </div>
              )}
            </div>

            {mode === "signup" && (
              <div>
                <label style={labelStyle}>Confirm Password *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={touched.confirmPassword && !passwordsMatch ? { ...inputErrorStyle, paddingRight: 44 } : { ...inputStyle, paddingRight: 44 }}
                    type={showConfirmPassword ? "text" : "password"} placeholder="Re-enter your password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'; scrollToField(e); }}
                    onBlur={(e) => { handleBlur("confirmPassword"); e.currentTarget.style.borderColor = touched.confirmPassword && !passwordsMatch ? '#EF4444' : 'rgba(124,58,237,0.2)'; }}
                    minLength={8} required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4 }}>
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    {passwordsMatch ? (
                      <><Check size={14} style={{ color: '#22C55E' }} /><span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#22C55E' }}>Passwords match</span></>
                    ) : (
                      <><X size={14} style={{ color: '#EF4444' }} /><span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#EF4444' }}>Passwords don't match</span></>
                    )}
                  </div>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div>
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                    style={{ marginTop: 3, accentColor: '#7C3AED' }} />
                  <span className="font-body text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    I agree to the{" "}
                    <Link to="/terms" target="_blank" style={{ color: '#A855F7', textDecoration: 'underline' }}>Terms</Link>{" "}and{" "}
                    <Link to="/privacy" target="_blank" style={{ color: '#A855F7', textDecoration: 'underline' }}>Privacy Policy</Link>.
                  </span>
                </label>
                {touched.consent && !consent && <p className="font-body text-[12px] mt-1" style={{ color: '#EF4444' }}>You must agree to continue.</p>}
              </div>
            )}

            <button type="submit"
              disabled={loading || (mode === "signup" && !consent)}
              className="w-full font-body font-bold text-[15px] transition-all flex items-center justify-center gap-2"
              style={{
                background: '#7C3AED', color: 'white', padding: 16, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading || (mode === "signup" && !consent) ? 0.5 : 1,
                borderRadius: 50, boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                minHeight: 52,
              }}>
              {loading ? <><Loader2 size={18} className="animate-spin" /> Please wait...</> : mode === "signup" ? "Create my free account" : "Sign In"}
            </button>
          </form>

          {mode === "signup" && (
            <>
              <p className="font-body text-[12px] mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Your data is encrypted and private. RedFlaq never shares your journal or check history without your permission, except where required by South African law.
              </p>
            </>
          )}

          <div className="mt-5 text-center flex flex-col gap-2">
            <button onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setEmailNotConfirmed(false); setEmailConfirmedBanner(false); }}
              className="font-body text-sm" style={{ background: 'none', border: 'none', color: '#A855F7', cursor: 'pointer' }}>
              {mode === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up free"}
            </button>
            {mode === "signin" && (
              <button type="button"
                onClick={async () => {
                  if (!email.trim()) { toast({ title: "Enter your email", description: "Please enter your email address first.", variant: "destructive" }); return; }
                  const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
                  if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                  else toast({ title: "Check your email", description: "Password reset link sent." });
                }}
                className="font-body text-[14px] font-semibold" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>
                Forgot your password?
              </button>
            )}
          </div>

          <p className="font-body text-center mt-5" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
            RedFlaq is operated by Setup A Startup (Pty) Ltd
          </p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="font-body text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
