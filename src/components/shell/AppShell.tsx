import { type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import AppSidebar from "./AppSidebar";
import AppBottomNav from "./AppBottomNav";

interface AppShellProps {
  children: ReactNode;
  /** Whether to show the desktop right rail */
  showRail?: boolean;
}

export default function AppShell({ children, showRail = false }: AppShellProps) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <div
        style={{
          minHeight: "100dvh",
          background: "#0B1318",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <main style={{ flex: 1, minWidth: 0 }}>{children}</main>
        <AppBottomNav />
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0B1318",
      }}
    >
      <AppSidebar />
      <main
        style={{
          flex: 1,
          minWidth: 0,
          display: showRail ? "flex" : "block",
        }}
      >
        {children}
      </main>
      {showRail && (
        <aside
          aria-label="Contextual information"
          style={{
            width: 280,
            flexShrink: 0,
            borderLeft: "1px solid rgba(247,245,240,0.09)",
            padding: "1.5rem 1.25rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem",
          }}
        >
          {/* Rail content is populated by consuming pages */}
        </aside>
      )}
    </div>
  );
}
