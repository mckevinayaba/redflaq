import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Settings, LogOut, BookOpen, FileText } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    setAvatarOpen(false);
    navigate("/");
  };

  const { guardedAction } = useAuthGuard();
  const handleRunCheck = () => {
    guardedAction();
    setIsMenuOpen(false);
  };

  const handleHowItWorks = () => {
    if (location.pathname === '/') {
      document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#how-it-works');
    }
    setIsMenuOpen(false);
  };

  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase()
    || user?.email?.charAt(0)?.toUpperCase()
    || "U";

  const navLinks = [
    { label: "How It Works", action: handleHowItWorks },
    { label: "Signals", action: () => { navigate('/signals'); setIsMenuOpen(false); } },
    { label: "About", action: () => { navigate('/about'); setIsMenuOpen(false); } },
  ];

  return (
    <nav
      id="redflaq-navbar"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%',
        height: 68, zIndex: 2147483647,
        background: isScrolled ? 'rgba(8,8,15,0.96)' : '#08080f',
        backdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(180%)' : 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        transition: 'background 0.3s ease',
        transform: 'translate3d(0,0,0)',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>

          {/* Logo — existing file, unchanged */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', flexShrink: 0 }}>
            <img
              src={redflaqLogo}
              alt="RedFlaq"
              loading="eager"
              fetchPriority="high"
              style={{ height: isMobile ? 38 : 42, width: 'auto', display: 'block' }}
            />
          </a>

          {/* Desktop nav links */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginLeft: 40 }}>
              {navLinks.map(link => (
                <button
                  key={link.label}
                  onClick={link.action}
                  style={{
                    ...inter, fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.65)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px',
                    borderRadius: 6, transition: 'color 0.2s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.color = '#ffffff'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                >
                  {link.label}
                </button>
              ))}
            </div>
          )}

          {/* Desktop right side */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
              {isAuthenticated ? (
                <>
                  {/* Avatar dropdown */}
                  <div style={{ position: 'relative' }} ref={avatarRef}>
                    <button
                      onClick={() => setAvatarOpen(!avatarOpen)}
                      style={{
                        width: 34, height: 34, borderRadius: '50%',
                        background: 'rgba(108,53,222,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        ...inter, fontWeight: 700, fontSize: 13,
                        color: '#6C35DE', border: '1.5px solid rgba(108,53,222,0.4)',
                        cursor: 'pointer', transition: 'border-color 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#6C35DE'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(108,53,222,0.4)'}
                    >
                      {initial}
                    </button>
                    {avatarOpen && (
                      <div style={{
                        position: 'absolute', right: 0, top: 42, width: 210,
                        background: '#111118', border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: 10, boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
                        zIndex: 50, padding: '6px 0',
                      }}>
                        {[
                          { label: 'Dashboard', icon: <LayoutDashboard size={14} />, href: '/dashboard' },
                          { label: 'Safety Journal', icon: <BookOpen size={14} />, href: '/dashboard/journal' },
                          { label: 'My Checks', icon: <FileText size={14} />, href: '/dashboard/reports' },
                          { label: 'Account', icon: <Settings size={14} />, href: '/dashboard/account' },
                        ].map(item => (
                          <button key={item.label} onClick={() => { navigate(item.href); setAvatarOpen(false); }}
                            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...inter, fontSize: 13, color: 'rgba(255,255,255,0.75)', fontWeight: 500, transition: 'background 0.15s' }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(108,53,222,0.1)'; e.currentTarget.style.color = '#fff'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}>
                            {item.icon} {item.label}
                          </button>
                        ))}
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 12px' }} />
                        <button onClick={handleLogout}
                          style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', ...inter, fontSize: 13, color: '#C0392B', fontWeight: 500 }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                          <LogOut size={14} /> Log Out
                        </button>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleRunCheck}
                    style={{
                      ...inter, fontWeight: 700, fontSize: 14, color: 'white',
                      background: '#6C35DE', border: 'none', padding: '9px 20px',
                      cursor: 'pointer', borderRadius: 4,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
                  >
                    Run a Check →
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate('/signup?mode=signin')}
                    style={{
                      ...inter, fontWeight: 500, fontSize: 14, color: 'rgba(255,255,255,0.65)',
                      background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.65)'}
                  >
                    Log In
                  </button>
                  <button
                    onClick={handleRunCheck}
                    style={{
                      ...inter, fontWeight: 700, fontSize: 14, color: 'white',
                      background: '#6C35DE', border: 'none', padding: '9px 20px',
                      cursor: 'pointer', borderRadius: 4,
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#7B42EE'}
                    onMouseLeave={e => e.currentTarget.style.background = '#6C35DE'}
                  >
                    Run a Check →
                  </button>
                </>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          {isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {!isAuthenticated && (
                <button
                  onClick={handleRunCheck}
                  style={{
                    ...inter, fontWeight: 700, fontSize: 12, color: 'white',
                    background: '#6C35DE', border: 'none', padding: '10px 16px',
                    cursor: 'pointer', borderRadius: 4, minHeight: 44,
                  }}
                >
                  Run a Check →
                </button>
              )}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{ padding: 10, background: 'none', border: 'none', cursor: 'pointer', minWidth: 44, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                {isMenuOpen
                  ? <X size={22} color="rgba(255,255,255,0.8)" />
                  : <Menu size={22} color="rgba(255,255,255,0.8)" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {isMobile && isMenuOpen && (
        <div style={{
          background: '#0d0d1a',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          position: 'relative', zIndex: 2147483647,
          maxHeight: 'calc(100vh - 68px)', overflowY: 'auto',
        }}>
          <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: 0 }}>
            {navLinks.map(link => (
              <button
                key={link.label}
                onClick={link.action}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', padding: '14px 0',
                  ...inter, fontWeight: 600, fontSize: 16, color: 'rgba(255,255,255,0.8)',
                  background: 'none', border: 'none', cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                {link.label}
              </button>
            ))}

            <div style={{ paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {isAuthenticated ? (
                <>
                  <button onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                    style={{ ...inter, fontWeight: 700, fontSize: 14, color: '#6C35DE', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', textAlign: 'left' }}>
                    Dashboard
                  </button>
                  <button onClick={handleRunCheck}
                    style={{ width: '100%', background: '#6C35DE', color: 'white', padding: '14px 20px', ...inter, fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                    Run a Check →
                  </button>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    style={{ ...inter, fontWeight: 500, fontSize: 14, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0', textAlign: 'left' }}>
                    Log Out
                  </button>
                </>
              ) : (
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }}
                    style={{ flex: 1, background: 'transparent', color: 'rgba(255,255,255,0.65)', padding: '14px 16px', ...inter, fontWeight: 600, fontSize: 13, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', borderRadius: 4 }}>
                    Log In
                  </button>
                  <button onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                    style={{ flex: 1, background: '#6C35DE', color: 'white', padding: '14px 16px', ...inter, fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', borderRadius: 4 }}>
                    Create Free Base
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarPlinq;
