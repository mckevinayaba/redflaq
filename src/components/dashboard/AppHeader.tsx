import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import redflaqLogo from "@/assets/redflaq-logo-official.png";

const inter: React.CSSProperties = { fontFamily: "'Inter', sans-serif" };

export default function AppHeader() {
  const { user } = useAuth();
  const { isStaff } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out" });
    navigate("/");
  };

  const initial = user?.user_metadata?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U";

  return (
    <header style={{
      height: 56, position: 'sticky', top: 0, zIndex: 9999,
      background: '#08080f',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      WebkitBackfaceVisibility: 'hidden', transform: 'translateZ(0)',
    } as React.CSSProperties}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img src={redflaqLogo} alt="RedFlaq" style={{ height: 34, width: 'auto', display: 'block' }} />
      </Link>

      {/* Avatar dropdown */}
      <div style={{ position: 'relative' }} ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#6C35DE',
            color: '#ffffff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(108,53,222,0.4)',
            cursor: 'pointer',
            ...inter, fontWeight: 700, fontSize: 14,
          }}
        >
          {initial}
        </button>

        {open && (
          <div style={{
            position: 'absolute', right: 0, top: 46,
            width: 200,
            background: '#111118',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
            zIndex: 50,
            overflow: 'hidden',
            padding: '4px 0',
          }}>
            <Link
              to="/dashboard"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', ...inter, fontSize: 13, color: '#d1d1d6', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
              </svg>
              Dashboard
            </Link>
            {isStaff && (
              <Link
                to="/admin"
                onClick={() => setOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', ...inter, fontSize: 13, color: '#6C35DE', textDecoration: 'none' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6C35DE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                Admin Dashboard
              </Link>
            )}
            <Link
              to="/dashboard/account"
              onClick={() => setOpen(false)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', ...inter, fontSize: 13, color: '#d1d1d6', textDecoration: 'none' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              Account
            </Link>
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '4px 0' }} />
            <button
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', ...inter, fontSize: 13, color: '#C0392B', background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' as const }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(192,57,43,0.08)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C0392B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
