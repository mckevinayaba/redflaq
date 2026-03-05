import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";

export default function Privacy() {
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
            Privacy Policy
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
            <h2>Introduction</h2>
            <p>
              This privacy policy explains how RedFlaq (Setup A Startup (Pty) Ltd)
              collects, uses, and protects your personal information in compliance
              with the Protection of Personal Information Act (POPIA) of South Africa.
            </p>

            <h2>Data We Collect</h2>
            <p>When you use RedFlaq, we collect:</p>
            <ul>
              <li>Search queries (names, ID numbers, case numbers)</li>
              <li>Payment information (email, proof of payment)</li>
              <li>Search results accessed</li>
            </ul>

            <h2>How We Use Your Data</h2>
            <ul>
              <li>To perform background searches you request</li>
              <li>To process payments</li>
              <li>To improve our service</li>
              <li>To comply with South African law (POPIA)</li>
            </ul>

            <h2>Data Protection (POPIA Compliance)</h2>
            <p>
              In accordance with the Protection of Personal Information Act (POPIA),
              we are committed to protecting your personal information:
            </p>
            <ul>
              <li>We only collect data necessary for the service</li>
              <li>Your search data is encrypted and stored securely</li>
              <li>We do not sell your personal information to third parties</li>
              <li>You have the right to request deletion of your data</li>
            </ul>

            <h2>Data Retention</h2>
            <p>
              Search results are stored for 30 days to allow you to access your reports.
              After 30 days, search data is automatically deleted.
            </p>

            <h2>Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul>
              <li>Payment processors (for secure transactions)</li>
              <li>Cloud hosting (for data storage)</li>
            </ul>

            <h2>Your Rights</h2>
            <p>Under POPIA, you have the right to:</p>
            <ul>
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing of your data</li>
            </ul>

            <h2>Contact Us</h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:privacy@redflaq.com" style={{ color: '#7C3AED' }}>privacy@redflaq.com</a>
            </p>

            <div style={{
              marginTop: 32, padding: 20, background: 'rgba(124,58,237,0.04)',
              border: '1px solid rgba(124,58,237,0.1)', borderRadius: 12,
            }}>
              <p style={{ fontSize: 14, color: '#78716C', margin: 0 }}>
                Information Officer: Setup A Startup (Pty) Ltd<br />
                Email: privacy@redflaq.com<br />
                Address: Johannesburg, South Africa
              </p>
            </div>
          </div>
        </div>
      </section>

      <FooterPlinq />
    </div>
  );
}
