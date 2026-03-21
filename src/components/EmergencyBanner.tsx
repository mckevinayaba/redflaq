import { Shield } from "lucide-react";

const EmergencyBanner = () => (
  <div className="w-full py-2.5 px-4 text-center" style={{ background: '#5B3EE4' }}>
    <a href="tel:0800428428" className="font-body text-xs sm:text-sm text-white hover:underline inline-flex items-center justify-center gap-2">
      <Shield style={{ width: 14, height: 14, color: 'white', strokeWidth: 2, flexShrink: 0 }} />
      In danger right now? GBV Command Centre: <span className="font-bold">0800 428 428</span> · Free · 24/7 · Confidential
    </a>
  </div>
);

export default EmergencyBanner;
