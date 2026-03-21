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
            <p className="text-xs" style={{ color: '#888888' }}>
              Building technology that protects South African women
            </p>
          </div>
          
          {/* Column 2: Links */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F1F1F' }}>Quick Links</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#888888' }}>
              <li><Link to="/about" className="transition-colors" style={{ color: '#888888' }}>About</Link></li>
              <li><Link to="/privacy" className="transition-colors" style={{ color: '#888888' }}>Privacy Policy</Link></li>
              <li><Link to="/terms" className="transition-colors" style={{ color: '#888888' }}>Terms of Service</Link></li>
              <li><Link to="/dispute" className="transition-colors" style={{ color: '#888888' }}>Dispute a Record</Link></li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold mb-4" style={{ color: '#1F1F1F' }}>Contact Us</h4>
            <ul className="space-y-2 text-sm" style={{ color: '#888888' }}>
              <li>📧 <a href="mailto:support@redflaq.com" className="transition-colors" style={{ color: '#888888' }}>support@redflaq.com</a></li>
              <li>🌍 Johannesburg, South Africa</li>
            </ul>
          </div>
        </div>
        
        {/* GBV Message */}
        <div className="mt-8 pt-8 text-center" style={{ borderTop: '1px solid #E2DCD6' }}>
          <p className="text-sm mb-2" style={{ color: '#555555' }}>
            💜 Standing with South African women against Gender-Based Violence
          </p>
          <p className="text-xs" style={{ color: '#888888' }}>
            #StopGBV #ProtectSAWomen
          </p>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 text-center text-xs" style={{ color: '#888888' }}>
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
