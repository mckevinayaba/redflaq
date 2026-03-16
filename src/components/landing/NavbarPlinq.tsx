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
import { WHATSAPP_CHAT_URL } from "@/constants/whatsapp";

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
      if (safetyRef.current && !safetyRef.current.contains(e.target as Node)) setSafetyOpen(false);
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
    if (isRoute) { navigate(href); setIsMenuOpen(false); return; }
    const element = document.querySelector(href);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const { guardedAction } = useAuthGuard();
  const handleVerifyNow = () => { guardedAction(); setIsMenuOpen(false); };

  return (
    <nav id="redflaq-navbar" style={{
      position: 'fixed', top: 0, left: 0, right: 0, width: '100%', height: 64,
      zIndex: 2147483647, visibility: 'visible', opacity: 1, display: 'block',
      background: isScrolled ? 'rgba(255,255,255,0.95)' : 'rgba(15,10,26,0.95)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
      borderBottom: isScrolled ? '1px solid #E6E0DA' : '1px solid rgba(255,255,255,0.08)',
      transition: 'background 0.3s ease, border-bottom 0.3s ease',
      transform: 'translate3d(0,0,0)',
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img src={redflaqLogo} alt="RedFlaq" loading="eager" fetchPriority="high"
              style={{ height: isMobile ? 36 : 40, width: 'auto', display: 'block',
                filter: isScrolled ? 'none' : 'brightness(10)',
              }} />
          </a>

          {/* Desktop nav */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 32, marginLeft: 60 }}>
              {navLinks.map((link) => (
                <button key={link.label} onClick={() => scrollToSection(link.href, (link as any).isRoute)}
                  style={{
                    color: isScrolled ? '#555555' : 'rgba(255,255,255,0.7)',
                    fontSize: 13, fontWeight: 500, fontFamily: "'Syne', sans-serif",
                    background: 'none', border: 'none', cursor: 'pointer',
                    whiteSpace: 'nowrap', padding: '4px 0', transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = isScrolled ? '#6B4EFF' : '#fff'}
                  onMouseLeave={e => e.currentTarget.style.color = isScrolled ? '#555555' : 'rgba(255,255,255,0.7)'}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop right */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button onClick={handleGetHelp} style={{
                background: '#DC2626', color: 'white', padding: '6px 14px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 11,
                border: 'none', cursor: 'pointer', borderRadius: 4,
                display: 'flex', alignItems: 'center', gap: 5, transition: 'background 0.2s',
              }}
                onMouseEnter={e => e.currentTarget.style.background = '#B91C1C'}
                onMouseLeave={e => e.currentTarget.style.background = '#DC2626'}
              >
                <Flag style={{ width: 12, height: 12 }} /> Get Help
              </button>

              {isAuthenticated ? (
                <>
                  <div style={{ position: 'relative' }} ref={safetyRef}>
                    <button onClick={() => setSafetyOpen(!safetyOpen)} style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 13,
                      color: isScrolled ? '#555555' : 'rgba(255,255,255,0.7)',
                      padding: '4px 0', display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      My Safety <ChevronDown style={{ width: 14, height: 14, transition: 'transform 0.2s', transform: safetyOpen ? 'rotate(180deg)' : 'rotate(0)' }} />
                    </button>
                    {safetyOpen && (
                      <div style={{
                        position: 'absolute', left: 0, top: 32, width: 200,
                        background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)',
                        border: '1px solid #E6E0DA', borderRadius: 8,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50, padding: '4px 0',
                      }}>
                        {[
                          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                          { icon: BookOpen, label: 'My Safety Journal', path: '/dashboard/journal' },
                          { icon: FileText, label: 'My Saved Checks', path: '/dashboard/reports' },
                        ].map(item => (
                          <button key={item.label} onClick={() => { navigate(item.path); setSafetyOpen(false); }} style={{
                            display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%',
                            background: 'none', border: 'none', cursor: 'pointer',
                            fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#1F1F1F', fontWeight: 500,
                          }}
                            onMouseEnter={e => e.currentTarget.style.background = '#F8F5FF'}
                            onMouseLeave={e => e.currentTarget.style.background = 'none'}
                          >
                            <item.icon style={{ width: 15, height: 15, color: '#888' }} /> {item.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div style={{ position: 'relative' }} ref={avatarRef}>
                    <button onClick={() => setAvatarOpen(!avatarOpen)} style={{
                      width: 32, height: 32, borderRadius: 4,
                      background: 'rgba(107,78,255,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                      color: '#6B4EFF', border: '1px solid rgba(107,78,255,0.2)',
                      cursor: 'pointer',
                    }}>
                      {initial}
                    </button>
                    {avatarOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 40, width: 180,
                        background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)',
                        border: '1px solid #E6E0DA', borderRadius: 8,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)', zIndex: 50, padding: '4px 0',
                      }}>
                        <button onClick={() => { navigate('/dashboard/account'); setAvatarOpen(false); }} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#1F1F1F',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = '#F8F5FF'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <Settings style={{ width: 15, height: 15, color: '#888' }} /> Settings
                        </button>
                        <div style={{ borderTop: '1px solid #E6E0DA', margin: '2px 12px' }} />
                        <button onClick={handleLogout} style={{
                          display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%',
                          background: 'none', border: 'none', cursor: 'pointer',
                          fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#DC2626',
                        }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.05)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}
                        >
                          <LogOut style={{ width: 15, height: 15 }} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>

                  <button onClick={handleVerifyNow} style={{
                    background: '#6B4EFF', color: 'white', padding: '8px 20px',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                    border: 'none', cursor: 'pointer', borderRadius: 4,
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#5539E8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6B4EFF'}
                  >
                    Verify Now
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => navigate('/signup?mode=signin')} style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 500, fontSize: 13,
                    color: isScrolled ? '#555555' : 'rgba(255,255,255,0.7)',
                    padding: '4px 0',
                  }}>
                    Log In
                  </button>
                  <button onClick={() => navigate('/signup')} style={{
                    background: '#6B4EFF', color: 'white', padding: '8px 20px',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                    border: 'none', cursor: 'pointer', borderRadius: 4,
                    transition: 'background 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#5539E8'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6B4EFF'}
                  >
                    Sign Up Free
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          {isMobile && (
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{
              background: 'none', border: 'none', cursor: 'pointer', padding: 8,
              color: isScrolled ? '#1F1F1F' : '#fff',
            }}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: '#FFFFFF', borderBottom: '1px solid #E6E0DA',
          padding: '20px 24px', zIndex: 50,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {navLinks.map(link => (
              <button key={link.label} onClick={() => scrollToSection(link.href, (link as any).isRoute)} style={{
                fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 500,
                color: '#1F1F1F', background: 'none', border: 'none', cursor: 'pointer',
                padding: '12px 0', textAlign: 'left', borderBottom: '1px solid #E6E0DA',
              }}>
                {link.label}
              </button>
            ))}
            <button onClick={handleGetHelp} style={{
              fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
              color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer',
              padding: '12px 0', textAlign: 'left', borderBottom: '1px solid #E6E0DA',
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <Flag style={{ width: 14, height: 14 }} /> Get Help
            </button>

            {isAuthenticated ? (
              <>
                <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }} style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 500,
                  color: '#1F1F1F', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 0', textAlign: 'left', borderBottom: '1px solid #E6E0DA',
                }}>
                  Dashboard
                </button>
                <button onClick={handleVerifyNow} style={{
                  background: '#6B4EFF', color: 'white', padding: '14px 0',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                  border: 'none', cursor: 'pointer', borderRadius: 4, marginTop: 8, width: '100%',
                }}>
                  Verify Now
                </button>
                <button onClick={handleLogout} style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 500,
                  color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 0', textAlign: 'center',
                }}>
                  Log Out
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }} style={{
                  fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 500,
                  color: '#6B4EFF', background: 'none', border: 'none', cursor: 'pointer',
                  padding: '12px 0', textAlign: 'left',
                }}>
                  Log In
                </button>
                <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }} style={{
                  background: '#6B4EFF', color: 'white', padding: '14px 0',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
                  border: 'none', cursor: 'pointer', borderRadius: 4, marginTop: 4, width: '100%',
                }}>
                  Sign Up Free
                </button>
              </>
            )}
          </div>
        </div>
      )}

      <ShareInviteModal open={shareOpen} onOpenChange={setShareOpen} />
    </nav>
  );
};

export default NavbarPlinq;
