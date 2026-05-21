import React, { useState, useEffect } from 'react';
import { Tag } from '../data/tags';

const STATEMENTS = [
  "Anger is not loss of control. It's a control mechanism.",
  "He didn't show you who he was. He showed you what he thought you could handle.",
  "Month 12 is when he stops pretending.",
  "Kindness in public. Cruelty in private. That's the pattern.",
  "You didn't miss the signs. You were trained not to trust them.",
];

interface HomeScreenProps {
  onRunCheck: () => void;
  onGoJournal: () => void;
  onGoSignals: () => void;
  journalPatterns?: Array<{ tag: Tag; count: number }>;
  journalEntryCount?: number;
}

export default function HomeScreen({ onRunCheck, onGoJournal, onGoSignals, journalPatterns = [], journalEntryCount = 0 }: HomeScreenProps) {
  const [stmtIdx, setStmtIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setStmtIdx(i => (i + 1) % STATEMENTS.length);
        setVisible(true);
      }, 400);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#08080f', minHeight: '100%', paddingBottom: 80, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '56px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: '#C0392B',
            boxShadow: '0 0 8px rgba(192,57,43,0.6)',
          }} />
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
            fontWeight: 600, color: '#ffffff', letterSpacing: '0.12em',
          }}>
            REDFLAQ
          </span>
        </div>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Statement ticker — one at a time, fading */}
      <div style={{
        background: '#0d0d1a', borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '14px 24px', minHeight: 54, display: 'flex', alignItems: 'center',
        justifyContent: 'center',
      }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
          color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em', fontStyle: 'italic',
          textAlign: 'center', lineHeight: 1.5, margin: 0,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}>
          "{STATEMENTS[stmtIdx]}"
        </p>
      </div>

      {/* Hero */}
      <div style={{ padding: '36px 24px 28px' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: '#6C35DE', letterSpacing: '0.2em', textTransform: 'uppercase',
          marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, background: '#6C35DE', borderRadius: '50%' }} />
          South Africa's Public Record Safety Check
        </p>
        <h1 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 34, fontWeight: 900,
          color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 4,
        }}>
          Know Before<br />You Trust.
        </h1>
        <h2 style={{
          fontFamily: "'Playfair Display', serif", fontSize: 28, fontWeight: 700,
          fontStyle: 'italic', color: '#C0392B', lineHeight: 1.1, marginBottom: 20,
        }}>
          RedFlaq.
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#8b8b91',
          lineHeight: 1.65, marginBottom: 28, maxWidth: 320,
        }}>
          Search South African public criminal records in under 60 seconds.
          Confidential. POPIA-aware.
        </p>

        {/* CTA */}
        <button
          onClick={onRunCheck}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            width: '100%', padding: '16px 0',
            background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 800,
            color: '#ffffff', letterSpacing: '-0.01em',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z"
              stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)" strokeLinejoin="round" />
            <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Run a Safety Check — R99
        </button>

        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: '#8b8b91', letterSpacing: '0.08em', textAlign: 'center',
          marginTop: 10, textTransform: 'uppercase',
        }}>
          Confidential · POPIA-Compliant · Not Notified
        </p>
      </div>

      {/* Stats row */}
      <div style={{ padding: '0 20px 28px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
        {[
          { value: '1 in 3', label: 'SA women affected by GBV' },
          { value: 'R99', label: 'per check' },
          { value: '<60s', label: 'results' },
        ].map(stat => (
          <div key={stat.label} style={{
            background: '#111118', border: '1px solid rgba(108,53,222,0.2)',
            borderRadius: 8, padding: '14px 10px', textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 900,
              color: '#6C35DE', letterSpacing: '-0.02em', marginBottom: 4,
            }}>{stat.value}</p>
            <p style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
              color: '#8b8b91', letterSpacing: '0.06em', textTransform: 'uppercase',
              lineHeight: 1.4,
            }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ padding: '0 20px 28px' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 16,
        }}>How It Works</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { n: '01', title: 'Search', desc: 'Enter the person\'s name, and optionally their ID number or province.' },
            { n: '02', title: 'Verify', desc: 'We search the RedFlaq Verified Public Records Network instantly.' },
            { n: '03', title: 'Know', desc: 'Get a clear risk report. Save it privately to your Safety Base.' },
          ].map(step => (
            <div key={step.n} style={{
              background: '#111118', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8, padding: '16px', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700,
                color: 'rgba(108,53,222,0.35)', lineHeight: 1, flexShrink: 0, minWidth: 28,
              }}>{step.n}</span>
              <div>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{step.title}</p>
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.5 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Journal pattern summary */}
      {journalEntryCount > 0 && (
        <div style={{ padding: '0 20px 24px' }}>
          <button
            onClick={onGoJournal}
            style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <div style={{
              background: '#111118',
              border: journalPatterns.length > 0
                ? '1px solid rgba(192,57,43,0.35)'
                : '1px solid rgba(108,53,222,0.2)',
              borderRadius: 8, padding: '16px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: journalPatterns.length > 0 ? '#C0392B' : '#6C35DE',
                  letterSpacing: '0.12em', textTransform: 'uppercase',
                }}>
                  {journalPatterns.length > 0 ? '⚠ Pattern Detected' : 'Safety Journal'}
                </p>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                  color: '#8b8b91', letterSpacing: '0.06em',
                }}>
                  {journalEntryCount} {journalEntryCount === 1 ? 'entry' : 'entries'} →
                </p>
              </div>
              {journalPatterns.length > 0 ? (
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700, color: '#ffffff', marginBottom: 8, lineHeight: 1.3 }}>
                    {journalPatterns[0].tag.label} noted {journalPatterns[0].count}× across your entries.
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {journalPatterns.slice(0, 3).map(p => (
                      <span key={p.tag.id} style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                        color: p.tag.color, background: p.tag.bg,
                        border: `1px solid ${p.tag.border}`,
                        borderRadius: 3, padding: '3px 7px', letterSpacing: '0.08em',
                        textTransform: 'uppercase', fontWeight: 600,
                      }}>
                        {p.tag.label} {p.count}×
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.5 }}>
                  {journalEntryCount} incident{journalEntryCount !== 1 ? 's' : ''} documented. Keep recording. Patterns appear at 3+ entries with the same tag.
                </p>
              )}
            </div>
          </button>
        </div>
      )}

      {/* Latest Signal teaser */}
      <div style={{ padding: '0 20px 24px' }}>
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 12,
        }}>Latest Signal</p>
        <button
          onClick={onGoSignals}
          style={{
            width: '100%', textAlign: 'left', background: 'none',
            border: 'none', cursor: 'pointer', padding: 0,
          }}
        >
          <div style={{
            background: '#111118',
            border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 8, overflow: 'hidden',
          }}>
            <div style={{ height: 2, background: '#C0392B' }} />
            <div style={{ padding: '16px' }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                color: '#C0392B', letterSpacing: '0.12em', textTransform: 'uppercase',
                marginBottom: 8,
              }}>
                Behavioral Patterns
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 800,
                color: '#ffffff', letterSpacing: '-0.01em', lineHeight: 1.25, marginBottom: 8,
              }}>
                Anger is a Control Mechanism
              </p>
              <p style={{
                fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91',
                lineHeight: 1.55, marginBottom: 12,
              }}>
                Explosions of rage aren't random. They're targeted. And that specificity is the tell.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 8,
                  color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em',
                }}>
                  3 min read
                </span>
                <span style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700,
                  color: '#C0392B',
                }}>
                  Read →
                </span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Not ready */}
      <div style={{ padding: '0 20px 32px' }}>
        <div style={{
          background: '#111118', borderLeft: '3px solid #6C35DE',
          borderRadius: '0 8px 8px 0', padding: '18px 16px',
        }}>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700,
            color: '#ffffff', marginBottom: 6,
          }}>Not ready to run a check?</p>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91',
            lineHeight: 1.5, marginBottom: 14,
          }}>
            Start documenting incidents privately in your Safety Journal first.
          </p>
          <button
            onClick={onGoJournal}
            style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
              color: '#6C35DE', background: 'rgba(108,53,222,0.1)',
              border: '1px solid rgba(108,53,222,0.3)', borderRadius: 4,
              padding: '9px 16px', cursor: 'pointer',
            }}
          >
            Open Journal →
          </button>
        </div>
      </div>
    </div>
  );
}
