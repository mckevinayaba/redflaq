interface VerificationProgressProps {
  currentStep?: number; // 0-3
}

const steps = [
  { name: "Payment", time: "Done" },
  { name: "Searching Records", time: "~2 min" },
  { name: "Human Review", time: "~2 min" },
  { name: "Report Ready", time: "Email sent" },
];

const VerificationProgress = ({ currentStep = 1 }: VerificationProgressProps) => {
  return (
    <div style={{
      background: '#EDE9E3', border: '1.5px solid #0D0B0E', padding: '32px 40px', marginTop: 24,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: '#4B4453', marginBottom: 20,
      }}>
        Your verification is in progress
      </div>

      <div className="flex items-start justify-between" style={{ position: 'relative' }}>
        {steps.map((step, i) => {
          const state = i < currentStep ? 'done' : i === currentStep ? 'active' : 'pending';
          return (
            <div key={step.name} className="flex flex-col items-center" style={{ flex: 1, position: 'relative', zIndex: 1 }}>
              {/* Connecting line */}
              {i < steps.length - 1 && (
                <div style={{
                  position: 'absolute', top: 14, left: '50%', width: '100%', height: 0,
                  borderTop: '1.5px dashed #9CA3AF', zIndex: 0,
                }} />
              )}

              {/* Dot */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%', display: 'flex',
                alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 1,
                ...(state === 'done' ? { background: '#15803D', border: '2px solid #15803D' } :
                   state === 'active' ? { background: '#7C3AED', border: '2px solid #7C3AED', boxShadow: '0 0 0 4px rgba(124,58,237,0.15)' } :
                   { background: '#FFFFFF', border: '2px solid #9CA3AF' }),
              }}>
                {state === 'done' && <span style={{ color: 'white', fontWeight: 700, fontSize: 14 }}>✓</span>}
                {state === 'active' && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white' }} />}
              </div>

              <span style={{
                fontFamily: "'Syne', sans-serif", fontSize: 12, fontWeight: 600, marginTop: 8,
                color: state === 'done' ? '#15803D' : state === 'active' ? '#7C3AED' : '#4B4453',
              }}>
                {step.name}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 2,
              }}>
                {step.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VerificationProgress;
