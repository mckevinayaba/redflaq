import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

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
    background: 'white', border: '2px solid #E5E7EB', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#2D2235',
    width: '100%', outline: 'none', borderRadius: 12,
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453',
    display: 'block', marginBottom: 8,
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 60,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <Link to="/partners" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
            color: '#A78BFA', textDecoration: 'none', textTransform: 'uppercase', marginBottom: 24,
          }}>
            <ArrowLeft size={14} /> Back to Partner Programme
          </Link>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 5vw, 36px)', color: 'white', marginBottom: 8 }}>
            Apply to become a partner
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
            Tell us about your organisation and we'll get back to you within 48 hours.
          </p>
        </div>
      </section>

      {/* Form */}
      <section style={{ background: '#FAFAFA', padding: '48px 24px 80px' }}>
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          {success ? (
            <div style={{
              background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 16,
              padding: 'clamp(32px, 5vw, 48px)', textAlign: 'center',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <span style={{ fontSize: 48 }}>🎉</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#2D2235', margin: '16px 0 8px' }}>
                Application submitted!
              </h2>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C', lineHeight: 1.6 }}>
                Thank you for applying to become a RedFlaq partner. We'll review your application and get back to you within 48 hours.
              </p>
              <button onClick={() => navigate("/")} style={{
                marginTop: 24, background: '#7C3AED', color: 'white', padding: '14px 28px',
                fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
                border: 'none', cursor: 'pointer', borderRadius: 999,
              }}>
                Back to Home
              </button>
            </div>
          ) : (
            <div style={{
              background: 'white', border: '1.5px solid #E5E7EB', borderRadius: 16,
              padding: 'clamp(24px, 5vw, 40px)',
              boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
            }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <label style={labelStyle}>Organisation Name *</label>
                  <input style={inputStyle} value={form.org_name} onChange={(e) => setForm({ ...form, org_name: e.target.value })} required onFocus={(e) => e.currentTarget.style.borderColor = '#7C3AED'} onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={labelStyle}>Organisation Type *</label>
                  <select
                    style={{ ...inputStyle, appearance: 'auto' }}
                    value={form.org_type}
                    onChange={(e) => setForm({ ...form, org_type: e.target.value })}
                    required
                    onFocus={(e) => e.currentTarget.style.borderColor = '#7C3AED'}
                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'}
                  >
                    <option value="">Select type...</option>
                    {orgTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Contact Person Name *</label>
                  <input style={inputStyle} value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} required onFocus={(e) => e.currentTarget.style.borderColor = '#7C3AED'} onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={labelStyle}>Contact Email *</label>
                  <input style={inputStyle} type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} required onFocus={(e) => e.currentTarget.style.borderColor = '#7C3AED'} onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'} />
                </div>
                <div>
                  <label style={labelStyle}>Website (optional)</label>
                  <input style={inputStyle} value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://..." onFocus={(e) => e.currentTarget.style.borderColor = '#7C3AED'} onBlur={(e) => e.currentTarget.style.borderColor = '#E5E7EB'} />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%', background: '#7C3AED', color: 'white', padding: 16,
                    fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                    opacity: loading ? 0.5 : 1, borderRadius: 999,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
};

export default PartnersApply;
