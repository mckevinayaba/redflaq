import { Link } from "react-router-dom";
import { Users } from "lucide-react";

const NGOPartnerSection = () => (
  <section className="py-16 md:py-24 px-5" style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2a0f0f 50%, #1a0a0a 100%)' }}>
    <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6" style={{ background: 'rgba(181,32,32,0.15)', border: '1px solid rgba(181,32,32,0.25)' }}>
        <Users className="w-7 h-7" style={{ color: '#B52020' }} />
      </div>

      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 'clamp(26px, 3.5vw, 42px)',
        lineHeight: 1.1,
        letterSpacing: '-0.02em',
        color: '#fff',
        marginBottom: 20,
      }}>
        If you work with survivors,{' '}
        <span style={{ color: '#B52020' }}>we work with you.</span>
      </h2>

      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 'clamp(14px, 1.8vw, 17px)',
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 32,
        maxWidth: 600,
        marginLeft: 'auto',
        marginRight: 'auto',
      }}>
        RedFlaq's Safety Journal and Affidavit Builder are completely free. If your organisation supports GBV survivors, we want to put these tools in your community at no cost. Partner with us and give your network the evidence tools that courts and magistrates accept.
      </p>

      <Link
        to="/partners/apply"
        className="inline-flex items-center gap-2 font-bold text-sm px-8 py-4 rounded-full transition-all duration-300"
        style={{
          fontFamily: "'Syne', sans-serif",
          background: '#B52020',
          color: '#fff',
          textDecoration: 'none',
          boxShadow: '0 4px 24px rgba(181,32,32,0.35)',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#9a1a1a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = '#B52020'; e.currentTarget.style.transform = 'translateY(0)'; }}
      >
        <Users className="w-4 h-4" />
        Become a RedFlaq Partner
      </Link>
    </div>
  </section>
);

export default NGOPartnerSection;
