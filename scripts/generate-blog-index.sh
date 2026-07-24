#!/usr/bin/env bash
# Generate consistent blog/index.html from real article files.
# Usage: bash scripts/generate-blog-index.sh
# CI:   Add as predeploy step: "bash scripts/generate-blog-index.sh"

set -euo pipefail

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BLOG="$DIR/public/blog"
OUT="$BLOG/index.html"

# --- Static header (no variable expansion needed) ---
cat > "$OUT" <<'HEADER'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tayoca — Writing</title>
  <meta name="description" content="Engineering essays distilled to essentials — each piece includes runnable assets you can copy-paste">
  <meta name="keywords" content="engineering blog, FinOps, reliability, automation, Kubernetes">
  <meta name="author" content="Tayoca">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://tayoca.com/blog.html">
  <link rel="icon" href="/favicon.ico" type="image/x-icon">
  <meta property="og:title" content="Tayoca — Writing">
  <meta property="og:description" content="Engineering essays distilled to essentials — each piece includes runnable assets you can copy-paste">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://tayoca.com/blog.html">
  <meta property="og:image" content="https://tayoca.com/assets/og-image.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Tayoca — Writing">
  <meta name="twitter:description" content="Engineering essays distilled to essentials — each piece includes runnable assets you can copy-paste">
  <meta name="twitter:image" content="https://tayoca.com/assets/og-image.png">
  <style>
:root{--bg:#0d0d0d;--card:#1a1a1a;--accent:#f97316;--text:#e5e7eb;--muted:#9ca3af;}
*{box-sizing:border-box;}
html{font-size:16px;}
body{margin:0;font-family:system-ui,sans-serif;background:var(--bg);color:var(--text);line-height:1.6;}
header{position:sticky;top:0;z-index:100;background:#0d0d0d;border-bottom:1px solid #374151;padding:1rem 0;}
nav{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;padding:0 2rem;}
.nav-brand{font-size:1.5rem;font-weight:600;color:#fff;text-decoration:none;}
.nav-links{display:flex;gap:1.5rem;}
.nav-links a{color:var(--text);text-decoration:none;font-size:.95rem;}
.nav-links a.active{color:var(--accent);font-weight:600;}
main{max-width:1200px;margin:2rem auto 4rem;padding:0 2rem;}
h1{font-size:2rem;font-weight:700;margin:0 0 .25rem;}
.lede{color:var(--muted);font-size:1rem;margin:0 0 3rem;line-height:1.5;}
.post-list{list-style:none;padding:0;max-width:800px;margin:2.5rem auto;}
.post{display:block;padding:1.5rem;border-bottom:1px solid #262626;text-decoration:none;color:inherit;border-radius:.3rem;transition:background .2s,color .15s}
.post:hover{background:#262626;}
.post:hover h2{color:var(--accent);}
.post h2{font-size:1.25rem;font-weight:600;margin:0 0 .45rem;color:var(--text);}
.post p{font-size:.95rem;color:var(--muted);margin:0 0 .6rem;}
.post .meta{font-size:.8rem;color:#6b7280;font-family:'Courier New',monospace;display:block;margin-top:.35rem;}
.cta-section{text-align:center;margin:4rem auto .8rem;border-top:1px solid #374151;padding:2.25rem 0;}
.btn{display:inline-block;padding:.75rem 1.75rem;background:var(--accent);color:#fff;border-radius:.4rem;font-weight:600;text-decoration:none;cursor:pointer;transition:transform .15s,background .2s;}
.btn:hover{transform:translateY(-2px);}
footer{border-top:1px solid #262626;padding:3rem 2rem;max-width:1160px;margin-left:2px;font-size:.85rem;display:flex;justify-content:space-between;align-items:flex-start;gap:1.25rem;flex-wrap:wrap;}
footer>div>.brand{font-size:1.2rem;font-weight:600;color:#fff;margin-bottom:.25rem;}
footer>div>p{margin:0;color:var(--muted);font-size:.85rem;line-height:1.5;}
footer a{color:var(--text);text-decoration:none;font-size:.85rem;}
footer a:hover{color:var(--accent);}
  </style>
</head>
<body>
<header><nav>
<a href="../index.html" class="nav-brand">tayoca</a>
<div class="nav-links">
<a href="../services.html">Services</a>
<a href="../products.html">Products</a>
<a href="blog.html" class="active">Writing</a>
<a href="../about.html">About</a>
</div>
</nav></header>
<main><h1>Writing</h1>
<p class="lede">Engineering essays distilled to essentials — each piece includes runnable assets you can copy-paste.</p>
<ul class="post-list">
HEADER

# --- Dynamic article entries (variable expansion needed) ---
for f in "$BLOG"/*.html; do
  base=$(basename "$f")
  [ "$base" = "index.html" ] && continue
  title=$(sed -n 's/.*<title>\([^<]*\)<\/title>.*/\1/p' "$f" | head -1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  desc=$(sed -n 's/.*name="description".*content="\([^"]*\)".*/\1/p' "$f" | head -1 | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
  [ -z "$desc" ] && desc="Article abstract not provided"
  printf '  <li>\n    <a class="post" href="blog/%s">\n      <h2>%s</h2>\n      <p>%s</p>\n      <span class="meta">Article</span>\n    </a>\n  </li>\n' "$base" "$title" "$desc" >> "$OUT"
done

# --- Static footer (no variable expansion needed) ---
cat >> "$OUT" <<'FOOTER'
</ul>
<div class="cta-section">
  <p>Need a FinOps audit? Flat $5K — only pay if we find savings.</p>
  <a href="https://cal.com/tayoca/finops-audit" class="btn" target="_blank" rel="noopener">Book a Free 30-Minute Audit →</a>
</div>
</main>
<footer>
  <div><a href="../services.html">Services</a> <a href="../products.html">Products</a> <a href="blog.html">Writing</a> <a href="../about.html">About</a></div>
  <div>
    <div class="brand">tayoca</div>
    <p style="margin:.25rem 0 0;color:#9ca3af;">FinOps · Platform Engineering · AI Automation<br>Ontario, Canada.</p>
  </div>
</footer>
</body>
</html>
FOOTER

echo "Generated: $OUT"
echo "Articles found:" && ls "$BLOG"/*.html | grep -v index.html | wc -l | tr -d ' '
