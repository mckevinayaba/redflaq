import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

interface Action {
  label: string;
  href: string;
  style: "red" | "purple" | "outline";
}

interface SignalActionBlockProps {
  category: string;
}

const ACTION_MAP: Record<string, Action[]> = {
  "behavioral-patterns": [
    { label: "Run a Check — R99", href: "/search-form", style: "red" },
    { label: "Document This in My Journal", href: "/dashboard/journal/new", style: "purple" },
  ],
  "dating-relationships": [
    { label: "Run a Check — R99", href: "/search-form", style: "red" },
    { label: "First Date Safety Checklist", href: "/safety-tips/first-date-safety", style: "outline" },
  ],
  "trust-denial": [
    { label: "Run a Check — R99", href: "/search-form", style: "red" },
    { label: "Start Your Safety Journal", href: "/dashboard/journal/new", style: "purple" },
  ],
  "gbvf-evidence": [
    { label: "Document in My Journal", href: "/dashboard/journal/new", style: "purple" },
    { label: "Get Help Near You", href: "/safety-tips#get-help", style: "outline" },
  ],
  "safety-habits": [
    { label: "Open My Safety Journal", href: "/dashboard/journal", style: "purple" },
    { label: "Run a Check — R99", href: "/search-form", style: "red" },
  ],
  "dating-safety": [
    { label: "Run a Check — R99", href: "/search-form", style: "red" },
    { label: "First Date Safety Checklist", href: "/safety-tips/first-date-safety", style: "outline" },
  ],
  "gbv-resources": [
    { label: "Get Help Near You", href: "/safety-tips#get-help", style: "purple" },
    { label: "Protection Order Guide", href: "/safety-tips#protection-orders", style: "outline" },
  ],
};

const DEFAULT_ACTIONS: Action[] = [
  { label: "Run a Check — R99", href: "/search-form", style: "red" },
  { label: "Create Free Safety Base", href: "/signup", style: "purple" },
];

const SignalActionBlock = ({ category }: SignalActionBlockProps) => {
  const navigate = useNavigate();
  const { guardedAction } = useAuthGuard();

  const actions = ACTION_MAP[category] || DEFAULT_ACTIONS;

  const handleAction = (action: Action) => {
    if (action.href === "/search-form") {
      guardedAction();
    } else {
      navigate(action.href);
    }
  };

  return (
    <div style={{
      background: 'rgba(124,58,237,0.04)',
      border: '1px solid rgba(124,58,237,0.12)',
      borderRadius: 14,
      padding: '32px 28px',
      marginTop: 40,
    }}>
      <p style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#7C3AED', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
        WHAT YOU CAN DO RIGHT NOW
      </p>
      <h3 style={{ ...serif, fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.01em', marginBottom: 20 }}>
        Knowledge without action doesn't protect you.
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {actions.map(action => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            style={{
              ...sans, fontWeight: 700, fontSize: 14, color: 'white',
              background: action.style === 'red' ? '#B52020'
                : action.style === 'purple' ? '#7C3AED'
                : 'transparent',
              color: action.style === 'outline' ? '#7C3AED' : 'white',
              border: action.style === 'outline' ? '1.5px solid #7C3AED' : 'none',
              padding: '13px 24px', borderRadius: 50, cursor: 'pointer',
              boxShadow: action.style === 'red' ? '0 2px 12px rgba(181,32,32,0.2)'
                : action.style === 'purple' ? '0 2px 12px rgba(124,58,237,0.2)'
                : 'none',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {action.label}
          </button>
        ))}
      </div>

      <p style={{ ...sans, fontSize: 13, color: '#888', fontStyle: 'italic', lineHeight: 1.6 }}>
        "Before you trust, RedFlaq first."
      </p>
    </div>
  );
};

export default SignalActionBlock;
