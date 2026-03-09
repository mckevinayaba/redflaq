import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Settings, LogOut, Share2, Flag, BookOpen, FileText, ChevronDown } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ShareInviteModal from "@/components/ShareInviteModal";

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const avatarRef = useRef<HTMLDivElement>(null);
  const safetyRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    setAvatarOpen(false);
    navigate("/");
  };

  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Safety Tips", href: "/safety-tips", isRoute: true },
    { label: "Blog", href: "/blog", isRoute: true },
    { label: "FAQ", href: "#faq" },
  ];

  const handleGetHelp = () => {
    navigate('/safety-tips#get-help');
    setIsMenuOpen(false);
    setTimeout(() => {
      const el = document.getElementById('get-help');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  const scrollToSection = (href: string, isRoute?: boolean) => {
    if (isRoute) {
      navigate(href);
      setIsMenuOpen(false);
      return;
    }
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const { guardedAction } = useAuthGuard();
  const handleVerifyNow = () => {
    guardedAction();
    setIsMenuOpen(false);
  };

  return (
    <nav
      id="redflaq-navbar"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 80,
        zIndex: 2147483647,
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        background: isScrolled
          ? 'rgba(247, 244, 240, 0.92)'
          : '#F7F4F0',
        backdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(214, 211, 205, 0.6)' : '1px solid transparent',
        boxShadow: isScrolled ? '0 1px 24px rgba(124, 58, 237, 0.06)' : 'none',
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-bottom 0.4s ease, box-shadow 0.4s ease',
        WebkitTransform: 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)',
        WebkitBackfaceVisibility: 'hidden' as const,
        backfaceVisibility: 'hidden' as const,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 28px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          {/* Logo */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={redflaqLogo}
              alt="RedFlaq - Instant Criminal Record Verification"
              loading="eager"
              fetchPriority="high"
              style={{ height: isMobile ? 44 : 52, width: 'auto', display: 'block' }}
            />
          </a>

          {/* Desktop nav links — centered with generous spacing */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 40, marginLeft: 72 }}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href, (link as any).isRoute)}
                  className="nav-link-hover"
                  style={{
                    color: '#4B4453',
                    fontSize: 14,
                    fontWeight: 500,
                    letterSpacing: '0.01em',
                    fontFamily: "'Syne', sans-serif",
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    position: 'relative',
                    padding: '4px 0',
                  }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop right side */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              {/* Get Help — red pill */}
              <button
                onClick={handleGetHelp}
                style={{
                  background: '#DC2626',
                  color: 'white',
                  padding: '8px 18px',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 12,
                  letterSpacing: '0.02em',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 50,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'background 0.2s ease, transform 0.2s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#B91C1C'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Flag style={{ width: 13, height: 13 }} />
                Get Help
              </button>

              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="nav-link-hover"
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 13,
                      color: '#4B4453', padding: '4px 0', position: 'relative',
                    }}
                  >
                    Dashboard
                  </button>
                  <div style={{ position: 'relative' }} ref={avatarRef}>
                    <button
                      onClick={() => setAvatarOpen(!avatarOpen)}
                      style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(124,58,237,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                        color: '#7C3AED', border: '1.5px solid rgba(124,58,237,0.2)',
                        cursor: 'pointer', transition: 'border-color 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'}
                    >
                      {initial}
                    </button>
                    {avatarOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 46, width: 200,
                        background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(214,211,205,0.6)', borderRadius: 12,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 50, padding: '6px 0',
                      }}>
                        <button onClick={() => { navigate('/dashboard'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <LayoutDashboard style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Dashboard
                        </button>
                        <button onClick={() => { navigate('/dashboard/account'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Settings style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Account
                        </button>
                        <div style={{ borderTop: '1px solid rgba(214,211,205,0.5)', margin: '4px 12px' }} />
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '11px 18px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#DC2626', fontWeight: 500, borderRadius: 8, transition: 'background 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.06)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <LogOut style={{ width: 16, height: 16 }} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/signup?mode=signin')}
                  className="nav-link-hover"
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 13,
                    color: '#4B4453', padding: '4px 0', position: 'relative',
                  }}
                >
                  Log In
                </button>
              )}

              {/* Verify Now — purple pill CTA */}
              <button
                onClick={handleVerifyNow}
                style={{
                  background: '#7C3AED',
                  color: 'white',
                  padding: '10px 24px',
                  fontFamily: "'Syne', sans-serif",
                  fontWeight: 700,
                  fontSize: 13,
                  letterSpacing: '0.02em',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: 50,
                  transition: 'background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease',
                  boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#6D28D9';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(124, 58, 237, 0.35)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#7C3AED';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 12px rgba(124, 58, 237, 0.25)';
                }}
              >
                Verify Now
              </button>

              {/* Share icon */}
              <button
                onClick={() => setShareOpen(true)}
                title="Share RedFlaq"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 8, transition: 'background 0.15s ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(124,58,237,0.08)'}
                onMouseLeave={e => e.currentTarget.style.background = 'none'}
              >
                <Share2 style={{ width: 18, height: 18, color: '#4B4453' }} />
              </button>
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              style={{ padding: 8, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {isMenuOpen
                ? <X style={{ width: 24, height: 24, color: '#2D2235' }} />
                : <Menu style={{ width: 24, height: 24, color: '#2D2235' }} />
              }
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu — slide-in drawer */}
      {isMobile && isMenuOpen && (
        <div
          style={{
            borderTop: '1px solid rgba(214,211,205,0.5)',
            background: 'rgba(247, 244, 240, 0.98)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            position: 'relative',
            zIndex: 2147483647,
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href, (link as any).isRoute)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left',
                  padding: '12px 0', color: '#2D2235',
                  fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 15,
                  letterSpacing: '0.01em', background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: '1px solid rgba(214,211,205,0.3)',
                }}
              >
                {link.label}
              </button>
            ))}

            <div style={{ paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                onClick={handleGetHelp}
                style={{
                  width: '100%', background: '#DC2626', color: 'white',
                  padding: '14px 20px', fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  borderRadius: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}
              >
                <Flag style={{ width: 14, height: 14 }} />
                Get Help
              </button>

              {isAuthenticated ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <button
                    onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', color: '#7C3AED', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '10px 0', color: '#DC2626', fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Log Out
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }}
                    style={{
                      flex: 1, background: 'transparent', color: '#4B4453',
                      padding: '14px 16px', fontFamily: "'Syne', sans-serif",
                      fontWeight: 600, fontSize: 13, border: '1.5px solid rgba(214,211,205,0.7)',
                      cursor: 'pointer', borderRadius: 50,
                    }}
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                    style={{
                      flex: 1, background: 'transparent', color: '#7C3AED',
                      padding: '14px 16px', fontFamily: "'Syne', sans-serif",
                      fontWeight: 700, fontSize: 13, border: '1.5px solid #7C3AED',
                      cursor: 'pointer', borderRadius: 50,
                    }}
                  >
                    Sign Up Free
                  </button>
                </div>
              )}

              <button
                onClick={handleVerifyNow}
                style={{
                  width: '100%', background: '#7C3AED', color: 'white',
                  padding: '14px 20px', fontFamily: "'Syne', sans-serif",
                  fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer',
                  borderRadius: 50,
                  boxShadow: '0 2px 12px rgba(124, 58, 237, 0.25)',
                }}
              >
                Verify Now
              </button>
            </div>
          </div>
        </div>
      )}
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </nav>
  );
};

export default NavbarPlinq;
