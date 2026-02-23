import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Shield, Copy, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ShareInviteModal from "@/components/ShareInviteModal";

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
  const { guardedAction } = useAuthGuard();
  const [shareOpen, setShareOpen] = useState(false);

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
        <Link to="/safety-tips" style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: "0.1em", color: "#7C3AED", textDecoration: "none", textTransform: "uppercase", marginBottom: 16, display: "block" }}>
          ← Back to Safety Tips
        </Link>
        <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, color: "#2D2235", marginBottom: 12, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, color: "#78716C", lineHeight: 1.6, marginBottom: 32 }}>
          {subtitle}
        </p>

        {children}

        {/* CTA — auth-guarded + share */}
        <div style={{ background: "#FAF5FF", border: "2px solid #7C3AED", padding: 32, textAlign: "center", marginTop: 40, marginBottom: 32 }}>
          <Shield size={32} style={{ color: "#7C3AED", margin: "0 auto 12px" }} />
          <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: "#2D2235", marginBottom: 8 }}>
            If anything feels off, check before you decide
          </h3>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#78716C", marginBottom: 16 }}>
            Run a RedFlaq public-record safety check in under 60 seconds for R99.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => guardedAction()}
              style={{
                display: "inline-block", background: "#7C3AED", color: "white", padding: "14px 32px",
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer",
                letterSpacing: "0.05em",
              }}
              className="hover:opacity-90 transition-all"
            >
              Run a Safety Check →
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2 hover:opacity-90 transition-all"
              style={{ background: "transparent", border: "2px solid #7C3AED", color: "#7C3AED", padding: "14px 32px", fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700, cursor: "pointer" }}
            >
              <Heart className="h-4 w-4" /> Share RedFlaq
            </button>
          </div>
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
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
      <FooterPlinq />
    </div>
  );
};

export default ToolLayout;
