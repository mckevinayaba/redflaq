import { Shield, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Refund Policy", href: "#" },
      { name: "POPIA Compliance", href: "#" }
    ],
    support: [
      { name: "How It Works", href: "#" },
      { name: "FAQ", href: "#" },
      { name: "Contact Us", href: "#" },
      { name: "Report Abuse", href: "#" }
    ],
    company: [
      { name: "About RedFlaq", href: "#" },
      { name: "Our Mission", href: "#" },
      { name: "Safety Resources", href: "#" },
      { name: "Press Kit", href: "#" }
    ]
  };

  return (
    <footer 
      className="relative py-16 md:py-20 px-8"
      style={{
        background: "linear-gradient(180deg, #A72828 0%, #8B1F1F 100%)"
      }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="text-3xl">🔴</span>
              <h3 className="font-heading font-bold text-2xl text-white">REDFLAQ</h3>
            </div>
            <p className="font-body text-white/80 text-sm leading-relaxed mb-6">
              South Africa's first affordable, instant criminal background check service designed specifically for women's safety.
            </p>
            <div className="flex items-center gap-2 text-white/80">
              <Shield className="w-5 h-5" />
              <span className="font-body text-sm font-medium">100% Legal & Secure</span>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="font-body text-white/70 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="font-body text-white/70 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-lg mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href}
                    className="font-body text-white/70 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div 
          className="rounded-2xl p-8 mb-12"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <h4 className="font-heading font-bold text-white text-xl mb-6 text-center">
            Need Help? We're Here 24/7
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Mail className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-body text-white/60 text-xs">Email</p>
                <a 
                  href="mailto:support@redflaq.co.za"
                  className="font-body text-white text-sm font-medium hover:underline"
                >
                  support@redflaq.co.za
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <Phone className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-body text-white/60 text-xs">WhatsApp</p>
                <a 
                  href="tel:+27123456789"
                  className="font-body text-white text-sm font-medium hover:underline"
                >
                  +27 12 345 6789
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
              >
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-body text-white/60 text-xs">Location</p>
                <p className="font-body text-white text-sm font-medium">
                  Johannesburg, SA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div 
          className="h-px mb-8"
          style={{ background: 'rgba(255, 255, 255, 0.2)' }}
        />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="font-body text-white/60 text-sm text-center md:text-left">
            © {currentYear} RedFlaq. All rights reserved. Registered in South Africa.
          </p>
          
          <div className="flex items-center gap-6">
            <a 
              href="#"
              className="font-body text-white/70 text-sm hover:text-white transition-colors"
            >
              Twitter
            </a>
            <a 
              href="#"
              className="font-body text-white/70 text-sm hover:text-white transition-colors"
            >
              Facebook
            </a>
            <a 
              href="#"
              className="font-body text-white/70 text-sm hover:text-white transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.2)' }}>
          <p className="font-body text-white/50 text-xs text-center leading-relaxed max-w-4xl mx-auto">
            <strong>Disclaimer:</strong> RedFlaq provides access to public criminal records sourced from official South African government databases. 
            While we strive for accuracy, we cannot guarantee that all records are complete or up-to-date. RedFlaq is a tool to help you make 
            informed decisions about your safety, but it should not replace your own judgment and intuition. Always prioritize your personal safety.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
