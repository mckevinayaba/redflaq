import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

interface SignalArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
}

const CATEGORY_LABELS: Record<string, string> = {
  "behavioral-patterns": "Behavioral Patterns",
  "dating-relationships": "Dating & Relationships",
  "safety-habits": "Safety Habits",
  "gbvf-evidence": "GBVF & Evidence",
  "trust-denial": "Trust & Denial",
  "dating-safety": "Dating Safety",
  "gbv-resources": "GBV Resources",
};

const TodaysSignal = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<SignalArticle | null>(null);
  const [previous, setPrevious] = useState<SignalArticle | null>(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const fetchSignals = async () => {
      const { data } = await supabase
        .from("academy_articles")
        .select("id, title, slug, excerpt, category, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false })
        .limit(2);
      if (data && data.length > 0) {
        setFeatured(data[0]);
        if (data.length > 1) setPrevious(data[1]);
        // Random-ish like count for social proof
        setLikes(Math.floor(Math.random() * 300) + 80);
      }
    };
    fetchSignals();
  }, []);

  // Fallback content when no signals are seeded yet
  const fallbackFeatured = {
    title: "You Checked the Vibe, the Venue, the Uber. But Not the Person.",
    slug: "you-checked-everything-except-the-person",
    excerpt:
      "Meeting in public didn't save her. Sharing her location didn't save her. A good first impression didn't save her. Because those behaviors protect you from strangers. Not from the person who seemed perfect for 3 months.",
    category: "behavioral-patterns",
  };

  const signal = featured || fallbackFeatured;
  const categoryLabel = CATEGORY_LABELS[signal.category] || signal.category;

  return (
    <section style={{ background: '#F5F0EB', padding: '64px 24px 48px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 32 }}>
          <div>
            <p style={{ ...mono, fontSize: 10, color: '#7C3AED', letterSpacing: '0.12em', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
              TODAY'S SIGNAL
            </p>
            <h2 style={{ ...serif, fontSize: 'clamp(24px, 3vw, 36px)', color: '#1F1F1F', lineHeight: 1.1, letterSpacing: '-0.02em' }}>
              Daily Truth. No Comfort. Just Clarity.
            </h2>
          </div>
          <button
            onClick={() => navigate('/signals')}
            style={{
              ...sans, fontSize: 13, fontWeight: 600, color: '#7C3AED',
              background: 'transparent', border: '1.5px solid #7C3AED',
              padding: '10px 20px', borderRadius: 50, cursor: 'pointer',
              transition: 'background 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.05)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            All Signals →
          </button>
        </div>

        {/* Featured Signal card */}
        <div
          style={{
            background: '#1F1523',
            borderRadius: 16,
            padding: 'clamp(28px, 5vw, 52px)',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: '0 8px 40px rgba(0,0,0,0.15)',
          }}
          onClick={() => navigate(`/signals/${signal.slug}`)}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 40px rgba(0,0,0,0.15)'; }}
        >
          {/* Category tag */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(124,58,237,0.2)', border: '1px solid rgba(124,58,237,0.3)',
            padding: '4px 12px', borderRadius: 50, marginBottom: 20,
          }}>
            <span style={{ ...mono, fontSize: 10, fontWeight: 600, color: '#C4B5FD', letterSpacing: '0.08em' }}>
              {categoryLabel.toUpperCase()}
            </span>
          </div>

          <h3 style={{
            ...serif, fontSize: 'clamp(22px, 3.5vw, 38px)', color: '#FAFAF9',
            lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20, maxWidth: 800,
          }}>
            {signal.title}
          </h3>

          <p style={{
            ...sans, fontSize: 'clamp(14px, 1.6vw, 16px)', color: 'rgba(255,255,255,0.65)',
            lineHeight: 1.8, maxWidth: 680, marginBottom: 32,
          }}>
            {signal.excerpt}
          </p>

          {/* Engagement row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <button
                onClick={e => { e.stopPropagation(); setLikes(l => l + 1); }}
                style={{
                  ...sans, fontSize: 13, color: 'rgba(255,255,255,0.6)',
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)',
                  padding: '7px 14px', borderRadius: 50, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.12)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
              >
                ♥ {likes}
              </button>
              <span style={{ ...sans, fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                5 min read
              </span>
            </div>

            <button
              onClick={e => { e.stopPropagation(); navigate(`/signals/${signal.slug}`); }}
              style={{
                ...sans, fontWeight: 700, fontSize: 14, color: 'white',
                background: '#7C3AED', border: 'none',
                padding: '12px 24px', borderRadius: 50, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#6D28D9')}
              onMouseLeave={e => (e.currentTarget.style.background = '#7C3AED')}
            >
              Read Signal →
            </button>
          </div>
        </div>

        {/* Previous signal teaser */}
        {previous && (
          <div style={{ marginTop: 16, padding: '16px 20px', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }}
            onClick={() => navigate(`/signals/${previous.slug}`)}>
            <span style={{ ...sans, fontSize: 13, color: '#888' }}>
              Yesterday's Signal:{' '}
              <span style={{ color: '#4B4453', fontWeight: 600 }}>"{previous.title}"</span>
            </span>
            <span style={{ ...sans, fontSize: 12, color: '#7C3AED', fontWeight: 600, whiteSpace: 'nowrap' }}>Read →</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysSignal;
