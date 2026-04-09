import { Link } from "react-router-dom";
import { Shield, Eye, Scale, Heart, CheckCircle, Database, FileText, Gavel, Mail, MessageCircle, Users, Target, Linkedin } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import BackToHome from "@/components/landing/BackToHome";
import { WHATSAPP_CHAT_URL } from "@/constants/whatsapp";
import nthabiPhoto from "@/assets/nthabi-montsho.jpeg";
import ayolaPhoto from "@/assets/ayola-masizana.jpeg";
import mckevinPhoto from "@/assets/mckevin-ayaba.png";

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

const stats = [
  { value: "10,000+", label: "Public records indexed" },
  { value: "4", label: "Verified record categories" },
  { value: "60s", label: "Average check time" },
  { value: "100%", label: "Free safety tools" },
];

const sources = [
  { icon: FileText, label: "Criminal Records" },
  { icon: Database, label: "Financial Sanctions" },
  { icon: Gavel, label: "Court Orders" },
  { icon: Scale, label: "Court Judgments" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#08080f' }}>
      <NavbarPlinq />

      {/* Hero */}
      <section
        id="why-we-exist"
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)",
          paddingTop: 100,
          paddingBottom: 80,
        }}
      >
        {/* Removed BackToHome breadcrumb */}
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
        />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3 text-primary">
            <span className="inline-block w-6 h-px bg-primary" />
            Why RedFlaq Exists
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.05, letterSpacing: "-0.02em", color: "#fff", marginBottom: 20 }}>
            Every 12 minutes, a woman<br />
            in South Africa is <span className="text-primary">assaulted</span>.
          </h1>
          <p className="font-body text-[15px] sm:text-lg leading-relaxed max-w-[560px] text-white/60">
            Violence rarely begins with violence. It begins with information people didn't have, patterns they couldn't verify, and warnings they were never shown. RedFlaq exists to close that gap.
          </p>
        </div>
      </section>

      <main className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16 flex-1 w-full">

        {/* The Problem + The Solution */}
        <div className="grid md:grid-cols-2 gap-5 mb-12 sm:mb-16">
          <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "#ffffff" }}>The Problem</h2>
            </div>
            <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Criminal records, protection orders, and court judgments are <strong style={{ color: '#ffffff' }}>public information</strong> — but they're scattered across disconnected government databases. Checking someone's background means navigating bureaucracy most people don't know exists.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-lg" style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8 }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "#ffffff" }}>The Solution</h2>
            </div>
            <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
              RedFlaq aggregates publicly available legal records into one searchable platform. We don't create data — we surface what already exists. <strong style={{ color: '#ffffff' }}>60 seconds. One search. Multiple databases.</strong>
            </p>
          </div>
        </div>

        {/* Impact Stats */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-10 rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)" }}>
          <div className="absolute bottom-[-30px] right-[-30px] w-[180px] h-[180px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)", filter: "blur(30px)" }} />
          <div className="relative z-10">
            <p className="font-mono text-[11px] tracking-[0.15em] mb-6 flex items-center gap-3 text-primary">
              <span className="inline-block w-6 h-px bg-primary" />
              Impact
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3vw, 32px)", color: "#fff", marginBottom: 4 }}>{s.value}</div>
                  <div className="font-body text-xs text-white/50">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section id="team" className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-primary" />
            The Team
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3vw, 36px)", color: "hsl(var(--foreground))", marginBottom: 24, letterSpacing: "-0.02em" }}>
            The people behind RedFlaq
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {team.map((t) => (
              <div
                key={t.name}
                className="card-lift"
                style={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 18,
                  padding: "36px 24px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                }}
              >
                {/* Photo */}
                <div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  border: "3px solid hsl(var(--primary) / 0.2)",
                  overflow: "hidden",
                  marginBottom: 18,
                  boxShadow: "0 4px 16px rgba(107,78,255,0.12)",
                }}>
                  <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                {/* Name */}
                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "hsl(var(--foreground))", marginBottom: 4 }}>
                  {t.name}
                </div>

                {/* Role */}
                <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: "hsl(var(--primary))", marginBottom: 16, lineHeight: 1.6, whiteSpace: "pre-line", minHeight: 32 }}>
                  {t.role}
                </div>

                {/* Bio */}
                <p className="font-body text-left" style={{ fontSize: 12, color: "hsl(var(--muted-foreground))", lineHeight: 1.7, marginBottom: 16 }}>
                  {t.bio}
                </p>

                {/* Quote */}
                <blockquote style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: "italic",
                  color: "hsl(var(--primary))", lineHeight: 1.6, borderLeft: "3px solid hsl(var(--primary))",
                  paddingLeft: 14, textAlign: "left", marginTop: "auto", marginBottom: 16,
                }}>
                  "{t.quote}"
                </blockquote>

                {/* LinkedIn */}
                <a
                  href={t.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-body text-xs font-semibold transition-colors hover:opacity-80"
                  style={{ color: "hsl(var(--primary))", textDecoration: "none" }}
                >
                  <Linkedin style={{ width: 14, height: 14 }} />
                  LinkedIn Profile
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-primary" />
            Data Sources
          </p>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3vw, 32px)", color: "hsl(var(--foreground))", marginBottom: 12 }}>Where our data comes from</h2>
          <p className="font-body text-sm text-muted-foreground mb-6 max-w-[500px]">
            We search publicly available South African databases. We do not access private databases, medical records, or sealed court records.
          </p>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {sources.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="flex items-center gap-3 p-4 sm:p-5 bg-card border border-border rounded-[14px]">
                  <Icon className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span className="font-body text-[13px] sm:text-sm text-foreground font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Commitment */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Scale className="w-5 h-5 text-primary" />
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "hsl(var(--foreground))" }}>Our Commitment</h2>
          </div>
          <div className="space-y-2">
            {[
              "We only report verified public records",
              "We provide clear source attribution",
              "We offer dispute resolution pathways",
              "We comply with POPIA regulations",
              "We believe transparency creates safer communities",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-3 bg-primary/5 border border-primary/10 rounded-xl">
                <CheckCircle className="w-4 h-4 flex-shrink-0 text-green-500" />
                <span className="font-body text-[13px] sm:text-sm text-foreground/85">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Contact + Partners CTA */}
        <section className="p-8 sm:p-12 text-center rounded-3xl relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)" }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)", filter: "blur(40px)" }} />
          <div className="relative z-10">
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(24px, 3vw, 32px)", color: "#fff", marginBottom: 12 }}>Get in Touch</h2>
            <p className="font-body text-sm mb-6 text-white/60">Questions, partnerships, or media enquiries — we'd love to hear from you.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <a href="mailto:hello@redflaq.com" className="inline-flex items-center gap-2 font-body font-bold text-sm px-6 py-3 rounded-full bg-primary text-primary-foreground shadow-lg">
                <Mail className="w-4 h-4" /> hello@redflaq.com
              </a>
              <a href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-body font-bold text-sm px-6 py-3 rounded-full border border-primary/30 text-white hover:bg-primary/10 transition-colors">
                <MessageCircle className="w-4 h-4" /> WhatsApp Us
              </a>
              <Link to="/partners" className="inline-flex items-center gap-2 font-body font-bold text-sm px-6 py-3 rounded-full border border-primary/30 text-white hover:bg-primary/10 transition-colors">
                <Users className="w-4 h-4" /> Become a Partner
              </Link>
            </div>
          </div>
        </section>
      </main>

      <FooterPlinq />
    </div>
  );
}
