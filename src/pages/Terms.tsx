import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold font-heading">Terms of Service</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 prose prose-gray max-w-none">
          <p className="text-gray-500 text-sm">Last Updated: February 2026</p>

          <h2>Permitted Use</h2>
          <p>RedFlaq is intended for:</p>
          <ul>
            <li>Personal safety decisions</li>
            <li>Due diligence in relationships</li>
            <li>Background verification for personal purposes</li>
          </ul>

          <h2>Prohibited Use</h2>
          <p>You may NOT use RedFlaq for:</p>
          <ul>
            <li><strong>Harassment or discrimination</strong></li>
            <li>Publishing results publicly without consent</li>
            <li>Employment decisions (use official channels for employment screening)</li>
            <li>Defamation or malicious intent</li>
            <li>Stalking or tracking individuals</li>
            <li>Any unlawful purpose</li>
          </ul>

          <h2>Accuracy Disclaimer</h2>
          <p>
            RedFlaq reports public records as they appear in official sources. We do not 
            determine guilt or innocence. All records should be verified independently 
            before making critical decisions.
          </p>
          <p>
            <strong>Important:</strong> An active warrant or criminal record does not constitute 
            a conviction. All individuals are presumed innocent until proven guilty in a court of law.
          </p>

          <h2>Payment Terms</h2>
          <ul>
            <li>All payments are processed manually via bank transfer or instant payment methods</li>
            <li>Search credits are activated after payment verification</li>
            <li>Credits are valid for 30 days from activation</li>
            <li>Refunds are available within 7 days if credits are unused</li>
          </ul>

          <h2>Dispute Process</h2>
          <p>
            If you believe a record is incorrect:
          </p>
          <ol>
            <li>Click "Challenge This Result" on any search result</li>
            <li>Provide your reason and supporting documents</li>
            <li>Submit your dispute</li>
            <li>We will review within 5 business days</li>
            <li>You will receive a response via email</li>
          </ol>

          <h2>Limitation of Liability</h2>
          <p>
            RedFlaq is not liable for decisions made based on search results. Users assume 
            full responsibility for how they use information provided. We do not guarantee 
            the completeness or accuracy of records from third-party sources.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All content, branding, and technology on RedFlaq is owned by Setup A Startup. 
            Users may not copy, modify, or distribute our content without permission.
          </p>

          <h2>Termination</h2>
          <p>
            We reserve the right to terminate access for users who violate these terms 
            or use the service for prohibited purposes.
          </p>

          <h2>Governing Law</h2>
          <p>
            These terms are governed by the laws of the Republic of South Africa. 
            Any disputes will be resolved in South African courts.
          </p>

          <h2>Contact</h2>
          <p>
            For questions about these terms:
          </p>
          <ul>
            <li>Email: <a href="mailto:support@setupastartup.com">support@setupastartup.com</a></li>
            <li>WhatsApp: <a href="https://wa.me/27663365296">+27 66 336 5296</a></li>
          </ul>

          <div className="mt-8 p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-700 m-0">
              By using RedFlaq, you agree to these Terms of Service. We may update these terms 
              from time to time. Continued use after changes constitutes acceptance.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
