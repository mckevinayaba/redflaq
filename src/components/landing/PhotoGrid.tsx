import { Shield, Heart, Eye, Check, Lock } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const icons = [
  { Icon: Shield, label: "PROTECTION" },
  { Icon: Heart, label: "SAFETY" },
  { Icon: Eye, label: "AWARENESS" },
  { Icon: Check, label: "VERIFICATION" },
  { Icon: Lock, label: "PRIVACY" },
];

const PhotoGrid = () => {
  const { ref, isVisible } = useScrollReveal();

  return (
    <section ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '0 60px 100px', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: 16,
      }}>
        {icons.map(({ Icon, label }) => (
          <div
            key={label}
            className="group hover:bg-[#FAF5FF] transition-colors"
            style={{
              background: 'white', border: '1.5px solid #EDE9FE',
              padding: '40px 24px', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 12,
            }}
          >
            <Icon className="h-10 w-10 transition-transform group-hover:scale-110" style={{ color: '#7C3AED' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7C3AED' }}>{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhotoGrid;
