import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import { Progress } from "@/components/ui/progress";

const items = [
  "Ask for a copy of the person's ID document and verify it.",
  "Request at least two references from previous employers and contact them.",
  "Run a RedFlaq public-record safety check on the person's name.",
  "Agree on working hours, duties, and pay in writing (even if informal).",
  "Register the worker with the UIF (Unemployment Insurance Fund) — it's the law.",
  "Never leave young children alone with a new worker until you've built trust over time.",
  "Install security cameras in common areas (inform the worker — it's a POPIA requirement).",
  "Keep valuables and important documents locked away initially.",
  "Set clear boundaries about visitors, phone use, and household rules.",
  "Trust your instincts — if something feels wrong, investigate before it's too late.",
];

const DomesticWorkerSafety = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));
  const progress = Math.round((checked.filter(Boolean).length / items.length) * 100);

  return (
    <ToolLayout
      title="Domestic Worker & Nanny Safety Checklist — South Africa"
      subtitle="Hiring someone to work in your home or look after your children? Use this free checklist to make safe, informed decisions."
      metaDescription="Free domestic worker and nanny safety checklist for South Africa. Protect your family with practical hiring steps. From RedFlaq."
      shareUrl="/safety-tips/domestic-worker-safety"
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#9CA3AF", letterSpacing: "0.1em" }}>PROGRESS</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#7C3AED", fontWeight: 600 }}>{checked.filter(Boolean).length}/{items.length}</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {items.map((item, idx) => (
          <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: checked[idx] ? "rgba(34,197,94,0.08)" : "#111118", border: `1.5px solid ${checked[idx] ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 8, cursor: "pointer" }}>
            <input type="checkbox" checked={checked[idx]} onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} style={{ marginTop: 3, accentColor: "#6C35DE", width: 18, height: 18 }} />
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.6, textDecoration: checked[idx] ? "line-through" : "none", opacity: checked[idx] ? 0.6 : 1 }}>{item}</span>
          </label>
        ))}
      </div>

      {progress === 100 && (
        <div style={{ background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.3)", borderRadius: 8, padding: 24, textAlign: "center", marginTop: 24 }}>
          <span style={{ fontSize: 32 }}>✅</span>
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: "#ffffff", margin: "8px 0" }}>Checklist complete!</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>You've done the right thing by checking thoroughly. Your family's safety matters.</p>
        </div>
      )}
    </ToolLayout>
  );
};

export default DomesticWorkerSafety;
