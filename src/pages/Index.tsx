import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check, X } from "lucide-react";
import Signals from "./Signals";
import { PWAInstallBanner } from "@/components/PWAInstallBanner";

const Index = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showConfirmedBanner, setShowConfirmedBanner] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      sessionStorage.setItem("referrer_id", ref);
    }
    if (params.get("confirmed") === "true") {
      setShowConfirmedBanner(true);
      const newParams = new URLSearchParams(params);
      newParams.delete("confirmed");
      setSearchParams(newParams, { replace: true });
      const timer = setTimeout(() => setShowConfirmedBanner(false), 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen" style={{ background: '#08080f', overflowX: 'hidden' }}>
      {showConfirmedBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999,
          background: '#059669', padding: '12px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}>
          <Check size={18} style={{ color: '#fff', flexShrink: 0 }} />
          <span style={{ color: '#fff', fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 600 }}>
            Your email is confirmed. Sign in to start your first check.
          </span>
          <Link to="/signup?mode=signin" style={{
            background: '#fff', color: '#059669', padding: '6px 16px', borderRadius: 4,
            fontSize: 13, fontWeight: 700, textDecoration: 'none', fontFamily: "'Inter', sans-serif",
            marginLeft: 8, flexShrink: 0,
          }}>
            Sign In
          </Link>
          <button onClick={() => setShowConfirmedBanner(false)} style={{
            background: 'none', border: 'none', color: 'rgba(255,255,255,0.7)',
            cursor: 'pointer', padding: 4, marginLeft: 4, flexShrink: 0,
          }}>
            <X size={16} />
          </button>
        </div>
      )}

      <Signals />
      <PWAInstallBanner />
    </div>
  );
};

export default Index;
