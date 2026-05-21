export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

export interface QuizSection {
  letter: string;
  title: string;
  subtitle: string;
  questions: QuizQuestion[];
}

export const SECTIONS: QuizSection[] = [
  {
    letter: 'A',
    title: 'Interests & Lifestyle',
    subtitle: 'How you live day to day',
    questions: [
      { id: 'a1', text: 'How do you prefer to spend your weekends?', options: ['Outdoors — hiking, beaches, parks', 'Cultural — arts, markets, museums', 'Social — friends, restaurants, events', 'Home — reading, cooking, streaming'] },
      { id: 'a2', text: 'What is your relationship with your career?', options: ["Building something — I'm ambitious and focused", 'It funds my life — I live outside work', 'Flexible work is everything — I need freedom', "I'm in transition — figuring it out"] },
      { id: 'a3', text: 'How often do you exercise?', options: ['Daily — it\'s non-negotiable', 'A few times a week', 'When the mood takes me', 'Rarely — I\'m working on this'] },
      { id: 'a4', text: 'What is your approach to money?', options: ['I save aggressively and plan everything', 'I spend mindfully but enjoy life', 'I prioritise experiences over saving', "I'm actively trying to get better with money"] },
      { id: 'a5', text: 'How important is food and cooking to you?', options: ['I cook often — food is how I love people', 'I enjoy eating out more than cooking', 'Both equally — depends on my mood', 'Food is mostly just fuel for me'] },
      { id: 'a6', text: 'What does a perfect evening look like?', options: ['Dinner party with people I love', 'Quiet evening at home, just me', 'Out at a live show or event', 'Completely depends on my mood that day'] },
      { id: 'a7', text: 'How do you feel about pets?', options: ['I have pets — they are family', "I love animals but don't have any", "I'm not really an animal person", 'Allergic or other barrier'] },
      { id: 'a8', text: 'What is your relationship with social media?', options: ['I post often and stay connected', 'I scroll but rarely post', 'I\'m deliberately reducing my use', "I'm barely on it by choice"] },
      { id: 'a9', text: 'How do you handle travel?', options: ["I travel as often as I can afford to", 'I prefer local and domestic trips', 'I want to travel — finances are the barrier', "I'm a homebody — travel isn't a priority"] },
      { id: 'a10', text: 'What is your ideal living situation?', options: ['City apartment — I love the energy', 'Suburban home with space and quiet', 'Small town or semi-rural', 'Anywhere that is safe and mine'] },
    ],
  },
  {
    letter: 'B',
    title: 'Values & Worldview',
    subtitle: 'What you believe and stand for',
    questions: [
      { id: 'b1', text: 'What role does family play in your life?', options: ['Central — family comes before everything', 'Important, but I hold strong boundaries', 'Complicated — love each other but it\'s hard', "I've built my own chosen family"] },
      { id: 'b2', text: 'How do you feel about religion or spirituality?', options: ['My faith shapes how I live', 'I\'m spiritual but not religious', 'I\'m secular — science is my framework', "I'm still exploring and figuring it out"] },
      { id: 'b3', text: 'What is your view on gender roles in relationships?', options: ['Traditional — I believe in defined roles', 'Flexible — we figure it out together', "Equal — I don't believe in gendered roles", 'It depends entirely on the situation'] },
      { id: 'b4', text: 'How do you engage with GBV issues in South Africa?', options: ['It defines how I live and move daily', 'I take it seriously and stay informed', 'I try to stay aware when I can', 'I want to be more informed about this'] },
      { id: 'b5', text: 'What is your stance on social justice issues?', options: ['I actively show up — marches, advocacy, donation', 'I\'m deeply concerned and engaged online', 'I have complicated or mixed views', 'I focus on my immediate community'] },
      { id: 'b6', text: 'How do you want to handle conflict in close relationships?', options: ['Talk it through immediately', 'Cool off first, then discuss calmly', 'I tend to avoid conflict — I\'m working on this', "I find conflict very difficult and mostly withdraw"] },
      { id: 'b7', text: 'How important is intellectual compatibility?', options: ['Critical — we need to debate and challenge each other', 'Important, but not the only thing that matters', 'Less important than emotional connection', 'I value practical intelligence over academic'] },
      { id: 'b8', text: 'What is your stance on having children?', options: ['I have children — they are my priority', 'I want children eventually', "I'm open but not set on it either way", "I don't want children"] },
      { id: 'b9', text: 'What quality matters most in a person?', options: ['Integrity — they do what they say', 'Warmth — they make people feel safe', 'Ambition — they are building toward something', 'Consistency — they show up every single time'] },
      { id: 'b10', text: 'How do you process difficult experiences?', options: ['Therapy or counselling — I believe in it', 'Journaling and solo reflection', 'Trusted friends who really know me', "I prefer to work through things on my own"] },
    ],
  },
  {
    letter: 'C',
    title: 'Social Style',
    subtitle: 'How you connect with people',
    questions: [
      { id: 'c1', text: 'How would close friends describe you?', options: ['The planner — I make things happen', 'The listener — people come to me', 'The energiser — I bring the mood up', "The honest one — I say what others won't"] },
      { id: 'c2', text: 'How do you feel at large social events?', options: ['Energised — I love meeting new people', 'Comfortable once I settle in', 'I strongly prefer small gatherings', 'I generally avoid them where possible'] },
      { id: 'c3', text: 'How do you communicate when something is wrong?', options: ['Directly — I name it clearly', 'Carefully — I wait for the right moment', "I struggle to bring things up at all", 'It depends entirely on who it is'] },
      { id: 'c4', text: 'How much alone time do you need?', options: ['A lot — I recharge completely in solitude', 'Some — balance is essential for me', "Not much — I like being around people", 'It shifts significantly with my mood'] },
      { id: 'c5', text: 'What does your friendship style look like?', options: ['A few very deep, close friendships', 'A wide, diverse social network', 'A mix of both depending on the season', 'Most of my close connections are online'] },
      { id: 'c6', text: 'How do you feel about a close friend of the opposite sex?', options: ['Completely fine — trust is the foundation', 'Fine, depending on the history and context', "I'd want openness and transparency about it", 'It would be a source of anxiety for me'] },
      { id: 'c7', text: 'How do you express care for the people you love?', options: ['Acts of service — I do things for them', 'Words — I say it clearly and often', 'Quality time — I just show up', 'Physical affection — hugs, presence'] },
      { id: 'c8', text: 'How do you handle disagreements with friends?', options: ['Address them directly and quickly', "Let it go unless it's serious enough", "It bothers me but I struggle to bring it up", 'I tend to pull away when I feel hurt'] },
      { id: 'c9', text: 'How important is humour in your relationships?', options: ['Essential — if we can\'t laugh we can\'t work', 'Important but not the most critical thing', 'I appreciate it but I lean more serious', 'I have a very specific and niche sense of it'] },
      { id: 'c10', text: 'How do you feel about close friends meeting your family?', options: ['Ideal — integration matters deeply to me', 'Nice but not essential or urgent', 'My family situation is complicated', 'I keep my relationships in separate spaces'] },
    ],
  },
  {
    letter: 'D',
    title: 'Risk Perception',
    subtitle: 'How you think about safety and trust',
    questions: [
      { id: 'd1', text: 'How do you approach safety when meeting someone new?', options: ['I research them beforehand — name, social media, records', 'I always tell someone trusted where I am going', 'I meet in public and trust my instincts', "I'm actively working on being more safety-conscious"] },
      { id: 'd2', text: 'What would be an immediate deal-breaker for you?', options: ['Any form of controlling or monitoring behaviour', 'Dishonesty about significant things', 'Disrespect for my stated boundaries', 'Any of the above — none are acceptable'] },
      { id: 'd3', text: 'How do you feel about someone who refuses a safety check?', options: ["That's a red flag — I wouldn't continue", "I'd want to understand why first", "I'd feel uncomfortable but might overlook it", "I haven't really considered this before"] },
      { id: 'd4', text: 'What is your experience with the RedFlaq platform?', options: ["I've run a check before — I know how it works", 'I know about it but haven\'t used it yet', 'I just discovered RedFlaq recently', "I'd like to learn more about what it does"] },
      { id: 'd5', text: 'How quickly do you trust new people?', options: ['Slowly — trust is earned over consistent time', 'I give initial trust and verify over time', "I'm naturally open and trusting with people", "I've become much more cautious over time"] },
      { id: 'd6', text: 'How do you feel about sharing your location with someone?', options: ["Fine — it's about safety not surveillance", 'Depends completely on the relationship stage', "It makes me uncomfortable regardless of who", "I'd only consider it if it were fully mutual"] },
      { id: 'd7', text: 'If someone you trusted behaved in a way that concerned you, what would you do?', options: ['Name it immediately and clearly', "Give it time to see if it's a pattern", 'Talk to a trusted friend or person first', "I'm honestly not sure — I find this very hard"] },
      { id: 'd8', text: 'What is your view on privacy within close relationships?', options: ['Some privacy is healthy and always necessary', 'I believe we should be able to share everything', 'Privacy matters but transparency is equally key', "I'm still working out my position on this"] },
    ],
  },
  {
    letter: 'E',
    title: 'What You\'re Looking For',
    subtitle: 'Right now, in this season',
    questions: [
      { id: 'e1', text: 'What kind of connection are you open to right now?', options: ['Friendship — no romantic interest at this stage', 'Long-term relationship — I feel ready for that', 'Casual connection — keeping it easy and open', "I'm still figuring out what I want"] },
      { id: 'e2', text: 'What matters most in the person you are looking for?', options: ['Safety and trustworthiness above everything', 'Shared values and a compatible worldview', 'Real chemistry and natural attraction', 'Emotional maturity and self-awareness'] },
    ],
  },
];

export const TOTAL_QUESTIONS = SECTIONS.reduce((s, sec) => s + sec.questions.length, 0);

export function getSectionByQuestionId(id: string): QuizSection | undefined {
  return SECTIONS.find(s => s.questions.some(q => q.id === id));
}
