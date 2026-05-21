import type { CSSProperties } from "react";

export const ACCENT = "#7C3AED";
export const BG = "#08080f";
export const CARD_BG = "#111118";
export const BORDER = "1px solid rgba(255,255,255,0.06)";
export const MUTED = "#8b8b91";
export const TEXT = "#ffffff";

export const serif: CSSProperties = { fontFamily: "'DM Serif Display', serif" };
export const syne: CSSProperties = { fontFamily: "'Syne', sans-serif" };
export const inter: CSSProperties = { fontFamily: "'Inter', sans-serif" };
export const mono: CSSProperties = { fontFamily: "'JetBrains Mono', monospace" };

export const screen: CSSProperties = {
  minHeight: "100dvh",
  background: BG,
  color: TEXT,
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

export const label: CSSProperties = {
  ...mono,
  fontSize: 10,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: MUTED,
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
  borderRadius: 12,
  background: ACCENT,
  color: "#ffffff",
  border: "none",
  fontWeight: 700,
  fontSize: 15,
  letterSpacing: "0.02em",
  cursor: "pointer",
  textDecoration: "none",
};

export const ghostButton: CSSProperties = {
  ...syne,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  minHeight: 48,
  borderRadius: 12,
  background: "transparent",
  color: TEXT,
  border: BORDER,
  fontWeight: 600,
  fontSize: 14,
  cursor: "pointer",
  textDecoration: "none",
};
