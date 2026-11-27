import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import QuickExit from "./QuickExit";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const INK2 = "#111D25";
const IVORY = "#F7F5F0";
const IVORY2 = "#EDE9E1";
const CORAL = "#E0525B";
const MUTED = "#9AA6AD";
const MUTED2 = "#6E7B83";
const LINE = "rgba(247,245,240,0.09)";

type SidebarItem = {
  id: string;
  label: string;
  path: string;
  matches: (p: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
  authRequired?: boolean;
};

const ic = (active: boolean) => (active ? IVORY : MUTED);

const NAV_ITEMS: SidebarItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    matches: (p) => p === "/" || p === "/home",
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={ic(a)} strokeWidth="1.7" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "check",
    label: "Check",
    path: "/check",
    matches: (p) => p.startsWith("/check"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M21 21L16.5 16.5M19 11C19 15.4 15.4 19 11 19C6.6 19 3 15.4 3 11C3 6.6 6.6 3 11 3C15.4 3 19 6.6 19 11Z" stroke={ic(a)} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "signals",
    label: "Signals",
    path: "/signals",
    matches: (p) => p.startsWith("/signals"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke={ic(a)} strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3" stroke={ic(a)} strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    id: "deals",
    label: "Deals",
    path: "/dashboard/reports",
    matches: (p) => p.startsWith("/dashboard/reports"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="6" width="18" height="13" rx="2" stroke={ic(a)} strokeWidth="1.7" />
        <path d="M3 10H21" stroke={ic(a)} strokeWidth="1.7" />
        <path d="M7 14H9M11 14H13" stroke={ic(a)} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    authRequired: true,
  },
  {
    id: "safe",
    label: "Safe",
    path: "/safety-tips",
    matches: (p) => p.startsWith("/safety-tips") || p.startsWith("/dashboard/journal"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M12 3L4 7V13C4 17 7.6 20.5 12 22C16.4 20.5 20 17 20 13V7L12 3Z" stroke={ic(a)} strokeWidth="1.7" strokeLinejoin="round" />
        <path d="M9 12L11 14L15 10" stroke={ic(a)} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "you",
    label: "You",
    path: "/dashboard",
    matches: (p) => p.startsWith("/dashboard"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="4" stroke={ic(a)} strokeWidth="1.7" />
        <path d="M4 20C4 17.8 7.6 16 12 16C16.4 16 20 17.8 20 20" stroke={ic(a)} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
    authRequired: true,
  },
  {
    id: "business",
    label: "Business",
    path: "/partners",
    matches: (p) => p.startsWith("/partners"),
    icon: (a) => (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="2" y="7" width="20" height="14" rx="2" stroke={ic(a)} strokeWidth="1.7" />
        <path d="M16 7V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V7" stroke={ic(a)} strokeWidth="1.7" />
        <path d="M12 12V15M10 13.5H14" stroke={ic(a)} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        height: "100vh",
        position: "sticky",
        top: 0,
        background: INK2,
        borderRight: `1px solid ${LINE}`,
        display: "flex",
        flexDirection: "column",
        paddingTop: "env(safe-area-inset-top, 0px)",
      }}
    >
      {/* Wordmark */}
      <div
        style={{
          padding: "1.5rem 1.25rem 1.25rem",
          borderBottom: `1px solid ${LINE}`,
        }}
      >
        <Link to="/" aria-label="RedFlaq home" className="inline-flex min-h-11 items-center">
          <img src={redflaqLogo} alt="RedFlaq" className="block h-auto w-40 max-w-full" />
        </Link>
        <p
          style={{
            fontSize: 10,
            color: MUTED2,
            marginTop: 2,
            fontFamily: "'General Sans', system-ui, sans-serif",
            letterSpacing: "0.04em",
          }}
        >
          Before You Trust, RedFlaq First.
        </p>
      </div>

      {/* Navigation */}
      <nav
        aria-label="Main navigation"
        style={{ flex: 1, padding: "0.75rem 0.75rem", overflowY: "auto" }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.matches(pathname);
          const isLocked = item.authRequired && !user;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-current={isActive ? "page" : undefined}
              aria-label={isLocked ? `${item.label} — sign in required` : item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                width: "100%",
                padding: "9px 12px",
                borderRadius: 7,
                border: "none",
                background: isActive ? "rgba(247,245,240,0.07)" : "none",
                color: isActive ? IVORY : isLocked ? MUTED2 : MUTED,
                fontSize: 13.5,
                fontWeight: isActive ? 600 : 400,
                fontFamily: "'General Sans', system-ui, sans-serif",
                cursor: "pointer",
                marginBottom: 2,
                transition: "background 0.1s ease",
                textAlign: "left",
                opacity: isLocked ? 0.5 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = "rgba(247,245,240,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "none";
              }}
            >
              {item.icon(isActive)}
              <span>{item.label}</span>
              {item.id === "check" && (
                <span
                  style={{
                    marginLeft: "auto",
                    width: 7,
                    height: 7,
                    borderRadius: "50%",
                    background: CORAL,
                    flexShrink: 0,
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom: auth status + quick exit */}
      <div
        style={{
          borderTop: `1px solid ${LINE}`,
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          paddingBottom: `calc(1rem + env(safe-area-inset-bottom, 0px))`,
        }}
      >
        <span
          style={{
            fontSize: 11,
            color: MUTED2,
            fontFamily: "'General Sans', system-ui, sans-serif",
          }}
        >
          {user ? "Signed in" : "Guest"}
        </span>
        <QuickExit />
      </div>
    </aside>
  );
}
