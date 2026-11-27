import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Image, Mic } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AppShell from "@/components/shell/AppShell";

const INTENTS = [
  { id: "pay_seller", label: "Pay seller", icon: "💸" },
  { id: "accept_payment", label: "Accept payment", icon: "🏷️" },
  { id: "rent", label: "Rent", icon: "🏠" },
  { id: "hire", label: "Hire", icon: "🤝" },
  { id: "meet", label: "Meet", icon: "👤" },
  { id: "job_offer", label: "Job offer", icon: "💼" },
];

const SAMPLES = [
  {
    label: "Marketplace sale",
    text: "Selling iPhone 14 for R8500. Buyer says they'll send EFT and collect tomorrow. They're asking for my banking details.",
  },
  {
    label: "Rental deposit",
    text: "Landlord wants 3 months deposit cash before showing the property. Says he has 20 other applicants.",
  },
  {
    label: "Job offer",
    text: "Company offering R35,000/month work-from-home job. Need to pay R2,500 for a laptop and training materials first.",
  },
  {
    label: "Payment screenshot",
    text: "Buyer sent a screenshot of a POP but the money hasn't reflected in my account yet. They're rushing me to release the goods.",
  },
  {
    label: "Romance scam",
    text: "Met someone online 3 weeks ago. Very romantic and attentive. Now asking me to receive money into my account for them.",
  },
];

export default function CheckPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = text.trim().length > 10;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    // Navigate to analysis with the submitted text and intent
    navigate("/check/analyzing", {
      state: { text: text.trim(), intent, source: "composer" },
    });
  }

  return (
    <AppShell>
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--rf2-ink)",
        color: "var(--rf2-ivory)",
        fontFamily: "var(--rf2-body)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Main content */}
      <div
        style={{
          flex: 1,
          maxWidth: 680,
          width: "100%",
          margin: "0 auto",
          padding: "2rem max(16px, env(safe-area-inset-left, 0px))",
          display: "flex",
          flexDirection: "column",
          gap: "2rem",
        }}
      >
        {/* Heading */}
        <div>
          <h1
            style={{
              fontFamily: "var(--rf2-display)",
              fontSize: "clamp(26px, 5vw, 36px)",
              fontWeight: 700,
              color: "var(--rf2-ivory)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em",
              marginBottom: "0.5rem",
              textWrap: "balance",
            }}
          >
            Describe what you're checking
          </h1>
          <p
            style={{
              fontSize: 15,
              color: "var(--rf2-muted)",
              lineHeight: 1.6,
            }}
          >
            Paste a message, describe an offer, or explain a situation. The more
            detail you share, the more useful the assessment.
          </p>
        </div>

        {/* Intent picker */}
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rf2-muted-2)",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            What are you about to do?
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 8,
            }}
          >
            {INTENTS.map((it) => (
              <button
                key={it.id}
                onClick={() => setIntent(intent === it.id ? null : it.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  padding: "12px 8px",
                  borderRadius: 8,
                  border: `1px solid ${intent === it.id ? "var(--rf2-coral)" : "var(--rf2-line-2)"}`,
                  background:
                    intent === it.id
                      ? "rgba(224,82,91,0.12)"
                      : "var(--rf2-ink-2)",
                  color:
                    intent === it.id ? "var(--rf2-coral)" : "var(--rf2-ivory-2)",
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  fontFamily: "var(--rf2-body)",
                }}
                aria-pressed={intent === it.id}
              >
                <span style={{ fontSize: 20 }}>{it.icon}</span>
                <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.02em" }}>
                  {it.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Composer */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div
            style={{
              background: "var(--rf2-ink-3)",
              border: "1px solid var(--rf2-line-2)",
              borderRadius: 10,
              overflow: "hidden",
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste a WhatsApp message, Facebook Marketplace listing, email, or describe a situation you want to check…"
              rows={8}
              maxLength={4000}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                resize: "none",
                padding: "16px",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--rf2-ivory)",
                fontFamily: "var(--rf2-body)",
              }}
              aria-label="Describe what you want to check"
            />
            {/* Toolbar */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 14px",
                borderTop: "1px solid var(--rf2-line)",
              }}
            >
              <button
                type="button"
                title="Screenshot analysis — coming soon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--rf2-line-2)",
                  background: "none",
                  color: "var(--rf2-muted)",
                  cursor: "not-allowed",
                  opacity: 0.5,
                  fontSize: 12,
                  fontFamily: "var(--rf2-body)",
                }}
                aria-label="Screenshot analysis — not yet available"
                disabled
              >
                <Image size={13} />
                Screenshot
              </button>
              <button
                type="button"
                title="Voice note analysis — coming soon"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: "1px solid var(--rf2-line-2)",
                  background: "none",
                  color: "var(--rf2-muted)",
                  cursor: "not-allowed",
                  opacity: 0.5,
                  fontSize: 12,
                  fontFamily: "var(--rf2-body)",
                }}
                aria-label="Voice note analysis — not yet available"
                disabled
              >
                <Mic size={13} />
                Voice
              </button>
              <span
                style={{
                  marginLeft: "auto",
                  fontSize: 11,
                  color: "var(--rf2-muted-2)",
                }}
              >
                {text.length}/4000
              </span>
            </div>
          </div>

          {/* Privacy line */}
          <p
            style={{
              fontSize: 12,
              color: "var(--rf2-muted-2)",
              lineHeight: 1.5,
              textAlign: "center",
            }}
          >
            No account needed. Nothing is saved unless you choose to save it.
            {user && " Your check history is saved to your account."}
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmit || isSubmitting}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              width: "100%",
              padding: "16px",
              borderRadius: 10,
              border: "none",
              background: canSubmit ? "var(--rf2-coral)" : "var(--rf2-ink-3)",
              color: canSubmit ? "#fff" : "var(--rf2-muted)",
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "var(--rf2-body)",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background 0.15s ease",
              letterSpacing: "0.01em",
            }}
            aria-label="Check It"
          >
            {isSubmitting ? "Checking…" : "Check It"}
            {!isSubmitting && <ArrowRight size={16} />}
          </button>
        </form>

        {/* Sample inputs */}
        <div>
          <p
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "var(--rf2-muted-2)",
              fontWeight: 600,
              marginBottom: "0.75rem",
            }}
          >
            Try an example
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {SAMPLES.map((s) => (
              <button
                key={s.label}
                onClick={() => setText(s.text)}
                style={{
                  padding: "5px 12px",
                  borderRadius: 20,
                  border: "1px solid var(--rf2-line-2)",
                  background: "none",
                  color: "var(--rf2-muted)",
                  fontSize: 12,
                  fontFamily: "var(--rf2-body)",
                  cursor: "pointer",
                  transition: "border-color 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf2-coral)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--rf2-line-2)")
                }
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AppShell>
  );
}
