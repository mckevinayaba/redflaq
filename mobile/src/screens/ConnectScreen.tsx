import React, { useState, useEffect, useRef } from 'react';
import { SECTIONS, TOTAL_QUESTIONS } from '../data/quiz';
import { useQuiz } from '../hooks/useQuiz';

// ── Style constants ────────────────────────────────────────────
const inter: React.CSSProperties   = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties    = { fontFamily: "'JetBrains Mono', monospace" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

// ── Crisis lines (kept from original) ─────────────────────────
const RESOURCES = [
  { name: 'GBV Command Centre', line: '0800 428 428', color: '#C0392B', bg: 'rgba(192,57,43,0.1)', border: 'rgba(192,57,43,0.3)' },
  { name: 'SAPS Emergency',     line: '10111',        color: '#E67E22', bg: 'rgba(230,126,34,0.08)', border: 'rgba(230,126,34,0.25)' },
  { name: 'Stop Gender Violence', line: '0800 150 150', color: '#6C35DE', bg: 'rgba(108,53,222,0.08)', border: 'rgba(108,53,222,0.25)' },
];

// ── Mock match profiles ────────────────────────────────────────
const MATCHES = [
  {
    name: 'Nomsa K.', age: 29, city: 'Johannesburg', score: 94,
    bio: "I've been on my healing journey for two years. Looking for women who get it — who don't need everything explained. Community development by day. Hiking and cooking by weekend.",
    tags: ['Safety-conscious', 'Empathetic', 'Ambitious'],
    initial: 'N',
    color: '#6C35DE',
  },
  {
    name: 'Ayanda M.', age: 34, city: 'Cape Town', score: 88,
    bio: 'Mother, writer, advocate. I believe in chosen family. Looking for genuine connection with women building intentional, safe lives.',
    tags: ['Family-oriented', 'Creative', 'Strong values'],
    initial: 'A',
    color: '#C0392B',
  },
  {
    name: 'Thandi N.', age: 26, city: 'Durban', score: 81,
    bio: 'I run a community safety initiative. Avid reader. I believe in naming things directly. Looking for friendships built on honesty, not performance.',
    tags: ['Activist', 'Outdoors', 'Direct'],
    initial: 'T',
    color: '#27AE60',
  },
  {
    name: 'Lerato P.', age: 31, city: 'Pretoria', score: 76,
    bio: 'Civil engineer. Cautious by experience, optimistic by choice. Love Saturday markets and long conversations that actually go somewhere.',
    tags: ['Pragmatic', 'Warm', 'Grounded'],
    initial: 'L',
    color: '#E67E22',
  },
];

// ── Progress bar ───────────────────────────────────────────────
function ProgressBar({ pct, color = '#6C35DE' }: { pct: number; color?: string }) {
  return (
    <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s ease' }} />
    </div>
  );
}

// ── Onboarding modal ───────────────────────────────────────────
function OnboardingModal({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(8,8,15,0.92)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      padding: '0 0 env(safe-area-inset-bottom, 0)',
    }}>
      <div style={{
        background: '#111118', borderTop: '1px solid rgba(108,53,222,0.3)',
        borderRadius: '16px 16px 0 0', padding: '28px 24px 36px',
        maxWidth: 480, width: '100%',
      }}>
        <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 24px' }} />

        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#6C35DE" strokeWidth="1.8"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h2 style={{ ...inter, fontSize: 20, fontWeight: 900, color: '#ffffff', textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 12 }}>
          Before you start
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '💜', text: 'SafeMatch is a platonic connection tool. This is not a dating or romantic matching service.' },
            { icon: '🔒', text: 'Your answers are stored only on your device. They are never uploaded or shared.' },
            { icon: '✓', text: 'All connections are friendship-first. You choose who you engage with and when.' },
            { icon: '⚡', text: 'RedFlaq verifies no profiles. Always run a safety check before meeting anyone.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>

        <button
          onClick={onAccept}
          style={{
            width: '100%', padding: '16px',
            background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer',
            ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 12,
          }}
        >
          I Understand — Start Quiz
        </button>
        <button
          onClick={onDismiss}
          style={{
            width: '100%', padding: '12px',
            background: 'none', border: 'none', cursor: 'pointer',
            ...inter, fontSize: 14, color: '#8b8b91',
          }}
        >
          Not now
        </button>
      </div>
    </div>
  );
}

// ── Section complete interstitial ──────────────────────────────
function SectionComplete({
  letter, title, nextTitle, isLast,
  onContinue,
}: {
  letter: string; title: string; nextTitle?: string; isLast: boolean;
  onContinue: () => void;
}) {
  return (
    <div style={{ background: '#08080f', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
      <div style={{
        width: 64, height: 64, borderRadius: '50%',
        background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p style={{ ...mono, fontSize: 9, color: '#27AE60', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
        Section {letter} Complete
      </p>
      <h2 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 10 }}>
        {title}
      </h2>
      <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
        {isLast
          ? 'You\'ve completed all sections. Your profile is ready.'
          : `Saved. Next: Section ${letter === 'A' ? 'B' : letter === 'B' ? 'C' : letter === 'C' ? 'D' : 'E'} — ${nextTitle}`}
      </p>
      <button
        onClick={onContinue}
        style={{
          ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff',
          background: isLast ? '#C0392B' : '#6C35DE',
          border: 'none', borderRadius: 6, padding: '16px 36px', cursor: 'pointer',
        }}
      >
        {isLast ? 'See My Matches →' : 'Continue →'}
      </button>
    </div>
  );
}

// ── Quiz view ──────────────────────────────────────────────────
function QuizView({
  onComplete,
  onBack,
}: {
  onComplete: () => void;
  onBack: () => void;
}) {
  const { state, answer, completeSection, progress, isSectionComplete } = useQuiz();
  const [sectionIdx, setSectionIdx] = useState(() => {
    // Resume from last incomplete section
    for (let i = 0; i < SECTIONS.length; i++) {
      if (!state.completedSections.includes(SECTIONS[i].letter)) return i;
    }
    return SECTIONS.length - 1;
  });
  const [questionIdx, setQuestionIdx] = useState(0);
  const [showSectionComplete, setShowSectionComplete] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const section = SECTIONS[sectionIdx];
  const question = section.questions[questionIdx];
  const savedAnswer = state.answers[question.id];

  // Sync selected with saved answer
  useEffect(() => {
    setSelected(savedAnswer !== undefined ? savedAnswer : null);
  }, [question.id, savedAnswer]);

  // Scroll to top on question change
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [question.id]);

  const totalAnsweredInSection = section.questions.filter(q => state.answers[q.id] !== undefined).length;
  const sectionProgress = Math.round((totalAnsweredInSection / section.questions.length) * 100);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    answer(question.id, idx);

    setTimeout(() => {
      if (questionIdx < section.questions.length - 1) {
        setQuestionIdx(qi => qi + 1);
      } else {
        // Last question in section
        completeSection(section.letter);
        setShowSectionComplete(true);
      }
    }, 220);
  };

  const handleSectionContinue = () => {
    setShowSectionComplete(false);
    const isLast = sectionIdx === SECTIONS.length - 1;
    if (isLast) {
      onComplete();
    } else {
      setSectionIdx(si => si + 1);
      setQuestionIdx(0);
    }
  };

  if (showSectionComplete) {
    const isLast = sectionIdx === SECTIONS.length - 1;
    return (
      <SectionComplete
        letter={section.letter}
        title={section.title}
        nextTitle={SECTIONS[sectionIdx + 1]?.title}
        isLast={isLast}
        onContinue={handleSectionContinue}
      />
    );
  }

  return (
    <div ref={scrollRef} style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      {/* Top bar */}
      <div style={{
        padding: '56px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        position: 'sticky', top: 0, background: '#08080f', zIndex: 10,
      }}>
        {/* Overall progress */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connect</span>
          </button>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.06em' }}>
            {progress}% complete
          </span>
        </div>
        <ProgressBar pct={progress} />

        {/* Section info */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div>
            <p style={{ ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>
              Section {section.letter} — {section.title}
            </p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>
              Question {questionIdx + 1} of {section.questions.length}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {section.questions.map((_, i) => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i < totalAnsweredInSection
                  ? '#6C35DE'
                  : i === totalAnsweredInSection
                    ? 'rgba(108,53,222,0.4)'
                    : 'rgba(255,255,255,0.1)',
                transition: 'background 0.2s',
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* Question */}
      <div style={{ padding: '32px 20px' }}>
        <h2 style={{
          ...inter, fontSize: 20, fontWeight: 800, color: '#ffffff',
          letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 28,
        }}>
          {question.text}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((opt, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  textAlign: 'left', padding: '16px',
                  background: isSelected ? 'rgba(108,53,222,0.12)' : '#111118',
                  border: isSelected ? '2px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 14,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
                  background: isSelected ? '#6C35DE' : 'transparent',
                  border: isSelected ? '2px solid #6C35DE' : '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.15s',
                }}>
                  {isSelected && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}
                </div>
                <p style={{
                  ...inter, fontSize: 14, lineHeight: 1.45,
                  color: isSelected ? '#ffffff' : '#d1d1d6',
                  fontWeight: isSelected ? 600 : 400,
                }}>
                  {opt}
                </p>
              </button>
            );
          })}
        </div>

        {/* Section sections nav */}
        <div style={{ marginTop: 32, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SECTIONS.map((s, i) => {
            const done = state.completedSections.includes(s.letter);
            const current = i === sectionIdx;
            return (
              <div key={s.letter} style={{
                ...mono, fontSize: 8, letterSpacing: '0.1em',
                color: current ? '#ffffff' : done ? '#27AE60' : '#8b8b91',
                background: current ? '#6C35DE' : done ? 'rgba(39,174,96,0.12)' : '#111118',
                border: `1px solid ${current ? '#6C35DE' : done ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: 4, padding: '4px 8px',
              }}>
                {s.letter}{done && ' ✓'}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Results view ───────────────────────────────────────────────
function ResultsView({ onRetake, onBack }: { onRetake: () => void; onBack: () => void }) {
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{
        padding: '56px 20px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
      }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, padding: 0 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connect</span>
        </button>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>
          Your SafeMatch Results
        </p>
        <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          4 Compatible{' '}
          <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Connections</span>
        </h1>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>
          Based on your quiz answers. Compatibility is calculated across shared values, safety awareness, and social style.
        </p>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Warning note */}
        <div style={{
          background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)',
          borderRadius: 6, padding: '12px 14px', marginBottom: 24,
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <p style={{ ...inter, fontSize: 12, color: '#D97706', lineHeight: 1.55 }}>
            <strong>Demo results.</strong> These are mock profiles for demonstration. Full SafeMatch with real profiles is coming soon. Always run a RedFlaq check before meeting anyone.
          </p>
        </div>

        {/* Match cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {MATCHES.map((m, i) => (
            <div key={i} style={{
              background: '#111118',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 10, overflow: 'hidden',
            }}>
              {/* Score strip */}
              <div style={{ height: 2, background: m.color, width: `${m.score}%` }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
                    background: m.color + '22',
                    border: `2px solid ${m.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ ...inter, fontSize: 18, fontWeight: 900, color: m.color }}>
                      {m.initial}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.01em' }}>
                        {m.name}, {m.age}
                      </p>
                      <span style={{
                        ...mono, fontSize: 10, fontWeight: 700, color: m.color,
                        background: m.color + '1a', border: `1px solid ${m.color}33`,
                        borderRadius: 3, padding: '2px 7px', letterSpacing: '0.06em',
                      }}>
                        {m.score}%
                      </span>
                    </div>
                    <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.06em' }}>
                      {m.city}
                    </p>
                  </div>
                </div>
                <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 12 }}>
                  {m.bio}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {m.tags.map(tag => (
                    <span key={tag} style={{
                      ...mono, fontSize: 8, color: '#8b8b91',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 3, padding: '3px 7px', letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming soon section */}
        <div style={{
          background: '#111118', border: '1px solid rgba(108,53,222,0.2)',
          borderRadius: 8, padding: '20px 18px', textAlign: 'center', marginBottom: 20,
        }}>
          <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>
            Direct Messaging — Coming Soon
          </p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
            Secure, in-app messaging with your matches — all safety-checked — is in development.
          </p>
        </div>

        <button
          onClick={onRetake}
          style={{
            width: '100%', padding: '13px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 6, ...inter, fontSize: 13, fontWeight: 600, color: '#8b8b91', cursor: 'pointer',
          }}
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
}

// ── Home view ──────────────────────────────────────────────────
function HomeView({ quizStarted, quizComplete, progress, onStartQuiz, onResumeQuiz, onViewResults }: {
  quizStarted: boolean; quizComplete: boolean; progress: number;
  onStartQuiz: () => void; onResumeQuiz: () => void; onViewResults: () => void;
}) {
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '56px 20px 20px' }}>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Connect
        </p>
        <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {"You're Not "}
          <span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>Alone.</span>
        </h1>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, marginBottom: 28 }}>
          Helplines available now. SafeMatch quiz to find compatible connections — friendship first.
        </p>

        {/* Quiz CTA */}
        <div style={{
          background: '#111118',
          border: quizComplete ? '1px solid rgba(39,174,96,0.3)' : '1px solid rgba(108,53,222,0.3)',
          borderRadius: 10, overflow: 'hidden', marginBottom: 24,
        }}>
          {quizStarted && !quizComplete && (
            <div style={{ padding: '8px 16px', background: 'rgba(108,53,222,0.06)', borderBottom: '1px solid rgba(108,53,222,0.15)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <p style={{ ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' }}>In progress</p>
                <p style={{ ...mono, fontSize: 8, color: '#8b8b91' }}>{progress}%</p>
              </div>
              <ProgressBar pct={progress} />
            </div>
          )}
          <div style={{ padding: '20px 18px' }}>
            <p style={{
              ...mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10,
              color: quizComplete ? '#27AE60' : '#6C35DE',
            }}>
              {quizComplete ? '✓ SafeMatch Complete' : 'SafeMatch Quiz'}
            </p>
            <h2 style={{ ...inter, fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.015em', marginBottom: 8, lineHeight: 1.3 }}>
              {quizComplete
                ? 'Your profile is ready'
                : 'Find people who understand what you\'ve been through'}
            </h2>
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55, marginBottom: 18 }}>
              {quizComplete
                ? '4 compatible connections found based on your answers.'
                : '40 questions across 5 sections. Friendship-first. Stored locally.'}
            </p>
            <button
              onClick={quizComplete ? onViewResults : quizStarted ? onResumeQuiz : onStartQuiz}
              style={{
                width: '100%', padding: '14px',
                background: quizComplete ? '#27AE60' : '#6C35DE',
                border: 'none', borderRadius: 6, cursor: 'pointer',
                ...inter, fontSize: 14, fontWeight: 800, color: '#ffffff',
              }}
            >
              {quizComplete ? 'View My Matches →' : quizStarted ? `Resume Quiz (${progress}%)` : 'Start the Quiz →'}
            </button>
          </div>
        </div>

        {/* Emergency */}
        <div style={{
          background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.35)',
          borderRadius: 8, padding: '14px 16px', marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#C0392B" strokeWidth="1.8" fill="rgba(192,57,43,0.15)"/>
            <path d="M12 9v4M12 17h.01" stroke="#C0392B" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.4 }}>
            In immediate danger? Call <span style={{ color: '#C0392B', fontWeight: 700 }}>10111</span> or <span style={{ color: '#C0392B', fontWeight: 700 }}>112</span>
          </p>
        </div>

        {/* Crisis lines */}
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>
          Crisis Lines
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
          {RESOURCES.map((r, i) => (
            <a key={i} href={"tel:" + r.line.replace(/\s/g, '')} style={{
              background: r.bg, border: "1px solid " + r.border,
              borderRadius: 8, padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              textDecoration: 'none',
            }}>
              <p style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{r.name}</p>
              <p style={{ ...mono, fontSize: 15, fontWeight: 700, color: r.color, letterSpacing: '0.04em' }}>{r.line}</p>
            </a>
          ))}
        </div>

        {/* Groups coming soon */}
        <div style={{
          background: '#111118', border: '1px solid rgba(108,53,222,0.15)',
          borderRadius: 8, padding: '18px', textAlign: 'center',
        }}>
          <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
            Groups & Chat — Coming Soon
          </p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>
            Survivor support groups, legal aid circles, and peer chat — all safety-verified, all in development.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────
export default function ConnectScreen() {
  const { state, start, reset, progress } = useQuiz();
  const [view, setView] = useState<'home' | 'quiz' | 'results'>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);

  const quizStarted = !!state.startedAt;
  const quizComplete = state.completed;

  // If quiz was already complete, show results directly
  useEffect(() => {
    if (quizComplete && view === 'quiz') setView('results');
  }, [quizComplete]);

  const handleStartQuiz = () => setShowOnboarding(true);

  const handleAcceptOnboarding = () => {
    setShowOnboarding(false);
    start();
    setView('quiz');
  };

  const handleQuizComplete = () => setView('results');

  const handleRetake = () => {
    reset();
    setView('home');
  };

  if (view === 'quiz') {
    return (
      <>
        <QuizView onComplete={handleQuizComplete} onBack={() => setView('home')} />
      </>
    );
  }

  if (view === 'results') {
    return <ResultsView onRetake={handleRetake} onBack={() => setView('home')} />;
  }

  return (
    <>
      <HomeView
        quizStarted={quizStarted}
        quizComplete={quizComplete}
        progress={progress}
        onStartQuiz={handleStartQuiz}
        onResumeQuiz={() => setView('quiz')}
        onViewResults={() => setView('results')}
      />
      {showOnboarding && (
        <OnboardingModal
          onAccept={handleAcceptOnboarding}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
    </>
  );
}
