#!/usr/bin/env python3
from __future__ import annotations
import argparse, json, sys, xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

ROOT=Path(__file__).resolve().parents[1]
PUBLIC=ROOT/"public"
ORIGIN="https://tayoca.com"

class Page(HTMLParser):
    def __init__(self):
        super().__init__(); self.title=""; self._in_title=False; self.meta={}; self.props={}; self.canonical=""; self.links=[]; self.styles=[]; self.scripts=[]; self.ids=set(); self.forms=[]; self.jsonld=[]; self._script_type=""; self._script_buf=[]
    def handle_starttag(self,tag,attrs):
        a={k:(v or "") for k,v in attrs}; t=tag.lower()
        if a.get("id"): self.ids.add(a["id"])
        if t=="title": self._in_title=True
        elif t=="meta":
            if a.get("name"): self.meta[a["name"].lower()]=a.get("content","")
            if a.get("property"): self.props[a["property"].lower()]=a.get("content","")
        elif t=="link":
            rel=set(a.get("rel","").lower().split())
            if "canonical" in rel: self.canonical=a.get("href","")
            if "stylesheet" in rel: self.styles.append(a.get("href",""))
        elif t=="a": self.links.append((a.get("href",""),a))
        elif t=="script":
            if a.get("src"): self.scripts.append(a.get("src",""))
            self._script_type=a.get("type","").lower(); self._script_buf=[]
        elif t=="form": self.forms.append(a)
    def handle_data(self,data):
        if self._in_title: self.title += data
        if self._script_type=="application/ld+json": self._script_buf.append(data)
    def handle_endtag(self,tag):
        if tag.lower()=="title": self._in_title=False
        if tag.lower()=="script" and self._script_type=="application/ld+json":
            raw="".join(self._script_buf).strip()
            if raw: self.jsonld.append(raw)
            self._script_type=""; self._script_buf=[]

def fail(msg): print("ERROR:",msg,file=sys.stderr); raise SystemExit(1)
def read(path): return (ROOT/path).read_text(encoding="utf-8",errors="replace")
def parser_for(path):
    p=Page(); p.feed(read(path)); return p
def sitemap_pages():
    tree=ET.parse(PUBLIC/"sitemap.xml").getroot(); ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls=[(n.text or "").strip() for n in tree.findall("s:url/s:loc",ns)]
    if not urls: fail("sitemap empty")
    if len(urls)!=len(set(urls)): fail("duplicate sitemap URLs")
    out=[]
    for u in urls:
        q=urlparse(u)
        if q.scheme!="https" or q.netloc!="tayoca.com": fail(f"non-canonical sitemap URL {u}")
        rel=q.path.lstrip("/")
        if not rel: path=PUBLIC/"index.html"
        elif q.path.endswith("/"): path=PUBLIC/rel/"index.html"
        else:
            cand=PUBLIC/rel
            path=cand if cand.is_file() else (PUBLIC/(rel+".html") if (PUBLIC/(rel+".html")).is_file() else None)
        if not path or not path.is_file(): fail(f"sitemap target missing {u}")
        out.append((u,path))
    return out

def content():
    required=["public/index.html","public/work.html","public/about.html","public/services.html","public/products.html","public/results.html","public/trust.html","public/sivanta.html"]
    for p in required:
        s=read(p)
        if "/assets/css/site-shell.css" not in s: fail(f"{p}: Arena site-shell.css missing")
        if "site-header" not in s or "primary-nav" not in s: fail(f"{p}: Arena shell missing")
        if "tayoca-v9.css" in s or "tayoca-v9.js" in s: fail(f"{p}: post-Arena v9 override present")
    home=read("public/index.html")
    for token in ["hero-cinema","paper-band","ledger-label","portfolio-card",'aria-label="Company map"']:
        if token not in home: fail(f"home missing Arena primitive {token}")
    work=read("public/work.html")
    for token in ["Sivanta","SiteSupply","The Operator Brief","Free Website Initiative"]:
        if token not in work: fail(f"work taxonomy missing {token}")
    print("Arena content architecture: PASS")

def conversion():
    a=read("public/assessments.html")
    if 'data-tayoca-form="assessment_request"' not in a: fail("assessment form missing")
    if "n8n.tayoca.com/webhook/tayoca/growth/assessment" not in a: fail("assessment endpoint mismatch")
    o=read("public/operator-brief.html")
    if 'data-tayoca-form="operator_brief"' not in o: fail("operator brief form missing")
    if "n8n.tayoca.com/webhook/tayoca/growth/operator-brief" not in o: fail("operator brief endpoint mismatch")
    if 'data-tayoca-form="operator_brief_unsubscribe"' not in o: fail("unsubscribe form missing")
    if "n8n.tayoca.com/webhook/tayoca/growth/operator-brief/unsubscribe" not in o: fail("unsubscribe endpoint mismatch")
    products=list((PUBLIC/"products").glob("*.html"))
    if not products: fail("no product pages")
    if not any('data-event="product_purchase_click"' in p.read_text(encoding="utf-8",errors="replace") for p in products): fail("product purchase events missing")
    if ("tca-" + "infraforge.site") in "\n".join(p.read_text(encoding="utf-8",errors="replace") for p in PUBLIC.rglob("*") if p.is_file() and p.suffix in {".html",".js",".json"}): fail("retired hostname remains")
    print("Arena conversion/runtime contract: PASS")

def route():
    pages=sitemap_pages()
    canon={urlparse(u).path or "/" for u,_ in pages}
    cfg=json.loads((ROOT/"vercel.json").read_text())
    redirects={x.get("source") for x in cfg.get("redirects",[]) if x.get("source")}
    static=set()
    for line in (PUBLIC/"_redirects").read_text().splitlines():
        x=line.strip()
        if not x or x.startswith("#"): continue
        parts=x.split()
        if len(parts)>=2 and "*" not in parts[0] and ":" not in parts[0]: static.add(parts[0])
    bad=sorted(canon & (redirects|static))
    if bad: fail(f"canonical paths redirected: {bad}")
    print(f"Arena route parity: PASS ({len(pages)} canonical pages)")

def social():
    bad=[]
    for url,path in sitemap_pages():
        p=parser_for(path)
        miss=[]
        if not p.title.strip(): miss.append("title")
        if not p.meta.get("description","").strip(): miss.append("description")
        if p.canonical!=url: miss.append("canonical")
        for k in ["og:title","og:description","og:image"]:
            if not p.props.get(k,"").strip(): miss.append(k)
        for k in ["twitter:card","twitter:title","twitter:description","twitter:image"]:
            if not p.meta.get(k,"").strip(): miss.append(k)
        if miss: bad.append(f"{path.relative_to(ROOT)}: {','.join(miss)}")
    if bad: fail("social metadata gaps: "+"; ".join(bad))
    print("Arena social metadata parity: PASS")

def structured():
    pages=sitemap_pages(); parsed=0; homepage_types=set()
    for url,path in pages:
        p=parser_for(path)
        for raw in p.jsonld:
            try: obj=json.loads(raw)
            except Exception as e: fail(f"{path.relative_to(ROOT)} invalid JSON-LD: {e}")
            parsed+=1
            if path==PUBLIC/"index.html":
                nodes=obj.get("@graph",[]) if isinstance(obj,dict) else []
                for n in nodes:
                    if isinstance(n,dict) and n.get("@type"): homepage_types.add(n["@type"])
    if not {"Organization","WebSite"} <= homepage_types: fail(f"homepage JSON-LD missing Organization/WebSite: {homepage_types}")
    if parsed==0: fail("no JSON-LD found")
    print(f"Arena structured data governance: PASS ({parsed} JSON-LD blocks)")

def theme():
    css=read("public/assets/css/site-shell.css")
    for token in [".hero-cinema",".hero-split",".paper-band",".portfolio-card",".ledger-label",".header-map"]:
        if token not in css: fail(f"Arena CSS primitive missing {token}")
    product=read("public/assets/css/product-detail.css")
    if not product.strip(): fail("Arena product-detail.css empty")
    for p in ["public/index.html","public/work.html","public/about.html","public/services.html","public/products.html","public/results.html","public/trust.html","public/sivanta.html"]:
        s=read(p)
        if "tayoca-v9.css" in s or "tayoca-v9.js" in s: fail(f"{p}: v9 override present")
    print("Arena presentation runtime: PASS")

def static():
    content(); route(); social(); structured(); conversion(); theme()
    if not (PUBLIC/"robots.txt").is_file(): fail("robots.txt missing")
    if "Sitemap: https://tayoca.com/sitemap.xml" not in read("public/robots.txt"): fail("robots sitemap missing")
    print("Arena static package: PASS")

SCOPES={"content":content,"conversion":conversion,"route":route,"social":social,"structured":structured,"theme":theme,"static":static}
if __name__=="__main__":
    ap=argparse.ArgumentParser(); ap.add_argument("--scope",choices=SCOPES,required=True); args=ap.parse_args(); SCOPES[args.scope]()
