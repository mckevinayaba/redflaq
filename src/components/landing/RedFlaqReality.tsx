import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ── Primary stats ────────────────────────────────────────────────
const PRIMARY_STATS = [
  {
    number: "Every 4 hours",
    unit: "",
    description:
      "Another woman is killed in South Africa by an intimate partner or family member.",
    source: "Centre for Constitutional Rights · UNODC femicide data",
  },
  {
    number: "5×",
    unit: "the global average",
    description:
      "South Africa's femicide rate compared to the rest of the world. Not higher. Five times higher.",
    source: "Africa Check analysis of South African and UNODC data",
  },
  {
    number: "3,000+",
    unit: "women murdered per year",
    description:
      "That is 9 women every single day. Most of them knew their killers. Most had already seen the signs.",
    source: "National murder statistics — SAPS annual crime report",
  },
];

// ── Secondary stats ──────────────────────────────────────────────
const SECONDARY_STATS = [
  {
    number: "7.3 million",
    label:
      "women in South Africa experienced physical violence · HSRC GBV Prevalence Study 2022",
  },
  {
    number: "3.4 million",
    label:
      "experienced intimate partner violence — the most dangerous person is often already inside the home · HSRC 2022",
  },
  {
    number: "1 in 3",
    label:
      "women in South Africa experienced physical violence · HSRC National GBV Prevalence Study",
  },
  {
    number: "1 in 5",
    label:
      "men admitted to perpetrating physical or sexual violence against a partner · HSRC",
  },
  {
    number: "~3%",
    label:
      "conviction rate for GBV cases in South Africa. The system was not built to protect women · NPA",
  },
  {
    number: "21 Nov 2025",
    label:
      "The South African government officially classified GBVF as a National Disaster under the Disaster Management Act · DCOG / DWYPD",
  },
];

const RedFlaqReality = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ background: "var(--rf-dark)", padding: "5rem 2rem" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        {/* ── Eyebrow ── */}
        <p
          style={{
            fontFamily: "var(--rf-sans)",
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--rf-purple)",
            marginBottom: "0.75rem",
          }}
        >
          The Reality
        </p>

        {/* ── Headline ── */}
        <h2
          style={{
            fontFamily: "var(--rf-serif)",
            fontSize: isMobile ? "1.9rem" : "2.8rem",
            fontWeight: 900,
            lineHeight: 1.2,
            marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ color: "#FFFFFF", display: "block" }}>
            South Africa does not have
          </span>
          <span
            style={{
              color: "var(--rf-purple)",
              fontStyle: "italic",
              display: "block",
            }}
          >
            an awareness problem.
          </span>
          <span
            style={{
              color: "#FFFFFF",
              display: "block",
              fontWeight: 700,
            }}
          >
            It has a denial problem.
          </span>
        </h2>

        {/* ── Sub-paragraph ── */}
        <p
          style={{
            fontFamily: "var(--rf-sans)",
            fontSize: "0.95rem",
            color: "rgba(255,255,255,0.6)",
            lineHeight: 1.75,
            maxWidth: 580,
            marginBottom: "3.5rem",
          }}
        >
          These are not statistics. They are the documented cost of trust given
          without verification. Every number below represents a pattern that
          public records could have flagged earlier.
        </p>

        {/* ── Primary stats — 3 col ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
            gap: isMobile ? "2rem" : "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {PRIMARY_STATS.map((stat) => (
            <div
              key={stat.number}
              style={{
                borderLeft: "3px solid var(--rf-purple)",
                paddingLeft: "1.25rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--rf-serif)",
                  fontSize: "3.5rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1,
                  marginBottom: stat.unit ? "0.3rem" : "0.6rem",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.number}
              </div>
              {stat.unit && (
                <div
                  style={{
                    fontFamily: "var(--rf-sans)",
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "var(--rf-purple)",
                    marginBottom: "0.6rem",
                  }}
                >
                  {stat.unit}
                </div>
              )}
              <p
                style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.82rem",
                  color: "rgba(255,255,255,0.6)",
                  lineHeight: 1.6,
                  marginBottom: "0.5rem",
                }}
              >
                {stat.description}
              </p>
              <p
                style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.68rem",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "0.5rem",
                }}
              >
                {stat.source}
              </p>
            </div>
          ))}
        </div>

        {/* ── Secondary stats — 3 col / 2 col mobile ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(3, 1fr)",
            gap: "1rem",
            marginBottom: "0",
          }}
        >
          {SECONDARY_STATS.map((stat) => (
            <div
              key={stat.number}
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "1rem",
                padding: "1.5rem",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--rf-serif)",
                  fontSize: "2rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  lineHeight: 1,
                }}
              >
                {stat.number}
              </div>
              <p
                style={{
                  fontFamily: "var(--rf-sans)",
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.5,
                  marginTop: "0.4rem",
                }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* ── Bottom callout ── */}
        <div
          style={{
            background: "rgba(124,58,237,0.12)",
            border: "1px solid rgba(124,58,237,0.25)",
            borderRadius: "1rem",
            padding: "2rem",
            marginTop: "3rem",
            textAlign: "center",
          }}
        >
          <h3
            style={{
              fontFamily: "var(--rf-serif)",
              fontStyle: "italic",
              fontSize: "1.4rem",
              color: "#FFFFFF",
              lineHeight: 1.35,
              marginBottom: "0.85rem",
            }}
          >
            Because danger is rarely hidden. It is usually explained away.
          </h3>

          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.7,
              maxWidth: 540,
              margin: "0 auto 1.5rem",
            }}
          >
            RedFlaq was built for the moment before that explanation is made.
            Public records. Under 60 seconds. From R99.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: "1.5rem",
            }}
          >
            {/* Button 1 — Run a Safety Check */}
            <button
              onClick={() => navigate("/search-form")}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "var(--rf-purple)",
                border: "none",
                borderRadius: "2rem",
                padding: "0.8rem 1.6rem",
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
              Run a Safety Check — R99
            </button>

            {/* Button 2 — Create Free Safety Base */}
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "transparent",
                border: "1.5px solid rgba(255,255,255,0.3)",
                borderRadius: "2rem",
                padding: "0.8rem 1.6rem",
                cursor: "pointer",
                transition: "border-color 0.18s, background 0.18s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              Create Free Safety Base
            </button>
          </div>

          {/* Sources */}
          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.25)",
              lineHeight: 1.6,
            }}
          >
            Sources: HSRC GBV Prevalence Study 2022 · UNODC · Africa Check ·
            SAPS Annual Crime Report · DCOG/DWYPD National Disaster
            Classification 2025 · NPA
          </p>
        </div>

      </div>
    </section>
  );
};

export default RedFlaqReality;
