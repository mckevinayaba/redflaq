import React from 'react';

export const FONTS = {
  inter: "'Inter', sans-serif",
  mono: "'JetBrains Mono', monospace",
  playfair: "'Playfair Display', serif",
} as const;

export const TEXT = {
  h1: { fontFamily: "'Inter', sans-serif", fontSize: 28, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', lineHeight: 1.15 } as React.CSSProperties,
  h2: { fontFamily: "'Inter', sans-serif", fontSize: 22, fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 } as React.CSSProperties,
  h3: { fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 } as React.CSSProperties,
  playfairHero: { fontFamily: "'Playfair Display', serif", fontSize: 32, fontWeight: 900, color: '#ffffff', lineHeight: 1.1, letterSpacing: '-0.02em' } as React.CSSProperties,
  body: { fontFamily: "'Inter', sans-serif", fontSize: 15, color: '#d1d1d6', lineHeight: 1.6 } as React.CSSProperties,
  bodySmall: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#d1d1d6', lineHeight: 1.6 } as React.CSSProperties,
  muted: { fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#8b8b91', lineHeight: 1.5 } as React.CSSProperties,
  label: { fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#8b8b91', letterSpacing: '0.12em', textTransform: 'uppercase' as const } as React.CSSProperties,
  mono: { fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#8b8b91' } as React.CSSProperties,
} as const;
