import { Link, useNavigate } from "react-router-dom";

interface Props {
  /** Show a back chevron instead of the logo */
  back?: boolean;
  /** Optional small label shown on the right (e.g. credit count) */
  rightLabel?: string;
  /** Optional title shown centered (only when `back` is true) */
  title?: string;
}

/**
 * Slim 56px top bar for the mobile shell.
 * - Logo (or back chevron) on the left
 * - Optional title (centered) when in "back" mode
 * - Optional right label (e.g. "3 checks")
 *
 * Sits above page content but below modals.
 */
export default function MobileTopBar({ back, rightLabel, title }: Props) {
  const navigate = useNavigate();

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        height: 56,
        paddingTop: "env(safe-area-inset-top, 0px)",
        background: "rgba(8,8,15,0.92)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
      }}
    >
      {back ? (
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "none",
            border: "none",
            color: "#d1d1d6",
            cursor: "pointer",
            padding: "8px 0",
            minHeight: 44,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
      ) : (
        <Link
          to="/"
          aria-label="RedFlaq home"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 22,
            color: "#ffffff",
            textDecoration: "none",
            letterSpacing: "-0.01em",
          }}
        >
          Red<span style={{ color: "#7C3AED" }}>Flaq</span>
        </Link>
      )}

      {title && (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#8b8b91",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          {title}
        </span>
      )}

      {rightLabel ? (
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "#7C3AED",
          }}
        >
          {rightLabel}
        </span>
      ) : (
        <span style={{ width: 24 }} />
      )}
    </header>
  );
}
