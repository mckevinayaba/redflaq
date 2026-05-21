import { useEffect, useState } from "react";
import { ACCENT, CREAM, CREAM_INK, CREAM_MUTED, mono, serif, syne, primaryButton } from "./screens/mobileTokens";

const KEY = "rf_onboarded_v3";

const CARDS = [
  {
    eyebrow: "What it is",
    title: (
      <>
        Safety that fits in your <span style={{ color: ACCENT, fontStyle: "italic" }}>palm</span>.
      </>
    ),
    body: "RedFlaq surfaces public records and behaviour patterns so you can decide before you trust.",
  },
  {
    eyebrow: "Why it matters",
    title: (
      <>
        One check can change <span style={{ color: ACCENT, fontStyle: "italic" }}>everything</span>.
      </>
    ),
    body: "South Africa has the highest GBVF rate in the world. The cost of not checking is too high.",
  },
  {
    eyebrow: "Your first move",
    title: (
      <>
        Build the <span style={{ color: ACCENT, fontStyle: "italic" }}>habit</span>.
      </>
    ),
    body: "Read a Signal a day. Run a check when it matters. Free Safety Base, for life.",
  },
];

export default function MobileOnboarding() {
  const [show, setShow] = useState(false);
  const [i, setI] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  if (!show) return null;

  const done = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {}
    setShow(false);
  };

  const card = CARDS[i];
  const isLast = i === CARDS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        background: CREAM,
        zIndex: 200,
        display: "flex",
        flexDirection: "column",
        padding: "32px 24px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", gap: 6 }}>
          {CARDS.map((_, idx) => (
            <span
              key={idx}
              style={{
                width: idx === i ? 24 : 8,
                height: 6,
                borderRadius: 999,
                background: idx === i ? ACCENT : "rgba(0,0,0,0.15)",
                transition: "width 200ms ease",
              }}
            />
          ))}
        </div>
        <button
          onClick={done}
          style={{ ...mono, fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: CREAM_MUTED, background: "none", border: "none", cursor: "pointer", fontWeight: 700 }}
        >
          Skip
        </button>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 18 }}>
        <span style={{ ...mono, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: ACCENT, fontWeight: 700 }}>
          {card.eyebrow}
        </span>
        <h2 style={{ ...serif, fontSize: 40, lineHeight: 1.05, color: CREAM_INK, margin: 0, fontWeight: 400 }}>
          {card.title}
        </h2>
        <p style={{ ...syne, color: "#3a3a3f", fontSize: 16, lineHeight: 1.55 }}>{card.body}</p>
      </div>

      <button
        onClick={() => (isLast ? done() : setI(i + 1))}
        style={{ ...primaryButton, marginBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {isLast ? "Enter RedFlaq" : "Next"}
      </button>
    </div>
  );
}
