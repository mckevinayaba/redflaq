import { useState } from "react";
import { Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PaymentModal } from "@/components/PaymentModal";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type SearchType = "person" | "warrants" | "police-case" | "protection-order" | "court-cases";

const SearchOptionsSection = () => {
  const [selectedType, setSelectedType] = useState<SearchType>("person");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);
  const { ref, isVisible } = useScrollReveal();

  const searchOptions: { id: SearchType; icon: string; title: string; description: string; recommended?: boolean; fullWidth?: boolean }[] = [
    { id: "person", icon: "👤", title: "Search by Person", description: "Full name and SA ID number", recommended: true },
    { id: "warrants", icon: "⚠️", title: "Active Warrants", description: "SAPS wanted persons database" },
    { id: "police-case", icon: "🛡️", title: "Police Case Number", description: "Format: XXX/DD/YYYY" },
    { id: "protection-order", icon: "📄", title: "Protection Order", description: "Search by keyword or reference" },
    { id: "court-cases", icon: "⚖️", title: "Court Cases", description: "Case number or keyword search", fullWidth: true },
  ];

  const provinces = ["Gauteng", "Western Cape", "KwaZulu-Natal", "Eastern Cape", "Free State", "Limpopo", "Mpumalanga", "North West", "Northern Cape"];
  const searchReasons = ["Potential romantic partner", "Employee verification", "Childcare provider", "Tenant screening", "Business partner", "Other legitimate purpose"];

  const cardStyle = (isSelected: boolean): React.CSSProperties => ({
    background: isSelected ? '#0D0B0E' : 'white',
    border: '1.5px solid ' + (isSelected ? '#0D0B0E' : '#EDE9E3'),
    padding: 24, cursor: 'pointer', position: 'relative',
    transition: 'all 0.2s',
  });

  const inputStyle: React.CSSProperties = {
    background: 'white', border: '1.5px solid #0D0B0E', padding: '14px 16px',
    fontFamily: "'Syne', sans-serif", fontSize: 15, color: '#0D0B0E',
    borderRadius: 0, width: '100%', outline: 'none',
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
    letterSpacing: '0.1em', textTransform: 'uppercase', color: '#4B4453',
    display: 'block', marginBottom: 8,
  };

  return (
    <>
      <section id="search" ref={ref} className={`scroll-reveal ${isVisible ? 'visible' : ''}`} style={{ background: '#F7F4F0', padding: '120px 60px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="section-tag" style={{ color: '#7C3AED', marginBottom: 16 }}>
            Start Verifying
          </div>

          <h2 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: 'clamp(36px, 4vw, 52px)', maxWidth: 600, color: '#0D0B0E', marginBottom: 48,
          }}>
            How would you like to search?
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* LEFT - Search option cards */}
            <div>
              <div className="grid grid-cols-2 gap-3">
                {searchOptions.filter(o => !o.fullWidth).map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setSelectedType(option.id)}
                    style={cardStyle(selectedType === option.id)}
                    className="hover:-translate-y-0.5 hover:border-[#7C3AED]"
                  >
                    {option.recommended && (
                      <span style={{
                        position: 'absolute', top: 12, right: 12, background: '#7C3AED', color: 'white',
                        fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: '0.1em',
                        padding: '3px 8px', textTransform: 'uppercase',
                      }}>
                        RECOMMENDED
                      </span>
                    )}
                    <div style={{ fontSize: 24, marginBottom: 12 }}>{option.icon}</div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                      color: selectedType === option.id ? 'white' : '#0D0B0E', marginBottom: 4,
                    }}>
                      {option.title}
                    </div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif", fontSize: 13,
                      color: selectedType === option.id ? 'rgba(255,255,255,0.6)' : '#4B4453', lineHeight: 1.5,
                    }}>
                      {option.description}
                    </div>
                  </div>
                ))}
              </div>
              {/* Full width card */}
              {searchOptions.filter(o => o.fullWidth).map(option => (
                <div
                  key={option.id}
                  onClick={() => setSelectedType(option.id)}
                  style={{ ...cardStyle(selectedType === option.id), marginTop: 12 }}
                  className="hover:-translate-y-0.5 hover:border-[#7C3AED]"
                >
                  <div style={{ fontSize: 24, marginBottom: 12 }}>{option.icon}</div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 15, fontWeight: 700,
                    color: selectedType === option.id ? 'white' : '#0D0B0E',
                  }}>{option.title}</div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 13,
                    color: selectedType === option.id ? 'rgba(255,255,255,0.6)' : '#4B4453',
                  }}>{option.description}</div>
                </div>
              ))}
            </div>

            {/* RIGHT - Search form panel */}
            <div style={{ background: '#EDE9E3', border: '1.5px solid #0D0B0E', padding: 40 }}>
              <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, color: '#0D0B0E', marginBottom: 8 }}>
                {selectedType === "person" ? "Person Search" :
                 selectedType === "warrants" ? "Warrant Search" :
                 selectedType === "police-case" ? "Case Number Search" :
                 selectedType === "protection-order" ? "Protection Order Search" : "Court Case Search"}
              </h3>
              <p style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: '#4B4453', marginBottom: 32 }}>
                Results sent via email within 2 to 5 minutes, human verified for accuracy.
              </p>

              <div className="space-y-5">
                {selectedType === "person" && (
                  <>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} placeholder="e.g. John David Mokoena" />
                    </div>
                    <div>
                      <label style={labelStyle}>SA ID Number *</label>
                      <input style={inputStyle} placeholder="13-digit South African ID number" />
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'block' }}>
                        We never store this longer than needed to complete your report
                      </span>
                    </div>
                    <div>
                      <label style={labelStyle}>Date of Birth (Optional)</label>
                      <input type="date" style={inputStyle} />
                    </div>
                    <div>
                      <label style={labelStyle}>Province (Optional)</label>
                      <select style={inputStyle}>
                        <option value="">Select province</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Reason for Search *</label>
                      <select style={inputStyle}>
                        <option value="">Select reason</option>
                        {searchReasons.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'block' }}>
                        We ask this to comply with POPIA and protect everyone's rights
                      </span>
                    </div>
                  </>
                )}

                {selectedType === "warrants" && (
                  <>
                    <div>
                      <label style={labelStyle}>Full Name *</label>
                      <input style={inputStyle} placeholder="Enter full name to search" />
                    </div>
                    <div>
                      <label style={labelStyle}>Province (Optional)</label>
                      <select style={inputStyle}>
                        <option value="">Select province</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {selectedType === "police-case" && (
                  <div>
                    <label style={labelStyle}>Police Case Number *</label>
                    <input style={inputStyle} placeholder="e.g., CAS123/01/2024" />
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#9CA3AF', marginTop: 4, display: 'block' }}>
                      Format: XXX/DD/YYYY or station reference
                    </span>
                  </div>
                )}

                {selectedType === "protection-order" && (
                  <>
                    <div>
                      <label style={labelStyle}>Name or Keyword *</label>
                      <input style={inputStyle} placeholder="Enter name or keyword" />
                    </div>
                    <div>
                      <label style={labelStyle}>Province (Optional)</label>
                      <select style={inputStyle}>
                        <option value="">Select province</option>
                        {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </>
                )}

                {selectedType === "court-cases" && (
                  <>
                    <div>
                      <label style={labelStyle}>Court Case Number or Keyword *</label>
                      <input style={inputStyle} placeholder="Enter case number or search term" />
                    </div>
                    <div>
                      <label style={labelStyle}>Court Type (Optional)</label>
                      <select style={inputStyle}>
                        <option value="">Select court type</option>
                        <option value="magistrate">Magistrate Court</option>
                        <option value="high">High Court</option>
                        <option value="supreme">Supreme Court of Appeal</option>
                        <option value="constitutional">Constitutional Court</option>
                      </select>
                    </div>
                  </>
                )}

                {/* Consent */}
                <div className="flex items-start gap-3 pt-4">
                  <Checkbox
                    id="consent"
                    checked={consentChecked}
                    onCheckedChange={(checked) => setConsentChecked(checked as boolean)}
                    className="mt-1"
                    style={{ accentColor: '#7C3AED' }}
                  />
                  <label htmlFor="consent" style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 13, color: '#4B4453',
                    lineHeight: 1.5, cursor: 'pointer',
                  }}>
                    I confirm I have a legitimate reason to search this person and I agree to the{" "}
                    <a href="/terms" style={{ color: '#7C3AED', textDecoration: 'underline' }}>Terms of Service</a> and{" "}
                    <a href="/privacy" style={{ color: '#7C3AED', textDecoration: 'underline' }}>POPIA Consent Statement</a>
                  </label>
                </div>

                {/* Submit */}
                <button
                  onClick={() => setIsPaymentModalOpen(true)}
                  disabled={!consentChecked}
                  style={{
                    width: '100%', background: consentChecked ? '#0D0B0E' : '#9CA3AF', color: '#F7F4F0',
                    padding: 18, fontFamily: "'Syne', sans-serif", fontSize: 16, fontWeight: 700,
                    letterSpacing: '0.05em', border: 'none', cursor: consentChecked ? 'pointer' : 'not-allowed',
                    transition: 'background 0.2s',
                  }}
                  className={consentChecked ? 'hover:!bg-[#7C3AED]' : ''}
                >
                  Check Now — R99
                </button>

                {/* Form meta */}
                <div className="flex flex-wrap gap-4 pt-2">
                  {[["📧", "Results via email"], ["⏱️", "2 to 5 minutes"], ["🔒", "Confidential"]].map(([icon, text]) => (
                    <span key={text} className="flex items-center gap-1.5" style={{
                      fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#9CA3AF',
                    }}>
                      {icon} {text}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PaymentModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} packageType="single" />
    </>
  );
};

export default SearchOptionsSection;
