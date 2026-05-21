/**
 * Lightweight haptics hook. No-op on platforms without support.
 * Works on web (Vibration API) and Capacitor (if Haptics plugin present).
 */
type Intensity = "light" | "medium" | "heavy" | "success";

const MS: Record<Intensity, number> = {
  light: 10,
  medium: 18,
  heavy: 28,
  success: 14,
};

export function useHaptics() {
  return (intensity: Intensity = "light") => {
    try {
      const cap = (window as any).Capacitor;
      if (cap?.Plugins?.Haptics) {
        cap.Plugins.Haptics.impact({ style: intensity === "heavy" ? "HEAVY" : intensity === "medium" ? "MEDIUM" : "LIGHT" });
        return;
      }
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        (navigator as any).vibrate(MS[intensity]);
      }
    } catch {
      /* ignore */
    }
  };
}
