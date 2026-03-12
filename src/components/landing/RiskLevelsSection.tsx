import { Shield, Check } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const RiskLevelsSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const riskLevels = [
    { level: "HIGH RISK", headline: "Stop. Look closer.", description: "Serious public‑record warnings found — violent or sexual offences with an active warning status.", borderColor: "#DC2626" },
    { level: "MODERATE RISK", headline: "Proceed with caution.", description: "Older or less severe public‑record warnings — status may no longer be active.", borderColor: "#F59E0B" },
    { level: "LOW RISK", headline: "Some concerns noted.", description: "Lower‑level issues or incomplete public information found.", borderColor: "#A78BFA" },
    { level: "CLEAR", headline: "No warnings found.", description: "No matching public‑record warnings found for this name in the sources we check.", borderColor: "#10B981" },
  ];

        {/* Horizontal risk cards */}
        <div className="flex flex-col md:flex-row gap-4" style={{ marginBottom: 48 }}>
          {riskLevels.map((risk) => (
            <div
              key={risk.level}
              style={{
                flex: 1,
                background: '#0F0D1A',
                borderLeft: `5px solid ${risk.borderColor}`,
                borderRadius: 12,
                padding: '28px 24px',
              }}
            >
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700,
                letterSpacing: '0.15em', color: risk.borderColor, marginBottom: 14,
              }}>
                {risk.level}
              </div>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: 'white', fontWeight: 700, lineHeight: 1.3, marginBottom: 10 }}>
                {risk.headline}
              </h3>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6 }}>
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

        {/* What you get — premium card */}
        <div style={{
          background: 'rgba(124, 58, 237, 0.04)', border: '1px solid rgba(124, 58, 237, 0.15)',
          borderRadius: 16, padding: '40px 36px', maxWidth: 700, margin: '0 auto',
        }}>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="h-6 w-6" style={{ color: '#7C3AED' }} />
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#1A1523' }}>What you get</h3>
          </div>
          <div className="space-y-0">
            {checklistItems.map((item) => (
              <div key={item} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 0', borderBottom: '1px solid rgba(124,58,237,0.1)',
                fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', background: 'rgba(124,58,237,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <Check className="h-3 w-3" style={{ color: '#7C3AED' }} />
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
