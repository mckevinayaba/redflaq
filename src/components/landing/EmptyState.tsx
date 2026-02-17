interface EmptyStateProps {
  onDownload?: () => void;
  onSearchAnother?: () => void;
}

const EmptyState = ({ onDownload, onSearchAnother }: EmptyStateProps) => {
  return (
    <div style={{
      background: '#F7F4F0', border: '1.5px solid #0D0B0E', padding: 48, textAlign: 'center',
    }}>
      <span style={{ fontSize: 48, display: 'block', marginBottom: 16 }}>✅</span>

      <h3 style={{
        fontFamily: "'DM Serif Display', serif", fontSize: 28,
        color: '#0D0B0E', marginBottom: 12,
      }}>
        No Red Flags Found
      </h3>

      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#4B4453',
        lineHeight: 1.7, maxWidth: 480, margin: '0 auto 20px',
      }}>
        We searched public criminal records and found no active warrants, court convictions, or legal notices linked to this person.
      </p>

      <div style={{ width: '100%', height: 1, background: '#EDE9E3', margin: '20px 0' }} />

      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
        letterSpacing: '0.04em', lineHeight: 1.7, maxWidth: 480, margin: '0 auto', display: 'block',
      }}>
        This does not guarantee they have no history. Public records are not always complete.
        Always combine this with your own judgment. If something feels wrong, trust that feeling.
      </span>

      <div className="flex flex-wrap justify-center gap-4 mt-8">
        <button onClick={onDownload} className="btn-primary">Download Report</button>
        <button onClick={onSearchAnother} className="btn-secondary">Search Another Person</button>
      </div>
    </div>
  );
};

export default EmptyState;
