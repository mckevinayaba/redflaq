import { useState } from "react";
import {
  PersonRecord,
  SearchInput,
  calculateIdentityConfidence,
  getConfidenceLevel,
  getConfidenceStyles,
} from "@/utils/identityConfidence";
import HumanVerificationModal from "./HumanVerificationModal";

interface IdentityMatchSelectorProps {
  matches: PersonRecord[];
  searchInput: SearchInput;
  onSelectMatch: (match: PersonRecord) => void;
  onNoneMatch: () => void;
}

const IdentityMatchSelector = ({
  matches,
  searchInput,
  onSelectMatch,
  onNoneMatch,
}: IdentityMatchSelectorProps) => {
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  return (
    <div style={{ background: 'var(--paper)', padding: 40, maxWidth: 1000, margin: '0 auto' }}>
      {/* Warning Banner */}
      <div style={{ background: '#FEF2F2', border: '2px solid #DC2626', padding: 32, marginBottom: 32 }}>
        <span style={{ fontSize: 40 }}>⚠️</span>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#DC2626', margin: '12px 0' }}>
          Multiple Possible Matches Found
        </h2>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'var(--mid)', lineHeight: 1.7, marginBottom: 20 }}>
          We found {matches.length} people with this name in public records. South Africa has many people with identical names. You MUST verify which person matches who you are searching for before making any decisions.
        </p>
        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, color: '#DC2626', background: 'white', padding: 12, borderLeft: '3px solid #DC2626' }}>
          Using information about the wrong person is illegal. Verify identity carefully using date of birth, location, and case details.
        </div>
      </div>

      {/* Match Cards */}
      {matches.map((match) => {
        const score = calculateIdentityConfidence(match, searchInput);
        const level = getConfidenceLevel(score);
        const styles = getConfidenceStyles(level);

        return (
          <div
            key={match.id}
            onClick={() => onSelectMatch(match)}
            style={{
              background: 'white',
              border: '1.5px solid var(--cream)',
              padding: 24,
              marginBottom: 16,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'grid',
              gridTemplateColumns: '80px 1fr 100px',
              gap: 20,
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--purple-mid)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--cream)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {/* Photo */}
            <div style={{ width: 80, height: 80, border: '1px solid #E5E7EB', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F5F4' }}>
              {match.photo_url ? (
                <img src={match.photo_url} alt={match.full_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 32, color: '#D1D5DB' }}>👤</span>
              )}
            </div>

            {/* Details */}
            <div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 4 }}>
                {match.full_name}
              </p>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', lineHeight: 1.6 }}>
                <span>• DOB: {match.date_wanted || 'Not available'}</span><br />
                <span>• Location: {[match.police_station, match.province].filter(Boolean).join(', ') || 'Not available'}</span><br />
                <span>• Case: {match.charges || 'Not available'}</span><br />
                <span>• Ref: {match.case_number || 'Not available'}</span>
              </div>
            </div>

            {/* Confidence Badge */}
            <div style={{
              background: styles.bg,
              border: `1.5px solid ${styles.border}`,
              color: styles.color,
              padding: '8px 12px',
              borderRadius: 4,
              textAlign: 'center',
            }}>
              <span style={{ fontSize: 16, display: 'block' }}>{styles.icon}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', fontWeight: 600 }}>{level}</span>
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 16, marginTop: 32, flexWrap: 'wrap' }}>
        <button
          onClick={onNoneMatch}
          style={{ background: 'transparent', border: '2px solid var(--ink)', color: 'var(--ink)', padding: '14px 24px', fontFamily: "'Syne', sans-serif", fontWeight: 600, cursor: 'pointer' }}
        >
          None of These Match
        </button>
        <button
          onClick={() => setShowVerificationModal(true)}
          style={{ background: 'var(--purple-mid)', color: 'white', padding: '14px 24px', fontFamily: "'Syne', sans-serif", fontWeight: 600, border: 'none', cursor: 'pointer' }}
        >
          Request Human Verification - R49
        </button>
      </div>

      {showVerificationModal && (
        <HumanVerificationModal
          searchInput={searchInput}
          matchIds={matches.map(m => m.id)}
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </div>
  );
};

export default IdentityMatchSelector;
