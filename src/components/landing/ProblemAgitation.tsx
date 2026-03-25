import { useScrollReveal } from "@/hooks/useScrollReveal";
import founderPhoto from "@/assets/mckevin-ayaba.png";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const stats = [
  { value: "1 in 3", label: "women experience intimate partner violence in their lifetime", source: "Stats SA · Gender Series Report" },
  { value: "Every 3h", label: "a woman is killed by an intimate partner in South Africa", source: "SA Medical Research Council" },
  { value: "5×", label: "South Africa's femicide rate vs the global average", source: "WHO Global Study on Homicide" },
  { value: "92%", label: "of gender-based violence cases go unreported", source: "Africa Check / CSVR" },
  { value: "<8%", label: "conviction rate for reported GBV cases", source: "NPA Annual Report" },
  { value: "170K+", label: "contact crimes against women reported annually", source: "National Crime Statistics 2023/24" },
];

const ProblemAgitation = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: 'white', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Label */}
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20 }}>
          The Truth
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4.5vw, 48px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 20,
          maxWidth: 700,
        }}>
          The truth South Africa isn't ready to{' '}
          <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>hear.</em>
        </h2>

        <p style={{ ...sans, fontSize: 'clamp(14px, 1.8vw, 17px)', color: '#555', lineHeight: 1.75, marginBottom: 48, maxWidth: 640 }}>
          You were told to meet in public places, share your location, and trust your instincts. And women still died. Not because those behaviors don't work — but because they protect you from <strong style={{ color: '#1F1F1F' }}>strangers</strong>. Not from the person you let into your life.
        </p>

        {/* Stats grid */}
        <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 reveal-stagger ${isVisible ? 'visible' : ''}`} style={{ marginBottom: 56 }}>
          {stats.map((s) => (
            <div key={s.value} className="reveal-child" style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 16, padding: 'clamp(20px, 3vw, 28px)',
            }}>
              <p style={{ ...serif, fontSize: 'clamp(28px, 4vw, 40px)', color: '#7C3AED', marginBottom: 8 }}>
                {s.value}
              </p>
              <p style={{ ...sans, fontSize: 13, color: '#555', lineHeight: 1.5, marginBottom: 10 }}>
                {s.label}
              </p>
              <p style={{ ...mono, fontSize: 9, color: '#aaa', letterSpacing: '0.04em' }}>
                {s.source}
              </p>
            </div>
          ))}
        </div>

        {/* Emotional bridge */}
        <div style={{
          background: '#F5F0EB', borderRadius: 20, padding: 'clamp(24px, 4vw, 40px)',
          border: '1px solid #E6E0DA', marginBottom: 48,
        }}>
          <p style={{ ...sans, fontSize: 'clamp(14px, 1.8vw, 16px)', color: '#888', lineHeight: 1.8, marginBottom: 16 }}>
            The danger doesn't reveal itself on the first date. It reveals itself at Month 3. Month 6. Month 9. When you're already emotionally invested. When you're already financially entangled. When you're already isolated from support.
          </p>
          <p style={{ ...sans, fontSize: 'clamp(15px, 2vw, 18px)', fontWeight: 700, color: '#1F1F1F' }}>
            Most harm comes from someone you trusted.
          </p>
        </div>

        {/* Founder quote card */}
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 items-center" style={{
          background: 'white', border: '1px solid #E6E0DA',
          borderRadius: 20, padding: 'clamp(24px, 3vw, 36px)',
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          }}>
            <img src={founderPhoto} alt="McKevin Ayaba, Founder of RedFlaq" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <blockquote style={{
              ...serif, fontSize: 'clamp(15px, 2vw, 18px)', fontStyle: 'italic',
              color: '#1F1F1F', lineHeight: 1.6, margin: 0, marginBottom: 8,
            }}>
              "It begins with information people didn't have. Safety should never be a privilege. Public information should be accessible to everyone, not just HR departments with big budgets."
            </blockquote>
            <p style={{ ...sans, fontSize: 13, fontWeight: 700, color: '#888', margin: 0 }}>
              — McKevin Ayaba, Founder
            </p>
          </div>
        </div>

        {/* Core statement */}
        <div style={{ borderLeft: '3px solid #7C3AED', paddingLeft: 24, marginTop: 48 }}>
          <p style={{ ...serif, fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#1F1F1F', marginBottom: 6 }}>
            RedFlaq is not another awareness campaign.
          </p>
          <p style={{ ...serif, fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#7C3AED', fontStyle: 'italic' }}>
            RedFlaq is the action.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemAgitation;
