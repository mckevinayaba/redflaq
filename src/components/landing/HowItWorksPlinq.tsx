import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", title: "You Provide Details", desc: "Enter their full name and province, and tell us why you're checking (dating, flat‑share, childcare, etc.)." },
  { num: "02", title: "We Scan Public Records", desc: "RedFlaq checks South African public‑record warning lists for possible matches on that name." },
  { num: "03", title: "You Get a Clear Safety Signal", desc: "See whether public records suggest high, moderate, low or no visible risk — with links to the original public record where possible." },
  { num: "04", title: "Download Your Report", desc: "Save a PDF to keep for yourself or share with someone you trust." },
];

const HowItWorksPlinq = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '100px 40px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
          The Process
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 500, color: '#2D2235', marginBottom: 56,
        }}>
          Fast. Simple. <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Public‑record based.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4" style={{ border: '1.5px solid #D6D3CD' }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="transition-colors hover:bg-[#FAF5FF]"
              style={{
                padding: '36px 28px',
                borderRight: i < steps.length - 1 ? '1.5px solid #D6D3CD' : 'none',
                background: 'white',
              }}
            >
              <div style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 64, color: '#EDE9FE',
                lineHeight: 1, marginBottom: 16,
              }}>
                {step.num}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                color: '#2D2235', marginBottom: 10,
              }}>
                {step.title}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#78716C', lineHeight: 1.6 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF', textAlign: 'center', marginTop: 24 }}>
          We never access private SAPS fingerprint or internal criminal record databases. RedFlaq only uses information that is already public.
        </p>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;
