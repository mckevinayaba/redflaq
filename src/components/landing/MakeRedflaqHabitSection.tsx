const quotes = [
  "Have you RedFlaq'd him yet?",
  "Please tell me you RedFlaq'd him.",
  "I RedFlaq everyone now.",
];

const MakeRedflaqHabitSection = () => {
  return (
    <section className="py-16 md:py-24 px-5" style={{ background: 'rgba(107, 78, 255, 0.05)' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 'clamp(26px, 4vw, 40px)',
          color: '#1F1F1F',
          letterSpacing: '-0.02em',
          marginBottom: 16,
        }}>
          A New Safety Habit for South Africa
        </h2>

        <div style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 15,
          color: '#555555',
          lineHeight: 1.8,
          marginBottom: 40,
        }}>
          <p style={{ marginBottom: 20 }}>
            Women across South Africa are making RedFlaq part of their safety routine.
          </p>
          <p style={{ margin: 0 }}>
            Before the first date.<br />
            Before giving someone keys.<br />
            Before hiring someone for your home.<br />
            <strong style={{ color: '#7C3AED' }}>Before you trust, RedFlaq first.</strong>
          </p>
        </div>

        <p style={{
          fontFamily: "'Syne', sans-serif",
          fontSize: 14,
          color: '#888888',
          marginBottom: 24,
          fontWeight: 600,
        }}>
          Here's what people are saying:
        </p>

        <div className="flex flex-col items-center gap-4">
          {quotes.map((q, i) => (
            <div key={i} style={{
              background: '#FFFFFF',
              border: '1px solid #E9E3FF',
              borderRadius: 20,
              padding: '14px 28px',
              fontFamily: "'Syne', sans-serif",
              fontSize: 15,
              fontStyle: 'italic',
              color: '#7C3AED',
              fontWeight: 600,
              boxShadow: '0 2px 8px rgba(107, 78, 255, 0.08)',
              maxWidth: 380,
              width: '100%',
            }}>
              "{q}"
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MakeRedflaqHabitSection;
