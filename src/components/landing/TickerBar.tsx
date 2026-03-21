const TickerBar = () => {
  const items = [
    "Public Records Only",
    "POPIA‑Aware",
    "100% Confidential",
    "R99 Per RedFlaq",
    "Results in Under 60 Seconds",
    "Downloadable PDF Reports",
  ];

  const renderItems = () => items.map((item, i) => (
    <span key={i} className="inline-flex items-center">
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 12,
        fontWeight: 500,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.9)',
        padding: '0 28px',
      }}>
        {item}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 8 }}>◆</span>
    </span>
  ));

  return (
    <div style={{
      width: '100%',
      background: '#6B4EFF',
      padding: '12px 0',
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
