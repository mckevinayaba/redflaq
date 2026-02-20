import { useState } from "react";
import ShareInviteModal from "@/components/ShareInviteModal";

const FooterPlinq = () => {
  const [shareOpen, setShareOpen] = useState(false);

  const productLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Search Now", href: "#search" },
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
    color: '#78716C', transition: 'color 0.2s',
  };

  return (
    <>
    <footer style={{ background: '#EDE9E3', padding: 60, borderTop: '1.5px solid #D6D3CD' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-16 mb-12">
          {/* Column 1 - Logo */}
          <div>
            <a href="/" className="flex items-center mb-4" style={{ gap: 0 }}>
              <div style={{ width: 28, height: 28, background: '#7C3AED', borderRadius: 4, WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: '#FFFFFF', lineHeight: 1 }}>R</span>
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#2D2235', marginLeft: 1 }}>EDFLAQ</span>
            </a>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#78716C', maxWidth: 260, lineHeight: 1.6 }}>
              Making South Africa safer, one informed decision at a time.
            </p>
            {/* POPIA badge */}
            <div style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6, background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '6px 12px', borderRadius: 4 }}>
              <span style={{ fontSize: 14 }}>🛡️</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 600, color: '#16A34A', letterSpacing: '0.08em' }}>POPIA COMPLIANT</span>
            </div>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#2D2235', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>PRODUCT</h4>
            <ul className="space-y-3">
              {productLinks.map(link => (
                <li key={link.label}><a href={link.href} style={linkStyle} className="hover:!text-[#7C3AED]">{link.label}</a></li>
              ))}
              <li>
                <button onClick={() => setShareOpen(true)} style={{ ...linkStyle, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }} className="hover:!text-[#7C3AED]">
                  Share RedFlaq
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#2D2235', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>LEGAL</h4>
            <ul className="space-y-3">
              {legalLinks.map(link => (
                <li key={link.label}><a href={link.href} style={linkStyle} className="hover:!text-[#7C3AED]">{link.label}</a></li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact & Social */}
          <div>
            <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: '#2D2235', fontSize: 14, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>CONTACT</h4>
            <ul className="space-y-3">
              <li><a href="mailto:support@redflaq.com" style={linkStyle} className="hover:!text-[#7C3AED]">support@redflaq.com</a></li>
              <li><a href="tel:+27663365296" style={linkStyle} className="hover:!text-[#7C3AED]">+27 66 336 5296</a></li>
              <li><a href="https://wa.me/27663365296" style={linkStyle} className="hover:!text-[#7C3AED]">WhatsApp Us</a></li>
              <li><span style={{ ...linkStyle, cursor: 'default' }}>Johannesburg, South Africa</span></li>
            </ul>

            {/* Social media placeholders */}
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              {[
                { label: "X", href: "#" },
                { label: "LinkedIn", href: "#" },
                { label: "Instagram", href: "#" },
              ].map(s => (
                <a key={s.label} href={s.href} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', textDecoration: 'none' }} className="hover:!text-[#7C3AED]">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Account prompt */}
        <div style={{ borderTop: '1px solid #D6D3CD', marginTop: 48, paddingTop: 32, textAlign: 'center', marginBottom: 32 }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#4B4453' }}>
            Ready to keep checking?{" "}
            <a href="/signup?mode=signin" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'underline' }}>
              Log in to your RedFlaq account
            </a>
          </p>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-wrap justify-between items-center gap-4" style={{ borderTop: '1px solid #D6D3CD', paddingTop: 32 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF', display: 'block' }}>
              © 2026 REDFLAQ · All rights reserved · Public records only · POPIA‑aware
            </span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C', marginTop: 4, display: 'block' }}>
              Built by McKevin Ayaba · Johannesburg, South Africa
            </span>
          </div>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#7C3AED' }}>
            💜 Standing with South African women against GBV
          </span>
        </div>
      </div>
    </footer>
    <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
};

export default FooterPlinq;
