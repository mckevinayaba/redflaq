import { Link } from "react-router-dom";
import EmergencyBanner from "@/components/EmergencyBanner";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const Footer = () => {
  return (
    <>
    <footer style={{ background: '#F5F0EB', borderTop: '1px solid #E2DCD6' }} className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <div className="flex items-center mb-2">
              <img src={redflaqLogo} alt="RedFlaq" style={{ height: 36, width: 'auto', display: 'block' }} />
            </div>
            <p className="text-sm mb-4" style={{ color: '#888888' }}>
              A Setup A Startup Initiative
            </p>
            <p className="text-xs">
              Building technology that protects South African women
            </p>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/dispute" className="hover:text-white transition-colors">Dispute a Record</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 <a href="mailto:support@redflaq.com" className="hover:text-white transition-colors">support@redflaq.com</a></li>
              <li>🌍 Johannesburg, South Africa</li>
            </ul>
          </div>
        </div>
        
        {/* GBV Message */}
        <div className="border-t border-[#7C3AED] mt-8 pt-8 text-center">
          <p className="text-sm mb-2">
            💜 Standing with South African women against Gender-Based Violence
          </p>
          <p className="text-xs">
            #StopGBV #ProtectSAWomen
          </p>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 text-center text-xs">
          <p>🏢 Setup A Startup (Pty) Ltd</p>
          <p className="mt-1">© {new Date().getFullYear()} Setup A Startup. All rights reserved.</p>
        </div>
      </div>
    </footer>
    <EmergencyBanner />
    </>
  );
};

export default Footer;
