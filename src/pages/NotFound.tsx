import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center" style={{ background: '#F7F4F0' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 160,
          color: '#EDE9E3', lineHeight: 1,
        }}>
          404
        </div>
        <h1 style={{
          fontFamily: "'DM Serif Display', serif", fontSize: 40,
          color: '#0D0B0E', marginBottom: 12,
        }}>
          No red flags here.
        </h1>
        <p style={{
          fontFamily: "'Syne', sans-serif", fontSize: 18, color: '#4B4453', marginBottom: 32,
        }}>
          This page doesn't exist. But your safety questions deserve answers.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <a href="/" className="btn-primary inline-block no-underline">Back to RedFlaq</a>
          <a href="/#search" className="btn-secondary inline-block no-underline">Start Verifying</a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
