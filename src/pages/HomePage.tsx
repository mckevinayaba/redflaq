import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Check, X, ArrowRight, Shield, Eye, FileText } from "lucide-react";
import AppShell from "@/components/shell/AppShell";

const TICKER_ITEMS = [
  "Anger is not loss of control — it is a control mechanism.",
  "He didn't show you who he was. He showed you what he thought you could handle.",
  "Month 12 is when he stops pretending.",
  "Kindness in public. Cruelty in private. That's the pattern.",
  "You didn't miss the signs. You were trained not to trust them.",
  "Before you trust, RedFlaq first.",
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Describe the situation",
    body: "Paste a message, describe an offer, or explain what's happening. No account required.",
    color: "var(--rf2-coral)",
  },
  {
    step: "02",
    title: "AI analyses the signals",
    body: "RedFlaq's trust engine scans for SA scam patterns, manipulation tactics, and warning signals.",
    color: "var(--rf2-teal)",
  },
  {
    step: "03",
    title: "Get an Evidence Card",
    body: "Clear verdict (STOP / PAUSE / PROCEED WITH CARE) with the specific patterns found — not a score.",
    color: "var(--rf2-ivory)",
  },
];

const USE_CASES = [
  { label: "Marketplace sale", icon: "💸", detail: "Fake buyers, false POP, overpayment scams" },
  { label: "Rental deposit", icon: "🏠", detail: "Phantom properties, upfront demand before viewings" },
  { label: "Job offer", icon: "💼", detail: "Upfront fees, too-good work-from-home offers" },
  { label: "Romance scam", icon: "👤", detail: "Online relationships that pivot to money requests" },
  { label: "Payment received", icon: "🏷️", detail: "Fake POP, rushing release of goods" },
  { label: "Hire someone", icon: "🤝", detail: "Background signals before you trust with access" },
];

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div
      style={{
        width: "100%",
        background: "var(--rf2-ink-2)",
        borderTop: "1px solid var(--rf2-line)",
        borderBottom: "1px solid var(--rf2-line)",
        padding: "8px 0",
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          animation: "ticker 40s linear infinite",
        }}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "var(--rf2-muted-2)",
              padding: "0 28px",
              fontStyle: "italic",
            }}
          >
            {item}
            <span
              style={{
                marginLeft: 28,
                color: "rgba(224,82,91,0.5)",
                fontSize: 7,
                fontStyle: "normal",
              }}
            >
              ◆
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) sessionStorage.setItem("referrer_id", ref);
    if (params.get("confirmed") === "true") {
      setShowConfirmedBanner(true);
      const newParams = new URLSearchParams(params);
      newParams.delete("confirmed");
      setSearchParams(newParams, { replace: true });
      const t = setTimeout(() => setShowConfirmedBanner(false), 10000);
      return () => clearTimeout(t);
    }
  }, []);

  return (
    <AppShell>
      {/* Email confirmed banner */}
      {showConfirmedBanner && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            background: "var(--rf2-teal)",
            padding: "12px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
          }}
        >
          <Check size={16} style={{ color: "#fff", flexShrink: 0 }} />
          <span
            style={{
              color: "#fff",
              fontFamily: "var(--rf2-body)",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Your email is confirmed. Sign in to start your first check.
          </span>
          <Link
            to="/signup?mode=signin"
            style={{
              background: "#fff",
              color: "var(--rf2-teal)",
              padding: "5px 14px",
              borderRadius: 5,
              fontSize: 12,
              fontWeight: 700,
              textDecoration: "none",
              fontFamily: "var(--rf2-body)",
              flexShrink: 0,
            }}
          >
            Sign In
          </Link>
          <button
            onClick={() => setShowConfirmedBanner(false)}
            style={{
              background: "none",
              border: "none",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              padding: 4,
              flexShrink: 0,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div
        style={{
          background: "var(--rf2-ink)",
          color: "var(--rf2-ivory)",
          fontFamily: "var(--rf2-body)",
          overflowX: "hidden",
        }}
      >
        {/* ── Hero ── */}
        <section
          style={{
            minHeight: "calc(100svh - 72px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "4rem max(20px, env(safe-area-inset-left, 0px))",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Background coral glow */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 500,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(224,82,91,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <span
            style={{
              display: "inline-block",
              fontFamily: "var(--rf2-body)",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "var(--rf2-coral)",
              marginBottom: 20,
              position: "relative",
            }}
          >
            ⚑ RedFlaq · South Africa
          </span>

          <h1
            style={{
              fontFamily: "var(--rf2-display)",
              fontSize: "clamp(32px, 7vw, 72px)",
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              maxWidth: 760,
              marginBottom: 20,
              textWrap: "balance",
              position: "relative",
            }}
          >
            Before you trust,{" "}
            <em style={{ color: "var(--rf2-coral)", fontStyle: "italic" }}>
              RedFlaq first.
            </em>
          </h1>

          <p
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: "clamp(15px, 2.2vw, 18px)",
              color: "var(--rf2-muted)",
              lineHeight: 1.7,
              maxWidth: 500,
              marginBottom: 36,
              position: "relative",
            }}
          >
            AI-powered trust analysis for South Africans — before you pay, rent,
            hire, meet, or accept. No account needed.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
              position: "relative",
            }}
          >
            <button
              onClick={() => navigate("/check")}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "16px 32px",
                borderRadius: 10,
                border: "none",
                background: "var(--rf2-coral)",
                color: "#fff",
                fontSize: 15,
                fontWeight: 700,
                fontFamily: "var(--rf2-body)",
                cursor: "pointer",
                letterSpacing: "0.01em",
              }}
            >
              Check It Now — Free
              <ArrowRight size={16} />
            </button>
            <button
              onClick={() => navigate("/signals")}
              style={{
                padding: "16px 24px",
                borderRadius: 10,
                border: "1px solid var(--rf2-line-2)",
                background: "none",
                color: "var(--rf2-muted)",
                fontSize: 15,
                fontWeight: 600,
                fontFamily: "var(--rf2-body)",
                cursor: "pointer",
              }}
            >
              Read Signals
            </button>
          </div>

          <p
            style={{
              marginTop: 16,
              fontSize: 11,
              color: "var(--rf2-muted-2)",
              fontFamily: "var(--rf2-body)",
              position: "relative",
            }}
          >
            Free · No account required · Nothing saved without your consent
          </p>
        </section>

        {/* ── Ticker ── */}
        <Ticker />

        {/* ── Use Cases ── */}
        <section
          style={{
            padding: "5rem max(20px, env(safe-area-inset-left, 0px))",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--rf2-muted-2)",
              marginBottom: 12,
            }}
          >
            What you can check
          </p>
          <h2
            style={{
              textAlign: "center",
              fontFamily: "var(--rf2-display)",
              fontSize: "clamp(22px, 4vw, 36px)",
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              letterSpacing: "-0.02em",
              marginBottom: 36,
              textWrap: "balance",
            }}
          >
            Any situation where you're about to trust a stranger.
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: 10,
            }}
          >
            {USE_CASES.map((uc) => (
              <button
                key={uc.label}
                onClick={() => navigate("/check")}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 6,
                  padding: "1rem 1.1rem",
                  borderRadius: 10,
                  border: "1px solid var(--rf2-line-2)",
                  background: "var(--rf2-ink-2)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.1s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf2-coral)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf2-line-2)")
                }
              >
                <span style={{ fontSize: 22 }}>{uc.icon}</span>
                <span
                  style={{
                    fontFamily: "var(--rf2-body)",
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "var(--rf2-ivory)",
                  }}
                >
                  {uc.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--rf2-body)",
                    fontSize: 12,
                    color: "var(--rf2-muted)",
                    lineHeight: 1.5,
                  }}
                >
                  {uc.detail}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section
          style={{
            padding: "5rem max(20px, env(safe-area-inset-left, 0px))",
            background: "var(--rf2-ink-2)",
            borderTop: "1px solid var(--rf2-line)",
            borderBottom: "1px solid var(--rf2-line)",
          }}
        >
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <p
              style={{
                textAlign: "center",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--rf2-muted-2)",
                marginBottom: 12,
              }}
            >
              How it works
            </p>
            <h2
              style={{
                textAlign: "center",
                fontFamily: "var(--rf2-display)",
                fontSize: "clamp(22px, 4vw, 36px)",
                fontWeight: 700,
                color: "var(--rf2-ivory)",
                letterSpacing: "-0.02em",
                marginBottom: 48,
                textWrap: "balance",
              }}
            >
              Three steps. Seconds, not days.
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 24,
              }}
            >
              {HOW_IT_WORKS.map((step) => (
                <div
                  key={step.step}
                  style={{
                    padding: "1.5rem",
                    borderRadius: 12,
                    border: "1px solid var(--rf2-line-2)",
                    background: "var(--rf2-ink)",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--rf2-display)",
                      fontSize: 36,
                      fontWeight: 700,
                      color: step.color,
                      opacity: 0.3,
                      display: "block",
                      lineHeight: 1,
                      marginBottom: 12,
                    }}
                  >
                    {step.step}
                  </span>
                  <h3
                    style={{
                      fontFamily: "var(--rf2-body)",
                      fontSize: 15,
                      fontWeight: 700,
                      color: "var(--rf2-ivory)",
                      marginBottom: 8,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--rf2-body)",
                      fontSize: 13,
                      color: "var(--rf2-muted)",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Safe hub callout ── */}
        <section
          style={{
            padding: "5rem max(20px, env(safe-area-inset-left, 0px))",
            maxWidth: 900,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                icon: <Shield size={22} />,
                title: "Safety Journal",
                body: "Document incidents privately. Encrypted, yours only.",
                path: "/safety-tips",
                color: "var(--rf2-teal)",
              },
              {
                icon: <Eye size={22} />,
                title: "Daily Signals",
                body: "Behavioral truth for South Africans. Scroll to read.",
                path: "/signals",
                color: "var(--rf2-coral)",
              },
              {
                icon: <FileText size={22} />,
                title: "Affidavit Builder",
                body: "Build a legally structured statement step by step.",
                path: "/safety-tips",
                color: "var(--rf2-muted)",
              },
            ].map((card) => (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "1.25rem",
                  borderRadius: 10,
                  border: "1px solid var(--rf2-line-2)",
                  background: "var(--rf2-ink-2)",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "border-color 0.1s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = card.color)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf2-line-2)")
                }
              >
                <span style={{ color: card.color }}>{card.icon}</span>
                <div>
                  <p
                    style={{
                      fontFamily: "var(--rf2-body)",
                      fontSize: 14,
                      fontWeight: 700,
                      color: "var(--rf2-ivory)",
                      margin: 0,
                      marginBottom: 4,
                    }}
                  >
                    {card.title}
                  </p>
                  <p
                    style={{
                      fontFamily: "var(--rf2-body)",
                      fontSize: 12.5,
                      color: "var(--rf2-muted)",
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {card.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ── Bottom CTA ── */}
        <section
          style={{
            padding: "5rem max(20px, env(safe-area-inset-left, 0px))",
            background: "var(--rf2-ink-2)",
            borderTop: "1px solid var(--rf2-line)",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--rf2-display)",
              fontSize: "clamp(24px, 5vw, 44px)",
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              letterSpacing: "-0.02em",
              marginBottom: 16,
              textWrap: "balance",
            }}
          >
            Don't trust the feeling.{" "}
            <em style={{ color: "var(--rf2-coral)", fontStyle: "italic" }}>
              Check it.
            </em>
          </h2>
          <p
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 15,
              color: "var(--rf2-muted)",
              lineHeight: 1.7,
              maxWidth: 440,
              margin: "0 auto 32px",
            }}
          >
            Every year, South Africans lose billions to marketplace fraud,
            rental scams, and job fraud. RedFlaq gives you the analysis before you
            pay the price.
          </p>
          <button
            onClick={() => navigate("/check")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "16px 36px",
              borderRadius: 10,
              border: "none",
              background: "var(--rf2-coral)",
              color: "#fff",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "var(--rf2-body)",
              cursor: "pointer",
            }}
          >
            Check It Now — Free
            <ArrowRight size={16} />
          </button>
        </section>

        {/* ── Footer ── */}
        <footer
          style={{
            padding: "2rem max(20px, env(safe-area-inset-left, 0px))",
            borderTop: "1px solid var(--rf2-line)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            paddingBottom: "calc(2rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <span
            style={{
              fontFamily: "var(--rf2-display)",
              fontSize: 15,
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              display: "flex",
              alignItems: "center",
              gap: 7,
            }}
          >
            <span style={{ color: "var(--rf2-coral)" }}>⚑</span> RedFlaq
          </span>
          <div
            style={{
              display: "flex",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Privacy", path: "/privacy" },
              { label: "Terms", path: "/terms" },
              { label: "About", path: "/about" },
              { label: "Partners", path: "/partners" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.path}
                style={{
                  fontFamily: "var(--rf2-body)",
                  fontSize: 12,
                  color: "var(--rf2-muted-2)",
                  textDecoration: "none",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <span
            style={{
              fontFamily: "var(--rf2-body)",
              fontSize: 11,
              color: "var(--rf2-muted-2)",
            }}
          >
            © 2026 RedFlaq. Before You Trust, RedFlaq First.
          </span>
        </footer>
      </div>

      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </AppShell>
  );
}
