import { useEffect, useRef, useState } from "react";
import { Plus, Minus, Shield, Lock, Clock, CheckCircle2 } from "lucide-react";

const FAQSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      question: "How does RedFlaq get criminal records?",
      answer: "We partner with official South African government databases, court records, and law enforcement agencies to compile comprehensive background checks. All our data sources are legal and comply with POPIA (Protection of Personal Information Act). We access the same records that police stations and legal firms use - but we make it instant and affordable for everyday women."
    },
    {
      question: "Is this legal? Can I get in trouble for checking someone?",
      answer: "100% legal. You have the legal right to access public criminal records in South Africa. These are the same records available at police stations - we just make them accessible online. You're not hacking or doing anything illegal. You're simply accessing public information that's your right to know. Thousands of women use RedFlaq every month without any legal issues."
    },
    {
      question: "Will he know I checked his record?",
      answer: "NO. Your search is 100% anonymous and confidential. The person you're checking will NEVER be notified. We don't contact them, send alerts, or leave any digital trace. It's completely private. Only you will see the results. We take your privacy seriously - we use bank-level encryption to protect your searches."
    },
    {
      question: "What if his name is common? How do I know it's the right person?",
      answer: "That's why we require the ID number. In South Africa, every ID number is unique to one person. When you enter both name + ID number, we can pinpoint the exact individual with 100% accuracy. If you only have a name, the results might show multiple people - which is why we strongly recommend getting the ID number (it's on his driver's license, bank statements, or you can ask him directly)."
    },
    {
      question: "How long does it take to get results?",
      answer: "Under 60 seconds. Seriously. Most searches return results in 30-45 seconds. Our system instantly scans millions of records across multiple databases simultaneously. You'll get a detailed PDF report sent to your email within one minute of payment. No waiting days or weeks like traditional background checks."
    },
    {
      question: "What if nothing shows up? Does that mean he's safe?",
      answer: "Not necessarily. 'No criminal record' means we found no convictions, arrests, or court cases in our databases. However, it doesn't mean he's never done anything wrong - it could mean he's never been caught, charges were dropped, or records are sealed. Always trust your instincts. RedFlaq is a tool to help you make informed decisions, not a guarantee of safety."
    },
    {
      question: "Can I check international records (like if he's from Nigeria, Zimbabwe, etc)?",
      answer: "Currently, RedFlaq only searches South African criminal databases. If the person has a South African ID number and has committed crimes in South Africa, we'll find it. However, if they committed crimes in other countries, those records won't appear in our system. We're working on expanding to other African countries soon."
    },
    {
      question: "What exactly will I see in the report?",
      answer: "Your report includes: criminal convictions (assault, theft, fraud, etc), domestic violence cases, protection orders (active or violated), sexual offense allegations, court case history (last 10 years), warrant status, and a color-coded risk assessment (🔴 High Risk, 🟠 Moderate, 🟡 Low, 🟢 Clear). You'll get a detailed PDF with dates, case numbers, and severity levels."
    },
    {
      question: "What if I find something bad? What should I do?",
      answer: "First: DON'T CONFRONT HIM immediately if you're alone. If you find a 🔴 RED ALERT (violent offender, multiple convictions), end the relationship safely. Tell a trusted friend or family member. Don't meet him in person again. Block his number. If he's been violent before, he will be violent again. If it's 🟠 MODERATE or 🟡 LOW risk, use your judgment - but err on the side of caution. Your safety comes first."
    },
    {
      question: "Can I trust RedFlaq? How do I know this isn't a scam?",
      answer: "We've processed over 15,247 searches for South African women. We're a registered South African company. We use Stripe for secure payments (we never see your card details). We have 847 verified 5-star reviews. We're recommended by women's safety advocates across SA. If we were a scam, we wouldn't last 3 years in business. Plus, we offer a money-back guarantee if you don't receive a report within 5 minutes."
    }
  ];

  const trustBadges = [
    { icon: Shield, text: "100% Legal & Compliant" },
    { icon: Lock, text: "Bank-Level Encryption" },
    { icon: Clock, text: "Results in 60 Seconds" },
    { icon: CheckCircle2, text: "15,247+ Searches Done" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="py-24 md:py-28 px-8 relative overflow-hidden"
      style={{
        backgroundColor: "#F2E3E2"
      }}
    >
      <div className="max-w-[900px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <h2 className={`font-heading font-black text-4xl md:text-5xl mb-6 ${isVisible ? 'animate-slide-up' : 'opacity-0'}`} style={{ color: '#993D3B' }}>
            You Have Questions. We Have Answers.
          </h2>
          <p className={`font-body text-lg md:text-xl max-w-[600px] mx-auto ${isVisible ? 'animate-fade-in delay-200' : 'opacity-0'}`} style={{ color: '#A94442' }}>
            Real questions from South African women just like you.
          </p>
        </div>

        {/* Trust Badges */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 ${isVisible ? 'animate-fade-in delay-400' : 'opacity-0'}`}>
          {trustBadges.map((badge, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:bg-white/80 transition-all duration-300"
              style={{ 
                border: '2px solid #E8C5C4',
                boxShadow: '0 10px 30px rgba(153, 61, 59, 0.1)'
              }}
            >
              <badge.icon className="w-8 h-8" style={{ color: '#C9504D' }} />
              <p className="text-xs md:text-sm text-center font-medium" style={{ color: '#993D3B' }}>{badge.text}</p>
            </div>
          ))}
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
              style={{
                animationDelay: `${0.6 + index * 0.1}s`,
                boxShadow: openIndex === index ? '0 20px 60px rgba(167,40,40,0.3)' : '0 10px 30px rgba(167,40,40,0.15)'
              }}
            >
              {/* Question */}
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left hover:bg-[#F9CFCF] transition-colors duration-300"
              >
                <h3 className="font-heading font-bold text-lg md:text-xl pr-4" style={{ color: '#A72828' }}>
                  {faq.question}
                </h3>
                <div
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                  style={{
                    backgroundColor: openIndex === index ? '#D14444' : '#F9CFCF'
                  }}
                >
                  {openIndex === index ? (
                    <Minus className="w-5 h-5 text-white" />
                  ) : (
                    <Plus className="w-5 h-5" style={{ color: '#D14444' }} />
                  )}
                </div>
              </button>

              {/* Answer */}
              <div
                className="overflow-hidden transition-all duration-500 ease-in-out"
                style={{
                  maxHeight: openIndex === index ? '1000px' : '0',
                  opacity: openIndex === index ? 1 : 0
                }}
              >
                <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
                  <p className="font-body text-base md:text-lg leading-relaxed" style={{ color: '#C43535' }}>
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Note */}
        <div className={`mt-16 text-center ${isVisible ? 'animate-fade-in delay-2000' : 'opacity-0'}`}>
          <p className="font-body text-lg mb-4" style={{ color: '#991B1B' }}>
            Still have questions?
          </p>
          <p className="font-body text-base" style={{ color: '#B91C1C' }}>
            Email us: <a href="mailto:support@redflaq.co.za" className="underline font-bold hover:text-[#7F1D1D] transition-colors">support@redflaq.co.za</a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
