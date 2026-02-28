import { Link } from "react-router-dom";
import EmergencyBanner from "@/components/EmergencyBanner";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const FooterNew = () => {
  const productLinks = [
    { label: "Search", href: "#" },
    { label: "Pricing", href: "#pricing" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { label: "About Us", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Dispute a Record", href: "/dispute" },
    { label: "POPIA Compliance", href: "/privacy" },
  ];

  return (
    <>
    <footer className="bg-gray-800 text-gray-300 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center mb-4">
              <img src={redflaqLogo} alt="RedFlaq" style={{ height: 30, width: 'auto', display: 'block', filter: 'brightness(0) invert(1)' }} />
            </div>
            <p className="text-sm">
              Making South Africa safer, one informed decision at a time.
            </p>
          </div>

          {/* Column 2: Product */}
          <div>
            <h4 className="font-semibold text-white mb-4">Product</h4>
            <ul className="space-y-2">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2">
              {legalLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                📧 <a href="mailto:support@redflaq.com" className="hover:text-white transition-colors">
                  support@redflaq.com
                </a>
              </li>
              <li>📍 Johannesburg, South Africa</li>
            </ul>
          </div>
        </div>

        {/* GBV Message */}
        <div className="border-t border-gray-700 pt-8 text-center">
          <p className="text-purple-400 mb-4">
            💜 Standing with South African women against Gender-Based Violence
          </p>
          
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} RedFlaq. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Setup A Startup (Pty) Ltd
          </p>
        </div>
      </div>
    </footer>
    <EmergencyBanner />
    </>
  );
};

export default FooterNew;
