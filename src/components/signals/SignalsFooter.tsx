import { useState } from "react";
import { useNavigate } from "react-router-dom";

// ── Link data ────────────────────────────────────────────────────
const PLATFORM_LINKS = [
  { label: "Run a Safety Check",  href: "/search-form" },
  { label: "Safety Journal",       href: "/dashboard/journal" },
  { label: "Behavioral Signals",   href: "/dashboard/behavioral-signals" },
  { label: "Habit Tracker",        href: "/dashboard/habit" },
  { label: "Affidavit Builder",    href: "/dashboard/affidavit" },
];

const RESOURCE_LINKS = [
  { label: "GBV Resources",           href: "/safety-tips" },
  { label: "Protection Order Guide",  href: "/safety-tips#protection-orders" },
  { label: "About RedFlaq",           href: "/about" },
  { label: "Privacy Policy",          href: "/privacy" },
  { label: "Dispute a Record",        href: "/dispute" },
];

// ── FooterLink ───────────────────────────────────────────────────
const FooterLink = ({
  label,
  href,
}: {
  label: string;
  href: string;
}) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const isHash = href.includes("#");
  const isExternal = href.startsWith("http");

  const handleClick = () => {
    if (isExternal) { window.open(href, "_blank", "noopener noreferrer"); return; }
    if (isHash) {
      const [path, hash] = href.split("#");
      navigate(path);
      // Give the page a tick to mount before scrolling
      setTimeout(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
      return;
    }
    navigate(href);
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        background: "none",
        border: "none",
        padding: "0.25rem 0",
        fontFamily: "var(--rf-sans)",
        fontSize: "0.8rem",
        color: hovered ? "var(--rf-purple)" : "rgba(255,255,255,0.5)",
        cursor: "pointer",
        textAlign: "left",
        transition: "color 0.15s",
      }}
    >
      {label}
    </button>
  );
};

// ── LinkColumn ───────────────────────────────────────────────────
const LinkColumn = ({
  heading,
  links,
}: {
  heading: string;
  links: { label: string; href: string }[];
}) => (
  <div>
    <p style={{
      fontFamily: "var(--rf-sans)",
      fontSize: "0.68rem",
      fontWeight: 700,
      letterSpacing: "0.1em",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.3)",
      marginBottom: "0.75rem",
    }}>
      {heading}
    </p>
    {links.map((l) => (
      <FooterLink key={l.href} label={l.label} href={l.href} />
    ))}
  </div>
);

// ── SignalsFooter ─────────────────────────────────────────────────
const SignalsFooter = () => (
  <footer
    style={{
      background: "var(--rf-dark)",
      padding: "3rem 2rem 2rem",
      borderTop: "1px solid rgba(255,255,255,0.06)",
    }}
  >
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>

      {/* ── TOP ROW ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
        gap: "2rem",
        marginBottom: "2.5rem",
      }}>
        {/* Left — brand block */}
        <div>
          <p style={{
            fontFamily: "var(--rf-serif)",
            fontStyle: "italic",
            fontSize: "1.1rem",
            color: "#FFFFFF",
            marginBottom: "0.4rem",
          }}>
            RedFlaq Signals
          </p>
          <p style={{
            fontFamily: "var(--rf-sans)",
            fontSize: "0.78rem",
            color: "rgba(255,255,255,0.35)",
            maxWidth: 280,
            lineHeight: 1.6,
          }}>
            Behavioral safety for those who refuse to hand over their lives
            unverified. Part of RedFlaq.com
          </p>
        </div>

        {/* Right — link columns */}
        <div style={{ display: "flex", gap: "3rem", flexWrap: "wrap" }}>
          <LinkColumn heading="Platform" links={PLATFORM_LINKS} />
          <LinkColumn heading="Resources" links={RESOURCE_LINKS} />
        </div>
      </div>

      {/* ── EMERGENCY STRIP ── */}
      <div style={{
        background: "rgba(181,32,32,0.12)",
        border: "1px solid rgba(181,32,32,0.2)",
        borderRadius: "0.75rem",
        padding: "0.85rem 1.25rem",
        marginBottom: "1.5rem",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        flexWrap: "wrap",
      }}>
        <span
          aria-hidden="true"
          style={{ color: "var(--rf-danger)", fontSize: "1rem", flexShrink: 0 }}
        >
          ⚠
        </span>
        <span style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.8rem",
          color: "rgba(255,255,255,0.7)",
          lineHeight: 1.5,
        }}>
          In danger right now? GBV Command Centre:{" "}
          <a
            href="tel:0800428428"
            style={{
              color: "var(--rf-danger)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            0800 428 428
          </a>
          {" "}· Free · 24/7 · Confidential
        </span>
      </div>

      {/* ── BOTTOM COPYRIGHT ROW ── */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        paddingTop: "1.5rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem",
      }}>
        <p style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.72rem",
          color: "rgba(255,255,255,0.2)",
        }}>
          © 2026 RedFlaq · South Africa's public record safety check and
          evidence platform · POPIA compliant
        </p>
        <p style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.72rem",
          fontWeight: 700,
          color: "rgba(255,255,255,0.2)",
          letterSpacing: "0.03em",
        }}>
          Before you trust, RedFlaq first.
        </p>
      </div>
    </div>
  </footer>
);

export default SignalsFooter;
