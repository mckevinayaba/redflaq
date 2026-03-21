import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { MessageCircle, Link2 } from "lucide-react";

const stories = [
  { quote: "I kept thinking I was the problem.\n\nHe would get angry and then act normal again.\n\nI checked his name after a friend mentioned RedFlaq.\n\nThere was something about assault.\n\nThat's when it clicked.\n\nIt wasn't me.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "The first time I went to the police, the officer looked tired.\n\nHe didn't even look at me properly.\n\nHe wrote my statement in two sentences.\n\nI left feeling like I imagined everything.\n\nI started writing things down myself after that.", name: "Anonymous", location: "KwaZulu-Natal", use: "GBV survivor" },
  { quote: "He never hit me in the beginning.\n\nIt was small things. Control. Questions. Mood swings.\n\nI checked his name one night.\n\nThere was a record linked to violence.\n\nI stopped ignoring what I was feeling after that.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "I almost didn't check.\n\nHe was polite. Everyone liked him.\n\nI didn't want to look crazy.\n\nI checked anyway.\n\nSomething came up.\n\nI didn't confront him. I just left.", name: "Anonymous", location: "Gauteng", use: "Dating safety" },
  { quote: "I am still shaking.\n\nI checked his name and it came up twice.\n\nDomestic violence. And house robbery.\n\nI read it again just to be sure.\n\nI haven't replied to him since.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
  { quote: "I was angry at my friend for checking my boyfriend.\n\nShe saw the bruises and didn't say anything to me first.\n\nShe just checked him.\n\nWhen she showed me the results, I went quiet.\n\nI had to apologize to her.\n\nIt was terrifying, yoh.", name: "Anonymous", location: "Gauteng", use: "Community safety" },
  { quote: "I saw an assault record linked to his name. It was from 2021.\n\nWe've been dating for almost two years.\n\nI asked him about it.\n\nHe said it wasn't what it looked like. That he was falsely accused.\n\nI believed him.\n\nHe has never hit me.\n\nBut I still think about it sometimes.", name: "Anonymous", location: "Gauteng", use: "Relationship safety" },
];

const CustomerStories = () => {
  const handleShare = (platform: 'whatsapp' | 'copy') => {
    const shareText = "Check out RedFlaq — search public records for safety red flags in under 60 seconds. https://redflaq.com";
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard.writeText("https://redflaq.com");
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#F5F0EB' }}>
      <NavbarPlinq />

      <section className="py-16 md:py-24 px-5">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: 'hsl(var(--primary))', marginBottom: 16, justifyContent: 'center' }}>
            Real Stories · Real Safety
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(32px, 5vw, 48px)', color: 'hsl(var(--foreground))', textAlign: 'center', marginBottom: 8, letterSpacing: '-0.02em',
          }}>
            They checked. It changed <em style={{ color: 'hsl(var(--primary))', fontStyle: 'italic' }}>everything.</em>
          </h1>

          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 16, color: 'hsl(var(--muted-foreground))',
            textAlign: 'center', marginBottom: 56, maxWidth: 520, margin: '0 auto 56px',
          }}>
            These are the kinds of decisions RedFlaq was built for.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ marginBottom: 48 }}>
            {stories.map((t, i) => (
              <div key={i} style={{
                background: '#FFFFFF',
                borderLeft: '3px solid hsl(var(--primary))',
                borderRadius: 12,
                border: '1px solid #E6E0DA',
                borderLeftWidth: 3,
                borderLeftColor: 'hsl(var(--primary))',
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              }}>
                <div>
                  <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48, lineHeight: 0.8, color: 'hsl(var(--primary) / 0.12)', display: 'block',
                  }}>"</span>
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555',
                    lineHeight: 1.6, marginTop: -4, fontStyle: 'italic', whiteSpace: 'pre-line',
                  }}>
                    {t.quote}
                  </p>
                </div>

                <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: 'hsl(var(--primary) / 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, color: 'hsl(var(--primary))' }}>
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: 'hsl(var(--foreground))', margin: 0 }}>
                      {t.name}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'hsl(var(--muted-foreground))' }}>
                        {t.location}
                      </span>
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'hsl(var(--primary))',
                        background: 'hsl(var(--primary) / 0.1)', padding: '2px 8px', borderRadius: 50,
                      }}>
                        {t.use}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Privacy note */}
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'hsl(var(--muted-foreground))',
            textAlign: 'center', lineHeight: 1.6,
          }}>
            Names and identifying details are representative of the kinds of people RedFlaq protects. Privacy is central to everything we do.
          </p>

          {/* GBV helpline */}
          <div style={{
            marginTop: 32,
            background: 'hsl(var(--primary) / 0.08)',
            border: '1px solid hsl(var(--primary) / 0.2)',
            borderRadius: 12,
            padding: '16px 24px',
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555' }}>
              If you or someone you know is experiencing abuse, contact the GBV Command Centre:{" "}
              <a href="tel:0800428428" style={{ color: 'hsl(var(--primary))', fontWeight: 700, textDecoration: 'none' }}>0800 428 428</a>
              {" "}(24/7, free)
            </p>
          </div>

          {/* Share buttons */}
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', marginBottom: 14 }}>
              Did RedFlaq help you? <strong style={{ color: 'hsl(var(--foreground))' }}>Share it with a woman who needs it.</strong>
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => handleShare('whatsapp')}
                className="flex items-center gap-2 rounded-full font-bold text-sm px-6 py-2.5 transition-all hover:opacity-90"
                style={{ background: '#25D366', color: 'white', fontFamily: "'Syne', sans-serif", border: 'none', cursor: 'pointer' }}
              >
                <MessageCircle className="w-3.5 h-3.5" /> Share on WhatsApp
              </button>
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center gap-2 rounded-full font-bold text-sm px-6 py-2.5 transition-all hover:opacity-90"
                style={{
                  background: 'transparent', color: 'hsl(var(--primary))',
                  border: '1.5px solid hsl(var(--primary) / 0.3)', fontFamily: "'Syne', sans-serif", cursor: 'pointer',
                }}
              >
                <Link2 className="w-3.5 h-3.5" /> Copy Link
              </button>
            </div>
          </div>
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
};

export default CustomerStories;
