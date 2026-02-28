

## Replace Text Wordmark with Uploaded Logo Image

The uploaded image (`RedFlaq_logo_1_official-2.png`) will replace the current Shield icon + text wordmark in all 10 files. The previous attempt failed likely due to image format/transparency issues. This time the image will be copied fresh and rendered at the same visual size as the current text logo.

### Steps

1. **Copy the uploaded image** to `src/assets/redflaq-logo-official.png`

2. **Update all 10 files** to replace the Shield icon + text spans with an `<img>` tag:
   - Import: `import redflaqLogo from "@/assets/redflaq-logo-official.png"`
   - Remove `Shield` icon import (where no longer needed)
   - Replace the logo markup with:
     ```tsx
     <img src={redflaqLogo} alt="RedFlaq" 
       style={{ height: 36, width: 'auto', display: 'block' }} />
     ```
   - Desktop navbars: `height: 36px` (matches the visual weight of the current 22px text + icon)
   - Mobile navbars: `height: 30px`
   - Footers: `height: 30px`
   - Signup/VerifyEmail: `height: 44px`
   - AppHeader: `height: 30px`

3. **Files to update:**
   - `src/components/landing/NavbarPlinq.tsx`
   - `src/components/landing/Navbar.tsx`
   - `src/components/landing/NavbarHonest.tsx`
   - `src/components/dashboard/AppHeader.tsx`
   - `src/pages/Signup.tsx`
   - `src/pages/VerifyEmail.tsx`
   - `src/components/Footer.tsx`
   - `src/components/landing/FooterNew.tsx`
   - `src/components/landing/FooterHonest.tsx`
   - `src/components/landing/FooterPlinq.tsx`

4. **Footer consideration:** The footers have dark purple backgrounds — the logo text uses dark colors that may not be visible. Will add a CSS filter (`brightness(0) invert(1)`) or keep the text wordmark specifically for dark-background footers if needed.

