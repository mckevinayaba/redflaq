import { Link } from "react-router-dom";

const cards = [
  {
    emoji: "🆘",
    title: "Get Help Now",
    description: "Free GBV support in all 9 provinces",
    href: "/safety-tips#get-help",
    isAnchor: true,
    urgent: true,
  },
  {
    emoji: "💑",
    title: "Dating Safety",
    description: "Meeting someone from online safely",
    href: "/safety-tips/first-date-safety",
  },
  {
    emoji: "🏠",
    title: "Roommate & Tenant Safety",
    description: "Verify before you move in",
    href: "/safety-tips/tenant-safety",
  },
  {
    emoji: "👶",
    title: "Domestic Worker Safety",
    description: "Screening nannies and household staff",
    href: "/safety-tips/domestic-worker-safety",
  },
  {
    emoji: "✅",
    title: "Red Flag Quiz",
    description: "Test your safety awareness",
    href: "/safety-tips/red-flag-quiz",
  },
  {
    emoji: "⚖️",
    title: "Protection Orders",
    description: "Free at any Magistrate's Court",
    href: "/safety-tips#protection-orders",
    isAnchor: true,
  },
];

const SafetyCardGrid = () => {
  const handleAnchorClick = (e: React.MouseEvent, href: string) => {
    if (href.includes("#")) {
      e.preventDefault();
      const id = href.split("#")[1];
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
      {cards.map((card) => (
        <Link
          key={card.title}
          to={card.href}
          onClick={card.isAnchor ? (e) => handleAnchorClick(e, card.href) : undefined}
          className={`group relative flex flex-col rounded-2xl border p-6 no-underline transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${
            card.urgent
              ? "bg-destructive border-destructive text-destructive-foreground shadow-md"
              : "bg-card border-border text-card-foreground shadow-sm hover:border-primary/30"
          }`}
        >
          <span className="text-3xl mb-3">{card.emoji}</span>
          <h3 className={`font-heading text-lg font-bold mb-1.5 ${card.urgent ? "text-destructive-foreground" : "text-foreground"}`}>
            {card.title}
          </h3>
          <p className={`font-body text-sm leading-relaxed flex-1 mb-4 ${card.urgent ? "text-destructive-foreground/85" : "text-muted-foreground"}`}>
            {card.description}
          </p>
          <span
            className={`inline-flex items-center text-xs font-semibold font-heading tracking-wide uppercase ${
              card.urgent
                ? "text-destructive-foreground/90"
                : "text-primary group-hover:text-primary/80"
            }`}
          >
            {card.urgent ? "Get Help →" : "Learn More →"}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default SafetyCardGrid;
