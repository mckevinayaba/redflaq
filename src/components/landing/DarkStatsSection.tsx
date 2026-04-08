const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const stats = [
  {
    number: "Every 4 hours",
    label: "a woman is killed by an intimate partner in South Africa",
    source: "Centre for Constitutional Rights / UNODC",
    red: false,
  },
  {
    number: "5×",
    label: "South Africa's femicide rate vs the global average",
    source: "Africa Check / UNODC data",
    red: true,
  },
  {
    number: "3,000+",
    label: "women murdered in South Africa per year — roughly 9 every day",
    source: "National murder statistics (women)",
    red: true,
  },
];

const DarkStatsSection = () => (
  <section style={{
    background: '#0d0d1a',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    padding: '80px 24px',
  }}>
    <div style={{ maxWidth: 1100, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 56 }}>
        <p style={{
          ...inter, fontSize: 11, fontWeight: 700, color: '#C0392B',
          letterSpacing: '0.12em', textTransform: 'uppercase' as const,
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          THE REALITY
        </p>
        <h2 style={{
          fontSize: 'clamp(28px, 4vw, 48px)',
          fontWeight: 900,
          lineHeight: 1.1,
          letterSpacing: '-0.03em',
          color: '#ffffff',
          maxWidth: 700,
        }}>
          <span style={{ ...inter }}>South Africa does not have</span>
          <br />
          <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>
            an awareness problem.
          </span>
          <br />
          <span style={{ ...inter }}>It has a denial problem.</span>
        </h2>
        <p style={{
          ...inter, fontSize: 16, fontWeight: 400, color: '#d1d1d6',
          maxWidth: 640, lineHeight: 1.75, marginTop: 20,
        }}>
          The data has existed for years. The patterns are documented.
          The system has failed — repeatedly. The denial is cultural, political, and personal.
          RedFlaq exists in that gap.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              background: '#111118',
              border: '1px solid rgba(108,53,222,0.25)',
              borderLeft: `3px solid ${s.red ? '#C0392B' : '#6C35DE'}`,
              borderRadius: 8,
              padding: '2.5rem',
              transition: 'border-color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
          >
            <div style={{
              ...inter,
              fontSize: 'clamp(28px, 3.5vw, 44px)',
              fontWeight: 900,
              color: s.red ? '#C0392B' : '#ffffff',
              lineHeight: 1,
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              {s.number}
            </div>
            <p style={{ ...inter, fontSize: 15, color: '#d1d1d6', lineHeight: 1.6, marginBottom: 16 }}>
              {s.label}
            </p>
            <p style={{ ...inter, fontSize: 11, color: '#8b8b91', letterSpacing: '0.04em' }}>
              {s.source}
            </p>
          </div>
        ))}
      </div>

      {/* Emergency alert box */}
      <div style={{
        background: '#1a0a0a',
        borderLeft: '4px solid #C0392B',
        borderRadius: 8,
        padding: '28px 32px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <p style={{
              ...inter, fontSize: 11, fontWeight: 700, color: '#C0392B',
              letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8,
            }}>
              NATIONAL DISASTER — NOV 2025
            </p>
            <p style={{
              ...inter, fontSize: 'clamp(20px, 2.5vw, 28px)',
              fontWeight: 800, color: '#ffffff', marginBottom: 10,
            }}>
              3% conviction rate.
            </p>
            <p style={{ ...inter, fontSize: 15, color: '#d1d1d6', lineHeight: 1.7, maxWidth: 680 }}>
              The system was not built to protect you.{' '}
              <span style={{ color: '#6C35DE', fontWeight: 600 }}>RedFlaq was.</span>
              {' '}On 21 November 2025, GBVF was classified as a national disaster under the Disaster Management Act. South Africa called it a "second pandemic."
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default DarkStatsSection;
