import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye } from "lucide-react";
import nthabiPhoto from "@/assets/nthabi-montsho.jpeg";
import ayolaPhoto from "@/assets/ayola-masizana.jpeg";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { Icon: Shield, title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists." },
    { Icon: Lock, title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights." },
    { Icon: Eye, title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming." },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{
      background: 'linear-gradient(180deg, #F3F0FF 0%, #EDE9FE 50%, #F7F4F0 100%)',
      padding: '100px 24px 120px',
      marginTop: 0,
    }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 4vw, 48px)', color: '#1A1523', textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
          Why RedFlaq <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>Exists</em>
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#6B7280', lineHeight: 1.8, textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Many tragedies had warning signs in public records — but people couldn't access them easily.</p>
        </div>

        {/* Ambassador blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: 48 }}>
          {/* Nthabi */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px', borderRadius: '45% 55% 50% 50% / 50% 45% 55% 50%', overflow: 'hidden', boxShadow: '0 8px 32px rgba(124,58,237,0.15)' }}>
              <img src={nthabiPhoto} alt="Nthabi Montsho, GBV Advocate & Brand Ambassador" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#1A1523', marginBottom: 4 }}>
              Nthabi Montsho
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: '#7C3AED', marginBottom: 16, lineHeight: 1.5 }}>
              Survivor, GBV Advocate & TV Host · Brand Ambassador, RedFlaq
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.7, marginBottom: 12, textAlign: 'left' }}>
              Nthabi Montsho is a force behind South Africa's fight against GBV. She is the founder of Women Arise with Power, a non‑profit helping survivors rebuild their lives, and the author of <em>Women Arise with Power</em>, a powerful account of her own journey as a GBV survivor. As the host of Women Arise with Power on Soweto TV and a Mail & Guardian Women of Power (2022) and She Awards (2024) winner, she uses her platform to push for safety, justice, and dignity for women.
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.7, marginBottom: 16, textAlign: 'left' }}>
              Nthabi stands with RedFlaq because survivors should not be the only ones carrying the burden of safety — our tools, data, and systems must do their part too.
            </p>
            <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, fontStyle: 'italic', color: '#7C3AED', lineHeight: 1.6, borderLeft: '3px solid #7C3AED', paddingLeft: 16, textAlign: 'left' }}>
              "I survived what many women do not. If one public‑record warning can stop another woman from living my story, then tools like RedFlaq are not a luxury — they are a necessity."
            </blockquote>
          </div>

          {/* Ayola */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px', borderRadius: '50% 45% 55% 50% / 45% 55% 50% 50%', overflow: 'hidden', boxShadow: '0 8px 32px rgba(124,58,237,0.15)' }}>
              <img src={ayolaPhoto} alt="Ayola Masizana, Witness of GBV & Brand Ambassador" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#1A1523', marginBottom: 4 }}>
              Ayola Masizana
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: '#7C3AED', marginBottom: 16, lineHeight: 1.5 }}>
              Witness of GBV & Student · Brand Ambassador, RedFlaq
            </div>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.7, marginBottom: 12, textAlign: 'left' }}>
              Growing up, Ayola Masizana watched his father abuse his mother. Those memories shaped his view of safety, trust, and what children see but cannot stop. Today he is studying for a BA in Public Management and Governance at the University of Johannesburg, determined to help build systems that protect families before violence erupts.
            </p>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453', lineHeight: 1.7, marginBottom: 16, textAlign: 'left' }}>
              Ayola stands with RedFlaq as the voice of those who witnessed GBV as children and never want the next generation to feel that helpless again.
            </p>
            <blockquote style={{ fontFamily: "'DM Serif Display', serif", fontSize: 14, fontStyle: 'italic', color: '#7C3AED', lineHeight: 1.6, borderLeft: '3px solid #7C3AED', paddingLeft: 16, textAlign: 'left' }}>
              "As a child, I saw things no child should ever see. I stand with RedFlaq because boys and girls deserve parents who are safe, and systems that listen to the warning signs early."
            </blockquote>
          </div>
        </div>

        {/* Founder quote */}
        <div style={{ maxWidth: 700, margin: '0 auto 48px', borderLeft: '4px solid #7C3AED', paddingLeft: 24 }}>
          <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontStyle: 'italic', color: '#1A1523', lineHeight: 1.6 }}>
            "Traditional background check services exist, but they are slow, bureaucratic, and designed for businesses, not individuals. RedFlaq was created so women and communities can access key public‑record warnings quickly and affordably."
          </p>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: '#6B7280', marginTop: 12 }}>
            — McKevin Ayaba, Founder of RedFlaq
          </div>
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontStyle: 'italic', color: '#7C3AED', textAlign: 'center', marginBottom: 48 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} style={{
              background: '#FFFFFF',
              border: '1px solid rgba(124,58,237,0.12)',
              padding: '36px 28px',
              borderRadius: 20,
              boxShadow: '0 4px 24px rgba(124,58,237,0.08)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.08)';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 16,
                background: 'rgba(124,58,237,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <card.Icon style={{ width: 24, height: 24, color: '#7C3AED' }} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#1A1523', marginBottom: 10 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#6B7280', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
