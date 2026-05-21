import React, { useState } from 'react';
import { JournalEntry } from '../hooks/useJournal';
import { TAGS, getTag, detectPatterns } from '../data/tags';
import { SIGNALS } from '../data/signals';

// ── Style constants ────────────────────────────────────────────
const inter: React.CSSProperties  = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties   = { fontFamily: "'JetBrains Mono', monospace" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
function fmtDate(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });
}
function fmtShort(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-ZA', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ── Tag chip ───────────────────────────────────────────────────
function TagChip({ id, active, onToggle }: { id: string; active: boolean; onToggle: () => void }) {
  const t = getTag(id)!;
  return (
    <button
      onClick={onToggle}
      style={{
        ...mono, fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
        color: active ? '#ffffff' : t.color,
        background: active ? t.color : t.bg,
        border: `1px solid ${active ? t.color : t.border}`,
        borderRadius: 4, padding: '6px 10px', cursor: 'pointer',
        whiteSpace: 'nowrap', transition: 'all 0.12s',
        fontWeight: active ? 700 : 500,
      }}
    >
      {t.label}
    </button>
  );
}

// ── Pattern nudge ──────────────────────────────────────────────
function PatternNudge({
  patterns,
  onDismiss,
  onGoSignals,
}: {
  patterns: ReturnType<typeof detectPatterns>;
  onDismiss: () => void;
  onGoSignals?: (signalId: string) => void;
}) {
  const top = patterns[0];
  if (!top) return null;
  const signal = top.tag.signalId ? SIGNALS.find(s => s.id === top.tag.signalId) : null;

  return (
    <div style={{
      background: 'rgba(192,57,43,0.08)',
      border: '1px solid rgba(192,57,43,0.3)',
      borderLeft: '3px solid #C0392B',
      borderRadius: '0 8px 8px 0',
      padding: '14px 16px',
      marginBottom: 20,
      position: 'relative',
    }}>
      <button
        onClick={onDismiss}
        style={{ position: 'absolute', top: 10, right: 10, background: 'none', border: 'none', cursor: 'pointer', padding: 4, opacity: 0.5 }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="#ffffff" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      <p style={{ ...mono, fontSize: 8, color: '#C0392B', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
        Pattern Detected
      </p>
      <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
        <span style={{ color: top.tag.color }}>{top.tag.label}</span> noted {top.count} times
      </p>
      <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.55, marginBottom: patterns.length > 1 || signal ? 12 : 0 }}>
        Repeated patterns across entries may indicate a behavioural cycle.
        {patterns.length > 1 && (
          <> Also: {patterns.slice(1, 3).map(p => <span key={p.tag.id} style={{ color: p.tag.color }}> {p.tag.label} ({p.count}×)</span>)}.</>
        )}
      </p>
      {signal && onGoSignals && (
        <button
          onClick={() => onGoSignals(signal.id)}
          style={{
            ...inter, fontSize: 12, fontWeight: 700, color: '#C0392B',
            background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)',
            borderRadius: 4, padding: '7px 12px', cursor: 'pointer',
          }}
        >
          Read: {signal.title} →
        </button>
      )}
    </div>
  );
}

// ── Entry card ─────────────────────────────────────────────────
function EntryCard({
  entry,
  onEdit,
  onDelete,
}: {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isLong = entry.text.length > 200;

  return (
    <div style={{
      background: '#111118',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      {/* Date strip */}
      <div style={{
        background: '#0d0d1a',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        padding: '8px 14px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {fmtDate(entry.date)}
        </p>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={onEdit}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', opacity: 0.6 }}
            title="Edit"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <button
            onClick={onDelete}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', opacity: 0.6 }}
            title="Delete"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M8 6V4H16V6M19 6l-.867 13.143A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.857L5 6" stroke="#C0392B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Tags */}
      {entry.tags.length > 0 && (
        <div style={{ padding: '10px 14px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {entry.tags.map(id => {
            const t = getTag(id);
            if (!t) return null;
            return (
              <span key={id} style={{
                ...mono, fontSize: 8, letterSpacing: '0.08em', textTransform: 'uppercase',
                color: t.color, background: t.bg,
                border: `1px solid ${t.border}`,
                borderRadius: 3, padding: '3px 7px', fontWeight: 600,
              }}>
                {t.label}
              </span>
            );
          })}
        </div>
      )}

      {/* Text */}
      <div style={{ padding: '12px 14px 14px' }}>
        <p style={{
          ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          ...(isLong && !expanded ? {
            display: '-webkit-box', WebkitLineClamp: 4,
            WebkitBoxOrient: 'vertical', overflow: 'hidden',
          } : {}),
        }}>
          {entry.text}
        </p>
        {isLong && (
          <button
            onClick={() => setExpanded(e => !e)}
            style={{
              ...inter, fontSize: 12, color: '#6C35DE', fontWeight: 600,
              background: 'none', border: 'none', cursor: 'pointer', padding: '6px 0 0',
            }}
          >
            {expanded ? 'Show less ↑' : 'Read more ↓'}
          </button>
        )}
      </div>
    </div>
  );
}

// ── Compose / Edit view ────────────────────────────────────────
function ComposeView({
  initial,
  onSave,
  onCancel,
}: {
  initial?: JournalEntry;
  onSave: (data: { text: string; tags: string[]; date: string }) => void;
  onCancel: () => void;
}) {
  const [text, setText]         = useState(initial?.text ?? '');
  const [date, setDate]         = useState(initial?.date ?? todayISO());
  const [tags, setTags]         = useState<string[]>(initial?.tags ?? []);
  const [error, setError]       = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);

  const toggleTag = (id: string) =>
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]);

  const handleSave = () => {
    if (!text.trim()) { setError('Write what happened before saving.'); return; }
    onSave({ text: text.trim(), tags, date });
  };

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
          onClick={onCancel}
          style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
            Journal
          </span>
        </button>
        <button
          onClick={handleSave}
          style={{
            ...inter, fontSize: 13, fontWeight: 800, color: '#ffffff',
            background: '#6C35DE', border: 'none', borderRadius: 5,
            padding: '9px 20px', cursor: 'pointer',
          }}
        >
          {initial ? 'Update' : 'Save Entry'}
        </button>
      </div>

      <div style={{ padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 22 }}>
        {/* Heading */}
        <div>
          <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 6 }}>
            {initial ? 'Edit Entry' : 'New Entry'}
          </p>
          <h2 style={{ ...inter, fontSize: 20, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>
            {initial ? 'Update your record' : 'Document what happened'}
          </h2>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, padding: '10px 14px' }}>
            <p style={{ ...inter, fontSize: 13, color: '#C0392B' }}>{error}</p>
          </div>
        )}

        {/* Date */}
        <div>
          <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Incident Date
          </label>
          <input
            type="date"
            value={date}
            max={todayISO()}
            onChange={e => setDate(e.target.value)}
            style={{
              ...inter, fontSize: 15, color: '#ffffff',
              background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '12px 14px', outline: 'none',
              width: '100%', colorScheme: 'dark',
            }}
            onFocus={e => (e.target.style.borderColor = '#6C35DE')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
        </div>

        {/* Text */}
        <div>
          <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            What Happened *
          </label>
          <textarea
            value={text}
            onChange={e => { setText(e.target.value); setError(''); }}
            placeholder="Describe what happened — time, location, what was said or done. Be specific. This is your record."
            rows={7}
            style={{
              ...inter, fontSize: 15, color: '#d1d1d6', lineHeight: 1.65,
              background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '14px', outline: 'none',
              width: '100%', resize: 'vertical',
              fontFamily: "'Inter', sans-serif",
            }}
            onFocus={e => (e.target.style.borderColor = '#6C35DE')}
            onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
          />
          <p style={{ ...mono, fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 6, letterSpacing: '0.06em' }}>
            {text.length} characters · encrypted on device
          </p>
        </div>

        {/* Evidence files */}
        <div>
          <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 10 }}>
            Attach Evidence
          </label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            background: 'rgba(108,53,222,0.06)', border: '1px dashed rgba(108,53,222,0.3)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>
              {attachedFiles.length > 0 ? `${attachedFiles.length} file${attachedFiles.length > 1 ? 's' : ''} selected` : 'Photos, documents, or video'}
            </span>
            <input
              type="file"
              accept="image/*,application/pdf,video/mp4"
              multiple
              style={{ display: 'none' }}
              onChange={e => {
                if (e.target.files) setAttachedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
              }}
            />
          </label>
          {attachedFiles.length > 0 && (
            <div style={{ marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {attachedFiles.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 5, padding: '4px 10px',
                }}>
                  <span style={{ ...mono, fontSize: 10, color: '#d1d1d6' }}>{f.name.length > 20 ? f.name.slice(0, 18) + '…' : f.name}</span>
                  <button
                    onClick={() => setAttachedFiles(prev => prev.filter((_, idx) => idx !== i))}
                    style={{ background: 'none', border: 'none', color: '#8b8b91', cursor: 'pointer', fontSize: 14, lineHeight: 1, padding: 0 }}
                  >×</button>
                </div>
              ))}
            </div>
          )}
          <p style={{ ...inter, fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 6, lineHeight: 1.5 }}>
            Uploaded securely and linked to this entry. Max 50 MB per file.
          </p>
        </div>

        {/* Tags */}
        <div>
          <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 12 }}>
            Tag This Incident
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TAGS.map(t => (
              <TagChip
                key={t.id}
                id={t.id}
                active={tags.includes(t.id)}
                onToggle={() => toggleTag(t.id)}
              />
            ))}
          </div>
          <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginTop: 10, lineHeight: 1.5 }}>
            Tags help RedFlaq detect patterns across your entries. Select all that apply.
          </p>
        </div>

        {/* Tip */}
        <div style={{ background: 'rgba(108,53,222,0.06)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 6, padding: '12px 14px' }}>
          <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.6 }}>
            <span style={{ color: '#6C35DE', fontWeight: 600 }}>Write immediately.</span>{' '}
            Memory degrades under stress. Include: time, location, exact words used, and how you felt. This becomes your evidence trail.
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirm ─────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)',
      borderRadius: 8, padding: '16px', marginBottom: 16,
    }}>
      <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>
        Delete this entry?
      </p>
      <p style={{ ...inter, fontSize: 13, color: '#8b8b91', marginBottom: 14, lineHeight: 1.5 }}>
        This cannot be undone. The record will be permanently removed from your device.
      </p>
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          onClick={onConfirm}
          style={{
            flex: 1, padding: '10px', background: '#C0392B', border: 'none',
            borderRadius: 5, ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff', cursor: 'pointer',
          }}
        >
          Delete
        </button>
        <button
          onClick={onCancel}
          style={{
            flex: 1, padding: '10px', background: 'transparent',
            border: '1px solid rgba(255,255,255,0.12)', borderRadius: 5,
            ...inter, fontSize: 13, fontWeight: 600, color: '#d1d1d6', cursor: 'pointer',
          }}
        >
          Keep
        </button>
      </div>
    </div>
  );
}

// ── Main screen ────────────────────────────────────────────────
interface JournalScreenProps {
  entries: JournalEntry[];
  ready: boolean;
  onAdd: (data: { text: string; tags: string[]; date: string }) => void;
  onUpdate: (id: string, patch: { text?: string; tags?: string[]; date?: string }) => void;
  onRemove: (id: string) => void;
  onGoSignals?: (signalId: string) => void;
}

export default function JournalScreen({
  entries, ready, onAdd, onUpdate, onRemove, onGoSignals,
}: JournalScreenProps) {
  const [view, setView]               = useState<'list' | 'compose'>('list');
  const [editEntry, setEditEntry]     = useState<JournalEntry | null>(null);
  const [deleteId, setDeleteId]       = useState<string | null>(null);
  const [filterTag, setFilterTag]     = useState<string | null>(null);
  const [nudgeDismissed, setDismissed]= useState(false);

  const patterns   = detectPatterns(entries);
  const showNudge  = patterns.length > 0 && !nudgeDismissed;

  const displayed = filterTag
    ? entries.filter(e => e.tags.includes(filterTag))
    : entries;

  const usedTags = [...new Set(entries.flatMap(e => e.tags))];

  const handleSave = (data: { text: string; tags: string[]; date: string }) => {
    if (editEntry) {
      onUpdate(editEntry.id, data);
    } else {
      onAdd(data);
    }
    setView('list');
    setEditEntry(null);
  };

  const handleEdit = (entry: JournalEntry) => {
    setEditEntry(entry);
    setView('compose');
  };

  const handleDelete = (id: string) => {
    onRemove(id);
    setDeleteId(null);
  };

  // ── Compose view
  if (view === 'compose') {
    return (
      <ComposeView
        initial={editEntry ?? undefined}
        onSave={handleSave}
        onCancel={() => { setView('list'); setEditEntry(null); }}
      />
    );
  }

  // ── List view
  return (
    <div style={{ background: '#08080f', height: '100%', overflowY: 'auto', paddingBottom: 90 }}>
      {/* Header */}
      <div style={{
        padding: '56px 20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
      }}>
        <div>
          <p style={{ ...mono, fontSize: 9, color: '#6C35DE', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
            Safety Journal
          </p>
          <h1 style={{ ...inter, fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>
            Document{' '}
            <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Everything.</span>
          </h1>
          <p style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.06em' }}>
            {entries.length} {entries.length === 1 ? 'entry' : 'entries'} · encrypted · private
          </p>
        </div>
        <button
          onClick={() => { setEditEntry(null); setView('compose'); }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0,
            background: '#6C35DE', border: 'none', borderRadius: 6,
            padding: '10px 14px', cursor: 'pointer', marginTop: 8,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
          </svg>
          <span style={{ ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff' }}>Add</span>
        </button>
      </div>

      <div style={{ padding: '20px 20px 0' }}>
        {/* Loading */}
        {!ready && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '40px 0' }}>
            <div style={{
              width: 20, height: 20, border: '2px solid rgba(108,53,222,0.2)',
              borderTopColor: '#6C35DE', borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Decrypting your journal…</p>
          </div>
        )}

        {ready && (
          <>
            {/* Pattern nudge */}
            {showNudge && (
              <PatternNudge
                patterns={patterns}
                onDismiss={() => setDismissed(true)}
                onGoSignals={onGoSignals}
              />
            )}

            {/* Tag filters */}
            {usedTags.length > 0 && (
              <div style={{ overflowX: 'auto', display: 'flex', gap: 8, marginBottom: 20, paddingBottom: 4, scrollbarWidth: 'none' }}>
                <button
                  onClick={() => setFilterTag(null)}
                  style={{
                    flexShrink: 0, ...mono, fontSize: 9, letterSpacing: '0.08em',
                    textTransform: 'uppercase', cursor: 'pointer',
                    color: filterTag === null ? '#ffffff' : '#8b8b91',
                    background: filterTag === null ? '#6C35DE' : '#111118',
                    border: filterTag === null ? '1px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 4, padding: '6px 10px', fontWeight: filterTag === null ? 700 : 400,
                    whiteSpace: 'nowrap',
                  }}
                >
                  All ({entries.length})
                </button>
                {usedTags.map(id => {
                  const t = getTag(id);
                  if (!t) return null;
                  const count = entries.filter(e => e.tags.includes(id)).length;
                  const active = filterTag === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setFilterTag(active ? null : id)}
                      style={{
                        flexShrink: 0, ...mono, fontSize: 9, letterSpacing: '0.08em',
                        textTransform: 'uppercase', cursor: 'pointer',
                        color: active ? '#ffffff' : t.color,
                        background: active ? t.color : t.bg,
                        border: `1px solid ${active ? t.color : t.border}`,
                        borderRadius: 4, padding: '6px 10px',
                        fontWeight: active ? 700 : 500, whiteSpace: 'nowrap',
                      }}
                    >
                      {t.label} ({count})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {entries.length === 0 && (
              <div style={{ textAlign: 'center', paddingTop: 40 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'rgba(108,53,222,0.08)', border: '1px solid rgba(108,53,222,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <rect x="4" y="3" width="13" height="18" rx="1" stroke="#6C35DE" strokeWidth="1.8"/>
                    <path d="M17 7H20V21H7" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round"/>
                    <path d="M8 8H13M8 12H13M8 16H11" stroke="#6C35DE" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <h2 style={{ ...inter, fontSize: 18, fontWeight: 800, color: '#ffffff', marginBottom: 10, letterSpacing: '-0.015em' }}>
                  Start your record today
                </h2>
                <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.6, maxWidth: 270, margin: '0 auto 24px' }}>
                  Document incidents as they happen. Dates, words used, what you felt. Courts trust consistent, specific, timestamped records.
                </p>
                <button
                  onClick={() => setView('compose')}
                  style={{
                    ...inter, fontSize: 14, fontWeight: 800, color: '#ffffff',
                    background: '#6C35DE', border: 'none', borderRadius: 6,
                    padding: '13px 28px', cursor: 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="white" strokeWidth="2.2" strokeLinecap="round"/>
                  </svg>
                  Add First Entry
                </button>
              </div>
            )}

            {/* No results for filter */}
            {entries.length > 0 && displayed.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ ...inter, fontSize: 14, color: '#8b8b91', marginBottom: 12 }}>
                  No entries tagged with this.
                </p>
                <button
                  onClick={() => setFilterTag(null)}
                  style={{ ...inter, fontSize: 13, color: '#6C35DE', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  View all entries
                </button>
              </div>
            )}

            {/* Entry list */}
            {displayed.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, paddingBottom: 20 }}>
                {displayed.map(entry => (
                  <div key={entry.id}>
                    {deleteId === entry.id ? (
                      <DeleteConfirm
                        onConfirm={() => handleDelete(entry.id)}
                        onCancel={() => setDeleteId(null)}
                      />
                    ) : (
                      <EntryCard
                        entry={entry}
                        onEdit={() => handleEdit(entry)}
                        onDelete={() => setDeleteId(entry.id)}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Encryption notice */}
            {entries.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '16px 0 8px' }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="#8b8b91" strokeWidth="1.8"/>
                  <path d="M7 11V7C7 4.8 9.2 3 12 3C14.8 3 17 4.8 17 7V11" stroke="#8b8b91" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <p style={{ ...mono, fontSize: 8, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em' }}>
                  AES-256 encrypted · stored on this device only
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
