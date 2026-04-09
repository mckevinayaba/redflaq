import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const testimonials = [
  {
    initials: "T",
    name: "Thandi M.",
    location: "Johannesburg",
    headline: "I was not the problem.",
    quote: "I read this three times. The part about rage being a tool — that is exactly what happened to me. I always thought I was the problem when he got angry.\n\nI was not the problem.",
  },
  {
    initials: "A",
    name: "Anonymous",
    location: "Gauteng",
    headline: "That's when it clicked.",
    quote: "I kept thinking I was the problem.\n\nHe would get angry and then act normal again.\n\nI checked his name after a friend mentioned RedFlaq.\n\nThere was something about assault.\n\nThat's when it clicked.",
  },
  {
    initials: "A",
    name: "Anonymous",
    location: "KwaZulu-Natal",
    headline: "I left feeling like I imagined everything.",
    quote: "The first time I went to the police, the officer looked tired. He didn't even look at me properly.\n\nI left feeling like I imagined everything.\n\nI started writing things down myself after that.",
  },
  {
    initials: "A",
    name: "Anonymous",
    location: "Gauteng",
    headline: "He was polite. Everyone liked him.",
    quote: "I almost didn't check.\n\nHe was polite. Everyone liked him.\n\nI didn't want to look crazy.\n\nI checked anyway.\n\nSomething came up.\n\nI didn't confront him. I just left.",
  },
  {
    initials: "A",
    name: "Anonymous",
    location: "Gauteng",
    headline: "It was small things first.",
    quote: "He never hit me in the beginning.\n\nIt was small things. Control. Questions. Mood swings.\n\nI checked his name one night.\n\nThere was a record linked to violence.\n\nI stopped ignoring what I was feeling after that.",
  },
  {
    initials: "A",
    name: "Anonymous",
    location: "Gauteng",
    headline: "It was terrifying, yoh.",
    quote: "I was angry at my friend for checking my boyfriend.\n\nShe just checked him.\n\nWhen she showed me the results, I went quiet.\n\nI had to apologize to her.\n\nIt was terrifying, yoh.",
  },
];

const TestimonialsSectionNew = () => {
  const navigate = useNavigate();

  return (
    <section style={{
      background: '#0d0d1a',
      borderTop: '1px solid rgba(255,255,255,0.06)',
      padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 4vw, 44px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 12,
          }}>
            <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Real </span>
            <span style={{ ...inter, color: '#ffffff' }}>Stories</span>
          </h2>
          <p style={{ ...inter, fontSize: 15, color: '#8b8b91', maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>
            These are the kinds of decisions RedFlaq was built for.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ maxWidth: 860, margin: '0 auto 48px' }}>
          {testimonials.map((t, i) => (
            <div
              key={i}
              style={{
                background: '#111118',
                border: '1px solid rgba(108,53,222,0.25)',
                borderLeft: '3px solid #6C35DE',
                borderRadius: 8,
                padding: '2rem',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'}
            >
              {/* Avatar + name */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: '50%',
                  background: '#6C35DE',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#fff' }}>{t.initials}</span>
                </div>
                <div>
                  <p style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', marginBottom: 2 }}>{t.name}</p>
                  <p style={{ ...inter, fontSize: 12, color: '#8b8b91' }}>{t.location}</p>
                </div>
              </div>

              {/* Headline */}
              <p style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 12 }}>
                {t.headline}
              </p>

              {/* Quote */}
              <p style={{
                ...inter, fontSize: 14, color: '#d1d1d6', lineHeight: 1.8,
                whiteSpace: 'pre-line',
              }}>
                {t.quote}
              </p>
            </div>
          ))}
        </div>

        {/* Share CTA */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
            You thought of someone just now.
          </p>
          <p style={{ ...inter, fontSize: 15, color: '#8b8b91', marginBottom: 16 }}>
            Send it before you talk yourself out of it.
          </p>
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: 'RedFlaq', text: 'Before you trust, RedFlaq first.', url: 'https://redflaq.com' });
              } else {
                navigator.clipboard.writeText('https://redflaq.com');
              }
            }}
            style={{
              ...inter, fontWeight: 700, fontSize: 14, color: '#6C35DE',
              background: 'transparent', border: '1px solid rgba(108,53,222,0.4)',
              padding: '12px 28px', borderRadius: 4, cursor: 'pointer',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6C35DE'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(108,53,222,0.4)'}
          >
            Send RedFlaq to someone who needs it
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
