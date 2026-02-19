import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Shield,
  FileText,
  Settings,
  Heart,
} from "lucide-react";

const menuItems = [
  { title: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { title: "New Safety Check", path: "/dashboard/new-check", icon: Shield },
  { title: "My Reports", path: "/dashboard/reports", icon: FileText },
  { title: "Account", path: "/dashboard/account", icon: Settings },
];

export default function DashboardSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 min-h-full bg-purple-50 border-r border-border flex flex-col">
      {/* Menu */}
      <nav className="flex-1 px-3 pt-6 space-y-1">
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
          1 in 3 South African women experience gender‑based violence in the hands of an intimate partner during their lifetime.
        </p>
      </div>
    </aside>
  );
}
