import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Image, Mic, Settings2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { usePrivacyPrefs } from "@/hooks/usePrivacyPrefs";
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

async function resizeImageToBase64(file: File, maxDim = 1200): Promise<{ base64: string; mimeType: string }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let w = img.width;
      let h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h / w) * maxDim); w = maxDim; }
        else { w = Math.round((w / h) * maxDim); h = maxDim; }
      }
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas unavailable")); return; }
      ctx.drawImage(img, 0, 0, w, h);
      const dataUrl = canvas.toDataURL("image/jpeg", 0.82);
      const base64 = dataUrl.split(",")[1];
      resolve({ base64, mimeType: "image/jpeg" });
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("Image load failed")); };
    img.src = url;
  });
}

export default function CheckPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { prefs, setPrefs } = usePrivacyPrefs();
  const [text, setText] = useState("");
  const [intent, setIntent] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPrivacyPanel, setShowPrivacyPanel] = useState(false);
  const [image, setImage] = useState<{ base64: string; mimeType: string; previewUrl: string } | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const canSubmit = text.trim().length > 10 || !!image;

  async function handleImageFile(file: File) {
    setImageError(null);
    if (!file.type.startsWith("image/")) {
      setImageError("Please select an image file.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setImageError("Image must be under 10 MB.");
      return;
    }
    try {
      const { base64, mimeType } = await resizeImageToBase64(file);
      const previewUrl = `data:${mimeType};base64,${base64}`;
      setImage({ base64, mimeType, previewUrl });
    } catch {
      setImageError("Could not load image. Try another file.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    navigate("/check/analyzing", {
      state: {
        text: text.trim(),
        intent,
        source: "composer",
        saveCheck: prefs.saveChecks && !!user,
        image: image ? { base64: image.base64, mimeType: image.mimeType } : null,
      },
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

        {/* Image preview */}
        {image && (
          <div style={{ position: "relative", display: "inline-flex", alignSelf: "flex-start" }}>
            <img
              src={image.previewUrl}
              alt="Screenshot to analyse"
              style={{
                maxWidth: "min(100%, 320px)",
                maxHeight: 200,
                borderRadius: 8,
                border: "1px solid var(--rf2-teal)",
                objectFit: "cover",
              }}
            />
            <button
              type="button"
              onClick={() => setImage(null)}
              aria-label="Remove screenshot"
              style={{
                position: "absolute",
                top: 6,
                right: 6,
                width: 22,
                height: 22,
                borderRadius: "50%",
                background: "rgba(11,19,24,0.85)",
                border: "1px solid rgba(247,245,240,0.2)",
                color: "var(--rf2-muted)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 12,
              }}
            >
              ×
            </button>
          </div>
        )}
        {imageError && (
          <p style={{ fontSize: 12, color: "var(--rf2-coral)", margin: 0 }}>{imageError}</p>
        )}

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
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                aria-hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                title={image ? "Replace screenshot" : "Attach a screenshot to analyse"}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "5px 10px",
                  borderRadius: 6,
                  border: `1px solid ${image ? "var(--rf2-teal)" : "var(--rf2-line-2)"}`,
                  background: image ? "rgba(63,163,148,0.1)" : "none",
                  color: image ? "var(--rf2-teal)" : "var(--rf2-muted)",
                  cursor: "pointer",
                  fontSize: 12,
                  fontFamily: "var(--rf2-body)",
                }}
                aria-label="Attach screenshot for analysis"
              >
                <Image size={13} />
                {image ? "Screenshot added" : "Screenshot"}
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

          {/* Privacy line + toggles */}
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "var(--rf2-muted-2)",
                  lineHeight: 1.5,
                  textAlign: "center",
                  margin: 0,
                }}
              >
                {prefs.saveChecks && user
                  ? "This check will be saved to your account history."
                  : "No account needed. Nothing is saved unless you choose to."}
              </p>
              <button
                type="button"
                onClick={() => setShowPrivacyPanel((v) => !v)}
                title="Privacy settings"
                aria-expanded={showPrivacyPanel}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--rf2-muted-2)",
                  display: "flex",
                  alignItems: "center",
                  flexShrink: 0,
                  padding: 2,
                }}
              >
                <Settings2 size={13} aria-hidden />
              </button>
            </div>

            {showPrivacyPanel && (
              <div
                style={{
                  marginTop: 10,
                  background: "var(--rf2-ink-2)",
                  border: "1px solid var(--rf2-line-2)",
                  borderRadius: 8,
                  padding: "12px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                {[
                  {
                    key: "saveChecks" as const,
                    label: "Save checks to history",
                    note: user ? "Requires sign-in (you are signed in)" : "Requires sign-in",
                    disabled: !user,
                  },
                  {
                    key: "discreetMode" as const,
                    label: "Discreet mode",
                    note: "Hides check text from browser title bar",
                    disabled: false,
                  },
                  {
                    key: "lowDataMode" as const,
                    label: "Low-data mode",
                    note: "Skips non-essential network calls",
                    disabled: false,
                  },
                ].map((item) => (
                  <label
                    key={item.key}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                      cursor: item.disabled ? "not-allowed" : "pointer",
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={prefs[item.key]}
                      disabled={item.disabled}
                      onChange={(e) => setPrefs({ [item.key]: e.target.checked })}
                      style={{ marginTop: 2, accentColor: "var(--rf2-coral)", flexShrink: 0 }}
                    />
                    <div>
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 600,
                          color: "var(--rf2-ivory)",
                          fontFamily: "var(--rf2-body)",
                        }}
                      >
                        {item.label}
                      </span>
                      <span
                        style={{
                          fontSize: 11,
                          color: "var(--rf2-muted-2)",
                          fontFamily: "var(--rf2-body)",
                          display: "block",
                        }}
                      >
                        {item.note}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

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
