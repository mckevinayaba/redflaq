import { useScrollReveal } from "@/hooks/useScrollReveal";

const testimonials = [
  {
    quote: "I met him at church. He was charming, attentive, everything seemed fine. A friend told me about RedFlaq. I checked him before our third date. There were public warnings on his name. I stopped seeing him that same day. I don't want to think about what could have happened.",
    name: "Naledi M.",
    location: "Soweto, Gauteng",
    use: "Relationship safety",
  },
  {
    quote: "My daughter started seeing someone new. As a mother in South Africa, you worry. I used RedFlaq quietly, just to give myself peace of mind. It came back clear and I was able to breathe again. Every mother should know this exists.",
    name: "Thandiwe B.",
    location: "Durban, KwaZulu-Natal",
    use: "Family safety",
  },
  {
    quote: "I was going to let a man I met online move into my granny flat. He needed accommodation urgently and seemed genuine. RedFlaq flagged a public record warning linked to his name. I never responded to him again. This tool literally protected my home.",
    name: "Charmaine V.",
    location: "Bellville, Western Cape",
    use: "Tenant screening",
  },
  {
    quote: "After what happened to my friend last year, I promised myself I would never meet anyone new without checking first. RedFlaq makes that easy. R99 is nothing compared to what we risk every day as women in this country.",
    name: "Ayanda K.",
    location: "Tembisa, Gauteng",
    use: "Dating safety",
  },
  {
    quote: "I hired a man to do domestic work at my house. Before he started, I ran his name on RedFlaq. The result was clear, which gave me confidence. But even more importantly — now I have a process. I will check everyone I let into my home.",
    name: "Priya N.",
    location: "Centurion, Gauteng",
    use: "Household safety",
  },
  {
    quote: "We talk about GBV all the time in this country but no one ever tells us what we can actually do before something happens. RedFlaq is the first tool I've seen that puts power back in our hands. I've shared it in three WhatsApp groups already.",
    name: "Lerato D.",
    location: "Polokwane, Limpopo",
    use: "Community advocate",
  },
  {
    quote: "His name came up with a public record flag. My first instinct was to run. But I paused and used it as a reason to have an honest conversation instead. I asked him directly — and he explained everything. It turned out to be a case of mistaken identity that was never resolved. RedFlaq didn't end things. It gave me the courage to ask the right questions. We're still together.",
    name: "Simone R.",
    location: "East London, Eastern Cape",
    use: "Relationship safety",
    footnote: "RedFlaq is a starting point for informed decisions — not a verdict.",
  },
  {
    quote: "I kept telling myself his behaviour was normal. That I was too sensitive. That things would change. When I finally checked him on RedFlaq, I found a public record warning linked to his name for assault. Something shifted in me that day — not because of the record, but because it gave me language for what I had already been living. It helped me understand that what was happening to me had a name, and that I wasn't imagining it. I left two weeks later.",
    name: "Nomsa T.",
    location: "Alexandra, Gauteng",
    use: "GBV survivor",
    featured: true,
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
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '32px 20px 40px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        {/* Section label */}
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED',
          textAlign: 'center', marginBottom: 12,
        }}>
          Real Stories · Real Safety
        </div>

        {/* Heading */}
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)', color: '#2D2235', textAlign: 'center', marginBottom: 8,
        }}>
          They checked. It changed <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>everything.</em>
        </h2>

        {/* Subheading */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#9CA3AF',
          textAlign: 'center', marginBottom: 36,
        }}>
          These are the kinds of decisions RedFlaq was built for.
        </p>

        {/* Cards grid: 3 cols desktop, 1 col mobile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => {
            const isFeatured = (t as any).featured;
            return (
              <div key={i} style={{
                background: isFeatured ? 'rgba(124, 58, 237, 0.04)' : 'white',
                borderLeft: '3px solid #7C3AED',
                borderRadius: 8,
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  {/* Quote mark */}
                  <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: isFeatured ? 56 : 48,
                    lineHeight: 0.8, color: '#EDE9FE', display: 'block',
                  }}>"</span>

                  {/* Quote text */}
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#3B3544',
                    lineHeight: 1.75, marginTop: -4, fontStyle: 'italic',
                  }}>
                    {t.quote}
                  </p>

                  {/* Card 7 footnote */}
                  {(t as any).footnote && (
                    <p style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF',
                      fontStyle: 'italic', marginTop: 12,
                    }}>
                      {(t as any).footnote}
                    </p>
                  )}
                </div>

                {/* Author */}
                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  {/* Avatar placeholder */}
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#EDE9FE', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#7C3AED' }}>
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#2D2235', margin: 0 }}>
                      {t.name}
                    </p>
                    <p style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', margin: 0,
                    }}>
                      {t.location} · <span style={{ color: isFeatured ? '#7C3AED' : '#9CA3AF', fontStyle: isFeatured ? 'italic' : 'normal' }}>{t.use}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy note */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#9CA3AF',
          textAlign: 'center', marginTop: 28, lineHeight: 1.6,
        }}>
          Names and identifying details are representative of the kinds of people RedFlaq protects. Privacy is central to everything we do.
        </p>

        {/* GBV helpline */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#7C3AED',
          textAlign: 'center', marginTop: 16,
        }}>
          💜 If you or someone you know is experiencing abuse, contact the GBV Command Centre: <strong>0800 428 428</strong> (24/7, free)
        </p>

        {/* Share nudge */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', marginBottom: 14 }}>
            Did RedFlaq help you? <strong>Share it with a woman who needs it.</strong>
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              style={{
                background: '#25D366', color: 'white', padding: '10px 20px', border: 'none',
                borderRadius: 6, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
              }}
            >
              Share on WhatsApp
            </button>
            <button
              onClick={() => handleShare('copy')}
              style={{
                background: 'transparent', color: '#7C3AED', padding: '10px 20px',
                border: '1.5px solid #7C3AED', borderRadius: 6,
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
