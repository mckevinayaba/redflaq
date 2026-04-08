import { useNavigate } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
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

  if (featured) {
    return (
      <div
        onClick={() => navigate(`/signals/${slug}`)}
        style={{
          background: '#111118',
          border: '1px solid rgba(108,53,222,0.25)',
          borderLeft: '4px solid #6C35DE',
          borderRadius: 8,
          padding: 'clamp(28px, 4vw, 52px)',
          cursor: 'pointer',
          transition: 'border-color 0.2s, transform 0.2s',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.25)';
          (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        }}
      >
        {/* Category badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(108,53,222,0.15)', border: '1px solid rgba(108,53,222,0.3)',
          padding: '4px 12px', borderRadius: 4, marginBottom: 20,
        }}>
          <span style={{ display: 'inline-block', width: 6, height: 6, background: '#6C35DE', borderRadius: '50%' }} />
          <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>
            {label}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          ...inter,
          fontSize: 'clamp(22px, 3vw, 36px)',
          fontWeight: 800,
          color: '#ffffff',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          marginBottom: 16,
          maxWidth: 700,
        }}>
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p style={{
            ...inter,
            fontSize: 'clamp(14px, 1.5vw, 16px)',
            color: '#d1d1d6',
            lineHeight: 1.8,
            marginBottom: 28,
            maxWidth: 640,
          }}>
            {excerpt}
          </p>
        )}

        {/* Meta + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.06em' }}>
            {formatDate(created_at)} · RedFlaq Signals · 5 min read
          </span>
          <span style={{
            ...inter, fontSize: 14, fontWeight: 700, color: '#fff',
            background: '#6C35DE', padding: '10px 22px', borderRadius: 4,
          }}>
            Read Signal →
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => navigate(`/signals/${slug}`)}
      style={{
        background: '#111118',
        border: '1px solid rgba(108,53,222,0.2)',
        borderRadius: 8,
        padding: '24px',
        cursor: 'pointer',
        transition: 'border-color 0.2s, transform 0.2s',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = '#6C35DE';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(108,53,222,0.2)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Category badge */}
      <div style={{
        display: 'inline-block',
        background: 'rgba(108,53,222,0.12)',
        border: '1px solid rgba(108,53,222,0.25)',
        padding: '3px 10px',
        borderRadius: 4,
        marginBottom: 14,
        alignSelf: 'flex-start',
      }}>
        <span style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.08em', textTransform: 'uppercase' as const }}>
          {label}
        </span>
      </div>

      <h3 style={{
        ...inter,
        fontSize: 'clamp(15px, 1.8vw, 18px)',
        fontWeight: 700,
        color: '#ffffff',
        lineHeight: 1.3,
        letterSpacing: '-0.01em',
        marginBottom: 10,
        flex: 1,
      }}>
        {title}
      </h3>

      {excerpt && (
        <p style={{
          ...inter,
          fontSize: 13,
          color: '#8b8b91',
          lineHeight: 1.7,
          marginBottom: 16,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }}>
          {excerpt}
        </p>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
        <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.05em' }}>
          {formatDate(created_at)}
        </span>
        <span style={{ ...inter, fontSize: 12, fontWeight: 700, color: '#6C35DE' }}>
          Read →
        </span>
      </div>
    </div>
  );
};

export default SignalCard;
