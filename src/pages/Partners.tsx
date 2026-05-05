import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Users, Shield, BarChart3, Code, CheckCircle } from "lucide-react";


const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const benefits = [
  { icon: Shield, title: "Protect your community", desc: "Give your members access to affordable, fast public-record safety checks." },
  { icon: BarChart3, title: "Track your impact", desc: "See how many checks your organisation has referred and the safety impact you're making." },
  { icon: Code, title: "Embed on your site", desc: "Get a 'Powered by RedFlaq' button to embed on your website or share with members." },
  { icon: Users, title: "Revenue sharing", desc: "Approved partners may qualify for volume discounts or revenue sharing on referred checks." },
];

const orgTypes = [
  "Women's rights organisations", "GBV shelters and NGOs",
  "Churches and faith communities", "Student organisations and universities",
  "Property management agencies", "Recruitment and staffing agencies",
  "Community safety groups", "Legal aid organisations",
];

const Partners = () => (
  <div style={{ background: "#08080f", minHeight: "100vh" }}>
    <NavbarPlinq />

    {/* Hero — dark */}
    <section style={{
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      paddingTop: 100, paddingBottom: 64,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
        <p className="text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ ...inter, color: '#6C35DE' }}>
          <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
          Partner Programme
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 800, color: '#FFFFFF', lineHeight: 1.05, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Partner with RedFlaq to<br />
          <span style={{ color: '#6C35DE' }}>protect your community.</span>
        </h1>
        <p style={{ ...inter, fontSize: 'clamp(15px, 2vw, 17px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, maxWidth: 560 }}>
          Join our partner programme and give your members access to fast, affordable public-record safety checks.
        </p>
      </div>
    </section>

    <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-10 sm:py-14">

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-12 sm:mb-14">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="p-5 sm:p-6" style={{
              background: '#111118', border: '1px solid rgba(108,53,222,0.25)',
              borderRadius: 8,
            }}>
              <div className="mb-3" style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(108,53,222,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon className="w-5 h-5" style={{ color: '#6C35DE' }} />
              </div>
              <h3 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>{b.title}</h3>
              <p style={{ ...inter, fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Who can partner */}
      <section className="mb-12 sm:mb-14 p-6 sm:p-8" style={{
        background: '#111118', border: '1px solid rgba(108,53,222,0.25)', borderRadius: 8,
      }}>
        <h2 style={{ ...inter, fontSize: 'clamp(20px, 3vw, 26px)', fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>Who can partner with us?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {orgTypes.map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
              <span style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — dark */}
      <section className="p-8 sm:p-12 text-center" style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
        borderRadius: 8, position: 'relative', overflow: 'hidden',
        border: '1px solid rgba(108,53,222,0.25)',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(108,53,222,0.2), transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div className="relative z-10">
          <h2 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>Ready to join?</h2>
          <p style={{ ...inter, fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 24 }}>
            Apply to become a RedFlaq partner. We'll review your application within 48 hours.
          </p>
          <Link to="/partners/apply"
            style={{ ...inter, fontWeight: 700, fontSize: 15, background: '#6C35DE', color: '#FFFFFF', padding: '14px 36px', borderRadius: 4, textDecoration: 'none', display: 'inline-block' }}>
            Apply Now →
          </Link>
        </div>
      </section>
    </div>
    <FooterPlinq />
  </div>
);

export default Partners;
