import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Eye, Scale, Heart } from "lucide-react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F7F4F0' }}>
      <NavbarPlinq />
      <div style={{ height: 80 }} />

      {/* Header */}
      <header className="bg-primary text-white py-10">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-3xl font-bold font-heading">About RedFlaq</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8">
          {/* Mission */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Heart className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-700 leading-relaxed text-lg">
              Violence rarely begins with violence. It begins with information people did not have, 
              patterns they could not verify, and warnings they were never shown.
            </p>
            <p className="text-gray-700 leading-relaxed text-lg mt-4">
              <strong>RedFlaq exists to close that gap.</strong>
            </p>
          </section>

          {/* What We Do */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Eye className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Our Approach</h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              RedFlaq is a legal risk verification platform designed to help South Africans 
              make informed decisions about who they trust.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              We aggregate publicly available legal records from verified government sources 
              including SAPS, court systems, and official gazettes. We do not create data. 
              We make existing public information accessible and searchable.
            </p>
          </section>

          {/* Our Commitment */}
          <section>
            <div className="flex items-center gap-3 mb-4">
              <Scale className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-gray-900">Our Commitment</h2>
            </div>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>We only report verified public records</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>We provide clear source attribution</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>We offer dispute resolution pathways</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>We comply with POPIA regulations</span>
              </li>
              <li className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
                <span>We believe transparency creates safer communities</span>
              </li>
            </ul>
          </section>

          {/* Values */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Safety First</h3>
                <p className="text-gray-600 text-sm">Every feature is designed with victim safety as the priority</p>
              </div>
              <div className="text-center p-4">
                <Eye className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Transparency</h3>
                <p className="text-gray-600 text-sm">We clearly show where data comes from and what it means</p>
              </div>
              <div className="text-center p-4">
                <Scale className="w-10 h-10 text-primary mx-auto mb-3" />
                <h3 className="font-bold text-gray-900 mb-2">Fairness</h3>
                <p className="text-gray-600 text-sm">Anyone can dispute records — we believe in due process</p>
              </div>
            </div>
          </section>

          {/* How We Help */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Help</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                Cross-reference names against South African criminal databases
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                Provide risk assessments based on public record matches
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                Connect people with safety resources and support
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">✓</span>
                Offer free safety tools and educational content
              </li>
            </ul>
          </section>

          {/* Data Sources */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Data Sources</h2>
            <p className="text-gray-700 mb-3">
              We search publicly available South African databases including:
            </p>
            <ul className="space-y-2 text-gray-700">
              <li>• SAPS Most Wanted Lists</li>
              <li>• FIC Financial Sanctions</li>
              <li>• Government Gazettes (court orders)</li>
              <li>• SAFLII Court Judgments</li>
            </ul>
            <p className="text-gray-500 text-sm mt-3">
              We do not access private databases, medical records, or sealed court records.
            </p>
          </section>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link to="/dashboard/new-check">
              <Button size="lg" className="font-heading">
                Run Your First Check →
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
