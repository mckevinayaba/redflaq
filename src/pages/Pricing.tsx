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
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 60,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-block', background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)',
            borderRadius: 999, padding: '6px 16px', marginBottom: 24,
          }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em', color: '#A78BFA' }}>
              SIMPLE PRICING
            </span>
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 48px)', color: 'white', marginBottom: 16 }}>
            Choose your plan
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 'clamp(15px, 2vw, 18px)', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>
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
