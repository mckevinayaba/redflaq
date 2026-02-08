import { Shield } from "lucide-react";

const FooterPlinq = () => {
  const productLinks = [
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "About Us", href: "#about" },
    { label: "FAQ", href: "#faq" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "POPIA Compliance", href: "/privacy#popia" },
    { label: "Dispute a Record", href: "/dispute" },
    { label: "Data Subject Rights", href: "/privacy#rights" },
  ];

  return (
    <footer className="bg-foreground text-muted py-16">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Column 1 - Logo & Tagline */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-heading font-bold text-xl text-background">REDFLAQ</span>
            </a>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Making South Africa safer, one informed decision at a time.
            </p>
          </div>

          {/* Column 2 - Product */}
          <div>
            <h4 className="font-semibold text-background mb-4">Product</h4>
            <ul className="space-y-3">
              {productLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a 
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span>📧</span>
                <a href="mailto:support@setupastartup.com" className="hover:text-primary transition-colors">
                  support@setupastartup.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📱</span>
                <a href="tel:+27663365296" className="hover:text-primary transition-colors">
                  +27 66 336 5296
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span>📍</span>
                <span>Johannesburg, South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-muted-foreground/20 text-center">
          <p className="text-primary mb-2">💜 Standing with South African women against GBV</p>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} RedFlaq. All rights reserved. Setup A Startup (Pty) Ltd
          </p>
        </div>
      </div>
    </footer>
  );
};

export default FooterPlinq;
