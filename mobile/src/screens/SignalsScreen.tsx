import React, { useState, useRef, useEffect } from 'react';
import { SIGNALS, CATEGORIES, Signal } from '../data/signals';
import { SavedSignal } from '../hooks/useSavedSignals';

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' });
}

// ── FEATURED CARD ──────────────────────────────────────────────
function FeaturedCard({ signal, onRead }: { signal: Signal; onRead: () => void }) {
  return (
    <button
      onClick={onRead}
      style={{
        width: '100%', textAlign: 'left', background: 'none', border: 'none',
        cursor: 'pointer', padding: 0,
      }}
    >
      <div style={{
        background: '#111118',
        border: '1px solid rgba(192,57,43,0.35)',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
      }}>
        {/* Red accent strip */}
        <div style={{ height: 3, background: '#C0392B', width: '100%' }} />

        <div style={{ padding: '20px 18px 22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <span style={{
              ...mono, fontSize: 8, fontWeight: 700, color: '#C0392B',
              background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)',
              borderRadius: 3, padding: '3px 8px', letterSpacing: '0.12em', textTransform: 'uppercase',
            }}>
              FEATURED SIGNAL
            </span>
            <span style={{ ...mono, fontSize: 8, color: '#8b8b91', letterSpacing: '0.08em' }}>
              {signal.categoryLabel.toUpperCase()}
            </span>
          </div>

          <h2 style={{
            ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff',
            letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 12,
          }}>
            {signal.title}
          </h2>

          <p style={{
            ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.65, marginBottom: 18,
          }}>
            {signal.excerpt}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.06em' }}>
              {formatDate(signal.publishedAt)} · {signal.readMinutes} min read
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#C0392B', borderRadius: 4, padding: '8px 14px',
            }}>
              <span style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>
                Read Signal
              </span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

// ── SIGNAL CARD ────────────────────────────────────────────────
function SignalCard({ signal, onRead }: { signal: Signal; onRead: () => void }) {
  return (
    <button
      onClick={onRead}
      style={{
        width: '100%', textAlign: 'left', background: 'none', border: 'none',
        cursor: 'pointer', padding: 0,
      }}
    >
      <div style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8,
        padding: '16px',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
        <span style={{
          ...mono, fontSize: 8, fontWeight: 600, color: '#6C35DE',
          letterSpacing: '0.1em', textTransform: 'uppercase',
        }}>
          {signal.categoryLabel}
        </span>
        <h3 style={{
          ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff',
          letterSpacing: '-0.01em', lineHeight: 1.25,
        }}>
          {signal.title}
        </h3>
        <p style={{
          ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55,
          display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {signal.excerpt}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em' }}>
            {signal.readMinutes} min read
          </span>
          <span style={{ ...inter, fontSize: 12, color: '#6C35DE', fontWeight: 600 }}>
            Read →
          </span>
        </div>
      </div>
    </button>
  );
}

// ── ARTICLE VIEW ───────────────────────────────────────────────
function ArticleView({
  signal,
  saved,
  onSave,
  onUnsave,
  onBack,
}: {
  signal: Signal;
  saved: boolean;
  onSave: () => void;
  onUnsave: () => void;
  onBack: () => void;
}) {
  useEffect(() => { window.scrollTo?.(0, 0); }, [signal.id]);

  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 100 }}>
      {/* Top bar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky', top: 0, background: '#08080f', zIndex: 10,
      }}>
        <button
          onClick={onBack}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, padding: 0,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Signals
          </span>
        </button>
        <button
          onClick={saved ? onUnsave : onSave}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            background: saved ? 'rgba(39,174,96,0.12)' : 'rgba(108,53,222,0.1)',
            border: saved ? '1px solid rgba(39,174,96,0.3)' : '1px solid rgba(108,53,222,0.3)',
            borderRadius: 4, padding: '7px 12px', cursor: 'pointer',
          }}
        >
          {saved ? (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ ...mono, fontSize: 9, color: '#27AE60', letterSpacing: '0.08em' }}>SAVED</span>
            </>
          ) : (
            <>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.08em' }}>SAVE</span>
            </>
          )}
        </button>
      </div>

      {/* Article content */}
      <div style={{ padding: '28px 22px' }}>
        {/* Meta */}
        <p style={{
          ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.15em',
          textTransform: 'uppercase', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ display: 'inline-block', width: 5, height: 5, background: '#6C35DE', borderRadius: '50%' }} />
          {signal.categoryLabel} · {signal.readMinutes} min read
        </p>

        {/* Title */}
        <h1 style={{
          ...playfair, fontSize: 28, fontWeight: 900, color: '#ffffff',
          lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 14,
        }}>
          {signal.title}
        </h1>

        {/* Excerpt — pull quote */}
        <div style={{
          borderLeft: '3px solid #C0392B', paddingLeft: 16, marginBottom: 28,
        }}>
          <p style={{
            ...playfair, fontSize: 16, fontStyle: 'italic', color: '#d1d1d6',
            lineHeight: 1.6,
          }}>
            {signal.excerpt}
          </p>
        </div>

        {/* Date */}
        <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', marginBottom: 28 }}>
          {formatDate(signal.publishedAt)}
        </p>

        {/* Body paragraphs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {signal.body.map((para, i) => (
            <p key={i} style={{
              ...inter, fontSize: 16, color: '#d1d1d6', lineHeight: 1.75,
              letterSpacing: '-0.005em',
            }}>
              {para}
            </p>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{
          marginTop: 40, background: '#111118',
          border: '1px solid rgba(192,57,43,0.25)', borderRadius: 8,
          padding: '20px 18px',
        }}>
          <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
            Knowledge without action doesn't protect you
          </p>
          <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6, lineHeight: 1.3 }}>
            You read the signal.{' '}
            <span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>Now act on it.</span>
          </p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.5, marginBottom: 16 }}>
            One public-record check. Under 60 seconds. Court-admissible.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={saved ? onUnsave : onSave}
              style={{
                flex: 1, padding: '11px',
                background: saved ? 'rgba(39,174,96,0.12)' : 'rgba(108,53,222,0.1)',
                border: saved ? '1px solid rgba(39,174,96,0.3)' : '1px solid rgba(108,53,222,0.3)',
                borderRadius: 5, cursor: 'pointer',
                ...inter, fontSize: 13, fontWeight: 700,
                color: saved ? '#27AE60' : '#6C35DE',
              }}
            >
              {saved ? '✓ Saved to Base' : 'Save to Base'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── MAIN SCREEN ────────────────────────────────────────────────
interface SignalsScreenProps {
  savedSignalIds: string[];
  onSaveSignal: (signal: SavedSignal) => void;
  onUnsaveSignal: (id: string) => void;
}

export default function SignalsScreen({ savedSignalIds, onSaveSignal, onUnsaveSignal }: SignalsScreenProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = activeCategory === 'all'
    ? SIGNALS
    : SIGNALS.filter(s => s.category === activeCategory);

  const featured = SIGNALS.find(s => s.featured);
  const rest = filtered.filter(s => !s.featured || activeCategory !== 'all');

  const handleSave = (signal: Signal) => {
    onSaveSignal({
      id: signal.id,
      title: signal.title,
      category: signal.category,
      categoryLabel: signal.categoryLabel,
      excerpt: signal.excerpt,
      savedAt: new Date().toISOString(),
    });
  };

  if (selectedSignal) {
    return (
      <ArticleView
        signal={selectedSignal}
        saved={savedSignalIds.includes(selectedSignal.id)}
        onSave={() => handleSave(selectedSignal)}
        onUnsave={() => onUnsaveSignal(selectedSignal.id)}
        onBack={() => setSelectedSignal(null)}
      />
    );
  }

  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{ padding: '56px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <p style={{ ...mono, fontSize: 9, color: '#C0392B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-block', width: 5, height: 5, background: '#C0392B', borderRadius: '50%' }} />
          RedFlaq Signals
        </p>
        <h1 style={{ ...inter, fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 6 }}>
          Daily Truth.{' '}
          <span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>No Comfort.</span>
        </h1>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55 }}>
          Behavioral patterns and uncomfortable truth. No softening.
        </p>
      </div>

      {/* Category chips */}
      <div
        ref={scrollRef}
        style={{
          overflowX: 'auto', display: 'flex', gap: 8,
          padding: '16px 20px',
          scrollbarWidth: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {CATEGORIES.map(cat => {
          const active = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              style={{
                flexShrink: 0,
                ...mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
                fontWeight: active ? 700 : 400,
                color: active ? '#ffffff' : '#8b8b91',
                background: active ? '#6C35DE' : '#111118',
                border: active ? '1px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 4, padding: '7px 12px', cursor: 'pointer',
                whiteSpace: 'nowrap', transition: 'all 0.15s',
              }}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Featured card — only in All view */}
        {activeCategory === 'all' && featured && (
          <div style={{ marginBottom: 24 }}>
            <FeaturedCard
              signal={featured}
              onRead={() => setSelectedSignal(featured)}
            />
          </div>
        )}

        {/* Signal count */}
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>
          {rest.length} Signal{rest.length !== 1 ? 's' : ''}
          {activeCategory !== 'all' ? ` · ${CATEGORIES.find(c => c.id === activeCategory)?.label}` : ''}
        </p>

        {/* Signal list */}
        {rest.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ ...inter, fontSize: 14, color: '#8b8b91' }}>No signals in this category yet.</p>
            <button
              onClick={() => setActiveCategory('all')}
              style={{ ...inter, fontSize: 13, color: '#6C35DE', background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, textDecoration: 'underline' }}
            >
              View all signals
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 20 }}>
            {rest.map(signal => (
              <SignalCard
                key={signal.id}
                signal={signal}
                onRead={() => setSelectedSignal(signal)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
