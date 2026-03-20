import { Shield } from "lucide-react";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const SocialProofHormozi = ({ variant = 1 }: { variant?: 1 | 2 }) => {
  if (variant === 1) {
    return (
      <section style={{ background: 'white', padding: 'clamp(40px, 6vw, 64px) 20px' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' as const }}>
          <div style={{
            background: '#F5F0EB', border: '1px solid #E6E0DA',
            borderRadius: 20, padding: 'clamp(28px, 5vw, 44px)',
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%', margin: '0 auto 20px',
              background: 'rgba(124,58,237,0.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Shield size={24} color="#7C3AED" />
            </div>
            <p style={{
              ...font, fontSize: 'clamp(16px, 2.5vw, 22px)', fontWeight: 600,
              color: '#1F1F1F', lineHeight: 1.5, fontStyle: 'italic', marginBottom: 20,
            }}>
              "Launched International Women's Day 2026. Already protecting South African women across 9 provinces."
            </p>
            <p style={{ ...mono, fontSize: 11, color: '#7C3AED', letterSpacing: '0.1em', fontWeight: 600 }}>
              REDFLAQ FOUNDING TEAM
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Variant 2 — stats
  return (
    <section style={{ background: '#F5F0EB', padding: 'clamp(40px, 6vw, 56px) 20px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 24, textAlign: 'center' as const }}>
          SINCE LAUNCH
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { stat: "9", label: "Provinces Reached" },
            { stat: "100%", label: "Free Safety Tools" },
            { stat: "60s", label: "Verification Speed" },
          ].map((s) => (
            <div key={s.label} style={{
              background: 'white', border: '1px solid #E6E0DA',
              borderRadius: 16, padding: 24, textAlign: 'center' as const,
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <p style={{ ...font, fontSize: 36, fontWeight: 800, color: '#7C3AED', marginBottom: 4 }}>{s.stat}</p>
              <p style={{ ...font, fontSize: 13, color: '#555', fontWeight: 500 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProofHormozi;
