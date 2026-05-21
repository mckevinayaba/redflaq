export type GroupCategory = 'healing' | 'legal' | 'financial' | 'parenting' | 'youth' | 'faith' | 'general';

export interface GroupMember {
  id: string;
  name: string;
  initial: string;
  color: string;
  role: 'founder' | 'moderator' | 'member';
  verified: boolean;
  province: string;
  bio: string;
  joinedAt: string;
}

export interface Group {
  id: string;
  name: string;
  category: GroupCategory;
  categoryLabel: string;
  description: string;
  about: string[];
  memberCount: number;
  members: GroupMember[];
  province: string;
  tags: string[];
  verificationRequired: boolean;
  featured?: boolean;
  matchScore: number;
  founded: string;
}

export const GROUP_CATEGORIES: { id: GroupCategory | 'all'; label: string }[] = [
  { id: 'all',       label: 'All' },
  { id: 'healing',   label: 'Healing' },
  { id: 'legal',     label: 'Legal Rights' },
  { id: 'financial', label: 'Financial' },
  { id: 'parenting', label: 'Parenting' },
  { id: 'youth',     label: 'Youth' },
  { id: 'faith',     label: 'Faith' },
];

export const CATEGORY_COLOR: Record<GroupCategory, string> = {
  healing:   '#C0392B',
  legal:     '#6C35DE',
  financial: '#27AE60',
  parenting: '#E67E22',
  youth:     '#3498DB',
  faith:     '#9B59B6',
  general:   '#8b8b91',
};

export const GROUPS: Group[] = [
  {
    id: 'healing-circle-jhb',
    name: 'Healing Circle JHB',
    category: 'healing',
    categoryLabel: 'Healing',
    description: 'A private space for women in Johannesburg navigating recovery. No judgment. No pressure to perform.',
    about: [
      'We meet virtually every second Thursday. This is a space to name things, be heard, and slowly rebuild. A zero-tolerance policy for victim-blaming applies at all times.',
      'Facilitator-led discussions monthly. Peer-led the rest of the time. No one is required to share; listening counts.',
      'All members must have completed a SafeMatch profile. Chat opens once all members in a thread are verified. Your safety matters before anything else.',
    ],
    memberCount: 47,
    members: [
      { id: 'm1', name: 'Nomvula S.', initial: 'N', color: '#6C35DE', role: 'founder', verified: true, province: 'Gauteng', bio: 'Survivor advocate. Four years on the healing path. Founded this group after not finding what she needed.', joinedAt: '2023-11-01' },
      { id: 'm2', name: 'Precious M.', initial: 'P', color: '#C0392B', role: 'moderator', verified: true, province: 'Gauteng', bio: 'Social worker by trade. Here to hold space, not fix people.', joinedAt: '2024-01-15' },
      { id: 'm3', name: 'Thandi K.', initial: 'T', color: '#27AE60', role: 'member', verified: true, province: 'Gauteng', bio: 'New here. Still finding words for things that happened.', joinedAt: '2024-08-22' },
      { id: 'm4', name: 'Ayanda R.', initial: 'A', color: '#E67E22', role: 'member', verified: false, province: 'Gauteng', bio: 'Two kids. Learning to breathe again.', joinedAt: '2024-09-01' },
    ],
    province: 'Gauteng',
    tags: ['Virtual', 'Peer-led', 'Facilitator'],
    verificationRequired: true,
    featured: true,
    matchScore: 92,
    founded: '2023-11-01',
  },
  {
    id: 'ubuntu-healing-durban',
    name: 'Ubuntu Healing Circle',
    category: 'healing',
    categoryLabel: 'Healing',
    description: 'Durban-based circle drawing on Ubuntu philosophy. Community-centred recovery.',
    about: [
      '"I am because we are." This group centres community as a healing tool. We combine peer support with cultural practices: storytelling, shared meals (virtually), and honest conversation about how our communities sometimes enable abuse.',
      'Open to all women in Durban and surrounds. No professional credentials required to join or to speak.',
    ],
    memberCount: 44,
    members: [
      { id: 'm18', name: 'Nokukhanya B.', initial: 'N', color: '#27AE60', role: 'founder', verified: true, province: 'KwaZulu-Natal', bio: 'Community health worker and cultural practitioner. Has run healing circles for six years.', joinedAt: '2023-07-01' },
      { id: 'm19', name: 'Sindi P.', initial: 'S', color: '#6C35DE', role: 'moderator', verified: true, province: 'KwaZulu-Natal', bio: 'Poet. Facilitator. Durban-born, Durban-rooted.', joinedAt: '2023-09-05' },
      { id: 'm20', name: 'Thuli M.', initial: 'T', color: '#C0392B', role: 'member', verified: false, province: 'KwaZulu-Natal', bio: 'Just joined. Looking for her people.', joinedAt: '2024-10-01' },
    ],
    province: 'KwaZulu-Natal',
    tags: ['Ubuntu', 'Cultural', 'Community'],
    verificationRequired: false,
    featured: false,
    matchScore: 88,
    founded: '2023-07-01',
  },
  {
    id: 'know-your-rights-pta',
    name: 'Know Your Rights PTA',
    category: 'legal',
    categoryLabel: 'Legal Rights',
    description: 'Pretoria-based guidance on protection orders, SAPS processes, and magistrate courts.',
    about: [
      'Navigating the legal system after abuse. We cover: how to apply for a protection order, what to expect at the magistrate\'s court, how to report to SAPS, and how to access the NPA\'s Thuthuzela Care Centres.',
      'Volunteer attorneys answer questions on Tuesdays between 18:00 and 20:00. All conversations stay within the group.',
    ],
    memberCount: 38,
    members: [
      { id: 'm16', name: 'Dineo M.', initial: 'D', color: '#C0392B', role: 'founder', verified: true, province: 'Gauteng', bio: 'Magistrate court clerk for eight years. Knows the system from the inside.', joinedAt: '2023-12-01' },
      { id: 'm17', name: 'Phindi L.', initial: 'P', color: '#E67E22', role: 'moderator', verified: true, province: 'Gauteng', bio: 'LLM candidate. GBV legal clinic volunteer on weekends.', joinedAt: '2024-02-18' },
    ],
    province: 'Gauteng',
    tags: ['Courts', 'Protection Orders', 'SAPS'],
    verificationRequired: true,
    featured: false,
    matchScore: 82,
    founded: '2023-12-01',
  },
  {
    id: 'legal-rights-sa',
    name: 'Legal Rights SA',
    category: 'legal',
    categoryLabel: 'Legal Rights',
    description: 'Know your rights. Share resources. Paralegals and lawyers volunteer here weekly.',
    about: [
      'Practical legal information for women navigating protection orders, custody, and divorce proceedings in South Africa. We share NPA resources, shelter contacts, and court preparation tips.',
      'This is not a substitute for legal advice, but we help you ask the right questions and understand the answers.',
    ],
    memberCount: 82,
    members: [
      { id: 'm5', name: 'Lindiwe N.', initial: 'L', color: '#6C35DE', role: 'founder', verified: true, province: 'Nationwide', bio: 'Paralegal with eight years in gender-based law. Started this when she couldn\'t find the answers she needed after her own case.', joinedAt: '2023-06-01' },
      { id: 'm6', name: 'Boitumelo P.', initial: 'B', color: '#C0392B', role: 'moderator', verified: true, province: 'Gauteng', bio: 'LLB student. Volunteer legal aid at Johannesburg clinics.', joinedAt: '2023-09-14' },
      { id: 'm7', name: 'Zanele M.', initial: 'Z', color: '#27AE60', role: 'member', verified: true, province: 'Western Cape', bio: 'In the middle of a contested divorce. Using this group to understand what is happening in court.', joinedAt: '2024-03-20' },
    ],
    province: 'Nationwide',
    tags: ['Legal', 'Resources', 'Pro-bono'],
    verificationRequired: true,
    featured: false,
    matchScore: 78,
    founded: '2023-06-01',
  },
  {
    id: 'financial-freedom',
    name: 'Financial Freedom Network',
    category: 'financial',
    categoryLabel: 'Financial',
    description: 'Rebuilding financial independence after coercive control. Budgets, credit, income.',
    about: [
      'Financial abuse is one of the most common and least-discussed forms of control. This group focuses on practical steps: rebuilding credit, understanding rights to shared assets, budgeting on a single income, and finding grants.',
      'We share worksheets, government resources, and honest peer experience about money — the thing most groups avoid.',
    ],
    memberCount: 29,
    members: [
      { id: 'm8', name: 'Nosipho V.', initial: 'N', color: '#E67E22', role: 'founder', verified: true, province: 'Western Cape', bio: 'Financial coach. Survived ten years of financial control. Built this to give others the knowledge she had to find herself.', joinedAt: '2024-02-01' },
      { id: 'm9', name: 'Khanyi T.', initial: 'K', color: '#6C35DE', role: 'member', verified: true, province: 'Gauteng', bio: 'Got her own bank account for the first time in seven years. Documenting the whole process.', joinedAt: '2024-05-10' },
    ],
    province: 'Western Cape',
    tags: ['Budgeting', 'Credit', 'Grants'],
    verificationRequired: false,
    featured: false,
    matchScore: 71,
    founded: '2024-02-01',
  },
  {
    id: 'solo-moms-united',
    name: 'Solo Moms United',
    category: 'parenting',
    categoryLabel: 'Parenting',
    description: 'Single mothers navigating custody, co-parenting with a controlling ex, and building stability.',
    about: [
      'Parenting after leaving is its own chapter. This group covers co-parenting with a controlling ex, protecting children during court proceedings, explaining what is happening in age-appropriate ways, and finding childcare resources.',
      'All moms. All stages. The one who left last week and the one who left five years ago. Judgment-free.',
    ],
    memberCount: 61,
    members: [
      { id: 'm10', name: 'Mandisa L.', initial: 'M', color: '#C0392B', role: 'founder', verified: true, province: 'Nationwide', bio: 'Three kids. Two custody battles. Still standing, still advocating.', joinedAt: '2023-08-15' },
      { id: 'm11', name: 'Palesa D.', initial: 'P', color: '#6C35DE', role: 'moderator', verified: true, province: 'Gauteng', bio: 'Social worker specialising in child protection proceedings.', joinedAt: '2023-10-01' },
      { id: 'm12', name: 'Refilwe K.', initial: 'R', color: '#27AE60', role: 'member', verified: false, province: 'North West', bio: 'Seven-month-old. Just left three weeks ago. Terrified but okay.', joinedAt: '2024-09-20' },
    ],
    province: 'Nationwide',
    tags: ['Custody', 'Co-parenting', 'Resources'],
    verificationRequired: false,
    featured: false,
    matchScore: 65,
    founded: '2023-08-15',
  },
  {
    id: 'young-survivors-kzn',
    name: 'Young Survivors KZN',
    category: 'youth',
    categoryLabel: 'Youth',
    description: 'For women under 30 in KwaZulu-Natal. Recognising red flags early. Building safe futures.',
    about: [
      'For women aged 18–30 based in KwaZulu-Natal navigating early relationship warning signs or recovering from a first encounter with abuse.',
      'We talk about red flags, self-worth, and what healthy relationships actually look like when you\'ve never seen one modelled. Peer-led. Direct. No lectures.',
    ],
    memberCount: 23,
    members: [
      { id: 'm13', name: 'Sbonelo M.', initial: 'S', color: '#6C35DE', role: 'founder', verified: true, province: 'KwaZulu-Natal', bio: 'Psychology student. Started this after her own experience at 21. Wants others to have the vocabulary she didn\'t.', joinedAt: '2024-04-01' },
      { id: 'm14', name: 'Khanyisile T.', initial: 'K', color: '#C0392B', role: 'member', verified: true, province: 'KwaZulu-Natal', bio: '22 years old. Still figuring it all out.', joinedAt: '2024-07-12' },
    ],
    province: 'KwaZulu-Natal',
    tags: ['Youth', 'Prevention', 'Peer-led'],
    verificationRequired: false,
    featured: false,
    matchScore: 58,
    founded: '2024-04-01',
  },
  {
    id: 'faith-and-healing-cpt',
    name: 'Faith & Healing CPT',
    category: 'faith',
    categoryLabel: 'Faith',
    description: 'Spiritual recovery for women of faith navigating abuse within religious contexts.',
    about: [
      'For women who experienced abuse within religious marriages or communities and who still hold onto faith while processing trauma. This space holds both: the faith and the pain.',
      'Multi-denominational and non-judgmental. A safe place to ask hard questions about what you were taught versus what you now know.',
    ],
    memberCount: 19,
    members: [
      { id: 'm15', name: 'Miriam N.', initial: 'M', color: '#6C35DE', role: 'founder', verified: true, province: 'Western Cape', bio: 'Pastoral counsellor with twelve years in faith communities. Carries her own story alongside yours.', joinedAt: '2024-01-20' },
    ],
    province: 'Western Cape',
    tags: ['Faith', 'Trauma', 'Community'],
    verificationRequired: false,
    featured: false,
    matchScore: 45,
    founded: '2024-01-20',
  },
];
