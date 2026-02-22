import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Users, Shield, BarChart3, Code } from "lucide-react";

const benefits = [
  { icon: <Shield size={24} style={{ color: "#7C3AED" }} />, title: "Protect your community", desc: "Give your members access to affordable, fast public-record safety checks." },
  { icon: <BarChart3 size={24} style={{ color: "#7C3AED" }} />, title: "Track your impact", desc: "See how many checks your organisation has referred and the safety impact you're making." },
  { icon: <Code size={24} style={{ color: "#7C3AED" }} />, title: "Embed on your site", desc: "Get a 'Powered by RedFlaq' button to embed on your website or share with members." },
  { icon: <Users size={24} style={{ color: "#7C3AED" }} />, title: "Revenue sharing", desc: "Approved partners may qualify for volume discounts or revenue sharing on referred checks." },
];

const orgTypes = [
  "Women's rights organisations",
  "GBV shelters and NGOs",
  "Churches and faith communities",
  "Student organisations and universities",
  "Property management agencies",
  "Recruitment and staffing agencies",
  "Community safety groups",
  "Legal aid organisations",
];

const Partners = () => (
  <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
    <NavbarPlinq />
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px" }}>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>
        PARTNER PROGRAMME
      </p>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
        Partner with RedFlaq to protect your community
      </h1>
      <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, maxWidth: 600, marginBottom: 48 }}>
        Are you an organisation working to keep South Africans safe? Join our partner programme and give your members access to fast, affordable public-record safety checks.
      </p>

      {/* Benefits */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
        {benefits.map((b, i) => (
          <div key={i} style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 28 }}>
            <div style={{ width: 48, height: 48, background: "#FAF5FF", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              {b.icon}
            </div>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: "#2D2235", marginBottom: 8 }}>{b.title}</h3>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.6 }}>{b.desc}</p>
          </div>
        ))}
      </div>

      {/* Who can partner */}
      <div style={{ background: "white", border: "1.5px solid #D6D3CD", padding: 32, marginBottom: 48 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2235", marginBottom: 16 }}>Who can partner with us?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 8 }}>
          {orgTypes.map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: "#7C3AED", fontWeight: 700 }}>✓</span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#4B4453" }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ background: "#FAF5FF", border: "2px solid #7C3AED", padding: 40, textAlign: "center" }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: "#2D2235", marginBottom: 12 }}>
          Ready to join?
        </h2>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", marginBottom: 24 }}>
          Apply to become a RedFlaq partner. We'll review your application and get back to you within 48 hours.
        </p>
        <Link
          to="/partners/apply"
          style={{
            display: "inline-block", background: "#7C3AED", color: "white", padding: "14px 32px",
            fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
          }}
        >
          Apply Now →
        </Link>
      </div>
    </div>
    <FooterPlinq />
  </div>
);

export default Partners;
