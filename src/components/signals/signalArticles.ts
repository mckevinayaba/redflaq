// ── Article content source of truth ─────────────────────────────
// All 7 approved Signals articles with exact editorial copy.
// Sections alternate paragraphs and a single pull-quote.
// Modal renders from this structure; no Supabase reads in Phase 10A.

export interface ArticleSection {
  type: "paragraph" | "pullQuote";
  text: string;
}

export interface SignalArticleContent {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  bodySections: ArticleSection[];
  action: {
    headline: string;
    description: string;
    cta: string;
    href: string;
  };
  seededLikeCount: number;
  seededCommentCount: number;
}

const p = (text: string): ArticleSection => ({ type: "paragraph", text });
const q = (text: string): ArticleSection => ({ type: "pullQuote", text });

export const SIGNAL_ARTICLES: SignalArticleContent[] = [
  // ── Article 1 ────────────────────────────────────────────────
  {
    slug: "he-was-not-losing-control-he-was-using-it",
    title: "He Was Not Losing Control. He Was Using It.",
    category: "behavioral-patterns",
    excerpt:
      "Every time he lost his temper, you walked away wondering what you did wrong. That is not an accident. Rage is not something that slips out. It is deployed. The question is not whether he can control it. The question is what he receives every time he uses it on you.",
    bodySections: [
      p("Every time he lost his temper, you walked away wondering what you did wrong. You replayed the conversation. You adjusted your tone. You softened your language for next time. That is not confusion. That is conditioning."),
      p("Rage is not something that slips out when someone cannot help themselves. In most cases of intimate partner violence, rage is deployed. It is a tool. It is used deliberately because it works — because it produces the silence, the apology, the compliance he was looking for."),
      q("If he only loses control around you — and never around his boss, his colleagues, or strangers — then he is not losing control at all."),
      p("The question is not whether he can control his temper. He clearly can. He controls it every day in every space where there are consequences for losing it. The question is what he receives every time he uses it on you. Does he get silence? Does he get an apology? Does he get his way? Whatever he receives is the exact reason it continues."),
      p("Rage that works gets repeated. That is not a mental health crisis. That is a calculated behavioural pattern. And public records can tell you whether that pattern has a documented history before you are six months into a relationship and already afraid to ask questions."),
    ],
    action: {
      headline: "Document the pattern before it disappears.",
      description:
        "If you have experienced this, log it in your Safety Journal right now — date, what happened, how it ended. A documented pattern is evidence. A memory that lives only in your head is not.",
      cta: "Start your Safety Journal →",
      href: "/dashboard/journal",
    },
    seededLikeCount: 247,
    seededCommentCount: 34,
  },

  // ── Article 2 ────────────────────────────────────────────────
  {
    slug: "hes-not-emotionally-unavailable",
    title: "He's Not Emotionally Unavailable. He Is Showing You Where You Rank.",
    category: "dating-relationships",
    excerpt:
      "There is a phrase women use to explain why someone treats them poorly. It is called 'emotionally unavailable.' It has become a polite, clinical way to say: he does not treat me the way I deserve, but I have decided it is a condition rather than a choice.",
    bodySections: [
      p("There is a phrase women use to explain why someone treats them poorly. It is the phrase 'emotionally unavailable.' It has become a polite, clinical way to say: he does not treat me the way I deserve, but I have decided it is a condition rather than a choice."),
      p("The problem with this framing is that it removes his accountability entirely. It turns a decision he is making — every single day, consistently — into something he cannot help. He is not emotionally unavailable. He is available. He is just not choosing to be available to you."),
      q("He is not broken. He is simply showing you, very clearly and very consistently, exactly where you rank in his priorities."),
      p("When someone shows you how they prioritise their time, their attention, their care — believe them. Not the version of them you imagine they could become. Not the version they perform on good days. The pattern. The consistent, repeated pattern over time is the truth."),
      p("The kindest thing you can do for yourself is stop diagnosing him and start documenting the pattern. Not to build a case against him. To build clarity for yourself."),
    ],
    action: {
      headline: "Run a check before you invest any further.",
      description:
        "If you are already in doubt about someone you are dating, a public record check takes under 60 seconds and costs R99. Clarity is cheaper than the alternative.",
      cta: "Run a Safety Check — R99 →",
      href: "/search-form",
    },
    seededLikeCount: 189,
    seededCommentCount: 21,
  },

  // ── Article 3 ────────────────────────────────────────────────
  {
    slug: "a-scripture-in-his-bio",
    title: "A Scripture in His Bio Does Not Clean His Public Record.",
    category: "behavioral-patterns",
    excerpt:
      "There is a particular kind of trust that gets extended to people who perform religiosity. A verse in the bio. A church attendance mentioned early. A cross in the profile picture. These signals are not evidence of character. They are signals of presentation.",
    bodySections: [
      p("There is a particular kind of trust that gets extended to people who perform religiosity. A verse in the bio. A church attendance mentioned early. A cross in the profile picture. These signals are not evidence of character. They are signals of presentation."),
      p("South Africa's GBVF statistics do not separate perpetrators by religion. They do not show that spiritual men are less likely to be dangerous. The data does not support the assumption that faith credentials translate into safety."),
      q("Behaviour is the only biography that cannot be edited. Not the bio. Not the credential. Not the testimony. Behaviour."),
      p("The most calculated abusers often use the language and symbols of trust — faith, family values, community standing — as cover. Not because all religious men are dangerous. But because the cover of virtue is the most effective cover available."),
      p("Before you trust anyone with access to your home, your body, or your children, check their public record. Not their bio. Their record."),
    ],
    action: {
      headline: "Credentials are not a background check.",
      description:
        "A public record search takes under 60 seconds. It does not replace your judgment — but it adds a layer of information that no bio, reference, or first impression can give you.",
      cta: "Run a Safety Check — R99 →",
      href: "/search-form",
    },
    seededLikeCount: 312,
    seededCommentCount: 47,
  },

  // ── Article 4 ────────────────────────────────────────────────
  {
    slug: "you-read-reviews-before-buying",
    title: "You Read Reviews Before Buying a R200 Product. But Not Before Trusting a Person.",
    category: "safety-habits",
    excerpt:
      "Before you buy anything online — a phone charger, a pair of shoes, a R99 product — you read the reviews. You check the star rating. You scroll for the most critical feedback. But the person who knows where you live was never checked. Not once.",
    bodySections: [
      p("Before you buy anything online — a phone charger, a pair of shoes, a R99 product — you read the reviews. You check the star rating. You scroll for the most critical feedback. You make an informed decision."),
      p("But the person who knows where you live, the person who has been inside your home, the person you have introduced to your children — that person was never checked. Not once."),
      q("You do not call reading reviews paranoia. You call it being a smart consumer. Safety is the same intelligence applied to a higher-stakes decision."),
      p("We verify our Uber drivers. We check restaurant ratings before we book. We read the fine print before we sign. But we hand over the most important access in our lives — access to our bodies, our homes, our children, our time — based on a vibe and a first impression."),
      p("The habit of checking before trusting is not a statement about how dangerous you think someone is. It is a statement about how seriously you take your own safety. Build the habit now, before you need it. Because when you need it, you will not have time to build it."),
    ],
    action: {
      headline: "Build the check-first habit starting today.",
      description:
        "Add one safety habit to your RedFlaq account: 'Before a first date, run a check.' The Habit tracker helps you make RedFlaq first your automatic behavior — not your crisis response.",
      cta: "Start your Safety Habit →",
      href: "/dashboard/habit",
    },
    seededLikeCount: 401,
    seededCommentCount: 58,
  },

  // ── Article 5 ────────────────────────────────────────────────
  {
    slug: "your-journal-entry-could-be-the-only-witness",
    title: "Your Journal Entry Could Be the Only Witness That Never Forgets.",
    category: "gbvf-evidence",
    excerpt:
      "Courts do not run on your memory of events. They run on evidence. A date. A time. A description. A document that existed before things escalated. Memory — especially memory under trauma — is not reliable testimony. Written records are.",
    bodySections: [
      p("Courts do not run on your memory of events. They run on evidence. A date. A time. A description. A document that existed before things escalated. Memory — especially memory under trauma — is not reliable testimony. Written records are."),
      p("One of the most consistent patterns in failed GBV prosecutions is the absence of contemporaneous documentation. Survivors remember. But the system requires proof. And proof requires something that was created at the time — not recalled months later when you finally decided to report."),
      q("Every time you let it go without writing it down, you are making the prosecutor's job harder and the perpetrator's defense stronger."),
      p("You do not need to know that something will become a legal case to start documenting it. You document because clarity fades. Because details blur. Because he will say it did not happen, or that you are exaggerating, and you need to be able to say: here is the date, here is what happened, here is what he said."),
      p("RedFlaq's Safety Journal creates timestamped, cryptographically verified records. They are yours. They are private. And if you ever need them in a courtroom, they exist."),
    ],
    action: {
      headline: "Write it down now, while it is clear.",
      description:
        "Open your Safety Journal and log the last incident — even if it felt small. Date it. Describe it. The entry takes two minutes. The protection it provides could be permanent.",
      cta: "Open your Safety Journal →",
      href: "/dashboard/journal",
    },
    seededLikeCount: 278,
    seededCommentCount: 39,
  },

  // ── Article 6 ────────────────────────────────────────────────
  {
    slug: "who-told-you-staying-was-loyalty",
    title: "Who Told You Staying Was Loyalty? That Was a Lie Designed to Keep You There.",
    category: "self-accountability",
    excerpt:
      "Somewhere along the way, you learned that love means staying. That the measure of a committed woman is her endurance. That leaving means you gave up. That woman who stays through everything is the strong one. She is not strong. She is trapped.",
    bodySections: [
      p("Somewhere along the way, you learned that love means staying. That the measure of a committed woman is her endurance. That leaving means you gave up. That the woman who stays through everything is the strong one."),
      p("She is not strong. She is trapped. And the trap was built from language that sounds like virtue — loyalty, patience, commitment, forgiveness — but functions as a cage."),
      q("Leaving is not failure. Leaving is the moment you decided that your life was worth more than the story you were told to keep."),
      p("No relationship requires you to absorb danger to prove your love. No family obligation requires you to stay inside a pattern that is documented as nationally catastrophic. South Africa did not classify GBVF as a national disaster because women were leaving too easily. It classified it because women were staying too long."),
      p("You do not owe anyone your silence. You do not owe anyone your continued presence inside a situation that your body already told you was wrong. And if you need one piece of information to make the decision clearer — run the check."),
    ],
    action: {
      headline: "Get clarity before you decide anything.",
      description:
        "If you are questioning whether to stay, start with facts. A public record check does not tell you what to do. But it tells you what is already documented. That information belongs to you.",
      cta: "Run a Safety Check — R99 →",
      href: "/search-form",
    },
    seededLikeCount: 534,
    seededCommentCount: 72,
  },

  // ── Article 7 ────────────────────────────────────────────────
  {
    slug: "the-first-date-safety-check",
    title: "The First Date Safety Check Nobody Ever Gave You.",
    category: "dating-relationships",
    excerpt:
      "Every missing persons report about a woman who met someone through dating contains some version of this phrase: he seemed so normal. Polite. Attentive. Charming. Held the door open. Paid for dinner. Normal is not safe. Normal is a performance.",
    bodySections: [
      p("Every missing persons report about a woman who met someone through dating contains some version of this phrase: he seemed so normal. Polite. Attentive. Charming. Held the door open. Paid for dinner. Normal."),
      p("Normal is not safe. Normal is a performance that almost every dangerous person is capable of sustaining for the length of a first date — and often much longer. Normal is what you see before access is established. Behaviour is what you see after."),
      q("You are not looking for someone who seems safe. You are looking for someone who is verifiably safe. There is a difference. One is a feeling. The other is a fact."),
      p("The safety checklist you were given — meet in public, share your location, tell a friend, trust your gut — is not wrong. But it is incomplete. It does not tell you to check the public record of the person you are meeting. It does not tell you that a search takes under 60 seconds and costs R99. It does not tell you that public records can surface warnings before the first date, not after month three when you are already emotionally invested."),
      p("RedFlaq was built for exactly this moment. Not crisis response. Not after the bruise. Before the first date. Before trust is given. Before access is established."),
    ],
    action: {
      headline: "Before the first date, run the check.",
      description:
        "Enter their full name and province. Results in under 60 seconds. Public records only. POPIA compliant. Confidential. From R99.",
      cta: "Run a Safety Check — R99 →",
      href: "/search-form",
    },
    seededLikeCount: 623,
    seededCommentCount: 91,
  },
];

// ── Lookup helper ────────────────────────────────────────────────
export const getArticleBySlug = (slug: string): SignalArticleContent | undefined =>
  SIGNAL_ARTICLES.find((a) => a.slug === slug);
