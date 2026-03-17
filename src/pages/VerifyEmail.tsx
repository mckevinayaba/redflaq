import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight, Loader2 } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/signup");
        return;
      }
      setEmail(user.email || "");
      if (user.email_confirmed_at) {
        const fromCTA = sessionStorage.getItem("fromCTA");
        if (fromCTA) {
          sessionStorage.removeItem("fromCTA");
          navigate("/pricing");
        } else {
          navigate("/dashboard");
        }
      }
    });
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(c => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    if (!email || cooldown > 0) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent ✓", description: "Check your inbox for the verification link." });
      setCooldown(60);
    }
    setResending(false);
  };

  const handleCheckStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email_confirmed_at) {
      toast({ title: "Email verified!" });
      const fromCTA = sessionStorage.getItem("fromCTA");
      if (fromCTA) {
        sessionStorage.removeItem("fromCTA");
        navigate("/pricing");
      } else {
        navigate("/dashboard");
      }
    } else {
      toast({ title: "Not verified yet", description: "Please check your inbox and click the verification link.", variant: "destructive" });
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Link to="/" className="flex items-center mb-8 justify-center">
          <img src={redflaqLogo} alt="RedFlaq" style={{ height: 56, width: 'auto', display: 'block' }} />
        </Link>

        <div style={{
          background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 24, padding: '48px 32px', backdropFilter: 'blur(16px)', textAlign: 'center',
        }}>
          <div style={{
            width: 80, height: 80, background: 'rgba(124,58,237,0.15)', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px',
            animation: 'verifyPulse 2s ease-in-out infinite',
          }}>
            <Mail size={40} style={{ color: '#A855F7' }} />
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: '#FFFFFF', marginBottom: 12 }}>
            Check your inbox
          </h1>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: 8 }}>
            We sent a confirmation email to{" "}
            <strong style={{ color: '#FFFFFF' }}>{email}</strong>.
            Click the link in the email to activate your account.
          </p>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, marginBottom: 32 }}>
            Didn't get it? Check your <strong style={{ color: 'rgba(255,255,255,0.55)' }}>spam</strong> or <strong style={{ color: 'rgba(255,255,255,0.55)' }}>junk</strong> folder. Still nothing?
          </p>

          <button
            onClick={handleCheckStatus}
            style={{
              width: '100%', background: '#7C3AED', color: 'white', padding: 16,
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer', borderRadius: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              boxShadow: '0 4px 20px rgba(124,58,237,0.35)', minHeight: 52,
            }}
          >
            Already verified? Continue <ArrowRight size={16} />
          </button>

          <button
            onClick={handleResend}
            disabled={resending || cooldown > 0}
            style={{
              background: 'transparent', border: '1.5px solid rgba(124,58,237,0.3)',
              padding: '14px 24px',
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
              color: '#A855F7', cursor: (resending || cooldown > 0) ? 'not-allowed' : 'pointer',
              width: '100%', marginTop: 12, opacity: (resending || cooldown > 0) ? 0.7 : 1, borderRadius: 50,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {resending ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend confirmation email"}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link to="/signup?mode=signin" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>← Back to sign in</Link>
        </div>
      </div>
      <style>{`@keyframes verifyPulse { 0%, 100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.05); opacity: 0.85; } }`}</style>
    </div>
  );
}
