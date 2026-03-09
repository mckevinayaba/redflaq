import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  FileText,
  Settings,
  Heart,
  BookOpen,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "New Safety Check", path: "/dashboard/new-check", icon: Shield },
  { title: "My Safety Journal", path: "/dashboard/journal", icon: BookOpen },
  { title: "My Reports", path: "/dashboard/reports", icon: FileText },
  { title: "Account", path: "/dashboard/account", icon: Settings },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-full border-r border-border flex flex-col" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #EDE9FE 100%)' }}>
      {/* Menu */}
      <nav className="flex-1 px-3 pt-6 space-y-1">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || (item.path === "/dashboard/journal" && location.pathname.startsWith("/dashboard/journal"));
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body font-medium transition-all ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={!isActive ? { background: 'transparent' } : {}}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(124,58,237,0.08)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* GBV stat */}
      <div className="mx-3 mb-4 p-4 rounded-xl" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.12)' }}>
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-primary" />
          <span className="font-mono text-[10px] tracking-wider text-primary uppercase">Safety first</span>
        </div>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          1 in 3 South African women experience gender‑based violence in the hands of an intimate partner during their lifetime.
        </p>
      </div>
    </aside>
  );
}
