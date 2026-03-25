import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { HelpCircle, Mail, Phone, FileText, Shield } from "lucide-react";

const faqs = [
  { q: "What does RedFlaq search?", a: "We scan the RedFlaq Verified Public Records Network, which includes South African public-record warning lists and sanctions databases." },
  { q: "Is the person I search notified?", a: "No. All searches are 100% confidential. The person you check will never know." },
  { q: "What does a 'Clear' result mean?", a: "It means no matches were found in the public sources we check. It is not a guarantee of someone's character." },
  { q: "Can I dispute a result?", a: "Yes. Every report includes a 'Dispute this record' option if you believe the information is incorrect." },
];

export default function DashboardHelp() {
  return (
    <DashboardLayout>
      <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase mb-1">Support</p>
      <h1 className="font-heading text-2xl sm:text-3xl text-foreground mb-6 sm:mb-8">Help & Support</h1>

      <div className="max-w-3xl space-y-8">
        {/* Contact */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="font-heading text-lg text-foreground mb-4">Contact us</h2>
          <div className="space-y-3">
            <a href="mailto:support@redflaq.com" className="flex items-center gap-3 text-primary hover:underline font-body text-sm">
              <Mail className="h-4 w-4" /> support@redflaq.com
            </a>
            <p className="text-muted-foreground font-body text-xs mt-2">Emergency: SAPS 10111 · Crime Stop 08600 10111</p>
          </div>
        </div>

        {/* FAQ */}
        <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
          <h2 className="font-heading text-lg text-foreground mb-4">Frequently asked questions</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-body text-sm font-semibold text-foreground mb-1">{faq.q}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap gap-4">
          <Link to="/terms" className="flex items-center gap-2 text-primary hover:underline font-body text-sm">
            <FileText className="h-4 w-4" /> Terms of Service
          </Link>
          <Link to="/privacy" className="flex items-center gap-2 text-primary hover:underline font-body text-sm">
            <Shield className="h-4 w-4" /> Privacy Policy
          </Link>
          <Link to="/dispute" className="flex items-center gap-2 text-primary hover:underline font-body text-sm">
            <HelpCircle className="h-4 w-4" /> Dispute a record
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
