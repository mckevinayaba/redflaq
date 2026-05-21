import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SignalCard from "@/components/signals/SignalCard";
import { supabase } from "@/integrations/supabase/client";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileSignals from "@/components/mobile/screens/MobileSignals";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };
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

const TICKER_ITEMS = [
  "Anger is not loss of control. It's a control mechanism.",
  "He didn't show you who he was. He showed you what he thought you could handle.",
  "Month 12 is when he stops pretending.",
  "Kindness in public. Cruelty in private. That's the pattern.",
  "You didn't miss the signs. You were trained not to trust them.",
];

const SignalsTicker = () => {
  const renderItems = () => TICKER_ITEMS.map((item, i) => (
    <span key={i} className="inline-flex items-center">
      <span style={{
        ...mono,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.06em',
        color: 'rgba(255,255,255,0.5)',
        padding: '0 32px',
        fontStyle: 'italic',
      }}>
        {item}
      </span>
      <span style={{ color: 'rgba(192,57,43,0.6)', fontSize: 8 }}>◆</span>
    </span>
  ));

  return (
    <div style={{
      width: '100%',
      background: '#0d0d1a',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '10px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div className="animate-ticker inline-flex">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
};

const Signals = () => {
  const isMobile = useIsMobile();
  return isMobile ? <MobileSignals /> : <DesktopSignals />;
};

const DesktopSignals = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("all");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setArticles(data as Article[]);
      }
      setLoading(false);
    };
    fetchArticles();
  }, []);

  const filtered = activeCategory === "all"
    ? articles
    : articles.filter(a => a.category === activeCategory);

  const [featured, ...rest] = filtered;

  return (
    <div style={{ background: '#08080f', minHeight: '100vh', overflowX: 'hidden' }}>
      <NavbarPlinq />

      {/* Signals ticker */}
      <div style={{ paddingTop: 72 }}>
        <SignalsTicker />
      </div>

      {/* Hero */}
      <section style={{ background: '#08080f', padding: '64px 24px 48px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left — headline */}
            <div>
              <p style={{
                ...mono, fontSize: 10, fontWeight: 600, color: '#6C35DE',
                letterSpacing: '0.15em', textTransform: 'uppercase' as const,
                marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ display: 'inline-block', width: 8, height: 8, background: '#6C35DE', borderRadius: '50%' }} />
                REDFLAQ SIGNALS
              </p>
              <h1 style={{
                ...inter,
                fontSize: 'clamp(28px, 4.5vw, 52px)',
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.08,
                letterSpacing: '-0.03em',
                marginBottom: 0,
              }}>
                Daily Truth.{' '}
                <span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>No Comfort.</span>
                {' '}Just Clarity.
              </h1>
            </div>

            {/* Right — description */}
            <div>
              <p style={{
                ...inter, fontSize: 'clamp(15px, 1.6vw, 17px)', color: '#8b8b91',
                lineHeight: 1.8, marginBottom: 24,
              }}>
                Behavioral patterns, safety practice, and uncomfortable truth South African women need to hear.
                No softening. No cushioning. Just the signal.
              </p>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.2)',
                  padding: '6px 14px', borderRadius: 4,
                }}>
                  <span style={{ ...mono, fontSize: 10, color: '#6C35DE', letterSpacing: '0.06em' }}>
                    Published weekly
                  </span>
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  padding: '6px 14px', borderRadius: 4,
                }}>
                  <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.06em' }}>
                    Free to read
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px' }}>
        {/* Category filters */}
        <div style={{ marginBottom: 36, overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', gap: 8, minWidth: 'max-content' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.value;
              return (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  style={{
                    ...inter, fontSize: 13, fontWeight: isActive ? 700 : 500,
                    color: isActive ? '#ffffff' : '#8b8b91',
                    background: isActive ? '#6C35DE' : '#111118',
                    border: isActive ? '1px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)',
                    padding: '8px 16px', borderRadius: 4, cursor: 'pointer',
                    transition: 'all 0.15s', whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(108,53,222,0.4)';
                      e.currentTarget.style.color = '#d1d1d6';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isActive) {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                      e.currentTarget.style.color = '#8b8b91';
                    }
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 28, height: 28,
              border: '3px solid rgba(108,53,222,0.2)',
              borderTopColor: '#6C35DE',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto',
            }} />
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <p style={{ ...inter, fontSize: 16, color: '#8b8b91', marginBottom: 16 }}>
              No signals yet in this category.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              style={{
                ...inter, fontSize: 13, color: '#6C35DE',
                background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline',
              }}
            >
              View all signals
            </button>
          </div>
        ) : (
          <>
            {/* Featured signal */}
            {featured && (
              <div style={{ marginBottom: 28 }}>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          <div style={{
            marginTop: 64,
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: 'clamp(28px, 4vw, 48px)',
            textAlign: 'center',
          }}>
            <p style={{ ...mono, fontSize: 10, fontWeight: 700, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
              KNOWLEDGE WITHOUT ACTION DOESN'T PROTECT YOU
            </p>
            <h2 style={{
              ...inter, fontSize: 'clamp(20px, 3vw, 32px)', fontWeight: 900,
              color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.15,
              marginBottom: 12,
            }}>
              You read the signal.{' '}
              <span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>Now act on it.</span>
            </h2>
            <p style={{ ...inter, fontSize: 15, color: '#8b8b91', marginBottom: 28, maxWidth: 480, margin: '0 auto 28px' }}>
              One public-record check. Under 60 seconds. Court-admissible.
            </p>
            <button
              onClick={() => navigate('/search-form')}
              style={{
                ...inter, fontWeight: 700, fontSize: 15, color: '#ffffff',
                background: '#C0392B', border: 'none',
                padding: '14px 36px', borderRadius: 4, cursor: 'pointer',
                transition: 'opacity 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              Run a Safety Check — R99
            </button>
          </div>
        )}
      </div>

      <FooterPlinq />
    </div>
  );
};

export default Signals;
