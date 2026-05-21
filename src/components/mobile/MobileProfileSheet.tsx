import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ROW: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "16px 4px",
  borderBottom: "1px solid rgba(0,0,0,0.06)",
  textDecoration: "none",
  color: "#0a0a0a",
  fontFamily: "'Syne', sans-serif",
  fontWeight: 600,
  fontSize: 16,
  minHeight: 56,
  background: "none",
  border: "none",
  borderBottomStyle: "solid",
  borderBottomWidth: 1,
  borderBottomColor: "rgba(0,0,0,0.06)",
  cursor: "pointer",
  width: "100%",
  textAlign: "left",
};

const CHEV = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M9 6L15 12L9 18" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function MobileProfileSheet({ open, onClose }: Props) {
  const { user } = useAuth();
  const { credits } = useCredits(user?.email, user?.id);
  const navigate = useNavigate();

  if (!open) return null;

  const name = (user?.user_metadata as any)?.full_name || user?.email?.split("@")[0] || "You";
  const email = user?.email || "";

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    onClose();
    navigate("/");
  };

  const go = (path: string) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#F5F0EB",
          width: "100%",
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          padding: "12px 20px 32px",
          paddingBottom: "calc(32px + env(safe-area-inset-bottom, 0px))",
          maxHeight: "85vh",
          overflowY: "auto",
        }}
      >
        {/* Grabber */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <div style={{ width: 40, height: 4, borderRadius: 999, background: "rgba(0,0,0,0.15)" }} />
        </div>

        {/* User identity */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: "50%",
              background: "#7C3AED",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 18,
            }}
          >
            {name.slice(0, 2).toUpperCase()}
          </div>
          <div style={{ minWidth: 0, flex: 1 }}>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "#0a0a0a", lineHeight: 1.1 }}>
              {name}
            </p>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: "#6b6b70", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {email}
            </p>
          </div>
        </div>

        {/* Credits chip */}
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.06)",
            borderRadius: 14,
            padding: "14px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <div>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#7C3AED", letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 700 }}>
              Check balance
            </p>
            <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#0a0a0a", lineHeight: 1, marginTop: 4 }}>
              {credits ?? "—"} <span style={{ fontSize: 14, color: "#6b6b70" }}>check{credits === 1 ? "" : "s"}</span>
            </p>
          </div>
          <button
            onClick={() => go("/dashboard/new-check")}
            style={{
              background: "#7C3AED",
              color: "#fff",
              border: "none",
              borderRadius: 999,
              padding: "10px 16px",
              minHeight: 40,
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 700,
              fontSize: 11,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            Buy
          </button>
        </div>

        {/* Links */}
        <div>
          <button style={ROW} onClick={() => go("/dashboard/account")}>Account & profile {CHEV}</button>
          <button style={ROW} onClick={() => go("/dashboard/reports")}>My reports {CHEV}</button>
          <button style={ROW} onClick={() => go("/dashboard/journal")}>Safety Journal {CHEV}</button>
          <button style={ROW} onClick={() => go("/dashboard/help")}>Help & support {CHEV}</button>
          <button style={ROW} onClick={() => go("/pricing")}>Pricing {CHEV}</button>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            marginTop: 20,
            width: "100%",
            background: "transparent",
            color: "#C0392B",
            border: "2px solid rgba(192,57,43,0.3)",
            borderRadius: 999,
            padding: "14px",
            minHeight: 52,
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
