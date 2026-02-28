

## Connecting redflaq.co.za to your existing site

Since you already have **redflaq.com** working with Lovable, here's what to do with your new **redflaq.co.za** domain:

### Option A: Redirect redflaq.co.za → redflaq.com (Recommended)
This is the simplest and best for SEO — all traffic goes to one domain.

**In GoDaddy:**
1. Go to your **redflaq.co.za** domain settings in GoDaddy
2. Look for **"Forwarding"** or **"Domain Forwarding"**
3. Set it to forward to **https://redflaq.com** with a **301 (permanent) redirect**
4. Enable "Forward with masking" turned **OFF** (you want a clean redirect)
5. Also set up forwarding for **www.redflaq.co.za** → **https://redflaq.com**

This means anyone typing redflaq.co.za will land on redflaq.com automatically.

### Option B: Add it as a second domain in Lovable
If you want both domains to serve the site directly:

1. In Lovable, go to **Project → Settings → Domains**
2. Click **Connect Domain** and enter **redflaq.co.za**
3. In GoDaddy, add these DNS records for redflaq.co.za:
   - **A Record**: Name: `@` → Value: `185.158.133.1`
   - **A Record**: Name: `www` → Value: `185.158.133.1`
   - **TXT Record**: Name: `_lovable` → Value: *(copy from Lovable's setup screen)*
4. Wait for DNS propagation (up to 72 hours)
5. Set **redflaq.com** as your **Primary** domain so redflaq.co.za redirects to it

### Recommendation
**Go with Option A** (GoDaddy forwarding). It's faster to set up, better for SEO (avoids duplicate content), and requires no changes in Lovable. Your South African users typing .co.za will seamlessly land on your main site.

