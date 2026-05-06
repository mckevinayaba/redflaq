import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trackConversion } from "@/utils/conversionTracking";

// ── Plan data ────────────────────────────────────────────────────
interface Plan {
  name: string;
  price: string;
  unit: string;
  description: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
}

const PLANS: Plan[] = [
  {
    name: "Free",
    price: "R0",
    unit: "/ always",
    description:
      "Start reading signals and building your safety awareness. No credit card ever.",
    features: [
      "2 signals per week",
      "Like and comment",
      "GBV resource directory",
      "Safety journal access",
      "Free Safety Base account",
    ],
    cta: "Start Reading Free",
    href: "/signup",
  },
  {
    name: "Public Record Check",
    price: "R99",
    unit: "per check",
    description:
      "Pay only when you need to verify someone. No subscription. No commitment.",
    features: [
      "Full public record check",
      "Results in under 60 seconds",
      "POPIA compliant",
      "Downloadable PDF report",
      "Confidential — they are never notified",
      "Saved to your Safety Base forever",
    ],
    cta: "Run a Check Now →",
    href: "/search-form",
    featured: true,
  },
  {
    name: "Safety Base",
    price: "Free",
    unit: "account",
    description:
      "Everything you need to document, track, and protect — included with your free account.",
    features: [
      "Safety Journal (court-admissible)",
      "Behavioral Signal Detection",
      "Habit tracker",
      "Affidavit builder",
      "Saved checks history",
      "Protection order guide",
    ],
    cta: "Create Safety Base",
    href: "/signup",
  },
];

// ── PlanCard ──────────────────────────────────────────────────────
const PlanCard = ({ plan }: { plan: Plan }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [btnHovered, setBtnHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: plan.featured
          ? "rgba(124,58,237,0.12)"
          : "rgba(255,255,255,0.06)",
        border: `1px solid ${
          plan.featured
            ? "var(--rf-purple)"
            : hovered
            ? "var(--rf-purple)"
            : "rgba(255,255,255,0.1)"
        }`,
        borderRadius: "1.25rem",
        padding: "2rem 1.75rem",
        width: 270,
        textAlign: "left",
        transition: "border-color 0.2s",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Plan name */}
      <p style={{
        fontFamily: "var(--rf-sans)",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.45)",
        marginBottom: "0.5rem",
      }}>
        {plan.name}
      </p>

      {/* Price */}
      <div style={{ display: "flex", alignItems: "baseline", gap: "0.4rem", marginBottom: "0.6rem" }}>
        <span style={{
          fontFamily: "var(--rf-serif)",
          fontSize: "2.2rem",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1,
        }}>
          {plan.price}
        </span>
        <span style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.9rem",
          fontWeight: 400,
          color: "rgba(255,255,255,0.45)",
        }}>
          {plan.unit}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontFamily: "var(--rf-sans)",
        fontSize: "0.8rem",
        color: "rgba(255,255,255,0.45)",
        lineHeight: 1.5,
        marginBottom: "1.25rem",
      }}>
        {plan.description}
      </p>

      {/* Feature list */}
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.75rem", flexGrow: 1 }}>
        {plan.features.map((feat) => (
          <li key={feat} style={{
            display: "flex",
            gap: "0.5rem",
            fontFamily: "var(--rf-sans)",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.7)",
            padding: "0.3rem 0",
          }}>
            <span style={{ color: "var(--rf-purple)", flexShrink: 0 }}>✓</span>
            {feat}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => {
          trackConversion("pricing_plan_click", "pricing", plan.name, { href: plan.href, featured: !!plan.featured });
          navigate(plan.href);
        }}
        onMouseEnter={() => setBtnHovered(true)}
        onMouseLeave={() => setBtnHovered(false)}
        style={{
          width: "100%",
          padding: "0.7rem",
          borderRadius: "2rem",
          fontFamily: "var(--rf-sans)",
          fontSize: "0.82rem",
          fontWeight: 600,
          cursor: "pointer",
          transition: "background 0.18s, border-color 0.18s",
          background: plan.featured
            ? btnHovered ? "var(--rf-purple-dark)" : "var(--rf-purple)"
            : btnHovered ? "var(--rf-purple)" : "transparent",
          border: `1.5px solid ${
            plan.featured
              ? "var(--rf-purple)"
              : btnHovered
              ? "var(--rf-purple)"
              : "rgba(255,255,255,0.2)"
          }`,
          color: "#FFFFFF",
        }}
      >
        {plan.cta}
      </button>
    </div>
  );
};

// ── SignalsPricing ────────────────────────────────────────────────
const SignalsPricing = () => (
  <section
    style={{
      background: "var(--rf-dark)",
      padding: "5rem 2rem",
      textAlign: "center",
    }}
  >
    {/* Top copy */}
    <h2 style={{
      fontFamily: "var(--rf-serif)",
      fontStyle: "italic",
      fontSize: "2rem",
      fontWeight: 700,
      color: "#FFFFFF",
      marginBottom: "0.5rem",
      lineHeight: 1.25,
    }}>
      Read it daily. Until the truth lands.
    </h2>

    <p style={{
      fontFamily: "var(--rf-sans)",
      fontSize: "0.9rem",
      color: "rgba(255,255,255,0.55)",
      marginBottom: "3rem",
      maxWidth: 480,
      margin: "0 auto 3rem",
      lineHeight: 1.6,
    }}>
      Free signals every week. A safety check costs R99 when you need one —
      no subscription, no monthly fees, no pressure.
    </p>

    {/* Plan cards */}
    <div style={{
      display: "flex",
      justifyContent: "center",
      gap: "1.5rem",
      flexWrap: "wrap",
      maxWidth: 900,
      margin: "0 auto 2rem",
    }}>
      {PLANS.map((plan) => (
        <PlanCard key={plan.name} plan={plan} />
      ))}
    </div>

    {/* Brand line */}
    <p style={{
      fontFamily: "var(--rf-sans)",
      fontSize: "0.85rem",
      fontWeight: 700,
      color: "rgba(255,255,255,0.3)",
      letterSpacing: "0.05em",
      marginTop: "1rem",
    }}>
      Before you trust, RedFlaq first.
    </p>
  </section>
);

export default SignalsPricing;
