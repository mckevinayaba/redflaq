import { Link } from "react-router-dom";
import { useState } from "react";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import { toast } from "sonner";

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

const QuoteCard = ({ text, borderClass = "border-l-4 border-primary" }: { text: string; borderClass?: string }) => (
  <div className={`bg-card border border-border ${borderClass} rounded-xl p-5 shadow-sm mb-4`}>
    <p className="font-body text-sm sm:text-base text-foreground leading-relaxed italic">"{text}"</p>
  </div>
);

const SectionLabel = ({ label }: { label: string }) => (
  <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">{label}</p>
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
    <div className="bg-background min-h-screen">
      <NavbarPlinq />
      <div className="max-w-[900px] mx-auto px-6 pt-28 pb-16">

        {/* Hero */}
        <SectionLabel label="AFTER THE FLAG" />
        <h1 className="font-heading text-3xl sm:text-[44px] text-foreground leading-tight mb-3">
          He came up flagged. Here's what to say.
        </h1>
        <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[650px] mb-2">
          A calm, practical guide for South African women — written with safety and dignity in mind.
        </p>
        <p className="font-body text-sm text-muted-foreground italic mb-16">
          RedFlaq gives you the signal. This guide helps you decide what to do with it.
        </p>

        {/* Section 1 — Before You Say Anything */}
        <section className="mb-16">
          <SectionLabel label="BEFORE THE CONVERSATION" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-6">Check these three things first.</h2>

          <div className="bg-card border border-border rounded-xl p-6 shadow-sm mb-5">
            {["I am physically safe right now", "I have someone I trust nearby or on standby", "I have an exit plan if this conversation escalates"].map((item) => (
              <p key={item} className="font-body text-base text-foreground leading-loose flex items-start gap-3">
                <span className="text-muted-foreground">☐</span> {item}
              </p>
            ))}
          </div>

          <div className="bg-purple-100 rounded-xl p-6">
            <p className="font-body text-sm sm:text-base text-foreground font-semibold leading-relaxed">
              If any of these is not true — do not have this conversation today. Your safety always comes first.
            </p>
          </div>
        </section>

        {/* Section 2 — Opening the Conversation */}
        <section className="mb-16">
          <SectionLabel label="OPENING THE CONVERSATION" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Start with curiosity. Not accusation.</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            These questions are designed to open a dialogue without putting him on the defensive — while still being direct about what you need to know.
          </p>
          {openingQuestions.map((q) => (
            <QuoteCard key={q} text={q} />
          ))}
        </section>

        {/* Section 3 — If He Gets Defensive */}
        <section className="mb-16">
          <SectionLabel label="IF HE REACTS BADLY" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">His reaction tells you everything.</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            You do not need to apologise for asking. If he becomes angry, dismissive, or manipulative when you ask a reasonable question about safety — that reaction is its own answer.
          </p>
          {defensiveResponses.map((r) => (
            <QuoteCard key={r} text={r} />
          ))}
          <div className="bg-purple-100 rounded-xl p-6 mt-4">
            <p className="font-body text-sm sm:text-base text-foreground leading-relaxed">
              A man who has genuinely changed will not be threatened by an honest question. His reaction — not just his answer — is the most important information you will get from this conversation.
            </p>
          </div>
        </section>

        {/* Section 4 — Understanding the Past */}
        <section className="mb-16">
          <SectionLabel label="UNDERSTANDING WHAT HAPPENED" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-6">If he is willing to talk, here is what to explore.</h2>
          {understandQuestions.map((q) => (
            <QuoteCard key={q} text={q} />
          ))}
        </section>

        {/* Section 5 — Risk Questions */}
        <section className="mb-16">
          <SectionLabel label="UNDERSTANDING THE RISK" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-6">Before you decide, ask these.</h2>
          {riskQuestions.map((q) => (
            <QuoteCard key={q} text={q} />
          ))}
        </section>

        {/* Section 6 — Mistaken Identity */}
        <section className="mb-16">
          <SectionLabel label="WHAT IF IT'S WRONG?" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Mistakes happen. Here is how to tell the difference.</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            Public records are not perfect. Names can match incorrectly — especially common South African surnames. If he tells you it is a case of mistaken identity, that may be true. Here is what a genuine mistaken identity response usually looks like — and what it does not look like.
          </p>

          <div className="grid sm:grid-cols-2 gap-5 mb-6">
            <div className="bg-card border border-border border-l-4 border-l-success rounded-xl p-6 shadow-sm">
              <h4 className="font-heading text-base text-foreground mb-4">Signs it may genuinely be mistaken identity</h4>
              {genuineSigns.map((s) => (
                <p key={s} className="font-body text-sm text-muted-foreground leading-loose flex items-start gap-2">
                  <span className="text-success flex-shrink-0">✓</span> {s}
                </p>
              ))}
            </div>
            <div className="bg-card border border-border border-l-4 border-l-destructive rounded-xl p-6 shadow-sm">
              <h4 className="font-heading text-base text-foreground mb-4">Signs to be cautious about</h4>
              {cautionSigns.map((s) => (
                <p key={s} className="font-body text-sm text-muted-foreground leading-loose flex items-start gap-2">
                  <span className="text-destructive flex-shrink-0">✗</span> {s}
                </p>
              ))}
            </div>
          </div>

          <div className="bg-purple-100 rounded-xl p-6">
            <p className="font-body text-sm sm:text-base text-foreground leading-relaxed mb-4">
              RedFlaq offers a formal dispute process for anyone who believes a public-record result is incorrectly linked to their name. If he believes this is a mistake, he can submit a dispute at redflaq.com/dispute. A person who is genuinely innocent will welcome this option — not resist it.
            </p>
            <Link
              to="/dispute"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              View the Dispute Process
            </Link>
          </div>
        </section>

        {/* Section 7 — After the Conversation */}
        <section className="mb-16">
          <SectionLabel label="AFTER YOU TALK" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Whatever you decide — you made an informed choice. That matters.</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            There is no single right outcome from this conversation. Some women will choose to leave. Some will choose to stay and watch carefully. Some will find the result was a mistake and move forward with more confidence. All of these are valid — as long as your decision is informed, not pressured.
          </p>

          <div className="grid sm:grid-cols-3 gap-5">
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <span className="text-3xl mb-3">🚪</span>
              <h4 className="font-heading text-base text-foreground mb-2">If you decide to leave</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                You do not owe anyone an explanation for choosing your own safety. If you need support leaving safely — practically or emotionally — these resources are here for you.
              </p>
              <Link to="/safety-tips#danger" className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors">
                See Safety Resources
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <span className="text-3xl mb-3">👁️</span>
              <h4 className="font-heading text-base text-foreground mb-2">If you decide to stay and watch</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                That is your right. Keep trusting your instincts. Notice how he behaves over the next weeks. A person who has genuinely changed will show you — consistently, not just when he is being watched.
              </p>
              <Link to="/safety-tips" className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors">
                Read Safety Tips
              </Link>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
              <span className="text-3xl mb-3">✅</span>
              <h4 className="font-heading text-base text-foreground mb-2">If it turned out to be a mistake</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                A clear outcome after a difficult conversation can actually strengthen trust — if it is handled honestly on both sides. You asked. He answered. You used the information. That is exactly what RedFlaq is for.
              </p>
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors">
                Run Another Check
              </Link>
            </div>
          </div>
        </section>

        {/* Section 8 — Share This Guide */}
        <section className="mb-16">
          <SectionLabel label="SHARE THIS" />
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Know a woman who needs this?</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-6">
            This guide exists because a real woman asked a real question. Share it with someone who might need it — even if they have never used RedFlaq.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="https://wa.me/?text=RedFlaq%20has%20a%20free%20conversation%20guide%20for%20after%20a%20background%20check%20flag%3A%20https%3A%2F%2Fredflaq.com%2Fconversation-guide"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:bg-primary/90 transition-colors"
            >
              Share on WhatsApp
            </a>
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center justify-center px-6 py-3 border-2 border-primary text-primary font-body font-bold text-sm rounded-lg hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary rounded-xl p-10 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-primary-foreground mb-2">Haven't checked yet?</h2>
          <p className="font-body text-sm text-primary-foreground/80 mb-1">R99. Under 60 seconds. Completely confidential.</p>
          <p className="font-body text-sm text-primary-foreground/70 mb-6">No fingerprints. No police station.</p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-body font-bold text-base rounded-lg hover:bg-white/90 transition-colors"
          >
            Verify Someone Now — R99
          </Link>
        </section>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default ConversationGuide;
