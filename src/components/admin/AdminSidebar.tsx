import { Link, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import {
  LayoutDashboard,
  Users,
  Search,
  FileEdit,
  CreditCard,
  BarChart3,
  ShieldCheck,
  FileText,
} from "lucide-react";

const allItems = [
  { title: "Dashboard", path: "/admin", icon: LayoutDashboard, minRole: "support" as const },
  { title: "Users", path: "/admin/users", icon: Users, minRole: "support" as const },
  { title: "Safety Checks", path: "/admin/checks", icon: Search, minRole: "support" as const },
  { title: "Content & Copy", path: "/admin/content", icon: FileEdit, minRole: "admin" as const },
  { title: "Pricing & Plans", path: "/admin/pricing", icon: CreditCard, minRole: "admin" as const },
  { title: "Analytics", path: "/admin/analytics", icon: BarChart3, minRole: "support" as const },
  { title: "Gazette", path: "/admin/gazette", icon: FileText, minRole: "admin" as const },
  { title: "System & Roles", path: "/admin/system", icon: ShieldCheck, minRole: "owner" as const },
];

const roleLevel = { user: 0, support: 1, admin: 2, owner: 3 } as const;

export default function AdminSidebar() {
  const location = useLocation();
  const { role } = useUserRole();

  const currentLevel = roleLevel[role] ?? 0;
  const visibleItems = allItems.filter(item => currentLevel >= roleLevel[item.minRole]);

  return (
    <aside className="w-64 min-h-full bg-purple-50 border-r border-border flex flex-col">
      <nav className="flex-1 px-3 pt-6 space-y-1">
        {visibleItems.map((item) => {
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

      <div className="mx-4 mb-4 p-4 bg-purple-100 rounded-lg">
        <p className="font-mono text-[10px] tracking-wider text-primary uppercase mb-1">Admin Panel</p>
        <p className="font-body text-xs text-muted-foreground leading-relaxed">
          Manage users, checks, content and analytics from here.
        </p>
      </div>
    </aside>
  );
}
