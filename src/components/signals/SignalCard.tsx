import { useNavigate } from "react-router-dom";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const CATEGORY_LABELS: Record<string, string> = {
  "behavioral-patterns": "Behavioral Patterns",
  "dating-relationships": "Dating & Relationships",
  "safety-habits": "Safety Habits",
  "gbvf-evidence": "GBVF & Evidence",
  "trust-denial": "Trust & Denial",
  "dating-safety": "Dating Safety",
  "gbv-resources": "GBV Resources",
  "tenant-safety": "Tenant & Landlord",
  "domestic-worker-safety": "Domestic Worker",
  "popia-privacy": "POPIA & Privacy",
};

const CATEGORY_COLORS: Record<string, string> = {
  "behavioral-patterns": "#B52020",
  "dating-relationships": "#7C3AED",
  "safety-habits": "#18752E",
  "gbvf-evidence": "#B47714",
  "trust-denial": "#5539E8",
  "dating-safety": "#7C3AED",
  "gbv-resources": "#B52020",
};

interface SignalCardProps {
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  created_at: string;
  featured?: boolean;
}

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" });
};

const SignalCard = ({ title, slug, excerpt, category, created_at, featured = false }: SignalCardProps) => {
  const navigate = useNavigate();
  const label = CATEGORY_LABELS[category] || category;
  const color = CATEGORY_COLORS[category] || "#7C3AED";

  return (
    <div
      onClick={() => navigate(`/signals/${slug}`)}
      style={{
        background: featured ? '#1F1523' : '#FFFFFF',
        border: featured ? 'none' : '1px solid #E8E2DC',
        borderRadius: 14,
        padding: featured ? '36px 32px' : '28px 24px',
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = featured
          ? '0 16px 48px rgba(0,0,0,0.2)'
          : '0 8px 24px rgba(0,0,0,0.08)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
      }}
    >
      {/* Category tag */}
      <div style={{
        display: 'inline-block',
        background: `${color}18`,
        border: `1px solid ${color}30`,
        padding: '3px 10px',
        borderRadius: 50,
        marginBottom: 16,
        alignSelf: 'flex-start',
      }}>
        <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: featured ? '#C4B5FD' : color, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {label}
        </span>
      </div>

      <h3 style={{
        ...serif,
        fontSize: featured ? 'clamp(20px, 2.5vw, 28px)' : 'clamp(17px, 2vw, 20px)',
        color: featured ? '#FAFAF9' : '#1F1F1F',
        lineHeight: 1.25,
        letterSpacing: '-0.01em',
        marginBottom: 12,
        flex: featured ? 0 : 1,
      }}>
        {title}
      </h3>

      {excerpt && (
        <p style={{
          ...sans,
          fontSize: featured ? 15 : 14,
          color: featured ? 'rgba(255,255,255,0.6)' : '#555555',
          lineHeight: 1.75,
          marginBottom: 20,
          flex: 1,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {excerpt}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ ...mono, fontSize: 10, color: featured ? 'rgba(255,255,255,0.35)' : '#999', letterSpacing: '0.05em' }}>
          {formatDate(created_at)}
        </span>
        <span style={{ ...sans, fontSize: 12, fontWeight: 700, color: featured ? '#C4B5FD' : '#7C3AED' }}>
          Read →
        </span>
      </div>
    </div>
  );
};

export default SignalCard;
