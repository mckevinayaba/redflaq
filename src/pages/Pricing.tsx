import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PricingPlinq from "@/components/landing/PricingPlinq";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

export default function Pricing() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fromCTA = sessionStorage.getItem("fromCTA");
    if (fromCTA) {
      setShowBanner(true);
      sessionStorage.removeItem("fromCTA");
    }
  }, []);

  return (
    <div style={{ background: '#F7F4F0', minHeight: '100vh' }}>
      <NavbarPlinq />
      <div style={{ paddingTop: 60 }}>
        {showBanner && (
          <div style={{
            background: '#F0FDF4', border: '1px solid #86EFAC', padding: '14px 24px',
            textAlign: 'center', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#166534',
          }}>
            ✅ Account verified! Choose a plan to run your search.
          </div>
        )}
        <PricingPlinq />
      </div>
      <FooterPlinq />
    </div>
  );
}
