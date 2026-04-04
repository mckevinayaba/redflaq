import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import heroImg from "@/assets/hero-sa-woman.jpg";

const SignalsHero = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleReadSignal = () => {
    const el = document.getElementById("signals-today");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      style={{
        background: "var(--rf-paper)",
        padding: "4.5rem 2rem 3.5rem",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1.1fr 0.9fr",
          gap: "4rem",
          alignItems: "center",
        }}
      >
        {/* ── RIGHT column (image) rendered first on mobile so it appears on top ── */}
        {isMobile && <HeroImage />}

        {/* ── LEFT column ── */}
        <div>
          {/* 1. Eyebrow pill */}
          <div
            style={{
              display: "inline-block",
              background: "var(--rf-purple-light)",
              color: "var(--rf-purple)",
              fontSize: "0.68rem",
              fontFamily: "var(--rf-sans)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              borderRadius: "2rem",
              padding: "0.35rem 0.9rem",
              marginBottom: "1.25rem",
            }}
          >
            South Africa's Safety Platform
          </div>

          {/* 2. H1 headline */}
          <h1
            style={{
              fontFamily: "var(--rf-serif)",
              fontSize: isMobile ? "2rem" : "3rem",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: "0.85rem",
              letterSpacing: "-0.02em",
            }}
          >
            <span style={{ color: "var(--rf-ink)", display: "block" }}>
              South Africa knows about Gender Based Violence &amp; Femicide (GBVF).
            </span>
            <span
              style={{
                color: "var(--rf-purple)",
                fontStyle: "italic",
                display: "block",
              }}
            >
              The question is why you still aren't acting on what you know.
            </span>
          </h1>

          {/* 3. Subheading */}
          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.95rem",
              color: "var(--rf-ink-mid)",
              lineHeight: 1.75,
              maxWidth: 480,
              marginBottom: "1.1rem",
            }}
          >
            Behavioral safety for people who refuse to hand over their lives
            unverified. Read daily. See the pattern.{" "}
            <strong style={{ fontWeight: 600, color: "var(--rf-ink)" }}>
              Act before it becomes evidence.
            </strong>
          </p>

          {/* 4. Brand anchor line */}
          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.82rem",
              fontWeight: 700,
              color: "var(--rf-purple)",
              letterSpacing: "0.04em",
              paddingLeft: "0.7rem",
              borderLeft: "3px solid var(--rf-purple)",
              marginBottom: "1.75rem",
              lineHeight: 1.4,
            }}
          >
            Before you trust, RedFlaq first.
          </p>

          {/* 5. CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              marginBottom: "0.85rem",
            }}
          >
            <button
              onClick={() => navigate("/signup")}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "#FFFFFF",
                background: "var(--rf-purple)",
                border: "none",
                borderRadius: "2.5rem",
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
              Create Free Safety Base
            </button>

            <button
              onClick={handleReadSignal}
              style={{
                fontFamily: "var(--rf-sans)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "var(--rf-ink)",
                background: "transparent",
                border: "1.5px solid var(--rf-ink)",
                borderRadius: "2.5rem",
                padding: "0.8rem 1.6rem",
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
              Read Today's Signal
            </button>
          </div>

          {/* 6. Note text */}
          <p
            style={{
              fontFamily: "var(--rf-sans)",
              fontSize: "0.72rem",
              color: "var(--rf-ink-soft)",
            }}
          >
            Free account. No credit card. Pay only when you run a check (from R99).
          </p>
        </div>

        {/* ── RIGHT column (desktop) ── */}
        {!isMobile && <HeroImage />}
      </div>
    </section>
  );
};

const HeroImage = () => (
  <div style={{ position: "relative" }}>
    {/* Main image */}
    <div
      style={{
        borderRadius: "1.75rem",
        overflow: "hidden",
        height: 500,
      }}
    >
      <img
        src={heroImg}
        alt="South African woman by a warm golden-lit window"
        loading="eager"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </div>

    {/* Floating quote badge */}
    <div
      style={{
        position: "absolute",
        bottom: "1.5rem",
        left: "-1.25rem",
        background: "var(--rf-white)",
        borderRadius: "1rem",
        padding: "1rem 1.2rem",
        maxWidth: 250,
        boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
      }}
    >
      <p
        style={{
          fontFamily: "var(--rf-serif)",
          fontStyle: "italic",
          fontSize: "0.78rem",
          color: "var(--rf-ink)",
          lineHeight: 1.55,
          marginBottom: "0.5rem",
        }}
      >
        "The most dangerous moment is not the threat. It is the explanation you
        gave it before you ran the check."
      </p>
      <p
        style={{
          fontFamily: "var(--rf-sans)",
          fontSize: "0.68rem",
          fontWeight: 600,
          color: "var(--rf-purple)",
          letterSpacing: "0.04em",
        }}
      >
        RedFlaq Safety Signal
      </p>
    </div>
  </div>
);

export default SignalsHero;
