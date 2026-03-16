import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { MessageCircle, Link2, ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  { quote: "I met him at church. He was charming, attentive, everything seemed fine. My friend looked at me and said: 'Have you RedFlaq'd him yet?' I hadn't. I did. There were public warnings on his name. I stopped seeing him that same day.", name: "Naledi M.", location: "Soweto, Gauteng", use: "Relationship safety" },
  { quote: "My daughter started seeing someone new. As a mother in South Africa, you worry. I used RedFlaq quietly, just to give myself peace of mind. It came back clear and I was able to breathe again. Every mother should know this exists.", name: "Thandiwe B.", location: "Durban, KwaZulu-Natal", use: "Family safety" },
  { quote: "I was going to let a man I met online move into my granny flat. He needed accommodation urgently and seemed genuine. RedFlaq flagged a public record warning linked to his name. I never responded to him again. This tool literally protected my home.", name: "Charmaine V.", location: "Bellville, Western Cape", use: "Tenant screening" },
  { quote: "After what happened to my friend last year, I promised myself I would never meet anyone new without checking first. RedFlaq makes that easy. R99 is nothing compared to what we risk every day as women in this country.", name: "Ayanda K.", location: "Tembisa, Gauteng", use: "Dating safety" },
  { quote: "I hired a man to do domestic work at my house. Before he started, I ran his name on RedFlaq. The result was clear, which gave me confidence. But even more importantly — now I have a process. I will check everyone I let into my home.", name: "Priya N.", location: "Centurion, Gauteng", use: "Household safety" },
  { quote: "We talk about GBV all the time in this country but no one ever tells us what we can actually do before something happens. RedFlaq is the first tool I've seen that puts power back in our hands. I've shared it in three WhatsApp groups already.", name: "Lerato D.", location: "Polokwane, Limpopo", use: "Community advocate" },
  { quote: "His name came up with a public record flag. My first instinct was to run. But I paused and used it as a reason to have an honest conversation instead. RedFlaq didn't end things. It gave me the courage to ask the right questions. We're still together.", name: "Simone R.", location: "East London, Eastern Cape", use: "Relationship safety", footnote: "RedFlaq is a starting point for informed decisions — not a verdict." },
  { quote: "I kept telling myself his behaviour was normal. That I was too sensitive. That things would change. When I finally checked him on RedFlaq, I found a public record warning linked to his name for assault. Something shifted in me that day — not because of the record, but because it gave me language for what I had already been living. I left two weeks later.", name: "Nomsa T.", location: "Alexandra, Gauteng", use: "GBV survivor", featured: true },
  { quote: "My daughter brought a guy home. Something about him made me uncomfortable but I couldn't explain it. I ran his name on RedFlaq while she was in the kitchen. There was a public record warning. I didn't cause a scene — I just told her quietly later that evening.", name: "Dumisani N.", location: "Soweto, Gauteng", use: "Father · Family safety" },
  { quote: "I was renting out my back room. The guy seemed fine — good job, polite, paid a deposit. My neighbour told me about RedFlaq. I checked him the same night. Something came up. I gave him his deposit back and said the room was taken.", name: "Raeesa A.", location: "Athlone, Western Cape", use: "Tenant safety" },
  { quote: "We hired someone to pick up our kids from school every day. My wife and I argued about whether to check him — felt like we were being paranoid. RedFlaq came back clear. Honestly, that made it easier. We stopped second-guessing ourselves.", name: "Sipho M.", location: "Durban, KwaZulu-Natal", use: "Parent · Childcare safety" },
  { quote: "I started a new job at a family's house. Before I started, my sister told me to check the family too — not just the other way around. I checked the father's name. It was clear. I felt better going in. People don't think domestic workers also need to feel safe.", name: "Bongiwe D.", location: "Tembisa, Gauteng", use: "Domestic worker safety" },
];

const ITEMS_PER_PAGE = 6;

const TestimonialsSectionNew = () => {
  const { ref, isVisible } = useScrollReveal(0.01);
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / ITEMS_PER_PAGE);
  const visible = testimonials.slice(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE);

  const handleShare = (platform: 'whatsapp' | 'copy') => {
    const shareText = "Check out RedFlaq — search public records for safety red flags in under 60 seconds. https://redflaq.com";
    if (platform === 'whatsapp') {
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    } else {
      navigator.clipboard.writeText("https://redflaq.com");
    }
  };

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{
      background: '#FAFAF8', padding: '80px 24px',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>Real Stories · Real Safety</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>
            They checked. It changed <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>everything.</em>
          </h2>
        </div>

        {/* Testimonial grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" style={{ marginBottom: 40 }}>
          {visible.map((t, i) => {
            const isFeatured = (t as any).featured;
            return (
              <div key={`${page}-${i}`} className="card-lift" style={{
                background: isFeatured ? '#F3F0FF' : '#FFFFFF',
                border: `1px solid ${isFeatured ? 'rgba(107,78,255,0.2)' : '#E6E0DA'}`,
                borderRadius: 8,
                padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
              }}>
                <div>
                  <div style={{
                    width: 3, height: 24, background: '#6B4EFF',
                    borderRadius: 2, marginBottom: 16,
                  }} />
                  <p style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555',
                    lineHeight: 1.75, fontStyle: 'italic',
                  }}>
                    "{t.quote}"
                  </p>
                  {(t as any).footnote && (
                    <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888', fontStyle: 'italic', marginTop: 12 }}>
                      {(t as any).footnote}
                    </p>
                  )}
                </div>
                <div style={{ marginTop: 20, borderTop: '1px solid #E6E0DA', paddingTop: 16 }}>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700, color: '#1F1F1F' }}>
                    {t.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap" style={{ marginTop: 4 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888' }}>
                      {t.location}
                    </span>
                    <span style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#6B4EFF',
                      background: '#F1ECFF', padding: '2px 8px', borderRadius: 4,
                    }}>
                      {t.use}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4" style={{ marginBottom: 40 }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{
                background: 'none', border: '1px solid #E6E0DA', borderRadius: 4,
                padding: '8px 12px', cursor: page === 0 ? 'default' : 'pointer',
                opacity: page === 0 ? 0.3 : 1, transition: 'opacity 0.2s',
              }}
            >
              <ChevronLeft size={16} style={{ color: '#555' }} />
            </button>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#888' }}>
              {page + 1} / {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{
                background: 'none', border: '1px solid #E6E0DA', borderRadius: 4,
                padding: '8px 12px', cursor: page === totalPages - 1 ? 'default' : 'pointer',
                opacity: page === totalPages - 1 ? 0.3 : 1, transition: 'opacity 0.2s',
              }}
            >
              <ChevronRight size={16} style={{ color: '#555' }} />
            </button>
          </div>
        )}

        {/* Privacy + GBV helpline */}
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#888888',
          textAlign: 'center', lineHeight: 1.6, marginBottom: 24,
        }}>
          Names and identifying details are representative of the kinds of people RedFlaq protects. Privacy is central to everything we do.
        </p>

        <div style={{
          background: '#FFFFFF', border: '1px solid #E6E0DA',
          borderRadius: 8, padding: '14px 24px', textAlign: 'center',
          marginBottom: 32,
        }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555' }}>
            If you or someone you know is experiencing abuse, contact the GBV Command Centre:{" "}
            <a href="tel:0800428428" style={{ color: '#6B4EFF', fontWeight: 700, textDecoration: 'none' }}>0800 428 428</a>
            {" "}(24/7, free)
          </p>
        </div>

        {/* Share */}
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', marginBottom: 14 }}>
            Did RedFlaq help you? <strong style={{ color: '#1F1F1F' }}>Share it with someone who needs it.</strong>
          </p>
          <div className="flex justify-center gap-3">
            <button onClick={() => handleShare('whatsapp')} className="flex items-center gap-2" style={{
              background: '#25D366', color: 'white', padding: '10px 20px', border: 'none',
              borderRadius: 4, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              <MessageCircle size={14} /> Share on WhatsApp
            </button>
            <button onClick={() => handleShare('copy')} className="flex items-center gap-2" style={{
              background: 'transparent', color: '#6B4EFF', padding: '10px 20px',
              border: '1px solid #E6E0DA', borderRadius: 4,
              fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, cursor: 'pointer',
            }}>
              <Link2 size={14} /> Copy Link
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSectionNew;
