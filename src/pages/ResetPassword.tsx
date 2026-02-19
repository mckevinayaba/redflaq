import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setReady(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return;
    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Password updated", description: "You can now sign in with your new password." });
      navigate("/signup");
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: 'white', border: '1.5px solid #D6D3CD', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#2D2235',
    width: '100%', outline: 'none',
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

        <div style={{ background: 'white', border: '1.5px solid #D6D3CD', padding: 40 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', marginBottom: 8 }}>
            Set new password
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', marginBottom: 32 }}>
            {ready ? "Enter your new password below." : "This link may have expired. Request a new one from your account settings."}
          </p>

          {ready && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453', display: 'block', marginBottom: 8 }}>
                  New Password *
                </label>
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
                disabled={loading || password.length < 6}
                style={{
                  width: '100%', background: '#7C3AED', color: 'white', padding: 16,
                  fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Updating…" : "Update Password"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <Link to="/signup" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C' }}>← Back to sign in</Link>
        </div>
      </div>
    </div>
  );
}
