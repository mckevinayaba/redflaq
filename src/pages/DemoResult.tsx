import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Shield, Home, Bell } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

export default function DemoResult() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notified, setNotified] = useState(false);

  const handleNotify = async () => {
    if (!user?.id) return;
    setNotifyLoading(true);
    try {
      await supabase.from("profiles").update({ status: "wants_notify_launch" }).eq("user_id", user.id);
      setNotified(true);
    } catch {
      // silent fail
    }
    setNotifyLoading(false);
  };

  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "100px 24px 60px" }}>
        <div style={{ background: "white", border: "1.5px solid #D6D3CD", padding: "48px 40px", textAlign: "center" }}>
          {/* Demo badge */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "#FFF7ED", border: "1.5px solid #FDBA74", padding: "8px 20px",
            marginBottom: 24, borderRadius: 4,
          }}>
            <span style={{ fontSize: 16 }}>🧪</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#9A3412" }}>
              DEMO ONLY
            </span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
            Example RedFlaq Report
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>
            No real records were checked. This is a preview of what a RedFlaq safety report looks like.
          </p>

          {/* Fake report preview */}
          <div style={{ background: "#F7F4F0", border: "1.5px solid #D6D3CD", padding: 32, textAlign: "left", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div style={{ width: 48, height: 48, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={24} style={{ color: "#22C55E" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#22C55E", fontWeight: 700 }}>RISK LEVEL</div>
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#22C55E" }}>GREEN — No public records found</div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #D6D3CD", paddingTop: 16 }}>
              {["SAPS Wanted List", "Court Judgments (SAFLII)", "Government Gazette", "Protection Orders"].map((source) => (
                <div key={source} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #EDE9E3" }}>
                  <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#4B4453" }}>{source}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#22C55E", fontWeight: 600 }}>✓ Clear</span>
                </div>
              ))}
            </div>

            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", marginTop: 16, textAlign: "center" }}>
              ⚠️ This is a demo report. No real data was searched.
            </p>
          </div>

          {/* Real checks coming soon */}
          <div style={{ background: "#FAF5FF", border: "1.5px solid #EDE9FE", padding: 24, marginBottom: 24 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#7C3AED", fontWeight: 700, marginBottom: 8 }}>
              Real public-record safety checks are coming soon!
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#78716C", lineHeight: 1.6 }}>
              Once PayFast is integrated, you'll be able to run real checks against SAPS, court records, and the Government Gazette for only R99.
            </p>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button
              onClick={() => navigate("/")}
              style={{
                width: "100%", background: "#7C3AED", color: "white", padding: 16,
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
            >
              <Home size={18} /> Back to Home
            </button>

            {!notified ? (
              <button
                onClick={handleNotify}
                disabled={notifyLoading}
                style={{
                  width: "100%", background: "transparent", color: "#7C3AED", padding: 16,
                  fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                  border: "1.5px solid #7C3AED", cursor: notifyLoading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  opacity: notifyLoading ? 0.6 : 1,
                }}
              >
                <Bell size={18} /> {notifyLoading ? "Saving..." : "Notify me when real checks go live"}
              </button>
            ) : (
              <div style={{ background: "#F0FDF4", border: "1.5px solid #86EFAC", padding: 14, textAlign: "center" }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#166534", fontWeight: 600 }}>
                  ✅ You'll be notified when real checks are live!
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
}
