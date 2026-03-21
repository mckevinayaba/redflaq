import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Shield, Heart, Home, Users, HelpCircle, ArrowRight } from "lucide-react";

const tools = [
  {
    title: "First Date Safety Checklist",
    description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.",
    href: "/tools/first-date-safety",
    icon: Heart,
    tag: "DATING SAFETY",
    gradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    title: "Tenant / Landlord Safety Checklist",
    description: "Essential checks before renting a property or accepting a new tenant in South Africa.",
    href: "/tools/tenant-safety",
    icon: Home,
    tag: "HOUSING SAFETY",
    gradient: "from-blue-500/10 to-purple-500/10",
  },
  {
    title: "Domestic Worker / Nanny Safety Checklist",
    description: "Practical safety steps when hiring someone to work in your home or look after your children.",
    href: "/tools/domestic-worker-safety",
    icon: Users,
    tag: "HOME SAFETY",
    gradient: "from-emerald-500/10 to-teal-500/10",
  },
  {
    title: "Is This a Red Flag?",
    description: "A quick interactive quiz to help you identify warning signs in relationships and situations.",
    href: "/tools/red-flag-quiz",
    icon: HelpCircle,
    tag: "AWARENESS",
    gradient: "from-red-500/10 to-orange-500/10",
  },
];

const Tools = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 80,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 24,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: '#A78BFA' }}>
              FREE SAFETY TOOLS
            </span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', marginBottom: 16, lineHeight: 1.15 }}>
            Free Safety Tools for South Africa
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 560 }}>
            Interactive checklists and quizzes to help you stay safe — whether you're dating, renting, hiring, or just trusting your gut. No login required.
          </p>
        </div>
      </section>

      {/* Tools grid */}
      <section style={{ background: '#FAFAFA', padding: '60px 24px 80px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 380px), 1fr))', gap: 24 }}>
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  to={tool.href}
                  style={{
                    display: 'block', background: 'white', border: '1.5px solid #E5E7EB',
                    borderRadius: 16, padding: 32, textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 24px rgba(124,58,237,0.06)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#7C3AED'; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.12)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(124,58,237,0.06)'; }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 12,
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.08), rgba(124,58,237,0.15))',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={22} style={{ color: '#7C3AED' }} />
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: '#7C3AED', fontWeight: 600 }}>
                      {tool.tag}
                    </span>
                  </div>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(18px, 2.5vw, 22px)', color: '#2D2235', marginBottom: 8, lineHeight: 1.3 }}>
                    {tool.title}
                  </h2>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.6, marginBottom: 16 }}>
                    {tool.description}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#7C3AED', fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600 }}>
                    Start checklist <ArrowRight size={14} />
                  </div>
                </Link>
              );
            })}
          </div>

          {/* SEO text block */}
          <div style={{
            marginTop: 48, padding: '32px', background: 'rgba(124,58,237,0.04)',
            border: '1px solid rgba(124,58,237,0.1)', borderRadius: 16,
          }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', lineHeight: 1.8 }}>
              These free safety tools are part of RedFlaq's mission to make South Africa safer for women and communities.
              Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
              we've got you covered. For a deeper check, run a <Link to="/search-form" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>RedFlaq public-record safety check</Link> in
              under 60 seconds for R99.
            </p>
          </div>
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
};

export default Tools;
