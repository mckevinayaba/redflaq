import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import AppHeader from "./AppHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <AppHeader />

      <div className="flex flex-1">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
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
            <DashboardSidebar />
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          <div className="lg:hidden flex items-center px-4 py-3 border-b border-border bg-card">
            <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-muted rounded-lg">
              <Menu className="h-5 w-5 text-foreground" />
            </button>
          </div>

          <div className="p-4 sm:p-6 lg:p-10 max-w-7xl">
            {children}

            <div className="mt-8 sm:mt-12 pt-4 sm:pt-6 border-t border-border text-center">
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
