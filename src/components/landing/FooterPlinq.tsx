import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Shield } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const FooterPlinq = () => {
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

  const linkStyle: React.CSSProperties = {
    ...inter, fontSize: 13, color: '#8b8b91',
    textDecoration: 'none', display: 'block', lineHeight: 1.4,
    transition: 'color 0.2s',
  };

  const headingStyle: React.CSSProperties = {
    ...inter, fontWeight: 700, color: 'rgba(255,255,255,0.45)', fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase' as const, marginBottom: 16,
  };

  const columns = [
    {
      title: "Platform",
      links: [
        { label: "Run a Check", href: "/search-form" },
        { label: "Signals", href: "/signals" },
        { label: "Safety Journal", href: "/dashboard/journal" },
        { label: "Safety Tools", href: "/safety-tips" },
        { label: "Pricing", href: "/pricing" },
      ],
    },
    {
      title: "Safety Tools",
      links: [
        { label: "Protection Order Guide", href: "/safety-tips#protection-orders" },
        { label: "First Date Safety", href: "/safety-tips/first-date-safety" },
        { label: "Affidavit Builder", href: "/dashboard/affidavit" },
        { label: "Get Help Near You", href: "/safety-tips#get-help" },
        { label: "Red Flag Quiz", href: "/safety-tips/red-flag-quiz" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "About RedFlaq", href: "/about" },
        { label: "Why We Exist", href: "/about#why-we-exist" },
        { label: "Partners", href: "/partners" },
        { label: "Contact", href: "mailto:hello@redflaq.com" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "POPIA Compliance", href: "/privacy#popia" },
        { label: "Dispute a Record", href: "/dispute" },
      ],
    },
  ];

  const socials = [
    { icon: 'facebook', href: "https://www.facebook.com/RedFlaqSafety/", label: "Facebook" },
    { icon: 'instagram', href: "https://www.instagram.com/redflaqsafety/", label: "Instagram" },
    { icon: 'x', href: "https://x.com/RedFlaqSafety", label: "X" },
    { icon: 'tiktok', href: "https://www.tiktok.com/@redflaqsafety", label: "TikTok" },
  ];

  return (
    <>
      <footer id="footer-contact" style={{
        background: '#08080f',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        padding: '56px 24px 32px',
        overflowX: 'hidden' as const,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Grid: 2fr 1fr 1fr 1fr */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 md:grid-cols-4 md:gap-8 mb-12">

            {/* Brand column */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-4 md:mb-0">
              <a href="/" className="flex items-center mb-4" style={{ textDecoration: 'none' }}>
                <img src={redflaqLogo} alt="RedFlaq" style={{ height: 36, width: 'auto', display: 'block' }} />
              </a>
              <p style={{ ...inter, fontSize: 13, color: '#8b8b91', maxWidth: 220, lineHeight: 1.6, marginBottom: 20 }}>
                South Africa's public-record safety check. Before you trust, RedFlaq first.
              </p>

              {/* POPIA badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', padding: '4px 10px', borderRadius: 4, marginBottom: 20 }}>
                <Shield style={{ width: 10, height: 10, color: '#22C55E' }} />
                <span style={{ ...mono, fontSize: 9, fontWeight: 600, color: '#22C55E', letterSpacing: '0.08em' }}>POPIA COMPLIANT</span>
              </div>

              {/* Emergency box */}
              <div style={{
                background: '#C0392B',
                borderRadius: 6,
                padding: '14px 16px',
              }}>
                <p style={{ ...inter, fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.7)', letterSpacing: '0.08em', textTransform: 'uppercase' as const, marginBottom: 4 }}>
                  GBV Command Centre
                </p>
                <a href="tel:0800428428" style={{ ...inter, fontSize: 22, fontWeight: 900, color: '#ffffff', textDecoration: 'none', display: 'block', letterSpacing: '-0.02em' }}>
                  0800 428 428
                </a>
                <p style={{ ...inter, fontSize: 10, color: 'rgba(255,255,255,0.6)', marginTop: 4 }}>
                  Free · 24/7 · Confidential
                </p>
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
                        onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                        onMouseLeave={e => e.currentTarget.style.color = '#8b8b91'}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom */}
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24 }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Brand line */}
              <p style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', textAlign: 'center' }}>
                Before You Trust, RedFlaq First.
              </p>

              {/* Socials */}
              <div style={{ display: 'flex', gap: 8 }}>
                {socials.map(s => (
                  <a
                    key={s.icon}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    style={{
                      width: 34, height: 34, borderRadius: 4,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'border-color 0.2s, background 0.2s',
                      textDecoration: 'none',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#6C35DE'; e.currentTarget.style.background = 'rgba(108,53,222,0.12)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  >
                    {s.icon === 'facebook' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>}
                    {s.icon === 'instagram' && <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1.5" fill="rgba(255,255,255,0.5)" stroke="none"/></svg>}
                    {s.icon === 'x' && <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>}
                    {s.icon === 'tiktok' && <svg width="11" height="11" viewBox="0 0 24 24" fill="rgba(255,255,255,0.5)"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.37-6.22V9.4a8.16 8.16 0 0 0 3.85.96V7.64a4.85 4.85 0 0 1-3.85-1z"/></svg>}
                  </a>
                ))}
              </div>
            </div>

            <p style={{ ...mono, fontSize: 10, color: '#8b8b91', textAlign: 'center', marginTop: 20, letterSpacing: '0.05em' }}>
              © 2026 RedFlaq · All rights reserved · Public records only · POPIA‑aware · Built by McKevin Ayaba · Johannesburg, South Africa
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterPlinq;
