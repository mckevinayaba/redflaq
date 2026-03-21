import { useState } from "react";

interface ShareControlsModalProps {
  open: boolean;
  onClose: () => void;
  onAgree: () => void;
}

const ShareControlsModal = ({ open, onClose, onAgree }: ShareControlsModalProps) => {
  const [checks, setChecks] = useState([false, false, false, false]);

  if (!open) return null;

  const allChecked = checks.every(Boolean);

  const toggle = (i: number) => {
    const next = [...checks];
    next[i] = !next[i];
    setChecks(next);
  };

  const labels = [
    "I will not use this information to harass, threaten, or discriminate against this person",
    "I will not share this publicly or post on social media",
    "I will only share with trusted parties for legitimate safety purposes",
    "I understand that sharing this information irresponsibly is illegal under POPIA and may result in criminal prosecution",
  ];

  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}
      onClick={onClose}
    >
      <div
        style={{ background: 'white', maxWidth: 600, width: '100%', border: '1.5px solid var(--ink)', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ padding: '32px 32px 24px', borderBottom: '1.5px solid var(--cream)' }}>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>
            Sharing Responsibility
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.7 }}>
            Before sharing or downloading this report, you must agree to use it responsibly and legally.
          </p>
        </div>

        <div style={{ padding: 32 }}>
          {labels.map((label, i) => (
            <label key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 16, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={checks[i]}
                onChange={() => toggle(i)}
                style={{ accentColor: '#7C3AED', marginTop: 4, width: 18, height: 18, flexShrink: 0 }}
              />
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', lineHeight: 1.7 }}>
                {label}
              </span>
            </label>
          ))}
        </div>

        <div style={{ padding: '24px 32px', borderTop: '1.5px solid var(--cream)', display: 'flex', justifyContent: 'space-between' }}>
          <button
            onClick={onClose}
            style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '12px 24px', fontFamily: "'Syne', sans-serif", fontWeight: 600, cursor: 'pointer' }}
          >
            Cancel
          </button>
          <button
            onClick={() => { onAgree(); onClose(); }}
            disabled={!allChecked}
            style={{
              background: allChecked ? '#7C3AED' : '#D1D5DB',
              color: 'white',
              padding: '12px 24px',
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              border: 'none',
              cursor: allChecked ? 'pointer' : 'not-allowed',
            }}
          >
            I Agree, Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareControlsModal;
