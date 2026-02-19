import { Shield, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    {
      level: "HIGH RISK",
      headline: "Stop. Look closer.",
      description: "Serious public‑record warnings found — violent or sexual offences with an active warning status.",
      dotColor: "#DC2626",
    },
    {
      level: "MODERATE RISK",
      headline: "Proceed with caution.",
      description: "Older or less severe public‑record warnings — status may no longer be active.",
      dotColor: "#F59E0B",
    },
    {
      level: "LOW RISK",
      headline: "Some concerns noted.",
      description: "Lower‑level issues or incomplete public information found.",
      dotColor: "#EA580C",
    },
    {
      level: "CLEAR",
      headline: "No warnings found.",
      description: "No matching public‑record warnings found for this name in the sources we check.",
      dotColor: "#16A34A",
    },
  ];

  const checklistItems = [
    "Possible matches on public wanted‑person notices",
    "Other public‑record warnings linked to that name",
    "Crime type, status, area and timing when available",
    "A clear risk level and explanation",
    "A downloadable PDF summary",
  ];

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '100px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>Your Report</div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)', color: '#2D2235', marginBottom: 56,
        }}>
          What your report <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>reveals</em>
        </h2>

        {/* Traffic-light indicator row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6" style={{ marginBottom: 40, textAlign: 'center' }}>
          {riskLevels.map((risk) => (
            <div key={risk.level} className="flex flex-col items-center">
              {/* Dot */}
              <div style={{
                width: 48, height: 48, borderRadius: '50%',
                backgroundColor: risk.dotColor,
                marginBottom: 20,
                boxShadow: `0 0 16px ${risk.dotColor}40`,
              }} />

              {/* Headline */}
              <h3 style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 20, color: '#2D2235', lineHeight: 1.3, marginBottom: 8,
              }}>
                {risk.headline}
              </h3>

              {/* Description */}
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: 13,
                color: '#6B7280', lineHeight: 1.6, marginBottom: 12,
                maxWidth: 220, margin: '0 auto 12px',
              }}>
                {risk.description}
              </p>

              {/* Badge */}
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
                textTransform: 'uppercase' as const,
                color: risk.dotColor,
                border: `1px solid ${risk.dotColor}40`,
                padding: '3px 10px',
              }}>
                {risk.level}
              </span>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
          textAlign: 'center', lineHeight: 1.6, maxWidth: 640, margin: '0 auto 48px',
        }}>
          A "No warnings found" result means no public‑record warnings matched this name in the sources we check. It is not a guarantee of someone's character or conduct. Always trust your instincts too.
        </p>

        {/* What you get */}
        <div style={{ background: 'white', border: '1.5px solid #EDE9FE', padding: '40px 36px', maxWidth: 700, margin: '0 auto' }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-7 w-7" style={{ color: '#7C3AED' }} />
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#2D2235' }}>What you get</h3>
          </div>
          <div className="space-y-0">
            {checklistItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0', borderBottom: '1px solid #EDE9FE',
                fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453',
              }}>
                <Check className="h-4 w-4 flex-shrink-0" style={{ color: '#7C3AED' }} />
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
