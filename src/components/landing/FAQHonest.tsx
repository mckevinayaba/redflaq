import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Lock, Clock, Check } from "lucide-react";

const FAQHonest = () => {
  const faqs = [
    {
      question: "Why does verification take 2-5 minutes?",
      answer: "We verify matches manually to avoid false positives. Common names like 'John Smith' or 'Thabo Molefe' require extra verification to ensure we're reporting on the correct person. Automated matching alone would flag innocent people."
    },
    {
      question: "What if you find someone else with the same name?",
      answer: "We use date of birth and location to narrow results. If we can't verify with confidence that a record matches the person you're searching, we tell you explicitly. We never report uncertain matches as confirmed."
    },
    {
      question: "Is this legal?",
      answer: "Yes, completely legal. All information comes from publicly accessible government sources: SAPS wanted database, court judgments on SAFLII, and government gazettes. We comply with POPIA regulations. However, you may NOT use this information for harassment, discrimination, or defamation."
    },
    {
      question: "Why don't you search by ID number?",
      answer: "ID numbers are not publicly searchable in South African criminal records. Courts typically redact them for privacy. Under POPIA, we cannot collect or process ID numbers without explicit consent. We match using name + date of birth + location—this is more accurate and legally compliant."
    },
    {
      question: "Will they know I searched them?",
      answer: "No. All searches are 100% confidential. The person searched will never receive any notification. Your search history is private and protected."
    },
    {
      question: "How accurate are the results?",
      answer: "We report exactly what appears in official government records. Every result includes source reference, verification date, and link to the original record. If you believe a record is incorrect, you can dispute it through our challenge system."
    },
    {
      question: "What if the record is wrong?",
      answer: "You can challenge any result. Click 'Challenge This Result' on your report, provide your reason and supporting documents, and we'll verify against the original source within 5 business days."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. RedFlaq is POPIA compliant. We encrypt all data, never share your searches with third parties, and allow you to request data deletion at any time. We're registered with the Information Regulator."
    }
  ];

  const trustBadges = [
    { icon: Shield, text: "100% Legal & Compliant" },
    { icon: Lock, text: "Bank-Level Encryption" },
    { icon: Clock, text: "2-5 Minute Results" },
    { icon: Check, text: "POPIA Compliant" },
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Honest Answers to Real Questions
            </h2>
            <p className="text-muted-foreground">
              We believe in transparency. Here's what you need to know.
            </p>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {trustBadges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 bg-primary/5 text-primary px-4 py-2 rounded-full text-sm font-medium"
              >
                <badge.icon className="h-4 w-4" />
                {badge.text}
              </div>
            ))}
          </div>

          {/* FAQ Accordion */}
          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground hover:no-underline py-5">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Contact */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Still have questions?
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:support@redflaq.com"
                className="text-primary hover:underline font-medium"
              >
                support@redflaq.com
              </a>
              <span className="text-muted-foreground">•</span>
              <a 
                href="https://wa.me/27663365296"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline font-medium"
              >
                WhatsApp: +27 66 336 5296
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQHonest;
