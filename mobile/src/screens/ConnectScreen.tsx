import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SECTIONS } from '../data/quiz';
import { useQuiz } from '../hooks/useQuiz';
import { useSavedChecks } from '../hooks/useSavedChecks';
import { GROUPS, GROUP_CATEGORIES, CATEGORY_COLOR, Group, GroupMember } from '../data/groups';
import { useGroupChat } from '../hooks/useGroupChat';
import { useGroupEvents, EventFeedback } from '../hooks/useGroupEvents';
import { GroupEvent, EventAttendee } from '../data/events';

const inter: React.CSSProperties    = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties     = { fontFamily: "'JetBrains Mono', monospace" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const RESOURCES = [
  { name: 'GBV Command Centre',   line: '0800 428 428', color: '#C0392B', bg: 'rgba(192,57,43,0.1)',   border: 'rgba(192,57,43,0.3)' },
  { name: 'SAPS Emergency',       line: '10111',        color: '#E67E22', bg: 'rgba(230,126,34,0.08)', border: 'rgba(230,126,34,0.25)' },
  { name: 'Stop Gender Violence', line: '0800 150 150', color: '#6C35DE', bg: 'rgba(108,53,222,0.08)', border: 'rgba(108,53,222,0.25)' },
];

const MATCHES = [
  { name: 'Nomsa K.',  age: 29, city: 'Johannesburg', score: 94, bio: "I've been on my healing journey for two years. Looking for women who get it.", tags: ['Safety-conscious', 'Empathetic', 'Ambitious'], initial: 'N', color: '#6C35DE' },
  { name: 'Ayanda M.', age: 34, city: 'Cape Town',    score: 88, bio: 'Mother, writer, advocate. Looking for genuine connection with women building intentional, safe lives.', tags: ['Family-oriented', 'Creative', 'Strong values'], initial: 'A', color: '#C0392B' },
  { name: 'Thandi N.', age: 26, city: 'Durban',       score: 81, bio: 'I run a community safety initiative. Looking for friendships built on honesty, not performance.', tags: ['Activist', 'Outdoors', 'Direct'], initial: 'T', color: '#27AE60' },
  { name: 'Lerato P.', age: 31, city: 'Pretoria',     score: 76, bio: 'Civil engineer. Cautious by experience, optimistic by choice.', tags: ['Pragmatic', 'Warm', 'Grounded'], initial: 'L', color: '#E67E22' },
];

const SA_PROVINCES = ['Gauteng','Western Cape','KwaZulu-Natal','Eastern Cape','Free State','Limpopo','Mpumalanga','North West','Northern Cape','Nationwide'];

const SAFETY_TIPS = [
  "You are not required to share more than you're comfortable with. Your pace is always right.",
  "Always run a RedFlaq check before meeting anyone from this group in person.",
  "Your journal entries are encrypted on your device. No one in this group can see them.",
  "If any message makes you uncomfortable, use the flag icon to report it. Reports are anonymous.",
  "You can leave this group at any time. No explanation needed.",
];

// ── Helpers ────────────────────────────────────────────────────
function isVerified(checks: ReturnType<typeof useSavedChecks>['checks']): boolean {
  return checks.some(c => Date.now() - new Date(c.savedAt).getTime() < 90 * 24 * 60 * 60 * 1000);
}

function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
}

function formatMsgTime(iso: string): string {
  const d = new Date(iso);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  const t = d.toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' });
  if (days === 0) return t;
  if (days === 1) return `Yesterday ${t}`;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' });
}

function formatEventDate(dateStr: string, time: string): string {
  const d = new Date(`${dateStr}T${time}`);
  const days = Math.floor((d.getTime() - Date.now()) / 86400000);
  const dow = d.toLocaleDateString('en-ZA', { weekday: 'long' });
  const dmy = d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' });
  if (days < 0)  return `${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''} ago`;
  if (days === 0) return 'Today';
  if (days === 1) return 'Tomorrow';
  if (days < 7)  return `${dow}, ${dmy}`;
  return dmy;
}

// ── Shared sub-components ──────────────────────────────────────
function ProgressBar({ pct, color = '#6C35DE' }: { pct: number; color?: string }) {
  return (
    <div style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
      <div style={{ height: '100%', background: color, borderRadius: 2, width: `${pct}%`, transition: 'width 0.3s ease' }} />
    </div>
  );
}

function VerifiedBadge() {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z" fill="rgba(39,174,96,0.2)" stroke="#27AE60" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M9 12L11 14L15 10" stroke="#27AE60" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ ...mono, fontSize: 7, color: '#27AE60', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Verified</span>
    </span>
  );
}

function BackBar({ label, onBack, right }: { label: string; onBack: () => void; right?: React.ReactNode }) {
  return (
    <div style={{ padding: '56px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'sticky', top: 0, background: '#08080f', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{label}</span>
      </button>
      {right}
    </div>
  );
}

// ── Report modal ───────────────────────────────────────────────
const REPORT_TYPES = [
  { id: 'threatening',   label: 'Threatening or harmful content' },
  { id: 'harassment',    label: 'Harassment or targeting' },
  { id: 'misinformation',label: 'Misinformation or dangerous advice' },
  { id: 'spam',          label: 'Spam or self-promotion' },
  { id: 'inappropriate', label: 'Inappropriate for this space' },
  { id: 'other',         label: 'Other' },
];

interface ReportTarget { type: 'message' | 'member' | 'group'; id: string; display: string; excerpt?: string; }

function ReportModal({ target, onSubmit, onClose }: { target: ReportTarget; onSubmit: () => void; onClose: () => void }) {
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(8,8,15,0.92)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
        <div style={{ background: '#111118', borderTop: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px 16px 0 0', padding: '32px 24px 40px', maxWidth: 480, width: '100%', textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p style={{ ...inter, fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>Report Received</p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 24 }}>Thank you. Our moderation team will review this within 24 hours. Repeat violations result in removal.</p>
          <button onClick={() => { onSubmit(); onClose(); }} style={{ padding: '13px 32px', background: '#111118', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 14, fontWeight: 600, color: '#8b8b91' }}>Close</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(8,8,15,0.92)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#111118', borderTop: '1px solid rgba(192,57,43,0.3)', borderRadius: '16px 16px 0 0', padding: '28px 24px 36px', maxWidth: 480, width: '100%', maxHeight: '85vh', overflowY: 'auto' }}>
        <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 24px' }} />
        <p style={{ ...mono, fontSize: 9, color: '#C0392B', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Report</p>
        <p style={{ ...inter, fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{target.display}</p>
        {target.excerpt && <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.5, marginBottom: 16, fontStyle: 'italic' }}>"{target.excerpt}"</p>}
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginBottom: 16 }}>Select a reason:</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
          {REPORT_TYPES.map(rt => (
            <button key={rt.id} onClick={() => setReason(rt.id)} style={{ textAlign: 'left', padding: '13px 14px', background: reason === rt.id ? 'rgba(192,57,43,0.1)' : '#0d0d1a', border: reason === rt.id ? '1px solid rgba(192,57,43,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 6, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, background: reason === rt.id ? '#C0392B' : 'transparent', border: reason === rt.id ? '2px solid #C0392B' : '2px solid rgba(255,255,255,0.2)' }} />
              <span style={{ ...inter, fontSize: 13, color: reason === rt.id ? '#ffffff' : '#d1d1d6' }}>{rt.label}</span>
            </button>
          ))}
        </div>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional context (optional)" rows={3} style={{ width: '100%', padding: '12px 14px', background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, ...inter, fontSize: 13, color: '#ffffff', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />
        <button onClick={() => setSubmitted(true)} disabled={!reason} style={{ width: '100%', padding: '14px', background: reason ? '#C0392B' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, cursor: reason ? 'pointer' : 'not-allowed', ...inter, fontSize: 14, fontWeight: 800, color: reason ? '#ffffff' : '#8b8b91', marginBottom: 10 }}>
          Submit Report
        </button>
        <button onClick={onClose} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', ...inter, fontSize: 13, color: '#8b8b91' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Feedback modal ─────────────────────────────────────────────
function FeedbackModal({ event, onSubmit, onDismiss }: { event: GroupEvent; onSubmit: (fb: EventFeedback) => void; onDismiss: () => void }) {
  const [rating, setRating] = useState(0);
  const [notes, setNotes] = useState('');
  const [again, setAgain] = useState<'yes'|'maybe'|'no'|''>('');

  const canSubmit = rating > 0 && again !== '';

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit({ eventId: event.id, rating, notes, wouldAttendAgain: again as 'yes'|'maybe'|'no' });
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 300, background: 'rgba(8,8,15,0.92)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#111118', borderTop: '1px solid rgba(108,53,222,0.3)', borderRadius: '16px 16px 0 0', padding: '28px 24px 36px', maxWidth: 480, width: '100%' }}>
        <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 24px' }} />
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Post-Event Feedback</p>
        <p style={{ ...inter, fontSize: 16, fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>{event.title}</p>
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.04em', marginBottom: 24 }}>{formatEventDate(event.date, event.time)} · {event.time}</p>

        <p style={{ ...inter, fontSize: 13, color: '#d1d1d6', marginBottom: 12 }}>How was the session?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => setRating(n)} style={{ flex: 1, padding: '12px 0', background: n <= rating ? 'rgba(108,53,222,0.15)' : '#0d0d1a', border: n <= rating ? '1px solid rgba(108,53,222,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 20, transition: 'all 0.1s' }}>
              {n <= rating ? '★' : '☆'}
            </button>
          ))}
        </div>

        <p style={{ ...inter, fontSize: 13, color: '#d1d1d6', marginBottom: 10 }}>Would you attend another session like this?</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {(['yes','maybe','no'] as const).map(opt => (
            <button key={opt} onClick={() => setAgain(opt)} style={{ flex: 1, padding: '11px 0', background: again === opt ? 'rgba(108,53,222,0.15)' : '#0d0d1a', border: again === opt ? '1px solid rgba(108,53,222,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 13, fontWeight: again === opt ? 700 : 400, color: again === opt ? '#ffffff' : '#8b8b91', textTransform: 'capitalize' }}>
              {opt === 'yes' ? 'Yes' : opt === 'maybe' ? 'Maybe' : 'No'}
            </button>
          ))}
        </div>

        <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="What would you tell future attendees? (optional)" rows={3} style={{ width: '100%', padding: '12px 14px', background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 6, ...inter, fontSize: 13, color: '#ffffff', resize: 'none', outline: 'none', boxSizing: 'border-box', marginBottom: 16 }} />

        <button onClick={handleSubmit} disabled={!canSubmit} style={{ width: '100%', padding: '14px', background: canSubmit ? '#6C35DE' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, cursor: canSubmit ? 'pointer' : 'not-allowed', ...inter, fontSize: 14, fontWeight: 800, color: canSubmit ? '#ffffff' : '#8b8b91', marginBottom: 10 }}>
          Submit Feedback
        </button>
        <button onClick={onDismiss} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', ...inter, fontSize: 13, color: '#8b8b91' }}>
          Remind me later
        </button>
      </div>
    </div>
  );
}

// ── Event card ─────────────────────────────────────────────────
function EventCard({ event, hasRsvpd, onRsvp, onUnrsvp, showFeedback }: { event: GroupEvent; hasRsvpd: boolean; onRsvp: () => void; onUnrsvp: () => void; showFeedback?: boolean }) {
  const [showAttendees, setShowAttendees] = useState(false);
  const isPast = new Date(event.date + 'T' + event.time) < new Date();
  const spotsLeft = event.maxAttendees ? event.maxAttendees - event.attendees.length : null;
  const verifiedCount = event.attendees.filter(a => a.verified).length;
  const attendeeCount = event.attendees.length + (hasRsvpd ? 1 : 0);

  return (
    <div style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8, overflow: 'hidden' }}>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ ...mono, fontSize: 7, color: event.type === 'virtual' ? '#6C35DE' : '#27AE60', background: event.type === 'virtual' ? 'rgba(108,53,222,0.12)' : 'rgba(39,174,96,0.12)', border: `1px solid ${event.type === 'virtual' ? 'rgba(108,53,222,0.3)' : 'rgba(39,174,96,0.3)'}`, borderRadius: 3, padding: '2px 7px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{event.type}</span>
              {isPast && <span style={{ ...mono, fontSize: 7, color: '#8b8b91', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.06em' }}>Past</span>}
              {showFeedback && <span style={{ ...mono, fontSize: 7, color: '#E67E22', background: 'rgba(230,126,34,0.1)', border: '1px solid rgba(230,126,34,0.3)', borderRadius: 3, padding: '2px 7px', letterSpacing: '0.06em' }}>Feedback needed</span>}
            </div>
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>{event.title}</p>
            <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.04em' }}>
              {formatEventDate(event.date, event.time)} · {event.time} · {event.duration}
            </p>
          </div>
        </div>

        <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.55, marginBottom: 12 }}>{event.description}</p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: hasRsvpd || !isPast ? 12 : 0 }}>
          <button onClick={() => setShowAttendees(s => !s)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.04em' }}>{attendeeCount} attending · {verifiedCount + (hasRsvpd ? 0 : 0)} verified</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" style={{ transform: showAttendees ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
              <path d="M6 9l6 6 6-6" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          {spotsLeft !== null && spotsLeft > 0 && !isPast && (
            <span style={{ ...mono, fontSize: 8, color: spotsLeft <= 3 ? '#E67E22' : '#8b8b91', letterSpacing: '0.04em' }}>{spotsLeft} spot{spotsLeft !== 1 ? 's' : ''} left</span>
          )}
        </div>

        {showAttendees && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            {event.attendees.map(a => (
              <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: '4px 10px 4px 6px' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: a.color + '33', border: `1px solid ${a.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ ...inter, fontSize: 8, fontWeight: 800, color: a.color }}>{a.initial}</span>
                </div>
                <span style={{ ...inter, fontSize: 11, color: '#d1d1d6' }}>{a.name}</span>
                {a.verified && (
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z" fill="rgba(39,174,96,0.3)" stroke="#27AE60" strokeWidth="2" strokeLinejoin="round"/>
                    <path d="M9 12L11 14L15 10" stroke="#27AE60" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
            ))}
            {hasRsvpd && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.3)', borderRadius: 20, padding: '4px 10px 4px 6px' }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(108,53,222,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ ...inter, fontSize: 8, fontWeight: 800, color: '#6C35DE' }}>Y</span>
                </div>
                <span style={{ ...inter, fontSize: 11, color: '#6C35DE', fontWeight: 600 }}>You</span>
              </div>
            )}
          </div>
        )}

        {!isPast && (
          hasRsvpd ? (
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, padding: '10px', background: 'rgba(39,174,96,0.1)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 5, textAlign: 'center' }}>
                <span style={{ ...inter, fontSize: 12, fontWeight: 700, color: '#27AE60' }}>✓ Going</span>
              </div>
              <button onClick={onUnrsvp} style={{ padding: '10px 14px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 5, cursor: 'pointer', ...inter, fontSize: 12, color: '#8b8b91' }}>Cancel</button>
            </div>
          ) : (
            <button onClick={onRsvp} disabled={spotsLeft === 0} style={{ width: '100%', padding: '11px', background: spotsLeft === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(108,53,222,0.15)', border: spotsLeft === 0 ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(108,53,222,0.35)', borderRadius: 5, cursor: spotsLeft === 0 ? 'not-allowed' : 'pointer', ...inter, fontSize: 13, fontWeight: 700, color: spotsLeft === 0 ? '#8b8b91' : '#6C35DE' }}>
              {spotsLeft === 0 ? 'Full' : 'RSVP →'}
            </button>
          )
        )}
      </div>
    </div>
  );
}

// ── Chat view ──────────────────────────────────────────────────
function ChatView({ group, onBack, onReport }: { group: Group; onBack: () => void; onReport: (target: ReportTarget) => void }) {
  const { messages, send, reportMessage } = useGroupChat(group.id);
  const [input, setInput] = useState('');
  const [nudgeDismissed, setNudgeDismissed] = useState(() => {
    const stored = localStorage.getItem('redflaq_nudge_date_v1');
    return stored === new Date().toISOString().split('T')[0];
  });
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const tip = SAFETY_TIPS[new Date().getDay() % SAFETY_TIPS.length];

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    send(input);
    setInput('');
    inputRef.current?.focus();
  };

  const handleDismissNudge = () => {
    localStorage.setItem('redflaq_nudge_date_v1', new Date().toISOString().split('T')[0]);
    setNudgeDismissed(true);
  };

  const reportBtn = (
    <button onClick={() => onReport({ type: 'group', id: group.id, display: group.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', alignItems: 'center' }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M4 22v-7" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    </button>
  );

  return (
    <div style={{ background: '#08080f', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Header */}
      <BackBar label={group.name} onBack={onBack} right={reportBtn} />

      {/* Subheader */}
      <div style={{ padding: '8px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)', background: '#08080f' }}>
        <p style={{ ...mono, fontSize: 8, color: '#8b8b91', letterSpacing: '0.06em' }}>
          {group.memberCount} members · {group.members.filter(m => m.verified).length} verified
          {' · '}
          <span style={{ color: '#6C35DE' }}>Chat opens when all verified</span>
        </p>
      </div>

      {/* Safety nudge */}
      {!nudgeDismissed && (
        <div style={{ padding: '10px 16px', background: 'rgba(108,53,222,0.08)', borderBottom: '1px solid rgba(108,53,222,0.2)', display: 'flex', alignItems: 'flex-start', gap: 10, flexShrink: 0 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.5, flex: 1 }}>{tip}</p>
          <button onClick={handleDismissNudge} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, color: '#8b8b91', fontSize: 16, lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Message list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 8px' }}>
        {messages.map((msg, i) => {
          const isMe = !!msg.isMe;
          const showAvatar = !isMe && (i === 0 || messages[i-1].authorId !== msg.authorId);
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: 8, marginBottom: 10 }}>
              {/* Avatar (others only) */}
              <div style={{ width: 28, flexShrink: 0 }}>
                {showAvatar && !isMe && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: msg.authorColor + '22', border: `1px solid ${msg.authorColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ ...inter, fontSize: 11, fontWeight: 800, color: msg.authorColor }}>{msg.authorInitial}</span>
                  </div>
                )}
              </div>

              {/* Bubble */}
              <div style={{ maxWidth: '72%' }}>
                {showAvatar && !isMe && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ ...inter, fontSize: 11, fontWeight: 700, color: '#d1d1d6' }}>{msg.authorName}</span>
                    {msg.verified && <VerifiedBadge />}
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, flexDirection: isMe ? 'row-reverse' : 'row' }}>
                  <div style={{ padding: '10px 13px', background: isMe ? '#6C35DE' : '#111118', borderRadius: isMe ? '14px 14px 4px 14px' : '14px 14px 14px 4px', border: isMe ? 'none' : '1px solid rgba(255,255,255,0.07)' }}>
                    <p style={{ ...inter, fontSize: 13, color: '#ffffff', lineHeight: 1.5, wordBreak: 'break-word' }}>{msg.text}</p>
                  </div>
                  {/* Report button for others' messages */}
                  {!isMe && !msg.reported && (
                    <button onClick={() => { onReport({ type: 'message', id: msg.id, display: msg.authorName, excerpt: msg.text.slice(0, 80) }); reportMessage(msg.id); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 2, opacity: 0.4, flexShrink: 0 }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M4 22v-7" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  )}
                  {msg.reported && <span style={{ ...mono, fontSize: 7, color: '#C0392B', letterSpacing: '0.06em', flexShrink: 0 }}>Reported</span>}
                </div>
                <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.04em', marginTop: 4, textAlign: isMe ? 'right' : 'left' }}>{formatMsgTime(msg.timestamp)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {/* Input bar */}
      <div style={{ padding: '10px 12px', background: '#0d0d1a', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Message the group…"
          style={{ flex: 1, padding: '11px 14px', background: '#111118', border: '1px solid rgba(255,255,255,0.09)', borderRadius: 22, ...inter, fontSize: 14, color: '#ffffff', outline: 'none' }}
        />
        <button onClick={handleSend} disabled={!input.trim()} style={{ width: 40, height: 40, borderRadius: '50%', background: input.trim() ? '#6C35DE' : 'rgba(255,255,255,0.06)', border: 'none', cursor: input.trim() ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 0.2s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ── Onboarding modal ───────────────────────────────────────────
function OnboardingModal({ onAccept, onDismiss }: { onAccept: () => void; onDismiss: () => void }) {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(8,8,15,0.92)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <div style={{ background: '#111118', borderTop: '1px solid rgba(108,53,222,0.3)', borderRadius: '16px 16px 0 0', padding: '28px 24px 36px', maxWidth: 480, width: '100%' }}>
        <div style={{ width: 32, height: 3, background: 'rgba(255,255,255,0.15)', borderRadius: 2, margin: '0 auto 24px' }} />
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/>
            <circle cx="9" cy="7" r="4" stroke="#6C35DE" strokeWidth="1.8"/>
            <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>
        <h2 style={{ ...inter, fontSize: 20, fontWeight: 900, color: '#ffffff', textAlign: 'center', letterSpacing: '-0.02em', marginBottom: 12 }}>Before you start</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
          {[
            { icon: '💜', text: 'SafeMatch is a platonic connection tool. Not a dating or romantic matching service.' },
            { icon: '🔒', text: 'Your answers are stored only on your device. They are never uploaded or shared.' },
            { icon: '✓',  text: 'All connections are friendship-first. You choose who you engage with and when.' },
            { icon: '⚡', text: 'RedFlaq verifies no profiles. Always run a safety check before meeting anyone.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>{item.text}</p>
            </div>
          ))}
        </div>
        <button onClick={onAccept} style={{ width: '100%', padding: '16px', background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>I Understand — Start Quiz</button>
        <button onClick={onDismiss} style={{ width: '100%', padding: '12px', background: 'none', border: 'none', cursor: 'pointer', ...inter, fontSize: 14, color: '#8b8b91' }}>Not now</button>
      </div>
    </div>
  );
}

// ── Section complete ───────────────────────────────────────────
function SectionComplete({ letter, title, nextTitle, isLast, onContinue }: { letter: string; title: string; nextTitle?: string; isLast: boolean; onContinue: () => void }) {
  return (
    <div style={{ background: '#08080f', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px', textAlign: 'center' }}>
      <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ ...mono, fontSize: 9, color: '#27AE60', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Section {letter} Complete</p>
      <h2 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 10 }}>{title}</h2>
      <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, marginBottom: 32, maxWidth: 280 }}>
        {isLast ? "You've completed all sections. Your profile is ready." : `Saved. Next: Section ${letter === 'A' ? 'B' : letter === 'B' ? 'C' : letter === 'C' ? 'D' : 'E'} — ${nextTitle}`}
      </p>
      <button onClick={onContinue} style={{ ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff', background: isLast ? '#C0392B' : '#6C35DE', border: 'none', borderRadius: 6, padding: '16px 36px', cursor: 'pointer' }}>
        {isLast ? 'See My Matches →' : 'Continue →'}
      </button>
    </div>
  );
}

// ── Quiz view ──────────────────────────────────────────────────
function QuizView({ onComplete, onBack }: { onComplete: () => void; onBack: () => void }) {
  const { state, answer, completeSection, progress } = useQuiz();
  const [sectionIdx, setSectionIdx] = useState(() => {
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
  const totalAnsweredInSection = section.questions.filter(q => state.answers[q.id] !== undefined).length;

  useEffect(() => { setSelected(savedAnswer !== undefined ? savedAnswer : null); }, [question.id, savedAnswer]);
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [question.id]);

  const handleSelect = (idx: number) => {
    setSelected(idx);
    answer(question.id, idx);
    setTimeout(() => {
      if (questionIdx < section.questions.length - 1) { setQuestionIdx(qi => qi + 1); }
      else { completeSection(section.letter); setShowSectionComplete(true); }
    }, 220);
  };

  const handleSectionContinue = () => {
    setShowSectionComplete(false);
    if (sectionIdx === SECTIONS.length - 1) { onComplete(); }
    else { setSectionIdx(si => si + 1); setQuestionIdx(0); }
  };

  if (showSectionComplete) {
    return <SectionComplete letter={section.letter} title={section.title} nextTitle={SECTIONS[sectionIdx + 1]?.title} isLast={sectionIdx === SECTIONS.length - 1} onContinue={handleSectionContinue} />;
  }

  return (
    <div ref={scrollRef} style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '56px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', position: 'sticky', top: 0, background: '#08080f', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, padding: 0 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connect</span>
          </button>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.06em' }}>{progress}% complete</span>
        </div>
        <ProgressBar pct={progress} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
          <div>
            <p style={{ ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>Section {section.letter} — {section.title}</p>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>Question {questionIdx + 1} of {section.questions.length}</p>
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {section.questions.map((_, i) => (
              <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: i < totalAnsweredInSection ? '#6C35DE' : i === totalAnsweredInSection ? 'rgba(108,53,222,0.4)' : 'rgba(255,255,255,0.1)', transition: 'background 0.2s' }} />
            ))}
          </div>
        </div>
      </div>
      <div style={{ padding: '32px 20px' }}>
        <h2 style={{ ...inter, fontSize: 20, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.3, marginBottom: 28 }}>{question.text}</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {question.options.map((opt, i) => {
            const isSel = selected === i;
            return (
              <button key={i} onClick={() => handleSelect(i)} style={{ textAlign: 'left', padding: '16px', background: isSel ? 'rgba(108,53,222,0.12)' : '#111118', border: isSel ? '2px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)', borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14, transition: 'all 0.15s' }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, background: isSel ? '#6C35DE' : 'transparent', border: isSel ? '2px solid #6C35DE' : '2px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}>
                  {isSel && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <p style={{ ...inter, fontSize: 14, lineHeight: 1.45, color: isSel ? '#ffffff' : '#d1d1d6', fontWeight: isSel ? 600 : 400 }}>{opt}</p>
              </button>
            );
          })}
        </div>
        <div style={{ marginTop: 32, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SECTIONS.map((s, i) => {
            const done = state.completedSections.includes(s.letter);
            const current = i === sectionIdx;
            return (
              <div key={s.letter} style={{ ...mono, fontSize: 8, letterSpacing: '0.1em', color: current ? '#ffffff' : done ? '#27AE60' : '#8b8b91', background: current ? '#6C35DE' : done ? 'rgba(39,174,96,0.12)' : '#111118', border: `1px solid ${current ? '#6C35DE' : done ? 'rgba(39,174,96,0.3)' : 'rgba(255,255,255,0.08)'}`, borderRadius: 4, padding: '4px 8px' }}>
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
function ResultsView({ onRetake, onBack, onBrowseGroups }: { onRetake: () => void; onBack: () => void; onBrowseGroups: () => void }) {
  const topGroups = [...GROUPS].sort((a, b) => b.matchScore - a.matchScore).slice(0, 3);
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '56px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, marginBottom: 20, padding: 0 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Connect</span>
        </button>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 10 }}>Your SafeMatch Results</p>
        <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          4 Compatible <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Connections</span>
        </h1>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>Based on your quiz answers across values, safety awareness, and social style.</p>
      </div>
      <div style={{ padding: '20px 20px 0' }}>
        <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 6, padding: '12px 14px', marginBottom: 24, display: 'flex', gap: 10 }}>
          <span style={{ fontSize: 14, flexShrink: 0 }}>⚠️</span>
          <p style={{ ...inter, fontSize: 12, color: '#D97706', lineHeight: 1.55 }}><strong>Demo results.</strong> Mock profiles for demonstration. Always run a RedFlaq check before meeting anyone.</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
          {MATCHES.map((m, i) => (
            <div key={i} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
              <div style={{ height: 2, background: m.color, width: `${m.score}%` }} />
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0, background: m.color + '22', border: `2px solid ${m.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ ...inter, fontSize: 18, fontWeight: 900, color: m.color }}>{m.initial}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                      <p style={{ ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{m.name}, {m.age}</p>
                      <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: m.color, background: m.color + '1a', border: `1px solid ${m.color}33`, borderRadius: 3, padding: '2px 7px' }}>{m.score}%</span>
                    </div>
                    <p style={{ ...mono, fontSize: 9, color: '#8b8b91' }}>{m.city}</p>
                  </div>
                </div>
                <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 12 }}>{m.bio}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {m.tags.map(tag => <span key={tag} style={{ ...mono, fontSize: 8, color: '#8b8b91', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '3px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Matched Groups</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {topGroups.map(g => {
            const clr = CATEGORY_COLOR[g.category];
            return (
              <div key={g.id} style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ height: 2, background: clr }} />
                <div style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff' }}>{g.name}</p>
                      <span style={{ ...mono, fontSize: 8, color: clr, background: clr + '18', border: `1px solid ${clr}33`, borderRadius: 3, padding: '2px 6px', flexShrink: 0 }}>{g.matchScore}%</span>
                    </div>
                    <p style={{ ...mono, fontSize: 8, color: '#8b8b91' }}>{g.memberCount} members · {g.province}</p>
                  </div>
                  {g.verificationRequired && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C35DE" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onBrowseGroups} style={{ width: '100%', padding: '14px', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 14, fontWeight: 700, color: '#6C35DE', marginBottom: 16 }}>Browse All Groups →</button>
        <button onClick={onRetake} style={{ width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, ...inter, fontSize: 13, fontWeight: 600, color: '#8b8b91', cursor: 'pointer' }}>Retake Quiz</button>
      </div>
    </div>
  );
}

// ── Home view ──────────────────────────────────────────────────
function HomeView({ quizStarted, quizComplete, progress, onStartQuiz, onResumeQuiz, onViewResults, onBrowseGroups }: { quizStarted: boolean; quizComplete: boolean; progress: number; onStartQuiz: () => void; onResumeQuiz: () => void; onViewResults: () => void; onBrowseGroups: () => void }) {
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <div style={{ padding: '56px 20px 20px' }}>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Connect</p>
        <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>{"You're Not "}<span style={{ ...playfair, fontStyle: 'italic', color: '#C0392B' }}>Alone.</span></h1>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, marginBottom: 28 }}>Helplines available now. SafeMatch quiz to find compatible connections. Survivor groups to join.</p>
        <div style={{ background: '#111118', border: quizComplete ? '1px solid rgba(39,174,96,0.3)' : '1px solid rgba(108,53,222,0.3)', borderRadius: 10, overflow: 'hidden', marginBottom: 12 }}>
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
            <p style={{ ...mono, fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10, color: quizComplete ? '#27AE60' : '#6C35DE' }}>{quizComplete ? '✓ SafeMatch Complete' : 'SafeMatch Quiz'}</p>
            <h2 style={{ ...inter, fontSize: 18, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.015em', marginBottom: 8, lineHeight: 1.3 }}>{quizComplete ? 'Your profile is ready' : "Find people who understand what you've been through"}</h2>
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55, marginBottom: 18 }}>{quizComplete ? '4 compatible connections found based on your answers.' : '40 questions across 5 sections. Friendship-first. Stored locally.'}</p>
            <button onClick={quizComplete ? onViewResults : quizStarted ? onResumeQuiz : onStartQuiz} style={{ width: '100%', padding: '14px', background: quizComplete ? '#27AE60' : '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 14, fontWeight: 800, color: '#ffffff' }}>
              {quizComplete ? 'View My Matches →' : quizStarted ? `Resume Quiz (${progress}%)` : 'Start the Quiz →'}
            </button>
          </div>
        </div>
        <button onClick={onBrowseGroups} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 24 }}>
          <div style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 10, padding: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 6 }}>Survivor Groups</p>
              <p style={{ ...inter, fontSize: 15, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Find Your Circle</p>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>{GROUPS.length} groups · Healing · Legal · Financial</p>
            </div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M9 18l6-6-6-6" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </button>
        <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.35)', borderRadius: 8, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#C0392B" strokeWidth="1.8" fill="rgba(192,57,43,0.15)"/><path d="M12 9v4M12 17h.01" stroke="#C0392B" strokeWidth="2" strokeLinecap="round"/></svg>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.4 }}>In immediate danger? Call <span style={{ color: '#C0392B', fontWeight: 700 }}>10111</span> or <span style={{ color: '#C0392B', fontWeight: 700 }}>112</span></p>
        </div>
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Crisis Lines</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RESOURCES.map((r, i) => (
            <a key={i} href={"tel:" + r.line.replace(/\s/g, '')} style={{ background: r.bg, border: "1px solid " + r.border, borderRadius: 8, padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none' }}>
              <p style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{r.name}</p>
              <p style={{ ...mono, fontSize: 15, fontWeight: 700, color: r.color }}>{r.line}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Groups discovery view ──────────────────────────────────────
function GroupsView({ quizComplete, joinedGroups, onSelectGroup, onCreateGroup, onBack }: { quizComplete: boolean; joinedGroups: string[]; onSelectGroup: (g: Group) => void; onCreateGroup: () => void; onBack: () => void }) {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const filtered = activeCategory === 'all' ? GROUPS : GROUPS.filter(g => g.category === activeCategory);
  const sorted = quizComplete ? [...filtered].sort((a, b) => b.matchScore - a.matchScore) : filtered;
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <BackBar label="Connect" onBack={onBack} />
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>Survivor Groups</p>
        <h1 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>Find Your <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Circle</span></h1>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 16 }}>{quizComplete ? 'Groups matched to your SafeMatch profile, highest first.' : 'Private groups for women navigating healing, legal rights, and more.'}</p>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 20, scrollbarWidth: 'none' }}>
          {GROUP_CATEGORIES.map(cat => {
            const active = activeCategory === cat.id;
            return <button key={cat.id} onClick={() => setActiveCategory(cat.id)} style={{ flexShrink: 0, padding: '7px 14px', background: active ? '#6C35DE' : '#111118', border: active ? '1px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)', borderRadius: 20, cursor: 'pointer', ...mono, fontSize: 9, color: active ? '#ffffff' : '#8b8b91', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>{cat.label}</button>;
          })}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {sorted.map(g => {
            const clr = CATEGORY_COLOR[g.category];
            const joined = joinedGroups.includes(g.id);
            return (
              <button key={g.id} onClick={() => onSelectGroup(g)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: 3, background: clr }} />
                  <div style={{ padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                          <p style={{ ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff' }}>{g.name}</p>
                          {quizComplete && <span style={{ ...mono, fontSize: 8, color: clr, background: clr + '18', border: `1px solid ${clr}33`, borderRadius: 3, padding: '2px 6px', flexShrink: 0 }}>{g.matchScore}% match</span>}
                          {joined && <span style={{ ...mono, fontSize: 8, color: '#27AE60', background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', borderRadius: 3, padding: '2px 6px', flexShrink: 0 }}>Requested</span>}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ ...mono, fontSize: 8, color: clr, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{g.categoryLabel}</span>
                          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>·</span>
                          <span style={{ ...mono, fontSize: 8, color: '#8b8b91' }}>{g.memberCount} members</span>
                          <span style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)' }}>·</span>
                          <span style={{ ...mono, fontSize: 8, color: '#8b8b91' }}>{g.province}</span>
                        </div>
                      </div>
                      {g.verificationRequired && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C35DE" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/></svg>}
                    </div>
                    <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55, marginBottom: 12 }}>{g.description}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                      {g.tags.map(tag => <span key={tag} style={{ ...mono, fontSize: 7, color: '#8b8b91', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '3px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tag}</span>)}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
        <div style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8, padding: '18px', textAlign: 'center', marginBottom: 24 }}>
          <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Start a group</p>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 14 }}>Don't see what you need? Create a group for women in your area or situation.</p>
          <button onClick={onCreateGroup} style={{ padding: '10px 20px', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)', borderRadius: 4, cursor: 'pointer', ...inter, fontSize: 13, fontWeight: 700, color: '#6C35DE' }}>Create a Group →</button>
        </div>
      </div>
    </div>
  );
}

// ── Group detail view ──────────────────────────────────────────
function GroupDetailView({ group, joined, onBack, onRequestJoin, onOpenChat, onReport }: { group: Group; joined: boolean; onBack: () => void; onRequestJoin: () => void; onOpenChat: () => void; onReport: (t: ReportTarget) => void }) {
  const clr = CATEGORY_COLOR[group.category];
  const { events, rsvp, unrsvp, submitFeedback, hasRsvpd, hasFeedback, pendingFeedback } = useGroupEvents(group.id);
  const [activeFeedback, setActiveFeedback] = useState<GroupEvent | null>(() => pendingFeedback[0] || null);

  const upcomingEvents = events.filter(e => new Date(e.date + 'T' + e.time) >= new Date());
  const pastEvents     = events.filter(e => new Date(e.date + 'T' + e.time) < new Date());

  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 120 }}>
      <BackBar label="Groups" onBack={onBack} right={
        <button onClick={() => onReport({ type: 'group', id: group.id, display: group.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22v-7" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </button>
      } />

      {/* Hero */}
      <div style={{ padding: '0 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ height: 4, background: clr, margin: '0 -20px 20px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ ...mono, fontSize: 8, color: clr, background: clr + '18', border: `1px solid ${clr}33`, borderRadius: 3, padding: '3px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{group.categoryLabel}</span>
          {group.verificationRequired && <span style={{ ...mono, fontSize: 8, color: '#6C35DE', background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.3)', borderRadius: 3, padding: '3px 8px' }}>Verification Required</span>}
        </div>
        <h1 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 8 }}>{group.name}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91' }}>{group.memberCount} members</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', ...mono, fontSize: 9 }}>·</span>
          <span style={{ ...mono, fontSize: 9, color: '#8b8b91' }}>{group.province}</span>
          <span style={{ color: 'rgba(255,255,255,0.2)', ...mono, fontSize: 9 }}>·</span>
          <span style={{ ...mono, fontSize: 9, color: '#27AE60' }}>{group.members.filter(m => m.verified).length} verified</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {group.tags.map(tag => <span key={tag} style={{ ...mono, fontSize: 7, color: '#8b8b91', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '3px 7px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{tag}</span>)}
        </div>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* About */}
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>About</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
          {group.about.map((para, i) => <p key={i} style={{ ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.7 }}>{para}</p>)}
        </div>

        {/* Chat status notice */}
        <div style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8, padding: '14px 16px', marginBottom: 24, display: 'flex', gap: 10 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}>
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55 }}>
            <span style={{ color: '#6C35DE', fontWeight: 700 }}>Chat opens when all members are verified.</span>{' '}Once approved, chat becomes available when every participant in a thread has a valid RedFlaq check.
          </p>
        </div>

        {/* Events */}
        {events.length > 0 && (
          <>
            <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Events</p>
            {upcomingEvents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                {upcomingEvents.map(ev => (
                  <EventCard key={ev.id} event={ev} hasRsvpd={hasRsvpd(ev.id)} onRsvp={() => rsvp(ev.id)} onUnrsvp={() => unrsvp(ev.id)} />
                ))}
              </div>
            )}
            {pastEvents.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 12 }}>
                {pastEvents.map(ev => (
                  <EventCard key={ev.id} event={ev} hasRsvpd={hasRsvpd(ev.id)} onRsvp={() => rsvp(ev.id)} onUnrsvp={() => unrsvp(ev.id)} showFeedback={hasRsvpd(ev.id) && !hasFeedback(ev.id)} />
                ))}
              </div>
            )}
            <div style={{ marginBottom: 24 }} />
          </>
        )}

        {/* Members */}
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 14 }}>Members ({group.members.length} shown)</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginBottom: 8 }}>
          {group.members.map((m: GroupMember) => (
            <div key={m.id} style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: m.color + '22', border: `1px solid ${m.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ ...inter, fontSize: 14, fontWeight: 800, color: m.color }}>{m.initial}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                    <p style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>{m.name}</p>
                    {m.verified && <VerifiedBadge />}
                    {m.role !== 'member' && <span style={{ ...mono, fontSize: 7, color: '#6C35DE', background: 'rgba(108,53,222,0.1)', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 3, padding: '2px 6px', letterSpacing: '0.06em', textTransform: 'capitalize' }}>{m.role}</span>}
                    <button onClick={() => onReport({ type: 'member', id: m.id, display: m.name })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 1, opacity: 0.3, marginLeft: 'auto' }}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 22v-7" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                  <p style={{ ...mono, fontSize: 8, color: '#8b8b91', marginBottom: 4 }}>{m.province}</p>
                  <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.55 }}>{m.bio}</p>
                </div>
              </div>
            </div>
          ))}
          <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', paddingTop: 12 }}>+ {group.memberCount - group.members.length} more members not shown</p>
        </div>
      </div>

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 72, left: 0, right: 0, maxWidth: 480, margin: '0 auto', padding: '12px 20px', background: '#08080f', borderTop: '1px solid rgba(255,255,255,0.06)', zIndex: 20 }}>
        {joined ? (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onOpenChat} style={{ flex: 1, padding: '13px', background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 14, fontWeight: 800, color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Open Group Chat
            </button>
          </div>
        ) : (
          <button onClick={onRequestJoin} style={{ width: '100%', padding: '15px', background: clr, border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
            Request to Join
          </button>
        )}
      </div>

      {/* Feedback modal overlay */}
      {activeFeedback && (
        <FeedbackModal
          event={activeFeedback}
          onSubmit={fb => { submitFeedback(fb); setActiveFeedback(null); }}
          onDismiss={() => setActiveFeedback(null)}
        />
      )}
    </div>
  );
}

// ── Verification gate ──────────────────────────────────────────
function VerificationGateView({ group, checks, onGoCheck, onBack }: { group: Group; checks: ReturnType<typeof useSavedChecks>['checks']; onGoCheck?: () => void; onBack: () => void }) {
  const latest = checks.length > 0 ? checks.reduce((a, b) => new Date(a.savedAt) > new Date(b.savedAt) ? a : b) : null;
  const days = latest ? daysSince(latest.savedAt) : null;
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <BackBar label={group.name} onBack={onBack} />
      <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#6C35DE" strokeWidth="1.8"/><path d="M7 11V7a5 5 0 0110 0v4" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/></svg>
        </div>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Verification Required</p>
        <h2 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12, maxWidth: 300 }}>This group requires a recent safety check</h2>
        <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, marginBottom: 28, maxWidth: 300 }}><strong style={{ color: '#d1d1d6' }}>{group.name}</strong> requires all members to have completed a RedFlaq check within the last 90 days.</p>
        <div style={{ width: '100%', maxWidth: 320, background: '#111118', border: `1px solid ${latest && days !== null && days < 90 ? 'rgba(39,174,96,0.3)' : 'rgba(192,57,43,0.3)'}`, borderRadius: 8, padding: '16px', marginBottom: 28 }}>
          <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Your Check Status</p>
          {latest && days !== null ? (
            <div>
              <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: days < 90 ? '#27AE60' : '#C0392B', marginBottom: 4 }}>{days < 90 ? `✓ Valid (${days} days ago)` : `✗ Expired (${days} days ago)`}</p>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Last check: {latest.name}</p>
            </div>
          ) : (
            <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#C0392B' }}>✗ No check found on this device</p>
          )}
        </div>
        <div style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onGoCheck} style={{ width: '100%', padding: '15px', background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 15, fontWeight: 800, color: '#ffffff' }}>Run a Safety Check — R99</button>
          <button onClick={onBack} style={{ padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 13, fontWeight: 600, color: '#8b8b91' }}>Go Back</button>
        </div>
        <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.06em', marginTop: 24, maxWidth: 280, lineHeight: 1.6 }}>Verification confirms only that you've run a check. Your check results are never shared with any group.</p>
      </div>
    </div>
  );
}

// ── POPIA join consent ─────────────────────────────────────────
function JoinConsentView({ group, onConfirm, onBack }: { group: Group; onConfirm: () => void; onBack: () => void }) {
  const [accepted, setAccepted] = useState(false);
  const clr = CATEGORY_COLOR[group.category];
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <BackBar label={group.name} onBack={onBack} />
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(108,53,222,0.12)', border: '1px solid rgba(108,53,222,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Join Request — Privacy Consent</p>
        <h2 style={{ ...inter, fontSize: 20, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>{group.name}</h2>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 24 }}>Before your request is submitted, review what information will be shared.</p>
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '16px', marginBottom: 12 }}>
          <p style={{ ...mono, fontSize: 9, color: '#27AE60', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>What will be shared</p>
          {['Your display name (first name and initial only)', 'Your province', 'Your SafeMatch category interests', 'That you have a RedFlaq account'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 3 ? 10 : 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <p style={{ ...inter, fontSize: 13, color: '#d1d1d6', lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>
        <div style={{ background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '16px', marginBottom: 20 }}>
          <p style={{ ...mono, fontSize: 9, color: '#C0392B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>What will NOT be shared</p>
          {['Your ID number or any check results', 'Your journal entries or documented incidents', 'Your full name, address, or contact details', 'Your quiz answers or compatibility scores'].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: i < 3 ? 10 : 0 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 2 }}><path d="M18 6L6 18M6 6l12 12" stroke="#C0392B" strokeWidth="2" strokeLinecap="round"/></svg>
              <p style={{ ...inter, fontSize: 13, color: '#d1d1d6', lineHeight: 1.5 }}>{item}</p>
            </div>
          ))}
        </div>
        <div style={{ background: 'rgba(108,53,222,0.06)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8, padding: '14px 16px', marginBottom: 24 }}>
          <p style={{ ...mono, fontSize: 8, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>POPIA Notice</p>
          <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.6 }}>Processing conducted under <strong style={{ color: '#d1d1d6' }}>POPIA Section 11(1)(a)</strong> (consent). You may withdraw at any time; data deleted within 30 days. RedFlaq acts as responsible party.</p>
        </div>
        <button onClick={() => setAccepted(a => !a)} style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '0 0 24px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{ width: 20, height: 20, borderRadius: 4, flexShrink: 0, background: accepted ? '#6C35DE' : 'transparent', border: accepted ? '2px solid #6C35DE' : '2px solid rgba(255,255,255,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1, transition: 'all 0.15s' }}>
            {accepted && <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </div>
          <p style={{ ...inter, fontSize: 13, color: '#d1d1d6', lineHeight: 1.6 }}>I have read and understand what will be shared. I consent to this processing under POPIA and want to request to join <strong>{group.name}</strong>.</p>
        </button>
        <button onClick={onConfirm} disabled={!accepted} style={{ width: '100%', padding: '15px', background: accepted ? clr : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, cursor: accepted ? 'pointer' : 'not-allowed', ...inter, fontSize: 15, fontWeight: 800, color: accepted ? '#ffffff' : '#8b8b91', transition: 'all 0.2s', marginBottom: 10 }}>
          Submit Request to Join
        </button>
        <button onClick={onBack} style={{ width: '100%', padding: '13px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 13, color: '#8b8b91' }}>Cancel</button>
      </div>
    </div>
  );
}

// ── Create group form ──────────────────────────────────────────
function CreateGroupView({ onBack }: { onBack: () => void }) {
  const [form, setForm] = useState({ name: '', category: '', province: '', description: '', rules: '' });
  const [submitted, setSubmitted] = useState(false);
  const canSubmit = form.name.trim() && form.category && form.province && form.description.trim().length >= 20;
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputStyle: React.CSSProperties = { width: '100%', padding: '13px 14px', background: '#111118', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, ...inter, fontSize: 14, color: '#ffffff', outline: 'none', boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 8 };
  if (submitted) {
    return (
      <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
        <BackBar label="Groups" onBack={onBack} />
        <div style={{ padding: '40px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(39,174,96,0.12)', border: '1px solid rgba(39,174,96,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p style={{ ...mono, fontSize: 9, color: '#27AE60', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Submitted</p>
          <h2 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 12 }}>{form.name}</h2>
          <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.7, marginBottom: 32, maxWidth: 300 }}>Your group has been submitted for review. We'll notify you when it goes live — usually within 48 hours.</p>
          <button onClick={onBack} style={{ padding: '14px 32px', background: '#6C35DE', border: 'none', borderRadius: 6, cursor: 'pointer', ...inter, fontSize: 14, fontWeight: 800, color: '#ffffff' }}>Back to Groups</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      <BackBar label="Groups" onBack={onBack} />
      <div style={{ padding: '24px 20px 0' }}>
        <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>New Group</p>
        <h2 style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>Create a Group</h2>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 28 }}>Groups are reviewed before going live. Be specific about who the group is for.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div><label style={labelStyle}>Group Name</label><input value={form.name} onChange={set('name')} maxLength={60} placeholder="e.g. Healing Circle East London" style={inputStyle} /></div>
          <div><label style={labelStyle}>Category</label><select value={form.category} onChange={set('category')} style={{ ...inputStyle, appearance: 'none' }}><option value="">Select a category</option>{GROUP_CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></div>
          <div><label style={labelStyle}>Province</label><select value={form.province} onChange={set('province')} style={{ ...inputStyle, appearance: 'none' }}><option value="">Select a province</option>{SA_PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
          <div>
            <label style={labelStyle}>Description <span style={{ color: 'rgba(255,255,255,0.25)' }}>({form.description.length}/200)</span></label>
            <textarea value={form.description} onChange={set('description')} maxLength={200} rows={4} placeholder="Who is this group for? What do you discuss?" style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} />
            {form.description.length > 0 && form.description.length < 20 && <p style={{ ...mono, fontSize: 8, color: '#C0392B', marginTop: 6 }}>Minimum 20 characters</p>}
          </div>
          <div><label style={labelStyle}>Group Rules <span style={{ color: 'rgba(255,255,255,0.25)' }}>Optional</span></label><textarea value={form.rules} onChange={set('rules')} maxLength={400} rows={4} placeholder="e.g. No victim-blaming. Confidentiality required." style={{ ...inputStyle, resize: 'none', lineHeight: 1.6 }} /></div>
          <div style={{ background: 'rgba(108,53,222,0.06)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8, padding: '14px 16px' }}>
            <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.6 }}>By submitting, you agree to moderate this group in line with RedFlaq community guidelines.</p>
          </div>
          <button onClick={() => setSubmitted(true)} disabled={!canSubmit} style={{ width: '100%', padding: '15px', background: canSubmit ? '#6C35DE' : 'rgba(255,255,255,0.06)', border: 'none', borderRadius: 6, cursor: canSubmit ? 'pointer' : 'not-allowed', ...inter, fontSize: 15, fontWeight: 800, color: canSubmit ? '#ffffff' : '#8b8b91', transition: 'all 0.2s' }}>
            Submit for Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────
type ConnectView = 'home' | 'quiz' | 'results' | 'groups' | 'group-detail' | 'verification-gate' | 'join-consent' | 'create-group' | 'chat';

export default function ConnectScreen({ onGoCheck }: { onGoCheck?: () => void }) {
  const { state, start, reset, progress } = useQuiz();
  const { checks } = useSavedChecks();
  const [view, setView] = useState<ConnectView>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groupsFrom, setGroupsFrom] = useState<'home' | 'results'>('home');
  const [joinedGroups, setJoinedGroups] = useState<string[]>(() => {
    try { return JSON.parse(localStorage.getItem('redflaq_groups_v1') || '[]'); } catch { return []; }
  });
  const [reportTarget, setReportTarget] = useState<ReportTarget | null>(null);

  const quizStarted = !!state.startedAt;
  const quizComplete = state.completed;
  const verified = isVerified(checks);

  useEffect(() => { if (quizComplete && view === 'quiz') setView('results'); }, [quizComplete]);

  const goToGroups = (from: 'home' | 'results') => { setGroupsFrom(from); setView('groups'); };

  const openGroup = (group: Group) => { setSelectedGroup(group); setView('group-detail'); };

  const handleJoinRequest = () => {
    if (!selectedGroup) return;
    if (selectedGroup.verificationRequired && !verified) { setView('verification-gate'); }
    else { setView('join-consent'); }
  };

  const handleJoinConfirm = () => {
    if (!selectedGroup) return;
    const updated = [...joinedGroups, selectedGroup.id];
    setJoinedGroups(updated);
    localStorage.setItem('redflaq_groups_v1', JSON.stringify(updated));
    setView('group-detail');
  };

  if (view === 'quiz') return <QuizView onComplete={() => setView('results')} onBack={() => setView('home')} />;
  if (view === 'results') return <ResultsView onRetake={() => { reset(); setView('home'); }} onBack={() => setView('home')} onBrowseGroups={() => goToGroups('results')} />;
  if (view === 'groups') return <GroupsView quizComplete={quizComplete} joinedGroups={joinedGroups} onSelectGroup={openGroup} onCreateGroup={() => setView('create-group')} onBack={() => setView(groupsFrom === 'results' ? 'results' : 'home')} />;

  if (view === 'group-detail' && selectedGroup) {
    return (
      <>
        <GroupDetailView group={selectedGroup} joined={joinedGroups.includes(selectedGroup.id)} onBack={() => setView('groups')} onRequestJoin={handleJoinRequest} onOpenChat={() => setView('chat')} onReport={setReportTarget} />
        {reportTarget && <ReportModal target={reportTarget} onSubmit={() => {}} onClose={() => setReportTarget(null)} />}
      </>
    );
  }

  if (view === 'verification-gate' && selectedGroup) return <VerificationGateView group={selectedGroup} checks={checks} onGoCheck={onGoCheck} onBack={() => setView('group-detail')} />;
  if (view === 'join-consent' && selectedGroup) return <JoinConsentView group={selectedGroup} onConfirm={handleJoinConfirm} onBack={() => setView('group-detail')} />;
  if (view === 'create-group') return <CreateGroupView onBack={() => setView('groups')} />;

  if (view === 'chat' && selectedGroup) {
    return (
      <>
        <ChatView group={selectedGroup} onBack={() => setView('group-detail')} onReport={setReportTarget} />
        {reportTarget && <ReportModal target={reportTarget} onSubmit={() => {}} onClose={() => setReportTarget(null)} />}
      </>
    );
  }

  return (
    <>
      <HomeView quizStarted={quizStarted} quizComplete={quizComplete} progress={progress} onStartQuiz={() => setShowOnboarding(true)} onResumeQuiz={() => setView('quiz')} onViewResults={() => setView('results')} onBrowseGroups={() => goToGroups('home')} />
      {showOnboarding && <OnboardingModal onAccept={() => { setShowOnboarding(false); start(); setView('quiz'); }} onDismiss={() => setShowOnboarding(false)} />}
    </>
  );
}
