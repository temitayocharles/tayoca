# Vercel-based CI/CD for tayoca.com www
# ==================================

# Vercel will use its own GitHub integration.
# GitHub Actions workflow `.github/workflows/deploy-www.yml` handles:
# - Build (pnpm build)
# - Percy snapshot testing (accessibility, regression)
# - Auto-deploy on `git push main`
# - Slack notification on pass/fail

# Locally, use: `vercel --prod --token <token> ./public`
# You may need: `npm install -g vercel`

# Key files installing dependencies:
# - pnpm-lock.yaml (auto-installed by Vercel CI)
# - .github/workflows/deploy-www.yml (GitHub Actions file)
# - package.json (.vercel/output bundled by CI)

# Vercel project link: https://vercel.com/charlie-williard/tayoca-www
# Environment variables required in Vercel dashboard:
# - VERCEL_TOKEN
# - PERCY_TOKEN

# Legacy Cloudflare pages artifacts to remove once CI proves:
# - .pages-cache /
# - dev-tools.toml /
# - *wrangler.toml* retained only for local wrangler references; all CI paths replaced by `vercel` CLI matching.