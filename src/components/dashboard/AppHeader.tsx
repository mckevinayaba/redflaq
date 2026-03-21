import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { User, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";
import redflaqLogo from "@/assets/redflaq-logo-official.png";


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
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 lg:px-6 sticky top-0" style={{ zIndex: 9999, visibility: 'visible' as const, opacity: 1, backgroundColor: '#FFFFFF', WebkitBackfaceVisibility: 'hidden' as const, transform: 'translateZ(0)', WebkitTransform: 'translateZ(0)' }}>
      {/* Logo – navigates to homepage in same tab */}
      <Link to="/" className="flex items-center">
        <img src={redflaqLogo} alt="RedFlaq" style={{ height: 36, width: 'auto', display: 'block' }} />
      </Link>

      {/* Avatar dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="font-body font-bold text-sm transition-colors"
          style={{ width: 36, height: 36, borderRadius: '50%', backgroundColor: '#EDE9FE', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(124, 58, 237, 0.2)', WebkitAppearance: 'none' as const }}
        >
          {initial}
        </button>

        {open && (
          <div className="py-1 z-50" style={{ position: 'absolute', right: 0, top: 48, width: 192, backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 8, boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted transition-colors">
              <LayoutDashboard className="h-4 w-4 text-muted-foreground" /> Dashboard
            </Link>
            {isStaff && (
              <Link to="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-primary hover:bg-muted transition-colors">
                <Shield className="h-4 w-4" /> Admin Dashboard
              </Link>
            )}
            <Link to="/dashboard/account" onClick={() => setOpen(false)} className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-foreground hover:bg-muted transition-colors">
              <Settings className="h-4 w-4 text-muted-foreground" /> Account
            </Link>
            <div className="border-t border-border my-1" />
            <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 font-body text-sm text-destructive hover:bg-destructive/10 transition-colors w-full text-left">
              <LogOut className="h-4 w-4" /> Log out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
