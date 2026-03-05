import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowLeft, Shield, Sparkles } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [mode, setMode] = useState<"signup" | "signin">(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("mode") === "signin" ? "signin" : "signup";
  });
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);
  const [resending, setResending] = useState(false);
  const [consent, setConsent] = useState(false);
  const [showCTABanner, setShowCTABanner] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fromCTA = sessionStorage.getItem("fromCTA");
    if (fromCTA) setShowCTABanner(true);
  }, []);

  const validateFullName = (name: string) => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length < 2) { setNameError("Please enter your full name (first name and surname)."); return false; }
    setNameError(""); return true;
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
    if (error) toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    else toast({ title: "Email sent", description: "Check your inbox for the confirmation link." });
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !validateFullName(fullName)) return;
    if (mode === "signup" && password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" }); return;
    }
    if (mode === "signup" && !consent) {
      toast({ title: "Please agree", description: "You must agree to the Terms and Privacy Policy.", variant: "destructive" }); return;
    }
    setLoading(true);
    setEmailNotConfirmed(false);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { data: { full_name: fullName.trim() }, emailRedirectTo: window.location.origin },
      });
      if (error) toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      else {
        const referrerId = sessionStorage.getItem("referrer_id");
        if (referrerId) {
          await supabase.from("referrals").insert({ referrer_user_id: referrerId, referred_email: email.trim(), status: "signed_up" });
          sessionStorage.removeItem("referrer_id");
        }
        supabase.functions.invoke('send-welcome-email', { body: { email: email.trim(), full_name: fullName.trim() } }).catch(() => {});
        setSignupSuccess(true);
        navigate("/verify-email");
        return;
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
            else navigate("/dashboard/new-check");
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
          <div style={{
            background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.2)',
            borderRadius: 24, padding: '48px 32px', backdropFilter: 'blur(12px)',
          }}>
            <div style={{ width: 64, height: 64, background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={32} style={{ color: '#A855F7' }} />
            </div>
            <h1 className="font-heading text-[26px] sm:text-[28px] mb-2" style={{ color: '#FFFFFF' }}>
              Welcome to RedFlaq, {welcomeName}
            </h1>
            <p className="font-body text-[15px] leading-relaxed mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Let's run your first safety check. It takes less than 60 seconds and costs R99.
            </p>
            <button
              onClick={() => navigate("/dashboard/new-check")}
              className="w-full font-body font-bold text-[15px] flex items-center justify-center gap-2 transition-all"
              style={{ background: '#7C3AED', color: 'white', padding: '16px 24px', border: 'none', cursor: 'pointer', borderRadius: 50, boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}
            >
              <Shield size={18} /> Run a safety check now
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              className="font-body text-sm mt-4"
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
            >
              Go to Dashboard instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Radial glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.1) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 480, width: '100%', position: 'relative', zIndex: 10 }}>
        {/* Logo */}
        <Link to="/" className="flex items-center mb-8 justify-center">
          <img src={redflaqLogo} alt="RedFlaq" style={{ height: 52, width: 'auto', display: 'block' }} />
        </Link>

        <div style={{
          background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 24, padding: '36px 28px', backdropFilter: 'blur(16px)',
        }}>
          {showCTABanner && !signupSuccess && (
            <div style={{
              background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)',
              padding: '12px 16px', marginBottom: 24, borderRadius: 12,
              fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#A855F7', fontWeight: 600, textAlign: 'center',
            }}>
              Create a free account to run your first safety check.
            </div>
          )}

          {signupSuccess ? (
            <div className="text-center" style={{ padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, background: 'rgba(124,58,237,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Mail size={32} style={{ color: '#A855F7' }} />
              </div>
              <h1 className="font-heading text-[26px] mb-2" style={{ color: '#FFFFFF' }}>Check your inbox</h1>
              <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
                We sent a confirmation link to <strong style={{ color: '#FFFFFF' }}>{email}</strong>. Click the link to activate your account.
              </p>
              <button
                onClick={handleResendConfirmation}
                disabled={resending}
                className="w-full font-body text-sm font-semibold transition-all"
                style={{
                  background: 'transparent', border: '1.5px solid rgba(124,58,237,0.3)',
                  padding: '14px 24px', color: '#A855F7', cursor: resending ? 'not-allowed' : 'pointer',
                  opacity: resending ? 0.7 : 1, borderRadius: 50,
                }}
              >
                {resending ? "Sending..." : "Resend confirmation email"}
              </button>
              <button
                onClick={() => { setSignupSuccess(false); setMode("signin"); }}
                className="font-body text-sm mt-4 flex items-center justify-center gap-1.5 mx-auto"
                style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}
              >
                <ArrowLeft size={14} /> Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 className="font-heading text-[26px] sm:text-[30px] mb-2" style={{ color: '#FFFFFF' }}>
                {mode === "signup" ? "Create your free account" : "Welcome back"}
              </h1>
              <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {mode === "signup" ? "Sign up to start verifying someone." : "Sign in to continue."}
              </p>

              {emailNotConfirmed && (
                <div style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.3)', padding: 14, marginBottom: 20, borderRadius: 12 }}>
                  <p className="font-body text-[13px] leading-relaxed mb-2" style={{ color: '#FDE68A' }}>
                    Your email hasn't been confirmed yet. Check your inbox for the confirmation link.
                  </p>
                  <button onClick={handleResendConfirmation} disabled={resending}
                    className="font-body text-[13px] font-bold" style={{ background: 'none', border: 'none', color: '#A855F7', cursor: 'pointer', padding: 0 }}>
                    {resending ? "Sending..." : "Resend confirmation email"}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === "signup" && (
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      style={inputStyle}
                      placeholder="e.g. Nomsa Dlamini"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); if (nameError) validateFullName(e.target.value); }}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                      required
                    />
                    {nameError && <p className="font-body text-[12px] mt-1" style={{ color: '#EF4444' }}>{nameError}</p>}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input style={inputStyle} type="email" placeholder="you@example.com"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                    required />
                </div>

                <div>
                  <label style={labelStyle}>Password *</label>
                  <input style={inputStyle} type="password" placeholder="At least 6 characters"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                    onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                    minLength={6} required />
                </div>

                {mode === "signup" && (
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <input style={inputStyle} type="password" placeholder="Re-enter your password"
                      value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                      onFocus={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                      minLength={6} required />
                  </div>
                )}

                {mode === "signup" && (
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)}
                      style={{ marginTop: 3, accentColor: '#7C3AED' }} />
                    <span className="font-body text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      I agree to the{" "}
                      <Link to="/terms" target="_blank" style={{ color: '#A855F7', textDecoration: 'underline' }}>Terms</Link>{" "}and{" "}
                      <Link to="/privacy" target="_blank" style={{ color: '#A855F7', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "signup" && !consent)}
                  className="w-full font-body font-bold text-[15px] transition-all"
                  style={{
                    background: '#7C3AED', color: 'white', padding: 16, border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading || (mode === "signup" && !consent) ? 0.5 : 1,
                    borderRadius: 50, boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
                  }}
                >
                  {loading ? "Please wait..." : mode === "signup" ? "Create my free account" : "Sign In"}
                </button>
              </form>

              {mode === "signup" && (
                <p className="font-body text-[12px] mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  We ask for your full name to keep your account secure. Your details never appear in any report.
                </p>
              )}

              <div className="mt-5 text-center flex flex-col gap-2">
                <button
                  onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setEmailNotConfirmed(false); }}
                  className="font-body text-sm" style={{ background: 'none', border: 'none', color: '#A855F7', cursor: 'pointer' }}
                >
                  {mode === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up free"}
                </button>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!email.trim()) { toast({ title: "Enter your email", description: "Please enter your email address first.", variant: "destructive" }); return; }
                      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
                      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
                      else toast({ title: "Check your email", description: "Password reset link sent." });
                    }}
                    className="font-body text-[13px]" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
                  >
               Forgot your password?
                  </button>
                )}
              </div>

              {/* Operated by notice */}
              <p className="font-body text-center mt-5" style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                RedFlaq is operated by Setup A Startup (Pty) Ltd
              </p>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="font-body text-[13px]" style={{ color: 'rgba(255,255,255,0.4)' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
