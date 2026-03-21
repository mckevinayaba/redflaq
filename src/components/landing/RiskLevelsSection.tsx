import { Shield, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    { level: "HIGH RISK", headline: "Stop. Look closer.", description: "Serious public‑record warnings found — violent or sexual offences with an active warning status.", color: "#DC2626" },
    { level: "MODERATE RISK", headline: "Proceed with caution.", description: "Older or less severe public‑record warnings — status may no longer be active.", color: "#F59E0B" },
    { level: "LOW RISK", headline: "Some concerns noted.", description: "Lower‑level issues or incomplete public information found.", color: "#A78BFA" },
    { level: "CLEAR", headline: "No warnings found.", description: "No matching public‑record warnings found for this name in the sources we check.", color: "#10B981" },
  ];

  const checklistItems = [
    "Possible matches on public wanted‑person notices",
    "Other public‑record warnings linked to that name",
    "Crime type, status, area and timing when available",
    "A clear risk level and explanation",
    "A downloadable PDF summary",
  ];

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} section-spacing`} style={{ background: '#F5F0EB' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ marginBottom: 16 }}>Your Report</div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)', color: '#1A1523', marginBottom: 56, letterSpacing: '-0.02em',
        }}>
          What your report <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>reveals</em>
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6" style={{ marginBottom: 48 }}>
          {riskLevels.map((risk) => (
            <div
              key={risk.level}
              style={{
                textAlign: 'center',
                padding: '28px 16px',
              }}
            >
              {/* Round colored circle */}
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: risk.color,
                margin: '0 auto 20px',
                boxShadow: `0 8px 24px ${risk.color}40`,
              }} />
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: '#1A1523', fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>
                {risk.headline}
              </h3>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#6B7280', lineHeight: 1.6, marginBottom: 16 }}>
                {risk.description}
              </p>
              {/* Badge pill */}
              <span style={{
                display: 'inline-block',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700,
                letterSpacing: '0.15em', color: risk.color,
                background: `${risk.color}15`,
                padding: '6px 14px',
                borderRadius: 50,
                border: `1.5px solid ${risk.color}30`,
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

        {/* What you get — premium card */}
        <div style={{
          background: '#FFFFFF', border: '1px solid #E6E0DA',
          borderRadius: 16, padding: '40px 36px', maxWidth: 700, margin: '0 auto', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6" style={{ color: '#6B4EFF' }} />
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1523' }}>What you get</h3>
          </div>
          <div className="space-y-0">
            {checklistItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0', borderBottom: '1px solid #E6E0DA',
                fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: '#F1ECFF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check className="h-3 w-3" style={{ color: '#6B4EFF' }} />
                </div>
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
