import { useState, useEffect, useCallback } from "react";
import { Shield, Lock, FileText, CheckCircle, Download, User, BookOpen, Clock, Upload, PenLine } from "lucide-react";

const TIMINGS = {
  search: 1000,
  scanning: 1500,
  result: 1000,
  actions: 800,
  journal: 1000,
  pause: 600,
};

type DemoState = "search" | "scanning" | "result" | "actions" | "journal";

const STATES: DemoState[] = ["search", "scanning", "result", "actions", "journal"];

export default function HomepageDemo() {
  const [currentState, setCurrentState] = useState<DemoState>("search");
  const [fade, setFade] = useState(true);

  const transition = useCallback((nextState: DemoState) => {
    setFade(false);
    setTimeout(() => {
      setCurrentState(nextState);
      setFade(true);
    }, 350);
  }, []);

  useEffect(() => {
    const idx = STATES.indexOf(currentState);
    const timing = TIMINGS[currentState];
    const nextIdx = (idx + 1) % STATES.length;
    const delay = nextIdx === 0 ? timing + TIMINGS.pause : timing;

    const timer = setTimeout(() => {
      transition(STATES[nextIdx]);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentState, transition]);

  return (
    <section style={{ background: "#FFFFFF", padding: "80px 0", borderBottom: '1px solid #E6E0DA' }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 60, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Left Column */}
          <div style={{ flex: "1 1 340px", minWidth: 280, paddingTop: 20 }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
              letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B4EFF',
              display: 'block', marginBottom: 16,
            }}>
              See how RedFlaq works
            </span>
            <h2 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 'clamp(24px, 3vw, 36px)',
              color: "#1F1F1F", lineHeight: 1.2, marginBottom: 20,
              letterSpacing: '-0.02em',
            }}>
              A fast public record safety check in under 60 seconds.
            </h2>
            <p style={{
              fontFamily: "'Syne', sans-serif", fontSize: 15,
              color: "#555555", lineHeight: 1.7, marginBottom: 32,
            }}>
              RedFlaq helps you check public record warning lists, get a clear safety signal, and save your decision to your free safety account.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {[
                { icon: <FileText size={14} />, label: "Public records only" },
                { icon: <Shield size={14} />, label: "POPIA aware" },
                { icon: <Lock size={14} />, label: "Confidential" },
              ].map((badge) => (
                <div key={badge.label} style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F8F5FF", borderRadius: 4,
                  padding: "8px 14px", width: "fit-content",
                }}>
                  <span style={{ color: "#6B4EFF", display: "flex" }}>{badge.icon}</span>
                  <span style={{
                    fontFamily: "'Syne', sans-serif", fontSize: 13,
                    fontWeight: 600, color: "#6B4EFF",
                  }}>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Step indicators */}
            <div style={{ marginTop: 40, display: "flex", gap: 6 }}>
              {STATES.map((s) => (
                <div key={s} style={{
                  width: currentState === s ? 28 : 8, height: 4,
                  borderRadius: 2,
                  background: currentState === s ? "#6B4EFF" : "#E6E0DA",
                  transition: "all 0.4s ease",
                }} />
              ))}
            </div>
          </div>

          {/* Right Column — Demo Card */}
          <div style={{ flex: "1 1 480px", minWidth: 320 }}>
            <div style={{
              background: "#FAFAF8", border: "1px solid #E6E0DA",
              borderRadius: 8, minHeight: 520, overflow: "hidden",
              position: "relative",
            }}>
              <div style={{
                position: "absolute", inset: 0, padding: "36px 32px",
                opacity: fade ? 1 : 0, transform: fade ? "translateY(0)" : "translateY(8px)",
                transition: "opacity 0.35s ease, transform 0.35s ease",
              }}>
                {currentState === "search" && <SearchPanel />}
                {currentState === "scanning" && <ScanningPanel />}
                {currentState === "result" && <ResultPanel />}
                {currentState === "actions" && <ActionsPanel />}
                {currentState === "journal" && <JournalPanel />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- State Panels ---------- */

function SearchPanel() {
  return (
    <div>
      <PanelTitle>Run a public record safety check</PanelTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, marginTop: 24 }}>
        <FormField label="Full Name" value="Themba Mokoena" />
        <FormField label="Province" value="Gauteng" />
        <FormField label="Reason for Search" value="Dating safety" />
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <div style={{
            width: 18, height: 18, borderRadius: 3, border: "2px solid #6B4EFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "#6B4EFF",
          }}>
            <CheckCircle size={12} style={{ color: "#fff" }} />
          </div>
          <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#666666" }}>
            I confirm I have a legitimate reason to search this person.
          </span>
        </div>
        <button style={{
          background: "#6B4EFF", color: "#fff", border: "none", borderRadius: 4,
          padding: "14px 28px", fontFamily: "'Syne', sans-serif", fontSize: 15,
          fontWeight: 700, cursor: "pointer", marginTop: 8, width: "100%",
        }}>
          Verify Someone Now
        </button>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 11, color: "#999",
          textAlign: "center", marginTop: 2,
        }}>
          Public records only • Results shown instantly • Confidential use only
        </p>
      </div>
    </div>
  );
}

function ScanningPanel() {
  return (
    <div>
      <PanelTitle>Checking public record warning lists</PanelTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, marginTop: 32 }}>
        {[
          "Scanning South African public record warning lists",
          "Matching public notices",
          "Preparing your safety summary",
        ].map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <ScanDot delay={i * 400} />
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#1F1F1F" }}>{line}</span>
          </div>
        ))}
      </div>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 12, color: "#999",
        marginTop: 40, lineHeight: 1.6,
      }}>
        This is a public record safety check, not a full criminal record check.
      </p>
    </div>
  );
}

function ResultPanel() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <span style={{
          fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1, color: "#666666",
        }}>Safety Signal</span>
        <span style={{
          background: "#FFF3E0", color: "#E65100", fontFamily: "'Syne', sans-serif",
          fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 4,
        }}>Moderate Risk</span>
      </div>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
        color: "#1F1F1F", marginTop: 20, lineHeight: 1.4,
      }}>
        Public record warning linked to this name found.
      </p>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#666666",
        marginTop: 8, lineHeight: 1.6,
      }}>
        Review the available details carefully before making a trust decision.
      </p>
      <div style={{
        marginTop: 24, display: "flex", flexDirection: "column", gap: 0,
        border: "1px solid #E6E0DA", borderRadius: 8, overflow: "hidden",
      }}>
        <InfoRow label="Risk level" value="Moderate" />
        <InfoRow label="Source type" value="Public warning notice" />
        <InfoRow label="Area" value="Gauteng" last />
      </div>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 12, color: "#999",
        marginTop: 20, fontStyle: "italic",
      }}>
        This is a public record safety signal, not a verdict.
      </p>
    </div>
  );
}

function ActionsPanel() {
  return (
    <div>
      <PanelTitle>What would you like to do next?</PanelTitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
        <ActionButton icon={<Download size={16} />} label="Download PDF Report" />
        <ActionButton icon={<User size={16} />} label="Save to Free Safety Account" />
      </div>
      <div style={{
        marginTop: 24, background: "#F8F5FF", border: "1px solid #E9E3FF",
        borderRadius: 8, padding: "20px 24px",
      }}>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#1F1F1F",
          lineHeight: 1.6, marginBottom: 16,
        }}>
          Create a Free Safety Account to save checks, track patterns, and keep your safety decisions in one place.
        </p>
        <button style={{
          background: "#6B4EFF", color: "#fff", border: "none", borderRadius: 4,
          padding: "12px 24px", fontFamily: "'Syne', sans-serif", fontSize: 14,
          fontWeight: 700, cursor: "pointer", width: "100%",
        }}>
          Create a Free Safety Account
        </button>
      </div>
    </div>
  );
}

function JournalPanel() {
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 6, background: "#F1ECFF",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <BookOpen size={18} style={{ color: "#6B4EFF" }} />
        </div>
        <PanelTitle noMargin>My Safety Journal</PanelTitle>
      </div>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#666666",
        lineHeight: 1.6, marginTop: 12, marginBottom: 20,
      }}>
        Record incidents, patterns, screenshots, voice notes, and other evidence privately in one secure place.
      </p>
      <div style={{
        background: "#FAFAF8", border: "1px solid #E6E0DA", borderRadius: 8,
        padding: "16px 20px", marginBottom: 20,
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700,
          textTransform: "uppercase", letterSpacing: 1, color: "#999",
        }}>Sample entry</span>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 14, color: "#1F1F1F",
          marginTop: 8, lineHeight: 1.5,
        }}>
          Threatening messages saved. Pattern noted. Timeline preserved.
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {[
          { icon: <Clock size={14} />, text: "Private and time stamped" },
          { icon: <Upload size={14} />, text: "Exportable when needed" },
          { icon: <PenLine size={14} />, text: "Built to help you organise what you are seeing" },
        ].map((b) => (
          <div key={b.text} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ color: "#6B4EFF", display: "flex" }}>{b.icon}</span>
            <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#555" }}>{b.text}</span>
          </div>
        ))}
      </div>
      <button style={{
        background: "#6B4EFF", color: "#fff", border: "none", borderRadius: 4,
        padding: "12px 24px", fontFamily: "'Syne', sans-serif", fontSize: 14,
        fontWeight: 700, cursor: "pointer", width: "100%", marginBottom: 16,
      }}>
        Start Documenting Free
      </button>
      <p style={{
        fontFamily: "'Syne', sans-serif", fontSize: 12, color: "#999",
        textAlign: "center", fontStyle: "italic", lineHeight: 1.5,
      }}>
        When you are traumatised, details get lost. A record helps you stay clear.
      </p>
    </div>
  );
}

/* ---------- Shared Sub-Components ---------- */

function PanelTitle({ children, noMargin }: { children: React.ReactNode; noMargin?: boolean }) {
  return (
    <h3 style={{
      fontFamily: "'Syne', sans-serif", fontSize: 18, fontWeight: 700,
      color: "#1F1F1F", margin: noMargin ? 0 : undefined,
    }}>{children}</h3>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <label style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 600,
        color: "#666666", display: "block", marginBottom: 6, letterSpacing: '0.05em',
      }}>{label}</label>
      <div style={{
        background: "#FFFFFF", border: "1px solid #E6E0DA", borderRadius: 6,
        padding: "12px 16px", fontFamily: "'Syne', sans-serif", fontSize: 14,
        color: "#1F1F1F",
      }}>{value}</div>
    </div>
  );
}

function InfoRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", padding: "12px 16px",
      borderBottom: last ? "none" : "1px solid #E6E0DA",
    }}>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, color: "#666666" }}>{label}</span>
      <span style={{ fontFamily: "'Syne', sans-serif", fontSize: 13, fontWeight: 600, color: "#1F1F1F" }}>{value}</span>
    </div>
  );
}

function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
      background: "#fff", color: "#6B4EFF", border: "1px solid #6B4EFF",
      borderRadius: 4, padding: "12px 20px", fontFamily: "'Syne', sans-serif",
      fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%",
    }}>
      {icon} {label}
    </button>
  );
}

function ScanDot({ delay }: { delay: number }) {
  return (
    <div style={{
      width: 10, height: 10, borderRadius: "50%", background: "#6B4EFF",
      animation: `demoPulse 1.2s ease-in-out ${delay}ms infinite`,
    }}>
      <style>{`
        @keyframes demoPulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );
}
