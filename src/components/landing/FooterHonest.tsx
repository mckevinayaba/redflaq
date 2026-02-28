import { Link } from "react-router-dom";
import EmergencyBanner from "@/components/EmergencyBanner";
import { Shield } from "lucide-react";

const FooterHonest = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
    <footer className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="/" className="flex items-center mb-4" style={{ gap: 14, textDecoration: 'none' }}>
              <Shield style={{ width: 20, height: 20, color: '#A78BFA' }} />
              <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 20 }}>
                <span style={{ color: '#A78BFA' }}>Red</span>
                <span className="text-background">Fla</span>
                <span style={{ color: '#FCA5A5' }}>q</span>
              </span>
            </a>
            <p className="text-background/60 text-sm">
              Making South Africa safer, one informed decision at a time.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-background mb-4">Product</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <a href="#how-it-works" className="hover:text-background transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-background transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-background transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-background mb-4">Legal</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <Link to="/about" className="hover:text-background transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-background transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-background transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link to="/dispute" className="hover:text-background transition-colors">Dispute a Record</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-background mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-background/60">
              <li>
                <a href="mailto:support@redflaq.com" className="hover:text-background transition-colors">
                  support@redflaq.com
                </a>
              </li>
              <li className="text-background/40">
                Johannesburg, South Africa
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-background/10 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-background/40">
              © {currentYear} RedFlaq. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-background/60">
              <span>💜</span>
              <span>Standing with South African women against Gender-Based Violence</span>
            </div>
            <p className="text-sm text-background/40">
              Setup A Startup (Pty) Ltd
            </p>
          </div>
        </div>
      </div>
    </footer>
    <EmergencyBanner />
    </>
  );
};

export default FooterHonest;
