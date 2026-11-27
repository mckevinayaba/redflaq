import { useCallback } from "react";
import { useNavigate } from "react-router-dom";

export default function QuickExit() {
  const navigate = useNavigate();

  const handleExit = useCallback(() => {
    // Clear transient session state
    try {
      sessionStorage.clear();
    } catch {}
    // Navigate away from sensitive content immediately
    window.location.replace("https://www.google.co.za");
  }, []);

  return (
    <button
      onClick={handleExit}
      title="Quick Exit — leave this page immediately"
      aria-label="Quick Exit — immediately navigate away from this page"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 11px",
        borderRadius: 6,
        border: "1px solid rgba(224,82,91,0.3)",
        background: "rgba(224,82,91,0.08)",
        color: "#E0525B",
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase" as const,
        cursor: "pointer",
        fontFamily: "'General Sans', system-ui, sans-serif",
        flexShrink: 0,
        transition: "background 0.1s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(224,82,91,0.18)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "rgba(224,82,91,0.08)")
      }
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden>
        <path
          d="M2 2L10 10M10 2L2 10"
          stroke="#E0525B"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
      Exit
    </button>
  );
}
