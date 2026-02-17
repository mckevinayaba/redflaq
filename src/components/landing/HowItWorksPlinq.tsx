import { useScrollReveal } from "@/hooks/useScrollReveal";

const steps = [
  { num: "01", title: "You Provide Details", desc: "Full name, SA ID number, and reason for search. All information encrypted and secured under POPIA.", time: "⏱ 30 seconds" },
  { num: "02", title: "We Search Records", desc: "Our system searches SAPS wanted persons, SAFLII court judgments, and government gazettes simultaneously.", time: "⏱ 1 to 2 minutes" },
  { num: "03", title: "Human Verification", desc: "Our team confirms matches are the correct person. South Africa has many duplicate names. We verify before we report.", time: "⏱ 2 to 3 minutes" },
  { num: "04", title: "You Get the Report", desc: "Color-coded result with source links. Every finding is traceable and cited. Red, Amber, or Green.", time: "⏱ Delivered instantly" },
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
          fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 600, color: '#0D0B0E', marginBottom: 64,
        }}>
          Fast. Verified. <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Defensible.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4" style={{ border: '1.5px solid #0D0B0E' }}>
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="transition-colors hover:bg-[#EDE9E3]"
              style={{
                padding: '40px 32px',
                borderRight: i < steps.length - 1 ? '1.5px solid #0D0B0E' : 'none',
              }}
            >
              <div style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 72, color: '#DDD6FE',
                lineHeight: 1, marginBottom: 16,
              }}>
                {step.num}
              </div>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
                color: '#0D0B0E', marginBottom: 12, letterSpacing: '0.02em',
              }}>
                {step.title}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', lineHeight: 1.6 }}>
                {step.desc}
              </p>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7C3AED',
                fontWeight: 500, letterSpacing: '0.1em',
                borderTop: '1px solid #DDD6FE', paddingTop: 12, marginTop: 20, display: 'block',
              }}>
                {step.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;
