import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useDailyStreak } from "@/hooks/useDailyStreak";
import MobileTopBar from "../MobileTopBar";
import { ACCENT, CREAM, CREAM_INK, CREAM_MUTED, mono, serif, syne, primaryButton, ghostButton } from "./mobileTokens";

const RISK: Record<string, { label: string; color: string }> = {
  RED: { label: "High Risk", color: "#C0392B" },
  ORANGE: { label: "Moderate", color: "#E67E22" },
  YELLOW: { label: "Low Risk", color: "#F1C40F" },
  GREEN: { label: "Clear", color: "#27AE60" },
};

export default function MobileHome() {
  const { user, loading: authLoading } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [latest, setLatest] = useState<any>(null);
  const streak = useDailyStreak();

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const [{ data: profile }, { data: searches }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", user.id).maybeSingle(),
        supabase.from("searches").select("*").eq("user_id", user.id).order("searched_at", { ascending: false }).limit(1),
      ]);
      const name = profile?.full_name || (user.user_metadata as any)?.full_name || user.email?.split("@")[0] || "";
      setFirstName(name.split(" ")[0] || "");
      setLatest(searches?.[0] || null);
    })();
  }, [user, authLoading]);

  const risk = latest?.risk_level ? RISK[latest.risk_level] : null;
  const lastPaid = latest ? new Date(latest.searched_at) : null;
  const daysSince = lastPaid ? Math.floor((Date.now() - lastPaid.getTime()) / 86400000) : null;
  const verified = daysSince !== null && daysSince <= 90;

  return (
    <div style={{ minHeight: "100dvh", background: CREAM, color: CREAM_INK }}>
      <MobileTopBar cream />

      <div style={{ padding: "24px 24px 32px", display: "flex", flexDirection: "column", gap: 24 }}>
        {/* Eyebrow */}
        <span
          style={{
            ...mono,
            fontSize: 10,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: ACCENT,
            fontWeight: 700,
          }}
        >
          South Africa's Safety Platform
        </span>

        {/* Headline — matches reference screenshot */}
        <div>
          <h1
            style={{
              ...serif,
              fontSize: 38,
              lineHeight: 1.05,
              color: CREAM_INK,
              letterSpacing: "-0.01em",
              fontWeight: 400,
              margin: 0,
            }}
          >
            {user && firstName ? (
              <>Hey, <span style={{ color: ACCENT, fontStyle: "italic" }}>{firstName}</span>.</>
            ) : (
              <>South Africa knows about Gender Based Violence &amp; Femicide (GBVF).</>
            )}
          </h1>
          <p
            style={{
              ...serif,
              fontStyle: "italic",
              fontSize: 28,
              lineHeight: 1.1,
              color: ACCENT,
              marginTop: 12,
            }}
          >
            {user
              ? "The question is what you'll do today."
              : "The question is why you still aren't acting on what you know."}
          </p>
        </div>

        {/* Body copy */}
        <p style={{ ...syne, color: "#3a3a3f", fontSize: 16, lineHeight: 1.6 }}>
          Behavioral safety for people who refuse to hand over their lives unverified. Read daily. See the pattern.{" "}
          <strong style={{ color: CREAM_INK, fontWeight: 700 }}>Act before it becomes evidence.</strong>
        </p>

        {/* Purple pull-quote */}
        <div style={{ borderLeft: `3px solid ${ACCENT}`, paddingLeft: 16, paddingTop: 2, paddingBottom: 2 }}>
          <p style={{ ...syne, color: ACCENT, fontWeight: 700, fontSize: 16, lineHeight: 1.4 }}>
            Before you trust, RedFlaq first.
          </p>
        </div>

        {/* CTAs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 4 }}>
          {user ? (
            <Link to="/dashboard/new-check" style={primaryButton}>
              Run a Safety Check
            </Link>
          ) : (
            <Link to="/signup" style={primaryButton}>
              Create Free Safety Base
            </Link>
          )}
          <Link to="/signals" style={ghostButton}>
            Read Today's Signal
          </Link>
        </div>

        <p
          style={{
            ...syne,
            fontSize: 12,
            color: CREAM_MUTED,
            textAlign: "left",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          Free account. No credit card. Pay only when you run a check (from R99).
        </p>

        {/* Signed-in extras: verification + last check */}
        {user && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
            <div
              style={{
                background: "#fff",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: 16,
                padding: 18,
                borderLeft: `4px solid ${verified ? ACCENT : "rgba(0,0,0,0.15)"}`,
              }}
            >
              <span
                style={{
                  ...mono,
                  fontSize: 10,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: verified ? ACCENT : CREAM_MUTED,
                  fontWeight: 700,
                }}
              >
                Verification
              </span>
              <p style={{ ...serif, fontSize: 26, color: CREAM_INK, marginTop: 4, lineHeight: 1.1 }}>
                {verified ? `Active · ${90 - (daysSince as number)}d left` : "Not yet verified"}
              </p>
              <p style={{ ...syne, color: CREAM_MUTED, fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                {verified
                  ? "Your verification stays active. Renew anytime."
                  : "Run your first check to unlock a 90-day verification window."}
              </p>
            </div>

            {latest && (
              <Link
                to="/dashboard/reports"
                style={{
                  background: "#fff",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 16,
                  padding: 18,
                  textDecoration: "none",
                  color: "inherit",
                  display: "block",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                  <span style={{ ...mono, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>
                    Last check
                  </span>
                  {risk && (
                    <span
                      style={{
                        ...mono,
                        fontSize: 10,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: risk.color,
                        padding: "4px 10px",
                        borderRadius: 999,
                        border: `1px solid ${risk.color}66`,
                        background: `${risk.color}1a`,
                      }}
                    >
                      {risk.label}
                    </span>
                  )}
                </div>
                <p style={{ ...serif, fontSize: 22, color: CREAM_INK, lineHeight: 1.2, marginTop: 8 }}>
                  {latest.search_name || "Unnamed check"}
                </p>
                <p style={{ ...syne, color: CREAM_MUTED, fontSize: 13, marginTop: 6 }}>
                  {new Date(latest.searched_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                  {" · "}
                  {latest.matches_found || 0} record{latest.matches_found === 1 ? "" : "s"}
                </p>
              </Link>
            )}
          </div>
        )}

        {/* spacer so dock + FAB don't cover content */}
        <div style={{ height: 8 }} />
      </div>

      {/* Chat FAB — sits above the dock */}
      <a
        href="https://wa.me/27000000000"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with RedFlaq on WhatsApp"
        style={{
          position: "fixed",
          right: 20,
          bottom: `calc(88px + env(safe-area-inset-bottom, 0px))`,
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: ACCENT,
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 12px 28px -8px rgba(124,58,237,0.6)",
          zIndex: 90,
          textDecoration: "none",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 12C21 16.4183 16.9706 20 12 20C10.5 20 9.1 19.7 7.9 19.2L3 20L4.2 16.3C3.4 15 3 13.5 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </a>
    </div>
  );
}
