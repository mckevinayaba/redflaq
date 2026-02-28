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
  // Welcome modal state
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fromCTA = sessionStorage.getItem("fromCTA");
    if (fromCTA) {
      setShowCTABanner(true);
      // Don't remove yet — keep for post-login redirect chain
    }
  }, []);

  const validateFullName = (name: string) => {
    const trimmed = name.trim();
    const words = trimmed.split(/\s+/).filter(Boolean);
    if (words.length < 2) {
      setNameError("Please enter your full name (first name and surname).");
      return false;
    }
    setNameError("");
    return true;
  };

  const handleResendConfirmation = async () => {
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email: email.trim() });
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox for the confirmation link." });
    }
    setResending(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !validateFullName(fullName)) return;
    if (mode === "signup" && password !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure both passwords match.", variant: "destructive" });
      return;
    }
    if (mode === "signup" && !consent) {
      toast({ title: "Please agree", description: "You must agree to the Terms and Privacy Policy.", variant: "destructive" });
      return;
    }
    setLoading(true);
    setEmailNotConfirmed(false);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: { full_name: fullName.trim() },
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) {
        toast({ title: "Sign up failed", description: error.message, variant: "destructive" });
      } else {
        // Record referral if present
        const referrerId = sessionStorage.getItem("referrer_id");
        if (referrerId) {
          await supabase.from("referrals").insert({
            referrer_user_id: referrerId,
            referred_email: email.trim(),
            status: "signed_up",
          });
          sessionStorage.removeItem("referrer_id");
        }
        // Send welcome email (non-blocking)
        supabase.functions.invoke('send-welcome-email', {
          body: { email: email.trim(), full_name: fullName.trim() },
        }).catch(() => {});
        setSignupSuccess(true);
        // Redirect to verify-email page after signup
        navigate("/verify-email");
        return;
      }
    } else {
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        if (error.message.toLowerCase().includes("email not confirmed")) {
          setEmailNotConfirmed(true);
        } else {
          toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
        }
      } else {
        // Post-login auth guard: check email verification & credits
        const freshUser = signInData.user;
        if (!freshUser?.email_confirmed_at) {
          navigate("/verify-email");
        } else {
          // Check if user has active credits
          const userEmail = freshUser.email || "";
          const { data: purchases } = await supabase
            .from("purchases")
            .select("credits_remaining")
            .eq("email", userEmail)
            .eq("status", "completed")
            .gt("credits_remaining", 0)
            .limit(1);
          const { data: manualPayments } = await supabase
            .from("manual_payments")
            .select("search_credits, credits_used")
            .eq("email", userEmail)
            .eq("status", "verified")
            .limit(1);
          const hasCredits =
            (purchases && purchases.length > 0) ||
            (manualPayments && manualPayments.some(p => (p.search_credits || 0) - (p.credits_used || 0) > 0));

          if (!hasCredits && sessionStorage.getItem("fromCTA")) {
            navigate("/pricing");
          } else if (!hasCredits) {
            // First time user — show welcome
            const firstName = freshUser.user_metadata?.full_name?.split(" ")[0] || "";
            if (firstName) {
              setWelcomeName(firstName);
              setShowWelcome(true);
            } else {
              navigate("/dashboard/new-check");
            }
          } else {
            // Has credits — check pending search
            const pending = sessionStorage.getItem("pendingSearch");
            if (pending) {
              sessionStorage.removeItem("pendingSearch");
              sessionStorage.removeItem("fromCTA");
            }
            navigate("/dashboard/new-check");
          }
        }
      }
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'white', border: '1.5px solid #D6D3CD', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#2D2235',
    width: '100%', outline: 'none', borderRadius: 4,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453',
    display: 'block', marginBottom: 8,
  };

  // Welcome modal overlay
  if (showWelcome) {
    return (
      <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: '48px 40px' }}>
            <div style={{ width: 64, height: 64, background: '#F3F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Sparkles size={32} style={{ color: '#7C3AED' }} />
            </div>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 8 }}>
              Welcome to RedFlaq, {welcomeName}
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6, marginBottom: 32 }}>
              Let's run your first safety check. It takes less than 60 seconds and costs R99.
            </p>
            <button
              onClick={() => navigate("/dashboard/new-check")}
              style={{
                width: '100%', background: '#7C3AED', color: 'white', padding: '16px 24px',
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                borderRadius: 4,
              }}
              className="hover:!bg-[#6D28D9] transition-colors"
            >
              <Shield size={18} />
              Run a safety check now
            </button>
            <button
              onClick={() => navigate("/dashboard")}
              style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', cursor: 'pointer', marginTop: 16 }}
            >
              Go to Dashboard instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center mb-8 justify-center">
          <img src={redflaqLogo} alt="RedFlaq" style={{ height: 56, width: 'auto', display: 'block' }} />
        </Link>

        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: 40 }}>
          {showCTABanner && !signupSuccess && (
            <div style={{
              background: '#FAF5FF', border: '1px solid #EDE9FE', padding: '12px 16px',
              marginBottom: 24, borderRadius: 4, fontFamily: "'Syne', sans-serif",
              fontSize: 14, color: '#7C3AED', fontWeight: 600, textAlign: 'center',
            }}>
              🧪 Create a free RedFlaq account to try the safety check experience in demo mode. Real checks with PayFast are coming soon.
            </div>
          )}
          {signupSuccess ? (
            <div className="text-center" style={{ padding: '20px 0' }}>
              <div style={{ width: 64, height: 64, background: '#F3F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                <Mail size={32} style={{ color: '#7C3AED' }} />
              </div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 8 }}>
                Check your inbox
              </h1>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6, marginBottom: 24 }}>
                We sent a confirmation link to <strong style={{ color: '#2D2235' }}>{email}</strong>. Click the link to activate your account, then come back and sign in.
              </p>
              <button
                onClick={handleResendConfirmation}
                disabled={resending}
                style={{
                  background: 'none', border: '1.5px solid #D6D3CD', padding: '12px 24px',
                  fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
                  color: '#7C3AED', cursor: resending ? 'not-allowed' : 'pointer', width: '100%',
                  opacity: resending ? 0.7 : 1, borderRadius: 4,
                }}
              >
                {resending ? "Sending..." : "Resend confirmation email"}
              </button>
              <button
                onClick={() => { setSignupSuccess(false); setMode("signin"); }}
                style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', cursor: 'pointer', marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={14} /> Back to sign in
              </button>
            </div>
          ) : (
            <>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#2D2235', marginBottom: 8 }}>
                {mode === "signup" ? "Create your free account" : "Welcome back"}
              </h1>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginBottom: 32 }}>
                {mode === "signup" ? "Sign up to start verifying someone." : "Sign in to continue."}
              </p>

              {emailNotConfirmed && (
                <div style={{ background: '#FFF7ED', border: '1px solid #FDBA74', padding: 16, marginBottom: 20, borderRadius: 4 }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9A3412', marginBottom: 8, lineHeight: 1.5 }}>
                    Your email hasn't been confirmed yet. Check your inbox for the confirmation link.
                  </p>
                  <button
                    onClick={handleResendConfirmation}
                    disabled={resending}
                    style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#7C3AED', cursor: 'pointer', padding: 0 }}
                  >
                    {resending ? "Sending..." : "Resend confirmation email"}
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "signup" && (
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input
                      style={inputStyle}
                      placeholder="e.g. Nomsa Dlamini"
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); if (nameError) validateFullName(e.target.value); }}
                      required
                    />
                    {nameError && (
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#DC2626', marginTop: 4 }}>{nameError}</p>
                    )}
                  </div>
                )}

                <div>
                  <label style={labelStyle}>Email Address *</label>
                  <input
                    style={inputStyle}
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <label style={labelStyle}>Password *</label>
                  <input
                    style={inputStyle}
                    type="password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                {mode === "signup" && (
                  <div>
                    <label style={labelStyle}>Confirm Password *</label>
                    <input
                      style={inputStyle}
                      type="password"
                      placeholder="Re-enter your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={6}
                      required
                    />
                  </div>
                )}

                {mode === "signup" && (
                  <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      style={{ marginTop: 3, accentColor: '#7C3AED' }}
                    />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', lineHeight: 1.5 }}>
                      I agree to the{" "}
                      <Link to="/terms" target="_blank" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Terms</Link>{" "}and{" "}
                      <Link to="/privacy" target="_blank" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Privacy Policy</Link>.
                    </span>
                  </label>
                )}

                <button
                  type="submit"
                  disabled={loading || (mode === "signup" && !consent)}
                  style={{
                    width: '100%', background: '#7C3AED', color: 'white', padding: 16,
                    fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading || (mode === "signup" && !consent) ? 0.5 : 1, borderRadius: 4,
                  }}
                  className="hover:!bg-[#6D28D9] transition-colors"
                >
                  {loading ? "Please wait..." : mode === "signup" ? "Create my free account" : "Sign In"}
                </button>
              </form>

              {mode === "signup" && (
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF', marginTop: 16, lineHeight: 1.5 }}>
                  We ask for your full name to keep your account secure. Your details never appear in any report.
                </p>
              )}

              <div style={{ marginTop: 24, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => { setMode(mode === "signup" ? "signin" : "signup"); setEmailNotConfirmed(false); }}
                  style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED', cursor: 'pointer' }}
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
                    style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', cursor: 'pointer' }}
                  >
                    Forgot your password?
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
