import { useLocation, useNavigate } from "react-router-dom";

type TabId = "home" | "check" | "signals" | "journal" | "connect" | "base";

interface Tab {
  id: TabId;
  label: string;
  path: string;
  matches: (pathname: string) => boolean;
  icon: (active: boolean) => JSX.Element;
}

const ACCENT = "#7C3AED";
const MUTED = "#8b8b91";

const stroke = (active: boolean) => (active ? ACCENT : MUTED);
const fill = (active: boolean) => (active ? "rgba(124,58,237,0.15)" : "none");

const TABS: Tab[] = [
  {
    id: "home",
    label: "Home",
    path: "/dashboard",
    matches: (p) => p === "/dashboard",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={stroke(active)} strokeWidth="1.8" strokeLinejoin="round" fill={fill(active)} />
      </svg>
    ),
  },
  {
    id: "check",
    label: "Check",
    path: "/dashboard/new-check",
    matches: (p) => p.startsWith("/dashboard/new-check") || p.startsWith("/search-form") || p.startsWith("/results"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z" stroke={stroke(active)} strokeWidth="1.8" strokeLinejoin="round" fill={fill(active)} />
        <path d="M9 12L11 14L15 10" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "signals",
    label: "Signals",
    path: "/signals",
    matches: (p) => p.startsWith("/signals"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke={stroke(active)} strokeWidth="1.8" fill={fill(active)} />
        <circle cx="12" cy="12" r="3" stroke={stroke(active)} strokeWidth="1.8" fill={active ? ACCENT : "none"} />
      </svg>
    ),
  },
  {
    id: "journal",
    label: "Journal",
    path: "/dashboard/journal",
    matches: (p) => p.startsWith("/dashboard/journal"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="3" width="13" height="18" rx="1" stroke={stroke(active)} strokeWidth="1.8" fill={fill(active)} />
        <path d="M17 7H20V21H7" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M8 8H13M8 12H13M8 16H11" stroke={stroke(active)} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "connect",
    label: "Connect",
    path: "/connect",
    matches: (p) => p.startsWith("/connect"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="8" r="3" stroke={stroke(active)} strokeWidth="1.8" fill={fill(active)} />
        <circle cx="17" cy="10" r="2.5" stroke={stroke(active)} strokeWidth="1.8" fill={fill(active)} />
        <path d="M3 20C3 17.2 5.7 15 9 15C12.3 15 15 17.2 15 20" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M17 15C19.2 15 21 16.6 21 18.5" stroke={stroke(active)} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: "base",
    label: "Base",
    path: "/dashboard/reports",
    matches: (p) => p.startsWith("/dashboard/reports") || p.startsWith("/dashboard/saved-signals"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke={stroke(active)} strokeWidth="1.8" fill={fill(active)} />
        <path d="M4 6V12C4 13.7 7.6 15 12 15C16.4 15 20 13.7 20 12V6" stroke={stroke(active)} strokeWidth="1.8" />
        <path d="M4 12V18C4 19.7 7.6 21 12 21C16.4 21 20 19.7 20 18V12" stroke={stroke(active)} strokeWidth="1.8" />
      </svg>
    ),
  },
];

export const MOBILE_TAB_BAR_HEIGHT = 64;

export default function MobileTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      role="navigation"
      aria-label="Primary"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "#111118",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
      }}
    >
      {TABS.map((tab) => {
        const active = tab.matches(pathname);
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.path)}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              minHeight: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
              padding: "10px 0 6px",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
            }}
          >
            {active && (
              <span
                style={{
                  position: "absolute",
                  top: 0,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 28,
                  height: 2,
                  background: ACCENT,
                  borderRadius: "0 0 2px 2px",
                }}
              />
            )}
            {tab.icon(active)}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: active ? ACCENT : MUTED,
                fontWeight: active ? 600 : 400,
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
