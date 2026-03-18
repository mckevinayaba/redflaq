import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageCircle, Link2 } from "lucide-react";

const testimonials = [
  { quote: "I kept thinking I was the problem.\n\nHe would get angry and then act normal again.\n\nI checked his name after a friend mentioned RedFlaq.\n\nThere was something about assault.\n\nThat's when it clicked.\n\nIt wasn't me.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "The first time I went to the police, the officer looked tired.\n\nHe didn't even look at me properly.\n\nHe wrote my statement in two sentences.\n\nI left feeling like I imagined everything.\n\nI started writing things down myself after that.", name: "Anonymous", location: "KwaZulu-Natal", use: "GBV survivor" },
  { quote: "He never hit me in the beginning.\n\nIt was small things. Control. Questions. Mood swings.\n\nI checked his name one night.\n\nThere was a record linked to violence.\n\nI stopped ignoring what I was feeling after that.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "I almost didn't check.\n\nHe was polite. Everyone liked him.\n\nI didn't want to look crazy.\n\nI checked anyway.\n\nSomething came up.\n\nI didn't confront him. I just left.", name: "Anonymous", location: "Gauteng", use: "Dating safety" },
  { quote: "I am still shaking.\n\nI checked his name and it came up twice.\n\nDomestic violence. And house robbery.\n\nI read it again just to be sure.\n\nI haven't replied to him since.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "I was angry at my friend for checking my boyfriend.\n\nShe saw the bruises and didn't say anything to me first.\n\nShe just checked him.\n\nWhen she showed me the results, I went quiet.\n\nI had to apologize to her.\n\nIt was terrifying, yoh.", name: "Anonymous", location: "Gauteng", use: "Community safety" },
  { quote: "I saw an assault record linked to his name. It was from 2021.\n\nWe've been dating for almost two years.\n\nI asked him about it.\n\nHe said it wasn't what it looked like. That he was falsely accused.\n\nI believed him.\n\nHe has never hit me.\n\nBut I still think about it sometimes.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
];

const TestimonialsSectionNew = () => {
  const { ref, isVisible } = useScrollReveal(0.01);

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    const shareText = "Check out RedFlaq — search public records for safety red flags in under 60 seconds. https://redflaq.com";
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard.writeText("https://redflaq.com");
    }
  };

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} py-12 md:py-20 px-5`} style={{
      background: '#F5F0EB',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#6B4EFF', marginBottom: 16, justifyContent: 'center' }}>
          Real Stories · Real Safety
        </div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(28px, 4vw, 42px)', color: '#1F1F1F', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em',
        }}>
          They checked. It changed <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>everything.</em>
        </h2>

        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#888888',
          textAlign: 'center', marginBottom: 48,
        }}>
          These are the kinds of decisions RedFlaq was built for.
        </p>

        <div
          className={`grid grid-cols-1 md:grid-cols-2 gap-3 reveal-stagger ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: 48, maxWidth: 860, margin: '0 auto 48px' }}
        >
          {testimonials.map((t, i) => {
            const isFeatured = (t as any).featured;
            return (
              <div key={i} className="card-lift reveal-child" style={{
                background: isFeatured ? '#E9E3FF' : '#FFFFFF',
                borderLeft: '3px solid #6B4EFF',
                borderRadius: 12,
                border: `1px solid ${isFeatured ? '#6B4EFF30' : '#E6E0DA'}`,
                borderLeftWidth: 3,
                borderLeftColor: '#6B4EFF',
                padding: '20px 20px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}
              >
                <div>
                  <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48, lineHeight: 0.8, color: '#6B4EFF20', display: 'block',
                  }}>"</span>
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 13.5, color: '#555555',
                    lineHeight: 1.55, marginTop: -4, fontStyle: 'italic', whiteSpace: 'pre-line',
                  }}>
                    {t.quote}
                  </p>
                  {(t as any).footnote && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888', fontStyle: 'italic', marginTop: 12 }}>
                      {(t as any).footnote}
                    </p>
                  )}
                </div>

                <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: '#E9E3FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: '#6B4EFF' }}>
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#1F1F1F', margin: 0 }}>
                      {t.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888' }}>
                        {t.location}
                      </span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#6B4EFF',
                        background: '#E9E3FF', padding: '2px 8px', borderRadius: 50,
                      }}>
                        {t.use}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Privacy note */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888',
          textAlign: 'center', lineHeight: 1.6,
        }}>
          Names and identifying details are representative of the kinds of people RedFlaq protects. Privacy is central to everything we do.
        </p>

        {/* GBV helpline */}
        <div style={{
          marginTop: 32,
          background: '#E9E3FF',
          border: '1px solid #6B4EFF30',
          borderRadius: 12,
          padding: '16px 24px',
          textAlign: 'center',
        }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555' }}>
            If you or someone you know is experiencing abuse, contact the GBV Command Centre:{" "}
            <a href="tel:0800428428" style={{ color: '#6B4EFF', fontWeight: 700, textDecoration: 'none' }}>0800 428 428</a>
            {" "}(24/7, free)
          </p>
        </div>

        {/* Share buttons */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', marginBottom: 14 }}>
            Did RedFlaq help you? <strong style={{ color: '#1F1F1F' }}>Share it with a woman who needs it.</strong>
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleShare('whatsapp')}
              style={{
                background: '#25D366', color: 'white', padding: '10px 24px', border: 'none',
                borderRadius: 50, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#128C7E'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = '#25D366'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <MessageCircle style={{ width: 14, height: 14 }} /> Share on WhatsApp
            </button>
            <button
              onClick={() => handleShare('copy')}
              style={{
                background: 'transparent', color: '#6B4EFF', padding: '10px 24px',
                border: '1.5px solid #6B4EFF40', borderRadius: 50,
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = '#E9E3FF'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
            >
              <Link2 style={{ width: 14, height: 14 }} /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
