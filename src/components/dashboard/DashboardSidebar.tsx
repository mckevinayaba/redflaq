import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  Shield,
  FileText,
  CreditCard,
  HelpCircle,
  LogOut,
  Eye,
  Heart,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "New Safety Check", path: "/dashboard/new-check", icon: Shield },
  { title: "My Reports", path: "/dashboard/reports", icon: FileText },
  { title: "Account & Billing", path: "/dashboard/account", icon: CreditCard },
  { title: "Help & Support", path: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out", description: "You've been logged out." });
    navigate("/");
  };

  return (
    <aside className="w-64 min-h-screen bg-purple-50 border-r border-border flex flex-col">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-1 px-6 py-6">
        <div className="w-7 h-7 bg-primary flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
          <span className="font-body font-black text-sm text-primary-foreground leading-none">R</span>
        </div>
        <span className="font-body font-extrabold text-lg tracking-widest text-foreground">EDFLAQ</span>
      </Link>

      {/* Menu */}
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-purple-100 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* GBV stat */}
      <div className="mx-4 mb-4 p-4 bg-purple-100 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] tracking-wider text-primary uppercase">Safety first</span>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          1 in 3 SA women experience violence from a partner. You're doing the right thing.
        </p>
      </div>

      {/* Logout */}
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </aside>
  );
}
