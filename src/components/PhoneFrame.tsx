import { ReactNode } from "react";

/**
 * Historical phone-frame wrapper. Desktop now renders full-width layouts
 * (pages branch on useIsMobile), so this is a pass-through at all sizes.
 * Kept so existing imports keep working.
 */
export const PhoneFrame = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

export default PhoneFrame;
