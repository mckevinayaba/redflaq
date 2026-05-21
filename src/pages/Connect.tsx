import { Link } from "react-router-dom";

export default function Connect() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#08080f",
        color: "#ffffff",
        padding: "80px 24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 28,
      }}
    >
      <div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#7C3AED",
          }}
        >
          Coming Soon
        </span>
        <h1
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 44,
            lineHeight: 1.05,
            margin: "12px 0 16px",
            whiteSpace: "nowrap",
          }}
        >
          RedFlaq Connect
        </h1>
        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 16,
            lineHeight: 1.55,
            color: "#c8c8d0",
            maxWidth: 520,
          }}
        >
          Meet verified people in small, vetted groups. No swipes. No DMs.
          Every member RedFlaq'd in the last 90 days, before you ever sit down.
        </p>
      </div>

      <div
        style={{
          background: "#111118",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 12,
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {[
          ["01", "Verify yourself", "Run a R99 RedFlaq check — valid 90 days."],
          ["02", "Take the Trust Quiz", "40 questions on values, boundaries, safety."],
          ["03", "Join a small group", "3–6 vetted people, at a vetted venue."],
        ].map(([n, t, d]) => (
          <div key={n} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: 36,
                lineHeight: 1,
                color: "#7C3AED",
                minWidth: 48,
              }}
            >
              {n}
            </span>
            <div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 16, marginBottom: 4 }}>{t}</div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#9a9aa3", lineHeight: 1.5 }}>{d}</div>
            </div>
          </div>
        ))}
      </div>

      <Link
        to="/dashboard"
        style={{
          alignSelf: "flex-start",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "#7C3AED",
          textDecoration: "none",
        }}
      >
        ← Back to Dashboard
      </Link>
    </div>
  );
}
