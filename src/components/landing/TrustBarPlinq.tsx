const TrustBarPlinq = () => {
  const stats = [
    { value: "Minutes", label: "Results Time", icon: "⏱️" },
    { value: "100%", label: "Confidential", icon: "🔒" },
    { value: "POPIA", label: "Aware", icon: "✓" },
    { value: "R149", label: "Per Check", icon: "💰" },
  ];

  return (
    <section style={{ width: '100%', padding: '32px 0', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <span style={{ fontSize: 24 }}>{stat.icon}</span>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, fontWeight: 700, marginBottom: 4, marginTop: 4 }}>{stat.value}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarPlinq;
