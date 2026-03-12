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
      background: 'linear-gradient(135deg, #0F0624 0%, #1B0D3A 100%)',
      borderRadius: 24,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '70%', height: '50%',
        background: 'radial-gradient(ellipse, rgba(107,78,255,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div className="relative z-10">
        <p className="font-mono text-[11px] tracking-[0.15em] mb-3 flex items-center gap-3" style={{ color: 'hsl(var(--primary))' }}>
          <span style={{ width: 24, height: 1, background: 'hsl(var(--primary))', display: 'inline-block' }} />
          Safety Resources
        </p>
        <h2 className="font-heading text-[24px] sm:text-[32px] mb-8 leading-tight" style={{ color: '#FFFFFF' }}>
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
                className="group relative flex flex-col no-underline transition-all duration-300 hover:-translate-y-1.5"
                style={{
                  borderRadius: 20,
                  padding: '24px 20px',
                  background: card.urgent
                    ? 'linear-gradient(135deg, #991B1B 0%, #DC2626 100%)'
                    : 'rgba(255,255,255,0.04)',
                  border: card.urgent
                    ? '1px solid rgba(220,38,38,0.4)'
                    : '1px solid rgba(107,78,255,0.15)',
                  boxShadow: card.urgent
                    ? '0 4px 30px rgba(220,38,38,0.25), inset 0 1px 0 rgba(255,255,255,0.1)'
                    : '0 2px 12px rgba(0,0,0,0.1)',
                  backdropFilter: 'blur(8px)',
                }}
                onMouseEnter={e => {
                  if (!card.urgent) {
                    e.currentTarget.style.borderColor = 'rgba(107,78,255,0.4)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(107,78,255,0.2)';
                  } else {
                    e.currentTarget.style.boxShadow = '0 8px 40px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={e => {
                  if (!card.urgent) {
                    e.currentTarget.style.borderColor = 'rgba(107,78,255,0.15)';
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.1)';
                  } else {
                    e.currentTarget.style.boxShadow = '0 4px 30px rgba(220,38,38,0.25), inset 0 1px 0 rgba(255,255,255,0.1)';
                  }
                }}
              >
                {card.urgent && (
                  <div style={{
                    position: 'absolute', top: -20, right: -20, width: 120, height: 120,
                    background: 'radial-gradient(circle, rgba(239,68,68,0.3), transparent 70%)',
                    filter: 'blur(20px)', pointerEvents: 'none',
                  }} />
                )}

                <div
                  className="flex items-center justify-center flex-shrink-0 mb-3 sm:mb-4 relative z-10"
                  style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: card.urgent ? 'rgba(255,255,255,0.2)' : 'rgba(107,78,255,0.12)',
                  }}
                >
                  <Icon size={20} color={card.urgent ? '#FFFFFF' : 'hsl(var(--primary))'} strokeWidth={2} />
                </div>

                <h3 className="font-body text-[15px] sm:text-lg font-bold mb-1 sm:mb-1.5 relative z-10" style={{ color: '#FFFFFF' }}>
                  {card.title}
                </h3>

                <p className="font-body text-[12px] sm:text-[13px] leading-relaxed flex-1 mb-3 sm:mb-4 relative z-10"
                  style={{ color: card.urgent ? 'rgba(255,255,255,0.85)' : '#C8C3D6' }}>
                  {card.description}
                </p>

                <span
                  className="inline-flex items-center justify-center self-start font-body font-semibold transition-all duration-200 relative z-10"
                  style={{
                    fontSize: 11, padding: '6px 16px', borderRadius: 999,
                    background: card.urgent ? 'rgba(255,255,255,0.25)' : 'linear-gradient(135deg, #6B4EFF, #8B6CFF)',
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
