import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Shield, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0F0A1A 0%, #1A1035 50%, #0F0A1A 100%)',
      padding: 24, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: '80%', height: '60%',
        background: 'radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(100px, 20vw, 180px)',
          background: 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(124,58,237,0.08))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          lineHeight: 1,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(28px, 5vw, 44px)',
          color: 'white', marginBottom: 12,
        }}>
          No red flags here.
        </h1>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 'clamp(15px, 2vw, 18px)',
          color: 'rgba(255,255,255,0.5)', marginBottom: 40, maxWidth: 440, margin: '0 auto 40px',
          lineHeight: 1.6,
        }}>
          This page doesn't exist. But your safety questions deserve answers.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 16 }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#7C3AED', color: 'white', padding: '14px 28px',
              borderRadius: 999, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 700,
              textDecoration: 'none', border: 'none',
            }}
          >
            <Home size={16} /> Back to RedFlaq
          </Link>
          <Link
            to="/signup"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px',
              borderRadius: 999, fontFamily: "'Syne', sans-serif", fontSize: 14, fontWeight: 600,
              textDecoration: 'none', border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <Shield size={16} /> Start Verifying
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
