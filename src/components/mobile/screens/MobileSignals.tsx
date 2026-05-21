import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import MobileTopBar from "../MobileTopBar";
import { screen, page, card, h1, label, syne, mono, serif, MUTED, ACCENT, TEXT } from "./mobileTokens";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "all", label: "All" },
  { value: "behavioral-patterns", label: "Patterns" },
  { value: "dating-relationships", label: "Dating" },
  { value: "safety-habits", label: "Habits" },
  { value: "gbvf-evidence", label: "Evidence" },
];

export default function MobileSignals() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      let q = supabase.from("academy_articles").select("id,title,slug,excerpt,category,created_at").eq("published", true).order("created_at", { ascending: false });
      if (active !== "all") q = q.eq("category", active);
      const { data } = await q;
      setArticles((data as Article[]) || []);
      setLoading(false);
    })();
  }, [active]);

  return (
    <div style={screen}>
      <MobileTopBar />
      <div style={page}>
        <div>
          <span style={label}>Signals</span>
          <h1 style={{ ...h1, marginTop: 10 }}>
            What you were trained <span style={{ color: ACCENT }}>not</span> to see.
          </h1>
        </div>

        {/* Category chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginLeft: -20, marginRight: -20, paddingLeft: 20, paddingRight: 20 }}>
          {CATEGORIES.map((c) => {
            const on = active === c.value;
            return (
              <button
                key={c.value}
                onClick={() => setActive(c.value)}
                style={{
                  ...mono,
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 11,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  background: on ? ACCENT : "transparent",
                  color: on ? "#fff" : MUTED,
                  border: on ? `1px solid ${ACCENT}` : "1px solid rgba(255,255,255,0.1)",
                  cursor: "pointer",
                  minHeight: 36,
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
            <div style={{ width: 24, height: 24, border: "2px solid rgba(124,58,237,0.2)", borderTopColor: ACCENT, borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
          </div>
        ) : articles.length === 0 ? (
          <div style={{ ...card, textAlign: "center" }}>
            <p style={{ ...syne, color: MUTED, fontSize: 14 }}>No signals in this category yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {articles.map((a) => (
              <Link
                key={a.id}
                to={`/signals/${a.slug}`}
                style={{ ...card, textDecoration: "none", color: "inherit", display: "block" }}
              >
                <span style={{ ...label, color: ACCENT }}>
                  {CATEGORIES.find((c) => c.value === a.category)?.label || a.category}
                </span>
                <p style={{ ...serif, fontSize: 20, lineHeight: 1.25, color: TEXT, marginTop: 8 }}>{a.title}</p>
                {a.excerpt && (
                  <p style={{ ...syne, color: MUTED, fontSize: 14, lineHeight: 1.5, marginTop: 8 }}>{a.excerpt}</p>
                )}
                <span style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", display: "inline-block", marginTop: 12 }}>
                  {new Date(a.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short" })} · Read →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
