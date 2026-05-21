import { useLocation, useNavigate } from "react-router-dom";
import { useHaptics } from "@/hooks/useHaptics";

type TabId = "home" | "signals" | "verify" | "base";

interface Tab {
  id: TabId;
  label: string;
  path: string;
  matches: (pathname: string) => boolean;
  icon: (active: boolean) => JSX.Element;
}

const ACCENT = "#7C3AED";
const MUTED = "#8b8b91";
const CREAM = "#F5F0EB";

const stroke = (active: boolean) => (active ? ACCENT : MUTED);

const TABS: Tab[] = [
  {
    id: "home",
    label: "Home",
    path: "/dashboard",
    matches: (p) => p === "/" || p === "/dashboard",
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 12L12 3L21 12V21H15V15H9V21H3V12Z" stroke={stroke(active)} strokeWidth="1.8" strokeLinejoin="round" fill={active ? "rgba(124,58,237,0.12)" : "none"} />
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
        <path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke={stroke(active)} strokeWidth="1.8" />
        <circle cx="12" cy="12" r="3" stroke={stroke(active)} strokeWidth="1.8" fill={active ? ACCENT : "none"} />
      </svg>
    ),
  },
  {
    id: "verify",
    label: "Verify",
    path: "/dashboard/new-check",
    matches: (p) => p.startsWith("/dashboard/new-check") || p.startsWith("/search-form") || p.startsWith("/results"),
    icon: () => <></>,
  },
  {
    id: "base",
    label: "Base",
    path: "/dashboard/reports",
    matches: (p) =>
      p.startsWith("/dashboard/reports") ||
      p.startsWith("/dashboard/saved-signals") ||
      p.startsWith("/dashboard/journal"),
    icon: (active) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="6" rx="8" ry="3" stroke={stroke(active)} strokeWidth="1.8" fill={active ? "rgba(124,58,237,0.12)" : "none"} />
        <path d="M4 6V12C4 13.7 7.6 15 12 15C16.4 15 20 13.7 20 12V6" stroke={stroke(active)} strokeWidth="1.8" />
        <path d="M4 12V18C4 19.7 7.6 21 12 21C16.4 21 20 19.7 20 18V12" stroke={stroke(active)} strokeWidth="1.8" />
      </svg>
    ),
  },
];

export const MOBILE_TAB_BAR_HEIGHT = 72;

export default function MobileTabBar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const haptic = useHaptics();

  const go = (path: string, intensity: "light" | "medium" = "light") => {
    haptic(intensity);
    navigate(path);
  };

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
        background: "#ffffff",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 -8px 24px -12px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        height: MOBILE_TAB_BAR_HEIGHT,
      }}
    >
      {TABS.map((tab) => {
        const active = tab.matches(pathname);

        if (tab.id === "verify") {
          return (
            <div
              key={tab.id}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              <button
                onClick={() => go(tab.path, "medium")}
                aria-label="Run a verification check"
                aria-current={active ? "page" : undefined}
                style={{
                  position: "absolute",
                  top: -22,
                  width: 60,
                  height: 60,
                  borderRadius: "50%",
                  background: ACCENT,
                  border: `4px solid ${CREAM}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 10px 24px -8px rgba(124,58,237,0.55)",
                  color: "#fff",
                  transition: "transform 120ms ease",
                }}
                onTouchStart={(e) => (e.currentTarget.style.transform = "scale(0.94)")}
                onTouchEnd={(e) => (e.currentTarget.style.transform = "scale(1)")}
              >
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <span
                style={{
                  marginTop: 44,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: active ? ACCENT : MUTED,
                  fontWeight: 700,
                }}
              >
                Verify
              </span>
            </div>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={() => go(tab.path)}
            aria-current={active ? "page" : undefined}
            style={{
              flex: 1,
              minHeight: 44,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 4,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px 0",
            }}
          >
            {tab.icon(active)}
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: active ? ACCENT : MUTED,
                fontWeight: active ? 700 : 500,
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
