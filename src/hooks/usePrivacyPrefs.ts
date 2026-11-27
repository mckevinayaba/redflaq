import { useState, useCallback } from "react";

export type PrivacyPrefs = {
  saveChecks: boolean;      // Whether completed checks are saved to account history
  discreetMode: boolean;    // Suppress check text from page title / meta
  lowDataMode: boolean;     // Skip non-essential network calls (analytics, etc.)
};

const STORAGE_KEY = "rf2_privacy_prefs";

const DEFAULTS: PrivacyPrefs = {
  saveChecks: false,       // Off by default — user opts in
  discreetMode: false,
  lowDataMode: false,
};

function readPrefs(): PrivacyPrefs {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function writePrefs(prefs: PrivacyPrefs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {}
}

export function usePrivacyPrefs() {
  const [prefs, setPrefsState] = useState<PrivacyPrefs>(readPrefs);

  const setPrefs = useCallback((update: Partial<PrivacyPrefs>) => {
    setPrefsState((prev) => {
      const next = { ...prev, ...update };
      writePrefs(next);
      return next;
    });
  }, []);

  return { prefs, setPrefs };
}
