import { useNavigate } from "react-router-dom";
import { BookOpen, Scale, FileText, Sparkles, Heart, Shield, Search, MessageSquare } from "lucide-react";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const freeFeatures = [
  { icon: <BookOpen size={20} color="#7C3AED" />, title: "My Safety Journal", desc: "Private, timestamped evidence documentation. Court-admissible. SHA-256 cryptographic proof. Yours forever." },
  { icon: <Scale size={20} color="#7C3AED" />, title: "Protection Order Guide", desc: "Step-by-step legal process. Know your rights. File correctly. Act fast when you need protection." },
  { icon: <FileText size={20} color="#7C3AED" />, title: "Affidavit Builder", desc: "Generate court-ready legal statements in minutes. No lawyer needed for the paperwork." },
  { icon: <Sparkles size={20} color="#7C3AED" />, title: "Habit (Coming April 2026)", desc: "Daily safety check-ins. Red flag education library. Safety streaks. Build the habit of checking first." },
  { icon: <Heart size={20} color="#7C3AED" />, title: "Behavioral Signal (Coming May 2026)", desc: "See patterns over time. Early warning system for manipulation, control, isolation, financial abuse." },
  { icon: <Shield size={20} color="#7C3AED" />, title: "Safety Resources", desc: "GBV hotlines. 66 Thuthuzela Care Centres. Legal Aid SA. Police GBV desks. All in one place." },
  { icon: <Search size={20} color="#7C3AED" />, title: "Saved Checks", desc: "Full history of everyone you've verified. Track patterns. Reference when needed." },
  { icon: <MessageSquare size={20} color="#7C3AED" />, title: "WhatsApp Support", desc: "Direct line to RedFlaq team. Questions answered. Guidance provided." },
];

const pricingTiers = [
  { name: "Basic", price: "R99", features: "SAPS Wanted Lists", speed: "60 seconds" },
  { name: "Standard", price: "R249", features: "SAPS + Court Records", speed: "60 seconds" },
  { name: "Premium", price: "R399", features: "SAPS + Courts + NRSO*", speed: "60 seconds" },
];

const ValueStack = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'white', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 960, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          FREE FOREVER
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          Everything You Get. 100% Free. Forever.
        </h2>
        <p style={{ ...font, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#555555', lineHeight: 1.6, marginBottom: 40, maxWidth: 680 }}>
          Most safety platforms charge you to feel safe. RedFlaq gives you everything for free. You only pay when you need to verify someone's public record.
        </p>

        {/* Free features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: 40 }}>
          {freeFeatures.map((f) => (
            <div key={f.title} style={{
              display: 'flex', gap: 14, padding: 20,
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 14,
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ ...font, fontWeight: 700, fontSize: 14, color: '#1F1F1F', marginBottom: 4 }}>
                  ✅ {f.title}
                </h4>
                <p style={{ ...font, fontSize: 13, color: '#888888', lineHeight: 1.5 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Value statement */}
        <div style={{
          background: '#F5F0EB', borderRadius: 16, padding: 'clamp(20px, 4vw, 32px)',
          textAlign: 'center' as const, marginBottom: 40, border: '1px solid #E6E0DA',
        }}>
          <p style={{ ...font, fontSize: 14, color: '#888', marginBottom: 4 }}>Total Value:</p>
          <p style={{ ...font, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#1F1F1F', marginBottom: 4, textDecoration: 'line-through', textDecorationColor: '#DC2626' }}>
            R12,000+ per year
          </p>
          <p style={{ ...font, fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, color: '#7C3AED', marginBottom: 12 }}>
            Your Price: R0
          </p>
          <p style={{ ...font, fontSize: 15, fontWeight: 600, color: '#555' }}>
            You Pay ONLY When You Verify Someone's Public Record
          </p>
        </div>

        {/* Quick pricing tiers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" style={{ marginBottom: 36 }}>
          {pricingTiers.map((t) => (
            <div key={t.name} style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 14, padding: 20, textAlign: 'center' as const,
            }}>
              <p style={{ ...font, fontWeight: 700, fontSize: 15, color: '#1F1F1F', marginBottom: 4 }}>{t.name}</p>
              <p style={{ ...font, fontWeight: 800, fontSize: 28, color: '#7C3AED', marginBottom: 8 }}>{t.price}</p>
              <p style={{ ...font, fontSize: 13, color: '#555', marginBottom: 4 }}>{t.features}</p>
              <p style={{ ...mono, fontSize: 10, color: '#888' }}>⚡ {t.speed} · Saved forever</p>
            </div>
          ))}
        </div>
        <p style={{ ...font, fontSize: 11, color: '#888', textAlign: 'center' as const, marginBottom: 32 }}>
          *NRSO access subject to government Phase 3 rollout
        </p>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...font, fontWeight: 700, fontSize: 16, color: 'white',
              background: '#7C3AED', border: 'none', padding: '16px 36px',
              borderRadius: 50, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            Create Your Free Safety Base Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default ValueStack;
