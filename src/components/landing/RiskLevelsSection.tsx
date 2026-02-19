import { AlertTriangle, Clock, Check, Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    {
      level: "HIGH RISK",
      icon: AlertTriangle,
      description: "Serious offences in public records (e.g. violent or sexual crime) with an active warning status.",
      bgColor: "#FEF2F2", borderColor: "#FCA5A5", textColor: "#DC2626", badgeBg: "#DC2626",
    },
    {
      level: "MODERATE RISK",
      icon: AlertTriangle,
      description: "Older or less severe public‑record warnings, or status that may no longer be active.",
      bgColor: "#FFFBEB", borderColor: "#FCD34D", textColor: "#D97706", badgeBg: "#D97706",
    },
    {
      level: "LOW RISK",
      icon: Clock,
      description: "Lower‑level issues or incomplete public information.",
      bgColor: "#FEFCE8", borderColor: "#FDE047", textColor: "#CA8A04", badgeBg: "#CA8A04",
    },
    {
      level: "CLEAR",
      icon: Check,
      description: "No matching public‑record warnings found for this name in the sources we check.",
      bgColor: "#F0FDF4", borderColor: "#86EFAC", textColor: "#16A34A", badgeBg: "#16A34A",
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
          fontSize: 'clamp(36px, 4vw, 52px)', color: '#2D2235', marginBottom: 48,
        }}>
          What your report <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>reveals</em>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4" style={{ marginBottom: 48 }}>
          {riskLevels.map((risk) => (
            <div
              key={risk.level}
              style={{
                background: risk.bgColor, border: `1.5px solid ${risk.borderColor}`,
                padding: '28px 24px', textAlign: 'center',
              }}
            >
              <risk.icon className="mx-auto mb-3" style={{ color: risk.textColor, width: 32, height: 32 }} />
              <span style={{
                background: risk.badgeBg, color: 'white', fontSize: 10, fontWeight: 700,
                padding: '3px 10px', fontFamily: "'JetBrains Mono', monospace",
                letterSpacing: '0.1em', display: 'inline-block', marginBottom: 12,
              }}>
                {risk.level}
              </span>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.5 }}>
                {risk.description}
              </p>
            </div>
          ))}
        </div>

        {/* Clear result caveat */}
        <p style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
          textAlign: 'center', lineHeight: 1.6, maxWidth: 600, margin: '0 auto 48px',
        }}>
          A "Clear" result means no public‑record warnings matched this name in the sources we check. It is not a guarantee of someone's character or conduct. Always trust your instincts too.
        </p>

        {/* What you get — single instance */}
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
