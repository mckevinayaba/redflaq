const TickerBar = () => {
  const items = [
    "Public Records Only",
    "POPIA‑Aware",
    "100% Confidential",
    "R99 Per Check",
    "Results in Under 60 Seconds",
    "Downloadable PDF Reports",
  ];

  const separator = <span style={{ color: 'rgba(255,255,255,0.4)', padding: '0 24px' }}>◆</span>;

  const renderItems = () => items.map((item, i) => (
    <span key={i} className="inline-flex items-center">
      <span style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
        letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.9)',
        padding: '0 24px',
      }}>
        {item}
      </span>
      {separator}
    </span>
  ));

  return (
    <div style={{
      width: '100%', background: '#7C3AED',
      borderTop: '2px solid #6D28D9', borderBottom: '2px solid #6D28D9',
      padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap',
    }}>
      <div className="animate-ticker inline-flex">
        {renderItems()}
        {renderItems()}
      </div>
    </div>
  );
};

export default TickerBar;
