import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye, Linkedin } from "lucide-react";
import nthabiPhoto from "@/assets/nthabi-montsho.jpeg";
import ayolaPhoto from "@/assets/ayola-masizana.jpeg";
import mckevinPhoto from "@/assets/mckevin-ayaba.png";

const WhyRedflaqSection = () => {
  const { ref, isVisible } = useScrollReveal();

  const cards = [
    { Icon: Shield, title: "Public Records Only", desc: "We never create data. We surface what already exists in public-record warning lists." },
    { Icon: Lock, title: "POPIA-Aware", desc: "Every search requires a legitimate purpose and consent. We minimise data and respect everyone's rights." },
    { Icon: Eye, title: "Confidential Use", desc: "The person you check is not notified. Results are for your safety decisions, not public shaming." },
  ];

  const team = [
    {
      name: "Nthabi Montsho",
      role: "Co-Founder & CEO, RedFlaq\nGBV Survivor, Advocate & TV Host",
      photo: nthabiPhoto,
      bio: "Nthabi Montsho is a GBV survivor and advocate dedicated to helping women rebuild their lives after abuse. She is the founder of Women Arise with Power and the author of the book Women Arise with Power, which shares her journey of survival and healing. Through her work on Soweto TV and national platforms she continues to advocate for dignity, safety and justice for women across South Africa.",
      quote: "I survived what many women do not. If one public-record warning can stop another woman from living my story, then tools like RedFlaq are not a luxury. They are a necessity.",
      linkedin: "https://www.linkedin.com/in/nthabiseng-montsho-kamakunene-a8a41841/",
    },
    {
      name: "Ayola Masizana",
      role: "Witness of GBV · Student\nBrand Ambassador, RedFlaq",
      photo: ayolaPhoto,
      bio: "Growing up, Ayola Masizana witnessed his father abuse his mother. Those memories shaped his view of safety, trust and the impact violence has on families. Today he is studying Public Management and Governance at the University of Johannesburg and is committed to helping build systems that protect families before violence escalates.",
      quote: "As a child I saw things no child should ever see. I stand with RedFlaq because boys and girls deserve parents who are safe and systems that recognise warning signs early.",
      linkedin: "https://www.linkedin.com/in/ayola-masizana-30404b320/",
    },
    {
      name: "McKevin Ayaba",
      role: "Technology Entrepreneur\nCo-Founder & CPO, RedFlaq",
      photo: mckevinPhoto,
      bio: "McKevin Ayaba is a technology entrepreneur focused on building systems that solve real societal problems. Through RedFlaq he is working to make public record safety signals accessible to everyday people so women and communities can make safer decisions about who they trust.",
      quote: "Traditional background check services exist, but they are slow, bureaucratic and designed for businesses, not individuals. RedFlaq was created so women and communities can access public-record warnings quickly and affordably.",
      linkedin: "https://www.linkedin.com/in/mckevin-ayaba-89853220/",
    },
  ];

  return (
    <section id="about" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{
      background: '#FFFFFF', borderBottom: '1px solid #E6E0DA',
    }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>About</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>
            Why RedFlaq <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>Exists</em>
          </h2>
          <p style={{
            fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#555555',
            lineHeight: 1.8, maxWidth: 640, margin: '12px auto 0',
          }}>
            South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Many tragedies had warning signs in public records — but people couldn't access them easily.
          </p>
        </div>

        {/* Team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {team.map((person) => (
            <div key={person.name} className="card-lift" style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              borderRadius: 8, padding: '32px 24px',
              display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
            }}>
              <div style={{
                width: 96, height: 96, borderRadius: '50%',
                border: '3px solid #E6E0DA', overflow: 'hidden', marginBottom: 16,
              }}>
                <img src={person.photo} alt={person.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1F1F1F', marginBottom: 4 }}>
                {person.name}
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
                letterSpacing: '0.05em', color: '#6B4EFF', marginBottom: 12,
                lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>
                {person.role}
              </div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#555555', lineHeight: 1.7, marginBottom: 12, textAlign: 'left' }}>
                {person.bio}
              </p>
              <blockquote style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: 'italic',
                color: '#6B4EFF', lineHeight: 1.6, borderLeft: '2px solid #6B4EFF',
                paddingLeft: 12, textAlign: 'left', marginTop: 'auto', marginBottom: 12,
              }}>
                "{person.quote}"
              </blockquote>
              <a href={person.linkedin} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2" style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600,
                  color: '#6B4EFF', textDecoration: 'none',
                }}>
                <Linkedin size={14} /> LinkedIn Profile
              </a>
            </div>
          ))}
        </div>

        <p style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 20,
          fontStyle: 'italic', color: '#6B4EFF', textAlign: 'center', marginBottom: 48,
        }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map(card => (
            <div key={card.title} className="card-lift" style={{
              background: '#FAFAF8', border: '1px solid #E6E0DA',
              padding: '28px 24px', borderRadius: 8,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 8,
                background: '#F1ECFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 16,
              }}>
                <card.Icon style={{ width: 20, height: 20, color: '#6B4EFF', strokeWidth: 2 }} />
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#1F1F1F', marginBottom: 8 }}>{card.title}</div>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#555555', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
