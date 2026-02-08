import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPlinq = () => {
  const faqs = [
    {
      question: "How does RedFlaq get criminal records?",
      answer: "We search publicly available South African government databases: SAPS wanted persons, SAFLII court judgments, and official gazettes. All sources are legal and POPIA compliant.",
    },
    {
      question: "Why does it take 2-5 minutes?",
      answer: "We verify matches manually to avoid false positives. South Africa has many people with the same name. We confirm date of birth and location before reporting.",
    },
    {
      question: "Will they know I searched them?",
      answer: "No. All searches are 100% confidential. The person searched will never receive notification.",
    },
    {
      question: "What information do I need?",
      answer: "Full name and SA ID number provide best results. You can also search by name + date of birth + province.",
    },
    {
      question: "Is this legal?",
      answer: "Yes. All information comes from publicly accessible government records. We comply with POPIA regulations.",
    },
    {
      question: "How accurate are results?",
      answer: "We report exactly what appears in official records. Every result includes source links and verification dates. You can dispute any result.",
    },
    {
      question: "Why can't I search protection orders?",
      answer: "Protection orders are not publicly accessible online in South Africa. They require court visits or legal requests.",
    },
    {
      question: "What if you find the wrong person?",
      answer: "We use ID number, date of birth, and location to verify identity. If we can't confirm with confidence, we tell you clearly in the report.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-background">
      <div className="max-w-[800px] mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            You Have Questions. We Have Answers.
          </h2>
        </div>

        {/* FAQ Accordion */}
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem 
              key={index} 
              value={`item-${index}`}
              className="bg-card border border-border rounded-2xl px-6 data-[state=open]:shadow-md transition-shadow"
            >
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:no-underline py-6">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQPlinq;
