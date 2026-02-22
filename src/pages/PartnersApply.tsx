import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const orgTypes = [
  "Women's Rights NGO",
  "GBV Shelter / Support",
  "Church / Faith Community",
  "Student Organisation",
  "Property Management",
  "Recruitment Agency",
  "Community Safety Group",
  "Legal Aid",
  "Other",
];

const PartnersApply = () => {
  const [form, setForm] = useState({ org_name: "", org_type: "", contact_name: "", contact_email: "", website: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const referralCode = `PARTNER-${Date.now().toString(36).toUpperCase()}`;
    const { error } = await supabase.from("partners").insert({
      ...form,
      referral_code: referralCode,
    });
    if (error) {
      toast.error("Something went wrong. Please try again.");
    } else {
      setSuccess(true);
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    background: "white", border: "1.5px solid #D6D3CD", padding: "14px 16px",
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#2D2235",
    width: "100%", outline: "none", borderRadius: 4,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: "0.1em", textTransform: "uppercase", color: "#4B4453",
    display: "block", marginBottom: 8,
  };

  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 560, margin: "0 auto", padding: "100px 24px 60px" }}>
        <Link to="/partners" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#7C3AED", textDecoration: "none", textTransform: "uppercase", marginBottom: 16, display: "block" }}>
          ← Back to Partner Programme
        </Link>

        {success ? (
          <div style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 40, textAlign: "center" }}>
            <span style={{ fontSize: 48 }}>🎉</span>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2D2235", margin: "16px 0 8px" }}>
              Application submitted!
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: "#78716C", lineHeight: 1.6 }}>
              Thank you for applying to become a RedFlaq partner. We'll review your application and get back to you within 48 hours.
            </p>
            <button onClick={() => navigate("/")} style={{ marginTop: 24, background: "#7C3AED", color: "white", padding: "12px 28px", fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>
              Back to Home
            </button>
          </div>
        ) : (
          <div style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 40 }}>
            <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2D2235", marginBottom: 8 }}>
              Apply to become a partner
            </h1>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", marginBottom: 32 }}>
              Tell us about your organisation and we'll get back to you within 48 hours.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>Organisation Name *</label>
                <input style={inputStyle} value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Organisation Type *</label>
                <select
                  style={{ ...inputStyle, appearance: "auto" }}
                  value={form.org_type}
                  onChange={(e) => setForm({ ...form, org_type: e.target.value })}
                  required
                >
                  <option value="">Select type...</option>
                  {orgTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Contact Person Name *</label>
                <input style={inputStyle} value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Contact Email *</label>
                <input style={inputStyle} type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required />
              </div>
              <div>
                <label style={labelStyle}>Website (optional)</label>
                <input style={inputStyle} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%", background: "#7C3AED", color: "white", padding: 16,
                  fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                  border: "none", cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.5 : 1, borderRadius: 4,
                }}
              >
                {loading ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          </div>
        )}
      </div>
      <FooterPlinq />
    </div>
  );
};

export default PartnersApply;
