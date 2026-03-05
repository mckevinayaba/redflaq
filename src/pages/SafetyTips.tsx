import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SafetyCardGrid from "@/components/safety/SafetyCardGrid";
import GBVResourcesSection from "@/components/safety/GBVResourcesSection";
import ProvincialResourcesSection from "@/components/safety/ProvincialResourcesSection";
import { Heart, Home, Users, HelpCircle, ShieldCheck, MessageSquare, Eye } from "lucide-react";

const redFlags = [
  "He gets angry when you ask reasonable questions",
  "He rushes the relationship faster than feels comfortable",
  "He is vague or inconsistent about his past",
  "He isolates you from your friends or family",
  "He minimises or dismisses your concerns",
  "He reacts to boundaries with pressure, guilt or anger",
  "You feel like you are walking on eggshells",
  "He has explanations for everything — but nothing ever adds up",
];

const tips = [
  {
    title: "First Date Safety Checklist",
    description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.",
    href: "/safety-tips/first-date-safety",
    icon: Heart,
    tag: "DATING SAFETY",
  },
  {
    title: "Tenant / Landlord Safety Checklist",
    description: "Essential checks before renting a property or accepting a new tenant in South Africa.",
    href: "/safety-tips/tenant-safety",
    icon: Home,
    tag: "HOUSING SAFETY",
  },
  {
    title: "Domestic Worker / Nanny Safety Checklist",
    description: "Practical safety steps when hiring someone to work in your home or look after your children.",
    href: "/safety-tips/domestic-worker-safety",
    icon: Users,
    tag: "HOME SAFETY",
  },
  {
    title: "Is This a Red Flag?",
    description: "A quick interactive quiz to help you identify warning signs in relationships and situations.",
    href: "/safety-tips/red-flag-quiz",
    icon: HelpCircle,
    tag: "AWARENESS",
  },
];

const SafetyTips = () => {
  return (
    <div className="min-h-screen" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />

      {/* Hero — dark immersive */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120,
        paddingBottom: 80,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: '80%', height: '60%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ color: '#A855F7' }}>
            <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
            Safety First
          </p>
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[52px] leading-[1.05] mb-5" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            Information is the first step.<br />
            <span style={{ color: '#A855F7' }}>Safety</span> is the destination.
          </h1>
          <p className="font-body text-[15px] sm:text-lg leading-relaxed max-w-[600px] mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
            RedFlaq gives you the signal. This page helps you know what to do with it — before, during, and after.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center font-body font-bold text-[14px] transition-all duration-200"
            style={{
              background: '#7C3AED', color: '#FFFFFF',
              padding: '14px 32px', borderRadius: 50,
              boxShadow: '0 4px 20px rgba(124,58,237,0.3)',
            }}
          >
            Verify Someone Now — R99
          </Link>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16">

        {/* Card Grid */}
        <SafetyCardGrid />

        {/* GBV Resources Section */}
        <GBVResourcesSection />

        {/* Section 1 — Before You Check — Dark */}
        <section className="mb-12 sm:mb-16 -mx-5 sm:-mx-6 px-5 sm:px-6 py-12 sm:py-16" style={{
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
          borderRadius: 24,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 200, height: 200,
            background: 'radial-gradient(circle, rgba(168,85,247,0.15), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />

          <div className="relative z-10">
            <p className="font-mono text-[11px] tracking-[0.15em] mb-3 flex items-center gap-3" style={{ color: '#A855F7' }}>
              <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
              Before You Check
            </p>
            <h2 className="font-heading text-[24px] sm:text-[32px] mb-2 leading-tight" style={{ color: '#FFFFFF' }}>
              Signs worth paying attention to
            </h2>
            <p className="font-body text-sm sm:text-base leading-relaxed max-w-[600px] mb-8" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Your instincts often know before the data does. Here are patterns worth noticing early.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {redFlags.map((flag) => (
                <div key={flag} className="flex items-start gap-3 p-4 sm:p-5" style={{
                  background: 'rgba(124,58,237,0.06)',
                  border: '1px solid rgba(124,58,237,0.15)',
                  borderRadius: 14,
                  backdropFilter: 'blur(8px)',
                }}>
                  <span className="text-lg flex-shrink-0 mt-0.5" style={{ color: '#EF4444' }}>🚩</span>
                  <p className="font-body text-[13px] sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>{flag}</p>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-6" style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(168,85,247,0.08))',
              border: '1px solid rgba(124,58,237,0.25)',
              borderRadius: 16,
            }}>
              <p className="font-body text-[13px] sm:text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Running a RedFlaq check is not a sign of distrust. It is a sign that you take your safety seriously. That is not something to apologise for.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2 — After a Flag */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
            After a Flag
          </p>
          <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-2 leading-tight">
            He came up flagged. Don't panic — and don't ignore it.
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[600px] mb-8">
            A flag means public-record warnings exist. What you do with it is your choice — here's how to approach it safely.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                num: "01", icon: ShieldCheck,
                title: "Check your safety first",
                body: "Am I physically safe right now? Do I have someone I trust nearby? Do I have an exit plan? If any answer is no — do not have this conversation today.",
              },
              {
                num: "02", icon: MessageSquare,
                title: "Read the Conversation Guide",
                body: "We've written a step-by-step guide to help you approach this conversation calmly and listen for the right responses.",
                button: { text: "Read the Guide", href: "/conversation-guide" },
              },
              {
                num: "03", icon: Eye,
                title: "Know when to walk away",
                body: "A man who has genuinely changed will not be threatened by an honest question. How he responds tells you everything.",
              },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col p-5 sm:p-6" style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(214,211,205,0.6)',
                  borderRadius: 18,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{
                      width: 40, height: 40, borderRadius: 12,
                      background: 'rgba(124,58,237,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon className="w-5 h-5" style={{ color: '#7C3AED' }} />
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.1em]" style={{ color: '#A855F7' }}>{step.num}</span>
                  </div>
                  <h3 className="font-heading text-lg text-foreground mb-2">{step.title}</h3>
                  <p className="font-body text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">{step.body}</p>
                  {step.button && (
                    <Link
                      to={step.button.href}
                      className="inline-flex items-center justify-center px-5 py-2.5 font-body font-semibold text-[13px] transition-colors"
                      style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: 50 }}
                    >
                      {step.button.text}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 3 — Clear Result */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-8" style={{
          background: 'linear-gradient(135deg, rgba(124,58,237,0.04), rgba(168,85,247,0.02))',
          border: '1px solid rgba(124,58,237,0.12)',
          borderRadius: 20,
        }}>
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
            When the Result Is Clear
          </p>
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-3 leading-tight">
            A clear result is good news — and the beginning of building trust.
          </h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-5">
            No public-record warnings found means exactly that. It does not mean this person has never done anything wrong. Use it as one piece of the picture — not the whole picture.
          </p>
          <div className="p-4 sm:p-5" style={{
            background: 'rgba(124,58,237,0.06)',
            border: '1px solid rgba(124,58,237,0.12)',
            borderRadius: 14,
          }}>
            <p className="font-body text-[13px] sm:text-sm text-foreground leading-relaxed">
              Always trust your instincts. If something feels wrong, it is worth paying attention to — even when the result is clear.
            </p>
          </div>
        </section>

        {/* Interactive Checklists */}
        <section className="mb-12 sm:mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary mb-3 flex items-center gap-3">
            <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
            Interactive Checklists
          </p>
          <h2 className="font-heading text-[24px] sm:text-[32px] text-foreground mb-6">Safety checklists for every situation</h2>
          <div className="grid gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Link key={tip.href} to={tip.href} className="block no-underline transition-all duration-200 hover:-translate-y-1" style={{
                  background: '#FFFFFF',
                  border: '1px solid rgba(214,211,205,0.6)',
                  padding: '24px 20px',
                  borderRadius: 18,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
                }}>
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0" style={{
                      background: 'rgba(124,58,237,0.08)',
                      borderRadius: 14,
                    }}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#7C3AED' }} />
                    </div>
                    <div className="min-w-0">
                      <span className="font-mono text-[10px] tracking-[0.1em] font-semibold" style={{ color: '#A855F7' }}>{tip.tag}</span>
                      <h3 className="font-heading text-lg sm:text-xl text-foreground mt-1 mb-1.5">{tip.title}</h3>
                      <p className="font-body text-[13px] sm:text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer CTA — dark */}
        <section className="mb-12 sm:mb-16 p-8 sm:p-12 text-center" style={{
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
            <h2 className="font-heading text-[24px] sm:text-[32px] mb-2" style={{ color: '#FFFFFF' }}>Ready to check?</h2>
            <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>R99. Under 60 seconds. Completely confidential.</p>
            <Link
              to="/signup"
              className="inline-flex items-center justify-center font-body font-bold text-[14px] sm:text-base transition-all"
              style={{
                background: '#7C3AED', color: '#FFFFFF',
                padding: '16px 36px', borderRadius: 50,
                boxShadow: '0 4px 20px rgba(124,58,237,0.35)',
              }}
            >
              Verify Someone Now — R99
            </Link>
          </div>
        </section>

        {/* SEO text */}
        <div className="p-6 sm:p-8" style={{
          background: 'rgba(124,58,237,0.03)',
          border: '1px solid rgba(214,211,205,0.5)',
          borderRadius: 16,
        }}>
          <p className="font-body text-[13px] text-muted-foreground leading-relaxed">
            These free safety tips are part of RedFlaq's mission to make South Africa safer for women and communities.
            Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
            we've got you covered. If anything feels off, run a{" "}
            <Link to="/signup" className="text-primary font-bold">RedFlaq public-record safety check</Link> before you decide.
          </p>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default SafetyTips;
