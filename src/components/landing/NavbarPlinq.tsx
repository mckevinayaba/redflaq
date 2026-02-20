import { useState, useRef, useEffect } from "react";
import { Menu, X, LayoutDashboard, Settings, LogOut, Share2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ShareInviteModal from "@/components/ShareInviteModal";

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setAvatarOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
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
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const handleVerifyNow = () => {
    if (isAuthenticated) {
      navigate('/dashboard/new-check');
    } else {
      navigate('/signup');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#F7F4F0', borderBottom: '1.5px solid #D6D3CD', height: '60px', position: 'fixed', WebkitTransform: 'translateZ(0)' }}>
      <div className="max-w-[1280px] mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <a href="/" className="flex items-center" style={{ gap: 0 }}>
            <div style={{ width: 28, height: 28, background: '#7C3AED', WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 900, fontSize: 15, color: '#FFFFFF', lineHeight: 1 }}>R</span>
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#2D2235', marginLeft: 1 }}>EDFLAQ</span>
          </a>

          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                style={{ color: '#4B4453', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
                className="hover:!text-[#7C3AED] transition-colors"
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <button
                  onClick={() => navigate('/dashboard')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
                    letterSpacing: '0.05em', color: '#4B4453',
                  }}
                  className="hover:!text-[#7C3AED] transition-colors"
                >
                  Dashboard
                </button>
                <div className="relative" ref={avatarRef}>
                  <button
                    onClick={() => setAvatarOpen(!avatarOpen)}
                    style={{
                      width: 34, height: 34, borderRadius: '50%', background: 'rgba(124,58,237,0.12)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 14,
                      color: '#7C3AED', border: 'none', cursor: 'pointer',
                    }}
                    className="hover:!bg-[rgba(124,58,237,0.22)] transition-colors"
                  >
                    {initial}
                  </button>
                  {avatarOpen && (
                    <div style={{ position: 'absolute', right: 0, top: 42, width: 192, background: '#FFFFFF', border: '1px solid #D6D3CD', borderRadius: 8, boxShadow: '0 4px 16px rgba(0,0,0,0.10)', zIndex: 50, padding: '4px 0' }}>
                      <button onClick={() => { navigate('/dashboard'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235' }} className="hover:!bg-[#F0ECE7] transition-colors">
                        <LayoutDashboard style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Dashboard
                      </button>
                      <button onClick={() => { navigate('/dashboard/account'); setAvatarOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#2D2235' }} className="hover:!bg-[#F0ECE7] transition-colors">
                        <Settings style={{ width: 16, height: 16, color: '#9B8FA3' }} /> Account
                      </button>
                      <div style={{ borderTop: '1px solid #D6D3CD', margin: '4px 0' }} />
                      <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#DC2626' }} className="hover:!bg-[#FEE2E2] transition-colors">
                        <LogOut style={{ width: 16, height: 16 }} /> Log out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signup?mode=signin')}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13,
                    letterSpacing: '0.05em', color: '#4B4453',
                  }}
                  className="hover:!text-[#7C3AED] transition-colors"
                >
                  Log in
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    background: 'transparent', color: '#7C3AED', padding: '8px 20px',
                    fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                    letterSpacing: '0.08em', textTransform: 'uppercase',
                    border: '1.5px solid #7C3AED', cursor: 'pointer',
                  }}
                  className="hover:!bg-[#7C3AED] hover:!text-white transition-colors"
                >
                  Sign up free
                </button>
              </>
            )}
            <button
              onClick={handleVerifyNow}
              style={{
                background: '#7C3AED', color: 'white', padding: '8px 20px',
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
              }}
              className="hover:!bg-[#6D28D9] transition-colors"
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
              className="hover:!text-[#7C3AED] transition-colors"
            >
              <Share2 style={{ width: 18, height: 18, color: '#4B4453' }} />
            </button>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
            {isMenuOpen ? <X className="h-6 w-6" style={{ color: '#2D2235' }} /> : <Menu className="h-6 w-6" style={{ color: '#2D2235' }} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden" style={{ borderTop: '1.5px solid #D6D3CD', background: '#F7F4F0' }}>
          <div className="max-w-[1280px] mx-auto px-6 py-4 space-y-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => scrollToSection(link.href)}
                className="block w-full text-left py-2"
                style={{ color: '#2D2235', fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.05em' }}
              >
                {link.label}
              </button>
            ))}
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => { navigate('/dashboard'); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2"
                  style={{ color: '#7C3AED', fontFamily: "'Syne', sans-serif", fontWeight: 700, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.05em' }}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                  className="block w-full text-left py-2"
                  style={{ color: '#DC2626', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 14 }}
                >
                  Log out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => { navigate('/signup?mode=signin'); setIsMenuOpen(false); }}
                  className="flex-1"
                  style={{ background: 'transparent', color: '#4B4453', padding: '12px', fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 13, border: '1.5px solid #D6D3CD' }}
                >
                  Log in
                </button>
                <button
                  onClick={() => { navigate('/signup'); setIsMenuOpen(false); }}
                  className="flex-1"
                  style={{ background: 'transparent', color: '#7C3AED', padding: '12px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, border: '1.5px solid #7C3AED' }}
                >
                  Sign up free
                </button>
              </div>
            )}
            <button
              onClick={handleVerifyNow}
              className="w-full"
              style={{ background: '#7C3AED', color: 'white', padding: '12px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none' }}
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
