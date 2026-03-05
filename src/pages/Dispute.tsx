import { Link } from "react-router-dom";
import { AlertTriangle, Mail, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import Footer from "@/components/Footer";

export default function Dispute() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />
      <div style={{ height: 80 }} />

      <header className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold font-heading">Dispute a Record</h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          <div className="flex items-start gap-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h2 className="font-bold text-gray-900 mb-1">Your Rights Matter</h2>
              <p className="text-gray-700">
                If you believe a record is incorrect, you have the right to challenge it. 
                We take all disputes seriously and investigate thoroughly.
              </p>
            </div>
          </div>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Grounds for Dispute</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">1.</span>
                <span><strong>Mistaken Identity:</strong> The record belongs to someone else with a similar name</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">2.</span>
                <span><strong>Outdated Information:</strong> Charges were dropped, case dismissed, or record expunged</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">3.</span>
                <span><strong>Factual Error:</strong> Information in the record is incorrect</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">4.</span>
                <span><strong>Privacy Violation:</strong> Record should not be publicly accessible</span>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">How to File a Dispute</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Email Us</h3>
                  <p className="text-gray-600 text-sm">
                    Send details to <a href="mailto:disputes@redflaq.com" className="text-primary">disputes@redflaq.com</a>
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-gray-900">Include Documentation</h3>
                  <p className="text-gray-600 text-sm">
                    Attach any evidence supporting your dispute (court documents, ID, etc.)
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-4">What Happens Next</h2>
            <div className="space-y-3 text-gray-700">
              <p>1. We acknowledge your dispute within <strong>48 hours</strong></p>
              <p>2. We investigate the claim against original source data</p>
              <p>3. If valid, the record is corrected or removed within <strong>5 business days</strong></p>
              <p>4. You receive written confirmation of the outcome</p>
            </div>
          </section>

          <div className="text-center pt-4 space-y-2">
            <Link to="/privacy">
              <Button variant="outline" className="font-heading">
                View Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
