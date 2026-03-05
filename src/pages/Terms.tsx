import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

export default function Terms() {
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
        <div style={{ maxWidth: 700, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px, 5vw, 44px)', color: 'white', marginBottom: 12 }}>
            Terms of Service
          </h1>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>Last Updated: February 2026</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ background: '#FAFAFA', padding: '48px 24px 80px' }}>
        <div style={{
          maxWidth: 720, margin: '0 auto', background: 'white', borderRadius: 16,
          border: '1px solid #E5E7EB', padding: 'clamp(24px, 4vw, 48px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
        }}>
          <div className="prose prose-gray max-w-none" style={{ fontFamily: "'Syne', sans-serif" }}>
            <h2>Permitted Use</h2>
            <p>RedFlaq is intended for:</p>
            <ul>
              <li>Personal safety decisions</li>
              <li>Due diligence in relationships</li>
              <li>Background verification for personal purposes</li>
            </ul>

            <h2>Prohibited Use</h2>
            <p>You may NOT use RedFlaq to:</p>
            <ul>
              <li>Harass, stalk, or intimidate any person</li>
              <li>Make employment decisions (we are not an employment screening service)</li>
              <li>Violate any person's rights under POPIA</li>
              <li>Access information for unlawful purposes</li>
            </ul>

            <h2>Disclaimer</h2>
            <p>
              RedFlaq searches publicly available databases only. A "clear" result does NOT mean
              a person has no criminal history — it means no match was found in the specific public
              databases we search. We are NOT a substitute for official police clearance certificates.
            </p>

            <h2>Accuracy</h2>
            <p>
              While we strive for accuracy, we cannot guarantee that all information is current
              or complete. Public databases may contain errors, and records may not be updated
              in real-time.
            </p>

            <h2>Dispute Process</h2>
            <p>
              Any person who appears in our search results has the right to dispute the record.
              See our <Link to="/dispute" style={{ color: '#7C3AED' }}>Dispute page</Link> for details.
            </p>

            <h2>Refund Policy</h2>
            <p>
              Search credits are non-refundable once a search has been performed. Unused credits
              remain valid for 12 months from purchase date.
            </p>

            <h2>Limitation of Liability</h2>
            <p>
              RedFlaq provides information for personal safety decisions only. We are not liable
              for any decisions made based on our search results. Users should always exercise
              their own judgment and seek professional advice when needed.
            </p>

            <h2>Governing Law</h2>
            <p>
              These terms are governed by the laws of the Republic of South Africa, including
              the Protection of Personal Information Act (POPIA) and the Electronic Communications
              and Transactions Act (ECTA).
            </p>

            <h2>Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:legal@redflaq.com" style={{ color: '#7C3AED' }}>legal@redflaq.com</a>
            </p>
          </div>
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
}
