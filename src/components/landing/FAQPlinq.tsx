import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPlinq = () => {
  const faqs = [
    {
      question: "How does RedFlaq get its information?",
      answer: "We search publicly available South African warning lists, including SAPS wanted persons and sanctions information published via OpenSanctions. We do not access private SAPS fingerprint databases or internal criminal records.",
    },
    {
      question: "Is this legal and POPIA‑friendly?",
      answer: "Yes. All information comes from publicly accessible records. Every search requires a legitimate stated purpose and consent. We minimise data collection and do not store personal information longer than needed.",
    },
    {
      question: "Will the person know I searched them?",
      answer: "No. All searches are 100% confidential. The person searched will never receive notification from RedFlaq.",
    },
    {
      question: "What information do I need to provide?",
      answer: "A full name is required. Province and age range are optional but help improve result accuracy. You also need to state your legitimate reason for searching.",
    },
    {
      question: "How accurate are the results?",
      answer: "We report exactly what appears in public‑record warning lists. We show possible matches based on name and available details. Results may include people with similar names, so always review the details carefully. No system can guarantee 100% accuracy.",
    },
    {
      question: "What happens if you find the wrong person?",
      answer: "We use name, province, and any available details to narrow matches. If we can't confirm identity with confidence, we tell you clearly in the report. You can also dispute any result you believe is incorrect.",
    },
    {
      question: "What does a \"clear\" result actually mean?",
      answer: "A \"clear\" result means no matching public‑record warnings were found in the sources we currently check. It does not mean the person has no criminal record — it means they do not appear on the public wanted or sanctions lists we monitor.",
    },
    {
      question: "Can I dispute information about me?",
      answer: "Yes. If you believe a record about you is incorrect, you can submit a dispute through our dispute page. We will review it and, where appropriate, mark the record as disputed. Some corrections must be handled directly with SAPS or the relevant authority.",
    },
  ];

  return (
    <section id="faq" className="py-24 md:py-32 bg-background">
      <div className="max-w-[800px] mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            You Have Questions. We Have Answers.
          </h2>
        </div>

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
