import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageCircle, Link2 } from "lucide-react";

const testimonials = [
  { quote: "I met him at church. He was charming, attentive, everything seemed fine. A friend told me about RedFlaq. I checked him before our third date. There were public warnings on his name. I stopped seeing him that same day. I don't want to think about what could have happened.", name: "Naledi M.", location: "Soweto, Gauteng", use: "Relationship safety" },
  { quote: "My daughter started seeing someone new. As a mother in South Africa, you worry. I used RedFlaq quietly, just to give myself peace of mind. It came back clear and I was able to breathe again. Every mother should know this exists.", name: "Thandiwe B.", location: "Durban, KwaZulu-Natal", use: "Family safety" },
  { quote: "I was going to let a man I met online move into my granny flat. He needed accommodation urgently and seemed genuine. RedFlaq flagged a public record warning linked to his name. I never responded to him again. This tool literally protected my home.", name: "Charmaine V.", location: "Bellville, Western Cape", use: "Tenant screening" },
  { quote: "After what happened to my friend last year, I promised myself I would never meet anyone new without checking first. RedFlaq makes that easy. R99 is nothing compared to what we risk every day as women in this country.", name: "Ayanda K.", location: "Tembisa, Gauteng", use: "Dating safety" },
  { quote: "I hired a man to do domestic work at my house. Before he started, I ran his name on RedFlaq. The result was clear, which gave me confidence. But even more importantly — now I have a process. I will check everyone I let into my home.", name: "Priya N.", location: "Centurion, Gauteng", use: "Household safety" },
  { quote: "We talk about GBV all the time in this country but no one ever tells us what we can actually do before something happens. RedFlaq is the first tool I've seen that puts power back in our hands. I've shared it in three WhatsApp groups already.", name: "Lerato D.", location: "Polokwane, Limpopo", use: "Community advocate" },
  { quote: "His name came up with a public record flag. My first instinct was to run. But I paused and used it as a reason to have an honest conversation instead. I asked him directly — and he explained everything. It turned out to be a case of mistaken identity that was never resolved. RedFlaq didn't end things. It gave me the courage to ask the right questions. We're still together.", name: "Simone R.", location: "East London, Eastern Cape", use: "Relationship safety", footnote: "RedFlaq is a starting point for informed decisions — not a verdict." },
  { quote: "I kept telling myself his behaviour was normal. That I was too sensitive. That things would change. When I finally checked him on RedFlaq, I found a public record warning linked to his name for assault. Something shifted in me that day — not because of the record, but because it gave me language for what I had already been living. It helped me understand that what was happening to me had a name, and that I wasn't imagining it. I left two weeks later.", name: "Nomsa T.", location: "Alexandra, Gauteng", use: "GBV survivor", featured: true },
  { quote: "My daughter brought a guy home. Something about him made me uncomfortable but I couldn't explain it. I ran his name on RedFlaq while she was in the kitchen. There was a public record warning. I didn't cause a scene — I just told her quietly later that evening. She was angry at first. Now she thanks me.", name: "Dumisani N.", location: "Soweto, Gauteng", use: "Father · Family safety" },
  { quote: "I was renting out my back room. The guy seemed fine — good job, polite, paid a deposit. My neighbour told me about RedFlaq. I checked him the same night. Something came up. I gave him his deposit back and said the room was taken. I slept properly that night for the first time in weeks.", name: "Raeesa A.", location: "Athlone, Western Cape", use: "Tenant safety" },
  { quote: "We hired someone to pick up our kids from school every day. My wife and I argued about whether to check him — felt like we were being paranoid. RedFlaq came back clear. Honestly, that made it easier. We stopped second-guessing ourselves and just got on with it.", name: "Sipho M.", location: "Durban, KwaZulu-Natal", use: "Parent · Childcare safety" },
  { quote: "I started a new job at a family's house. Before I started, my sister told me to check the family too — not just the other way around. I checked the father's name. It was clear. I felt better going in. People don't think domestic workers also need to feel safe.", name: "Bongiwe D.", location: "Tembisa, Gauteng", use: "Domestic worker safety" },
  { quote: "My girlfriend of two months started showing signs that worried me. Controlling behaviour, stories that changed. A friend mentioned RedFlaq. I checked her name. Nothing came up on public records — but the process of checking made me slow down and think clearly about what I was actually seeing. Sometimes you just need something to help you think.", name: "Warren F.", location: "George, Western Cape", use: "Relationship safety" },
  { quote: "Our church hired a new youth programme coordinator. Some of the parents were whispering but nobody wanted to say anything officially. I quietly ran his name on RedFlaq. Nothing came up. I shared that with two of the other parents. The conversations stopped and we were able to move forward without drama.", name: "Mmabatho K.", location: "Mahikeng, North West", use: "Community · Church safety" },
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
          className={`grid grid-cols-1 md:grid-cols-3 gap-5 reveal-stagger ${isVisible ? 'visible' : ''}`}
          style={{ marginBottom: 48 }}
        >
          {testimonials.map((t, i) => {
            const isFeatured = (t as any).featured;
            return (
              <div key={i} className="card-lift reveal-child" style={{
                background: isFeatured ? '#E9E3FF' : '#FFFFFF',
                borderLeft: '3px solid #6B4EFF',
                borderRadius: 16,
                border: `1px solid ${isFeatured ? '#6B4EFF30' : '#E6E0DA'}`,
                borderLeftWidth: 3,
                borderLeftColor: '#6B4EFF',
                padding: '28px 24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
              >
                <div>
                  <span style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: 48, lineHeight: 0.8, color: '#6B4EFF20', display: 'block',
                  }}>"</span>
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555',
                    lineHeight: 1.75, marginTop: -4, fontStyle: 'italic',
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
