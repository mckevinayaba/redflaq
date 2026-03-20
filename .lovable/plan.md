

## Government Data Section + Team Update

### Overview
Two main changes:
1. **New component: `GovDataSection.tsx`** — A visually striking, data-dense section placed immediately after the Hero, pulling verified statistics from the DCOG/DWYPD GBVF Presentation (Nov 2025). This replaces the current position of `TickerBar` as section #2.
2. **Update About page team** — Remove Stacey, replace with the 3-person team (Nthabi, Ayola, McKevin) using the existing `WhyRedflaqSection` data (photos, bios, quotes, LinkedIn links).

---

### 1. Create `src/components/landing/GovDataSection.tsx`

A full-width, visually impactful section with government-sourced data from the DCOG presentation. Design approach:

**Header**: "Classified as a National Disaster" with the `DCOG / DWYPD · November 2025` source tag in mono.

**Primary stats row** (3 large hero numbers):
- `7.3 million` — women experienced physical violence (HSRC GBV Prevalence Study 2022)
- `2.1 million` — victims of sexual violence (HSRC)
- `3.4 million` — experienced IPV by an intimate partner (HSRC)

**Secondary stats grid** (6 cards, 2×3 on desktop):
- `1 in 3` women experienced physical violence — *HSRC National GBV Prevalence Study*
- `1 in 5` men reported perpetrating physical/sexual violence against a partner — *HSRC*
- `1 in 10` women experienced economic abuse — *HSRC*
- `1 in 4` women experienced emotional abuse — *HSRC*
- `29.4%` of cohabiting women experienced physical violence — *HSRC*
- `25%` of young women (18-24) experienced physical violence — *HSRC*

**Hotspot banner**: "30 GBVF Hotspot Areas identified across Gauteng (8), Western Cape (8), KwaZulu-Natal (7), Eastern Cape (3), Free State (2), North West (1)" — *DCOG Classification Report*

**Classification callout card**: Dark card with purple border — "On 21 November 2025, the NDMC classified GBVF as a national disaster under DMA Section 23. South Africa termed it a 'second pandemic.'" — *DCOG/DWYPD*

**Root causes strip**: Horizontal scroll of tags — Patriarchal Norms, Culture of Violence, Substance Abuse, Poverty & Unemployment, Weak Law Enforcement, ~3% conviction rate during lockdown

**Design**: 
- White/warm background (`#F5F0EB`) with dark stat cards
- `DM Serif Display` for numbers, `Syne` for labels, `JetBrains Mono` for source citations
- Red accent (`#DC2626`) for the most alarming numbers, purple (`#7C3AED`) for others
- Staggered scroll-reveal animations
- Each stat card has a subtle warm border (`#E6E0DA`)

### 2. Update `src/pages/Index.tsx`

Insert `GovDataSection` immediately after `HeroHormozi` (before `TickerBar`):
```
HeroHormozi
GovDataSection  ← NEW
TickerBar
HomepageDemo
...rest unchanged
```

### 3. Rewrite team section in `src/pages/About.tsx`

- Remove Stacey from the team array
- Replace with the 3-person team using data from `WhyRedflaqSection.tsx`:
  - **Nthabi Montsho** — Co-Founder & CEO, GBV Survivor, Advocate & TV Host (photo: `nthabi-montsho.jpeg`)
  - **Ayola Masizana** — Witness of GBV, Student, Brand Ambassador (photo: `ayola-masizana.jpeg`)
  - **McKevin Ayaba** — Technology Entrepreneur, Co-Founder & CPO (photo: `mckevin-ayaba.png`)
- Include full bios, italic quotes with purple left-border, and LinkedIn links
- Use 3-column grid on desktop (matching the reference screenshot with circular photos)
- Use `DM Serif Display` for names, `JetBrains Mono` for roles, `Syne` for bios

### Files Changed
1. `src/components/landing/GovDataSection.tsx` — **New** (~200 lines)
2. `src/pages/Index.tsx` — Add import + insert after Hero
3. `src/pages/About.tsx` — Replace team array and team section markup

