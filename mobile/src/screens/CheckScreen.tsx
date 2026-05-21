import React, { useState, useEffect, useRef } from 'react';
import { SavedCheck } from '../hooks/useSavedChecks';

type Step = 'form' | 'pricing' | 'loading' | 'results';
type RiskLevel = 'CLEAR' | 'LOW' | 'MEDIUM' | 'HIGH';
type PackageType = 'single' | 'triple' | 'family';

interface CheckScreenProps {
  onSave: (check: SavedCheck) => void;
}

const PROVINCES = ['Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape'];
const REASONS = ['💜 Romantic partner','Flatmate / apartment','Tenant screening','Childcare / home helper','Business partner','Employer verification','Other'];
const PACKAGES: { id: PackageType; label: string; credits: number; price: number; note: string }[] = [
  { id: 'single', label: 'One Check', credits: 1, price: 99, note: 'Best for one-time checks' },
  { id: 'triple', label: 'Safety Pack', credits: 3, price: 249, note: 'Save R48 — 3 checks' },
  { id: 'family', label: 'Family & Friends', credits: 5, price: 399, note: 'Save R96 — 5 checks' },
];

function getMockRisk(name: string): RiskLevel {
  const lower = name.toLowerCase();
  if (lower.includes('high') || lower.includes('test')) return 'HIGH';
  if (lower.includes('warn') || lower.includes('medium')) return 'MEDIUM';
  if (lower.includes('low')) return 'LOW';
  return 'CLEAR';
}

function getMockScore(risk: RiskLevel): number {
  if (risk === 'HIGH') return 87;
  if (risk === 'MEDIUM') return 54;
  if (risk === 'LOW') return 28;
  return 4;
}

function getRiskConfig(risk: RiskLevel) {
  if (risk === 'HIGH') return { color: '#C0392B', bg: 'rgba(192,57,43,0.12)', label: 'SERIOUS RED FLAG', strip: '#C0392B' };
  if (risk === 'MEDIUM') return { color: '#E67E22', bg: 'rgba(230,126,34,0.1)', label: 'MEDIUM RISK', strip: '#E67E22' };
  if (risk === 'LOW') return { color: '#F1C40F', bg: 'rgba(241,196,15,0.1)', label: 'ELEVATED', strip: '#F1C40F' };
  return { color: '#27AE60', bg: 'rgba(39,174,96,0.1)', label: 'NO PUBLIC RED FLAGS', strip: '#27AE60' };
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '12px 14px',
  background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6, color: '#ffffff',
  fontFamily: "'Inter', sans-serif", fontSize: 15, outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
  color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase',
  display: 'block', marginBottom: 8,
};

export default function CheckScreen({ onSave }: CheckScreenProps) {
  const [step, setStep] = useState<Step>('form');
  const [firstName, setFirstName] = useState('');
  const [surname, setSurname] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [province, setProvince] = useState('');
  const [reason, setReason] = useState('');
  const [consent, setConsent] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<PackageType>('single');
  const [progress, setProgress] = useState(0);
  const [saved, setSaved] = useState(false);
  const [formError, setFormError] = useState('');
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fullName = `${firstName.trim()} ${surname.trim()}`.trim();
  const risk = getMockRisk(fullName);
  const score = getMockScore(risk);
  const rc = getRiskConfig(risk);

  useEffect(() => {
    if (step === 'loading') {
      setProgress(0);
      let p = 0;
      progressRef.current = setInterval(() => {
        p += Math.random() * 8 + 2;
        if (p >= 100) {
          p = 100;
          clearInterval(progressRef.current!);
          setTimeout(() => setStep('results'), 400);
        }
        setProgress(Math.min(p, 100));
      }, 120);
    }
    return () => { if (progressRef.current) clearInterval(progressRef.current); };
  }, [step]);

  const handleFormNext = () => {
    if (!firstName.trim()) { setFormError('Enter the person\'s first name.'); return; }
    if (!surname.trim()) { setFormError('Enter the person\'s surname.'); return; }
    if (!reason) { setFormError('Select a reason for your search.'); return; }
    if (!consent) { setFormError('Please confirm your agreement before continuing.'); return; }
    setFormError('');
    setStep('pricing');
  };

  const handleRunCheck = () => {
    setStep('loading');
    setSaved(false);
  };

  const handleSave = () => {
    const check: SavedCheck = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: fullName,
      idNumber: idNumber || undefined,
      province: province || undefined,
      riskLevel: risk,
      riskScore: score,
      savedAt: new Date().toISOString(),
      package: selectedPkg,
    };
    onSave(check);
    setSaved(true);
  };

  const handleNewCheck = () => {
    setStep('form');
    setFirstName(''); setSurname(''); setIdNumber('');
    setProvince(''); setReason(''); setConsent(false);
    setSaved(false); setProgress(0);
  };

  // ── FORM ──
  if (step === 'form') return (
    <div style={{ background: '#08080f', minHeight: '100%', paddingBottom: 90, overflowY: 'auto' }}>
      <div style={{ padding: '56px 20px 20px' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>New Check</p>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>Start a Safety Check</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.5, marginBottom: 24 }}>Search South African public records. Confidential.</p>

        {formError && (
          <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#C0392B' }}>{formError}</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input style={inputStyle} placeholder="e.g. John" value={firstName}
                onChange={e => { setFirstName(e.target.value); setFormError(''); }}
                onFocus={e => (e.target.style.borderColor = '#6C35DE')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
            <div>
              <label style={labelStyle}>Surname *</label>
              <input style={inputStyle} placeholder="e.g. Mokoena" value={surname}
                onChange={e => { setSurname(e.target.value); setFormError(''); }}
                onFocus={e => (e.target.style.borderColor = '#6C35DE')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>SA ID Number <span style={{ color: '#8b8b91', textTransform: 'none', fontSize: 9 }}>(optional — improves accuracy)</span></label>
            <input style={{ ...inputStyle, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.08em' }}
              placeholder="13-digit ID" value={idNumber} inputMode="numeric"
              onChange={e => setIdNumber(e.target.value.replace(/\D/g, '').slice(0, 13))}
              onFocus={e => (e.target.style.borderColor = '#6C35DE')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')} />
          </div>

          <div>
            <label style={labelStyle}>Province <span style={{ color: '#8b8b91', textTransform: 'none', fontSize: 9 }}>(optional)</span></label>
            <select style={{ ...inputStyle, paddingRight: 36 }} value={province} onChange={e => setProvince(e.target.value)}
              onFocus={e => (e.target.style.borderColor = '#6C35DE')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}>
              <option value="">Select province</option>
              {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div>
            <label style={labelStyle}>Reason for Search *</label>
            <select style={{ ...inputStyle, paddingRight: 36 }} value={reason}
              onChange={e => { setReason(e.target.value); setFormError(''); }}
              onFocus={e => (e.target.style.borderColor = '#6C35DE')}
              onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}>
              <option value="">Select reason</option>
              {REASONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#8b8b91', marginTop: 6 }}>Required for POPIA compliance.</p>
          </div>

          {/* Consent */}
          <div style={{ background: '#0d0d1a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 6, padding: 14 }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}>
              <div
                onClick={() => { setConsent(c => !c); setFormError(''); }}
                style={{
                  width: 20, height: 20, borderRadius: 4, flexShrink: 0, marginTop: 1,
                  background: consent ? '#6C35DE' : 'transparent',
                  border: consent ? '2px solid #6C35DE' : '2px solid rgba(255,255,255,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                {consent && <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </div>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.5 }}>
                I confirm I have a legitimate reason for this search and agree to the Terms of Service and Privacy Policy.
              </p>
            </label>
          </div>

          <button
            onClick={handleFormNext}
            style={{
              width: '100%', padding: '16px', background: '#6C35DE', border: 'none',
              borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 800,
              color: '#ffffff', cursor: 'pointer', letterSpacing: '-0.01em',
            }}
          >
            Choose Package →
          </button>
        </div>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#8b8b91', textAlign: 'center', marginTop: 16, lineHeight: 1.5 }}>
          RedFlaq only searches public records. The person is not notified.
        </p>
      </div>
    </div>
  );

  // ── PRICING ──
  if (step === 'pricing') return (
    <div style={{ background: '#08080f', minHeight: '100%', paddingBottom: 90, overflowY: 'auto' }}>
      <div style={{ padding: '56px 20px 20px' }}>
        <button onClick={() => setStep('form')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 24 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91' }}>Back</span>
        </button>

        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Choose Package</p>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 4 }}>Checking: {fullName}</h1>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', marginBottom: 28 }}>Select how many checks you need.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
          {PACKAGES.map(pkg => {
            const active = selectedPkg === pkg.id;
            return (
              <button
                key={pkg.id}
                onClick={() => setSelectedPkg(pkg.id)}
                style={{
                  background: active ? 'rgba(108,53,222,0.1)' : '#111118',
                  border: active ? '2px solid #6C35DE' : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 8, padding: '18px 16px', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.15s',
                }}
              >
                <div>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 700, color: active ? '#ffffff' : '#d1d1d6', marginBottom: 3 }}>{pkg.label}</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8b8b91', letterSpacing: '0.06em' }}>{pkg.note}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 12 }}>
                  <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 900, color: active ? '#6C35DE' : '#ffffff', letterSpacing: '-0.02em' }}>R{pkg.price}</p>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91' }}>{pkg.credits} check{pkg.credits > 1 ? 's' : ''}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div style={{ background: 'rgba(217,119,6,0.08)', border: '1px solid rgba(217,119,6,0.25)', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#D97706', lineHeight: 1.5 }}>
            <strong>Demo mode:</strong> No payment required. Results are mock data for UI testing.
          </p>
        </div>

        <button
          onClick={handleRunCheck}
          style={{
            width: '100%', padding: '16px', background: '#6C35DE', border: 'none',
            borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 800,
            color: '#ffffff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z" stroke="white" strokeWidth="2" fill="rgba(255,255,255,0.15)" strokeLinejoin="round" />
          </svg>
          Run Check — R{PACKAGES.find(p => p.id === selectedPkg)?.price}
        </button>
      </div>
    </div>
  );

  // ── LOADING ──
  if (step === 'loading') return (
    <div style={{ background: '#08080f', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32 }}>
      <div style={{
        width: 56, height: 56, border: '3px solid rgba(108,53,222,0.2)',
        borderTopColor: '#6C35DE', borderRadius: '50%',
        animation: 'spin 0.8s linear infinite', marginBottom: 24,
      }} />
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>
        Checking records…
      </p>
      <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', marginBottom: 32 }}>
        Searching: {fullName}
      </p>
      <div style={{ width: '100%', maxWidth: 280, background: 'rgba(255,255,255,0.06)', borderRadius: 4, height: 4, overflow: 'hidden' }}>
        <div style={{ height: '100%', background: '#6C35DE', borderRadius: 4, width: `${progress}%`, transition: 'width 0.1s linear' }} />
      </div>
      <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8b8b91', marginTop: 12, letterSpacing: '0.08em' }}>
        {Math.round(progress)}%
      </p>
    </div>
  );

  // ── RESULTS ──
  return (
    <div style={{ background: '#08080f', minHeight: '100%', paddingBottom: 90, overflowY: 'auto' }}>
      {/* Risk strip */}
      <div style={{ background: rc.strip, padding: '10px 20px' }}>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          {rc.label}
        </p>
      </div>

      <div style={{ padding: '24px 20px' }}>
        {/* Name */}
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontSize: 26, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 6 }}>
          {fullName}
        </h1>
        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 20 }}>
          Risk Score: {score}/100 · {new Date().toLocaleDateString('en-ZA')}
        </p>

        {/* Risk card */}
        <div style={{
          background: rc.bg, border: `1px solid ${rc.color}40`,
          borderRadius: 8, padding: 16, marginBottom: 20,
          borderLeft: `3px solid ${rc.color}`,
        }}>
          {risk === 'HIGH' && (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: rc.color, marginBottom: 12 }}>
                ⚠️ Serious Warning Found
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'Status', value: 'WANTED' },
                  { label: 'Alleged Offense', value: 'Assault GBH' },
                  { label: 'Police Station', value: 'Johannesburg Central' },
                  { label: 'Source', value: 'RedFlaq Verified Public Records' },
                ].map(item => (
                  <div key={item.label}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block' }}>{item.label}</span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: item.label === 'Alleged Offense' ? rc.color : '#ffffff', fontWeight: item.label === 'Alleged Offense' ? 700 : 500 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {risk === 'MEDIUM' && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#d1d1d6', lineHeight: 1.6 }}>
              We found some public-record warnings linked to this name. Verify carefully before making decisions. Contact SAPS for official confirmation.
            </p>
          )}
          {risk === 'LOW' && (
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, color: '#d1d1d6', lineHeight: 1.6 }}>
              Limited information found. Match confidence is low — this may be a different person. Verify with date of birth and ID number.
            </p>
          )}
          {risk === 'CLEAR' && (
            <>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 700, color: rc.color, marginBottom: 8 }}>✓ No Public Records Found</p>
              <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.6 }}>
                We searched South African public records and found no warrants or criminal records for this name.
              </p>
            </>
          )}
        </div>

        {/* Critical note */}
        {risk === 'CLEAR' && (
          <div style={{ background: 'rgba(241,196,15,0.08)', border: '1px solid rgba(241,196,15,0.25)', borderRadius: 6, padding: '12px 14px', marginBottom: 20 }}>
            <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 12, color: '#F1C40F', lineHeight: 1.5 }}>
              <strong>Important:</strong> A clear result does not guarantee safety. Most harmful people have no criminal record.
            </p>
          </div>
        )}

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saved}
          style={{
            width: '100%', padding: '15px', marginBottom: 12,
            background: saved ? 'rgba(39,174,96,0.15)' : '#6C35DE',
            border: saved ? '1px solid rgba(39,174,96,0.4)' : 'none',
            borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 700,
            color: saved ? '#27AE60' : '#ffffff', cursor: saved ? 'default' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}
        >
          {saved ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13L9 17L19 7" stroke="#27AE60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Saved to Base
            </>
          ) : (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><ellipse cx="12" cy="5" rx="8" ry="3" stroke="white" strokeWidth="1.8"/><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" stroke="white" strokeWidth="1.8"/><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" stroke="white" strokeWidth="1.8"/></svg>
              Save to Safety Base
            </>
          )}
        </button>

        <button
          onClick={handleNewCheck}
          style={{
            width: '100%', padding: '15px',
            background: 'transparent', border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 6, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
            color: '#d1d1d6', cursor: 'pointer',
          }}
        >
          New Check
        </button>

        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 11, color: '#8b8b91', textAlign: 'center', marginTop: 20, lineHeight: 1.6 }}>
          This is a demo result. No real public records were searched.
        </p>
      </div>
    </div>
  );
}
