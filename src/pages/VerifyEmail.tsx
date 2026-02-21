import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Mail, ArrowRight } from "lucide-react";

export default function VerifyEmail() {
  const [resending, setResending] = useState(false);
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
        // Already verified — move forward
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

  const handleResend = async () => {
    if (!email) return;
    setResending(true);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) {
      toast({ title: "Could not resend", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Email sent", description: "Check your inbox for the verification link." });
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
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Link to="/" className="flex items-center mb-8 justify-center" style={{ gap: 0 }}>
          <div style={{ width: 28, height: 28, background: '#7C3AED', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: '#FFFFFF', lineHeight: 1 }}>R</span>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#2D2235', marginLeft: 1 }}>EDFLAQ</span>
        </Link>

        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: 40, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, background: '#F3F0FF', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Mail size={32} style={{ color: '#7C3AED' }} />
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 8 }}>
            Check your inbox
          </h1>

          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6, marginBottom: 32 }}>
            We've sent a verification link to{" "}
            <strong style={{ color: '#2D2235' }}>{email}</strong>.
            Click the link to activate your account.
          </p>

          <button
            onClick={handleCheckStatus}
            style={{
              width: '100%', background: '#7C3AED', color: 'white', padding: 16,
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              border: 'none', cursor: 'pointer', borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
            className="hover:!bg-[#6D28D9] transition-colors"
          >
            Already verified? Continue <ArrowRight size={16} />
          </button>

          <button
            onClick={handleResend}
            disabled={resending}
            style={{
              background: 'none', border: '1.5px solid #D6D3CD', padding: '12px 24px',
              fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
              color: '#7C3AED', cursor: resending ? 'not-allowed' : 'pointer',
              width: '100%', marginTop: 12, opacity: resending ? 0.7 : 1, borderRadius: 4,
            }}
          >
            {resending ? "Sending..." : "Resend verification email"}
          </button>
        </div>

        <div className="text-center mt-6">
          <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
