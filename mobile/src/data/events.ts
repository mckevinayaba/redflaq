export interface EventAttendee {
  id: string;
  name: string;
  initial: string;
  color: string;
  verified: boolean;
  rsvpAt: string;
}

export interface GroupEvent {
  id: string;
  groupId: string;
  title: string;
  description: string;
  date: string;   // YYYY-MM-DD
  time: string;   // HH:MM
  duration: string;
  type: 'virtual' | 'in-person';
  location?: string;
  maxAttendees?: number;
  attendees: EventAttendee[];
}

export const EVENTS: GroupEvent[] = [
  {
    id: 'ev-jhb-upcoming',
    groupId: 'healing-circle-jhb',
    title: 'Monthly Facilitator-Led Session',
    description: "This month's guided session focuses on naming patterns without re-traumatising yourself. Led by Precious M. No prep required — just bring yourself.",
    date: '2026-05-24',
    time: '18:00',
    duration: '1.5 hours',
    type: 'virtual',
    maxAttendees: 20,
    attendees: [
      { id: 'ea1', name: 'Nomvula S.', initial: 'N', color: '#6C35DE', verified: true,  rsvpAt: '2026-05-18T09:00:00Z' },
      { id: 'ea2', name: 'Precious M.', initial: 'P', color: '#C0392B', verified: true,  rsvpAt: '2026-05-18T09:01:00Z' },
      { id: 'ea3', name: 'Thandi K.',   initial: 'T', color: '#27AE60', verified: true,  rsvpAt: '2026-05-19T12:30:00Z' },
      { id: 'ea4', name: 'Ayanda R.',   initial: 'A', color: '#E67E22', verified: false, rsvpAt: '2026-05-20T08:10:00Z' },
    ],
  },
  {
    id: 'ev-jhb-past',
    groupId: 'healing-circle-jhb',
    title: 'Peer Check-In: Setting Limits',
    description: 'Informal peer-led conversation on recognising and communicating your limits in daily life and relationships.',
    date: '2026-05-20',
    time: '18:00',
    duration: '1 hour',
    type: 'virtual',
    attendees: [
      { id: 'ea5', name: 'Nomvula S.', initial: 'N', color: '#6C35DE', verified: true,  rsvpAt: '2026-05-17T10:00:00Z' },
      { id: 'ea6', name: 'Ayanda R.',  initial: 'A', color: '#E67E22', verified: false, rsvpAt: '2026-05-18T14:00:00Z' },
    ],
  },
  {
    id: 'ev-ubuntu-upcoming',
    groupId: 'ubuntu-healing-durban',
    title: 'Ubuntu Story Circle — Naming It',
    description: "This month's theme is Naming It. Bring a word, a sentence, a poem, or just yourself. There is no wrong way to show up.",
    date: '2026-05-29',
    time: '18:00',
    duration: '1.5 hours',
    type: 'virtual',
    attendees: [
      { id: 'ea7', name: 'Nokukhanya B.', initial: 'N', color: '#27AE60', verified: true, rsvpAt: '2026-05-21T08:00:00Z' },
      { id: 'ea8', name: 'Sindi P.',      initial: 'S', color: '#6C35DE', verified: true, rsvpAt: '2026-05-21T09:00:00Z' },
    ],
  },
  {
    id: 'ev-pta-upcoming',
    groupId: 'know-your-rights-pta',
    title: 'Volunteer Attorney Q&A: Protection Orders',
    description: 'Ask a qualified attorney about protection order applications, renewals, and what to do when one is breached.',
    date: '2026-05-28',
    time: '18:00',
    duration: '1 hour',
    type: 'virtual',
    maxAttendees: 15,
    attendees: [
      { id: 'ea9',  name: 'Dineo M.',  initial: 'D', color: '#C0392B', verified: true, rsvpAt: '2026-05-20T11:00:00Z' },
      { id: 'ea10', name: 'Phindi L.', initial: 'P', color: '#E67E22', verified: true, rsvpAt: '2026-05-20T11:30:00Z' },
    ],
  },
  {
    id: 'ev-legal-upcoming',
    groupId: 'legal-rights-sa',
    title: 'Know Your Rights: Divorce & Assets',
    description: 'A volunteer paralegal walks through community of property, divorce grounds, and asset division under South African law.',
    date: '2026-05-30',
    time: '10:00',
    duration: '2 hours',
    type: 'virtual',
    attendees: [
      { id: 'ea11', name: 'Lindiwe N.', initial: 'L', color: '#6C35DE', verified: true, rsvpAt: '2026-05-19T08:00:00Z' },
      { id: 'ea12', name: 'Zanele M.',  initial: 'Z', color: '#27AE60', verified: true, rsvpAt: '2026-05-20T16:00:00Z' },
    ],
  },
];
