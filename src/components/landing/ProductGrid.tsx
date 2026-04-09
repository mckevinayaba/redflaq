import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const products = [
  {
    watermark: "Pattern.",
    title: "Signals",
    desc: "Daily behavioral truth. Pattern recognition. No comfort. Just clarity.",
    href: '/signals',
    badge: null,
  },
  {
    watermark: "Protected.",
    title: "Safety Base",
    desc: "Your free permanent safety system. Journal, tools, resources — yours forever.",
    href: '/signup',
    badge: "Free",
  },
  {
    watermark: "Verified.",
    title: "Run a Check",
    desc: "Public criminal records in 60 seconds. From R99. Before trust is given.",
    href: '/search-form',
    badge: "From R99",
  },
  {
    watermark: "Evidence.",
    title: "Safety Journal",
    desc: "Timestamped, encrypted, court-admissible. Document before it escalates.",
    href: '/dashboard/journal',
    badge: "Free",
  },
  {
    watermark: "Court-ready.",
    title: "Affidavit Builder",
    desc: "Generate court-ready statements from your journal entries in minutes.",
    href: '/dashboard/affidavit',
    badge: "Free",
  },
  {
    watermark: "Not alone.",
    title: "Resources",
    desc: "GBV hotlines, Thuthuzela Care Centres, legal aid — all in one place.",
    href: '/safety-tips',
    badge: "Free",
  },
];

const ProductGrid = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#08080f', padding: '0 24px 80px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{
            fontSize: 'clamp(26px, 3.5vw, 44px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 12,
          }}>
            <span style={{ ...inter, color: '#ffffff' }}>Everything in your </span>
            <span style={{ ...playfair, fontStyle: 'italic', color: '#6C35DE' }}>Safety Base</span>
          </h2>
          <p style={{ ...inter, fontSize: 15, color: '#8b8b91', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            One platform. Six tools. Built for the moment before it becomes a crisis.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div
              key={p.title}
              onClick={() => navigate(p.href)}
              style={{
                background: '#111118',
                border: '1px solid rgba(108,53,222,0.25)',
                borderRadius: 8,
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              {p.badge && (
                <div style={{
                  position: 'absolute', top: 20, right: 20,
                  background: 'rgba(108,53,222,0.15)',
                  border: '1px solid rgba(108,53,222,0.3)',
                  borderRadius: 4, padding: '3px 10px',
                  zIndex: 2,
                }}>
                  <span style={{ ...inter, fontSize: 10, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.06em' }}>
                    {p.badge}
                  </span>
                </div>
              )}
              <div style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontStyle: 'italic',
                fontSize: 28,
                fontWeight: 700,
                color: 'rgba(255,255,255,0.15)',
                marginBottom: 16,
                lineHeight: 1,
              }}>
                {p.watermark}
              </div>
              <h3 style={{ ...inter, fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 10 }}>
                {p.title}
              </h3>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.75, flex: 1 }}>
                {p.desc}
              </p>
              <div style={{ marginTop: 20 }}>
                <span style={{ ...inter, fontSize: 13, fontWeight: 600, color: '#6C35DE' }}>
                  Explore →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
