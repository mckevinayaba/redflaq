import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShieldAlert } from "lucide-react";

const steps = [
  { num: "01", title: "You Provide Details", desc: "Enter their full name and province, and tell us why you're checking (dating, flat-share, childcare, etc.)." },
  { num: "02", title: "We Scan Public Records", desc: "RedFlaq checks South African public-record warning lists for possible matches on that name." },
  { num: "03", title: "You Get a Clear Safety Signal", desc: "See whether public records suggest high, moderate, low or no visible risk — with links to the original public record where possible." },
  { num: "04", title: "Download Your Report", desc: "Save a PDF to keep for yourself or share with someone you trust." },
];

const HowItWorksPlinq = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section id="how-it-works" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#FAFAF8', borderTop: '1px solid #E6E0DA', borderBottom: '1px solid #E6E0DA' }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>The Process</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)',
            color: '#1F1F1F', marginTop: 12, letterSpacing: '-0.02em',
          }}>
            Fast. Simple. <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>Public-record based.</em>
          </h2>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#555555',
            lineHeight: 1.7, maxWidth: 600, margin: '12px auto 0',
          }}>
            Trusting relationships begin with information. Here's how RedFlaq turns public-record warning lists into a simple safety signal.
          </p>
        </div>

        {/* Horizontal stepper on desktop, vertical on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
          {/* Connector line (desktop) */}
          <div className="hidden md:block absolute top-[40px] left-[12.5%] right-[12.5%] h-[1px]" style={{ background: '#E6E0DA' }} />

          {steps.map((step, i) => (
            <div key={step.num} style={{ padding: '0 16px', textAlign: 'center', position: 'relative' }}>
              {/* Step number */}
              <div style={{
                width: 56, height: 56, borderRadius: 8,
                background: '#FFFFFF', border: '1px solid #E6E0DA',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', position: 'relative', zIndex: 2,
              }}>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 16,
                  color: '#6B4EFF', fontWeight: 700,
                }}>
                  {step.num}
                </span>
              </div>

              <div style={{
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                color: '#1F1F1F', marginBottom: 8,
              }}>
                {step.title}
              </div>
              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555',
                lineHeight: 1.65, maxWidth: 240, margin: '0 auto',
              }}>
                {step.desc}
              </p>

              {/* Mobile connector */}
              {i < steps.length - 1 && (
                <div className="md:hidden" style={{
                  width: 1, height: 32, background: '#E6E0DA', margin: '16px auto',
                }} />
              )}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: 56, background: '#FFFFFF', border: '1px solid #E6E0DA',
          borderRadius: 8, padding: '16px 24px',
          display: 'flex', alignItems: 'center', gap: 14,
          maxWidth: 640, margin: '56px auto 0',
        }}>
          <ShieldAlert style={{ width: 18, height: 18, color: '#6B4EFF', flexShrink: 0, opacity: 0.7 }} />
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555', lineHeight: 1.5 }}>
            We never access private SAPS fingerprint or internal criminal record databases. RedFlaq only uses information that is already public.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksPlinq;
