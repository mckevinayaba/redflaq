import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

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
      document.getElementById('search')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/signup');
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#F7F4F0', borderBottom: '1.5px solid #D6D3CD', height: '60px' }}>
      <div className="max-w-[1280px] mx-auto px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <a href="/" className="flex items-center gap-2">
            <div className="relative" style={{ width: 28, height: 28 }}>
              <div style={{ width: 28, height: 28, background: '#7C3AED', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }} />
            </div>
            <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#2D2235' }}>REDFLAQ</span>
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
    </nav>
  );
};

export default NavbarPlinq;
