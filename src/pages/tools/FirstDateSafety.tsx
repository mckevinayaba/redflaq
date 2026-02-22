import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import { Progress } from "@/components/ui/progress";

const items = [
  "Tell a trusted friend or family member where you're going, who you're meeting, and when you expect to be back.",
  "Meet in a public place — never at their home or yours for the first meeting.",
  "Arrange your own transport (don't rely on your date for a lift).",
  "Keep your phone charged and have emergency numbers saved (SAPS: 10111).",
  "Trust your instincts — if something feels off before the date, it's okay to cancel.",
  "Do a quick Google search on the person beforehand.",
  "Run a RedFlaq public-record safety check to see if there are any red flags.",
  "Don't share personal details like your home address or workplace too early.",
  "Let your friend know when you've arrived safely and when the date ends.",
  "If you feel unsafe during the date, go to the nearest staff member or leave immediately.",
];

const FirstDateSafety = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));
  const progress = Math.round((checked.filter(Boolean).length / items.length) * 100);

  return (
    <ToolLayout
      title="First Date Safety Checklist — South Africa"
      subtitle="Going on a first date? Use this free checklist to protect yourself. Designed for South African women."
      metaDescription="Free first date safety checklist for South African women. Practical steps to stay safe when meeting someone new. From RedFlaq."
      shareUrl="/tools/first-date-safety"
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9CA3AF", letterSpacing: "0.1em" }}>
            PROGRESS
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7C3AED", fontWeight: 600 }}>
            {checked.filter(Boolean).length}/{items.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, idx) => (
          <label
            key={idx}
            style={{
              display: "flex", alignItems: "flex-start", gap: 12, padding: 16,
              background: checked[idx] ? "#F0FDF4" : "white",
              border: `1.5px solid ${checked[idx] ? "#22C55E" : "#D6D3CD"}`,
              cursor: "pointer", transition: "all 0.2s",
            }}
          >
            <input
              type="checkbox"
              checked={checked[idx]}
              onChange={() => {
                const next = [...checked];
                next[idx] = !next[idx];
                setChecked(next);
              }}
              style={{ marginTop: 3, accentColor: "#7C3AED", width: 18, height: 18 }}
            />
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#2D2235", lineHeight: 1.6,
              textDecoration: checked[idx] ? "line-through" : "none",
              opacity: checked[idx] ? 0.6 : 1,
            }}>
              {item}
            </span>
          </label>
        ))}
      </div>

      {progress === 100 && (
        <div style={{ background: "#F0FDF4", border: "2px solid #22C55E", padding: 24, textAlign: "center", marginTop: 24 }}>
          <span style={{ fontSize: 32 }}>✅</span>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "8px 0" }}>
            You're prepared!
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C" }}>
            You've completed every step. Stay safe and trust your instincts.
          </p>
        </div>
      )}
    </ToolLayout>
  );
};

export default FirstDateSafety;
