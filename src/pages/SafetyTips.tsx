import { Link } from "react-router-dom";
import NavbarPlinq from "@/components/landing/NavbarPlinq";
import FooterPlinq from "@/components/landing/FooterPlinq";
import SafetyCardGrid from "@/components/safety/SafetyCardGrid";
import GBVResourcesSection from "@/components/safety/GBVResourcesSection";
import { Heart, Home, Users, HelpCircle } from "lucide-react";

const redFlags = [
  "He gets angry when you ask reasonable questions",
  "He rushes the relationship faster than feels comfortable",
  "He is vague or inconsistent about his past",
  "He isolates you from your friends or family",
  "He minimises or dismisses your concerns",
  "He reacts to boundaries with pressure, guilt or anger",
  "You feel like you are walking on eggshells",
  "He has explanations for everything — but nothing ever adds up",
];

const tips = [
  {
    title: "First Date Safety Checklist",
    description: "A step-by-step checklist to stay safe before meeting someone for the first time. Built for South African women.",
    href: "/safety-tips/first-date-safety",
    icon: <Heart size={24} className="text-primary" />,
    tag: "DATING SAFETY",
  },
  {
    title: "Tenant / Landlord Safety Checklist",
    description: "Essential checks before renting a property or accepting a new tenant in South Africa.",
    href: "/safety-tips/tenant-safety",
    icon: <Home size={24} className="text-primary" />,
    tag: "HOUSING SAFETY",
  },
  {
    title: "Domestic Worker / Nanny Safety Checklist",
    description: "Practical safety steps when hiring someone to work in your home or look after your children.",
    href: "/safety-tips/domestic-worker-safety",
    icon: <Users size={24} className="text-primary" />,
    tag: "HOME SAFETY",
  },
  {
    title: "Is This a Red Flag?",
    description: "A quick interactive quiz to help you identify warning signs in relationships and situations.",
    href: "/safety-tips/red-flag-quiz",
    icon: <HelpCircle size={24} className="text-primary" />,
    tag: "AWARENESS",
  },
];

const SafetyTips = () => {
  return (
    <div className="bg-background min-h-screen">
      <NavbarPlinq />
      <div className="max-w-[900px] mx-auto px-6 pt-28 pb-16">

        {/* Hero */}
        <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">SAFETY FIRST</p>
        <h1 className="font-heading text-3xl sm:text-[44px] text-foreground leading-tight mb-3">
          Information is the first step. Safety is the destination.
        </h1>
        <p className="font-body text-base sm:text-lg text-muted-foreground leading-relaxed max-w-[650px] mb-10">
          RedFlaq gives you the signal. This page helps you know what to do with it — before, during, and after.
        </p>

        {/* Card Grid */}
        <SafetyCardGrid />

        {/* GBV Resources Section */}
        <GBVResourcesSection />

        {/* Section 1 — Before You Check */}
        <section className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">BEFORE YOU CHECK</p>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">Signs worth paying attention to</h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            Your instincts often know before the data does. Here are patterns worth noticing early in any relationship, tenancy, or professional arrangement.
          </p>

          <div className="grid sm:grid-cols-2 gap-4 mb-8">
            {redFlags.map((flag) => (
              <div key={flag} className="flex items-start gap-3 bg-card border border-border rounded-xl p-5 shadow-sm">
                <span className="text-xl flex-shrink-0">🚩</span>
                <p className="font-body text-sm text-foreground leading-relaxed">{flag}</p>
              </div>
            ))}
          </div>

          <div className="bg-purple-100 rounded-xl p-6">
            <p className="font-body text-sm sm:text-base text-foreground leading-relaxed">
              Running a RedFlaq check is not a sign of distrust. It is a sign that you take your safety seriously. That is not something to apologise for.
            </p>
          </div>
        </section>

        {/* Section 2 — After a Flag */}
        <section className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">AFTER A FLAG</p>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">
            He came up flagged. You don't have to panic — and you don't have to ignore it.
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-8">
            A flag means public-record warnings exist linked to that name. It is information. What you do with it is your choice — but here is how to approach it safely.
          </p>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                num: "1",
                title: "Check your safety first",
                body: "Before you do anything, ask: Am I physically safe right now? Do I have someone I trust nearby? Do I have an exit plan? If any answer is no — do not have this conversation today.",
              },
              {
                num: "2",
                title: "Read the Conversation Guide",
                body: "We have written a step-by-step guide to help you approach this conversation calmly, ask the right questions, and listen for the right responses.",
                button: { text: "Read the Conversation Guide", href: "/conversation-guide" },
              },
              {
                num: "3",
                title: "Know when to walk away",
                body: "A man who has genuinely changed will not be threatened by an honest question. How he responds to being asked tells you everything you need to know about who he is today.",
              },
            ].map((step) => (
              <div key={step.num} className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col">
                <span className="font-heading text-4xl text-primary mb-3">{step.num}</span>
                <h3 className="font-heading text-lg text-foreground mb-2">{step.title}</h3>
                <p className="font-body text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{step.body}</p>
                {step.button && (
                  <Link
                    to={step.button.href}
                    className="inline-flex items-center justify-center px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {step.button.text}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 3 — Clear Result */}
        <section className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">WHEN THE RESULT IS CLEAR</p>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">
            A clear result is good news — and the beginning of building trust.
          </h2>
          <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed max-w-[650px] mb-6">
            No public-record warnings found means exactly that — nothing in the public record sources RedFlaq checks matched this name. It does not mean this person has never done anything wrong. It does not override your gut feeling. Use it as one piece of the picture — not the whole picture.
          </p>

          <div className="bg-purple-100 rounded-xl p-6">
            <p className="font-body text-sm sm:text-base text-foreground leading-relaxed">
              Always trust your instincts. If something feels wrong, it is worth paying attention to — even when the result is clear.
            </p>
          </div>
        </section>

        {/* Existing checklists */}
        <section className="mb-16">
          <p className="font-mono text-[11px] tracking-[0.15em] text-primary uppercase mb-2">INTERACTIVE CHECKLISTS</p>
          <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-6">Safety checklists for every situation</h2>
          <div className="grid gap-5">
            {tips.map((tip) => (
              <Link key={tip.href} to={tip.href} className="block bg-card border border-border p-7 rounded-xl shadow-sm hover:shadow-md transition-shadow no-underline">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 bg-purple-100 flex items-center justify-center flex-shrink-0 rounded-lg">{tip.icon}</div>
                  <div>
                    <span className="font-mono text-[10px] tracking-[0.1em] text-primary font-semibold">{tip.tag}</span>
                    <h3 className="font-heading text-xl text-foreground mt-1 mb-2">{tip.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="bg-primary rounded-xl p-10 text-center">
          <h2 className="font-heading text-2xl sm:text-3xl text-primary-foreground mb-2">Ready to check?</h2>
          <p className="font-body text-sm text-primary-foreground/80 mb-6">R99. Under 60 seconds. Completely confidential.</p>
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-body font-bold text-base rounded-lg hover:bg-white/90 transition-colors"
          >
            Verify Someone Now — R99
          </Link>
        </section>

        {/* SEO text block */}
        <div className="mt-10 p-8 bg-secondary border-t border-border rounded-xl">
          <p className="font-body text-sm text-muted-foreground leading-relaxed">
            These free safety tips are part of RedFlaq's mission to make South Africa safer for women and communities.
            Whether you need a first date safety checklist, a tenant background check guide, or help identifying red flags,
            we've got you covered. If anything feels off, run a{" "}
            <Link to="/signup" className="text-primary font-bold">RedFlaq public-record safety check</Link> before you decide.
          </p>
        </div>
      </div>
      <FooterPlinq />
    </div>
  );
};

export default SafetyTips;
