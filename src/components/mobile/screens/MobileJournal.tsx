import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import MobileTopBar from "../MobileTopBar";
import MobileSignedOut from "./MobileSignedOut";
import { screen, page, card, h1, label, syne, mono, serif, MUTED, ACCENT, TEXT } from "./mobileTokens";

interface Entry {
  id: string;
  entry_date: string;
  incident_description: string;
  statement_hash: string | null;
}

export default function MobileJournal() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading || !user) return;
    (async () => {
      const { data } = await supabase
        .from("journal_entries")
        .select("id, entry_date, incident_description, statement_hash")
        .eq("user_id", user.id)
        .order("entry_date", { ascending: false });
      setEntries(data || []);
      setLoading(false);
    })();
  }, [user, authLoading]);

  if (!authLoading && !user) return <MobileSignedOut context="journal" />;

  return (
    <div style={screen}>
      <MobileTopBar />
      <div style={{ ...page, paddingBottom: 100 }}>
        <div>
          <span style={label}>Journal · Encrypted</span>
          <h1 style={{ ...h1, marginTop: 10 }}>
            Your <span style={{ color: ACCENT }}>private</span> record.
          </h1>
          <p style={{ ...syne, color: MUTED, fontSize: 15, lineHeight: 1.55, marginTop: 10 }}>
            Locked, timestamped, only you can read it.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(124,58,237,0.2)", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : entries.length === 0 ? (
          <div style={{ ...card, textAlign: "center", padding: 32 }}>
            <p style={{ ...serif, fontSize: 22, color: TEXT, lineHeight: 1.25 }}>
              Nothing here yet.
            </p>
            <p style={{ ...syne, color: MUTED, fontSize: 14, lineHeight: 1.55, marginTop: 10 }}>
              Start documenting today. Not for the court. For the version of you who will be ready.
            </p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {entries.map((e) => (
              <Link
                key={e.id}
                to={`/dashboard/journal/${e.id}`}
                style={{ ...card, textDecoration: "none", color: "inherit", display: "block" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={{ ...mono, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", color: ACCENT }}>
                    {new Date(e.entry_date).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" })}
                  </span>
                  {e.statement_hash && (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-label="Locked">
                      <rect x="4" y="11" width="16" height="10" rx="2" stroke={MUTED} strokeWidth="1.8" />
                      <path d="M8 11V7C8 4.8 9.8 3 12 3C14.2 3 16 4.8 16 7V11" stroke={MUTED} strokeWidth="1.8" />
                    </svg>
                  )}
                </div>
                <p style={{ ...syne, color: TEXT, fontSize: 15, lineHeight: 1.5, display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {e.incident_description}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => navigate("/dashboard/journal/new")}
        aria-label="New journal entry"
        style={{
          position: "fixed",
          right: 20,
          bottom: `calc(80px + env(safe-area-inset-bottom, 0px))`,
          width: 56,
          height: 56,
          borderRadius: 28,
          background: ACCENT,
          border: "none",
          color: "#fff",
          fontSize: 28,
          lineHeight: 1,
          cursor: "pointer",
          boxShadow: "0 10px 30px -8px rgba(124,58,237,0.6)",
          zIndex: 60,
        }}
      >
        +
      </button>
    </div>
  );
}
