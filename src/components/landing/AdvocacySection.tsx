import advocacyBadge from "@/assets/redflaq-advocacy-badge.png";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const AdvocacySection = () => {
  const { guardedAction } = useAuthGuard();

  return (
    <section className="py-12 md:py-20 px-5" style={{ background: '#F5F0EB', borderTop: '1px solid rgba(124,58,237,0.1)' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
        <img src={advocacyBadge} alt="RedFlaq – Standing for Women's Safety & GBV Prevention" style={{ maxWidth: 280, height: 'auto', margin: '0 auto 28px' }} />
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, lineHeight: 1.7, color: '#6B7280', marginBottom: 28 }}>
          RedFlaq was built because safety should never be a privilege. Every check you run helps build a South Africa where women have access to the information they deserve.
        </p>
        <button onClick={() => guardedAction()} style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, background: '#7C3AED', color: '#fff', border: 'none', borderRadius: 50, padding: '16px 36px', cursor: 'pointer', transition: 'all 0.25s ease', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#6D28D9'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          Verify Someone Now — R99
        </button>
      </div>
    </section>
  );
};

export default AdvocacySection;
