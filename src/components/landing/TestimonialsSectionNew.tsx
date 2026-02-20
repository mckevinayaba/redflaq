import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "I was about to let someone move into my spare room. RedFlaq gave me clarity in under a minute. Turned out there were public record warnings I would never have known about.",
    location: "Johannesburg",
    use: "Tenant screening",
  },
  {
    quote: "Simple. Fast. Worth every cent. I recommended it to my sister immediately.",
    location: "Cape Town",
    use: "Personal safety",
  },
  {
    quote: "Finally something built for us, not for HR departments.",
    location: "Pretoria",
    use: "Dating safety",
  },
];

const TestimonialsSectionNew = () => {
  const { ref, isVisible } = useScrollReveal();

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    const shareText = "Check out RedFlaq — search public records for safety red flags in under 60 seconds. https://redflaq.com";
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard.writeText("https://redflaq.com");
    }
  };

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '40px 40px 48px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <div className="section-tag justify-center" style={{ color: '#7C3AED', marginBottom: 16 }}>
          What People Say
        </div>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 44px)', color: '#2D2235', textAlign: 'center', marginBottom: 48,
        }}>
          Real stories. Real <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>clarity.</em>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} style={{
              background: 'white', border: '1.5px solid #EDE9FE', padding: 32,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <div>
                <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 48, lineHeight: 0.8, color: '#EDE9FE' }}>"</span>
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', lineHeight: 1.7, marginTop: -8 }}>
                  {t.quote}
                </p>
              </div>
              <div style={{ marginTop: 20, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF' }}>
                — {t.location}, {t.use}
              </div>
            </div>
          ))}
        </div>

        {/* Share nudge */}
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453', marginBottom: 16 }}>
            Did RedFlaq help you? <strong>Share it with a woman who needs it.</strong>
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              style={{
                background: '#25D366', color: 'white', padding: '10px 20px', border: 'none',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Share on WhatsApp
            </button>
            <button
              onClick={() => handleShare('copy')}
              style={{
                background: 'transparent', color: '#7C3AED', padding: '10px 20px',
                border: '1.5px solid #7C3AED',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
