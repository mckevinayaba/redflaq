import { useState } from "react";
import { ChevronDown } from "lucide-react";

const serif: React.CSSProperties = { fontFamily: "'DM Serif Display', serif" };
const sans: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. 100% free account forever. My Safety Journal, Protection Order Guide, Affidavit Builder, Habit (coming soon), Behavioral Signal (coming soon), Safety Resources — all free. You only pay (R99–R399) when you need to verify someone's public record.",
  },
  {
    q: "How long does a check take?",
    a: "60 seconds. You enter name and ID number, we search SAPS wanted lists, SA court records, and (when available) the National Register for Sex Offenders. Results appear immediately.",
  },
  {
    q: "Is my information private and safe?",
    a: "Yes. POPIA compliant. Your data is encrypted. Your Safety Journal is SHA-256 hashed with timestamps. Only you can access your account. We never sell your data.",
  },
  {
    q: "What if I find something on someone?",
    a: "You'll see their public record — arrests, court cases, convictions. What you do with that information is your choice. We provide the facts. You make the decision.",
  },
  {
    q: "Can I use it anonymously?",
    a: "Your account requires email for security. But you can run checks without revealing your identity to the person you're checking. They will never know you verified them.",
  },
  {
    q: "What's included in the FREE account?",
    a: "Everything except public record verification. Safety Journal, Protection Order Guide, Affidavit Builder, Habit (coming soon), Behavioral Signal (coming soon), all Safety Resources, saved check history, WhatsApp support. Free forever.",
  },
  {
    q: "When do I have to pay?",
    a: "Only when you need to verify someone's public record. That's it. R99 for basic, R249 for standard, R399 for premium. One-time payment per check. No subscriptions.",
  },
];

const FAQHormozi = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" style={{ background: '#F5F0EB', padding: 'clamp(56px, 10vw, 100px) 20px' }}>
      <div style={{ maxWidth: 760, margin: '0 auto' }}>
        <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 20 }}>
          FAQ
        </div>

        <h2 style={{
          ...serif, fontSize: 'clamp(28px, 4vw, 40px)',
          color: '#1F1F1F', lineHeight: 1.15, letterSpacing: '-0.02em', marginBottom: 36,
        }}>
          Questions you might <em style={{ color: '#7C3AED', fontStyle: 'italic' }}>have.</em>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'white', border: '1px solid #E6E0DA',
                borderRadius: 16, overflow: 'hidden',
                transition: 'box-shadow 0.2s',
                boxShadow: openIndex === i ? '0 4px 16px rgba(124,58,237,0.06)' : 'none',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left' as const,
                }}
              >
                <span style={{ ...sans, fontSize: 15, fontWeight: 600, color: '#1F1F1F', paddingRight: 16 }}>
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  color="#7C3AED"
                  style={{
                    flexShrink: 0,
                    transition: 'transform 0.2s',
                    transform: openIndex === i ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                />
              </button>
              {openIndex === i && (
                <div style={{ padding: '0 24px 20px', borderTop: '1px solid #F0EBE5' }}>
                  <p style={{ ...sans, fontSize: 14, color: '#555', lineHeight: 1.7, paddingTop: 14 }}>
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQHormozi;
