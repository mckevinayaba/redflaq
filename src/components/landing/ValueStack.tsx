import { useNavigate } from "react-router-dom";
import { BookOpen, Scale, FileText, Sparkles, Heart, Shield, Search, MessageSquare } from "lucide-react";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
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

const ValueStack = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: 'white', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20 }}>
          Free Forever
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4.5vw, 48px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 12,
        }}>
          Everything you get.{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>100% free.</em>
        </h2>
        <p style={{ ...sans, fontSize: 15, color: '#555', lineHeight: 1.7, marginBottom: 48, maxWidth: 640 }}>
          Most safety platforms charge you to feel safe. RedFlaq gives you everything for free. You only pay when you need to verify someone's public record.
        </p>

        {/* Free features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" style={{ marginBottom: 48 }}>
          {freeFeatures.map((f) => (
            <div key={f.title} style={{
              display: 'flex', gap: 14, padding: 22,
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 16, transition: 'box-shadow 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(124,58,237,0.06)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
            >
              <div style={{
                width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {f.icon}
              </div>
              <div>
                <h4 style={{ ...sans, fontWeight: 700, fontSize: 14, color: '#1F1F1F', marginBottom: 4 }}>
                  ✅ {f.title}
                </h4>
                <p style={{ ...sans, fontSize: 13, color: '#888', lineHeight: 1.55 }}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Value statement */}
        <div style={{
          background: '#F5F0EB', borderRadius: 20, padding: 'clamp(24px, 4vw, 40px)',
          textAlign: 'center', marginBottom: 40, border: '1px solid #E6E0DA',
        }}>
          <p style={{ ...sans, fontSize: 14, color: '#888', marginBottom: 4 }}>Total Value:</p>
          <p style={{ ...serif, fontSize: 'clamp(32px, 5vw, 48px)', color: '#1F1F1F', marginBottom: 4, textDecoration: 'line-through', textDecorationColor: '#DC2626' }}>
            R12,000+ per year
          </p>
          <p style={{ ...serif, fontSize: 'clamp(32px, 5vw, 48px)', color: '#7C3AED', marginBottom: 12 }}>
            Your Price: R0
          </p>
          <p style={{ ...sans, fontSize: 15, fontWeight: 600, color: '#555' }}>
            You Pay ONLY When You Verify Someone's Public Record
          </p>
        </div>

        {/* CTA */}
        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...sans, fontWeight: 700, fontSize: 16, color: 'white',
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
