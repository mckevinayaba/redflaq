

## Phase 4.5: Landing Page Design Overhaul — Artistry, Data, and Emotional Impact

### What's Missing from the Current Landing Page

**1. Visual artistry and photography** — The current Hormozi-style sections are text-heavy walls with no images. The reference screenshots show beautiful organic photo frames, oval-cropped images of South African women, community photos. The existing codebase already has these assets (`sa-women-coffee.jpg`, `sa-mother-child.jpg`, `sa-professional-woman.jpg`, `hero-sa-woman.jpg`, `sa-father-child.jpg`, etc.) and components (`PhotoGrid`, `CommunityImageStrip`) that are NOT being used on the new landing page.

**2. Typography artistry** — The new components only use `Syne` and `JetBrains Mono`. The project loads `DM Serif Display` (a beautiful editorial serif) which the old components used extensively for headlines. The reference images show this elegant serif for headings like "Before you give him a spare key, give yourself *clarity.*" — this mix of serif + sans-serif creates the editorial, premium feel that's missing.

**3. Verifiable South African statistics** — Current page uses vague claims ("73% of women killed...") without sources. Need real, government-sourced data:
- **Stats SA DSTI 2024 Gender Report**: 1 in 3 women experience IPV in their lifetime
- **SAPS Annual Crime Statistics 2023/24**: 42,289 sexual offences reported (not "40,000+")
- **SA Medical Research Council**: A woman is killed every 3 hours by an intimate partner
- **Africa Check / CSVR**: 92% of GBV cases go unreported; conviction rate under 8%
- **World comparison**: SA femicide rate is 5x the global average (WHO)
- **SAPS**: 170,000+ contact crimes against women annually

**4. Key existing sections NOT included** — The landing page dropped these important components that the reference screenshots show:
- `HomepageDemo` — the animated search form demo (critical for showing how it works)
- `BarrierSection` — "Why no one checked before" (Too Expensive / Too Bureaucratic / Too Slow)
- `TickerBar` — scrolling trust badges
- `StatsBar` — <60 sec / 100% Public / POPIA stats
- `PhotoGrid` — "Real South African Women. Real Safety Decisions."
- `RiskLevelsSection` — "What your report reveals" with colored circles
- `TestimonialsSectionNew` — 7 powerful anonymous testimonials
- `FreeAccountSection` — "Create your free safety account" card
- `CommunityImageStrip` — family/community photos
- `FounderSection` — McKevin's quote and photo
- `HowItWorksPlinq` — the 4-step timeline with circles

### Plan

**File changes (12 files):**

#### 1. Rewrite `HeroHormozi.tsx` — Add hero image + editorial typography
- Add `DM Serif Display` for the main headline instead of Syne
- Import and display `hero-sa-woman.jpg` in an organic oval frame on the right
- Two-column layout on desktop (text left, image right) like the reference
- Add the "40,000+" stat card below the image
- Larger, more impactful headline using the serif font
- Keep the emotional copy but make it feel like editorial journalism

#### 2. Rewrite `ProblemAgitation.tsx` — Add verifiable stats with sources
- Add a stats grid: "1 in 3" (Stats SA) + "42,289" (SAPS) + "Every 3 hours" (MRC) + "5x global average" (WHO)
- Each stat has a government source citation in mono below
- Add the founder quote card: "It begins with information people didn't have..."
- Use `DM Serif Display` for headlines

#### 3. Add `BarrierSection` back to Index — "Why No One Checked Before"
- Already exists, just needs importing into Index.tsx
- Shows Too Expensive → R99, Too Bureaucratic → Online, Too Slow → <60 Seconds
- Includes purple CTA banner

#### 4. Add `HomepageDemo` back — Interactive search demo
- Already exists as a polished animated component
- Shows the actual product flow (search → scan → result → actions → journal)

#### 5. Rewrite `SolutionHormozi.tsx` — Use serif headings + more visual polish
- Use `DM Serif Display` for section heading
- Larger cards with more breathing room

#### 6. Add `TickerBar` + `StatsBar` back — Trust indicators
- Scrolling purple bar with trust badges
- Stats row: <60 sec, 100% Public Sources, POPIA Compliant

#### 7. Add `PhotoGrid` back — "Real South African Women"
- 3-column photo grid with organic frames using existing SA women photos
- Emotional storytelling section

#### 8. Add `RiskLevelsSection` back — "What your report reveals"
- Red/Amber/Purple/Green risk circles
- "What you get" checklist card

#### 9. Replace `SocialProofHormozi` with `TestimonialsSectionNew`
- 7 real anonymous testimonials in 2-column grid
- GBV helpline callout
- WhatsApp share buttons

#### 10. Add `CommunityImageStrip` back — Family/community photos

#### 11. Add `FounderSection` back — McKevin's story
- Photo + editorial quote
- Adds humanity and credibility

#### 12. Update `Index.tsx` — New section order
Proposed flow (Hormozi conversion + artistry + data):
1. `NavbarPlinq`
2. `HeroHormozi` (redesigned with image + serif typography)
3. `TickerBar` (trust strip)
4. `HomepageDemo` (see how it works — interactive)
5. `ProblemAgitation` (with verifiable stats + founder quote)
6. `BarrierSection` (why no one checked before)
7. `SolutionHormozi` (3 pillars, refined)
8. `HowItWorksPlinq` (4-step timeline — more visual than current 3-step)
9. `RiskLevelsSection` (what your report reveals)
10. `StatsBar` (trust stats)
11. `PhotoGrid` (real SA women photos)
12. `ValueStack` (free tier explosion)
13. `PaidChecksSection` (pricing tiers)
14. `TestimonialsSectionNew` (7 testimonials)
15. `IndustriesBrief` (who this is for)
16. `CommunityImageStrip` (family photos)
17. `FounderSection` (credibility)
18. `FinalUrgency` (emotional close)
19. `FAQHormozi` (objection handling)
20. `FooterPlinq`

### Typography Updates Across All Hormozi Components
- Section headlines: `DM Serif Display` (editorial, premium)
- Body text / descriptions: `Syne` (modern, friendly)
- Labels / badges / stats: `JetBrains Mono` (technical credibility)
- This matches the reference images exactly

### Verifiable Statistics to Add (with sources)
| Stat | Source | Citation |
|------|--------|----------|
| 1 in 3 women experience IPV | Stats SA · DSTI 2024 Gender Report | Government |
| 42,289 sexual offences (2023/24) | SAPS Annual Crime Statistics | Government |
| Woman killed every 3 hours | SA Medical Research Council | Research |
| 5x global femicide average | WHO Global Study on Homicide | International |
| 92% cases unreported | Africa Check / CSVR | Research |
| <8% conviction rate | NPA Annual Report | Government |
| 170,000+ contact crimes against women | SAPS Annual Statistics | Government |

### Design Principles
- **No color changes** — `#7C3AED`, `#6B4EFF`, `#F5F0EB`, `#E6E0DA` preserved
- **Three-font system** — Serif headlines, Sans body, Mono data
- **Organic photo frames** — Oval/rounded shapes using existing CSS classes
- **Breathing room** — More padding, less text density
- **Data-driven emotion** — Every uncomfortable claim backed by a government source

