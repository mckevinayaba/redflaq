import { Link } from "react-router-dom";
import { useState } from "react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { toast } from "sonner";
import { ShieldCheck, MessageSquare, Eye, DoorOpen, Search } from "lucide-react";

const openingQuestions = [
  "I want us to be honest with each other. Is there anything about your past I should know before we go further?",
  "I came across some public information linked to your name. I want to give you a chance to explain before I make any decisions.",
  "I care about where this is going — and honesty matters to me. Can you tell me about [the timeframe / area the flag relates to]?",
];

const defensiveResponses = [
  "I am not attacking you. I am asking because I take my safety seriously. That is not something I am willing to apologise for.",
  "How you respond to this question tells me a lot about who you are today.",
];

const understandQuestions = [
  "Have you addressed that part of your past? What did that look like for you?",
  "Is there anyone — a counsellor, a pastor, a family member — who has walked with you through that period?",
  "What is different about who you are today compared to who you were then?",
];

const riskQuestions = [
  "Are there any active cases, protection orders, or legal matters I should know about?",
  "If I asked someone who knew you then — a neighbour, a previous partner — what would they say about how you treated people?",
];

const genuineSigns = [
  "He is calm and transparent, not angry or defensive",
  "He knows the specific details of the record without you having to share them",
  "He has documentation, or offers to get it, without being asked",
  "He acknowledges the system is imperfect and does not blame you for checking",
  "He supports you in raising a dispute and is willing to assist the process",
];

const cautionSigns = [
  "He becomes angry, manipulative, or blaming when you raise it",
  "He cannot explain the specific details of the record at all",
  "He dismisses the result entirely without engaging with it",
  "He pressures you to drop the subject quickly",
  "He makes you feel guilty for checking in the first place",
];

const QuoteCard = ({ text }: { text: string }) => (
  <div className="p-4 sm:p-5 mb-3" style={{
    background: 'rgba(124,58,237,0.04)',
    border: '1px solid rgba(124,58,237,0.12)',
    borderRadius: 14,
    borderLeft: '3px solid #7C3AED',
  }}>
    <p className="font-body text-[13px] sm:text-sm text-foreground leading-relaxed italic">"{text}"</p>
  </div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <p className="font-mono text-[11px] tracking-[0.15em] mb-3 flex items-center gap-3" style={{ color: '#A855F7' }}>
    <span style={{ width: 24, height: 1, background: '#A855F7', display: 'inline-block' }} />
    {label}
  </p>
);

const ConversationGuide = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://redflaq.com/conversation-guide");
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: '#F5F0EB', minHeight: '100vh' }}>
      <NavbarPlinq />

      {/* Hero — dark */}
      <section style={{
        background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
        paddingTop: 120, paddingBottom: 64,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
          width: '60%', height: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div className="max-w-[900px] mx-auto px-5 sm:px-6 relative z-10">
          <SectionLabel label="After the Flag" />
          <h1 className="font-heading text-[28px] sm:text-[40px] lg:text-[48px] leading-[1.05] mb-4" style={{ color: '#FFFFFF', letterSpacing: '-0.02em' }}>
            He came up flagged.<br />
            <span style={{ color: '#A855F7' }}>Here's what to say.</span>
          </h1>
          <p className="font-body text-[15px] sm:text-base leading-relaxed max-w-[560px] mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            A calm, practical guide for South African women — written with safety and dignity in mind.
          </p>
          <p className="font-body text-sm italic" style={{ color: 'rgba(255,255,255,0.4)' }}>
            RedFlaq gives you the signal. This guide helps you decide what to do with it.
          </p>
        </div>
      </section>

      <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-10 sm:py-14">

        {/* Section 1 — Before */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="Before the Conversation" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-5">Check these three things first.</h2>
          <div className="p-5 sm:p-6 mb-4" style={{
            background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 16,
          }}>
            {["I am physically safe right now", "I have someone I trust nearby or on standby", "I have an exit plan if this conversation escalates"].map((item) => (
              <p key={item} className="font-body text-[14px] sm:text-base text-foreground leading-loose flex items-start gap-3">
                <span className="text-muted-foreground">☐</span> {item}
              </p>
            ))}
          </div>
          <div className="p-5" style={{
            background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14,
          }}>
            <p className="font-body text-[13px] sm:text-sm text-foreground font-semibold leading-relaxed">
              If any of these is not true — do not have this conversation today. Your safety always comes first.
            </p>
          </div>
        </section>

        {/* Section 2 — Opening */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="Opening the Conversation" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">Start with curiosity. Not accusation.</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            These questions are designed to open a dialogue without putting him on the defensive.
          </p>
          {openingQuestions.map((q) => <QuoteCard key={q} text={q} />)}
        </section>

        {/* Section 3 — Defensive */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="If He Reacts Badly" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">His reaction tells you everything.</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            You do not need to apologise for asking. If he becomes angry, dismissive, or manipulative — that reaction is its own answer.
          </p>
          {defensiveResponses.map((r) => <QuoteCard key={r} text={r} />)}
          <div className="p-5 mt-3" style={{
            background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14,
          }}>
            <p className="font-body text-[13px] sm:text-sm text-foreground leading-relaxed">
              A man who has genuinely changed will not be threatened by an honest question. His reaction — not just his answer — is the most important information you will get.
            </p>
          </div>
        </section>

        {/* Section 4 — Understanding */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="Understanding What Happened" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-5">If he is willing to talk, here is what to explore.</h2>
          {understandQuestions.map((q) => <QuoteCard key={q} text={q} />)}
        </section>

        {/* Section 5 — Risk */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="Understanding the Risk" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-5">Before you decide, ask these.</h2>
          {riskQuestions.map((q) => <QuoteCard key={q} text={q} />)}
        </section>

        {/* Section 6 — Mistaken Identity */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="What If It's Wrong?" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">Mistakes happen. Here is how to tell the difference.</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            Public records are not perfect. Names can match incorrectly — especially common South African surnames.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="p-5 sm:p-6" style={{
              background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
              borderRadius: 16, borderLeft: '3px solid #22C55E',
            }}>
              <h4 className="font-heading text-base text-foreground mb-3">Signs it may genuinely be mistaken identity</h4>
              {genuineSigns.map((s) => (
                <p key={s} className="font-body text-[13px] text-muted-foreground leading-loose flex items-start gap-2">
                  <span style={{ color: '#22C55E' }} className="flex-shrink-0">✓</span> {s}
                </p>
              ))}
            </div>
            <div className="p-5 sm:p-6" style={{
              background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)',
              borderRadius: 16, borderLeft: '3px solid #EF4444',
            }}>
              <h4 className="font-heading text-base text-foreground mb-3">Signs to be cautious about</h4>
              {cautionSigns.map((s) => (
                <p key={s} className="font-body text-[13px] text-muted-foreground leading-loose flex items-start gap-2">
                  <span style={{ color: '#EF4444' }} className="flex-shrink-0">✗</span> {s}
                </p>
              ))}
            </div>
          </div>

          <div className="p-5" style={{
            background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14,
          }}>
            <p className="font-body text-[13px] sm:text-sm text-foreground leading-relaxed mb-3">
              RedFlaq offers a formal dispute process. If he believes this is a mistake, he can submit a dispute at redflaq.com/dispute.
            </p>
            <Link to="/dispute" className="inline-flex items-center justify-center px-5 py-2.5 font-body font-semibold text-[13px]"
              style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: 50, textDecoration: 'none' }}>
              View the Dispute Process
            </Link>
          </div>
        </section>

        {/* Section 7 — Full Names */}
        <section className="mb-12 sm:mb-16" id="names">
          <SectionLabel label="Verifying Full Names" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">How to ask about full names without causing alarm.</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            Many South Africans use 2 names publicly but have 3–4 names on their ID. Here's how to verify tactfully.
          </p>

          {[
            { title: "For Dating / Social Situations", subtitle: "Natural conversation starters", quotes: [
              "I realised I don't know your full name — what's on your ID?",
              "When we video call, can you show me your ID for a sec? I do it for everyone I meet online for safety.",
              "My friends always joke about my full name being so long — what about yours?",
            ]},
            { title: "For Employment / Tenancy", subtitle: "Professional approach — this is expected", quotes: [
              "For our records, we'll need a copy of your ID — it's standard for all applicants.",
              "Please provide your full legal name as it appears on your ID for the lease agreement.",
            ]},
            { title: "For Roommate / Shared Living", subtitle: "Casual but clear — mutual exchange", quotes: [
              "Since we're signing a lease together, let's exchange IDs so we both have each other's info.",
              "Want to swap ID photos? I always do this with roommates for safety.",
            ]},
          ].map((section) => (
            <div key={section.title} className="p-5 sm:p-6 mb-4" style={{
              background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 16,
            }}>
              <h4 className="font-heading text-base text-foreground mb-1">{section.title}</h4>
              <p className="font-mono text-[10px] tracking-[0.1em] mb-3" style={{ color: '#A855F7', textTransform: 'uppercase' }}>{section.subtitle}</p>
              {section.quotes.map(q => <QuoteCard key={q} text={q} />)}
            </div>
          ))}

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div className="p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 16, borderLeft: '3px solid #EF4444' }}>
              <h4 className="font-heading text-base text-foreground mb-3">Warning signs in their response</h4>
              {["Refuses to share full legal name", "Gets defensive or angry at a simple request", "Offers fake or altered ID", "Story about names keeps changing", "Avoids showing ID while asking to see yours"].map(s => (
                <p key={s} className="font-body text-[13px] text-muted-foreground leading-loose flex items-start gap-2">
                  <span style={{ color: '#EF4444' }} className="flex-shrink-0">✗</span> {s}
                </p>
              ))}
            </div>
            <div className="p-5" style={{ background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 16, borderLeft: '3px solid #22C55E' }}>
              <h4 className="font-heading text-base text-foreground mb-3">Normal, healthy responses</h4>
              {['"Oh sure, my full name is [3-4 names]"', '"Yeah my ID has my Xhosa names — I just use [shorter version] usually"', "Shows ID without hesitation", "Explains name difference calmly and openly"].map(s => (
                <p key={s} className="font-body text-[13px] text-muted-foreground leading-loose flex items-start gap-2">
                  <span style={{ color: '#22C55E' }} className="flex-shrink-0">✓</span> {s}
                </p>
              ))}
            </div>
          </div>

          <div className="p-5" style={{
            background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)', borderRadius: 14,
          }}>
            <p className="font-body text-[13px] sm:text-sm text-foreground leading-relaxed">
              <strong>Remember:</strong> Most people understand that asking for full legal names is normal. If someone makes you feel bad for basic safety verification — that itself is concerning.
            </p>
          </div>
        </section>

        {/* Section 8 — After the Conversation */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="After You Talk" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">Whatever you decide — you made an informed choice.</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-6">
            There is no single right outcome. All choices are valid — as long as your decision is informed, not pressured.
          </p>

          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: DoorOpen, title: "If you decide to leave", body: "You do not owe anyone an explanation for choosing your own safety.", cta: "See Safety Resources", href: "/safety-tips#danger" },
              { icon: Eye, title: "If you decide to stay and watch", body: "Keep trusting your instincts. A person who has genuinely changed will show you — consistently.", cta: "Read Safety Tips", href: "/safety-tips" },
              { icon: Search, title: "If it was a mistake", body: "A clear outcome after a difficult conversation can actually strengthen trust — if handled honestly.", cta: "Run Another Check", href: "/signup" },
            ].map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex flex-col p-5" style={{
                  background: '#FFFFFF', border: '1px solid rgba(214,211,205,0.6)', borderRadius: 16,
                }}>
                  <div className="mb-3" style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon className="w-5 h-5" style={{ color: '#7C3AED' }} />
                  </div>
                  <h4 className="font-heading text-base text-foreground mb-2">{step.title}</h4>
                  <p className="font-body text-[13px] text-muted-foreground leading-relaxed flex-1 mb-4">{step.body}</p>
                  <Link to={step.href} className="inline-flex items-center justify-center px-5 py-2.5 font-body font-semibold text-[13px] self-start"
                    style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: 50, textDecoration: 'none' }}>
                    {step.cta}
                  </Link>
                </div>
              );
            })}
          </div>
        </section>

        {/* Share */}
        <section className="mb-12 sm:mb-16">
          <SectionLabel label="Share This" />
          <h2 className="font-heading text-[22px] sm:text-[28px] text-foreground mb-2">Know a woman who needs this?</h2>
          <p className="font-body text-sm text-muted-foreground leading-relaxed max-w-[600px] mb-5">
            Share it with someone who might need it — even if they have never used RedFlaq.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="https://wa.me/?text=RedFlaq%20has%20a%20free%20conversation%20guide%20for%20after%20a%20background%20check%20flag%3A%20https%3A%2F%2Fredflaq.com%2Fconversation-guide"
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 font-body font-bold text-[14px]"
              style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 16px rgba(124,58,237,0.3)' }}
            >
              Share on WhatsApp
            </a>
            <button onClick={handleCopyLink}
              className="inline-flex items-center justify-center px-6 py-3 font-body font-bold text-[14px] transition-all"
              style={{ background: 'transparent', border: '1.5px solid #7C3AED', color: '#7C3AED', borderRadius: 50, cursor: 'pointer' }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </section>

        {/* Footer CTA — dark */}
        <section className="p-8 sm:p-12 text-center" style={{
          background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 100%)',
          borderRadius: 24, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            width: '60%', height: '60%',
            background: 'radial-gradient(circle, rgba(124,58,237,0.2), transparent 70%)',
            filter: 'blur(40px)', pointerEvents: 'none',
          }} />
          <div className="relative z-10">
            <h2 className="font-heading text-[22px] sm:text-[28px] mb-2" style={{ color: '#FFFFFF' }}>Haven't checked yet?</h2>
            <p className="font-body text-sm mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>R99. Under 60 seconds. Completely confidential.</p>
            <p className="font-body text-sm mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>No fingerprints. No police station.</p>
            <Link to="/signup" className="inline-flex items-center justify-center px-8 py-3 font-body font-bold text-base"
              style={{ background: '#7C3AED', color: '#FFFFFF', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 20px rgba(124,58,237,0.35)' }}>
              Verify Someone Now — R99
            </Link>
          </div>
        </section>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default ConversationGuide;
