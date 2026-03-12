import { Link } from "react-router-dom";
import { Shield, Eye, Scale, Heart, CheckCircle, Database, FileText, Gavel } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

const commitments = [
  "We only report verified public records",
  "We provide clear source attribution",
  "We offer dispute resolution pathways",
  "We comply with POPIA regulations",
  "We believe transparency creates safer communities",
];

const values = [
  { icon: Shield, title: "Safety First", desc: "Every feature is designed with victim safety as the priority" },
  { icon: Eye, title: "Transparency", desc: "We clearly show where data comes from and what it means" },
  { icon: Scale, title: "Fairness", desc: "Anyone can dispute records — we believe in due process" },
];

const sources = [
  { icon: FileText, label: "SAPS Most Wanted Lists" },
  { icon: Database, label: "FIC Financial Sanctions" },
  { icon: Gavel, label: "Government Gazettes (court orders)" },
  { icon: Scale, label: "SAFLII Court Judgments" },
];

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F0EB' }}>
      <NavbarPlinq />

      {/* Hero — dark immersive */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120,
        paddingBottom: 72,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '70%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ color: '#A855F7' }}>
            <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
            About RedFlaq
          </p>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.05] mb-5" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Closing the gap between<br />
            <span style={{ color: '#A855F7' }}>information</span> and safety.
          </h1>
          <p className="font-body text-[15px] sm:text-lg leading-relaxed max-w-[560px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Violence rarely begins with violence. It begins with information people did not have, patterns they could not verify, and warnings they were never shown.
          </p>
        </div>
      </section>

      {/* Content */}
      <main className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16 flex-1 w-full">

        {/* Mission + Approach — 2 column on desktop */}
        <div className="grid md:grid-cols-2 gap-5 mb-12 sm:mb-16">
          <div className="p-6 sm:p-8" style={{
            background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
            borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart className="w-5 h-5" style={{ color: '#7C3AED' }} />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-foreground">Our Mission</h2>
            </div>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
              <strong className="text-foreground">RedFlaq exists to close that gap.</strong> We make existing public information accessible and searchable so South Africans can make informed decisions about who they trust.
            </p>
          </div>

          <div className="p-6 sm:p-8" style={{
            background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
            borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
          }}>
            <div className="flex items-center gap-3 mb-4">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Eye className="w-5 h-5" style={{ color: '#7C3AED' }} />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl text-foreground">Our Approach</h2>
            </div>
            <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed">
              We aggregate publicly available legal records from verified government sources including SAPS, court systems, and official gazettes. We do not create data — we surface what already exists.
            </p>
          </div>
        </div>

        {/* Commitment — dark section */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-10" style={{
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', bottom: -30, right: -30, width: 180, height: 180,
            background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
            filter: 'blur(30px)', pointerEvents: 'none',
          }} />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Scale className="w-5 h-5" style={{ color: '#A855F7' }} />
              </div>
              <h2 className="font-heading text-xl sm:text-2xl" style={{ color: '#FFFFFF' }}>Our Commitment</h2>
            </div>
            <div className="space-y-3">
              {commitments.map((item) => (
                <div key={item} className="flex items-center gap-3 p-3.5 sm:p-4" style={{
                  background: 'rgba(124,58,237,0.06)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  borderRadius: 12,
                }}>
                  <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
                  <span className="font-body text-[13px] sm:text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
            Our Values
          </p>
          <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-6">What drives us</h2>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div key={v.title} className="text-center p-6 sm:p-8" style={{
                  background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
                  borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div className="mx-auto mb-4" style={{
                    width: 48, height: 48, borderRadius: 14,
                    background: 'rgba(124,58,237,0.08)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon className="w-6 h-6" style={{ color: '#7C3AED' }} />
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{v.title}</h3>
                  <p className="font-body text-[13px] text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Data Sources */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
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
                <div key={s.label} className="flex items-center gap-3 p-4 sm:p-5" style={{
                  background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
                  borderRadius: 14,
                }}>
                  <Icon className="w-5 h-5 flex-shrink-0" style={{ color: '#7C3AED' }} />
                  <span className="font-body text-[13px] sm:text-sm text-foreground font-medium">{s.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* CTA */}
        <section className="p-8 sm:p-12 text-center" style={{
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60%', height: '60%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div className="relative z-10">
            <h2 className="font-heading text-[24px] sm:text-[32px] mb-3" style={{ color: '#FFFFFF' }}>Run your first check</h2>
            <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>Instant results. Completely confidential. R99.</p>
            <Link
              to="/dashboard/new-check"
              className="inline-flex items-center justify-center font-body font-bold text-[14px] sm:text-base transition-all"
              style={{
                background: '#7C3AED', color: '#FFFFFF',
                padding: '16px 36px', borderRadius: 50,
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              Run Your First Check →
            </Link>
          </div>
        </section>
      </main>

      <FooterPlinq />
    </div>
  );
}
