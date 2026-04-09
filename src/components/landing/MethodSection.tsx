import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const steps = [
  {
    number: "01",
    title: "See the Pattern",
    desc: "Every 4 hours a woman is killed in South Africa. Most of them saw the signs. Seeing is not the problem. Doing nothing with what you see — that is the problem.",
    href: '/signals',
  },
  {
    number: "02",
    title: "Name It",
    desc: "In Khayelitsha they call it 'ukuhlukumeza.' In Soweto it's 'he's just like that.' In Sandton it's 'he has a temper.' Different words. Same pattern. Name it so it stops hiding behind culture, class, or love.",
    href: '/dashboard/habit',
  },
  {
    number: "03",
    title: "Prove It",
    desc: "Feelings don't hold up in court. Timestamps do. Journal entries do. Public criminal records do. R99. 60 seconds. Before trust is given.",
    href: '/search-form',
  },
  {
    number: "04",
    title: "Act Before It Becomes Evidence",
    desc: "You don't need certainty. You need documentation. The woman who acts on a pattern — not a crisis — is the woman who survives.",
    href: '/signup',
  },
];

const MethodSection = () => {
  const navigate = useNavigate();

  return (
    <section style={{ background: '#08080f', padding: '80px 24px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{
            fontSize: 'clamp(28px, 4vw, 48px)',
            fontWeight: 900, lineHeight: 1.1, letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            <span style={{ ...inter, color: '#ffffff' }}>Before You Trust</span>
          </h2>
          <p style={{
            ...playfair, fontStyle: 'italic',
            fontSize: 'clamp(20px, 2.5vw, 32px)',
            color: '#6C35DE',
            fontWeight: 700,
            marginBottom: 16,
          }}>
            RedFlaq First.
          </p>
          <p style={{ ...inter, fontSize: 16, color: '#8b8b91', maxWidth: 600, margin: '0 auto', lineHeight: 1.75 }}>
            Awareness didn't save them. Action might save you.
          </p>
        </div>

        {/* Steps grid */}
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              onClick={() => navigate(step.href)}
              style={{
                background: '#111118',
                border: '1px solid rgba(108,53,222,0.25)',
                borderRadius: 8,
                padding: '2.5rem',
                cursor: 'pointer',
                transition: 'border-color 0.2s, transform 0.2s',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{
                fontSize: 72,
                fontWeight: 800,
                color: '#5a1a1a',
                lineHeight: 1,
                marginBottom: 16,
                fontFamily: "'Inter', sans-serif",
              }}>
                {step.number}
              </div>
              <p style={{ ...inter, fontSize: 11, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
                STEP {step.number}
              </p>
              <h3 style={{ ...inter, fontSize: 20, fontWeight: 700, color: '#ffffff', lineHeight: 1.2, marginBottom: 12 }}>
                {step.title}
              </h3>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', lineHeight: 1.75 }}>
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MethodSection;
