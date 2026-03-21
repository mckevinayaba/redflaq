import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

function getPasswordStrength(pw: string) {
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

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return;
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/signup?mode=signin");
    }
    setLoading(false);
  };

  return (
    <div style={{
      background: 'linear-gradient(145deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
    }}>
      <div style={{ maxWidth: 480, width: '100%' }}>
        <Link to="/" className="flex items-center mb-8 justify-center" style={{ gap: 10 }}>
          <img src={redflaqLogo} alt="RedFlaq" style={{ height: 28 }} />
        </Link>

        <div style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: 20,
          padding: '40px 32px',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}>
          <div className="flex items-center justify-center mb-6">
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: 'rgba(124,58,237,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Lock style={{ width: 24, height: 24, color: '#A78BFA' }} />
            </div>
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 28,
            color: '#FFFFFF',
            marginBottom: 8,
            textAlign: 'center',
          }}>
            Set new password
          </h1>
          <p style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: 'rgba(255,255,255,0.5)',
            marginBottom: 32,
            textAlign: 'center',
            lineHeight: 1.6,
          }}>
            {ready
              ? "Choose a strong password you don't use anywhere else."
              : "This link may have expired. Request a new one from your account settings."}
          </p>

          {ready && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  display: 'block',
                  marginBottom: 8,
                }}>
                  New Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1.5px solid rgba(255,255,255,0.12)',
                      padding: '14px 48px 14px 16px',
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 15,
                      color: '#FFFFFF',
                      width: '100%',
                      outline: 'none',
                      borderRadius: 10,
                      transition: 'border-color 0.2s',
                    }}
                    type={showPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    required
                    onFocus={(e) => e.target.style.borderColor = 'rgba(124,58,237,0.5)'}
                    onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Password strength meter */}
                {password && (
                  <div style={{ marginTop: 10 }}>
                    <div style={{
                      height: 4, borderRadius: 2,
                      background: 'rgba(255,255,255,0.08)',
                      overflow: 'hidden',
                    }}>
                      <div style={{
                        height: '100%', width: `${strength.percent}%`,
                        background: strength.color,
                        borderRadius: 2,
                        transition: 'width 0.3s, background 0.3s',
                      }} />
                    </div>
                    <p style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 12,
                      color: strength.color,
                      marginTop: 4,
                    }}>
                      {strength.label}
                    </p>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading || password.length < 8}
                style={{
                  width: '100%',
                  background: password.length >= 8
                    ? 'linear-gradient(135deg, #7C3AED, #6D28D9)'
                    : 'rgba(124,58,237,0.3)',
                  color: 'white',
                  padding: 16,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 15,
                  fontWeight: 700,
                  border: 'none',
                  borderRadius: 50,
                  cursor: loading || password.length < 8 ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                  transition: 'all 0.2s',
                  boxShadow: password.length >= 8 ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
                }}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/signup?mode=signin" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            transition: 'color 0.2s',
          }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
