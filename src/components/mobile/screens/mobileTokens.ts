import type { CSSProperties } from "react";

export const ACCENT = "#7C3AED";
export const ACCENT_DARK = "#6D28D9";

// Dark surface (Signals, Base, Connect, Journal)
export const BG = "#08080f";
export const CARD_BG = "#111118";
export const BORDER = "1px solid rgba(255,255,255,0.06)";
export const MUTED = "#8b8b91";
export const TEXT = "#ffffff";

// Cream surface (Home / hero)
export const CREAM = "#F5F0EB";
export const CREAM_INK = "#0a0a0a";
export const CREAM_MUTED = "#6b6b70";
export const CREAM_CARD = "#ffffff";
export const CREAM_BORDER = "1px solid rgba(0,0,0,0.06)";

export const serif: CSSProperties = { fontFamily: "'DM Serif Display', serif" };
export const syne: CSSProperties = { fontFamily: "'Syne', sans-serif" };
export const inter: CSSProperties = { fontFamily: "'Inter', sans-serif" };
export const mono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export const screen: CSSProperties = {
  minHeight: "100dvh",
  background: BG,
  color: TEXT,
};

export const creamScreen: CSSProperties = {
  minHeight: "100dvh",
  background: CREAM,
  color: CREAM_INK,
};

export const page: CSSProperties = {
  padding: "20px 20px 24px",
  display: "flex",
  flexDirection: "column",
  gap: 16,
};

export const card: CSSProperties = {
  background: CARD_BG,
  border: BORDER,
  borderRadius: 16,
  padding: 20,
};

export const creamCard: CSSProperties = {
  background: CREAM_CARD,
  border: CREAM_BORDER,
  borderRadius: 16,
  padding: 20,
};

export const label: CSSProperties = {
  ...mono,
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: MUTED,
};

export const creamLabel: CSSProperties = {
  ...mono,
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: ACCENT,
  fontWeight: 700,
};

export const h1: CSSProperties = {
  ...serif,
  fontSize: 36,
  lineHeight: 1.05,
  letterSpacing: "-0.01em",
  color: TEXT,
};

export const sectionTitle: CSSProperties = {
  ...syne,
  fontSize: 13,
  fontWeight: 700,
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  color: TEXT,
};

export const primaryButton: CSSProperties = {
  ...syne,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: "100%",
  minHeight: 52,
  borderRadius: 999,
  background: ACCENT,
  color: "#ffffff",
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "0.02em",
  cursor: "pointer",
  textDecoration: "none",
  boxShadow: "0 8px 24px -8px rgba(124,58,237,0.5)",
};

export const ghostButton: CSSProperties = {
  ...syne,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 52,
  borderRadius: 999,
  background: "transparent",
  color: CREAM_INK,
  border: "2px solid #0a0a0a",
  fontWeight: 700,
  fontSize: 15,
  cursor: "pointer",
  textDecoration: "none",
};
