import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { User, LayoutDashboard, LogOut, Settings, Shield } from "lucide-react";

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
      {/* Logo – opens homepage in new tab */}
      <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
        <div className="w-7 h-7 bg-primary flex items-center justify-center" style={{ borderRadius: 4, WebkitClipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)', overflow: 'visible' }}>
          <span className="font-body font-black text-sm text-primary-foreground leading-none">R</span>
        </div>
        <span className="font-body font-extrabold text-lg tracking-widest text-foreground">EDFLAQ</span>
      </a>

      {/* Avatar dropdown */}
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen(!open)}
          className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center font-body font-bold text-sm text-primary hover:bg-primary/20 transition-colors"
        >
          {initial}
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
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
