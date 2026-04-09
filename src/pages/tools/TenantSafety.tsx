import { useState } from "react";
import ToolLayout from "@/components/tools/ToolLayout";
import { Progress } from "@/components/ui/progress";

const items = [
  "Ask for a copy of the potential tenant's or landlord's ID document.",
  "Request references from previous landlords or tenants.",
  "Verify the property ownership using the Deeds Office or municipality records.",
  "Run a RedFlaq public-record safety check on the person's name.",
  "Never pay a deposit without a signed lease agreement.",
  "Check that the lease includes key terms: duration, deposit, maintenance responsibility, and notice period.",
  "Inspect the property thoroughly and document the condition before moving in.",
  "Confirm utility account ownership (water, electricity) to avoid arrears disputes.",
  "Research the neighbourhood — ask neighbours or check local community groups.",
  "Keep all communication in writing (email or WhatsApp) for your records.",
];

const TenantSafety = () => {
  const [checked, setChecked] = useState<boolean[]>(new Array(items.length).fill(false));
  const progress = Math.round((checked.filter(Boolean).length / items.length) * 100);

  return (
    <ToolLayout
      title="Tenant & Landlord Safety Checklist — South Africa"
      subtitle="Renting a property or accepting a new tenant? Use this free checklist to protect yourself from scams and unsafe situations."
      metaDescription="Free tenant and landlord safety checklist for South Africa. Protect yourself before signing a lease. From RedFlaq."
      shareUrl="/safety-tips/tenant-safety"
    >
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: "0.1em" }}>PROGRESS</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#6C35DE", fontWeight: 600 }}>{checked.filter(Boolean).length}/{items.length}</span>
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
          <h3 style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: "#ffffff", margin: "8px 0" }}>All checks done!</h3>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>You've covered the essentials. Stay vigilant and keep records of everything.</p>
        </div>
      )}
    </ToolLayout>
  );
};

export default TenantSafety;
