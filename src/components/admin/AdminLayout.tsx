import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { isStaff, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (!user) { navigate("/signup"); return; }
      if (!isStaff) { navigate("/dashboard"); return; }
    }
  }, [user, authLoading, isStaff, roleLoading]);

  if (authLoading || roleLoading || !isStaff) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AdminHeader />
      <div className="flex flex-1">
        <div className="hidden lg:block">
          <AdminSidebar />
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div className="absolute inset-0 bg-black/40 animate-fade-in" />
          </div>
        )}
        <div
          className={`fixed inset-y-0 left-0 z-[51] w-64 transform transition-transform duration-300 ease-out lg:hidden ${
            mobileOpen ? "translate-x-0 pointer-events-auto" : "-translate-x-full pointer-events-none"
          }`}
        >
          <div className="relative h-full">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 z-10 p-1.5 rounded-lg bg-background/80 hover:bg-muted transition-colors"
              aria-label="Close sidebar"
            >
              <X className="h-5 w-5 text-foreground" />
            </button>
            <AdminSidebar />
          </div>
        </div>

        <main className="flex-1 min-w-0">
          <div className="lg:hidden flex items-center px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-muted rounded-lg">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>
          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
