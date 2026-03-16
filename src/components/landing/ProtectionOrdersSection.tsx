import { useNavigate } from "react-router-dom";
import { Shield, Scale, FileText, Clock, Check, ArrowRight } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const contentBlocks = [
  {
    icon: Scale,
    title: "What is a Protection Order?",
    description: "A court order that legally stops an abuser from contacting, threatening, or harming you. Covers physical, emotional, verbal, economic, and sexual abuse under the Domestic Violence Act. Available same day in urgent cases.",
  },
  {
    icon: FileText,
    title: "What Evidence Do Courts Ask For?",
    description: "Dated incidents with times and details, photos of injuries, threatening text messages or voice recordings, witness names, medical reports (J88 forms from doctors). My Safety Journal helps you organize all this evidence in one secure place.",
  },
  {
    icon: Clock,
    title: "How Long Does It Take?",
    description: "Interim order can be granted the same day if your case is urgent. Final order typically takes 7–14 days after a hearing where both parties can speak. Completely free at any Magistrate's Court in South Africa.",
  },
];

const checklist = [
  "Document incidents with dates and times",
  "Upload photos of injuries or property damage",
  "Record threatening voice messages",
  "Save screenshots of abusive texts/WhatsApp",
  "Export everything to PDF for court",
  "Share with lawyer or Legal Aid SA",
];

const ProtectionOrdersSection = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{ background: '#FAFAF8', borderTop: '1px solid #E6E0DA', borderBottom: '1px solid #E6E0DA' }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16">
          {/* LEFT COLUMN */}
          <div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: '#F1ECFF', border: '1px solid rgba(107,78,255,0.2)',
              color: '#6B4EFF', padding: '4px 12px', borderRadius: 4,
              fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, marginBottom: 16,
            }}>
              <Shield size={14} aria-hidden="true" />
              Legal Protection Available
            </div>

            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(24px, 3vw, 32px)', color: '#1F1F1F',
              marginBottom: 12, letterSpacing: '-0.02em',
            }}>
              Need a Protection Order?
            </h2>

            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#555555',
              lineHeight: 1.7, marginBottom: 32,
            }}>
              Free legal protection available at any Magistrate's Court in South Africa. No lawyer required.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {contentBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: 8, background: '#F1ECFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      <Icon size={18} color="#6B4EFF" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 600, color: '#1F1F1F', marginBottom: 4 }}>
                        {block.title}
                      </h3>
                      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', lineHeight: 1.6 }}>
                        {block.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button onClick={() => navigate('/safety-tips')} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 600,
              color: '#6B4EFF', marginTop: 28, padding: 0,
            }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              Step-by-Step Protection Order Guide
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </div>

          {/* RIGHT COLUMN */}
          <div>
            <div style={{
              background: '#FFFFFF', borderRadius: 8, padding: 28,
              border: '1px solid #E6E0DA',
            }}>
              <span style={{
                display: 'inline-block', background: '#F1ECFF', color: '#6B4EFF',
                padding: '4px 10px', borderRadius: 4,
                fontFamily: "'Syne', sans-serif", fontSize: 11, fontWeight: 600, marginBottom: 14,
              }}>
                Free Tool
              </span>

              <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 600, color: '#1F1F1F', marginBottom: 10 }}>
                Build Your Evidence with My Safety Journal
              </h3>

              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', lineHeight: 1.6, marginBottom: 18 }}>
                Courts need proof. My Safety Journal helps you document abuse privately and organize evidence that lawyers can use.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                {checklist.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check size={14} color="#6B4EFF" aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#1F1F1F', lineHeight: 1.5 }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/signup')} className="w-full" style={{
                background: '#6B4EFF', color: 'white', padding: '14px 24px',
                borderRadius: 4, fontFamily: "'Syne', sans-serif", fontSize: 15,
                fontWeight: 600, border: 'none', cursor: 'pointer',
                transition: 'background 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#5539E8'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#6B4EFF'; }}
              >
                Start Documenting Free
              </button>

              <p style={{
                fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888',
                lineHeight: 1.5, marginTop: 14, fontStyle: 'italic',
              }}>
                My Safety Journal is a documentation tool. It does not guarantee court acceptance. Always consult Legal Aid SA (0800 110 110) for legal advice.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProtectionOrdersSection;
