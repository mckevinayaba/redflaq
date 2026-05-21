import { ReactNode, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * Wraps the entire app in a centered phone frame on desktop (>=768px).
 * On mobile, renders pass-through.
 * Admin routes are excluded — they keep full-width desktop layout.
 */
export const PhoneFrame = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const [isDesktop, setIsDesktop] = useState<boolean>(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (isAdmin || !isDesktop) {
    return <>{children}</>;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(ellipse at top, #1a1a2e 0%, #08080f 60%, #000 100%)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "24px 16px",
        overflowX: "hidden",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 430,
          minHeight: "calc(100vh - 48px)",
          background: "#F5F0EB",
          borderRadius: 36,
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 50px 120px rgba(0,0,0,0.55), 0 0 0 8px rgba(255,255,255,0.02)",
          overflow: "hidden",
          position: "relative",
          isolation: "isolate",
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PhoneFrame;
