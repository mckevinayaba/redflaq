import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Eye, Scale, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-3xl font-bold font-heading">About RedFlaq</h1>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
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

          {/* Part of Setup A Startup */}
          <section className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🏢 A Setup A Startup Initiative
            </h3>
            <p className="text-gray-700">
              RedFlaq is proudly developed as part of the Setup A Startup program, 
              focused on building technology solutions that create positive social impact in South Africa.
            </p>
          </section>

          {/* CTA */}
          <div className="text-center pt-4">
            <Link to="/">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                💜 Start Your Search
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
