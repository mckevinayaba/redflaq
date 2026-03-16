import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FAQPlinq = () => {
  const { ref, isVisible } = useScrollReveal();

  const faqs = [
    { question: "How does RedFlaq get its information?", answer: "We search publicly available South African warning lists, including wanted persons notices and other public-record sources. We do not access private SAPS fingerprint databases or internal criminal records." },
    { question: "Is this legal and POPIA-friendly?", answer: "Yes. All information comes from publicly accessible records. Every search requires a legitimate stated purpose and consent." },
    { question: "Will the person know I searched them?", answer: "No. All searches are 100% confidential. The person searched will never receive notification from RedFlaq." },
    { question: "What information do I need to provide?", answer: "A full name is required. Province is optional but helps improve accuracy. You also need to state your legitimate reason for searching." },
    { question: "How accurate are the results?", answer: "We report exactly what appears in public-record warning lists. Results may include people with similar names, so always review the details carefully. No system can guarantee 100% accuracy." },
    { question: 'What does a "clear" result actually mean?', answer: 'A "clear" result means no matching warnings were found in the sources we currently check. It does not mean the person has no criminal record — it means they do not appear on the public warning lists we monitor.' },
    { question: "Can I dispute information about me?", answer: "Yes. If you believe a record about you is incorrect, you can submit a dispute through our dispute page. We will review it and, where appropriate, mark the record as disputed." },
    { question: "What if I find the wrong person?", answer: "We use name, province, and any available details to narrow matches. If we can't confirm identity with confidence, we tell you clearly in the report." },
  ];

  return (
    <section id="faq" ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''}`} style={{
      background: '#FAFAF8', borderTop: '1px solid #E6E0DA', borderBottom: '1px solid #E6E0DA',
    }}>
      <div className="py-16 md:py-24 px-6" style={{ maxWidth: 700, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6B4EFF',
          }}>FAQ</span>
          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(28px, 4vw, 44px)', color: '#1F1F1F',
            marginTop: 12, letterSpacing: '-0.02em',
          }}>
            You have questions. We have <em style={{ color: '#6B4EFF', fontStyle: 'italic' }}>answers.</em>
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              style={{
                background: '#FFFFFF', border: '1px solid #E6E0DA',
                borderRadius: 6, overflow: 'hidden',
              }}
              className="px-5"
            >
              <AccordionTrigger
                className="text-left text-[14px] font-semibold hover:no-underline py-4"
                style={{ color: '#1F1F1F', fontFamily: "'Syne', sans-serif" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="leading-relaxed pb-4"
                style={{ color: '#555555', fontFamily: "'Syne', sans-serif", fontSize: 14 }}
              >
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
