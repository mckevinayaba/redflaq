import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useIsMobile } from "@/hooks/use-mobile";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import MobileBase from "@/components/mobile/screens/MobileBase";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };
const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

const card: React.CSSProperties = {
  background: '#111118',
  border: '1px solid rgba(108,53,222,0.25)',
  borderRadius: 8,
  padding: '20px 24px',
};

const inputStyle: React.CSSProperties = {
  ...inter as React.CSSProperties,
  fontSize: 13,
  color: '#d1d1d6',
  background: '#0d0d1a',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 6,
  padding: '9px 12px',
  outline: 'none',
  width: '100%',
};

interface SearchRecord {
  id: string;
  search_name: string | null;
  searched_at: string;
  risk_level: string;
  matches_found: number;
  search_id: string;
  search_province: string | null;
  recommendation: string | null;
  hidden_from_dashboard?: boolean;
}

const riskConfig: Record<string, { label: string; color: string; bg: string }> = {
  RED: { label: "High Risk", color: "#C0392B", bg: "rgba(192,57,43,0.12)" },
  ORANGE: { label: "Moderate", color: "#E67E22", bg: "rgba(230,126,34,0.12)" },
  YELLOW: { label: "Low Risk", color: "#F1C40F", bg: "rgba(241,196,15,0.12)" },
  GREEN: { label: "Clear", color: "#27AE60", bg: "rgba(39,174,96,0.12)" },
};

export default function DashboardReports() {
  const isMobile = useIsMobile();
  return isMobile ? <MobileBase /> : <DesktopDashboardReports />;
}

function DesktopDashboardReports() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searches, setSearches] = useState<SearchRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLevel, setFilterLevel] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [passwordPrompt, setPasswordPrompt] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (!authLoading && !user) { navigate("/signup"); return; }
    if (user) fetchSearches();
  }, [user, authLoading]);

  const fetchSearches = async () => {
    let query = supabase.from("searches").select("*").eq("user_id", user!.id).order("searched_at", { ascending: false });
    if (filterLevel) query = query.eq("risk_level", filterLevel);
    const { data } = await query;
    setSearches(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) { setLoading(true); fetchSearches(); } }, [filterLevel]);

  const hiddenCount = searches.filter((s: any) => s.hidden_from_dashboard).length;
  const visibleSearches = showHidden ? searches : searches.filter((s: any) => !s.hidden_from_dashboard);

  const handleShowHidden = () => {
    if (showHidden) { setShowHidden(false); return; }
    setPasswordPrompt(true);
  };

  const handlePasswordSubmit = async () => {
    if (!user?.email) return;
    const { error } = await supabase.auth.signInWithPassword({ email: user.email, password });
    if (error) { setPasswordError("Incorrect password. Please try again."); return; }
    setPasswordPrompt(false);
    setPassword(""); setPasswordError("");
    setShowHidden(true);
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: 28 }}>
        <p style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.15em', textTransform: 'uppercase' as const, marginBottom: 8 }}>
          Reports
        </p>
        <h1 style={{ ...inter, fontSize: 'clamp(22px, 3vw, 30px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em' }}>
          My Reports
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div style={{ ...card, position: 'sticky', top: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
              <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Filters</span>
            </div>
            <label style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.08em', textTransform: 'uppercase' as const, display: 'block', marginBottom: 6 }}>
              Result level
            </label>
            <select
              style={inputStyle}
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              onFocus={e => e.target.style.borderColor = '#6C35DE'}
              onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
            >
              <option value="">All results</option>
              <option value="RED">High Risk</option>
              <option value="ORANGE">Moderate</option>
              <option value="YELLOW">Low Risk</option>
              <option value="GREEN">Clear</option>
            </select>

            {hiddenCount > 0 && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <button
                  onClick={handleShowHidden}
                  style={{ ...inter, fontSize: 13, color: '#8b8b91', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  {showHidden ? "Hide hidden checks" : `${hiddenCount} hidden check${hiddenCount !== 1 ? "s" : ""}`}
                </button>
              </div>
            )}
          </div>

          {/* Password prompt */}
          {passwordPrompt && (
            <div style={{ ...card, marginTop: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                <span style={{ ...mono, fontSize: 10, color: '#8b8b91', letterSpacing: '0.1em', textTransform: 'uppercase' as const }}>Verify identity</span>
              </div>
              <p style={{ ...inter, fontSize: 12, color: '#8b8b91', marginBottom: 10 }}>Enter your password to view hidden checks.</p>
              <input
                type="password"
                style={{ ...inputStyle, marginBottom: 8 }}
                placeholder="Your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                onFocus={e => e.target.style.borderColor = '#6C35DE'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              {passwordError && <p style={{ ...inter, fontSize: 12, color: '#C0392B', marginBottom: 8 }}>{passwordError}</p>}
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handlePasswordSubmit} style={{ flex: 1, ...inter, fontSize: 13, fontWeight: 700, color: '#fff', background: '#6C35DE', border: 'none', padding: '9px 0', borderRadius: 4, cursor: 'pointer' }}>
                  Verify
                </button>
                <button onClick={() => { setPasswordPrompt(false); setPassword(""); setPasswordError(""); }}
                  style={{ ...inter, fontSize: 13, fontWeight: 600, color: '#d1d1d6', background: 'transparent', border: '1px solid rgba(255,255,255,0.12)', padding: '9px 14px', borderRadius: 4, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Reports list */}
        <div className="lg:col-span-3" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ width: 28, height: 28, border: '3px solid rgba(108,53,222,0.2)', borderTopColor: '#6C35DE', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91' }}>Loading reports…</p>
            </div>
          ) : visibleSearches.length === 0 ? (
            <div style={{ ...card, textAlign: 'center', padding: '48px 24px' }}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 12px' }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <p style={{ ...inter, fontSize: 18, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>No reports found</p>
              <p style={{ ...inter, fontSize: 14, color: '#8b8b91', maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
                Try changing your filters or running a new safety check.
              </p>
              <Link to="/dashboard/new-check" style={{ ...inter, fontSize: 14, fontWeight: 700, color: '#ffffff', background: '#6C35DE', padding: '12px 24px', borderRadius: 4, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                Run a new safety check
              </Link>
            </div>
          ) : (
            visibleSearches.map((s) => {
              const risk = riskConfig[s.risk_level] || riskConfig.GREEN;
              const isHidden = (s as any).hidden_from_dashboard;
              return (
                <div key={s.id} style={{ ...card, opacity: isHidden ? 0.7 : 1, transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = '#6C35DE'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,53,222,0.25)'}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ ...inter, fontSize: 16, fontWeight: 700, color: '#ffffff' }}>{s.search_name || "Unknown"}</h3>
                        {isHidden && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b8b91" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" /></svg>
                        )}
                      </div>
                      <p style={{ ...mono, fontSize: 11, color: '#8b8b91' }}>
                        {new Date(s.searched_at).toLocaleDateString("en-ZA", { day: "numeric", month: "long", year: "numeric" })}
                        {s.search_province && ` · ${s.search_province}`}
                      </p>
                    </div>
                    <span style={{ ...mono, fontSize: 10, fontWeight: 700, color: risk.color, background: risk.bg, padding: '4px 12px', borderRadius: 4 }}>
                      {risk.label}
                    </span>
                  </div>
                  {s.recommendation && (
                    <p style={{ ...inter, fontSize: 13, color: '#8b8b91', lineHeight: 1.6, marginBottom: 16 }}>
                      {s.recommendation.slice(0, 180)}{s.recommendation.length > 180 ? "..." : ""}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <Link to={`/results?search_id=${s.search_id}`} style={{
                      ...inter, fontSize: 13, fontWeight: 700, color: '#ffffff',
                      background: '#6C35DE', padding: '9px 18px', borderRadius: 4, textDecoration: 'none',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                      View full report
                    </Link>
                    <button style={{
                      ...inter, fontSize: 13, fontWeight: 600, color: '#d1d1d6',
                      background: 'transparent', border: '1px solid rgba(255,255,255,0.12)',
                      padding: '9px 14px', borderRadius: 4, cursor: 'pointer',
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                    }}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      Download PDF
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
