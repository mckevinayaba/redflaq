import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />
      <div style={{ height: 80 }} />

      <header className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold font-heading">Terms of Service</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
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
            See our <Link to="/dispute" className="text-primary">Dispute page</Link> for details.
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
            <a href="mailto:legal@redflaq.com" className="text-primary">legal@redflaq.com</a>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
