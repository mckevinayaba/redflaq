import { ReactNode } from "react";
import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Shield, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface ToolLayoutProps {
  title: string;
  subtitle: string;
  metaDescription: string;
  children: ReactNode;
  shareUrl: string;
}

const ToolLayout = ({ title, subtitle, metaDescription, children, shareUrl }: ToolLayoutProps) => {
  const fullUrl = `https://redflaq.com${shareUrl}`;
  const shareText = `${title} — a free safety tool from RedFlaq 🇿🇦 ${fullUrl}`;

  const handleShare = (platform: string) => {
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`,
    };
    window.open(urls[platform], "_blank");
  };

  return (
    <div style={{ background: "#F7F4F0", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "100px 24px 60px" }}>
        <Link to="/tools" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#7C3AED", textDecoration: "none", textTransform: "uppercase", marginBottom: 16, display: "block" }}>
          ← Back to Safety Tools
        </Link>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>
          {subtitle}
        </p>

        {children}

        {/* CTA */}
        <div style={{ background: "#FAF5FF", border: "2px solid #7C3AED", padding: 32, textAlign: "center", marginTop: 40, marginBottom: 32 }}>
          <Shield size={32} style={{ color: "#7C3AED", margin: "0 auto 12px" }} />
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2235", marginBottom: 8 }}>
            Ready to check someone's public record?
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", marginBottom: 16 }}>
            Run a RedFlaq safety check in under 60 seconds for R99.
          </p>
          <Link
            to="/search-form"
            style={{
              display: "inline-block", background: "#7C3AED", color: "white", padding: "14px 32px",
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            Run a Safety Check →
          </Link>
        </div>

        {/* Share this tool */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#9CA3AF", textTransform: "uppercase", marginBottom: 12 }}>
            Share this tool
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <button onClick={() => handleShare("whatsapp")} style={{ padding: "8px 16px", background: "white", border: "1.5px solid #D6D3CD", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#2D2235" }}>💬 WhatsApp</button>
            <button onClick={() => handleShare("twitter")} style={{ padding: "8px 16px", background: "white", border: "1.5px solid #D6D3CD", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#2D2235" }}>𝕏 Twitter</button>
            <button onClick={() => handleShare("facebook")} style={{ padding: "8px 16px", background: "white", border: "1.5px solid #D6D3CD", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#2D2235" }}>📘 Facebook</button>
            <button onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Link copied!"); }} style={{ padding: "8px 16px", background: "white", border: "1.5px solid #D6D3CD", fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#2D2235" }}>
              <Copy size={12} style={{ display: "inline", marginRight: 4 }} /> Copy
            </button>
          </div>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default ToolLayout;
