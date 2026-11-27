import { useLocation, useNavigate } from "react-router-dom";

const INK = "#0B1318";
const IVORY = "#F7F5F0";
const CORAL = "#E0525B";
const MUTED = "#9AA6AD";
const LINE = "rgba(247,245,240,0.09)";

type NavItem = {
  id: string;
  label: string;
  path: string;
  matches: (p: string) => boolean;
  icon: (active: boolean) => React.ReactNode;
};

const NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    path: "/",
    matches: (p) => p === "/" || p === "/home",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          strokeLinejoin="round"
          fill={active ? "rgba(247,245,240,0.08)" : "none"}
        />
      </svg>
    ),
  },
  {
    id: "signals",
    label: "Signals",
    path: "/signals",
    matches: (p) => p.startsWith("/signals"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
        />
        <circle
          cx="12"
          cy="12"
          r="3"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          fill={active ? IVORY : "none"}
        />
      </svg>
    ),
  },
  {
    id: "check",
    label: "Check",
    path: "/check",
    matches: (p) => p.startsWith("/check"),
    icon: () => null, // Rendered as a raised orb below
  },
  {
    id: "safe",
    label: "Safe",
    path: "/safety-tips",
    matches: (p) => p.startsWith("/safety-tips") || p.startsWith("/dashboard/journal"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3L4 7V13C4 17 7.6 20.5 12 22C16.4 20.5 20 17 20 13V7L12 3Z"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          strokeLinejoin="round"
          fill={active ? "rgba(247,245,240,0.08)" : "none"}
        />
        <path
          d="M9 12L11 14L15 10"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    id: "you",
    label: "You",
    path: "/dashboard/account",
    matches: (p) => p.startsWith("/dashboard/account") || p.startsWith("/dashboard"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle
          cx="12"
          cy="8"
          r="4"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          fill={active ? "rgba(247,245,240,0.08)" : "none"}
        />
        <path
          d="M4 20C4 17.8 7.6 16 12 16C16.4 16 20 17.8 20 20"
          stroke={active ? IVORY : MUTED}
          strokeWidth="1.7"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

const BAR_HEIGHT = 72;

export { BAR_HEIGHT as APP_BOTTOM_NAV_HEIGHT };

export default function AppBottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <>
      {/* Spacer */}
      <div
        aria-hidden
        style={{
          height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        }}
      />
      {/* Fixed bar */}
      <nav
        aria-label="Main navigation"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          height: `calc(${BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
          background: INK,
          borderTop: `1px solid ${LINE}`,
          display: "flex",
          alignItems: "flex-start",
          paddingTop: 0,
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          zIndex: 100,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive = item.matches(pathname);
          const isCheck = item.id === "check";

          if (isCheck) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                aria-label="Check It — RedFlaq"
                aria-current={isActive ? "page" : undefined}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  paddingTop: 0,
                  gap: 4,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  height: BAR_HEIGHT,
                }}
              >
                {/* Raised coral orb — sits above the bar */}
                <div
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: "50%",
                    background: CORAL,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: -20,
                    boxShadow: `0 4px 20px rgba(224,82,91,0.45)`,
                    flexShrink: 0,
                  }}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M21 21L16.5 16.5M19 11C19 15.4 15.4 19 11 19C6.6 19 3 15.4 3 11C3 6.6 6.6 3 11 3C15.4 3 19 6.6 19 11Z"
                      stroke="#fff"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    color: isActive ? IVORY : MUTED,
                    fontFamily: "'General Sans', system-ui, sans-serif",
                    marginTop: 2,
                  }}
                >
                  Check
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
                height: BAR_HEIGHT,
                background: "none",
                border: "none",
                cursor: "pointer",
                paddingTop: 10,
              }}
            >
              {item.icon(isActive)}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  color: isActive ? IVORY : MUTED,
                  fontFamily: "'General Sans', system-ui, sans-serif",
                }}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
