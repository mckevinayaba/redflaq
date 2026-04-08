import { Link, useLocation } from "react-router-dom";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    title: "New Safety Check",
    path: "/dashboard/new-check",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Habit",
    path: "/dashboard/habit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" /><line x1="9" y1="9" x2="9.01" y2="9" /><line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
  },
  {
    title: "Signal Detection",
    path: "/dashboard/behavioral-signals",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M4.93 4.93a10 10 0 0 0 0 14.14" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M8.46 8.46a5 5 0 0 0 0 7.07" />
      </svg>
    ),
  },
  {
    title: "Safety Journal",
    path: "/dashboard/journal",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    title: "Affidavit Builder",
    path: "/dashboard/affidavit",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
      </svg>
    ),
  },
  {
    title: "My Reports",
    path: "/dashboard/reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
  {
    title: "Account",
    path: "/dashboard/account",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
      </svg>
    ),
  },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside style={{
      width: 256,
      minHeight: '100%',
      background: '#111118',
      borderRight: '1px solid rgba(255,255,255,0.06)',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Nav */}
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path
            || (item.path === "/dashboard/journal" && location.pathname.startsWith("/dashboard/journal"));
          return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 14px',
                borderRadius: 6,
                textDecoration: 'none',
                ...inter,
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#ffffff' : '#8b8b91',
                background: isActive ? 'rgba(108,53,222,0.15)' : 'transparent',
                borderLeft: isActive ? '3px solid #6C35DE' : '3px solid transparent',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'rgba(108,53,222,0.06)';
                  e.currentTarget.style.color = '#d1d1d6';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8b8b91';
                }
              }}
            >
              <span style={{ color: isActive ? '#6C35DE' : 'currentColor', flexShrink: 0 }}>
                {item.icon}
              </span>
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* GBV stat box */}
      <div style={{
        margin: '0 12px 16px',
        padding: '14px 16px',
        borderRadius: 6,
        background: 'rgba(192,57,43,0.08)',
        border: '1px solid rgba(192,57,43,0.2)',
        borderLeft: '3px solid rgba(192,57,43,0.6)',
      }}>
        <p style={{ ...mono, fontSize: 9, fontWeight: 700, color: '#C0392B', letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 6 }}>
          Safety first
        </p>
        <p style={{ ...inter, fontSize: 12, color: '#8b8b91', lineHeight: 1.6 }}>
          1 in 3 South African women experience gender‑based violence at the hands of an intimate partner during their lifetime.
        </p>
      </div>
    </aside>
  );
}
