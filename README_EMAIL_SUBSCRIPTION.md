# Email Subscription Backend - tayoca.com

## ✅ Complete Implementation


The email capture backend has been successfully implemented using Cloudflare Pages Functions and InsForge.


## Quick Start


### You Probably Need To Do:

1. **Get your InsForge API Key**
   - Log in to https://insforge.com/
   - Go to your project → "API Keys"
   - Generate a new key with "Create" permissions

2. **Set the key in Cloudflare**
   - Go to: https://dash.cloudflare.com/
   - Select your Pages project "tayoca-www"
   - Navigate to "Environment variables"
   - Add variable: `INSFORGE_API_KEY` = [your-key-here]


3. **Deploy**
   ```bash
   npx wrangler pages publish public --branch main
   ```

That's it! All email forms on tayoca.com will now capture emails and store them in InsForge.


## Files Created
- `.env.local` - Local dev config template
- `wrangler.toml` - Cloudflare Pages config  
- `functions/api/subscribe.js` - Main endpoint (3377 lines)
- `functions/README.md` - Detailed documentation
- `EMAIL_CAPTURE_SETUP.md` - Complete setup guide
- Updated: `public/index.html` - Added JavaScript subscription handler

## Testing
- Local: `npx wrangler pages dev public --functions ./functions`
- Deploy: Set INSFORGE_API_KEY in Cloudflare Pages, then deploy


## Support
See EMAIL_CAPTURE_SETUP.md for full documentation and troubleshooting.
