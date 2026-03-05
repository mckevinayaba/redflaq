import { Clock, Lock, Shield, Zap } from "lucide-react";

const TrustBarPlinq = () => {
  const stats = [
    { value: "<60s", label: "Results Time", Icon: Clock, glow: 'rgba(168,85,247,0.3)' },
    { value: "100%", label: "Confidential", Icon: Lock, glow: 'rgba(124,58,237,0.3)' },
    { value: "POPIA", label: "Compliant", Icon: Shield, glow: 'rgba(109,40,217,0.3)' },
    { value: "R99", label: "Per Check", Icon: Zap, glow: 'rgba(168,85,247,0.3)' },
  ];

  return (
    <section style={{
      width: '100%',
      padding: '48px 0',
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #110D1F 100%)',
    }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: 'rgba(124, 58, 237, 0.08)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: 16,
                padding: '28px 24px',
                textAlign: 'center',
                backdropFilter: 'blur(12px)',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Glow behind number */}
              <div style={{
                position: 'absolute',
                top: '30%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 80,
                height: 80,
                background: `radial-gradient(circle, ${stat.glow}, transparent 70%)`,
                filter: 'blur(20px)',
                pointerEvents: 'none',
              }} />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <stat.Icon style={{
                  width: 22, height: 22,
                  color: '#A855F7',
                  margin: '0 auto 12px',
                  opacity: 0.8,
                }} />
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: 'white',
                  marginBottom: 6,
                  lineHeight: 1,
                  textShadow: `0 0 20px ${stat.glow}`,
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarPlinq;
