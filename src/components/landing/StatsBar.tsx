import { Clock, FileCheck, Shield } from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const StatsBar = () => {
  const { ref, isVisible } = useScrollReveal();

  const stats = [
    { icon: Clock, value: "<60 sec", label: "Average Search Time" },
    { icon: FileCheck, value: "100%", label: "Public Sources" },
    { icon: Shield, value: "POPIA", label: "Compliant" },
  ];

  return (
    <section ref={ref} className={`reveal-section ${isVisible ? 'visible' : ''} py-8`} style={{ background: '#F5F0EB', borderTop: '1px solid #E6E0DA', borderBottom: '1px solid #E6E0DA' }}>
      <div className="container mx-auto px-4">
        <div className={`grid grid-cols-3 gap-6 reveal-stagger ${isVisible ? 'visible' : ''}`}>
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center text-center reveal-child">
              <div className="icon-hover" style={{
                width: 48, height: 48, borderRadius: '50%',
                background: '#F1ECFF',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 8,
              }}>
                <stat.icon className="h-5 w-5" style={{ color: '#6B4EFF', strokeWidth: 2 }} />
              </div>
              <span className="text-2xl md:text-3xl font-bold" style={{ color: '#6B4EFF', fontFamily: "'DM Serif Display', serif" }}>{stat.value}</span>
              <span className="text-sm" style={{ color: '#555555', fontFamily: "'Syne', sans-serif" }}>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
