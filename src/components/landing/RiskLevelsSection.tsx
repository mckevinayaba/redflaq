import { Shield, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    { level: "HIGH RISK", headline: "Stop. Look closer.", description: "Serious public-record warnings found — violent or sexual offences with an active warning status.", color: "#DC2626" },
    { level: "MODERATE RISK", headline: "Proceed with caution.", description: "Older or less severe public-record warnings — status may no longer be active.", color: "#F59E0B" },
    { level: "LOW RISK", headline: "Some concerns noted.", description: "Lower-level issues or incomplete public information found.", color: "#A78BFA" },
    { level: "CLEAR", headline: "No warnings found.", description: "No matching public-record warnings found for this name in the sources we check.", color: "#10B981" },
  ];

  const checklistItems = [
    "Possible matches on public wanted-person notices",
    "Other public-record warnings linked to that name",
    "Crime type, status, area and timing when available",
    "A clear risk level and explanation",
    "A downloadable PDF summary",
  ];

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#FFFFFF', borderBottom: '1px solid #E6E0DA' }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>Your Report</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>
            What your report <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>reveals</em>
          </h2>
        </div>

        {/* Risk level cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4" style={{ marginBottom: 48 }}>
          {riskLevels.map((risk) => (
            <div key={risk.level} style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 8, padding: '24px 20px', textAlign: 'center',
            }}>
              <div style={{
                width: 12, height: 12, borderRadius: '50%',
                background: risk.color, margin: '0 auto 16px',
                boxShadow: `0 0 0 4px ${risk.color}20`,
              }} />
              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#1F1F1F',
                fontWeight: 700, marginBottom: 8,
              }}>
                {risk.headline}
              </h3>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#555555',
                lineHeight: 1.6, marginBottom: 12,
              }}>
                {risk.description}
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.1em', color: risk.color,
              }}>
                {risk.level}
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888',
          textAlign: 'center', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 48px',
        }}>
          A "No warnings found" result means no public-record warnings matched this name in the sources we check. It is not a guarantee of someone's character or conduct. Always trust your instincts too.
        </p>

        {/* What you get card */}
        <div style={{
          background: '#FAFAF8', border: '1px solid #E6E0DA',
          borderRadius: 8, padding: '32px', maxWidth: 640, margin: '0 auto',
        }}>
          <div className="flex items-center gap-3 mb-5">
            <Shield className="h-5 w-5" style={{ color: '#6B4EFF' }} />
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1F1F1F' }}>What you get</h3>
          </div>
          <div>
            {checklistItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid #E6E0DA',
                fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555',
              }}>
                <Check className="h-4 w-4" style={{ color: '#6B4EFF', flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskLevelsSection;
