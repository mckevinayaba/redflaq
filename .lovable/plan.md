

# Update Blog Articles: Accuracy, Attribution, and Positioning

Three targeted updates to all 6 published blog articles.

---

## Change 1: Fix Women For Change URL

**Article:** `gbv-organisations-south-africa` (ID: `9288cf0b-...`)

The current link points to `https://www.wfc.org.za` — this is incorrect. The correct URL is `https://womenforchange.co.za` (confirmed via live site).

Update the Women For Change paragraph to use the correct URL and display text.

---

## Change 2: Add "summarising" disclaimer to all 6 articles

Add a styled note near the top of each article (after the opening paragraph) with this text:

> *This article summarises publicly available information from each organisation's website; please visit their sites for full details.*

This will be an italic paragraph in a subtle style, inserted as an HTML `<p>` with `font-style: italic; color: #78716C; font-size: 14px; margin-bottom: 24px;` — consistent with the existing design language.

For articles that reference organisations (GBV orgs, crime stats, tenant, domestic worker, dating, POPIA), the line will be adapted slightly to fit context:
- **GBV orgs article**: "...from each organisation's website..."
- **Crime stats article**: "...from official sources including SAPS, ISS, and Africa Check..."
- **Tenant article**: "...from official sources including the Rental Housing Tribunal and National Consumer Commission..."
- **Domestic worker article**: "...from official sources including GoodHelp, Smart Helpers, and the Department of Employment and Labour..."
- **Dating safety article**: "...from official sources including SAPS and POWA..."
- **POPIA article**: "...from official sources including the Information Regulator of South Africa..."

---

## Change 3: Add RedFlaq positioning paragraph before the CTA

Add a short closing paragraph just before the CTA box in every article:

> "RedFlaq doesn't replace these services; it adds a public-record safety check before something happens. We want every user who runs a check to know where to get help if they're already in danger."

This will be a standard `<p>` tag styled consistently with the existing body text.

---

## Technical Details

All changes are database `UPDATE` statements on the `academy_articles` table, modifying the `content` column for each of the 6 rows. No code files are changed.

| Article Slug | URL Fix | Add Disclaimer | Add Positioning |
|---|---|---|---|
| `gbv-organisations-south-africa` | Yes (wfc.org.za to womenforchange.co.za) | Yes | Yes |
| `south-africa-crime-statistics-safety` | No | Yes | Yes |
| `tenant-landlord-screening-south-africa` | No | Yes | Yes |
| `domestic-worker-background-check-south-africa` | No | Yes | Yes |
| `online-dating-safety-south-africa` | No | Yes | Yes |
| `popia-background-checks-south-africa` | No | Yes | Yes |

