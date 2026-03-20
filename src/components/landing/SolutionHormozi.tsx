import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Sparkles } from "lucide-react";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const pillars = [
  {
    icon: <Search size={24} color="#7C3AED" />,
    title: "Verify Before Trust",
    desc: "Check their public record in 60 seconds. SAPS wanted lists, court judgments, sex offender registry (when available). Know who you're trusting.",
  },
  {
    icon: <BookOpen size={24} color="#7C3AED" />,
    title: "Document Everything Early",
    desc: "My Safety Journal creates timestamped, court-admissible evidence. Start documenting before it escalates. Build proof while you can.",
  },
  {
    icon: <Sparkles size={24} color="#7C3AED" />,
    title: "Build Daily Safety Habits",
    desc: "Habit (coming soon) teaches you red flags, tracks patterns, and makes \"check first\" your automatic behavior — not just crisis response.",
  },
];

const SolutionHormozi = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#F5F0EB', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          THE SOLUTION
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 38px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 40,
        }}>
          Before You Trust, RedFlaq First
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 40 }}>
          {pillars.map((p) => (
            <div key={p.title} style={{
              background: 'white', border: '1px solid #E6E0DA', borderRadius: 16,
              padding: 28, boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'rgba(124,58,237,0.06)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                {p.icon}
              </div>
              <h3 style={{ ...font, fontWeight: 700, fontSize: 17, color: '#1F1F1F', marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ ...font, fontSize: 14, color: '#555555', lineHeight: 1.65 }}>
                {p.desc}
              </p>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={() => navigate('/signup')}
            style={{
              ...font, fontWeight: 700, fontSize: 15, color: 'white',
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
