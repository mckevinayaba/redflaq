

## Plan: Upgrade RedFlaq Shop with Product Images and Expanded Catalog

The current shop has 3 products with emoji placeholders. The uploaded mockups show real branded merchandise photography — tracksuits, caps, jumpsuits, and sweatshirts. We'll upgrade the shop to use these images and expand the product range.

### Products from Mockups

Based on the uploaded images:
1. **Tracksuit Set** (white/purple half-zip + shorts) — "You're not crazy. You're protecting yourself."
2. **Tracksuit Set** (purple half-zip + skirt) — "Before You Trust, RedFlaq First."
3. **Sweatshirt** (white long-sleeve) — "A New Safety Habit for South Africa."
4. **Cap** — Black, White, Red, Navy variants with RedFlaq logo
5. **Jumpsuit** — Denim/navy, White, Red, Navy+purple variants — "Before You Trust, RedFlaq First."

### Changes

**Copy uploaded images to project**
- Copy `ChatGPT_Image_Mar_18_2026_07_03_18_PM.png` → `src/assets/shop/tracksuits.png`
- Copy `ChatGPT_Image_Mar_18_2026_07_36_03_PM.png` → `src/assets/shop/jumpsuits.png`

**`src/pages/Shop.tsx`**
- Import the two product images
- Expand product catalog to ~6 items: Caps (multiple colors), Tracksuit Sets, Sweatshirt, Jumpsuits
- Add color variant indicators (small color dots) where applicable
- Replace emoji placeholders with the real product photos (using `object-cover` for proper cropping)
- Add a "Lookbook" or lifestyle section using the full mockup images as a banner/gallery between hero and products
- Add size selector or "Select Options" pattern for items with variants
- Keep "Coming Soon" / "Notify Me" CTA with email capture since the shop isn't live yet
- Add a "mission strip" below hero: "100% of proceeds fund free safety tools"

### Technical Details

- Images imported as ES6 modules from `src/assets/` for proper Vite bundling
- Product cards get taller image areas (`h-64`) to showcase the photography
- Add a simple color dot component for variant display
- Responsive grid: 1 col mobile, 2 col tablet, 3 col desktop
- Optional: add a "Notify me when available" email capture using existing toast or a small modal

