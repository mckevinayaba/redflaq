import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import MobileProfileSheet from "./MobileProfileSheet";

interface Props {
  /** When true, use cream surface styling (Home). Otherwise dark glass. */
  cream?: boolean;
}

/**
 * Slim 56px top bar.
 * Left:  RedFlaq wordmark (always links home)
 * Right: credits chip + circular profile avatar (opens profile sheet).
 * No "Verify" pill — Verify lives in the bottom dock only.
 */
export default function MobileTopBar({ cream }: Props) {
  const { user } = useAuth();
  const { credits } = useCredits(user?.email, user?.id);
  const [openProfile, setOpenProfile] = useState(false);

  const initials = (() => {
    const name = (user?.user_metadata as any)?.full_name || user?.email || "";
    const parts = String(name).split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] || "") + (parts[1]?.[0] || "")).toUpperCase() || (user?.email?.[0]?.toUpperCase() || "?");
  })();

  const bg = cream ? "rgba(245,240,235,0.92)" : "rgba(8,8,15,0.92)";
  const border = cream ? "1px solid rgba(0,0,0,0.06)" : "1px solid rgba(255,255,255,0.06)";
  const ink = cream ? "#0a0a0a" : "#ffffff";
  const chipBg = cream ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.06)";

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          height: 56,
          paddingTop: "env(safe-area-inset-top, 0px)",
          background: bg,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px",
        }}
      >
        <Link
          to="/"
          aria-label="RedFlaq home"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: ink,
            textDecoration: "none",
            letterSpacing: "-0.01em",
            fontWeight: 700,
          }}
        >
          Red<span style={{ color: "#7C3AED" }}>Flaq</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {user && (
            <div
              style={{
                background: chipBg,
                border,
                borderRadius: 999,
                padding: "5px 10px",
                display: "flex",
                alignItems: "center",
                gap: 6,
                minHeight: 28,
              }}
              aria-label={`${credits ?? 0} checks remaining`}
            >
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 700,
                  color: ink,
                  lineHeight: 1,
                }}
              >
                {credits ?? "—"}
              </span>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: cream ? "#6b6b70" : "#8b8b91",
                  lineHeight: 1,
                }}
              >
                Check{credits === 1 ? "" : "s"}
              </span>
            </div>
          )}

          {user ? (
            <button
              onClick={() => setOpenProfile(true)}
              aria-label="Open profile"
              style={{
                width: 36,
                height: 36,
                minHeight: 36,
                borderRadius: "50%",
                border: cream ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
                background: "#7C3AED",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.04em",
              }}
            >
              {initials}
            </button>
          ) : (
            <Link
              to="/signup"
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11,
                fontWeight: 700,
                color: "#fff",
                background: "#7C3AED",
                borderRadius: 999,
                padding: "8px 14px",
                textDecoration: "none",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                minHeight: 36,
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <MobileProfileSheet open={openProfile} onClose={() => setOpenProfile(false)} />
    </>
  );
}
