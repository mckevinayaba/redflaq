import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SafetyCardGrid from "@/components/safety/SafetyCardGrid";
import GBVResourcesSection from "@/components/safety/GBVResourcesSection";
import ProvincialResourcesSection from "@/components/safety/ProvincialResourcesSection";
import { Heart, Home, Users, HelpCircle, ShieldCheck, MessageSquare, Eye } from "lucide-react";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

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
  { title: "First Date Safety Checklist", description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.", href: "/safety-tips/first-date-safety", icon: Heart, tag: "DATING SAFETY" },
  { title: "Tenant / Landlord Safety Checklist", description: "Essential checks before renting a property or accepting a new tenant in South Africa.", href: "/safety-tips/tenant-safety", icon: Home, tag: "HOUSING SAFETY" },
  { title: "Domestic Worker / Nanny Safety Checklist", description: "Practical safety steps when hiring someone to work in your home or look after your children.", href: "/safety-tips/domestic-worker-safety", icon: Users, tag: "HOME SAFETY" },
  { title: "Is This a Red Flag?", description: "A quick interactive quiz to help you identify warning signs in relationships and situations.", href: "/safety-tips/red-flag-quiz", icon: HelpCircle, tag: "AWARENESS" },
];

const SafetyTips = () => {
  return (
    <div className="min-h-screen" style={{ background: '#08080f' }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{ background: '#08080f', paddingTop: 100, paddingBottom: 80, position: 'relative', overflow: 'hidden' }}>
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
            Safety First
          </p>
          <h1 style={{ ...inter, fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 20 }}>
            Information is the first step.<br />
            <span style={{ color: '#6C35DE' }}>Safety</span> is the destination.
          </h1>
          <p style={{ ...inter, fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
            RedFlaq gives you the signal. This page helps you know what to do with it — before, during, and after.
          </p>
          <Link to="/signup" style={{ ...inter, fontWeight: 700, fontSize: 15, background: '#6C35DE', color: '#ffffff', padding: '14px 32px', borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
            Verify Someone Now — R99
          </Link>
        </div>
      </section>

      {/* Main content */}
      <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-12 sm:py-16">

        <SafetyCardGrid />
        <GBVResourcesSection />
        <ProvincialResourcesSection />

        {/* Before You Check */}
        <section className="mb-12 sm:mb-16 -mx-5 sm:-mx-6 px-5 sm:px-6 py-12 sm:py-16" style={{
          background: '#111118', borderRadius: 8, border: '1px solid rgba(108,53,222,0.25)', position: 'relative', overflow: 'hidden',
        }}>
          <div className="relative z-10">
            <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
              Before You Check
            </p>
            <h2 style={{ ...inter, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.1 }}>
              Signs worth paying attention to
            </h2>
            <p style={{ ...inter, fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
              Your instincts often know before the data does. Here are patterns worth noticing early.
            </p>

            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-8">
              {redFlags.map((flag) => (
                <div key={flag} className="flex items-start gap-3 p-4 sm:p-5" style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 8,
                }}>
                  <span className="text-lg flex-shrink-0 mt-0.5" style={{ color: '#C0392B' }}>🚩</span>
                  <p style={{ ...inter, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{flag}</p>
                </div>
              ))}
            </div>

            <div className="p-5 sm:p-6" style={{
              background: 'rgba(108,53,222,0.08)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8,
            }}>
              <p style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
                Running a RedFlaq check is not a sign of distrust. It is a sign that you take your safety seriously. That is not something to apologise for.
              </p>
            </div>
          </div>
        </section>

        {/* After a Flag */}
        <section className="mb-12 sm:mb-16">
          <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
            After a Flag
          </p>
          <h2 style={{ ...inter, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#ffffff', marginBottom: 8, lineHeight: 1.1 }}>
            He came up flagged. Don't panic — and don't ignore it.
          </h2>
          <p style={{ ...inter, fontSize: 15, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, marginBottom: 32 }}>
            A flag means public-record warnings exist. What you do with it is your choice — here's how to approach it safely.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-5">
            {[
              { num: "01", icon: ShieldCheck, title: "Check your safety first", body: "Am I physically safe right now? Do I have someone I trust nearby? Do I have an exit plan? If any answer is no — do not have this conversation today." },
              { num: "02", icon: MessageSquare, title: "Read the Conversation Guide", body: "We've written a step-by-step guide to help you approach this conversation calmly and listen for the right responses.", button: { text: "Read the Guide", href: "/conversation-guide" } },
              { num: "03", icon: Eye, title: "Know when to walk away", body: "A man who has genuinely changed will not be threatened by an honest question. How he responds tells you everything." },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num} className="flex flex-col p-5 sm:p-6" style={{
                  background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8,
                }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(108,53,222,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon className="w-5 h-5" style={{ color: '#6C35DE' }} />
                    </div>
                    <span style={{ ...mono, fontSize: 11, letterSpacing: '0.1em', color: '#6C35DE' }}>{step.num}</span>
                  </div>
                  <h3 style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ ...inter, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, flex: 1, marginBottom: 16 }}>{step.body}</p>
                  {step.button && (
                    <Link to={step.button.href} style={{ ...inter, fontWeight: 700, fontSize: 13, background: '#6C35DE', color: '#ffffff', padding: '10px 20px', borderRadius: 4, textDecoration: 'none', textAlign: 'center', display: 'inline-block' }}>
                      {step.button.text}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Clear Result */}
        <section className="mb-12 sm:mb-16 p-6 sm:p-8" style={{
          background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8,
        }}>
          <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
            When the Result Is Clear
          </p>
          <h2 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
            A clear result is good news — and the beginning of building trust.
          </h2>
          <p style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 600, marginBottom: 20 }}>
            No public-record warnings found means exactly that. It does not mean this person has never done anything wrong. Use it as one piece of the picture — not the whole picture.
          </p>
          <div className="p-4 sm:p-5" style={{
            background: 'rgba(108,53,222,0.08)', border: '1px solid rgba(108,53,222,0.2)', borderRadius: 8,
          }}>
            <p style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.8)', lineHeight: 1.7 }}>
              Always trust your instincts. If something feels wrong, it is worth paying attention to — even when the result is clear.
            </p>
          </div>
        </section>

        {/* Interactive Checklists */}
        <section className="mb-12 sm:mb-16">
          <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
            Interactive Checklists
          </p>
          <h2 style={{ ...inter, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#ffffff', marginBottom: 24 }}>Safety checklists for every situation</h2>
          <div className="grid gap-4">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Link key={tip.href} to={tip.href} className="block no-underline transition-all duration-200 hover:-translate-y-1" style={{
                  background: '#111118', border: '1px solid rgba(108,53,222,0.25)', padding: '24px 20px', borderRadius: 8, textDecoration: 'none',
                }}>
                  <div className="flex items-start gap-4 sm:gap-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(108,53,222,0.15)', borderRadius: '50%' }}>
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: '#6C35DE' }} />
                    </div>
                    <div className="min-w-0">
                      <span style={{ ...mono, fontSize: 10, letterSpacing: '0.1em', fontWeight: 600, color: '#6C35DE' }}>{tip.tag}</span>
                      <h3 style={{ ...inter, fontSize: 'clamp(16px, 2vw, 20px)', fontWeight: 700, color: '#ffffff', marginTop: 4, marginBottom: 6 }}>{tip.title}</h3>
                      <p style={{ ...inter, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>{tip.description}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mb-12 sm:mb-16 p-8 sm:p-12 text-center" style={{
          background: '#111118', borderRadius: 8, border: '1px solid rgba(108,53,222,0.25)', position: 'relative', overflow: 'hidden',
        }}>
          <div className="relative z-10">
            <h2 style={{ ...inter, fontSize: 'clamp(24px, 3vw, 32px)', fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>Ready to check?</h2>
            <p style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>R99. Under 60 seconds. Completely confidential.</p>
            <Link to="/signup" style={{ ...inter, fontWeight: 700, fontSize: 15, background: '#6C35DE', color: '#ffffff', padding: '14px 36px', borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
              Verify Someone Now — R99
            </Link>
          </div>
        </section>

        {/* SEO text */}
        <div className="p-6 sm:p-8" style={{
          background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8,
        }}>
          <p style={{ ...inter, fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.7 }}>
            These free safety tips are part of RedFlaq's mission to make South Africa safer for women and communities.
            Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
            we've got you covered. If anything feels off, run a{" "}
            <Link to="/signup" style={{ fontWeight: 700, color: '#6C35DE', textDecoration: 'none' }}>RedFlaq public-record safety check</Link> before you decide.
          </p>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default SafetyTips;
