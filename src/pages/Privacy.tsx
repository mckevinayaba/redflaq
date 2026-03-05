import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />
      <div style={{ height: 80 }} />

      <header className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold font-heading">Privacy Policy</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <p className="text-gray-500 text-sm">Last Updated: February 2026</p>

          <h2>Introduction</h2>
          <p>
            This privacy policy explains how RedFlaq (Setup A Startup (Pty) Ltd)
            collects, uses, and protects your personal information in compliance
            with the Protection of Personal Information Act (POPIA) of South
            Africa.
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
            <a href="mailto:privacy@redflaq.com" className="text-primary">privacy@redflaq.com</a>
          </p>

          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Information Officer: Setup A Startup (Pty) Ltd<br />
              Email: privacy@redflaq.com<br />
              Address: Johannesburg, South Africa
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
