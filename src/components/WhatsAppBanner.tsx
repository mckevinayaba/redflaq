import { useNavigate } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WhatsAppBanner = () => {
  const navigate = useNavigate();
  const { ref, isVisible } = useScrollReveal();

  return (
    <section
      ref={ref}
      className={`reveal-section ${isVisible ? "visible" : ""}`}
      style={{
        background: "rgba(107, 78, 255, 0.04)",
        borderTop: "1px solid rgba(107, 78, 255, 0.1)",
        borderBottom: "1px solid rgba(107, 78, 255, 0.1)",
        padding: "20px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            background: "#25D366",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <MessageCircle style={{ width: 18, height: 18, color: "#FFFFFF" }} />
        </div>

        <p
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 14,
            color: "#2D2235",
            fontWeight: 500,
            margin: 0,
          }}
        >
          RedFlaq is now on WhatsApp. Save our number and check anyone without
          leaving your chat.
        </p>

        <button
          onClick={() => navigate("/whatsapp")}
          style={{
            background: "none",
            border: "none",
            color: "#6B4EFF",
            fontFamily: "'Syne', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            cursor: "pointer",
            padding: 0,
            whiteSpace: "nowrap",
          }}
        >
          Learn how it works →
        </button>
      </div>
    </section>
  );
};

export default WhatsAppBanner;
