const TrustBarPlinq = () => {
  const stats = [
    { value: "<60s", label: "Results Time", icon: "⏱️" },
    { value: "100%", label: "Confidential", icon: "🔒" },
    { value: "POPIA", label: "Aware", icon: "✓" },
    { value: "R99", label: "Per Check", icon: "💰" },
  ];

  return (
    <section style={{ width: '100%', padding: '28px 0', background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center text-white">
              <span style={{ fontSize: 20 }}>{stat.icon}</span>
              <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 700, marginBottom: 2, marginTop: 4 }}>{stat.value}</p>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, opacity: 0.7, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBarPlinq;
