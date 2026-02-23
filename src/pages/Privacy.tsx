import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold font-heading">Privacy Policy</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <p className="text-gray-500 text-sm">Last Updated: February 2026</p>

          <h2>Data We Collect</h2>
          <p>When you use RedFlaq, we collect:</p>
          <ul>
            <li>Search queries (names, ID numbers, case numbers)</li>
            <li>Payment information (email, proof of payment)</li>
            <li>Search results accessed</li>
          </ul>

          <h2>How We Use Data</h2>
          <ul>
            <li>To provide search services</li>
            <li>To verify payments</li>
            <li>To improve our platform</li>
            <li><strong>We do NOT sell your data to third parties</strong></li>
          </ul>

          <h2>POPIA Compliance</h2>
          <p>
            RedFlaq complies with South Africa's Protection of Personal Information Act (POPIA).
            All searches use publicly available government records only. We are committed to:
          </p>
          <ul>
            <li>Processing personal information lawfully</li>
            <li>Collecting only necessary information</li>
            <li>Keeping information secure</li>
            <li>Using information only for stated purposes</li>
          </ul>

          <h2>Your Rights</h2>
          <p>Under POPIA, you have the right to:</p>
          <ul>
            <li>Access your search history</li>
            <li>Request data deletion</li>
            <li>Dispute incorrect records</li>
            <li>Withdraw consent</li>
          </ul>

          <h2>Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal 
            information against unauthorized access, alteration, disclosure, or destruction.
          </p>

          <h2>Data Retention</h2>
          <p>
            Search records are retained for 12 months for quality assurance and dispute resolution purposes. 
            After this period, records are anonymized or deleted.
          </p>

          <h2>Third-Party Services</h2>
          <p>
            We use trusted third-party services for payment processing and hosting. 
            These providers are bound by strict data protection agreements.
          </p>

          <h2>Contact Us</h2>
          <p>
            For privacy-related inquiries or to exercise your rights:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@redflaq.com">support@redflaq.com</a></li>
          </ul>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 m-0">
              By using RedFlaq, you agree to this Privacy Policy. We may update this policy 
              from time to time, and will notify users of significant changes.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
