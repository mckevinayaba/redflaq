import { Link } from "react-router-dom";
import MobileTopBar from "../MobileTopBar";
import { screen, page, card, h1, label, syne, mono, serif, MUTED, ACCENT, TEXT, ghostButton } from "./mobileTokens";

const STEPS = [
  ["01", "Verify yourself", "Run a R99 RedFlaq check. Valid 90 days."],
  ["02", "Take the Trust Quiz", "40 questions on values, boundaries, safety."],
  ["03", "Join a small group", "3–6 vetted people. Vetted venue. No DMs."],
];

export default function MobileConnect() {
  return (
    <div style={screen}>
      <MobileTopBar />
      <div style={page}>
        <div>
          <span style={{ ...label, color: ACCENT }}>Coming soon</span>
          <h1 style={{ ...h1, marginTop: 10 }}>
            RedFlaq <span style={{ color: ACCENT }}>Connect</span>.
          </h1>
          <p style={{ ...syne, color: MUTED, fontSize: 15, lineHeight: 1.55, marginTop: 10 }}>
            Meet verified people in small, vetted groups. No swipes. No DMs.
            Every member RedFlaq'd in the last 90 days, before you ever sit down.
          </p>
        </div>

        <div style={card}>
          {STEPS.map(([n, t, d], i) => (
            <div
              key={n}
              style={{
                display: "flex",
                gap: 16,
                paddingTop: i === 0 ? 0 : 18,
                paddingBottom: i === STEPS.length - 1 ? 0 : 18,
                borderBottom: i === STEPS.length - 1 ? "none" : "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span style={{ ...serif, color: ACCENT, fontSize: 36, lineHeight: 1, minWidth: 44 }}>{n}</span>
              <div>
                <p style={{ ...syne, fontWeight: 700, fontSize: 15, color: TEXT }}>{t}</p>
                <p style={{ ...syne, color: MUTED, fontSize: 13, lineHeight: 1.5, marginTop: 4 }}>{d}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ ...card, background: "linear-gradient(135deg, #111118 0%, #1a1126 100%)", border: "1px solid rgba(124,58,237,0.25)" }}>
          <span style={{ ...label, color: ACCENT }}>Get on the list</span>
          <p style={{ ...serif, fontSize: 22, color: TEXT, lineHeight: 1.2, marginTop: 8 }}>
            Connect launches in 2026.
          </p>
          <p style={{ ...syne, color: MUTED, fontSize: 14, lineHeight: 1.5, marginTop: 8 }}>
            Active Safety Base members are first in line when we open Cape Town and Joburg groups.
          </p>
        </div>

        <Link to="/dashboard" style={ghostButton}>Back to Safety Base</Link>

        <p style={{ ...mono, fontSize: 10, color: MUTED, letterSpacing: "0.1em", textTransform: "uppercase", textAlign: "center" }}>
          Before You Trust, RedFlaq First.
        </p>
      </div>
    </div>
  );
}
