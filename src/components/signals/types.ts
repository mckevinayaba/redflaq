export interface SignalData {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  created_at: string;
  body?: string | null;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "behavioral-patterns": "Behavioral Patterns",
  "dating-relationships": "Dating & Relationships",
  "safety-habits": "Safety Habits",
  "gbvf-evidence": "GBVF & Evidence",
  "trust-denial": "Trust & Denial",
  "self-accountability": "Self-Accountability",
  "dating-safety": "Dating Safety",
  "gbv-resources": "GBV Resources",
};

export const formatSignalDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
