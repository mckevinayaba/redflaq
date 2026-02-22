import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Settings, LogOut, Share2 } from "lucide-react";
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
  const [shareOpen, setShareOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const avatarRef = useRef<HTMLDivElement>(null);
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
    { label: "Tools", href: "/tools", isRoute: true },
    { label: "Academy", href: "/academy", isRoute: true },
    { label: "FAQ", href: "#faq" },
  ];

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
        height: 60,
        zIndex: 2147483647,
        visibility: 'visible',
        opacity: 1,
        display: 'block',
        background: '#F7F4F0',
        backgroundColor: '#F7F4F0',
        borderBottom: '1.5px solid #D6D3CD',
        boxShadow: isScrolled ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
        transition: 'box-shadow 0.3s ease',
        WebkitTransform: 'translate3d(0,0,0)',
        transform: 'translate3d(0,0,0)',
        WebkitBackfaceVisibility: 'hidden' as const,
        backfaceVisibility: 'hidden' as const,
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 0, textDecoration: 'none' }}>
            <div style={{ width: 28, height: 28, background: '#7C3AED', borderRadius: 4, WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: '#FFFFFF', lineHeight: 1 }}>R</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', marginLeft: 1 }}><span style={{ color: '#7C3AED' }}>ed</span><span style={{ color: '#2D2235' }}>Flaq</span></span>
          </a>

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href, (link as any).isRoute)}
                  style={{ color: '#4B4453', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop right side */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
                      letterSpacing: '0.05em', color: '#4B4453',
                    }}
                  >
                    Dashboard
                  </button>
                  <div style={{ position: 'relative' }} ref={avatarRef}>
                    <button
                      onClick={() => setAvatarOpen(!avatarOpen)}
                      style={{
                        width: 34, height: 34, borderRadius: '50%', background: 'rgba(124,58,237,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                        color: '#7C3AED', border: 'none', cursor: 'pointer',
                      }}
                    >
                      {initial}
                    </button>
                    {avatarOpen && (
                      <div style={{ position: 'absolute', right: 0, top: 42, width: 192, background: '#FFFFFF', border: '1px solid #D6D3CD', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', zIndex: 50, padding: '4px 0' }}>
                        <button onClick={() => { navigate('/dashboard'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235' }}>
                          <LayoutDashboard style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Dashboard
                        </button>
                        <button onClick={() => { navigate('/dashboard/account'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235' }}>
                          <Settings style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Account
                        </button>
                        <div style={{ borderTop: '1px solid #D6D3CD', margin: '4px 0' }} />
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#DC2626' }}>
                          <LogOut style={{ width: 16, height: 16 }} /> Log out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/signup?mode=signin')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
                    letterSpacing: '0.05em', color: '#4B4453',
                  }}
                >
                  Log In
                </button>
              )}
              <button
                onClick={handleVerifyNow}
                style={{
                  background: '#7C3AED', color: 'white', padding: '8px 20px',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                }}
              >
                Verify Now
              </button>
              <button
                onClick={() => setShareOpen(true)}
                title="Share RedFlaq"
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: 6,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
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

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div
          style={{
            borderTop: '1.5px solid #D6D3CD',
            background: '#F7F4F0',
            backgroundColor: '#F7F4F0',
            position: 'relative',
            zIndex: 2147483647,
          }}
        >
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href, (link as any).isRoute)}
                style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 0', color: '#2D2235', fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 0', color: '#7C3AED', fontFamily: "'Syne', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.05em', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 0', color: '#DC2626', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14, background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }}
                  style={{ flex: 1, background: 'transparent', color: '#4B4453', padding: 12, fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, border: '1.5px solid #D6D3CD', cursor: 'pointer' }}
                >
                  Log In
                </button>
                <button
                  onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  style={{ flex: 1, background: 'transparent', color: '#7C3AED', padding: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, border: '1.5px solid #7C3AED', cursor: 'pointer' }}
                >
                  Sign up free
                </button>
              </div>
            )}
            <button
              onClick={handleVerifyNow}
              style={{ width: '100%', background: '#7C3AED', color: 'white', padding: 12, fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </nav>
  );
};

export default NavbarPlinq;
