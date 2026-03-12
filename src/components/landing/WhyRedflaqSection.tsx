import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye } from "lucide-react";
import nthabiPhoto from "@/assets/nthabi-montsho.jpeg";
import ayolaPhoto from "@/assets/ayola-masizana.jpeg";
import mckevinPhoto from "@/assets/mckevin-ayaba.png";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { Icon: Shield, title: "Public Records Only", desc: "We never create data. We surface what already exists in public‑record warning lists." },
    { Icon: Lock, title: "POPIA‑Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights." },
    { Icon: Eye, title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming." },
  ];

  const team = [
    {
      name: "Nthabi Montsho",
      role: "Survivor, GBV Advocate & TV Host · Co‑Founder & CEO, RedFlaq",
      subtitle: 'Author of "Women Arise with Power", her life story as a GBV survivor.',
      photo: nthabiPhoto,
      bio: "Nthabi Montsho is a force behind South Africa's fight against GBV. She is the founder of Women Arise with Power, a non‑profit helping survivors rebuild their lives, and the author of Women Arise with Power, a powerful account of her own journey as a GBV survivor. As the host of Women Arise with Power on Soweto TV and a Mail & Guardian Women of Power (2022) and She Awards (2024) winner, she uses her platform to push for safety, justice, and dignity for women. Nthabi stands with RedFlaq because survivors should not be the only ones carrying the burden of safety — our tools, data, and systems must do their part too.",
      quote: "I survived what many women do not. If one public‑record warning can stop another woman from living my story, then tools like RedFlaq are not a luxury — they are a necessity.",
    },
    {
      name: "Ayola Masizana",
      role: "Witness of GBV & Student · Brand Ambassador, RedFlaq",
      subtitle: null,
      photo: ayolaPhoto,
      bio: "Growing up, Ayola Masizana watched his father abuse his mother. Those memories shaped his view of safety, trust, and what children see but cannot stop. Today he is studying for a BA in Public Management and Governance at the University of Johannesburg, determined to help build systems that protect families before violence erupts.",
      quote: "As a child, I saw things no child should ever see. I stand with RedFlaq because boys and girls deserve parents who are safe, and systems that listen to the warning signs early.",
    },
    {
      name: "McKevin Ayaba",
      role: "Technology Entrepreneur · Co‑Founder & CPO, RedFlaq",
      subtitle: "Founder of ASEB Society.",
      photo: mckevinPhoto,
      bio: null,
      quote: "Traditional background check services exist, but they are slow, bureaucratic and designed for businesses, not individuals. RedFlaq was created so women and communities can access key public‑record warnings quickly and affordably.",
    },
  ];

  return (
    <section id="about" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{
      background: '#F5F0EB',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(36px, 4vw, 48px)', color: '#1F1F1F', textAlign: 'center', marginBottom: 24, letterSpacing: '-0.02em' }}>
          Why RedFlaq <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>Exists</em>
        </h2>

        <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: '#555555', lineHeight: 1.8, textAlign: 'center', maxWidth: 640, margin: '0 auto 48px' }}>
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Many tragedies had warning signs in public records — but people couldn't access them easily.</p>
        </div>

        {/* Unified 3-column team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ marginBottom: 48 }}>
          {team.map((person) => (
            <div
              key={person.name}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E6E0DA',
                borderRadius: 16,
                padding: '36px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,78,255,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              {/* Photo with soft lavender frame */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: '4px solid #E9E3FF',
                overflow: 'hidden',
                marginBottom: 20,
                boxShadow: '0 4px 16px rgba(107,78,255,0.12)',
              }}>
                <img
                  src={person.photo}
                  alt={person.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 800, color: '#1F1F1F', marginBottom: 4 }}>
                {person.name}
              </div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.06em', color: '#6B4EFF', marginBottom: 8, lineHeight: 1.5, minHeight: 30 }}>
                {person.role}
              </div>
              {person.subtitle && (
                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#6B4EFF', marginBottom: 12, fontStyle: 'italic', lineHeight: 1.5 }}>
                  {person.subtitle}
                </div>
              )}

              {person.bio && (
                <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#555555', lineHeight: 1.7, marginBottom: 16, textAlign: 'left' }}>
                  {person.bio}
                </p>
              )}

              <blockquote style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: 'italic',
                color: '#6B4EFF', lineHeight: 1.6, borderLeft: '3px solid #6B4EFF',
                paddingLeft: 14, textAlign: 'left', marginTop: 'auto',
              }}>
                "{person.quote}"
              </blockquote>
            </div>
          ))}
        </div>

        <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontStyle: 'italic', color: '#6B4EFF', textAlign: 'center', marginBottom: 48 }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} style={{
              background: '#FFFFFF',
              border: '1px solid #E6E0DA',
              padding: '36px 28px',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(107,78,255,0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: '#F1ECFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <card.Icon style={{ width: 24, height: 24, color: '#6B4EFF', strokeWidth: 2 }} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 17, fontWeight: 700, color: '#1F1F1F', marginBottom: 10 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#555555', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
