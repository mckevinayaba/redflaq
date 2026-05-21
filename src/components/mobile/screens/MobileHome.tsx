import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCredits } from "@/hooks/useCredits";
import MobileTopBar from "../MobileTopBar";
import MobileSignedOut from "./MobileSignedOut";
import {
  screen, page, card, h1, label, serif, syne, mono, inter,
  MUTED, ACCENT, TEXT, primaryButton, ghostButton, sectionTitle,
} from "./mobileTokens";

const DAILY_PROMPTS = [
  "You already know the answer. You just don't like it.",
  "Awareness didn't save 9 women yesterday. Action might save 1 today.",
  "Your instincts are not paranoia. They are data.",
  "Before You Trust, RedFlaq First.",
  "Document today. Decide tomorrow. But start.",
];

const RISK: Record<string, { label: string; color: string }> = {
  RED: { label: "High Risk", color: "#C0392B" },
  ORANGE: { label: "Moderate", color: "#E67E22" },
  YELLOW: { label: "Low Risk", color: "#F1C40F" },
  GREEN: { label: "Clear", color: "#27AE60" },
};

export default function MobileHome() {
  const { user, loading: authLoading } = useAuth();
  const { credits } = useCredits(user?.email, user?.id);
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [latest, setLatest] = useState<any>(null);
  const [lastPaid, setLastPaid] = useState<Date | null>(null);
  const [loaded, setLoaded] = useState(false);

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
      if (searches?.[0]) setLastPaid(new Date(searches[0].searched_at));
      setLoaded(true);
    })();
  }, [user, authLoading]);

  if (!authLoading && !user) return <MobileSignedOut context="home" />;

  const day = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const prompt = DAILY_PROMPTS[day % DAILY_PROMPTS.length];

  // 90-day verification badge (derived from latest paid search)
  const daysSince = lastPaid ? Math.floor((Date.now() - lastPaid.getTime()) / 86400000) : null;
  const verified = daysSince !== null && daysSince <= 90;
  const daysLeft = verified ? 90 - (daysSince as number) : 0;

  const risk = latest?.risk_level ? RISK[latest.risk_level] : null;

  return (
    <div style={screen}>
      <MobileTopBar rightLabel={credits != null ? `${credits} check${credits === 1 ? "" : "s"}` : undefined} />

      <div style={page}>
        {/* Greeting */}
        <div>
          <span style={label}>Safety Base</span>
          <h1 style={{ ...h1, marginTop: 10 }}>
            {firstName ? <>Hey, <span style={{ color: ACCENT }}>{firstName}</span>.</> : "Welcome."}
          </h1>
          <p style={{ ...syne, color: MUTED, fontSize: 15, lineHeight: 1.55, marginTop: 10, fontStyle: "italic" }}>
            "{prompt}"
          </p>
        </div>

        {/* Verification status */}
        <div style={{ ...card, borderLeft: `3px solid ${verified ? ACCENT : "rgba(255,255,255,0.1)"}` }}>
          <span style={label}>Verification</span>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginTop: 8 }}>
            <span style={{ ...serif, fontSize: 32, color: TEXT }}>
              {verified ? "Active" : "Not verified"}
            </span>
          </div>
          <p style={{ ...syne, color: MUTED, fontSize: 13, lineHeight: 1.5, marginTop: 8 }}>
            {verified
              ? `Valid for ${daysLeft} more days. Renew anytime to keep your Connect eligibility.`
              : "Run your first check to unlock a 90-day verification window."}
          </p>
        </div>

        {/* Primary CTA */}
        <Link to="/dashboard/new-check" style={primaryButton}>
          Run a safety check →
        </Link>

        {/* Last check */}
        {latest && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <span style={label}>Last check</span>
              {risk && (
                <span style={{
                  ...mono,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: risk.color,
                  padding: "4px 10px",
                  borderRadius: 999,
                  border: `1px solid ${risk.color}66`,
                  background: `${risk.color}1a`,
                }}>
                  {risk.label}
                </span>
              )}
            </div>
            <p style={{ ...serif, fontSize: 22, color: TEXT, lineHeight: 1.2 }}>
              {latest.search_name || "Unnamed check"}
            </p>
            <p style={{ ...syne, color: MUTED, fontSize: 13, marginTop: 6 }}>
              {new Date(latest.searched_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
              {" · "}
              {latest.matches_found || 0} record{latest.matches_found === 1 ? "" : "s"}
            </p>
            <Link
              to="/dashboard/reports"
              style={{ ...mono, color: ACCENT, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", textDecoration: "none", display: "inline-block", marginTop: 12 }}
            >
              View all reports →
            </Link>
          </div>
        )}

        {/* Today's Signal */}
        <Link
          to="/signals"
          style={{
            ...card,
            display: "block",
            textDecoration: "none",
            color: "inherit",
            background: "linear-gradient(135deg, #111118 0%, #1a1126 100%)",
            border: "1px solid rgba(124,58,237,0.25)",
          }}
        >
          <span style={{ ...label, color: ACCENT }}>Today's Signal</span>
          <p style={{ ...serif, fontSize: 22, color: TEXT, lineHeight: 1.25, marginTop: 8 }}>
            Kindness in public. Cruelty in private. That's the pattern.
          </p>
          <span style={{ ...mono, color: MUTED, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block", marginTop: 12 }}>
            Read today →
          </span>
        </Link>

        {/* Quick links */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Link to="/dashboard/journal" style={{ ...card, textDecoration: "none", color: "inherit", padding: 16 }}>
            <span style={label}>Journal</span>
            <p style={{ ...syne, fontWeight: 700, color: TEXT, fontSize: 15, marginTop: 8 }}>Document an incident</p>
          </Link>
          <Link to="/connect" style={{ ...card, textDecoration: "none", color: "inherit", padding: 16 }}>
            <span style={label}>Connect</span>
            <p style={{ ...syne, fontWeight: 700, color: TEXT, fontSize: 15, marginTop: 8 }}>Meet verified people</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
