import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState("");
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && !validateFullName(fullName)) return;
    setLoading(true);

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
        toast({ title: "Check your email", description: "We sent you a confirmation link. Please verify your email to continue." });
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (error) {
        toast({ title: "Sign in failed", description: error.message, variant: "destructive" });
      } else {
        navigate("/#search");
      }
    }

    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'white', border: '1.5px solid #D6D3CD', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#2D2235',
    width: '100%', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453',
    display: 'block', marginBottom: 8,
  };

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        {/* Logo */}
        <Link to="/" className="flex items-center mb-8 justify-center" style={{ gap: 0 }}>
          <div style={{ width: 28, height: 28, background: '#7C3AED', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: '#FFFFFF', lineHeight: 1 }}>R</span>
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#2D2235', marginLeft: 1 }}>EDFLAQ</span>
        </Link>

        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: 40 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: '#2D2235', marginBottom: 8 }}>
            {mode === "signup" ? "Create your free account" : "Welcome back"}
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginBottom: 32 }}>
            {mode === "signup" ? "Sign up to start verifying someone." : "Sign in to continue."}
          </p>

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

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', background: '#7C3AED', color: 'white', padding: 16,
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
              }}
              className="hover:!bg-[#6D28D9] transition-colors"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Sign Up Free" : "Sign In"}
            </button>
          </form>

          {mode === "signup" && (
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF', marginTop: 16, lineHeight: 1.5 }}>
              We ask for your full name so we can keep your account secure and understand how people use RedFlaq. Your details are kept private and will never appear in any report.
            </p>
          )}

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <button
              onClick={() => setMode(mode === "signup" ? "signin" : "signup")}
              style={{ background: 'none', border: 'none', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#7C3AED', cursor: 'pointer' }}
            >
              {mode === "signup" ? "Already have an account? Sign in" : "Don't have an account? Sign up free"}
            </button>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
