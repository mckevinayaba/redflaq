import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", title: "You Provide Details", desc: "Share their full name and, if you know it, province or area. Tell us your legitimate reason for searching so we can respect everyone's rights.", time: "⏱ 30 seconds" },
  { num: "02", title: "We Scan Public Records", desc: "Our system checks South African public‑record warning lists, including wanted and sanctions information, for possible matches on that name.", time: "⏱ Under a minute" },
  { num: "03", title: "You Get a Clear Safety Signal", desc: "We highlight any possible matches, show crime type, status, area and timing when available, and explain what this could mean for your safety.", time: "⏱ Instant results" },
  { num: "04", title: "Download Your Report", desc: "View your results online or download a detailed PDF report so you can keep a record or share it with someone you trust.", time: "⏱ Available immediately" },
];

const HowItWorksPlinq = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 60px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
          The Process
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 600, color: '#2D2235', marginBottom: 64,
        }}>
          Fast. Simple. <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Public‑record based.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4" style={{ border: '1.5px solid #D6D3CD' }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="transition-colors hover:bg-[#FAF5FF]"
              style={{
                padding: '40px 32px',
                borderRight: i < steps.length - 1 ? '1.5px solid #D6D3CD' : 'none',
                background: 'white',
              }}
            >
              <div style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 72, color: '#EDE9FE',
                lineHeight: 1, marginBottom: 16,
              }}>
                {step.num}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
                color: '#2D2235', marginBottom: 12, letterSpacing: '0.02em',
              }}>
                {step.title}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6 }}>
                {step.desc}
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7C3AED',
                fontWeight: 500, letterSpacing: '0.1em',
                borderTop: '1px solid #EDE9FE', paddingTop: 12, marginTop: 20, display: 'block',
              }}>
                {step.time}
              </span>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9CA3AF', textAlign: 'center', marginTop: 24 }}>
          We never access private SAPS fingerprint or internal criminal record databases. RedFlaq only uses information that is already public.
        </p>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;
