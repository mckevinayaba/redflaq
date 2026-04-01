-- ════════════════════════════════════════════════════════════════
-- SIGNALS ENGAGEMENT LAYER
-- Supports: likes, saves, comments on Signal articles
-- Signal articles reuse the existing academy_articles table
-- with new categories: behavioral-patterns, dating-relationships,
--   safety-habits, gbvf-evidence, trust-denial
-- ════════════════════════════════════════════════════════════════

-- Signal Likes
CREATE TABLE IF NOT EXISTS signal_likes (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id  text NOT NULL,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (signal_id, user_id)
);

ALTER TABLE signal_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all likes"
  ON signal_likes FOR SELECT TO authenticated
  USING (true);

CREATE POLICY "Users can manage own likes"
  ON signal_likes FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Signal Saves
CREATE TABLE IF NOT EXISTS signal_saves (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id  text NOT NULL,
  user_id    uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (signal_id, user_id)
);

ALTER TABLE signal_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own saves"
  ON signal_saves FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Signal Comments (moderated)
CREATE TABLE IF NOT EXISTS signal_comments (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_id    text NOT NULL,
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text text NOT NULL CHECK (char_length(comment_text) <= 1000),
  moderated    boolean NOT NULL DEFAULT false,
  created_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE signal_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read moderated comments"
  ON signal_comments FOR SELECT TO authenticated
  USING (moderated = true);

CREATE POLICY "Users can insert own comments"
  ON signal_comments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON signal_comments FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_signal_likes_signal_id ON signal_likes (signal_id);
CREATE INDEX IF NOT EXISTS idx_signal_saves_user_id ON signal_saves (user_id);
CREATE INDEX IF NOT EXISTS idx_signal_comments_signal_id ON signal_comments (signal_id, moderated);

-- ════════════════════════════════════════════════════════════════
-- SEED: 3 Signal articles into academy_articles
-- Categories use new Signals taxonomy
-- ════════════════════════════════════════════════════════════════

INSERT INTO academy_articles (
  slug, title, excerpt, content, category, published, author,
  meta_description, created_at, updated_at
) VALUES (
  'you-checked-everything-except-the-person',
  'You Checked Everything Except the One Thing That Could Kill You',
  'Meeting in public didn''t save her. Sharing her location didn''t save her. A good first impression didn''t save her. Because those behaviors protect you from strangers. Not from the person who seemed perfect for 3 months.',
  '<p>You checked:</p>
<ul>
  <li>The restaurant (4.2 stars, good reviews)</li>
  <li>The location (safe neighborhood, well-lit parking)</li>
  <li>The Uber route (shared with your friend)</li>
</ul>
<p>You didn''t check:</p>
<ul>
  <li>His criminal record</li>
  <li>His court history</li>
  <li>His public violations</li>
</ul>
<p>You verified the venue.<br>You didn''t verify the person.</p>
<p>That''s the problem.</p>
<p><strong>73% of South African women killed by intimate partners knew their killer had a history of violence.</strong></p>
<p>Public record. Checkable. Before the first date.</p>
<p>They met in public too.<br>They shared locations too.<br>Their friends knew his name too.</p>
<p>What they didn''t do: verify.</p>
<p>You''re doing safety theater.<br>RedFlaq is actual safety.</p>
<p><em>Before you trust, RedFlaq first.</em></p>',
  'behavioral-patterns',
  true,
  'RedFlaq Editorial',
  'Safety behaviors like meeting in public only protect you from strangers — not from someone who has a violent history. Here is what you are missing.',
  now() - interval '2 days',
  now() - interval '2 days'
),
(
  'month-12-is-when-he-stops-pretending',
  'Month 12 Is When He Stops Pretending. You''re at Month 2.',
  'The audition phase is real. He is not showing you who he is in the first three months. He is showing you who he needs you to believe he is.',
  '<p>Month 1–3: Perfect</p>
<ul>
  <li>Texts all day</li>
  <li>Plans thoughtful dates</li>
  <li>Wants to meet your friends</li>
  <li>Your mom loves him</li>
</ul>
<p>Month 3–6: Subtle Shifts</p>
<ul>
  <li>"Why do you need to go out without me?"</li>
  <li>"Your friends don''t really get us"</li>
  <li>"Let me handle the money, I''m better at it"</li>
</ul>
<p>Month 6–12: The Real Him</p>
<ul>
  <li>Isolation complete</li>
  <li>Financial control established</li>
  <li>First physical violence</li>
  <li>"You made me do this"</li>
</ul>
<p>You''re at Month 2.<br>You think this is who he is.</p>
<p>It''s not.<br>It''s the audition.</p>
<p>RedFlaq shows you who he was before he met you.<br>The rest is performance.</p>
<p><em>Before you give the key, RedFlaq first.</em></p>',
  'behavioral-patterns',
  true,
  'RedFlaq Editorial',
  'The first three months are not the real relationship. Here is the pattern that plays out in relationships with controlling men — and what to watch for.',
  now() - interval '1 day',
  now() - interval '1 day'
),
(
  'he-is-not-going-through-something-this-is-him',
  'He''s Not "Going Through Something." This IS Him.',
  'Stress does not create patterns. Stress reveals them. A stressful work week does not turn a safe man violent. It reveals a violent man''s real coping mechanism.',
  '<p>"He''s just stressed at work."<br>"His ex really hurt him."<br>"He''s working on himself."<br>"He said he''ll change."</p>
<p>No.</p>
<p>Stress doesn''t create patterns.<br>Stress reveals them.</p>
<p>A stressful work week doesn''t turn a safe man violent.<br>It reveals a violent man''s real coping mechanism.</p>
<p>You''re giving him grace he hasn''t earned<br>for behavior he''s choosing<br>while ignoring evidence that''s public.</p>
<p>If his "stress" makes him dangerous,<br>he''s dangerous.</p>
<p>Full stop.</p>
<p>You''re not confused.<br>You''re negotiating with what you already know.</p>
<p><em>Before you explain it away again, RedFlaq first.</em></p>',
  'trust-denial',
  true,
  'RedFlaq Editorial',
  'Excusing dangerous behavior as stress, trauma or "going through something" is how patterns get normalized. Here is what is actually happening.',
  now(),
  now()
)
ON CONFLICT (slug) DO NOTHING;
