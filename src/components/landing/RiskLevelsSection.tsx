import { AlertTriangle, AlertCircle, Info, ShieldCheck, Shield, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    {
      level: "HIGH RISK",
      headline: "Stop. Look closer.",
      description: "Serious public‑record warnings found — violent or sexual offences with an active warning status.",
      icon: AlertTriangle,
      bg: "linear-gradient(135deg, #991B1B 0%, #7F1D1D 100%)",
      border: "#EF4444",
      glow: "0 0 20px rgba(239,68,68,0.25)",
      pulseClass: "animate-pulse-slow",
    },
    {
      level: "MODERATE RISK",
      headline: "Proceed with caution.",
      description: "Older or less severe public‑record warnings found — status may no longer be active.",
      icon: AlertCircle,
      bg: "linear-gradient(135deg, #92400E 0%, #78350F 100%)",
      border: "#F59E0B",
      glow: "0 0 20px rgba(245,158,11,0.25)",
      pulseClass: "animate-pulse-medium",
    },
    {
      level: "LOW RISK",
      headline: "Some concerns noted.",
      description: "Lower‑level issues or incomplete public information found.",
      icon: Info,
      bg: "linear-gradient(135deg, #9A3412 0%, #7C2D12 100%)",
      border: "#F97316",
      glow: "0 0 20px rgba(249,115,22,0.25)",
      pulseClass: "animate-pulse-medium",
    },
    {
      level: "CLEAR",
      headline: "No warnings found.",
      description: "No matching public‑record warnings found for this name in the sources we check.",
      icon: ShieldCheck,
      bg: "linear-gradient(135deg, #14532D 0%, #064E3B 100%)",
      border: "#22C55E",
      glow: "0 0 20px rgba(34,197,94,0.2)",
      pulseClass: "",
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
    <>
      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes pulse-medium {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-pulse-medium { animation: pulse-medium 2.2s ease-in-out infinite; }
        .risk-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .risk-card:hover {
          transform: translateY(-4px) scale(1.02);
        }
      `}</style>

      <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '100px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>Your Report</div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)', color: '#2D2235', marginBottom: 48,
          }}>
            What your report <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>reveals</em>
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ marginBottom: 32 }}>
            {riskLevels.map((risk) => (
              <div
                key={risk.level}
                className="risk-card"
                style={{
                  background: risk.bg,
                  borderLeft: `5px solid ${risk.border}`,
                  padding: '36px 28px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: risk.glow,
                  cursor: 'default',
                }}
              >
                {/* Animated border glow */}
                {risk.pulseClass && (
                  <div className={risk.pulseClass} style={{
                    position: 'absolute', top: 0, left: 0, bottom: 0, width: 5,
                    background: risk.border,
                  }} />
                )}

                <risk.icon style={{ color: 'rgba(255,255,255,0.9)', width: 36, height: 36, marginBottom: 16 }} />

                <h3 style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 22, color: '#FFFFFF', lineHeight: 1.25, marginBottom: 10,
                }}>
                  {risk.headline}
                </h3>

                <span style={{
                  display: 'inline-block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, fontWeight: 700, letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.6)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  padding: '3px 8px', marginBottom: 14,
                }}>
                  {risk.level}
                </span>

                <p style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 13,
                  color: 'rgba(255,255,255,0.75)', lineHeight: 1.6,
                }}>
                  {risk.description}
                </p>
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

          {/* What you get — unchanged */}
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
    </>
  );
};

export default RiskLevelsSection;
