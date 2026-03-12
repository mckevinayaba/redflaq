import { useEffect, useState } from "react";
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
    <div style={{ minHeight: '100vh' }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{
        background: '#F5F0EB',
        paddingTop: 120, paddingBottom: 60,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', color: '#6B4EFF', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6B4EFF', display: 'inline-block' }} />
            SIMPLE PRICING
          </p>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 48px)', color: '#1F1F1F', marginBottom: 16, letterSpacing: '-0.02em' }}>
            Choose your plan
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(15px, 2vw, 18px)', color: '#555555', lineHeight: 1.6 }}>
            No subscriptions. No hidden fees. Pay only for what you need.
          </p>
        </div>
      </section>

      {showBanner && (
        <div style={{
          background: '#F0FDF4', border: '1px solid #86EFAC', padding: '14px 24px',
          textAlign: 'center', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#166534',
        }}>
          ✅ Account verified! Choose a plan to run your search.
        </div>
      )}

      <div style={{ background: '#FAFAFA' }}>
        <PricingPlinq />
      </div>

      <FooterPlinq />
    </div>
  );
}
