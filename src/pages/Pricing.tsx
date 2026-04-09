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
    <div style={{ minHeight: '100vh', background: '#08080f' }}>
      <NavbarPlinq />

      {/* Hero */}
      <section style={{
        background: '#08080f',
        paddingTop: 100, paddingBottom: 60,
      }}>
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center' }}>
          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.15em', color: '#6C35DE', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span style={{ width: 24, height: 1, background: '#6C35DE', display: 'inline-block' }} />
            SIMPLE PRICING
          </p>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)', color: '#ffffff', marginBottom: 16, letterSpacing: '-0.02em', fontWeight: 800 }}>
            Choose your plan
          </h1>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
            No subscriptions. No hidden fees. Pay only for what you need.
          </p>
        </div>
      </section>

      {showBanner && (
        <div style={{
          background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', padding: '14px 24px',
          textAlign: 'center', fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#22C55E',
        }}>
          ✅ Account verified! Choose a plan to run your search.
        </div>
      )}

      <div style={{ background: '#08080f' }}>
        <PricingPlinq />
      </div>

      <FooterPlinq />
    </div>
  );
}
