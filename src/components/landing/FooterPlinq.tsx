import { useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import ShareInviteModal from "@/components/ShareInviteModal";
import { WHATSAPP_CHAT_URL } from "@/constants/whatsapp";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const FooterPlinq = () => {
  const [shareOpen, setShareOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLinkClick = useCallback((href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      if (location.pathname === '/') {
        document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate('/' + href);
      }
    } else if (href.startsWith('/')) {
      e.preventDefault();
      navigate(href);
    }
  }, [location.pathname, navigate]);

  const fontBase: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };

  const linkStyle: React.CSSProperties = {
    ...fontBase, fontSize: 13, color: '#888888', transition: 'color 0.2s',
    textDecoration: 'none', display: 'block', lineHeight: 1.4,
  };

  const headingStyle: React.CSSProperties = {
    ...fontBase, fontWeight: 700, color: '#1F1F1F', fontSize: 12,
    letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16,
  };

  const columns = [
    {
      title: "Product",
      links: [
        { label: "Run a Check", href: "/search-form" },
        { label: "Signals", href: "/signals" },
        { label: "Safety Journal", href: "/dashboard/journal" },
        { label: "Safety Tools", href: "/safety-tips" },
        { label: "Pricing", href: "/pricing" },
        { label: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Safety Tips", href: "/safety-tips" },
        { label: "Blog", href: "/blog" },
        { label: "Get Help Near You", href: "/safety-tips#get-help" },
        { label: "Protection Order Guide", href: "/safety-tips#protection-orders" },
        { label: "FAQ", href: "#faq" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About RedFlaq", href: "/about" },
        { label: "Why We Exist", href: "/about#why-we-exist" },
        { label: "Contact", href: "mailto:hello@redflaq.com" },
        { label: "Partners", href: "/partners" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "POPIA Compliance", href: "/privacy#popia" },
        { label: "Dispute a Record", href: "/dispute" },
      ],
    },
  ];

  const socials = [
    { icon: 'facebook', href: "https://www.facebook.com/RedFlaqSafety/" },
    { icon: 'instagram', href: "https://www.instagram.com/redflaqsafety/" },
    { icon: 'linkedin', href: "https://www.linkedin.com/company/redflaq/" },
    { icon: 'tiktok', href: "https://www.tiktok.com/@redflaqsafety" },
    { icon: 'x', href: "https://x.com/RedFlaqSafety" },
  ];

  return (
    <>
      <footer id="footer-contact" style={{ background: '#F5F0EB', padding: '56px 20px 28px', overflowX: 'hidden' as const, borderTop: '1px solid #E2DCD6' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Top: Logo + 5 columns + Connect */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:grid-cols-5 md:gap-6 mb-12">
            {/* Brand column - takes first slot on mobile */}
            <div className="col-span-2 sm:col-span-3 md:col-span-1 mb-4 md:mb-0">
              <a href="/" className="flex items-center mb-3" style={{ textDecoration: 'none' }}>
                <img src={redflaqLogo} alt="RedFlaq" style={{ height: 32, width: 'auto', display: 'block' }} />
              </a>
              <p style={{ ...fontBase, fontSize: 12, color: '#888888', maxWidth: 260, lineHeight: 1.5, marginBottom: 12 }}>
                South Africa's public-record safety check for women and communities.
              </p>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(22,163,106,0.08)', border: '1px solid rgba(22,163,106,0.15)', padding: '4px 10px', borderRadius: 50 }}>
                <Shield style={{ width: 11, height: 11, color: '#16A34A' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 600, color: '#16A34A', letterSpacing: '0.08em' }}>POPIA COMPLIANT</span>
              </div>
            </div>

            {/* Link columns */}
            {columns.map((col) => (
              <div key={col.title}>
                <h4 style={headingStyle}>{col.title}</h4>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map(link => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        style={linkStyle}
                        onClick={(e) => handleLinkClick(link.href, e)}
                        onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
                        onMouseLeave={e => e.currentTarget.style.color = '#888888'}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Connect row */}
          <div style={{ borderTop: '1px solid #E2DCD6', paddingTop: 28, marginBottom: 28 }}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              {/* Contact info */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center' }}>
                <a href="mailto:hello@redflaq.com" style={{ ...linkStyle, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                  onMouseEnter={e => e.currentTarget.style.color = '#7C3AED'}
                  onMouseLeave={e => e.currentTarget.style.color = '#888888'}>
                  📧 hello@redflaq.com
                </a>
                <span style={{ ...fontBase, fontSize: 12, color: '#888888' }}>🌍 Johannesburg, South Africa</span>
              </div>

              {/* Social icons */}
              <div style={{ display: 'flex', gap: 8 }}>
                {socials.map(s => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.icon}
                    style={{
                      width: 36, height: 36, borderRadius: '50%', background: '#F1ECFF',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s ease', textDecoration: 'none',
                      minWidth: 36, minHeight: 36,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#7C3AED'; const svg = e.currentTarget.querySelector('svg'); if (svg) { svg.setAttribute('stroke', 'white'); svg.setAttribute('fill', 'white'); } }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#F1ECFF'; const svg = e.currentTarget.querySelector('svg'); if (svg) { svg.setAttribute('stroke', '#7C3AED'); svg.setAttribute('fill', '#7C3AED'); } }}
                  >
                    {s.icon === 'facebook' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                    {s.icon === 'instagram' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="#7C3AED" stroke="none"/></svg>}
                    {s.icon === 'linkedin' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>}
                    {s.icon === 'x' && <svg width="12" height="12" viewBox="0 0 24 24" fill="#7C3AED"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    {s.icon === 'tiktok' && <svg width="12" height="12" viewBox="0 0 24 24" fill="#7C3AED"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.22V9.4a8.16 8.16 0 0 0 3.85.96V7.64a4.85 4.85 0 0 1-3.85-1z"/><path d="M12.37 2h3.45v.44a4.83 4.83 0 0 0 3.77 4.25"/></svg>}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-between items-center gap-3 text-center sm:text-left" style={{ borderTop: '1px solid #E2DCD6', paddingTop: 24 }}>
            <div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#888888', display: 'block', wordBreak: 'break-word' as const }}>
                © 2026 RedFlaq · All rights reserved · Public records only · POPIA‑aware
              </span>
              <span style={{ ...fontBase, fontSize: 11, color: '#888888', marginTop: 3, display: 'block' }}>
                Built by McKevin Ayaba · Johannesburg, South Africa
              </span>
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#7C3AED' }}>
              Making safety verification accessible to every South African. Standing with survivors. Serving communities.
            </span>
          </div>
        </div>
      </footer>

      {/* Emergency GBV banner */}
      <div style={{ width: '100%', background: '#5B3EE4', padding: '12px 20px', textAlign: 'center' }}>
        <a href="tel:0800428428" style={{ ...fontBase, fontSize: 13, color: 'white', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          <Shield style={{ width: 14, height: 14, color: 'white', strokeWidth: 2, flexShrink: 0 }} />
          In danger right now? GBV Command Centre: <strong>0800 428 428</strong> — Free · 24/7 · Confidential
        </a>
      </div>

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </>
  );
};

export default FooterPlinq;
