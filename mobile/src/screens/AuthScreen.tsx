import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const inter: React.CSSProperties    = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties     = { fontFamily: "'JetBrains Mono', monospace" };
const playfair: React.CSSProperties = { fontFamily: "'Playfair Display', serif" };

const SA_PROVINCES = [
  'Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal',
  'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West',
  'Western Cape', 'Outside South Africa',
];

function inputStyle(focused: boolean): React.CSSProperties {
  return {
    ...inter,
    width: '100%',
    fontSize: 15,
    color: '#ffffff',
    background: '#0d0d1a',
    border: `1px solid ${focused ? '#6C35DE' : 'rgba(255,255,255,0.12)'}`,
    borderRadius: 8,
    padding: '13px 16px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  };
}

function Field({
  label, type = 'text', value, onChange, placeholder, autoComplete,
}: {
  label: string; type?: string; value: string;
  onChange: (v: string) => void; placeholder?: string; autoComplete?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        style={inputStyle(focused)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function SelectField({
  label, value, onChange, options,
}: {
  label: string; value: string; onChange: (v: string) => void; options: string[];
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ ...mono, fontSize: 9, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ ...inputStyle(focused), appearance: 'none', colorScheme: 'dark' }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        <option value="">Select province…</option>
        {options.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}

export default function AuthScreen() {
  const { signIn, signUp, resetPassword } = useAuth();
  const [mode, setMode]       = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail]     = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [province, setProvince] = useState('');
  const [error, setError]     = useState('');
  const [info, setInfo]       = useState('');
  const [loading, setLoading] = useState(false);

  const clear = () => { setError(''); setInfo(''); };

  const handleSignIn = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setLoading(true); clear();
    const { error: err } = await signIn(email, password);
    setLoading(false);
    if (err) setError(err.message);
  };

  const handleSignUp = async () => {
    if (!email || !password || !displayName || !province) {
      setError('Please fill in all fields.'); return;
    }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setLoading(true); clear();
    const { error: err } = await signUp(email, password, displayName, province);
    setLoading(false);
    if (err) setError(err.message);
    else setInfo('Account created. Check your email to confirm your address.');
  };

  const handleReset = async () => {
    if (!email) { setError('Enter your email address to reset your password.'); return; }
    setLoading(true); clear();
    const { error: err } = await resetPassword(email);
    setLoading(false);
    if (err) setError(err.message);
    else { setInfo('Password reset link sent. Check your inbox.'); setMode('signin'); }
  };

  const btnStyle: React.CSSProperties = {
    ...inter,
    width: '100%',
    background: loading ? 'rgba(108,53,222,0.5)' : '#6C35DE',
    color: '#ffffff',
    border: 'none',
    borderRadius: 10,
    padding: '15px',
    fontSize: 15,
    fontWeight: 700,
    cursor: loading ? 'not-allowed' : 'pointer',
    marginTop: 8,
    letterSpacing: '0.01em',
    transition: 'background 0.15s',
  };

  return (
    <div style={{
      height: '100dvh',
      background: '#08080f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 20px',
      overflowY: 'auto',
    }}>
      {/* Logo */}
      <div style={{ marginBottom: 36, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L4 5V11C4 16.5 7.8 21.7 12 23C16.2 21.7 20 16.5 20 11V5L12 2Z" fill="rgba(108,53,222,0.2)" stroke="#6C35DE" strokeWidth="1.8" strokeLinejoin="round"/>
            <path d="M8 12L10.5 14.5L16 9" stroke="#6C35DE" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span style={{ ...playfair, fontSize: 28, fontWeight: 700, fontStyle: 'italic', color: '#ffffff' }}>RedFlaq</span>
        </div>
        <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>Documenting truth. Protecting survivors.</p>
      </div>

      {/* Card */}
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#111118',
        border: '1px solid rgba(108,53,222,0.2)',
        borderRadius: 16,
        padding: '28px 24px',
        boxShadow: '0 0 40px rgba(108,53,222,0.08)',
      }}>
        {/* Mode tabs */}
        {mode !== 'reset' && (
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: 3, marginBottom: 24 }}>
            {(['signin', 'signup'] as const).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); clear(); }}
                style={{
                  ...inter,
                  flex: 1,
                  background: mode === m ? '#6C35DE' : 'transparent',
                  color: mode === m ? '#ffffff' : '#8b8b91',
                  border: 'none',
                  borderRadius: 6,
                  padding: '9px',
                  fontSize: 13,
                  fontWeight: mode === m ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {m === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>
        )}

        {mode === 'reset' && (
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Reset Password</h2>
            <p style={{ ...inter, fontSize: 13, color: '#8b8b91' }}>We'll send a link to your email.</p>
          </div>
        )}

        {/* Fields */}
        <Field label="Email" type="email" value={email} onChange={e => { setEmail(e); clear(); }} placeholder="you@example.com" autoComplete="email" />

        {mode !== 'reset' && (
          <Field label="Password" type="password" value={password} onChange={p => { setPassword(p); clear(); }} placeholder="••••••••" autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} />
        )}

        {mode === 'signup' && (
          <>
            <Field label="Display Name" value={displayName} onChange={n => { setDisplayName(n); clear(); }} placeholder="Name shown to your group" />
            <SelectField label="Province" value={province} onChange={p => { setProvince(p); clear(); }} options={SA_PROVINCES} />
          </>
        )}

        {/* Error / info */}
        {error && (
          <div style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ ...inter, fontSize: 13, color: '#C0392B' }}>{error}</p>
          </div>
        )}
        {info && (
          <div style={{ background: 'rgba(39,174,96,0.08)', border: '1px solid rgba(39,174,96,0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
            <p style={{ ...inter, fontSize: 13, color: '#27AE60' }}>{info}</p>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={mode === 'signin' ? handleSignIn : mode === 'signup' ? handleSignUp : handleReset}
          disabled={loading}
          style={btnStyle}
        >
          {loading ? 'Please wait…' : mode === 'signin' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Link'}
        </button>

        {/* Forgot password */}
        {mode === 'signin' && (
          <button
            onClick={() => { setMode('reset'); clear(); }}
            style={{ ...inter, background: 'none', border: 'none', color: '#8b8b91', fontSize: 12, cursor: 'pointer', marginTop: 14, display: 'block', textAlign: 'center', width: '100%' }}
          >
            Forgot your password?
          </button>
        )}

        {mode === 'reset' && (
          <button
            onClick={() => { setMode('signin'); clear(); }}
            style={{ ...inter, background: 'none', border: 'none', color: '#8b8b91', fontSize: 12, cursor: 'pointer', marginTop: 14, display: 'block', textAlign: 'center', width: '100%' }}
          >
            ← Back to Sign In
          </button>
        )}
      </div>

      {/* Privacy notice */}
      <p style={{ ...inter, fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 24, textAlign: 'center', lineHeight: 1.6, maxWidth: 320 }}>
        Your data is encrypted on-device before being stored. RedFlaq cannot read your journal entries. POPIA compliant.
      </p>
    </div>
  );
}
