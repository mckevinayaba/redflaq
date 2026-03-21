import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Sparkles } from "lucide-react";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const pillars = [
  {
    icon: <Search size={28} color="#7C3AED" />,
    title: "RedFlaq Before Trust",
    desc: "RedFlaq their public record in 60 seconds. SAPS wanted lists, court judgments, sex offender registry (when available). Know who you're trusting.",
  },
  {
    icon: <BookOpen size={28} color="#7C3AED" />,
    title: "Document Everything Early",
    desc: "My Safety Journal creates timestamped, court-admissible evidence. Start documenting before it escalates. Build proof while you can.",
  },
  {
    icon: <Sparkles size={28} color="#7C3AED" />,
    title: "Build Daily Safety Habits",
    desc: "Habit (coming soon) teaches you red flags, tracks patterns, and makes \"RedFlaq first\" your automatic behavior — not just crisis response.",
  },
];

const SolutionHormozi = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F0EB', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20 }}>
          The Solution
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4.5vw, 48px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 16,
        }}>
          Before you trust,{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>RedFlaq first.</em>
        </h2>
        <p style={{ ...sans, fontSize: 15, color: '#888', lineHeight: 1.7, marginBottom: 48, maxWidth: 560 }}>
          Three pillars that turn awareness into action — from the first moment of doubt to ongoing protection.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 48 }}>
          {pillars.map((p) => (
            <div key={p.title} style={{
              background: 'white', border: '1px solid #E6E0DA', borderRadius: 20,
              padding: 'clamp(28px, 4vw, 40px)', boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.08)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.04)'; }}
            >
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                {p.icon}
              </div>
              <h3 style={{ ...sans, fontWeight: 700, fontSize: 18, color: '#1F1F1F', marginBottom: 12 }}>
                {p.title}
              </h3>
              <p style={{ ...sans, fontSize: 14, color: '#555', lineHeight: 1.7 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...sans, fontWeight: 700, fontSize: 15, color: 'white',
              background: '#7C3AED', border: 'none', padding: '14px 32px',
              borderRadius: 50, cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Create Your Free Safety Base
          </button>
        </div>
      </div>
    </section>
  );
};

export default SolutionHormozi;
