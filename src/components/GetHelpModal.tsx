import { emergencyResources, supportResources, type HelpResource } from '@/data/helpResources';

interface GetHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  riskLevel?: string;
}

function ResourceCard({ resource }: { resource: HelpResource }) {
  const phoneDigits = resource.phone.replace(/\s+/g, '');
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      padding: 20,
      border: '1px solid #E5E7EB',
      borderRadius: 8,
      marginBottom: 16,
    }}>
      <span style={{ fontSize: 32, flexShrink: 0 }}>{resource.icon}</span>
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px', fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#111827' }}>
          {resource.name}
        </h4>
        <p style={{ margin: '0 0 12px', fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#6B7280' }}>
          {resource.description}
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 8 }}>
          <a
            href={`tel:${phoneDigits}`}
            style={{
              padding: '10px 16px',
              borderRadius: 6,
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: 600,
              background: '#7C3AED',
              color: 'white',
              display: 'inline-block',
            }}
          >
            📞 Call {resource.phone}
          </a>
          {resource.whatsapp && (
            <a
              href={`https://wa.me/${resource.whatsapp.replace(/[^0-9+]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '10px 16px',
                borderRadius: 6,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                background: '#25D366',
                color: 'white',
                display: 'inline-block',
              }}
            >
              💬 WhatsApp
            </a>
          )}
        </div>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#9CA3AF' }}>
          {resource.hours}
        </span>
      </div>
    </div>
  );
}

export default function GetHelpModal({ isOpen, onClose, riskLevel }: GetHelpModalProps) {
  if (!isOpen) return null;

  const isCritical = riskLevel === 'RED';

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 20,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 12,
          maxWidth: 600,
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 32,
          position: 'relative',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            fontSize: 28,
            cursor: 'pointer',
            color: '#6B7280',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          ×
        </button>

        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, color: '#111827', margin: '0 0 24px' }}>
          Get Help Now
        </h2>

        {isCritical && (
          <div style={{
            background: '#FEE2E2',
            border: '2px solid #DC2626',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            textAlign: 'center',
          }}>
            <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#DC2626', margin: 0 }}>
              ⚠️ If you're in immediate danger, call <a href="tel:10111" style={{ color: '#DC2626' }}>10111</a> now.
            </p>
          </div>
        )}

        {/* Emergency */}
        <div style={{ margin: '24px 0' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
            Emergency Support (24/7)
          </h3>
          {emergencyResources.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>

        {/* Ongoing */}
        <div style={{ margin: '32px 0' }}>
          <h3 style={{ fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700, color: '#1F2937', marginBottom: 16 }}>
            Ongoing Support
          </h3>
          {supportResources.map(r => <ResourceCard key={r.id} resource={r} />)}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '2px solid #E5E7EB', textAlign: 'center' }}>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700, color: '#6B7280', margin: '0 0 4px' }}>
            You're not alone. Help is available.
          </p>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#9CA3AF', margin: 0 }}>
            All calls and messages are confidential.
          </p>
        </div>
      </div>
    </div>
  );
}
