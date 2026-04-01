import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SignalCard from "@/components/signals/SignalCard";
import { supabase } from "@/integrations/supabase/client";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
}

const CATEGORIES = [
  { value: "all", label: "All Signals" },
  { value: "behavioral-patterns", label: "Behavioral Patterns" },
  { value: "dating-relationships", label: "Dating & Relationships" },
  { value: "safety-habits", label: "Safety Habits" },
  { value: "gbvf-evidence", label: "GBVF & Evidence" },
  { value: "trust-denial", label: "Trust & Denial" },
  { value: "dating-safety", label: "Dating Safety" },
  { value: "gbv-resources", label: "GBV Resources" },
];

const Signals = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const fetchSignals = async () => {
      const { data } = await supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });
      setArticles(data || []);
      setLoading(false);
    };
    fetchSignals();
  }, []);

  const filtered = activeCategory === "all"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const featured = filtered[0] || null;
  const rest = filtered.slice(1);

  return (
    <div style={{ background: "#F5F0EB", minHeight: "100vh", overflowX: "hidden" }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{ background: '#F5F0EB', paddingTop: 108, paddingBottom: 56, padding: '108px 24px 56px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ ...mono, fontSize: 10, color: '#7C3AED', letterSpacing: '0.15em', fontWeight: 600, marginBottom: 12, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
            REDFLAQ SIGNALS
          </p>
          <h1 style={{
            ...serif, fontSize: 'clamp(28px, 5vw, 52px)', color: '#1F1F1F',
            lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 16,
          }}>
            Daily Truth. No Comfort.{' '}
            <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Just Clarity.</em>
          </h1>
          <p style={{ ...sans, fontSize: 'clamp(14px, 1.6vw, 16px)', color: '#555555', lineHeight: 1.8, maxWidth: 580 }}>
            Behavioral patterns, safety practice, and uncomfortable truth South African women need to hear.
            No softening. No cushioning. Just the signal.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Category filters */}
        <div style={{ marginBottom: 40, overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    ...sans, fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#7C3AED' : '#555555',
                    background: isActive ? 'rgba(124,58,237,0.08)' : 'rgba(0,0,0,0.04)',
                    border: isActive ? '1.5px solid rgba(124,58,237,0.25)' : '1.5px solid transparent',
                    padding: '8px 16px', borderRadius: 50, cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ width: 28, height: 28, border: '3px solid #E6E0DA', borderTopColor: '#7C3AED', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p style={{ ...sans, fontSize: 16, color: '#888' }}>No signals yet in this category.</p>
            <button
              onClick={() => setActiveCategory("all")}
              style={{ ...sans, fontSize: 13, color: '#7C3AED', background: 'none', border: 'none', cursor: 'pointer', marginTop: 12, textDecoration: 'underline' }}
            >
              View all signals
            </button>
          </div>
        ) : (
          <>
            {/* Featured signal — large card */}
            {featured && (
              <div style={{ marginBottom: 32 }}>
                <SignalCard
                  title={featured.title}
                  slug={featured.slug}
                  excerpt={featured.excerpt}
                  category={featured.category}
                  created_at={featured.created_at}
                  featured
                />
              </div>
            )}

            {/* Signal grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {rest.map(article => (
                  <SignalCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    excerpt={article.excerpt}
                    category={article.category}
                    created_at={article.created_at}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Bottom CTA */}
        {!loading && filtered.length > 0 && (
          <div style={{ marginTop: 60, textAlign: 'center' }}>
            <p style={{ ...sans, fontSize: 16, color: '#555', marginBottom: 20 }}>
              Knowledge is only safety when you act on it.
            </p>
            <button
              onClick={() => navigate('/search-form')}
              style={{
                ...sans, fontWeight: 700, fontSize: 15, color: 'white',
                background: '#B52020', border: 'none', padding: '14px 32px',
                borderRadius: 50, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(181,32,32,0.25)',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Run a Check — R99
            </button>
          </div>
        )}
      </div>

      <FooterPlinq />
    </div>
  );
};

export default Signals;
