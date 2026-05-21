import { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import DashboardSidebar from "./DashboardSidebar";
import AppHeader from "./AppHeader";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#08080f' }}>
      <AppHeader />

      <div style={{ display: 'flex', flex: 1 }}>
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <DashboardSidebar />
        </div>

        {/* Mobile overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMobileOpen(false)}>
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }} />
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
              style={{
                position: 'absolute', top: 12, right: 12, zIndex: 10,
                padding: '6px', borderRadius: 6,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              aria-label="Close sidebar"
            >
              <X style={{ width: 18, height: 18, color: '#ffffff' }} />
            </button>
            <DashboardSidebar />
          </div>
        </div>

        {/* Main content */}
        <main style={{ flex: 1, minWidth: 0 }}>
          {/* Mobile hamburger bar */}
          <div
            className="lg:hidden flex items-center px-4 py-3"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#111118' }}
          >
            <button
              onClick={() => setMobileOpen(true)}
              style={{
                padding: '6px', borderRadius: 6,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
              }}
            >
              <Menu style={{ width: 18, height: 18, color: '#d1d1d6' }} />
            </button>
          </div>

          <div
            className="p-4 sm:p-6 lg:p-10 max-w-7xl"
            style={{ paddingBottom: 'calc(80px + env(safe-area-inset-bottom, 0px))' }}
          >
            {children}

            <div style={{ marginTop: 40, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
              <Link
                to="/"
                style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#6C35DE'}
                onMouseLeave={e => e.currentTarget.style.color = '#8b8b91'}
              >
                ← Back to redflaq.com homepage
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
