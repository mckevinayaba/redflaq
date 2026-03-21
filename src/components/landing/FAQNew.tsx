import { Shield, Lock, Clock, Check } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQNew = () => {
  const trustBadges = [
    { icon: Shield, text: "100% Legal & Compliant" },
    { icon: Lock, text: "Bank-Level Encryption" },
    { icon: Clock, text: "Results in 60 Seconds" },
    { icon: Check, text: "POPIA Compliant" },
  ];

  const faqs = [
    {
      question: "How does RedFlaq get criminal records?",
      answer: "We partner with official South African government databases, court records, and law enforcement agencies. All data sources are legal and comply with POPIA. We currently access: SAPS wanted persons database, Public court judgments (SAFLII), and Government gazettes.",
    },
    {
      question: "Is this legal? Can I get in trouble?",
      answer: "Yes, completely legal. All information comes from publicly available government sources. However, you may NOT use this information for harassment, discrimination, or defamation. RedFlaq is intended for personal safety decisions only.",
    },
    {
      question: "Will they know I checked their record?",
      answer: "No. All searches are 100% confidential. The person searched will never receive any notification. Your search history is private and protected.",
    },
    {
      question: "How accurate are the results?",
      answer: "We report exactly what appears in official government records. Every result includes: source reference, verification date, and link to original record. If you believe a record is incorrect, you can dispute it through our challenge system.",
    },
    {
      question: "What information do I need to search?",
      answer: "You can search using: Full name + date of birth, South African ID number, Court case number, or Protection order number. SA ID number provides most accurate results.",
    },
    {
      question: "Is my information safe?",
      answer: "Yes. RedFlaq is POPIA compliant. We encrypt all data, never share your searches with third parties, and allow you to request data deletion at any time.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-background">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Headline */}
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 text-center mb-4">
          You Have Questions. We Have Answers.
        </h2>
        <p className="text-lg text-gray-500 text-center mb-8">
          Real questions from South African users.
        </p>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {trustBadges.map((badge, index) => (
            <div 
              key={index}
              className="flex items-center gap-2 bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium"
            >
              <badge.icon className="h-4 w-4" />
              <span>{badge.text}</span>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card rounded-xl shadow-sm hover:shadow-md transition-shadow border-none px-6"
            >
              <AccordionTrigger className="text-left font-semibold text-gray-900 hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-gray-600 pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQNew;
