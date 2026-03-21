export interface HelpResource {
  id: string;
  name: string;
  description: string;
  phone: string;
  whatsapp?: string;
  hours: string;
  icon: string;
}

export const emergencyResources: HelpResource[] = [
  {
    id: 'saps',
    name: 'SAPS Emergency',
    description: 'South African Police Service — Immediate danger',
    phone: '10111',
    hours: '24/7',
    icon: '🚨',
  },
  {
    id: 'gbv-command',
    name: 'GBV Command Centre',
    description: 'National GBV hotline — counseling & support',
    phone: '0800 428 428',
    hours: '24/7',
    icon: '📞',
  },
  {
    id: 'lifeline',
    name: 'Lifeline South Africa',
    description: 'Crisis counseling and emotional support',
    phone: '0861 322 322',
    hours: '24/7',
    icon: '💚',
  },
  {
    id: 'powa',
    name: 'People Opposing Women Abuse (POWA)',
    description: 'Legal advice and shelter referrals',
    phone: '011 642 4345',
    whatsapp: '+27116424345',
    hours: 'Mon–Fri 8am–4pm',
    icon: '⚖️',
  },
];

export const supportResources: HelpResource[] = [
  {
    id: '1000women',
    name: '1000 Women Trust',
    description: 'First Responder network and community support',
    phone: '087 373 1585',
    whatsapp: '0873731585',
    hours: 'WhatsApp chatbot 24/7',
    icon: '🤝',
  },
  {
    id: 'mosaic',
    name: 'MOSAIC Training',
    description: 'Trauma counseling and legal advocacy',
    phone: '021 761 7585',
    hours: 'Mon–Fri 8am–5pm',
    icon: '🛡️',
  },
];
