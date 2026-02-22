import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Shield, Heart, Home, Users, HelpCircle } from "lucide-react";

const tools = [
  {
    title: "First Date Safety Checklist",
    description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.",
    href: "/tools/first-date-safety",
    icon: <Heart size={24} style={{ color: "#7C3AED" }} />,
    tag: "DATING SAFETY",
  },
  {
    title: "Tenant / Landlord Safety Checklist",
    description: "Essential checks before renting a property or accepting a new tenant in South Africa.",
    href: "/tools/tenant-safety",
    icon: <Home size={24} style={{ color: "#7C3AED" }} />,
    tag: "HOUSING SAFETY",
  },
  {
    title: "Domestic Worker / Nanny Safety Checklist",
    description: "Practical safety steps when hiring someone to work in your home or look after your children.",
    href: "/tools/domestic-worker-safety",
    icon: <Users size={24} style={{ color: "#7C3AED" }} />,
    tag: "HOME SAFETY",
  },
  {
    title: "Is This a Red Flag?",
    description: "A quick interactive quiz to help you identify warning signs in relationships and situations.",
    href: "/tools/red-flag-quiz",
    icon: <HelpCircle size={24} style={{ color: "#7C3AED" }} />,
    tag: "AWARENESS",
  },
];

const Tools = () => {
  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "100px 24px 60px" }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 8 }}>
          FREE SAFETY TOOLS
        </p>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 40, color: "#2D2235", marginBottom: 12 }}>
          Free Safety Tools for South Africa
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, maxWidth: 600, marginBottom: 48 }}>
          Interactive checklists and quizzes to help you stay safe — whether you're dating, renting, hiring, or just trusting your gut. No login required.
        </p>

        <div style={{ display: "grid", gap: 24 }}>
          {tools.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              style={{
                display: "block", background: "white", border: "1.5px solid #D6D3CD", padding: 32,
                textDecoration: "none", transition: "border-color 0.2s",
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
                <div style={{ width: 48, height: 48, background: "#FAF5FF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {tool.icon}
                </div>
                <div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: "0.1em", color: "#7C3AED", fontWeight: 600 }}>
                    {tool.tag}
                  </span>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, color: "#2D2235", margin: "4px 0 8px" }}>
                    {tool.title}
                  </h2>
                  <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.6 }}>
                    {tool.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* SEO text block */}
        <div style={{ marginTop: 48, padding: 32, background: "#EDE9E3", borderTop: "1.5px solid #D6D3CD" }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", lineHeight: 1.8 }}>
            These free safety tools are part of RedFlaq's mission to make South Africa safer for women and communities.
            Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
            we've got you covered. For a deeper check, run a <Link to="/search-form" style={{ color: "#7C3AED", fontWeight: 700 }}>RedFlaq public-record safety check</Link> in
            under 60 seconds for R99.
          </p>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default Tools;
