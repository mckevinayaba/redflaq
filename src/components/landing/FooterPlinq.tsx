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
              <div style={{ marginTop: 24 }}>
                <h4 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, color: 'rgba(255,255,255,0.8)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Follow RedFlaq</h4>
                <div style={{ display: 'flex', gap: 10 }}>
                  {[
                    { icon: 'facebook', href: "https://www.facebook.com/RedFlaqSafety/", path: "M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" },
                    { icon: 'instagram', href: "https://www.instagram.com/redflaqsafety/", paths: ["M2 6a4 4 0 0 1 4-4h12a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4z", "M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"], circle: true },
                    { icon: 'linkedin', href: "https://www.linkedin.com/company/redflaq/", paths: ["M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z", "M2 9h4v12H2z"], circle2: true },
                    { icon: 'x', href: "https://x.com/RedFlaqSafety" },
                    { icon: 'tiktok', href: "https://www.tiktok.com/@redflaqsafety" },
                  ].map(s => (
                    <a
                      key={s.icon}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.icon}
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(255,255,255,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.2s ease', textDecoration: 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; e.currentTarget.style.transform = 'scale(1.1)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.transform = 'scale(1)'; }}
                    >
                      {s.icon === 'facebook' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={s.path}/></svg>
                      )}
                      {s.icon === 'instagram' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="white" stroke="none"/></svg>
                      )}
                      {s.icon === 'linkedin' && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      )}
                      {s.icon === 'x' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      )}
                      {s.icon === 'tiktok' && (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.22V9.4a8.16 8.16 0 0 0 3.85.96V7.64a4.85 4.85 0 0 1-3.85-1z"/><path d="M12.37 2h3.45v.44a4.83 4.83 0 0 0 3.77 4.25"/></svg>
                      )}
                    </a>
                  ))}
                </div>
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
