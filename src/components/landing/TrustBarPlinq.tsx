import { Clock, Lock, Shield, Zap } from "lucide-react";

const TrustBarPlinq = () => {
  const stats = [
    { value: "<60s", label: "Results Time", Icon: Clock },
    { value: "100%", label: "Confidential", Icon: Lock },
    { value: "POPIA", label: "Compliant", Icon: Shield },
    { value: "R99", label: "Per Check", Icon: Zap },
  ];

  return (
    <section style={{
      width: '100%',
      padding: '48px 0',
      background: '#F5F0EB',
    }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E6E0DA',
                borderRadius: 16,
                padding: '28px 24px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <div style={{ position: 'relative', zIndex: 1 }}>
                <stat.Icon style={{
                  width: 22, height: 22,
                  color: '#7C3AED',
                  margin: '0 auto 12px',
                  opacity: 0.8,
                }} />
                <p style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: 36,
                  fontWeight: 700,
                  color: '#7C3AED',
                  marginBottom: 6,
                  lineHeight: 1,
                }}>
                  {stat.value}
                </p>
                <p style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: '#888888',
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
