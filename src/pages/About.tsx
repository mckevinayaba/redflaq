import { Link } from "react-router-dom";
import { Shield, Eye, Scale, Heart, CheckCircle, Database, FileText, Gavel, Mail, MessageCircle, Users, Target, BookOpen, TrendingUp } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { WHATSAPP_CHAT_URL } from "@/constants/whatsapp";

const team = [
  {
    name: "McKevin",
    role: "Founder & CEO",
    bio: "Built RedFlaq after seeing how easily preventable tragedies could be — if only people had access to the right information at the right time.",
    quote: "Information saves lives. We just make it accessible.",
  },
  {
    name: "Nthabi",
    role: "Head of Research & Data",
    bio: "Leads the aggregation of public safety records from government sources, ensuring accuracy and compliance with POPIA.",
    quote: "Every record we surface is a warning someone deserved to see.",
  },
  {
    name: "Ayola",
    role: "Community & Partnerships",
    bio: "Connects RedFlaq with shelters, NGOs, and community organisations to extend our reach to those who need it most.",
    quote: "Safety is a community effort. We're building the infrastructure for it.",
  },
  {
    name: "Stacey",
    role: "Product & Experience",
    bio: "Designs every interaction with survivor safety in mind — from discreet search flows to secure evidence journals.",
    quote: "If someone is in danger, every second of friction matters.",
  },
];

const stats = [
  { value: "10,000+", label: "Public records indexed" },
  { value: "4", label: "Government data sources" },
  { value: "60s", label: "Average check time" },
  { value: "100%", label: "Free safety tools" },
];

const sources = [
  { icon: FileText, label: "SAPS Most Wanted Lists" },
  { icon: Database, label: "FIC Financial Sanctions" },
  { icon: Gavel, label: "Government Gazettes (court orders)" },
  { icon: Scale, label: "SAFLII Court Judgments" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavbarPlinq />

      {/* Hero */}
      <section
        id="why-we-exist"
        className="relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)",
          paddingTop: 120,
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
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.05] mb-5 text-white" style={{ letterSpacing: "-0.02em" }}>
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
          <div className="p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-foreground">The Problem</h2>
            </div>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
              Criminal records, protection orders, and court judgments are <strong className="text-foreground">public information</strong> — but they're scattered across disconnected government databases. Checking someone's background means navigating bureaucracy most people don't know exists.
            </p>
          </div>

          <div className="p-6 sm:p-8 bg-card border border-border rounded-[20px] shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-foreground">The Solution</h2>
            </div>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
              RedFlaq aggregates publicly available legal records into one searchable platform. We don't create data — we surface what already exists. <strong className="text-foreground">60 seconds. One search. Multiple databases.</strong>
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
                  <div className="font-heading text-2xl sm:text-3xl text-white mb-1">{s.value}</div>
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
          <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-6">The people behind RedFlaq</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {team.map((t) => (
              <div key={t.name} className="p-6 bg-card border border-border rounded-[18px] shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading text-lg text-foreground">{t.name}</h3>
                    <p className="font-body text-xs text-primary">{t.role}</p>
                  </div>
                </div>
                <p className="font-body text-[13px] text-muted-foreground leading-relaxed mb-3">{t.bio}</p>
                <p className="font-body text-[12px] text-primary/80 italic">"{t.quote}"</p>
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
          <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-3">Where our data comes from</h2>
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
            <h2 className="font-heading text-xl sm:text-2xl text-foreground">Our Commitment</h2>
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
            <h2 className="font-heading text-[24px] sm:text-[32px] mb-3 text-white">Get in Touch</h2>
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
