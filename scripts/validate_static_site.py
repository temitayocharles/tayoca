#!/usr/bin/env python3
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urljoin, urlsplit, unquote
import json, sys
ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/'public'
errors=[]
required=['index.html','services.html','assessments.html','results.html','products.html','insights.html','about.html','trust.html','operator-brief.html','favicon.ico','assets/og-image.png','assets/css/growth-os.css','growth-os.js','robots.txt','sitemap.xml']
for rel in required:
    if not (PUBLIC/rel).is_file(): errors.append(f'missing required public asset: {rel}')
for rel in ['.env','.env.local','.wrangler','.pages-cache','public.tar.gz']:
    if (ROOT/rel).exists(): errors.append(f'forbidden tracked/generated path: {rel}')
try:
    config=json.loads((ROOT/'vercel.json').read_text())
    if config.get('outputDirectory')!='public': errors.append('vercel.json must publish outputDirectory=public')
    if 'builds' in config: errors.append('legacy Vercel builds config preserves the public/ prefix and is forbidden')
except Exception as exc: errors.append(f'invalid vercel.json: {exc}')
class Parser(HTMLParser):
    def __init__(self):
        super().__init__(); self.refs=[]; self.has_title=False; self.has_viewport=False; self.in_title=False
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='title': self.in_title=True
        if tag=='meta' and a.get('name','').lower()=='viewport': self.has_viewport=True
        for key in ('href','src','action'):
            if a.get(key): self.refs.append((tag,key,a[key]))
    def handle_endtag(self,tag):
        if tag=='title': self.in_title=False
    def handle_data(self,data):
        if self.in_title and data.strip(): self.has_title=True
for page in sorted(PUBLIC.rglob('*.html')):
    text=page.read_text(errors='replace')
    rel=page.relative_to(PUBLIC).as_posix()
    if any(x in text for x in ('via.placeholder.com','Ã','Â','â€','â','â','â','â')): errors.append(f'unrepaired placeholder or encoding artifact: {rel}')
    parser=Parser(); parser.feed(text)
    if not parser.has_title: errors.append(f'missing title: {rel}')
    if not parser.has_viewport: errors.append(f'missing viewport: {rel}')
    page_url='https://tayoca.com/'+rel
    for tag,key,ref in parser.refs:
        if not ref or ref.startswith(('#','mailto:','tel:','javascript:','data:')): continue
        absolute=urljoin(page_url,ref); parts=urlsplit(absolute)
        if parts.scheme=='http': errors.append(f'insecure reference in {rel}: {ref}')
        if parts.netloc not in ('','tayoca.com','www.tayoca.com'): continue
        path=unquote(parts.path or '/')
        target=PUBLIC/path.lstrip('/')
        if path=='/': candidates=[PUBLIC/'index.html']
        elif path.endswith('/'): candidates=[target/'index.html']
        else:
            candidates=[target]
            if not target.suffix: candidates += [target.with_suffix('.html'),target/'index.html']
        if not any(c.is_file() for c in candidates): errors.append(f'broken internal {key} in {rel}: {ref}')
if errors:
    print('\n'.join(f'ERROR: {e}' for e in errors)); sys.exit(1)
print(f'Validated {len(list(PUBLIC.rglob("*.html")))} HTML pages and required deployment assets.')
