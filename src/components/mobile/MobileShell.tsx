import { useLocation } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import MobileTabBar, { MOBILE_TAB_BAR_HEIGHT } from "./MobileTabBar";
import MobileOnboarding from "./MobileOnboarding";

// Routes where the bottom tab bar should appear on mobile.
const SHELL_ROUTES = [
  /^\/$/,
  /^\/dashboard(\/.*)?$/,
  /^\/signals(\/.*)?$/,
  /^\/search-form/,
  /^\/results/,
];

export default function MobileShell() {
  const isMobile = useIsMobile();
  const { pathname } = useLocation();
  // The prototype shell owns its navigation; never overlay a second dock or onboarding.
  if (['/', '/check', '/check/analyzing', '/check/result', '/signals', '/deals', '/safe', '/you', '/business', '/safety-tips'].includes(pathname)) return null;
  if (!isMobile) return null;
  if (!SHELL_ROUTES.some((r) => r.test(pathname))) return null;

  return (
    <>
      {/* spacer so page content isn't covered by the fixed tab bar */}
      <div
        aria-hidden
        style={{
          height: `calc(${MOBILE_TAB_BAR_HEIGHT}px + env(safe-area-inset-bottom, 0px))`,
        }}
      />
      <MobileTabBar />
      <MobileOnboarding />
    </>
  );
}
