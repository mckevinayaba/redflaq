import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SignalStreakBar from "@/components/landing/SignalStreakBar";
import { markSignalRead } from "@/hooks/useSignalStreak";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
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

const SUBLINES = [
  "Not therapy. Just clarity.",
  "Awareness is not action. This is action.",
  "Before You Trust, RedFlaq First.",
  "Your instincts are data. Read them.",
  "Stop calling it fate. It's a pattern.",
];

const TodaysSignal = () => {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<SignalArticle | null>(null);
  const [previous, setPrevious] = useState<SignalArticle | null>(null);
  const [likes, setLikes] = useState(0);

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const subline = SUBLINES[dayOfYear % SUBLINES.length];

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
        setLikes(Math.floor(Math.random() * 300) + 80);
      }
    };
    fetchSignals();
  }, []);

  const fallback = {
    title: "That Wasn't Rage. That Was Strategy.",
    slug: "he-is-not-going-through-something-this-is-him",
    excerpt:
      "Each explosion left you asking what you did to trigger him. That response is the point. Anger is not loss of control. It's a control mechanism. The question isn't whether he can stop. It's what he gains when he doesn't.",
    category: "behavioral-patterns",
  };

  const signal = featured || fallback;
  const categoryLabel = CATEGORY_LABELS[signal.category] || signal.category;

  const handleCardClick = () => {
    markSignalRead(signal.slug);
    navigate(`/signals/${signal.slug}`);
  };

  return (
    <section style={{ background: '#08080f', padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <SignalStreakBar />

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 28 }}>
          <div>
            <p style={{ ...mono, fontSize: 10, fontWeight: 600, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ display: 'inline-block', width: 8, height: 8, background: '#6C35DE', borderRadius: '50%' }} />
              TODAY'S REDFLAQ SIGNAL
            </p>
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91', fontStyle: 'italic' }}>
              {subline}
            </p>
          </div>
          <button
            onClick={() => navigate('/signals')}
            style={{
              ...inter, fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.5)',
              background: 'transparent', border: 'none', cursor: 'pointer', padding: '4px 0',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}
          >
            All Signals →
          </button>
        </div>

        {/* Featured Signal card */}
        <div
          onClick={handleCardClick}
          style={{
            background: '#111118',
            border: '1px solid rgba(108,53,222,0.25)',
            borderRadius: 8,
            padding: 'clamp(28px, 5vw, 52px)',
            cursor: 'pointer',
            transition: 'border-color 0.2s, transform 0.2s',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
        >
          {/* Category badge */}
          <div style={{
            display: 'inline-block',
            background: 'rgba(108,53,222,0.15)',
            border: '1px solid rgba(108,53,222,0.3)',
            padding: '4px 12px', borderRadius: 4, marginBottom: 20,
          }}>
            <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
              {categoryLabel}
            </span>
          </div>

          {/* Headline */}
          <h3 style={{
            ...inter,
            fontSize: 'clamp(22px, 3.5vw, 40px)',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1.15,
            letterSpacing: '-0.025em',
            marginBottom: 20,
            maxWidth: 800,
          }}>
            {signal.title.includes("Strategy") ? (
              <>
                That Wasn't Rage. That Was{' '}
                <span style={{ color: '#C0392B' }}>Strategy.</span>
              </>
            ) : signal.title}
          </h3>

          {/* Excerpt */}
          <p style={{
            ...inter,
            fontSize: 'clamp(14px, 1.6vw, 17px)',
            color: '#d1d1d6',
            lineHeight: 1.85,
            maxWidth: 700,
            marginBottom: 32,
          }}>
            {signal.excerpt && signal.excerpt.includes("control mechanism") ? (
              <>
                Each explosion left you asking what you did to trigger him. That response is the point.
                Anger is not loss of control. It's a{' '}
                <span style={{ color: '#C0392B', fontWeight: 600 }}>control mechanism.</span>
                {' '}The question isn't whether he can stop. It's what he gains when he doesn't.
              </>
            ) : signal.excerpt}
          </p>

          {/* Meta + engagement */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.06em' }}>
                RedFlaq Signals · Today · 5 min read
              </span>
              <button
                onClick={e => { e.stopPropagation(); setLikes(l => l + 1); }}
                style={{
                  ...inter, fontSize: 12, color: '#8b8b91',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  padding: '5px 12px', borderRadius: 4, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 5, transition: 'color 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.color = '#6C35DE'}
                onMouseLeave={e => e.currentTarget.style.color = '#8b8b91'}
              >
                ♥ {likes}
              </button>
            </div>
            <button
              onClick={e => { e.stopPropagation(); handleCardClick(); }}
              style={{
                ...inter, fontWeight: 700, fontSize: 14, color: 'white',
                background: '#6C35DE', border: 'none',
                padding: '11px 24px', borderRadius: 4, cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
              onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
            >
              Read Signal →
            </button>
          </div>
        </div>

        {/* Previous signal teaser */}
        {previous && (
          <div
            onClick={() => navigate(`/signals/${previous.slug}`)}
            style={{
              marginTop: 12, padding: '14px 20px',
              background: 'rgba(108,53,222,0.06)',
              border: '1px solid rgba(108,53,222,0.15)',
              borderRadius: 6,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
              flexWrap: 'wrap', cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(108,53,222,0.10)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = 'rgba(108,53,222,0.06)'}
          >
            <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>
              Yesterday's Signal:{' '}
              <span style={{ color: '#d1d1d6', fontWeight: 600 }}>"{previous.title}"</span>
            </span>
            <span style={{ ...inter, fontSize: 12, color: '#6C35DE', fontWeight: 600, whiteSpace: 'nowrap' }}>Read →</span>
          </div>
        )}
      </div>
    </section>
  );
};

export default TodaysSignal;
