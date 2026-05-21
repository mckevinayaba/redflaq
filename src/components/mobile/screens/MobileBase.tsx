import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MobileTopBar from "../MobileTopBar";
import MobileSignedOut from "./MobileSignedOut";
import { screen, page, card, h1, label, syne, mono, serif, MUTED, ACCENT, TEXT } from "./mobileTokens";

const RISK: Record<string, { label: string; color: string }> = {
  RED: { label: "High", color: "#C0392B" },
  ORANGE: { label: "Moderate", color: "#E67E22" },
  YELLOW: { label: "Low", color: "#F1C40F" },
  GREEN: { label: "Clear", color: "#27AE60" },
};

type Tab = "reports" | "journal" | "signals";

export default function MobileBase() {
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>(() => {
    if (typeof window === "undefined") return "reports";
    const params = new URLSearchParams(window.location.search);
    const t = params.get("tab");
    return t === "journal" || t === "signals" ? (t as Tab) : "reports";
  });
  const [searches, setSearches] = useState<any[]>([]);
  const [journal, setJournal] = useState<any[]>([]);
  const [savedSignals, setSavedSignals] = useState<{ slug: string; title: string; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const [{ data: s }, { data: saves }, { data: j }] = await Promise.all([
        supabase.from("searches").select("id,search_name,searched_at,risk_level,matches_found").eq("user_id", user.id).order("searched_at", { ascending: false }).limit(50),
        supabase.from("signal_saves").select("signal_id, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
        supabase.from("journal_entries").select("id, entry_date, entry_time, incident_description, about_person, statement_hash").eq("user_id", user.id).order("entry_date", { ascending: false }).limit(50),
      ]);
      setSearches(s || []);
      setJournal(j || []);
      if (saves && saves.length) {
        const slugs = saves.map((x: any) => x.signal_id);
        const { data: arts } = await supabase.from("academy_articles").select("slug,title").in("slug", slugs);
        const byslug = new Map((arts || []).map((a: any) => [a.slug, a.title]));
        setSavedSignals(saves.map((x: any) => ({ slug: x.signal_id, title: byslug.get(x.signal_id) || x.signal_id, created_at: x.created_at })));
      }
      setLoading(false);
    })();
  }, [user, authLoading]);

  if (!authLoading && !user) return <MobileSignedOut context="base" />;

  return (
    <div style={screen}>
      <MobileTopBar />
      <div style={page}>
        <div>
          <span style={label}>Base</span>
          <h1 style={{ ...h1, marginTop: 10 }}>Everything saved.</h1>
        </div>

        {/* Segmented control */}
        <div style={{ display: "flex", background: "#0d0d1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: 4, gap: 4 }}>
          {(["reports", "journal", "signals"] as const).map((t) => {
            const on = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  ...mono,
                  flex: 1,
                  minHeight: 40,
                  borderRadius: 8,
                  border: "none",
                  cursor: "pointer",
                  background: on ? ACCENT : "transparent",
                  color: on ? "#fff" : MUTED,
                  fontSize: 10,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  fontWeight: on ? 700 : 500,
                }}
              >
                {t === "reports" ? "Reports" : t === "journal" ? "Journal" : "Signals"}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(124,58,237,0.2)", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : tab === "reports" ? (
          searches.length === 0 ? (
            <Empty body="No checks yet. Your first report will land here." cta={{ to: "/dashboard/new-check", label: "Run a check" }} />
          ) : (
            <List>
              {searches.map((s) => {
                const r = RISK[s.risk_level] || RISK.GREEN;
                return (
                  <Link key={s.id} to={`/dashboard/reports`} style={rowStyle}>
                    <div>
                      <p style={{ ...syne, fontWeight: 700, color: TEXT, fontSize: 15 }}>{s.search_name || "Unnamed"}</p>
                      <p style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginTop: 4 }}>
                        {new Date(s.searched_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}{s.matches_found || 0} match{s.matches_found === 1 ? "" : "es"}
                      </p>
                    </div>
                    <span style={{
                      ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase",
                      color: r.color, padding: "4px 10px", borderRadius: 999,
                      border: `1px solid ${r.color}66`, background: `${r.color}1a`, flexShrink: 0,
                    }}>
                      {r.label}
                    </span>
                  </Link>
                );
              })}
            </List>
          )
        ) : tab === "journal" ? (
          journal.length === 0 ? (
            <Empty body="Your safety journal is empty. Record what felt off before memory blurs." cta={{ to: "/dashboard/journal/new", label: "Record an incident" }} />
          ) : (
            <>
              <Link
                to="/dashboard/journal/new"
                style={{
                  ...mono,
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  alignSelf: "flex-start",
                  background: ACCENT,
                  color: "#fff",
                  padding: "10px 14px",
                  borderRadius: 999,
                  textDecoration: "none",
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  fontWeight: 700,
                  minHeight: 40,
                }}
              >
                + New entry
              </Link>
              <List>
                {journal.map((e) => (
                  <Link key={e.id} to={`/dashboard/journal/${e.id}`} style={rowStyle}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>
                        {new Date(e.entry_date).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
                        {e.entry_time ? ` · ${String(e.entry_time).slice(0, 5)}` : ""}
                      </p>
                      {e.about_person && (
                        <p style={{ ...syne, fontWeight: 700, color: TEXT, fontSize: 14, marginTop: 4 }}>About: {e.about_person}</p>
                      )}
                      <p style={{ ...syne, color: MUTED, fontSize: 13, marginTop: 4, lineHeight: 1.45, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                        {e.incident_description}
                      </p>
                    </div>
                    {e.statement_hash && (
                      <span style={{ ...mono, fontSize: 9, color: "#27AE60", background: "rgba(39,174,96,0.1)", border: "1px solid rgba(39,174,96,0.25)", padding: "2px 8px", borderRadius: 999, flexShrink: 0 }}>
                        LOCKED
                      </span>
                    )}
                  </Link>
                ))}
              </List>
            </>
          )
        ) : savedSignals.length === 0 ? (
          <Empty body="Bookmark a Signal to find it again here." cta={{ to: "/signals", label: "Browse Signals" }} />
        ) : (
          <List>
            {savedSignals.map((s) => (
              <Link key={s.slug} to={`/signals/${s.slug}`} style={rowStyle}>
                <div>
                  <p style={{ ...syne, fontWeight: 700, color: TEXT, fontSize: 15, lineHeight: 1.35 }}>{s.title}</p>
                  <p style={{ ...mono, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: MUTED, marginTop: 6 }}>
                    Saved {new Date(s.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })}
                  </p>
                </div>
              </Link>
            ))}
          </List>
        )}
      </div>
    </div>
  );
}

const rowStyle: React.CSSProperties = {
  ...card,
  textDecoration: "none",
  color: "inherit",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
  padding: 16,
};

function List({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>{children}</div>;
}

function Empty({ body, cta }: { body: string; cta?: { to: string; label: string } }) {
  return (
    <div style={{ ...card, textAlign: "center", padding: 32 }}>
      <p style={{ ...serif, fontSize: 20, color: TEXT }}>Nothing here yet.</p>
      <p style={{ ...syne, color: MUTED, fontSize: 14, lineHeight: 1.55, marginTop: 8 }}>{body}</p>
      {cta && (
        <Link
          to={cta.to}
          style={{
            ...mono,
            display: "inline-block",
            marginTop: 16,
            background: ACCENT,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 999,
            textDecoration: "none",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          {cta.label}
        </Link>
      )}
    </div>
  );
}
