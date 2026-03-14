import { useNavigate } from "react-router-dom";
import { MessageCircle, Shield, BookOpen, FileText, ArrowRight } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";
import { getWhatsAppChatUrl, getWhatsAppShareUrl, WHATSAPP_MESSAGES } from "@/constants/whatsapp";

const steps = [
  {
    num: "01",
    title: "Save the RedFlaq WhatsApp number",
    desc: "Add our number to your contacts so you can reach us anytime.",
  },
  {
    num: "02",
    title: "Type the full name",
    desc: "Send us the full name of the person you want to check.",
  },
  {
    num: "03",
    title: "Receive your safety signal",
    desc: "Get a public safety signal — CLEAR, LOW, MODERATE, or HIGH RISK.",
  },
  {
    num: "04",
    title: "Create your free account",
    desc: "Save results and access your Safety Journal by creating a free RedFlaq account.",
  },
];

const benefits = [
  { icon: FileText, label: "Save every check result to your history" },
  { icon: BookOpen, label: "Access your private Safety Journal" },
  { icon: MessageCircle, label: "Get future results sent directly to your WhatsApp" },
];

const WhatsAppPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0EB" }}>
      <NavbarPlinq />
      <div style={{ height: 80 }} />

      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "#25D366",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 28px",
            }}
          >
            <MessageCircle style={{ width: 32, height: 32, color: "#fff" }} />
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(36px, 5vw, 56px)",
              color: "#1A1523",
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            RedFlaq is on WhatsApp.
          </h1>

          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(16px, 2.2vw, 20px)",
              color: "#4B4453",
              lineHeight: 1.6,
              marginBottom: 12,
              maxWidth: 560,
              margin: "0 auto 12px",
            }}
          >
            Save our number. Text a name. Get a public safety signal in 60
            seconds — no app download needed.
          </p>

          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              color: "#78716C",
              lineHeight: 1.6,
              maxWidth: 520,
              margin: "0 auto 36px",
            }}
          >
            The easiest way to RedFlaq someone is now in your WhatsApp. No
            website. No login required to start. Just save the number and text a
            name.
          </p>

          <a
            href={getWhatsAppChatUrl(WHATSAPP_MESSAGES.chatbotStart)}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              padding: "18px 40px",
              background: "#25D366",
              color: "#FFFFFF",
              borderRadius: 50,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 16,
              textDecoration: "none",
              transition: "all 0.2s ease",
              boxShadow: "0 4px 20px rgba(37, 211, 102, 0.3)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 28px rgba(37,211,102,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(37,211,102,0.3)";
            }}
          >
            <MessageCircle style={{ width: 20, height: 20 }} />
            Save RedFlaq on WhatsApp
          </a>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 24px", background: "#FFFFFF" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: "0.15em",
              color: "#6B4EFF",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: 12,
            }}
          >
            The Process
          </p>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(28px, 3.5vw, 40px)",
              color: "#1A1523",
              textAlign: "center",
              marginBottom: 48,
            }}
          >
            How it works on WhatsApp
          </h2>

          <div style={{ display: "grid", gap: 32 }}>
            {steps.map((step) => (
              <div
                key={step.num}
                style={{
                  display: "flex",
                  gap: 20,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    background: "#F1ECFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#6B4EFF",
                    flexShrink: 0,
                  }}
                >
                  {step.num}
                </div>
                <div>
                  <h3
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 17,
                      fontWeight: 700,
                      color: "#1F1F1F",
                      marginBottom: 4,
                    }}
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: 14,
                      color: "#78716C",
                      lineHeight: 1.6,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Registration nudge */}
      <section style={{ padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "#1A1523",
              marginBottom: 32,
            }}
          >
            Why create a free account?
          </h2>

          <div style={{ display: "grid", gap: 20, marginBottom: 36 }}>
            {benefits.map((b) => (
              <div
                key={b.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  padding: "16px 20px",
                  background: "#FFFFFF",
                  borderRadius: 12,
                  border: "1px solid rgba(107,78,255,0.1)",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: "50%",
                    background: "#F1ECFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <b.icon style={{ width: 20, height: 20, color: "#6B4EFF" }} />
                </div>
                <p
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontSize: 15,
                    color: "#2D2235",
                    fontWeight: 500,
                    textAlign: "left",
                  }}
                >
                  {b.label}
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/signup")}
            style={{
              background: "#6B4EFF",
              color: "#FFFFFF",
              padding: "16px 36px",
              border: "none",
              borderRadius: 50,
              fontFamily: "'Syne', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: "0 2px 12px rgba(107,78,255,0.25)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#5B3EE4";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#6B4EFF";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Create Free Account — No Card Required
          </button>
        </div>
      </section>

      {/* WhatsApp group sharing */}
      <section
        style={{
          padding: "60px 24px",
          background: "rgba(37, 211, 102, 0.04)",
          borderTop: "1px solid rgba(37, 211, 102, 0.12)",
          borderBottom: "1px solid rgba(37, 211, 102, 0.12)",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 560, margin: "0 auto" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(26px, 3vw, 36px)",
              color: "#1A1523",
              marginBottom: 12,
            }}
          >
            Share RedFlaq with your WhatsApp group
          </h2>
          <p
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              color: "#78716C",
              lineHeight: 1.6,
              marginBottom: 28,
            }}
          >
            Know a group of women, parents, or community members who should know
            about RedFlaq? Share this link with them.
          </p>

          <WhatsAppShareButton
            message={WHATSAPP_MESSAGES.groupShare}
            label="Share in WhatsApp"
          />
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
};

export default WhatsAppPage;
