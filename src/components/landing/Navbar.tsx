import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield } from "lucide-react";
import { PaymentModal } from "@/components/PaymentModal";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const navLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About Us", href: "/about" },
    { label: "FAQ", href: "#faq" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-purple-600" />
            <span className="text-xl font-bold"><span style={{ color: '#7C3AED' }}>Red</span><span className="text-gray-900">Flaq</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-500 hover:text-purple-600 transition-colors font-medium"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="ghost" className="text-gray-500">
              Sign In
            </Button>
            <Button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              Check Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6 text-gray-700" />
            ) : (
              <Menu className="h-6 w-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-background border-t border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-purple-600 py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start text-gray-500">
                  Sign In
                </Button>
                <Button 
                  onClick={() => {
                    setIsPaymentModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Check Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)}
        packageType="single"
      />
    </>
  );
};

export default Navbar;
