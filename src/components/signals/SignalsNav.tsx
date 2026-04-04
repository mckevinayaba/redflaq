import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuthGuard } from "@/hooks/useAuthGuard";

const NAV_LINKS = [
  { label: "Run a Check", href: "/search-form" },
  { label: "Signals", href: "/signals" },
  { label: "Safety Tools", href: "/safety-tips" },
  { label: "About", href: "/about" },
];

const SignalsNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { guardedAction } = useAuthGuard();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNavClick = (href: string) => {
    navigate(href);
    setMenuOpen(false);
  };

  const handleRunCheck = () => {
    guardedAction();
    setMenuOpen(false);
  };

  const isActive = (href: string) => location.pathname === href;

  const navLinkStyle = (href: string): React.CSSProperties => ({
    fontFamily: "var(--rf-sans)",
    fontSize: "0.85rem",
    fontWeight: 500,
    color: isActive(href) ? "var(--rf-purple)" : "var(--rf-ink-mid)",
    background: "none",
    border: "none",
    borderBottom: isActive(href) ? "2px solid var(--rf-purple)" : "2px solid transparent",
    padding: "4px 2px",
    cursor: "pointer",
    textDecoration: "none",
    transition: "color 0.18s, border-color 0.18s",
    lineHeight: 1,
    whiteSpace: "nowrap" as const,
  });

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        height: 68,
        background: "var(--rf-paper)",
        borderBottom: "1px solid rgba(0,0,0,0.09)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* ── Logo ── */}
        <a
          href="https://redflaq.com"
          style={{ textDecoration: "none", flexShrink: 0 }}
        >
          <span
            style={{
              fontFamily: "var(--rf-sans)",
              fontWeight: 800,
              fontSize: "1.2rem",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "var(--rf-danger)" }}>R</span>
            <span style={{ color: "var(--rf-purple)" }}>edFlaq</span>
          </span>
        </a>

        {/* ── Desktop center nav ── */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            {NAV_LINKS.map((link) =>
              link.label === "Run a Check" ? (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  style={navLinkStyle(link.href)}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href))
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--rf-purple)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href))
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--rf-ink-mid)";
                  }}
                >
                  {link.label}
                </button>
              ) : (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  style={navLinkStyle(link.href)}
                  onMouseEnter={(e) => {
                    if (!isActive(link.href))
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--rf-purple)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive(link.href))
                      (e.currentTarget as HTMLButtonElement).style.color =
                        "var(--rf-ink-mid)";
                  }}
                >
                  {link.label}
                </button>
              )
            )}
          </div>
        )}

        {/* ── Desktop right buttons ── */}
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Log In */}
            <button
              onClick={() => navigate("/signup?mode=signin")}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.78rem",
                fontWeight: 500,
                color: "var(--rf-ink)",
                background: "transparent",
                border: "1.5px solid var(--rf-ink)",
                borderRadius: "2rem",
                padding: "7px 16px",
                cursor: "pointer",
                transition: "color 0.18s, border-color 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--rf-purple)";
                e.currentTarget.style.borderColor = "var(--rf-purple)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--rf-ink)";
                e.currentTarget.style.borderColor = "var(--rf-ink)";
              }}
            >
              Log In
            </button>

            {/* Create Free Safety Base */}
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.78rem",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "var(--rf-purple)",
                border: "none",
                borderRadius: "2rem",
                padding: "7px 16px",
                cursor: "pointer",
                transition: "background 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rf-purple-dark)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rf-purple)")
              }
            >
              Create Free Safety Base
            </button>

            {/* Run a Check → */}
            <button
              onClick={handleRunCheck}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.78rem",
                fontWeight: 700,
                color: "#FFFFFF",
                background: "var(--rf-dark)",
                border: "none",
                borderRadius: "2rem",
                padding: "7px 18px",
                cursor: "pointer",
                transition: "background 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--rf-purple)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--rf-dark)")
              }
            >
              Run a Check →
            </button>
          </div>
        )}

        {/* ── Mobile hamburger ── */}
        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 6,
              color: "var(--rf-ink)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {/* ── Mobile dropdown ── */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 68,
            left: 0,
            right: 0,
            background: "var(--rf-paper)",
            borderBottom: "1px solid rgba(0,0,0,0.09)",
            padding: "16px 24px 24px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            zIndex: 199,
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          }}
        >
          {NAV_LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => handleNavClick(link.href)}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.95rem",
                fontWeight: isActive(link.href) ? 700 : 500,
                color: isActive(link.href) ? "var(--rf-purple)" : "var(--rf-ink)",
                background: isActive(link.href)
                  ? "rgba(124,58,237,0.06)"
                  : "none",
                border: "none",
                borderRadius: 8,
                padding: "11px 12px",
                cursor: "pointer",
                textAlign: "left",
                transition: "background 0.15s",
                width: "100%",
              }}
            >
              {link.label}
            </button>
          ))}

          {/* Mobile action buttons */}
          <div
            style={{
              borderTop: "1px solid rgba(0,0,0,0.07)",
              marginTop: 8,
              paddingTop: 16,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <button
              onClick={() => { navigate("/signup?mode=signin"); setMenuOpen(false); }}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--rf-ink)",
                background: "transparent",
                border: "1.5px solid var(--rf-ink)",
                borderRadius: "2rem",
                padding: "11px 16px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Log In
            </button>
            <button
              onClick={() => { navigate("/signup"); setMenuOpen(false); }}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.85rem",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "var(--rf-purple)",
                border: "none",
                borderRadius: "2rem",
                padding: "11px 16px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Create Free Safety Base
            </button>
            <button
              onClick={handleRunCheck}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "#FFFFFF",
                background: "var(--rf-dark)",
                border: "none",
                borderRadius: "2rem",
                padding: "11px 16px",
                cursor: "pointer",
                width: "100%",
              }}
            >
              Run a Check →
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default SignalsNav;
