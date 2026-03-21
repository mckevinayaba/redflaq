import { useState } from "react";
import { Share2, Copy, Check, Heart, Shield } from "lucide-react";
import { toast } from "sonner";

interface SafetyWinScreenProps {
  riskLevel: string;
  onClose: () => void;
}

const SafetyWinScreen = ({ riskLevel, onClose }: SafetyWinScreenProps) => {
  const [copied, setCopied] = useState(false);

  // Only show for GREEN or YELLOW
  if (riskLevel !== "GREEN" && riskLevel !== "YELLOW") return null;

  const shareText = "I just used RedFlaq to run a South African public-record safety check before a big decision. Fast, POPIA-aware, built for women and communities: https://redflaq.com";
  const shareUrl = "https://redflaq.com";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      label: "WhatsApp",
      icon: "💬",
      url: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "X / Twitter",
      icon: "𝕏",
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
    },
    {
      label: "Facebook",
      icon: "📘",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
    },
    {
      label: "LinkedIn",
      icon: "💼",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
  ];

  return (
    <div style={{
      background: riskLevel === "GREEN" ? "#F0FDF4" : "#FEFCE8",
      border: `2px solid ${riskLevel === "GREEN" ? "#22C55E" : "#EAB308"}`,
      padding: 32,
      marginBottom: 32,
      textAlign: "center",
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
      <h2 style={{
        fontFamily: "'DM Serif Display', serif",
        fontSize: 28,
        color: "#2D2235",
        marginBottom: 8,
      }}>
        You made a safe, informed decision
      </h2>
      <p style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: 15,
        color: "#78716C",
        lineHeight: 1.6,
        maxWidth: 480,
        margin: "0 auto 24px",
      }}>
        {riskLevel === "GREEN"
          ? "No public-record red flags were found. You took the smart step of checking first — and that matters."
          : "Some minor flags were found, but you've taken the responsible step of checking. Knowledge is power."}
      </p>

      <p style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.1em",
        color: "#9CA3AF",
        textTransform: "uppercase",
        marginBottom: 16,
      }}>
        Share RedFlaq — help another woman stay safe
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 24 }}>
        {shareOptions.map((opt) => (
          <a
            key={opt.label}
            href={opt.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              background: "white",
              border: "1.5px solid #D6D3CD",
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#2D2235",
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span>{opt.icon}</span> {opt.label}
          </a>
        ))}
        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 20px",
            background: "white",
            border: "1.5px solid #D6D3CD",
            fontFamily: "'Syne', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#2D2235",
            cursor: "pointer",
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      <div style={{
        background: "#FAF5FF",
        border: "1px solid #EDE9FE",
        padding: 16,
        maxWidth: 400,
        margin: "0 auto",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: "#7C3AED",
          fontWeight: 600,
          marginBottom: 4,
        }}>
          <Heart size={14} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
          Invite friends & get a free check
        </p>
        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 12,
          color: "#78716C",
        }}>
          For every 3 friends who sign up and pay, you earn 1 free safety check.
        </p>
      </div>
    </div>
  );
};

export default SafetyWinScreen;
