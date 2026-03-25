import { useNavigate } from "react-router-dom";
import { MessageCircle, BookOpen, FileText, Phone, Scale } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import WhatsAppShareButton from "@/components/WhatsAppShareButton";
import { getWhatsAppChatUrl, WHATSAPP_MESSAGES } from "@/constants/whatsapp";

const steps = [
  {
    num: "01",
    title: "Save the RedFlaq WhatsApp number to your contacts",
    desc: "Add our number so you can reach us anytime, right from your WhatsApp.",
  },
  {
    num: "02",
    title: "Send the full name of the person you want to check",
    desc: "Just type the full name — we handle the rest.",
  },
  {
    num: "03",
    title: "Get your pre-filled check link in seconds",
    desc: "We send you a direct link to complete your safety check — pre-filled with the name and province you gave us.",
  },
  {
    num: "04",
    title: "Create your free RedFlaq account",
    desc: "Save results, access your Safety Journal, and build an Affidavit — all free.",
  },
];

const benefits = [
  { icon: BookOpen, label: "Safety Journal — document incidents, threats, and patterns privately" },
  { icon: Scale, label: "Affidavit Builder — generate a legally formatted SA affidavit draft, free" },
  { icon: FileText, label: "Saved check history — revisit every person you've checked" },
  { icon: Phone, label: "GBV helplines & resources across all 9 provinces" },
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
              marginBottom: 28,
              maxWidth: 560,
              margin: "0 auto 28px",
            }}
          >
            Save our number. Text a name. Get a public safety signal in 60
            seconds — no app download needed.
          </p>

          <div
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              color: "#78716C",
              lineHeight: 1.8,
              maxWidth: 520,
              margin: "0 auto 36px",
              fontStyle: "italic",
            }}
          >
            <p style={{ margin: "0 0 8px" }}>She loved him. She trusted him.</p>
            <p style={{ margin: "0 0 8px" }}>His name was on a public warning list.</p>
            <p style={{ margin: "0 0 8px" }}>Nobody told her to check.</p>
            <p style={{ margin: "0 0 16px" }}>We buried her last month.</p>
            <p style={{ margin: 0, fontStyle: "normal", fontWeight: 600, color: "#4B4453" }}>
              RedFlaq was built so that story ends differently for the next woman.
            </p>
          </div>

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

      {/* Why create a free account */}
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
            Your free account does more than save a check.
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

      {/* Share section */}
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
            Share RedFlaq with someone you love.
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
            One forward can change everything. Send this to every woman, parent,
            or community member who deserves to know.
          </p>

          <WhatsAppShareButton
            message={WHATSAPP_MESSAGES.emotionalShare}
            label="Forward on WhatsApp"
          />
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
};

export default WhatsAppPage;
