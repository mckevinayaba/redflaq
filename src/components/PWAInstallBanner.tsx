import { useState } from "react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { X, Download, Share } from "lucide-react";

const DISMISS_KEY = "pwa-banner-dismissed";
const DISMISS_DAYS = 7;

const isDismissed = () => {
  const val = localStorage.getItem(DISMISS_KEY);
  if (!val) return false;
  return Date.now() < Number(val);
};

export const PWAInstallBanner = () => {
  const { canInstall, isIOS, isInstalled, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(isDismissed());

  if (!canInstall || isInstalled || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now() + DISMISS_DAYS * 86400000));
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] safe-area-bottom animate-slide-up">
      <div
        className="mx-auto max-w-lg m-3 rounded-2xl shadow-2xl border border-white/20 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)" }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          <img
            src="/pwa-icon.png"
            alt="RedFlaq"
            className="w-11 h-11 rounded-xl shadow-md flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <p className="text-white font-bold text-sm leading-tight">Install RedFlaq</p>
            {isIOS ? (
              <p className="text-white/80 text-xs leading-snug mt-0.5">
                Tap <Share className="inline w-3 h-3 -mt-0.5" /> Share → <strong>Add to Home Screen</strong>
              </p>
            ) : (
              <p className="text-white/80 text-xs leading-snug mt-0.5">
                Add to your home screen for quick access
              </p>
            )}
          </div>

          {!isIOS && (
            <button
              onClick={promptInstall}
              className="flex-shrink-0 bg-white text-[#7C3AED] font-bold text-sm px-4 py-2 rounded-xl hover:bg-white/90 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              Install
            </button>
          )}

          <button
            onClick={dismiss}
            className="flex-shrink-0 text-white/60 hover:text-white transition-colors p-1"
            aria-label="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
