import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Heart, Home, Users, HelpCircle } from "lucide-react";

const tips = [
  {
    title: "First Date Safety Checklist",
    description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.",
    href: "/safety-tips/first-date-safety",
    icon: <Heart size={24} style={{ color: "#7C3AED" }} />,
    tag: "DATING SAFETY",
  },
  {
    title: "Tenant / Landlord Safety Checklist",
    description: "Essential checks before renting a property or accepting a new tenant in South Africa.",
    href: "/safety-tips/tenant-safety",
    icon: <Home size={24} style={{ color: "#7C3AED" }} />,
    tag: "HOUSING SAFETY",
  },
  {
    title: "Domestic Worker / Nanny Safety Checklist",
    description: "Practical safety steps when hiring someone to work in your home or look after your children.",
    href: "/safety-tips/domestic-worker-safety",
    icon: <Users size={24} style={{ color: "#7C3AED" }} />,
    tag: "HOME SAFETY",
  },
  {
    title: "Is This a Red Flag?",
    description: "A quick interactive quiz to help you identify warning signs in relationships and situations.",
    href: "/safety-tips/red-flag-quiz",
    icon: <HelpCircle size={24} style={{ color: "#7C3AED" }} />,
    tag: "AWARENESS",
  },
];

const SafetyTips = () => {
  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>
          SAFETY TIPS
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
          Safety Tips for South Africans: Dating, Renting, Childcare and More
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, maxWidth: 650, marginBottom: 48 }}>
          Research-based safety checklists that follow current behaviour patterns — online dating, WhatsApp scams, GBV, rentals, and childcare. We update these regularly to keep you ahead of new risks. No login required.
        </p>

        <div style={{ display: "grid", gap: 24 }}>
          {tips.map((tip) => (
            <Link
              key={tip.href}
              to={tip.href}
              style={{
                display: "block", background: "white", border: "1.5px solid #D6D3CD", padding: 32,
                textDecoration: "none", transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div style={{ width: 48, height: 48, background: "#FAF5FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {tip.icon}
                </div>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#7C3AED", fontWeight: 600 }}>
                    {tip.tag}
                  </span>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "4px 0 8px" }}>
                    {tip.title}
                  </h2>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.6 }}>
                    {tip.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO text block */}
        <div style={{ marginTop: 48, padding: 32, background: "#EDE9E3", borderTop: "1.5px solid #D6D3CD" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.8 }}>
            These free safety tips are part of RedFlaq's mission to make South Africa safer for women and communities.
          Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
            we've got you covered. If anything feels off, run a{" "}
            <Link to="/signup" style={{ color: "#7C3AED", fontWeight: 700 }}>RedFlaq public-record safety check</Link> before you decide.
          </p>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default SafetyTips;
