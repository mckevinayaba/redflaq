import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Shield, Lock, Eye, Linkedin } from "lucide-react";
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
      role: "Co‑Founder & CEO, RedFlaq\nGBV Survivor, Advocate & TV Host",
      photo: nthabiPhoto,
      bio: "Nthabi Montsho is a GBV survivor and advocate dedicated to helping women rebuild their lives after abuse. She is the founder of Women Arise with Power and the author of the book Women Arise with Power, which shares her journey of survival and healing. Through her work on Soweto TV and national platforms she continues to advocate for dignity, safety and justice for women across South Africa.",
      quote: "I survived what many women do not. If one public‑record warning can stop another woman from living my story, then tools like RedFlaq are not a luxury. They are a necessity.",
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
      role: "Technology Entrepreneur\nCo‑Founder & CPO, RedFlaq",
      photo: mckevinPhoto,
      bio: "McKevin Ayaba is a technology entrepreneur focused on building systems that solve real societal problems. Through RedFlaq he is working to make public record safety signals accessible to everyday people so women and communities can make safer decisions about who they trust.",
      quote: "Traditional background check services exist, but they are slow, bureaucratic and designed for businesses, not individuals. RedFlaq was created so women and communities can access public‑record warnings quickly and affordably.",
      linkedin: "https://www.linkedin.com/in/mckevin-ayaba-89853220/",
    },
  ];

  return (
    <section id="about" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{
      background: 'hsl(var(--background))',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <h2 className="font-heading text-foreground text-center mb-6" style={{ fontSize: 'clamp(36px, 4vw, 48px)', letterSpacing: '-0.02em' }}>
          Why RedFlaq <em style={{ color: 'hsl(var(--primary))', fontStyle: 'italic' }}>Exists</em>
        </h2>

        <div className="font-body text-muted-foreground text-center mx-auto mb-12" style={{ fontSize: 16, lineHeight: 1.8, maxWidth: 640 }}>
          <p>South Africa has one of the highest GBV rates globally. A woman is killed by her intimate partner every few hours. Many tragedies had warning signs in public records — but people couldn't access them easily.</p>
        </div>

        {/* Unified 3-column team grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {team.map((person) => (
            <div
              key={person.name}
              className="card-lift"
              style={{
                background: 'hsl(var(--card))',
                border: '1px solid #E6E0DA',
                borderRadius: 16,
                padding: '36px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
              }}
            >
              {/* Photo */}
              <div style={{
                width: 120, height: 120, borderRadius: '50%',
                border: '4px solid hsl(var(--purple-100))',
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

              {/* Name */}
              <div className="font-body text-foreground" style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>
                {person.name}
              </div>

              {/* Role */}
              <div className="font-mono" style={{ fontSize: 10, letterSpacing: '0.06em', color: 'hsl(var(--primary))', marginBottom: 16, lineHeight: 1.6, whiteSpace: 'pre-line', minHeight: 32 }}>
                {person.role}
              </div>

              {/* Bio */}
              <p className="font-body text-left" style={{ fontSize: 12, color: '#555555', lineHeight: 1.7, marginBottom: 16 }}>
                {person.bio}
              </p>

              {/* Quote */}
              <blockquote style={{
                fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: 'italic',
                color: 'hsl(var(--primary))', lineHeight: 1.6, borderLeft: '3px solid hsl(var(--primary))',
                paddingLeft: 14, textAlign: 'left', marginTop: 'auto', marginBottom: 16,
              }}>
                "{person.quote}"
              </blockquote>

              {/* LinkedIn */}
              <a
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-body text-xs font-semibold transition-colors hover:opacity-80"
                style={{ color: 'hsl(var(--primary))', textDecoration: 'none' }}
              >
                <Linkedin style={{ width: 14, height: 14 }} />
                LinkedIn Profile
              </a>
            </div>
          ))}
        </div>

        <p className="font-heading text-center mb-12" style={{ fontSize: 24, fontStyle: 'italic', color: 'hsl(var(--primary))' }}>
          Because information creates safety. And safety should never be a privilege.
        </p>

        {/* Principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {cards.map(card => (
            <div key={card.title} className="card-lift" style={{
              background: 'hsl(var(--card))',
              border: '1px solid #E6E0DA',
              padding: '36px 28px',
              borderRadius: 16,
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'hsl(var(--purple-100))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 20,
              }}>
                <card.Icon style={{ width: 24, height: 24, color: 'hsl(var(--primary))', strokeWidth: 2 }} />
              </div>
              <div className="font-body text-foreground" style={{ fontSize: 17, fontWeight: 700, marginBottom: 10 }}>{card.title}</div>
              <p className="font-body" style={{ fontSize: 14, color: '#555555', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyRedflaqSection;
