import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Users, Shield, BarChart3, Code, CheckCircle } from "lucide-react";
import womenAriseBadge from "@/assets/women-arise-power.png";

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
  <div style={{ background: "#F5F0EB", minHeight: "100vh" }}>
    <NavbarPlinq />

    {/* Hero — dark */}
    <section style={{
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      paddingTop: 120, paddingBottom: 64,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
        <p className="font-mono text-[11px] tracking-[0.15em] mb-4 flex items-center gap-3" style={{ color: '#A855F7' }}>
          <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
          Partner Programme
        </p>
        <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
          Partner with RedFlaq to<br />
          <span style={{ color: '#A855F7' }}>protect your community.</span>
        </h1>
        <p className="font-body text-[15px] sm:text-base leading-relaxed max-w-[560px]" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Join our partner programme and give your members access to fast, affordable public-record safety checks.
        </p>
      </div>
    </section>

    <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-10 sm:py-14">

      {/* Badge */}
      <div className="mx-auto mb-12 sm:mb-14 max-w-[240px] p-8 text-center" style={{
        background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)',
        borderRadius: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, left: -20, width: 100, height: 100,
          background: 'radial-gradient(circle, rgba(124,58,237,0.1), transparent 70%)',
          filter: 'blur(20px)', pointerEvents: 'none',
        }} />
        <img src={womenAriseBadge} alt="Women Arise With Power — RedFlaq Partner Movement"
          style={{ display: 'block', width: '100%', maxWidth: 160, height: 'auto', margin: '0 auto', position: 'relative', zIndex: 1 }} />
        <p className="font-mono text-[10px] tracking-[0.15em] mt-4" style={{ color: '#A855F7', textTransform: 'uppercase' }}>
          Empowering communities · One check at a time
        </p>
      </div>

      {/* Benefits */}
      <div className="grid sm:grid-cols-2 gap-4 sm:gap-5 mb-12 sm:mb-14">
        {benefits.map((b) => {
          const Icon = b.icon;
          return (
            <div key={b.title} className="p-5 sm:p-6" style={{
              background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
              borderRadius: 18, boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <div className="mb-3" style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(124,58,237,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon className="w-5 h-5" style={{ color: '#7C3AED' }} />
              </div>
              <h3 className="font-body text-base font-bold text-foreground mb-1.5">{b.title}</h3>
              <p className="font-body text-[13px] text-muted-foreground leading-relaxed">{b.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Who can partner */}
      <section className="mb-12 sm:mb-14 p-6 sm:p-8" style={{
        background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 20,
      }}>
        <h2 className="font-heading text-xl sm:text-2xl text-foreground mb-5">Who can partner with us?</h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {orgTypes.map((t) => (
            <div key={t} className="flex items-center gap-2.5">
              <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#22C55E' }} />
              <span className="font-body text-[13px] sm:text-sm text-foreground">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA — dark */}
      <section className="p-8 sm:p-12 text-center" style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
        borderRadius: 24, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60%', height: '60%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
          filter: 'blur(40px)', pointerEvents: 'none',
        }} />
        <div className="relative z-10">
          <h2 className="font-heading text-[22px] sm:text-[28px] mb-2" style={{ color: '#FFFFFF' }}>Ready to join?</h2>
          <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Apply to become a RedFlaq partner. We'll review your application within 48 hours.
          </p>
          <Link to="/partners/apply"
            className="inline-flex items-center justify-center font-body font-bold text-[14px] sm:text-base"
            style={{ background: '#7C3AED', color: '#FFFFFF', padding: '16px 36px', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
            Apply Now →
          </Link>
        </div>
      </section>
    </div>
    <FooterPlinq />
  </div>
);

export default Partners;
