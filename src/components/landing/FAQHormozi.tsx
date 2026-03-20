import { useState } from "react";
import { ChevronDown } from "lucide-react";

const font: React.CSSProperties = { fontFamily: "'Syne', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const faqs = [
  {
    q: "Is it really free?",
    a: "Yes. 100% free account forever. My Safety Journal, Protection Order Guide, Affidavit Builder, Habit (coming soon), Behavioral Signal (coming soon), Safety Resources — all free. You only pay (R99–R399) when you need to verify someone's public record.",
  },
  {
    q: "How long does a check take?",
    a: "60 seconds. You enter name and ID number, we search SAPS wanted lists, SAFLII court records, and (when available) the National Register for Sex Offenders. Results appear immediately.",
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
    <section id="faq" style={{ background: '#F5F0EB', padding: 'clamp(48px, 8vw, 80px) 20px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <p style={{ ...mono, fontSize: 11, letterSpacing: '0.15em', color: '#7C3AED', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ width: 24, height: 1, background: '#7C3AED', display: 'inline-block' }} />
          FAQ
        </p>

        <h2 style={{
          ...font, fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
          color: '#1F1F1F', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 32,
        }}>
          Questions You Might Have
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'white', border: '1px solid #E6E0DA',
                borderRadius: 14, overflow: 'hidden',
                transition: 'box-shadow 0.2s',
                boxShadow: openIndex === i ? '0 4px 16px rgba(124,58,237,0.06)' : 'none',
              }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '18px 22px', background: 'none', border: 'none',
                  cursor: 'pointer', textAlign: 'left' as const,
                }}
              >
                <span style={{ ...font, fontSize: 15, fontWeight: 600, color: '#1F1F1F', paddingRight: 16 }}>
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
                <div style={{ padding: '0 22px 18px', borderTop: '1px solid #F0EBE5' }}>
                  <p style={{ ...font, fontSize: 14, color: '#555555', lineHeight: 1.7, paddingTop: 14 }}>
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
