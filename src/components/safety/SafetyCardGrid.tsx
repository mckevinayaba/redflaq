import { Link } from "react-router-dom";
import { Phone, Heart, Home, Baby, CheckCircle, Scale } from "lucide-react";

const cards = [
  {
    icon: Phone,
    title: "Get Help Now",
    description: "Free GBV support in all 9 provinces",
    href: "/safety-tips#get-help",
    isAnchor: true,
    urgent: true,
  },
  {
    icon: Heart,
    title: "Dating Safety",
    description: "Meeting someone from online safely",
    href: "/safety-tips/first-date-safety",
  },
  {
    icon: Home,
    title: "Roommate & Tenant Safety",
    description: "Verify before you move in",
    href: "/safety-tips/tenant-safety",
  },
  {
    icon: Baby,
    title: "Domestic Worker Safety",
    description: "Screening nannies and household staff",
    href: "/safety-tips/domestic-worker-safety",
  },
  {
    icon: CheckCircle,
    title: "Red Flag Quiz",
    description: "Test your safety awareness",
    href: "/safety-tips/red-flag-quiz",
  },
  {
    icon: Scale,
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
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.title}
            to={card.href}
            onClick={card.isAnchor ? (e) => handleAnchorClick(e, card.href) : undefined}
            className="group relative flex flex-col no-underline transition-all duration-300 hover:-translate-y-1.5"
            style={{
              borderRadius: 16,
              padding: '28px 24px',
              background: card.urgent
                ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)'
                : 'linear-gradient(135deg, #7C3AED 0%, #EDE9FE 100%)',
              boxShadow: card.urgent
                ? '0 4px 24px rgba(220, 38, 38, 0.18)'
                : '0 4px 24px rgba(124, 58, 237, 0.08)',
            }}
          >
            {/* Icon circle */}
            <div
              className="flex items-center justify-center flex-shrink-0 mb-4"
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: card.urgent ? 'rgba(255,255,255,0.2)' : 'rgba(124, 58, 237, 0.85)',
              }}
            >
              <Icon size={24} color="#FFFFFF" strokeWidth={2} />
            </div>

            <h3
              style={{
                fontFamily: "'Syne', var(--font-heading)",
                fontSize: 20,
                fontWeight: 700,
                color: card.urgent ? '#FFFFFF' : '#1F1F2E',
                marginBottom: 6,
              }}
            >
              {card.title}
            </h3>

            <p
              style={{
                fontSize: 14,
                lineHeight: 1.6,
                color: card.urgent ? 'rgba(255,255,255,0.9)' : '#6B7280',
                flex: 1,
                marginBottom: 16,
              }}
              className="font-body"
            >
              {card.description}
            </p>

            <span
              className="inline-flex items-center justify-center self-start font-body font-semibold transition-all duration-200"
              style={{
                fontSize: 12,
                padding: '6px 16px',
                borderRadius: 999,
                background: card.urgent ? 'rgba(255,255,255,0.25)' : '#7C3AED',
                color: '#FFFFFF',
              }}
            >
              {card.urgent ? "Get Help" : "Learn More"}
            </span>
          </Link>
        );
      })}
    </div>
  );
};

export default SafetyCardGrid;
