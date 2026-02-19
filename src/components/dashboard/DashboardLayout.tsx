import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import AppHeader from "./AppHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Persistent top bar */}
      <AppHeader />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
            <div className="relative z-10 w-64">
              <DashboardSidebar />
            </div>
          </div>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-muted rounded-lg">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>

          <div className="p-6 lg:p-10 max-w-7xl">
            {children}

            {/* Back to homepage link */}
            <div className="mt-12 pt-6 border-t border-border text-center">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to redflaq.com homepage
              </a>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
