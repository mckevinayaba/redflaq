import React from 'react';

export const COLORS = {
  bg: '#08080f',
  card: '#111118',
  section: '#0d0d1a',
  purple: '#6C35DE',
  purpleLight: 'rgba(108,53,222,0.12)',
  purpleBorder: 'rgba(108,53,222,0.25)',
  danger: '#C0392B',
  dangerLight: 'rgba(192,57,43,0.1)',
  dangerBorder: 'rgba(192,57,43,0.3)',
  success: '#27AE60',
  successLight: 'rgba(39,174,96,0.1)',
  amber: '#D97706',
  amberLight: 'rgba(217,119,6,0.1)',
  white: '#ffffff',
  textBody: '#d1d1d6',
  textMuted: '#8b8b91',
  border: 'rgba(255,255,255,0.06)',
  borderMid: 'rgba(255,255,255,0.1)',
} as const;

export const CARD_STYLE: React.CSSProperties = {
  background: COLORS.card,
  border: `1px solid ${COLORS.purpleBorder}`,
  borderRadius: 8,
};
