import { useState } from "react";
import { Shield } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";
import EmergencyBanner from "@/components/EmergencyBanner";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const FooterPlinq = () => {
  const [shareOpen, setShareOpen] = useState(false);

  const productLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Safety Tips", href: "/safety-tips" },
    { label: "Blog", href: "/blog" },
    { label: "Partners", href: "/partners" },
    { label: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "POPIA Information", href: "/privacy#popia" },
    { label: "Dispute a Record", href: "/dispute" },
    { label: "Data Subject Rights", href: "/privacy#rights" },
  ];

  const linkStyle: React.CSSProperties = {
    fontFamily: "'Syne', sans-serif", fontSize: 14,
    color: 'rgba(255,255,255,0.5)', transition: 'color 0.2s', textDecoration: 'none',
  };

  return (
    <>
      <footer style={{ background: 'linear-gradient(180deg, #0F0A1A, #110D1F)', padding: '80px 24px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-12">
            <div>
              <a href="/" className="flex items-center mb-4" style={{ textDecoration: 'none' }}>
                <img src={redflaqLogo} alt="RedFlaq" style={{ height: 36, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
              </a>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', maxWidth: 300, lineHeight: 1.6 }}>
                South Africa's public-record safety check for women and communities — not a SAPS fingerprint check.
              </p>
              <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(22,163,106,0.1)', border: '1px solid rgba(22,163,106,0.2)', padding: '6px 14px', borderRadius: 50 }}>
                <Shield style={{ width: 13, height: 13, color: '#4ADE80' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: '#4ADE80', letterSpacing: '0.08em' }}>POPIA COMPLIANT</span>
              </div>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Product</h4>
              <ul className="space-y-3">
                {productLinks.map(link => (
                  <li key={link.label}><a href={link.href} style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#A855F7'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{link.label}</a></li>
                ))}
                <li><button onClick={() => setShareOpen(true)} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} onMouseEnter={e => e.currentTarget.style.color = '#A855F7'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>Share RedFlaq</button></li>
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Legal</h4>
              <ul className="space-y-3">
                {legalLinks.map(link => (
                  <li key={link.label}><a href={link.href} style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#A855F7'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>{link.label}</a></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>Contact</h4>
              <ul className="space-y-3">
                <li><a href="mailto:support@redflaq.com" style={linkStyle} onMouseEnter={e => e.currentTarget.style.color = '#A855F7'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>support@redflaq.com</a></li>
                <li><span style={{ ...linkStyle, cursor: 'default' }}>Johannesburg, South Africa</span></li>
              </ul>
              <div style={{ marginTop: 20, display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                {[
                  { label: "Facebook", href: "https://www.facebook.com/RedFlaqSafety/" },
                  { label: "Instagram", href: "https://www.instagram.com/redflaqsafety/" },
                  { label: "LinkedIn", href: "https://www.linkedin.com/company/redflaq/" },
                ].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s', display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(168,85,247,0.08)', border: '1px solid rgba(168,85,247,0.15)', padding: '6px 14px', borderRadius: 50 }} onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(168,85,247,0.2)'; }} onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(168,85,247,0.08)'; }}>{s.label}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(124,58,237,0.15)', paddingTop: 32, textAlign: 'center', marginBottom: 32 }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.6)' }}>
              Ready to keep checking?{" "}
              <a href="/signup?mode=signin" style={{ color: '#A855F7', fontWeight: 700, textDecoration: 'underline' }}>Log in to your RedFlaq account</a>
            </p>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4" style={{ borderTop: '1px solid rgba(124,58,237,0.1)', paddingTop: 32 }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'rgba(255,255,255,0.3)', display: 'block' }}>
                © 2026 RedFlaq · All rights reserved · Public records only · POPIA‑aware
              </span>
              <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 4, display: 'block' }}>
                Built by McKevin Ayaba · Johannesburg, South Africa
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#A855F7' }}>
              Standing with South African women against GBV
            </span>
          </div>
        </div>
      </footer>
      {/* Emergency GBV banner */}
      <div style={{ width: '100%', background: '#DC2626', padding: '12px 20px', textAlign: 'center' }}>
        <a href="tel:0800428428" style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'white', textDecoration: 'none', fontWeight: 600 }}>
          In danger right now? GBV Command Centre: <strong>0800 428 428</strong> — Free · 24/7 · Confidential
        </a>
      </div>
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
};

export default FooterPlinq;
