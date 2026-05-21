export interface Signal {
  id: string;
  category: string;
  categoryLabel: string;
  title: string;
  excerpt: string;
  body: string[];
  readMinutes: number;
  publishedAt: string;
  featured?: boolean;
}

export const SIGNALS: Signal[] = [
  {
    id: 'anger-control',
    category: 'behavioral-patterns',
    categoryLabel: 'Behavioral Patterns',
    title: 'Anger is a Control Mechanism',
    excerpt: "Explosions of rage aren't random. They're targeted. And that specificity is the tell.",
    body: [
      "Explosive rage isn't random. It's targeted. It happens when he doesn't get what he wants — when dinner is late, when you question him, when you try to leave. That specificity is the tell. Real loss of control doesn't discriminate. His does.",
      "The explosion comes when it will have the most impact — in private, where there are no witnesses. In public, he's the charmer. The good man. Everyone's favourite. That contrast isn't incidental. It's architecture.",
      "The calm-to-rage cycle keeps you monitoring his emotional state constantly — adjusting your behaviour to avoid triggering him. You become the keeper of his mood. That's not love. That's captivity.",
      "What he learned is that anger works. It silences you. It ends arguments. It makes you apologise when you've done nothing wrong. Until you name it as a control tactic — not a character flaw, not childhood trauma — you will keep trying to manage it. It cannot be managed. It can only be left.",
    ],
    readMinutes: 3,
    publishedAt: '2025-05-12',
    featured: true,
  },
  {
    id: 'month-12',
    category: 'dating-relationships',
    categoryLabel: 'Dating & Relationships',
    title: 'Month 12 Is When He Stops Pretending',
    excerpt: "The mask doesn't slip. It's deliberately removed — once he's decided you're committed enough not to leave.",
    body: [
      "The first year is the performance. He's attentive, emotionally available, consistent. He mirrors your values. He says the right things. This is deliberate. This is him learning what keeps you close.",
      "By month 12, the investment is secured. You've introduced him to your family. You've rearranged your life. The cost of leaving feels enormous. That's when the real behaviour starts.",
      "It doesn't arrive all at once. First it's a tone. Then a criticism. Then an incident he later explains away. You compare it to month 3 and think: maybe he's just stressed. You're comparing him to the performance, not the person.",
      "There's no relationship that starts badly and improves. The pattern runs the other way. Watch what he does after month 12 — not what he said in month 1.",
    ],
    readMinutes: 4,
    publishedAt: '2025-05-05',
  },
  {
    id: 'screenshot-before-leave',
    category: 'safety-habits',
    categoryLabel: 'Safety Habits',
    title: '5 Things to Screenshot Before You Leave',
    excerpt: 'Courts and lawyers work with evidence, not feelings. Secure these before anything changes.',
    body: [
      "If you're planning to leave — or even thinking about it — there are five categories of digital evidence you need before you go. Once you're out, access to shared devices and your own message history can disappear.",
      "1. Threatening messages — screenshots of every text, WhatsApp, or DM that contains a threat, insult, or reference to what he'll do if you leave. Include the sender name and timestamp in frame. 2. Financial evidence — photos of joint accounts and any documentation that shows financial control.",
      "3. Medical records — any clinic visit connected to injury. Download the records. 4. Injury photos — documented with timestamps and sent immediately to a trusted person outside the home. 5. His social media profiles — screenshots with his handle and display photo visible. These prove identity in court.",
      "Store everything in an email account he doesn't know about, or cloud storage he can't access. Delete the app after uploading. This is not paranoia. This is preparation.",
    ],
    readMinutes: 3,
    publishedAt: '2025-04-28',
  },
  {
    id: 'why-you-stayed',
    category: 'trust-denial',
    categoryLabel: 'Trust & Denial',
    title: "Why You Didn't Leave Sooner",
    excerpt: "It wasn't weakness. It wasn't stupidity. It was neuroscience — and he exploited it deliberately.",
    body: [
      "Trauma bonding is a physiological response. When abuse is followed by affection, the brain releases dopamine — the same chemical triggered by gambling and drug use. The intermittent reinforcement of cruelty and kindness is more addictive than consistent kindness. This is not metaphorical. It's neurological.",
      "He didn't just hurt you. He also comforted you after. He created the wound and became the healer. Your dependency on him was manufactured by his behaviour, not evidence of your weakness.",
      "The outside world sees the cruelty and asks why you stayed. But from inside, you were waiting for the man you fell in love with — because you had seen him. He was real enough, often enough, to make leaving feel like giving up on someone who existed.",
      "You didn't fail to leave because you were weak. You stayed because your nervous system was doing exactly what it was designed to do under threat: bond to the source of both danger and safety. Understanding this is not an excuse. It's the beginning of clarity.",
    ],
    readMinutes: 5,
    publishedAt: '2025-04-21',
  },
  {
    id: 'protection-order-truth',
    category: 'gbv-evidence',
    categoryLabel: 'GBV & Evidence',
    title: "What the SAPS Won't Tell You About Protection Orders",
    excerpt: 'A protection order is a document. It does not protect you. Here\'s what does.',
    body: [
      "A domestic violence protection order is a piece of paper that says a court believes you. It is not a physical barrier. It doesn't make him comply. It creates a legal consequence if he violates it — assuming he's caught, charged, and prosecuted by officers who may not prioritise the call.",
      "What actually keeps you safer: people who know where you are and when to expect you. A place you can reach within 15 minutes. Not being predictable in your movements. A charged phone. The case number memorised.",
      "Apply for the order — it matters for the legal record and formally documents the threat. But do not mistake paperwork for protection. Courts close on public holidays. Stations are understaffed. He does not read court orders the way they're intended.",
      "Know where your nearest Thuthuzela Care Centre is. Know the GBV Command Centre: 0800 428 428. Have a bag ready. The order goes in the bag.",
    ],
    readMinutes: 4,
    publishedAt: '2025-04-14',
  },
  {
    id: 'cycle-not-love',
    category: 'behavioral-patterns',
    categoryLabel: 'Behavioral Patterns',
    title: "The Cycle Isn't About Love. It's About Reset.",
    excerpt: "The honeymoon phase isn't him returning. It's the system rebooting so it can run again.",
    body: [
      "The abuse cycle has four stages: tension building, incident, reconciliation, calm. The reconciliation phase — where he apologises, brings flowers, becomes the person you love — is not a sign he's changed. It's a pressure relief valve.",
      "The reconciliation serves him. It prevents you from leaving before the cycle completes again. It manages your threat level. He is not in repair. He is in reset.",
      "People confuse the reconciliation phase for evidence of love because it feels like love. The tenderness is real. But it exists in service of the pattern, not in spite of it. If he were actually changing, the next incident would not happen. It always happens.",
      "When you understand the cycle as a system — not as a relationship with bad patches — the question changes. It's no longer 'will he change?' It's 'how many cycles do I have left in me?'",
    ],
    readMinutes: 3,
    publishedAt: '2025-04-07',
  },
  {
    id: 'document-for-court',
    category: 'gbv-evidence',
    categoryLabel: 'GBV & Evidence',
    title: 'How to Document an Incident for Court',
    excerpt: 'Court-admissible documentation follows specific rules. Here\'s exactly what to capture and how.',
    body: [
      "Date, time, location. These are the first three things your documentation must include. Write them down within 24 hours. Memory is unreliable under stress — stress hormones actively degrade memory consolidation. Write immediately.",
      "Physical injuries: photograph from two distances — close enough to show the injury, far enough to show it's on your body. Include a timestamp in frame if possible. Send the photos to an email address only you can access. Injuries should also be documented by a medical professional, even if you say you 'fell' — the record exists.",
      "For verbal and emotional abuse: keep a private journal with dates, direct quotes, and your emotional state. WhatsApp messages can be exported: open the chat, three dots, 'Export Chat'. This creates a timestamped text file. Store it outside the phone.",
      "A judge who sees consistent, dated, specific records from six months ago trusts them more than a verbal account given today. Start now. Even if you're not ready to act yet. The record you make today is the evidence you'll need later.",
    ],
    readMinutes: 6,
    publishedAt: '2025-03-31',
  },
  {
    id: 'public-private-gap',
    category: 'behavioral-patterns',
    categoryLabel: 'Behavioral Patterns',
    title: 'Kindness in Public, Cruelty in Private',
    excerpt: "The gap between who he is in public and who he is at home isn't a paradox. It's a strategy.",
    body: [
      "He is warm, generous, well-liked. At parties, he's the one making people laugh. His colleagues respect him. Your friends find him charming. When you describe what happens at home, they look at you differently — not him.",
      "That's the point. His public persona is his insurance policy. It creates witnesses who will vouch for his character. It makes your account harder to believe. It isolates you, because who would believe the version of him you live with?",
      "The private cruelty isn't a contradiction to the public kindness. They serve the same function: control. The public version earns social credibility. The private version keeps you in your place. Together they create a prison where the bars are invisible to everyone outside it.",
      "The most dangerous men are the well-liked ones. Not because they're worse — because they're protected. Learn to read the gap, not just the public face.",
    ],
    readMinutes: 3,
    publishedAt: '2025-03-24',
  },
  {
    id: 'gut-gaslit',
    category: 'trust-denial',
    categoryLabel: 'Trust & Denial',
    title: "Your Gut Wasn't Wrong. You Were Gaslit.",
    excerpt: 'The moments you trusted your instinct were the correct moments. He trained you out of them.',
    body: [
      'Gaslighting doesn\'t announce itself. It sounds like: "That never happened." "You\'re being too sensitive." "You always exaggerate." "I never said that." "You\'re crazy." It\'s a sustained campaign to make you distrust your own perception.',
      "Over time, you stop bringing things up because you've learned the response will be denial. Then you stop noticing the things you used to bring up. Then you stop trusting what you see, hear, and feel. That's the objective: to make you dependent on his version of reality.",
      "The moments you thought 'something's wrong here' were correct. The instinct that noticed the inconsistency, the change in behaviour, the feeling of wrongness — that was accurate. It was then systematically overwritten.",
      "Recovery from gaslighting is slow because it's not about learning new information — it's about rebuilding trust in your own perception. Notice what you notice. Trust it. Write it down. You were not wrong. You were taught to believe you were.",
    ],
    readMinutes: 4,
    publishedAt: '2025-03-17',
  },
  {
    id: 'dating-apps-safety',
    category: 'dating-safety',
    categoryLabel: 'Dating Safety',
    title: 'Dating Apps in SA Have No Criminal Verification',
    excerpt: "His profile was verified with a phone number. That's it. Here's what to do before you meet.",
    body: [
      "South African dating apps — Tinder, Bumble, Badoo, Hinge — verify a phone number. That's the extent of their vetting. The profile you're looking at could belong to someone with an active protection order against him, multiple assault charges, or a GBV history that's fully documented in public records.",
      "Before meeting anyone from an app: reverse image search their profile photo. Google their full name plus 'South Africa'. Search their number on TrueCaller. If they refuse to video call before meeting, that's information. If they won't give you a surname before meeting, that's also information.",
      "Public record checks exist for this exact moment — before you've built attachment, before you've introduced him to your children, before the cost of leaving becomes enormous. A safety check at R99 is what it costs to know. Compare that to what it costs not to.",
      "A clear result is not a guarantee of safety. But an existing warrant, a pattern of restraining orders, an active charge — those show up. Check early. Check before feelings get involved. The best time to run a check is before the first date, not after the sixth month.",
    ],
    readMinutes: 3,
    publishedAt: '2025-03-10',
  },
];

export const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'behavioral-patterns', label: 'Behavioral' },
  { id: 'dating-relationships', label: 'Dating' },
  { id: 'safety-habits', label: 'Safety' },
  { id: 'gbv-evidence', label: 'GBV & Evidence' },
  { id: 'trust-denial', label: 'Trust & Denial' },
  { id: 'dating-safety', label: 'Dating Safety' },
];
