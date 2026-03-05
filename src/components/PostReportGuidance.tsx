import { Link } from "react-router-dom";

interface ActionCard {
  icon: string;
  title: string;
  description: string;
  buttonText: string;
  link: string;
}

const cardsByRisk: Record<string, { icon: string; heading: string; body: string; cards: ActionCard[] }> = {
  RED: {
    icon: "🛑",
    heading: "This result is serious. Please read this.",
    body: "A HIGH RISK result means serious public-record warnings were found linked to this name. This does not mean you are in immediate danger — but it means you should not ignore what you're feeling. Your safety comes first. Do not confront this person alone. Do not dismiss this result without reading the guidance below.",
    cards: [
      {
        icon: "💬",
        title: "How to have the conversation",
        description: "Questions to ask. What to listen for. How to protect yourself during the conversation.",
        buttonText: "Read the Conversation Guide",
        link: "/safety-tips",
      },
      {
        icon: "🚪",
        title: "How to leave safely",
        description: "If you are in danger or need to exit this situation, you do not have to do it alone.",
        buttonText: "See Safety Resources",
        link: "/safety-tips",
      },
      {
        icon: "📞",
        title: "Talk to someone now",
        description: "GBV Command Centre — free, 24/7, confidential.",
        buttonText: "Call 0800 428 428",
        link: "tel:0800428428",
      },
    ],
  },
  ORANGE: {
    icon: "⚠️",
    heading: "This result warrants a conversation.",
    body: "A MODERATE RISK result may reflect older or less severe warnings. It does not mean this person is dangerous — but it means there is information worth exploring. A calm, honest conversation is a reasonable next step. Here is how to approach it.",
    cards: [
      {
        icon: "💬",
        title: "Questions to ask him",
        description: "A calm, non-accusatory guide to starting the conversation and reading his response.",
        buttonText: "Read the Conversation Guide",
        link: "/safety-tips",
      },
      {
        icon: "🛡️",
        title: "Trust your instincts",
        description: "His answer matters. His reaction to being asked matters more. If something still feels off — trust that.",
        buttonText: "See Safety Tips",
        link: "/safety-tips",
      },
    ],
  },
  YELLOW: {
    icon: "🔎",
    heading: "Some concerns were noted.",
    body: "A LOW RISK result means lower-level or incomplete public information was found. It may be nothing — but it is worth keeping in mind as you get to know this person better. Here are some things to consider.",
    cards: [
      {
        icon: "💬",
        title: "How to ask without accusing",
        description: "If you want to explore this further, here is a calm way to start the conversation.",
        buttonText: "Read the Conversation Guide",
        link: "/safety-tips",
      },
      {
        icon: "🧠",
        title: "General relationship safety principles",
        description: "Useful context for anyone getting to know someone new.",
        buttonText: "Read Safety Tips",
        link: "/safety-tips",
      },
    ],
  },
  GREEN: {
    icon: "⚠️",
    heading: "No records found — but this doesn't guarantee safety. Here's what to do next:",
    body: "No public-record warnings matched this name in the sources RedFlaq checks. A clear result is NOT a guarantee of someone's character. In South Africa, only 8% of rape cases result in convictions. Always trust your instincts.",
    cards: [
      {
        icon: "🛡️",
        title: "General safety principles for new relationships",
        description: "A clear result is the beginning of building trust — not the end of being careful.",
        buttonText: "Read Safety Tips",
        link: "/safety-tips",
      },
    ],
  },
};

export default function PostReportGuidance({ riskLevel }: { riskLevel: string }) {
  const config = cardsByRisk[riskLevel] || cardsByRisk.GREEN;

  return (
    <section className="mt-12 pt-10 border-t border-border">
      {/* Section heading */}
      <h2 className="font-heading text-2xl sm:text-3xl text-foreground mb-2">⚠️ What do I do with this result?</h2>
      <h3 className="font-heading text-lg sm:text-xl text-foreground mb-2">{config.heading}</h3>
      <p className="font-body text-sm sm:text-base text-muted-foreground leading-relaxed mb-8 max-w-2xl">
        {config.body}
      </p>

      {/* Action cards */}
      <div
        className={`grid gap-5 mb-10 ${
          config.cards.length === 3 ? "sm:grid-cols-3" : config.cards.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1 max-w-md"
        }`}
      >
        {config.cards.map((card) => {
          const isExternal = card.link.startsWith("tel:");
          return (
            <div
              key={card.title}
              className="bg-card border border-border rounded-xl p-6 shadow-sm flex flex-col"
            >
              <span className="text-3xl mb-3">{card.icon}</span>
              <h4 className="font-heading text-base sm:text-lg text-foreground mb-2">{card.title}</h4>
              <p className="font-body text-sm text-muted-foreground leading-relaxed mb-5 flex-1">
                {card.description}
              </p>
              {isExternal ? (
                <a
                  href={card.link}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {card.buttonText}
                </a>
              ) : (
                <Link
                  to={card.link}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground font-body font-semibold text-sm rounded-lg hover:bg-primary/90 transition-colors"
                >
                  {card.buttonText}
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Universal footer strip */}
      <div className="bg-purple-100 rounded-xl px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="font-body text-sm text-foreground">
          RedFlaq is a starting point for informed decisions — not a verdict. Always trust your instincts.
        </p>
        <a
          href="tel:0800428428"
          className="font-body text-sm font-semibold text-primary whitespace-nowrap hover:underline"
        >
          🆘 In danger right now? Call 0800 428 428 — free, 24/7
        </a>
      </div>
    </section>
  );
}
