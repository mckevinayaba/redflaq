import React, { useState } from 'react';
import { SavedCheck } from '../hooks/useSavedChecks';
import { SavedSignal } from '../hooks/useSavedSignals';

interface BaseScreenProps {
  checks: SavedCheck[];
  onRemove: (id: string) => void;
  onRunCheck: () => void;
  savedSignals?: SavedSignal[];
  onRemoveSignal?: (id: string) => void;
  onGoSignals?: () => void;
}

function getRiskColor(risk: SavedCheck['riskLevel']): string {
  if (risk === 'HIGH') return '#C0392B';
  if (risk === 'MEDIUM') return '#E67E22';
  if (risk === 'LOW') return '#F1C40F';
  return '#27AE60';
}

function getRiskBg(risk: SavedCheck['riskLevel']): string {
  if (risk === 'HIGH') return 'rgba(192,57,43,0.12)';
  if (risk === 'MEDIUM') return 'rgba(230,126,34,0.1)';
  if (risk === 'LOW') return 'rgba(241,196,15,0.1)';
  return 'rgba(39,174,96,0.1)';
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-ZA', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export default function BaseScreen({ checks, onRemove, onRunCheck, savedSignals = [], onRemoveSignal, onGoSignals }: BaseScreenProps) {
  const [activeTab, setActiveTab] = useState<'checks' | 'signals'>('checks');
  return (
    <div style={{ background: '#08080f', minHeight: '100%', paddingBottom: 90, overflowY: 'auto' }}>
      {/* Header */}
      <div style={{
        padding: '56px 20px 24px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
            color: '#6C35DE', letterSpacing: '0.2em', textTransform: 'uppercase',
            marginBottom: 10,
          }}>Private Storage</p>
          <h1 style={{
            fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 900,
            color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 6,
          }}>Safety Base</h1>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8b8b91', lineHeight: 1.5,
          }}>Your saved checks and signals.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, marginTop: 16 }}>
          {checks.length > 0 && (
            <div style={{
              background: 'rgba(108,53,222,0.15)', border: '1px solid rgba(108,53,222,0.3)',
              borderRadius: 20, padding: '4px 12px', flexShrink: 0,
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
                color: '#6C35DE', fontWeight: 600,
              }}>{checks.length + savedSignals.length}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tab toggle */}
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 20px' }}>
        {(['checks', 'signals'] as const).map(t => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            style={{
              flex: 1, padding: '12px 0',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: activeTab === t ? '#ffffff' : '#8b8b91',
              background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === t ? '2px solid #6C35DE' : '2px solid transparent',
              fontWeight: activeTab === t ? 700 : 400,
              transition: 'all 0.15s',
            }}
          >
            {t === 'checks' ? `Checks${checks.length > 0 ? ` (${checks.length})` : ''}` : `Signals${savedSignals.length > 0 ? ` (${savedSignals.length})` : ''}`}
          </button>
        ))}
      </div>

      <div style={{ padding: '24px 20px' }}>
        {activeTab === 'signals' ? (
          /* ── SIGNALS TAB ── */
          savedSignals.length === 0 ? (
            <div style={{ textAlign: 'center', paddingTop: 32 }}>
              <div style={{
                width: 56, height: 56, borderRadius: '50%',
                background: 'rgba(192,57,43,0.08)', border: '1px solid rgba(192,57,43,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h2 style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 10 }}>
                No saved signals yet
              </h2>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8b8b91', lineHeight: 1.65, maxWidth: 260, margin: '0 auto 24px' }}>
                Tap Save when reading a Signal to bookmark it here.
              </p>
              <button
                onClick={onGoSignals}
                style={{
                  fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 700,
                  color: '#C0392B', background: 'rgba(192,57,43,0.08)',
                  border: '1px solid rgba(192,57,43,0.25)', borderRadius: 5,
                  padding: '11px 24px', cursor: 'pointer',
                }}
              >
                Browse Signals →
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {savedSignals.map(signal => (
                <div key={signal.id} style={{
                  background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                  borderLeft: '3px solid #C0392B', borderRadius: 8,
                  padding: '16px', position: 'relative',
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#C0392B', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6 }}>
                        {signal.categoryLabel}
                      </p>
                      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 6 }}>
                        {signal.title}
                      </p>
                      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: '#8b8b91', letterSpacing: '0.06em' }}>
                        {formatDate(signal.savedAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => onRemoveSignal?.(signal.id)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, flexShrink: 0, opacity: 0.5 }}
                      title="Remove"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={onGoSignals}
                style={{
                  width: '100%', padding: '13px',
                  background: 'transparent', border: '1px dashed rgba(192,57,43,0.3)',
                  borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                  color: '#C0392B', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5V19M5 12H19" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Browse More Signals
              </button>
            </div>
          )
        ) : checks.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: 'center', paddingTop: 32 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(108,53,222,0.08)', border: '1px solid rgba(108,53,222,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                <ellipse cx="12" cy="6" rx="8" ry="3" stroke="#6C35DE" strokeWidth="1.8" fill="rgba(108,53,222,0.1)" />
                <path d="M4 6V12C4 13.7 7.6 15 12 15C16.4 15 20 13.7 20 12V6" stroke="#6C35DE" strokeWidth="1.8" />
                <path d="M4 12V18C4 19.7 7.6 21 12 21C16.4 21 20 19.7 20 18V12" stroke="#6C35DE" strokeWidth="1.8" />
              </svg>
            </div>
            <h2 style={{
              fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 800,
              color: '#ffffff', letterSpacing: '-0.01em', marginBottom: 10,
            }}>No saved checks yet</h2>
            <p style={{
              fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#8b8b91',
              lineHeight: 1.65, marginBottom: 28, maxWidth: 280, margin: '0 auto 28px',
            }}>
              Run a safety check and save the result here for future reference. Stored privately on your device.
            </p>
            <button
              onClick={onRunCheck}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 800,
                color: '#ffffff', background: '#6C35DE',
                border: 'none', borderRadius: 6,
                padding: '14px 28px', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z"
                  stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)" strokeLinejoin="round" />
                <path d="M9 12L11 14L15 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Run First Check
            </button>
          </div>
        ) : (
          /* Check list */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {checks.map(check => {
              const color = getRiskColor(check.riskLevel);
              const bg = getRiskBg(check.riskLevel);
              return (
                <div key={check.id} style={{
                  background: '#111118', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 8, padding: '16px', overflow: 'hidden', position: 'relative',
                }}>
                  {/* Left color accent */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0,
                    width: 3, background: color,
                  }} />

                  <div style={{ paddingLeft: 12 }}>
                    {/* Top row */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700,
                          color: '#ffffff', marginBottom: 4, letterSpacing: '-0.01em',
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>{check.name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{
                            fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                            color: color, background: bg,
                            border: `1px solid ${color}40`,
                            borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em',
                            textTransform: 'uppercase', fontWeight: 600,
                          }}>{check.riskLevel}</span>
                          {check.province && (
                            <span style={{
                              fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                              color: '#8b8b91', letterSpacing: '0.06em',
                            }}>{check.province}</span>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => onRemove(check.id)}
                        style={{
                          background: 'none', border: 'none', cursor: 'pointer',
                          padding: '4px', marginLeft: 8, flexShrink: 0,
                          opacity: 0.5,
                        }}
                        title="Remove"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H21M8 6V4H16V6M19 6L18.1 19.1A2 2 0 0116.1 21H7.9A2 2 0 015.9 19.1L5 6"
                            stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>

                    {/* Score bar */}
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em' }}>
                          RISK SCORE
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: color, fontWeight: 600 }}>
                          {check.riskScore}/100
                        </span>
                      </div>
                      <div style={{
                        width: '100%', height: 3,
                        background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden',
                      }}>
                        <div style={{
                          height: '100%', background: color, borderRadius: 2,
                          width: `${check.riskScore}%`,
                        }} />
                      </div>
                    </div>

                    {/* Date */}
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                      color: '#8b8b91', letterSpacing: '0.06em',
                    }}>Checked {formatDate(check.savedAt)}</p>
                  </div>
                </div>
              );
            })}

            {/* Add another */}
            <button
              onClick={onRunCheck}
              style={{
                width: '100%', padding: '14px',
                background: 'transparent', border: '1px dashed rgba(108,53,222,0.3)',
                borderRadius: 8, fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600,
                color: '#6C35DE', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Run Another Check
            </button>
          </div>
        )}

        {/* Footer note — only for checks tab */}
        {activeTab === 'signals' ? null :
        <div style={{
          marginTop: 28, display: 'flex', alignItems: 'center', gap: 8,
          justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="#8b8b91" strokeWidth="1.8" />
            <path d="M7 11V7C7 4.8 9.2 3 12 3C14.8 3 17 4.8 17 7V11" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#8b8b91',
          }}>Your data stays on this device. Never shared.</p>
        </div>}
      </div>
    </div>
  );
}
