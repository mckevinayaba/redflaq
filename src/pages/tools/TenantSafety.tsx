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
      shareUrl="/tools/tenant-safety"
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
          <label key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: 16, background: checked[idx] ? "#F0FDF4" : "white", border: `1.5px solid ${checked[idx] ? "#22C55E" : "#D6D3CD"}`, cursor: "pointer" }}>
            <input type="checkbox" checked={checked[idx]} onChange={() => { const n = [...checked]; n[idx] = !n[idx]; setChecked(n); }} style={{ marginTop: 3, accentColor: "#7C3AED", width: 18, height: 18 }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#2D2235", lineHeight: 1.6, textDecoration: checked[idx] ? "line-through" : "none", opacity: checked[idx] ? 0.6 : 1 }}>{item}</span>
          </label>
        ))}
      </div>

      {progress === 100 && (
        <div style={{ background: "#F0FDF4", border: "2px solid #22C55E", padding: 24, textAlign: "center", marginTop: 24 }}>
          <span style={{ fontSize: 32 }}>✅</span>
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "8px 0" }}>All checks done!</h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C" }}>You've covered the essentials. Stay vigilant and keep records of everything.</p>
        </div>
      )}
    </ToolLayout>
  );
};

export default TenantSafety;
