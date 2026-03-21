import { Link } from "react-router-dom";

interface BackToHomeProps {
  light?: boolean;
}

const BackToHome = ({ light = false }: BackToHomeProps) => (
  <div
    style={{
      maxWidth: 900,
      margin: "0 auto",
      padding: "12px 20px 0",
      position: "relative",
      zIndex: 10,
    }}
  >
    <Link
      to="/"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.08em",
        color: light ? "rgba(255,255,255,0.5)" : "#7C3AED",
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        transition: "color 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.color = light ? "rgba(255,255,255,0.8)" : "#6B4EFF")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.color = light ? "rgba(255,255,255,0.5)" : "#7C3AED")
      }
    >
      ← HOME
    </Link>
  </div>
);

export default BackToHome;
