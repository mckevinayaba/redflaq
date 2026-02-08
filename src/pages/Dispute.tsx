import { Link } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Mail, MessageCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dispute() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold font-heading">Dispute a Record</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
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
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute Process</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Click "Challenge This Result"</h3>
                  <p className="text-gray-600">Found on any search result page</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Provide Your Reason</h3>
                  <p className="text-gray-600">Select from common reasons or provide details</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Upload Supporting Documents</h3>
                  <p className="text-gray-600">Court orders, ID documents, or other proof (optional)</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Submit Your Dispute</h3>
                  <p className="text-gray-600">Include your email for updates</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">We Review Within 5 Business Days</h3>
                  <p className="text-gray-600">You'll receive an email with our decision</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What Happens Next?</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>We verify your claim against the original source</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>If incorrect, we remove or update the record</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>If accurate, we explain why it remains</span>
              </li>
              <li className="flex items-start gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                <span>You can appeal our decision within 14 days</span>
              </li>
            </ul>
          </section>

          <section className="bg-gray-50 rounded-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Us Directly</h2>
            <p className="text-gray-700 mb-4">
              For urgent disputes or if you need help submitting:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="mailto:support@setupastartup.com"
                className="inline-flex items-center gap-2"
              >
                <Button variant="outline" className="w-full sm:w-auto">
                  <Mail className="w-4 h-4" />
                  support@setupastartup.com
                </Button>
              </a>
              <a 
                href="https://wa.me/27663365296"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" className="w-full sm:w-auto bg-green-50 border-green-200 hover:bg-green-100">
                  <MessageCircle className="w-4 h-4 text-green-600" />
                  WhatsApp: +27 66 336 5296
                </Button>
              </a>
            </div>
          </section>

          <div className="text-center pt-4">
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
