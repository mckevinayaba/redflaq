import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { Shield, Copy, Heart } from "lucide-react";
import { toast } from "sonner";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import ShareInviteModal from "@/components/ShareInviteModal";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

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
    <div style={{ background: "#08080f", minHeight: "100vh" }}>
      <NavbarPlinq />
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "100px 24px 60px" }}>
        <Link to="/safety-tips" style={{ ...inter, fontSize: 11, letterSpacing: "0.1em", color: "#6C35DE", textDecoration: "none", textTransform: "uppercase", marginBottom: 16, display: "block" }}>
          ← Back to Safety Tips
        </Link>
        <h1 style={{ ...inter, fontSize: 36, fontWeight: 800, color: "#ffffff", marginBottom: 12, lineHeight: 1.2 }}>
          {title}
        </h1>
        <p style={{ ...inter, fontSize: 16, color: "rgba(255,255,255,0.6)", lineHeight: 1.6, marginBottom: 32 }}>
          {subtitle}
        </p>

        {children}

        {/* CTA */}
        <div style={{ background: "#111118", border: "1px solid rgba(108,53,222,0.25)", borderRadius: 8, padding: 32, textAlign: "center", marginTop: 40, marginBottom: 32 }}>
          <Shield size={32} style={{ color: "#6C35DE", margin: "0 auto 12px" }} />
          <h3 style={{ ...inter, fontSize: 24, fontWeight: 800, color: "#ffffff", marginBottom: 8 }}>
            If anything feels off, check before you decide
          </h3>
          <p style={{ ...inter, fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 16 }}>
            Run a RedFlaq public-record safety check in under 60 seconds for R99.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => guardedAction()}
              style={{
                ...inter, display: "inline-block", background: "#6C35DE", color: "white", padding: "14px 32px",
                fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer", borderRadius: 4,
              }}
            >
              Run a Safety Check →
            </button>
            <button
              onClick={() => setShareOpen(true)}
              className="inline-flex items-center gap-2"
              style={{ ...inter, background: "transparent", border: "1px solid rgba(108,53,222,0.4)", color: "#6C35DE", padding: "14px 32px", fontSize: 15, fontWeight: 700, cursor: "pointer", borderRadius: 4 }}
            >
              <Heart className="h-4 w-4" /> Share RedFlaq
            </button>
          </div>
        </div>

        {/* Share this tool */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ ...inter, fontSize: 11, letterSpacing: "0.1em", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 12 }}>
            Share this tool
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            {[
              { label: "💬 WhatsApp", platform: "whatsapp" },
              { label: "𝕏 Twitter", platform: "twitter" },
              { label: "📘 Facebook", platform: "facebook" },
            ].map(s => (
              <button key={s.platform} onClick={() => handleShare(s.platform)} style={{ ...inter, padding: "8px 16px", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "rgba(255,255,255,0.7)", borderRadius: 4 }}>
                {s.label}
              </button>
            ))}
            <button onClick={() => { navigator.clipboard.writeText(fullUrl); toast.success("Link copied!"); }} style={{ ...inter, padding: "8px 16px", background: "#111118", border: "1px solid rgba(255,255,255,0.08)", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "rgba(255,255,255,0.7)", borderRadius: 4 }}>
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
