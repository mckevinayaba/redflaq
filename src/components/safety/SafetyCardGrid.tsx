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
    <div className="-mx-5 sm:-mx-6 px-5 sm:px-6 py-12 sm:py-16 mb-12 sm:mb-16" style={{
      background: '#FFFFFF',
      borderRadius: 24,
      border: '1px solid #E6E0DA',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div className="relative z-10">
        <p className="font-mono text-[11px] tracking-[0.15em] mb-3 flex items-center gap-3" style={{ color: '#6B4EFF' }}>
          <span style={{ width: 24, height: 1, background: '#6B4EFF', display: 'inline-block' }} />
          Safety Resources
        </p>
        <h2 className="font-heading text-[24px] sm:text-[32px] mb-8 leading-tight" style={{ color: '#1F1F1F' }}>
          Tools to keep you safe
        </h2>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                to={card.href}
                onClick={card.isAnchor ? (e) => handleAnchorClick(e, card.href) : undefined}
                className="group relative flex flex-col no-underline transition-all duration-300 hover:-translate-y-1"
                style={{
                  borderRadius: 20,
                  padding: '24px 20px',
                  background: card.urgent ? '#FEF2F2' : '#F5F0EB',
                  border: card.urgent
                    ? '1px solid rgba(229,57,53,0.25)'
                    : '1px solid #E6E0DA',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}
                onMouseEnter={e => {
                  if (card.urgent) {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(229,57,53,0.15)';
                  } else {
                    e.currentTarget.style.boxShadow = '0 8px 24px rgba(107,78,255,0.12)';
                  }
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.05)';
                }}
              >
                <div
                  className="flex items-center justify-center flex-shrink-0 mb-3 sm:mb-4 relative z-10"
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: card.urgent ? 'rgba(229,57,53,0.12)' : '#F1ECFF',
                  }}
                >
                  <Icon size={20} color={card.urgent ? '#E53935' : '#6B4EFF'} strokeWidth={2} />
                </div>

                <h3 className="font-body text-[15px] sm:text-lg font-bold mb-1 sm:mb-1.5 relative z-10" style={{ color: '#1F1F1F' }}>
                  {card.title}
                </h3>

                <p className="font-body text-[12px] sm:text-[13px] leading-relaxed flex-1 mb-3 sm:mb-4 relative z-10"
                  style={{ color: '#555555' }}>
                  {card.description}
                </p>

                <span
                  className="inline-flex items-center justify-center self-start font-body font-semibold transition-all duration-200 relative z-10"
                  style={{
                    fontSize: 11, padding: '6px 16px', borderRadius: 999,
                    background: card.urgent ? '#E53935' : '#6B4EFF',
                    color: '#FFFFFF',
                  }}
                >
                  {card.urgent ? "Get Help" : "Learn More"}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SafetyCardGrid;
