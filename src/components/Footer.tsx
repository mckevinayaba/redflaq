const Footer = () => {
  return (
    <footer className="bg-[#5B21B6] text-[#DDD6FE] py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              💜 REDFLAQ
            </h3>
            <p className="text-sm mb-4">
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
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/refund" className="hover:text-white transition-colors">Refund Policy</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          {/* Column 3: Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li>📧 <a href="mailto:support@setupastartup.com" className="hover:text-white transition-colors">support@setupastartup.com</a></li>
              <li>📱 WhatsApp: <a href="https://wa.me/27663365296" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">+27 66 336 5296</a></li>
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
  );
};

export default Footer;
