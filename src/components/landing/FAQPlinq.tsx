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
    { question: "How does RedFlaq get its information?", answer: "We search publicly available South African warning lists, including wanted persons notices and other public‑record sources. We do not access private SAPS fingerprint databases or internal criminal records." },
    { question: "Is this legal and POPIA‑friendly?", answer: "Yes. All information comes from publicly accessible records. Every search requires a legitimate stated purpose and consent." },
    { question: "Will the person know I searched them?", answer: "No. All searches are 100% confidential. The person searched will never receive notification from RedFlaq." },
    { question: "What information do I need to provide?", answer: "A full name is required. Province is optional but helps improve accuracy. You also need to state your legitimate reason for searching." },
    { question: "How accurate are the results?", answer: "We report exactly what appears in public‑record warning lists. Results may include people with similar names, so always review the details carefully. No system can guarantee 100% accuracy." },
    { question: "What does a \"clear\" result actually mean?", answer: "A \"clear\" result means no matching warnings were found in the sources we currently check. It does not mean the person has no criminal record — it means they do not appear on the public warning lists we monitor." },
    { question: "Can I dispute information about me?", answer: "Yes. If you believe a record about you is incorrect, you can submit a dispute through our dispute page. We will review it and, where appropriate, mark the record as disputed." },
    { question: "What if I find the wrong person?", answer: "We use name, province, and any available details to narrow matches. If we can't confirm identity with confidence, we tell you clearly in the report." },
  ];

  return (
    <section id="faq" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''} py-12 md:py-20 px-6`} style={{
      background: 'linear-gradient(180deg, #0F0A1A 0%, #110D1F 100%)',
    }}>
      <div style={{ maxWidth: 700, margin: '0 auto' }}>
        <div className="section-tag justify-center" style={{ color: '#A855F7', marginBottom: 16 }}>FAQ</div>

        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(32px, 4vw, 44px)', color: 'white', textAlign: 'center', marginBottom: 48, letterSpacing: '-0.02em',
        }}>
          You have questions. We have <em style={{ color: '#A855F7', fontStyle: 'italic' }}>answers.</em>
        </h2>

        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              style={{
                background: 'rgba(124, 58, 237, 0.06)',
                border: '1px solid rgba(124, 58, 237, 0.15)',
                borderRadius: 12,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
              }}
              className="data-[state=open]:!border-[rgba(124,58,237,0.4)] px-6"
            >
              <AccordionTrigger
                className="text-left text-[15px] font-semibold hover:no-underline py-5"
                style={{ color: 'white', fontFamily: "'Syne', sans-serif" }}
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent
                className="leading-relaxed pb-5"
                style={{ color: 'rgba(255,255,255,0.6)', fontFamily: "'Syne', sans-serif", fontSize: 14 }}
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
