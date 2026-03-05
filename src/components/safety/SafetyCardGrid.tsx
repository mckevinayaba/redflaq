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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 mb-12 sm:mb-16">
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
              padding: '20px 16px',
              background: card.urgent
                ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)'
                : '#FFFFFF',
              border: card.urgent ? 'none' : '1px solid rgba(214,211,205,0.6)',
              boxShadow: card.urgent
                ? '0 4px 24px rgba(220, 38, 38, 0.18)'
                : '0 2px 12px rgba(0,0,0,0.04)',
            }}
          >
            {/* Icon circle */}
            <div
              className="flex items-center justify-center flex-shrink-0 mb-3 sm:mb-4"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: card.urgent ? 'rgba(255,255,255,0.2)' : 'rgba(124, 58, 237, 0.08)',
              }}
            >
              <Icon size={20} color={card.urgent ? '#FFFFFF' : '#7C3AED'} strokeWidth={2} />
            </div>

            <h3
              className="font-body text-[15px] sm:text-lg font-bold mb-1 sm:mb-1.5"
              style={{
                color: card.urgent ? '#FFFFFF' : '#1F1F2E',
              }}
            >
              {card.title}
            </h3>

            <p
              className="font-body text-[12px] sm:text-[13px] leading-relaxed flex-1 mb-3 sm:mb-4"
              style={{
                color: card.urgent ? 'rgba(255,255,255,0.9)' : '#6B7280',
              }}
            >
              {card.description}
            </p>

            <span
              className="inline-flex items-center justify-center self-start font-body font-semibold transition-all duration-200"
              style={{
                fontSize: 11,
                padding: '5px 14px',
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
