import { useNavigate } from "react-router-dom";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
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
      background: '#111118',
      border: '1px solid rgba(108,53,222,0.2)',
      borderLeft: '3px solid #6C35DE',
      borderRadius: 8,
      padding: '28px 24px',
      marginTop: 40,
    }}>
      <p style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#6C35DE', letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: 10 }}>
        WHAT YOU CAN DO RIGHT NOW
      </p>
      <h3 style={{ ...inter, fontSize: 'clamp(16px, 2vw, 22px)', fontWeight: 800, color: '#ffffff', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
        Knowledge without action doesn't protect you.
      </h3>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
        {actions.map(action => (
          <button
            key={action.label}
            onClick={() => handleAction(action)}
            style={{
              ...inter, fontWeight: 700, fontSize: 14,
              background: action.style === 'red' ? '#C0392B'
                : action.style === 'purple' ? '#6C35DE'
                : 'transparent',
              color: action.style === 'outline' ? '#6C35DE' : '#ffffff',
              border: action.style === 'outline' ? '1.5px solid rgba(108,53,222,0.4)' : 'none',
              padding: '12px 22px', borderRadius: 4, cursor: 'pointer',
              transition: 'opacity 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {action.label}
          </button>
        ))}
      </div>

      <p style={{ ...inter, fontSize: 13, color: '#8b8b91', fontStyle: 'italic', lineHeight: 1.6 }}>
        "Before you trust, RedFlaq first."
      </p>
    </div>
  );
};

export default SignalActionBlock;
