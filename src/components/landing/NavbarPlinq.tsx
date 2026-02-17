import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const NavbarPlinq = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: '#F7F4F0', borderBottom: '1.5px solid #0D0B0E', height: '60px' }}>
        <div className="max-w-[1280px] mx-auto px-6 h-full">
          <div className="flex items-center justify-between h-full">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2">
              <div className="relative" style={{ width: 28, height: 28 }}>
                <div style={{
                  width: 28, height: 28,
                  background: '#0D0B0E',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }} />
                <div style={{
                  width: 12, height: 12,
                  background: '#7C3AED',
                  clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                  position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                }} />
              </div>
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '0.1em', color: '#0D0B0E' }}>
                REDFLAQ
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  style={{ color: '#4B4453', fontSize: 14, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontFamily: "'Syne', sans-serif", background: 'none', border: 'none', cursor: 'pointer' }}
                  className="hover:!text-[#0D0B0E] transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* CTA */}
            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsPaymentModalOpen(true)}
                style={{
                  background: '#0D0B0E', color: '#F7F4F0', padding: '8px 20px',
                  fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13,
                  letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                }}
                className="hover:!bg-[#7C3AED] transition-colors"
              >
                Verify Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2">
              {isMenuOpen ? <X className="h-6 w-6" style={{ color: '#0D0B0E' }} /> : <Menu className="h-6 w-6" style={{ color: '#0D0B0E' }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden" style={{ borderTop: '1.5px solid #0D0B0E', background: '#F7F4F0' }}>
            <div className="max-w-[1280px] mx-auto px-6 py-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => scrollToSection(link.href)}
                  className="block w-full text-left py-2"
                  style={{ color: '#0D0B0E', fontFamily: "'Syne', sans-serif", fontWeight: 600, textTransform: 'uppercase', fontSize: 14, letterSpacing: '0.05em' }}
                >
                  {link.label}
                </button>
              ))}
              <button
                onClick={() => { setIsMenuOpen(false); setIsPaymentModalOpen(true); }}
                className="w-full"
                style={{ background: '#0D0B0E', color: '#F7F4F0', padding: '12px', fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none' }}
              >
                Verify Now
              </button>
            </div>
          </div>
        )}
      </nav>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default NavbarPlinq;
