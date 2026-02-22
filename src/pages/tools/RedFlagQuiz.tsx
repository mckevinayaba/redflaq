import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";

const questions = [
  { q: "They get angry or guilt-trip you when you spend time with friends or family.", weight: 3 },
  { q: "They pressure you to share passwords or track your location.", weight: 3 },
  { q: "They refuse to tell you basic things about their past (where they live, where they work).", weight: 2 },
  { q: "They avoid being seen with you in public or refuse to meet your people.", weight: 2 },
  { q: "They've lied about small things that turned out to be bigger lies.", weight: 2 },
  { q: "They make you feel responsible for their emotions (\"If you leave me, I'll…\").", weight: 3 },
  { q: "They insist on paying for everything and use it as leverage.", weight: 1 },
  { q: "They've had multiple restraining orders, legal issues, or altercations.", weight: 3 },
  { q: "They push physical boundaries or make you feel unsafe.", weight: 3 },
  { q: "Your gut says something isn't right — even if you can't explain why.", weight: 2 },
];

const RedFlagQuiz = () => {
  const [answers, setAnswers] = useState<(boolean | null)[]>(new Array(questions.length).fill(null));
  const answered = answers.filter((a) => a !== null).length;
  const done = answered === questions.length;
  const score = answers.reduce((sum, a, i) => sum + (a ? questions[i].weight : 0), 0);
  const maxScore = questions.reduce((sum, q) => sum + q.weight, 0);
  const percentage = Math.round((score / maxScore) * 100);

  const getResult = () => {
    if (percentage >= 60) return { level: "🔴 High Risk", color: "#DC2626", message: "Multiple serious red flags detected. Please prioritise your safety. Consider running a RedFlaq check and talking to someone you trust." };
    if (percentage >= 30) return { level: "🟠 Some Concerns", color: "#D97706", message: "There are some warning signs. Pay attention and don't ignore your instincts. A RedFlaq safety check can give you more clarity." };
    return { level: "🟢 Low Risk", color: "#22C55E", message: "No major red flags based on your answers. Stay aware and trust your instincts. Prevention is always better." };
  };

  return (
    <ToolLayout
      title="Is This a Red Flag? — Quick Safety Quiz"
      subtitle="Answer these questions honestly to help identify warning signs in a relationship or situation. Your answers are private and never stored."
      metaDescription="Free red flag quiz for South African women. Identify warning signs in relationships. Your answers stay private. From RedFlaq."
      shareUrl="/tools/red-flag-quiz"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {questions.map((item, idx) => (
          <div key={idx} style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 20 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#2D2235", lineHeight: 1.6, marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9CA3AF", marginRight: 8 }}>{idx + 1}.</span>
              {item.q}
            </p>
            <div style={{ display: "flex", gap: 12 }}>
              {[
                { label: "Yes", value: true },
                { label: "No", value: false },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={() => { const n = [...answers]; n[idx] = opt.value; setAnswers(n); }}
                  style={{
                    padding: "8px 24px",
                    background: answers[idx] === opt.value ? (opt.value ? "#FEF2F2" : "#F0FDF4") : "white",
                    border: `1.5px solid ${answers[idx] === opt.value ? (opt.value ? "#DC2626" : "#22C55E") : "#D6D3CD"}`,
                    fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600,
                    color: answers[idx] === opt.value ? (opt.value ? "#DC2626" : "#22C55E") : "#78716C",
                    cursor: "pointer",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {done && (() => {
        const result = getResult();
        return (
          <div style={{ background: "white", border: `2px solid ${result.color}`, padding: 32, textAlign: "center", marginTop: 24 }}>
            <span style={{ fontSize: 40 }}>{result.level.split(" ")[0]}</span>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2235", margin: "12px 0" }}>
              {result.level}
            </h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
              {result.message}
            </p>
            <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "#9CA3AF", marginTop: 16 }}>
              Your answers are NOT stored and are completely private.
            </p>
          </div>
        );
      })()}
    </ToolLayout>
  );
};

export default RedFlagQuiz;
