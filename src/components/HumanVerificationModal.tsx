import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import type { SearchInput } from "@/utils/identityConfidence";

interface HumanVerificationModalProps {
  searchInput: SearchInput;
  matchIds: string[];
  onClose: () => void;
}

const HumanVerificationModal = ({ searchInput, matchIds, onClose }: HumanVerificationModalProps) => {
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!consent) {
      toast.error("Please confirm the consent checkbox");
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("human_verification_requests").insert({
        search_name: searchInput.search_name,
        search_dob: searchInput.search_dob || null,
        search_id_number: searchInput.search_id || null,
        search_province: searchInput.search_province || null,
        possible_match_ids: matchIds,
        additional_info: additionalInfo || null,
        status: 'pending',
      });
      if (error) throw error;
      toast.success("Verification request submitted. You'll receive results via email within 24 hours.");
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: 'white', maxWidth: 600, width: '100%', border: '1.5px solid var(--ink)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: '32px 32px 24px', borderBottom: '1.5px solid var(--cream)' }}>
          <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>👤</span>
          <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: 'var(--ink)', marginBottom: 8 }}>
            Human Identity Verification
          </h2>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#78716C' }}>
            Our team will verify the correct match within 24 hours
          </p>
        </div>

        {/* Body */}
        <div style={{ padding: 32 }}>
          <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 15, color: 'var(--mid)', lineHeight: 1.8, marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>When multiple people share the same name, our verification team uses additional data sources to confirm identity:</p>
            {['Cross-reference date of birth', 'Check address history', 'Verify photo age and quality', 'Contact police station if needed', 'Review case progression records'].map(item => (
              <p key={item}>✓ {item}</p>
            ))}
            <p style={{ marginTop: 16 }}>You will receive a verified report via email within 24 hours clearly identifying which match (if any) is the correct person.</p>
          </div>

          <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.1em', display: 'block', marginBottom: 8 }}>
            Additional Information (Optional but Helpful)
          </label>
          <textarea
            value={additionalInfo}
            onChange={e => setAdditionalInfo(e.target.value)}
            placeholder="Known date of birth, last known address, physical description, or any other identifying details..."
            style={{ width: '100%', border: '1.5px solid var(--ink)', padding: 12, fontFamily: "'Syne', sans-serif", minHeight: 100, resize: 'vertical', boxSizing: 'border-box' }}
          />

          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginTop: 20, cursor: 'pointer' }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ accentColor: 'var(--purple-mid)', marginTop: 4 }} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: 'var(--mid)', lineHeight: 1.5 }}>
              I confirm this is for a legitimate safety purpose and I will not use this information unlawfully
            </span>
          </label>
        </div>

        {/* Footer */}
        <div style={{ padding: '24px 32px', borderTop: '1.5px solid var(--cream)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--muted)', display: 'block' }}>VERIFICATION FEE</span>
            <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--purple-mid)' }}>R49</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 12, color: '#78716C', display: 'block' }}>One-time fee, 24hr delivery</span>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={onClose} style={{ border: '2px solid var(--ink)', background: 'transparent', color: 'var(--ink)', padding: '12px 20px', fontFamily: "'Syne', sans-serif", fontWeight: 600, cursor: 'pointer' }}>
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={submitting || !consent} style={{ background: 'var(--ink)', color: 'var(--paper)', padding: '12px 20px', fontFamily: "'Syne', sans-serif", fontWeight: 700, border: 'none', cursor: 'pointer', opacity: submitting || !consent ? 0.5 : 1 }}>
              {submitting ? 'Submitting...' : 'Pay & Verify'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumanVerificationModal;
