#!/usr/bin/env bash
# 🚀 One-shot deploy script for tayoca.com 
# Run this from /Volumes/512-B/Documents/Hermes/AGENTS/workspace/tayoca-www
# Requirements: Node.js >= 20, npm, Cloudflare account authenticated with `npx wrangler login`

set -e

echo "▶️ Deploying tayoca.com…"
echo "🔍 Current dir: $(pwd)"
echo "📦 Pages to deploy: public/index.html, services.html, products.html, blog.html, about.html"

# Install deps if missing
if ! command -v wrangler &>/dev/null; then
  echo "⚠️ Wrangler not found. Installing via npm…"
  npm install -g wrangler
fi

# Dry-run preview URL for 5s sanity check
COMMIT_SHA=$(git rev-parse --short HEAD)
npx wrangler pages dev public --compatibility-date=2025-07-22 --persist-to=.pages-cache &>/tmp/cf_pages_dev.log &
D_PID=$!
sleep 3
echo "🌐 Live preview running on http://localhost:8788 (log: /tmp/cf_pages_dev.log PID $D_PID)"
HEAD=$(curl -s -I http://localhost:8788 | grep -i "^HTTP" || true)
if [[ "$HEAD" == *200* ]]; then
  echo "✅ Preview OK: http://localhost:8788"
else
  echo "📝 Preview log first lines:"
  head -n 20 /tmp/cf_pages_dev.log || true
fi
pkill -P $D_PID 2>/dev/null || true

# Publisher: "publish" sends to Cloudflare Pages production
# Bindings use local environment only for safe run
CF_PAGES_BRANCH=${CF_PAGES_BRANCH:-"main"};
echo "📤 Publishing to Cloudflare Pages → $CF_PAGES_BRANCH ($(date))"
npx wrangler pages publish public --branch="$CF_PAGES_BRANCH" --commit-dirty=false --project-name="tayoca-www"

echo "✅ Done. Verify live at https://tayoca.com & https://$COMMIT_SHA.tayoca-www.pages.dev"
