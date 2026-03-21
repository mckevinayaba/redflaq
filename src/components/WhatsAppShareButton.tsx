import { MessageCircle } from "lucide-react";
import { getWhatsAppShareUrl, WHATSAPP_MESSAGES } from "@/constants/whatsapp";

interface WhatsAppShareButtonProps {
  message?: string;
  label?: string;
  variant?: "primary" | "secondary";
  className?: string;
}

const WhatsAppShareButton = ({
  message = WHATSAPP_MESSAGES.shareAfterCheck,
  label = "Share RedFlaq on WhatsApp",
  variant = "primary",
  className = "",
}: WhatsAppShareButtonProps) => {
  const isPrimary = variant === "primary";

  return (
    <a
      href={getWhatsAppShareUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: isPrimary ? "14px 28px" : "8px 16px",
        background: isPrimary ? "#25D366" : "transparent",
        color: isPrimary ? "#FFFFFF" : "#25D366",
        border: isPrimary ? "none" : "1.5px solid #25D366",
        borderRadius: 50,
        fontFamily: "'Syne', sans-serif",
        fontWeight: 700,
        fontSize: isPrimary ? 14 : 12,
        textDecoration: "none",
        cursor: "pointer",
        transition: "all 0.2s ease",
        width: isPrimary ? "100%" : "auto",
        maxWidth: isPrimary ? 360 : "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = "0.9";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <MessageCircle style={{ width: isPrimary ? 18 : 14, height: isPrimary ? 18 : 14 }} />
      {label}
    </a>
  );
};

export default WhatsAppShareButton;
