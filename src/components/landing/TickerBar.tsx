const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const TickerBar = () => {
  const items = [
    "Public Records Only",
    "POPIA-Aware",
    "100% Confidential",
    "R99 Per Check",
    "Results in Under 60 Seconds",
    "Downloadable PDF Reports",
    "SHA-256 Timestamped",
    "Encrypted Journal",
    "Court-Admissible Evidence",
  ];

  const renderItems = () => items.map((item, i) => (
    <span key={i} className="inline-flex items-center">
      <span style={{
        ...mono,
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        color: 'rgba(255,255,255,0.6)',
        padding: '0 28px',
      }}>
        {item}
      </span>
      <span style={{ color: 'rgba(108,53,222,0.6)', fontSize: 8 }}>◆</span>
    </span>
  ));

  return (
    <div style={{
      width: '100%',
      background: '#0d0d1a',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      padding: '11px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    }}>
      <div className="animate-ticker inline-flex">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
};

export default TickerBar;
