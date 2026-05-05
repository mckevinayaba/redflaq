import { Link } from "react-router-dom";
import { Shield, Scale, Database, FileText, Gavel, Mail, Users, Linkedin } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

import ayolaPhoto from "@/assets/ayola-masizana.jpeg";
import mckevinPhoto from "@/assets/mckevin-ayaba.png";

const team = [
  {
    name: "Ayola Masizana",
    role: "Brand Ambassador",
    photo: ayolaPhoto,
    quote: "As a child I saw things no child should ever see. I stand with RedFlaq because boys and girls deserve parents who are safe and systems that recognise warning signs early.",
    linkedin: "https://www.linkedin.com/in/ayola-masizana-30404b320/",
  },
  {
    name: "McKevin Ayaba",
    role: "Co‑Founder & CPO",
    photo: mckevinPhoto,
    quote: "Traditional background check services exist, but they are slow, bureaucratic and designed for businesses, not individuals. RedFlaq was created so women and communities can access public‑record warnings quickly and affordably.",
    linkedin: "https://www.linkedin.com/in/mckevin-ayaba-89853220/",
  },
];

const sources = [
  { icon: FileText, label: "Criminal Records" },
  { icon: Database, label: "Financial Sanctions" },
  { icon: Gavel, label: "Court Orders" },
  { icon: Scale, label: "Court Judgments" },
];

const rheaSteps = [
  { step: "01", title: "See the Pattern", feature: "Signals", href: "/signals" },
  { step: "02", title: "Name It", feature: "Daily Check-In", href: "/dashboard/habit" },
  { step: "03", title: "Prove It", feature: "Verify · R99", href: "/search-form" },
  { step: "04", title: "Act", feature: "Safety Base", href: "/signup" },
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
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-1/2 pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)" }}
        />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3 text-primary">
            <span className="inline-block w-6 h-px bg-primary" />
            Why RedFlaq Exists
          </p>
          <p className="font-body text-[15px] sm:text-lg leading-relaxed max-w-[620px] text-white/80" style={{ fontSize: 'clamp(16px, 2vw, 20px)', lineHeight: 1.7 }}>
            RedFlaq exists because Nthabi survived what most women do not. Because Ayola watched what no child should see. Because McKevin asked a question most technologists never ask: <strong style={{ color: '#ffffff' }}>what if the data that could save a woman's life already existed — and nobody was showing it to her?</strong>
          </p>
        </div>
      </section>

      <main className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16 flex-1 w-full">

        {/* How RedFlaq Works */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-primary" />
            How RedFlaq Works
          </p>
          <p className="font-body text-sm sm:text-base leading-relaxed max-w-[600px] mb-8" style={{ color: 'rgba(255,255,255,0.7)' }}>
            RedFlaq runs on one principle: awareness without action is complicity. South Africa knows about GBV. The stats are in every newspaper. The marches happen every year. And 9 women still die every day. RedFlaq was built for the space between knowing and doing — the moment before trust is given.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {rheaSteps.map((s) => (
              <Link
                key={s.step}
                to={s.href}
                className="p-4 sm:p-5 rounded-lg text-center no-underline transition-all hover:scale-[1.02]"
                style={{ background: '#111118', border: '1px solid rgba(108,53,222,0.25)' }}
              >
                <div className="font-mono text-[10px] tracking-[0.1em] text-primary mb-2">STEP {s.step}</div>
                <div className="font-body text-sm font-bold text-white mb-1">{s.title}</div>
                <div className="font-mono text-[10px] text-white/40">{s.feature}</div>
              </Link>
            ))}
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
                <div style={{
                  width: 110, height: 110, borderRadius: "50%",
                  border: "3px solid hsl(var(--primary) / 0.2)",
                  overflow: "hidden",
                  marginBottom: 18,
                  boxShadow: "0 4px 16px rgba(107,78,255,0.12)",
                }}>
                  <img src={t.photo} alt={t.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>

                <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, color: "hsl(var(--foreground))", marginBottom: 4 }}>
                  {t.name}
                </div>

                <div className="font-mono" style={{ fontSize: 10, letterSpacing: "0.06em", color: "hsl(var(--primary))", marginBottom: 16 }}>
                  {t.role}
                </div>

                <blockquote style={{
                  fontFamily: "'DM Serif Display', serif", fontSize: 13, fontStyle: "italic",
                  color: "hsl(var(--primary))", lineHeight: 1.6, borderLeft: "3px solid hsl(var(--primary))",
                  paddingLeft: 14, textAlign: "left", marginTop: "auto", marginBottom: 16,
                }}>
                  "{t.quote}"
                </blockquote>

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

        {/* Commitment — single statement */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "hsl(var(--foreground))" }}>Our Commitment</h2>
          </div>
          <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
            We don't create data. We surface what the system already knows and chose not to show you. Public records. Pattern recognition. Documentation tools. Not therapy. Just clarity.{' '}
            <strong style={{ color: 'hsl(var(--primary))' }}>Before You Trust, RedFlaq First.</strong>
          </p>
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
