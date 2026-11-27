import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Pause, Info, ChevronRight } from "lucide-react";
import { useAnalyseTrust, type EvidenceCard, type EvidenceCardVerdict } from "@/hooks/useAnalyseTrust";
import AppShell from "@/components/shell/AppShell";

// ─────────────────────────── Design tokens ───────────────────────────
const STOP_COLOR = "#E0525B";
const STOP_BG = "rgba(224,82,91,0.10)";
const PAUSE_COLOR = "#D97706";
const PAUSE_BG = "rgba(217,119,6,0.10)";
const CARE_COLOR = "#3FA394";
const CARE_BG = "rgba(63,163,148,0.10)";
const SEVERITY_COLORS = { high: "#E0525B", medium: "#D97706", low: "#9AA6AD" };

function verdictConfig(v: EvidenceCardVerdict) {
  if (v === "STOP") return { color: STOP_COLOR, bg: STOP_BG, label: "STOP", icon: AlertTriangle };
  if (v === "PAUSE") return { color: PAUSE_COLOR, bg: PAUSE_BG, label: "PAUSE", icon: Pause };
  return { color: CARE_COLOR, bg: CARE_BG, label: "PROCEED WITH CARE", icon: Info };
}

// ─────────────────────────── Sub-components ───────────────────────────

function VerdictBanner({ card }: { card: EvidenceCard }) {
  const cfg = verdictConfig(card.verdict);
  const Icon = cfg.icon;
  return (
    <div
      style={{
        background: cfg.bg,
        border: `1.5px solid ${cfg.color}`,
        borderRadius: 12,
        padding: "1.25rem 1.25rem",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Icon size={22} color={cfg.color} aria-hidden />
        <span
          style={{
            fontFamily: "var(--rf2-body)",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: cfg.color,
            textTransform: "uppercase",
          }}
        >
          {cfg.label}
        </span>
      </div>
      <p
        style={{
          fontFamily: "var(--rf2-display)",
          fontSize: "clamp(17px, 4vw, 21px)",
          fontWeight: 700,
          color: "var(--rf2-ivory)",
          lineHeight: 1.3,
          letterSpacing: "-0.01em",
          margin: 0,
        }}
      >
        {card.headline}
      </p>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        fontSize: 11,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        fontWeight: 700,
        color: "var(--rf2-muted-2)",
        fontFamily: "var(--rf2-body)",
        marginBottom: "0.6rem",
      }}
    >
      {children}
    </p>
  );
}

function PaperCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div
      style={{
        background: "var(--rf2-ink-2)",
        border: "1px solid var(--rf2-line-2)",
        borderRadius: 10,
        padding: "1rem 1.1rem",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// Section 1: Patterns detected
function PatternsSection({ card }: { card: EvidenceCard }) {
  if (!card.patterns_detected.length) return null;
  return (
    <div>
      <SectionHeading>Patterns found</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {card.patterns_detected.map((p, i) => (
          <PaperCard key={i}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: SEVERITY_COLORS[p.severity],
                  flexShrink: 0,
                  marginTop: 4,
                }}
              />
              <span
                style={{
                  fontFamily: "var(--rf2-body)",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "var(--rf2-ivory)",
                }}
              >
                {p.name}
              </span>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: SEVERITY_COLORS[p.severity],
                  flexShrink: 0,
                }}
              >
                {p.severity}
              </span>
            </div>
            <p
              style={{
                fontSize: 13,
                lineHeight: 1.55,
                color: "var(--rf2-muted)",
                fontFamily: "var(--rf2-body)",
                margin: 0,
                paddingLeft: 16,
              }}
            >
              {p.explanation}
            </p>
          </PaperCard>
        ))}
      </div>
    </div>
  );
}

// Section 2: Signals
function SignalsSection({ card }: { card: EvidenceCard }) {
  if (!card.signals.length) return null;
  return (
    <div>
      <SectionHeading>Signals observed</SectionHeading>
      <PaperCard>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {card.signals.map((s, i) => (
            <div key={i}>
              <span
                style={{
                  fontFamily: "var(--rf2-body)",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                  color: "var(--rf2-muted-2)",
                }}
              >
                {s.category}
              </span>
              <p
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "var(--rf2-ivory-2)",
                  fontFamily: "var(--rf2-body)",
                  margin: "2px 0 0",
                }}
              >
                {s.observation}
              </p>
              {i < card.signals.length - 1 && (
                <div
                  style={{
                    height: 1,
                    background: "var(--rf2-line)",
                    marginTop: 10,
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </PaperCard>
    </div>
  );
}

// Section 3: Context note
function ContextSection({ card }: { card: EvidenceCard }) {
  return (
    <div>
      <SectionHeading>What this means</SectionHeading>
      <PaperCard>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: "var(--rf2-ivory-2)",
            fontFamily: "var(--rf2-body)",
            margin: 0,
          }}
        >
          {card.context_note}
        </p>
      </PaperCard>
    </div>
  );
}

// Section 4: Questions to ask
function QuestionsSection({ card }: { card: EvidenceCard }) {
  if (!card.questions_to_ask.length) return null;
  return (
    <div>
      <SectionHeading>Questions to ask first</SectionHeading>
      <PaperCard>
        <ol style={{ margin: 0, padding: "0 0 0 1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
          {card.questions_to_ask.map((q, i) => (
            <li
              key={i}
              style={{
                fontSize: 13.5,
                lineHeight: 1.55,
                color: "var(--rf2-ivory-2)",
                fontFamily: "var(--rf2-body)",
              }}
            >
              {q}
            </li>
          ))}
        </ol>
      </PaperCard>
    </div>
  );
}

// Section 5: Next steps
function NextStepsSection({ card }: { card: EvidenceCard }) {
  if (!card.next_steps.length) return null;
  return (
    <div>
      <SectionHeading>What to do next</SectionHeading>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {card.next_steps.map((s, i) => (
          <PaperCard
            key={i}
            style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
          >
            <ChevronRight
              size={15}
              color="var(--rf2-coral)"
              style={{ flexShrink: 0, marginTop: 2 }}
              aria-hidden
            />
            <div>
              <p
                style={{
                  fontSize: 13.5,
                  color: "var(--rf2-ivory)",
                  fontFamily: "var(--rf2-body)",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                {s.action}
              </p>
              {s.resource && (
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--rf2-teal)",
                    fontFamily: "var(--rf2-body)",
                    margin: "2px 0 0",
                    fontWeight: 600,
                  }}
                >
                  {s.resource}
                </p>
              )}
            </div>
          </PaperCard>
        ))}
      </div>
    </div>
  );
}

// Limitations footer
function LimitationsFooter({ text }: { text: string }) {
  return (
    <p
      style={{
        fontSize: 11,
        lineHeight: 1.6,
        color: "var(--rf2-muted-2)",
        fontFamily: "var(--rf2-body)",
        borderTop: "1px solid var(--rf2-line)",
        paddingTop: "1rem",
        margin: 0,
      }}
    >
      {text}
    </p>
  );
}

// Loading skeleton
function LoadingSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {[80, 48, 120, 96, 80].map((h, i) => (
        <div
          key={i}
          style={{
            height: h,
            borderRadius: 10,
            background: "var(--rf2-ink-2)",
            animation: "pulse 1.5s ease-in-out infinite",
            opacity: 0.6,
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────── Main page ───────────────────────────

type LocationState = {
  text?: string;
  intent?: string | null;
  source?: string;
};

export default function EvidenceCardPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { text, intent } = (location.state as LocationState) ?? {};
  const { state, analyse } = useAnalyseTrust();

  useEffect(() => {
    if (!text) {
      navigate("/check", { replace: true });
      return;
    }
    analyse(text, intent);
  }, []); // run once on mount

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/check");
    }
  };

  return (
    <AppShell>
      <div
        style={{
          minHeight: "100dvh",
          background: "var(--rf2-ink)",
          color: "var(--rf2-ivory)",
          fontFamily: "var(--rf2-body)",
        }}
      >
        <div
          style={{
            maxWidth: 680,
            width: "100%",
            margin: "0 auto",
            padding: "1.5rem max(16px, env(safe-area-inset-left, 0px))",
            display: "flex",
            flexDirection: "column",
            gap: "1.75rem",
          }}
        >
          {/* Back nav */}
          <button
            onClick={handleBack}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: "none",
              border: "none",
              color: "var(--rf2-muted)",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "var(--rf2-body)",
              padding: 0,
              alignSelf: "flex-start",
            }}
          >
            <ArrowLeft size={15} aria-hidden />
            Back
          </button>

          {/* Page heading */}
          <div>
            <h1
              style={{
                fontFamily: "var(--rf2-display)",
                fontSize: "clamp(20px, 4vw, 26px)",
                fontWeight: 700,
                color: "var(--rf2-ivory)",
                letterSpacing: "-0.02em",
                lineHeight: 1.2,
                margin: 0,
              }}
            >
              Evidence Card
            </h1>
            {text && (
              <p
                style={{
                  fontSize: 12,
                  color: "var(--rf2-muted-2)",
                  marginTop: 4,
                  fontFamily: "var(--rf2-body)",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                Checking: {text}
              </p>
            )}
          </div>

          {/* Body */}
          {state.status === "loading" && <LoadingSkeleton />}

          {state.status === "error" && (
            <div
              style={{
                background: "rgba(224,82,91,0.08)",
                border: "1px solid rgba(224,82,91,0.3)",
                borderRadius: 10,
                padding: "1.25rem",
              }}
            >
              <p
                style={{
                  color: "var(--rf2-coral)",
                  fontFamily: "var(--rf2-body)",
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {state.message}
              </p>
              <button
                onClick={() => text && analyse(text, intent)}
                style={{
                  marginTop: 12,
                  padding: "8px 16px",
                  borderRadius: 7,
                  border: "1px solid var(--rf2-coral)",
                  background: "none",
                  color: "var(--rf2-coral)",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "var(--rf2-body)",
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          )}

          {state.status === "done" && (
            <>
              <VerdictBanner card={state.card} />
              <PatternsSection card={state.card} />
              <SignalsSection card={state.card} />
              <ContextSection card={state.card} />
              <QuestionsSection card={state.card} />
              <NextStepsSection card={state.card} />
              <LimitationsFooter text={state.card.limitations} />
            </>
          )}

          {/* Check again CTA */}
          {state.status === "done" && (
            <button
              onClick={() => navigate("/check")}
              style={{
                padding: "14px",
                borderRadius: 10,
                border: "1px solid var(--rf2-line-2)",
                background: "none",
                color: "var(--rf2-muted)",
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "var(--rf2-body)",
                cursor: "pointer",
              }}
            >
              Check something else
            </button>
          )}
        </div>
      </div>

      {/* Pulse animation for skeleton */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </AppShell>
  );
}
