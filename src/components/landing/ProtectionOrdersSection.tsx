import { useNavigate } from "react-router-dom";
import { Shield, Scale, FileText, Clock, Check, ArrowRight } from "lucide-react";

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

  return (
    <section style={{ background: '#F5F3FF', padding: '80px 24px' }} className="py-[60px] md:py-[80px]">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-12 lg:gap-16">
          {/* LEFT COLUMN */}
          <div>
            {/* Badge */}
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'white', border: '1px solid #7C3AED',
              color: '#7C3AED', padding: '4px 12px', borderRadius: 16,
              fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 500,
              marginBottom: 16,
            }}>
              <Shield size={14} aria-hidden="true" />
              Legal Protection Available
            </div>

            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(24px, 3vw, 32px)',
              fontWeight: 700,
              color: '#111827',
              marginBottom: 12,
              letterSpacing: '-0.02em',
            }}>
              Need a Protection Order?
            </h2>

            <p style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 18,
              color: '#4B5563',
              lineHeight: '28px',
              marginBottom: 32,
            }}>
              Free legal protection available at any Magistrate's Court in South Africa. No lawyer required.
            </p>

            {/* Content blocks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {contentBlocks.map((block) => {
                const Icon = block.icon;
                return (
                  <div key={block.title} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: '#EDE9FE',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Icon size={20} color="#7C3AED" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 18,
                        fontWeight: 600,
                        color: '#111827',
                        marginBottom: 6,
                      }}>
                        {block.title}
                      </h3>
                      <p style={{
                        fontFamily: "'Syne', sans-serif",
                        fontSize: 15,
                        color: '#4B5563',
                        lineHeight: '24px',
                      }}>
                        {block.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Link */}
            <button
              onClick={() => navigate('/safety-tips')}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 500,
                color: '#7C3AED', marginTop: 32, padding: 0,
                transition: 'gap 0.2s ease',
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
              background: 'white',
              borderRadius: 12,
              padding: 32,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
              border: '1px solid rgba(124, 58, 237, 0.1)',
            }}>
              {/* Free Tool badge */}
              <span style={{
                display: 'inline-block',
                background: '#EDE9FE',
                color: '#7C3AED',
                padding: '4px 12px',
                borderRadius: 12,
                fontFamily: "'Syne', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                marginBottom: 16,
              }}>
                Free Tool
              </span>

              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 20,
                fontWeight: 600,
                color: '#111827',
                marginBottom: 12,
              }}>
                Build Your Evidence with My Safety Journal
              </h3>

              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 15,
                color: '#4B5563',
                lineHeight: '24px',
                marginBottom: 20,
              }}>
                Courts need proof. My Safety Journal helps you document abuse privately and organize evidence that lawyers can use.
              </p>

              {/* Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                {checklist.map((item) => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Check size={16} color="#7C3AED" aria-hidden="true" style={{ flexShrink: 0 }} />
                    <span style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 15,
                      color: '#111827',
                      lineHeight: '28px',
                    }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate('/signup')}
                className="w-full sm:w-auto"
                style={{
                  background: '#7C3AED',
                  color: 'white',
                  padding: '14px 28px',
                  borderRadius: 8,
                  fontFamily: "'Syne', sans-serif",
                  fontSize: 16,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  width: '100%',
                  transition: 'background 0.25s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#5B21B6'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; }}
              >
                Start Documenting Free
              </button>

              {/* Legal disclaimer */}
              <p style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: 13,
                color: '#6B7280',
                lineHeight: '20px',
                marginTop: 16,
                fontStyle: 'italic',
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
