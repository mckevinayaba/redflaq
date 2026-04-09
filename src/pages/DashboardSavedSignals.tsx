import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

interface SavedSignal {
  id: string;
  signal_id: string;
  created_at: string;
  article?: {
    title: string;
    slug: string;
    excerpt: string | null;
    category: string;
  } | null;
}

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '24px',
};

export default function DashboardSavedSignals() {
  const { user, loading: authLoading } = useAuth();
  const [saves, setSaves] = useState<SavedSignal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchSaves = async () => {
      // Fetch saves
      const { data: savesData } = await supabase
        .from("signal_saves")
        .select("id, signal_id, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (!savesData || savesData.length === 0) {
        setSaves([]);
        setLoading(false);
        return;
      }

      // Fetch matching articles
      const slugs = savesData.map(s => s.signal_id);
      const { data: articles } = await supabase
        .from("academy_articles")
        .select("slug, title, excerpt, category")
        .in("slug", slugs);

      const articleMap = new Map(
        (articles || []).map(a => [a.slug, a])
      );

      const merged: SavedSignal[] = savesData.map(s => ({
        ...s,
        article: articleMap.get(s.signal_id) || null,
      }));

      setSaves(merged);
      setLoading(false);
    };
    fetchSaves();
  }, [user]);

  const handleUnsave = async (signalId: string) => {
    if (!user) return;
    await supabase
      .from("signal_saves")
      .delete()
      .eq("signal_id", signalId)
      .eq("user_id", user.id);
    setSaves(prev => prev.filter(s => s.signal_id !== signalId));
  };

  if (authLoading || loading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 0' }}>
          <div style={{ width: 28, height: 28, border: '3px solid rgba(108,53,222,0.2)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 32 }}>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
          Safety Base
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 8 }}>
          Saved Signals
        </h1>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91' }}>
          Articles you've bookmarked to revisit later.
        </p>
      </div>

      {saves.length === 0 ? (
        <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 16px' }}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>
          <p style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>No saved signals yet</p>
          <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 20 }}>
            Browse Signals and tap the bookmark icon to save articles for later.
          </p>
          <Link to="/signals" style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '10px 20px', borderRadius: 4, textDecoration: 'none' }}>
            Browse Signals
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {saves.map(s => (
            <div key={s.id} style={{ ...card, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  {s.article?.category && (
                    <span style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
                      {s.article.category.replace(/-/g, ' ')}
                    </span>
                  )}
                  <Link
                    to={`/signals/${s.article?.slug || s.signal_id}`}
                    style={{ ...inter, fontSize: 15, fontWeight: 700, color: '#ffffff', textDecoration: 'none', display: 'block', marginTop: 4, lineHeight: 1.4 }}
                  >
                    {s.article?.title || s.signal_id}
                  </Link>
                </div>
                <button
                  onClick={() => handleUnsave(s.signal_id)}
                  style={{
                    background: 'rgba(108,53,222,0.12)',
                    border: '1px solid rgba(108,53,222,0.3)',
                    borderRadius: 4,
                    padding: '6px',
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                  title="Remove from saved"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="#6C35DE" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                  </svg>
                </button>
              </div>
              {s.article?.excerpt && (
                <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>
                  {s.article.excerpt.slice(0, 120)}{s.article.excerpt.length > 120 ? '…' : ''}
                </p>
              )}
              <p style={{ ...mono, fontSize: 10, color: '#555' }}>
                Saved {new Date(s.created_at).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
