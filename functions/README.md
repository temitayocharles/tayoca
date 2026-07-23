# Cloudflare Pages Functions - Email Subscription Backend

This directory contains Cloudflare Pages Functions for the tayoca.com email subscription backend.

## Structure

```
functions/
├── api/
│   └── subscribe.js - Main subscription handler (POST /api/subscribe)
└── README.md - This file
```

## The API Endpoint

### POST `/api/subscribe`

Accepts email addresses and stores them in the InsForge database.

#### Request

```bash
curl -X POST /api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

#### Parameters

- `email` (required): The email address to subscribe

#### Responses

**Success (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter!",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400` Bad Request: Missing or invalid email
- `405` Method not allowed: Only POST is supported
- `502` Bad Gateway: InsForge API error
- `500` Internal Server Error: Unexpected error

## Local Development

### Prerequisites

1. Node.js >= 20
2. Cloudflare Wrangler CLI: `npm install -g wrangler`
3. InsForge API Key (from InsForge project settings)

### Setup

1. Clone the project
2. Create `.env.local` in the project root:

```
INSFORGE_API_BASE=https://v7mhrspk.us-east.insforge.app
INSFORGE_PROJECT_ID=tayoca-newsletter
INSFORGE_API_KEY=your-insforge-api-key-here
```

3. Install dependencies (global install is okay):
```bash
npm install -g wrangler
```

### Test Locally

#### Option 1: Wrangler Pages Dev (recommended)

```bash
npx wrangler pages dev public --functions ./functions --compatibility-date=2025-07-23
```

This will start a local server. Test the endpoint:
```bash
curl -X POST http://localhost:8788/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

#### Option 2: Using the HTML page

Open `public/index.html` in a browser and use any of the email forms.

## Deployment

### Prerequisites

1. InsForge API Key must be configured in Cloudflare Pages environment variables
2. Cloudflare Pages project must be set up for tayoca.com

### Deployment Steps

1. Set environment variables in Cloudflare Pages dashboard:
   - Go to: https://dash.cloudflare.com/your-account/pages
   - Select "tayoca-www" project
   - Go to "Environment variables"
   - Add:
     - `INSFORGE_API_KEY` = your-api-key-from-insforge

2. Deploy:

```bash
# Deploy to production
npx wrangler pages publish public --branch main

# Or deploy to preview branch
npx wrangler pages publish public --branch preview
```

## InsForge Configuration


1. Log in to InsForge: https://insforge.com/
2. Create a new project named "tayoca-newsletter"
3. Create a table called `newsletter_subscribers`
4. Generate an API key in InsForge project settings
5. Set the API key in Cloudflare Pages environment variables

## Database Schema (InsForge)

Table: `newsletter_subscribers`

Fields:
- `email` (string, required)
- `project_id` (string, default: tayoca-newsletter)
- `subscribed_at` (timestamp)
- `source` (string, default: tayoca.com)

## Frontend Integration

The JavaScript code in `public/index.html` automatically handles form submissions:

- All elements with class `.email-form` are handled
- Form data is sent to `/api/subscribe`
- Success/error messages are shown to users

Existing email forms in the HTML will work automatically after deployment.

## Testing

After deployment, test with:

```bash
# Test on live site
curl -X POST https://tayoca.com/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

## Troubleshooting


### Common Issues

1. **CORS errors**: Not applicable for Cloudflare Pages Functions - they run on the same domain
2. **500 errors**: Check Cloudflare Pages function logs
3. **InsForge integration**: Verify API key and table name
4. **Missing function**: Ensure `functions/api/subscribe.js` exists and is named correctly

### Viewing Logs

In Cloudflare Pages dashboard, check "Functions logs" for any errors.


## Security Considerations

1. Always use HTTPS
2. Validate email format (done in the function)
3. Never expose API keys in client-side code
4. Use Cloudflare Pages environment variables for secrets

## Support

For questions about:
- InsForge: https://insforge.com/
- Cloudflare Pages: https://developers.cloudflare.com/pages/
- Wrangler: https://developers.cloudflare.com/workers/wrangler/
