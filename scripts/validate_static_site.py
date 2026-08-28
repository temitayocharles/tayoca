#!/usr/bin/env python3
"""Fail closed on critical Tayoca static-site packaging, SEO, trust, and public-shell defects."""

from __future__ import annotations

import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urljoin, urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = REPO_ROOT / "public"
SITE_ORIGIN = "https://tayoca.com"
REQUIRED_FILES = (
    PUBLIC_DIR / "index.html",
    PUBLIC_DIR / "404.html",
    PUBLIC_DIR / "robots.txt",
    PUBLIC_DIR / "sitemap.xml",
    PUBLIC_DIR / "_redirects",
)
LOCKED_NAV = [
    ("Services", "/services.html"),
    ("Assessments", "/assessments.html"),
    ("Results", "/results.html"),
    ("Products", "/products.html"),
    ("Insights", "/insights.html"),
    ("About", "/about.html"),
]
BLOCKED_PUBLIC_CLAIMS: dict[str, tuple[str, ...]] = {
    "unsupported quantified AWS outcome": ("$216k", "series b fintech"),
    "unsupported deployment-time promise": ("production clusters by day 15",),
    "unsupported platform SLA": ("platform sla >=99.95%", "platform sla ≥99.95%"),
    "unsupported savings guarantee": ("$0 saved -> $0 paid", "$0 saved → $0 paid"),
    "unsupported refund guarantee": ("30-day money-back guarantee",),
    "unsupported acceptance promise": ("30-day acceptance",),
    "unsupported ROI guarantee": ("pay for itself",),
    "unsupported PMP attestation": (">pmp<",),
    "unsupported CSM attestation": (">csm<",),
    "unsupported Terraform credential": ("terraform associate",),
    "unsupported AWS credential": ("aws solutions architect",),
}


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.robots = ""
        self.canonical = ""
        self.meta_description = False
        self.og_title = False
        self.twitter_card = False
        self.site_header = False
        self.menu_toggle = False
        self.main_seen = False
        self.ids: set[str] = set()
        self.stylesheets: set[str] = set()
        self.scripts: set[str] = set()
        self.hrefs: list[str] = []
        self.nav_items: list[tuple[str, str]] = []
        self.header_anchors: list[tuple[str, str, set[str]]] = []
        self.skip_links: list[tuple[str, str]] = []
        self._in_primary_nav = False
        self._in_site_header = False
        self._anchor: dict[str, object] | None = None

    @staticmethod
    def _attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {key.lower(): value or "" for key, value in attrs}

    @staticmethod
    def _classes(attributes: dict[str, str]) -> set[str]:
        return {value for value in attributes.get("class", "").split() if value}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attributes = self._attrs(attrs)
        classes = self._classes(attributes)
        element_id = attributes.get("id", "")
        if element_id:
            self.ids.add(element_id)

        if tag == "meta":
            name = attributes.get("name", "").lower()
            prop = attributes.get("property", "").lower()
            if name == "robots":
                self.robots = attributes.get("content", "")
            elif name == "description":
                self.meta_description = bool(attributes.get("content", "").strip())
            elif name == "twitter:card":
                self.twitter_card = bool(attributes.get("content", "").strip())
            if prop == "og:title":
                self.og_title = bool(attributes.get("content", "").strip())

        if tag == "link":
            relations = {value.lower() for value in attributes.get("rel", "").split()}
            href = attributes.get("href", "")
            if "canonical" in relations:
                self.canonical = href
            if "stylesheet" in relations and href:
                self.stylesheets.add(href)

        if tag == "script":
            src = attributes.get("src", "")
            if src:
                self.scripts.add(src)

        if tag == "header":
            if "site-header" in classes:
                self.site_header = True
                self._in_site_header = True

        if tag == "nav" and ("primary-nav" in classes or element_id == "primary-nav"):
            self._in_primary_nav = True

        if tag == "button" and "menu-toggle" in classes:
            self.menu_toggle = True

        if tag == "main":
            self.main_seen = True

        if tag == "a":
            href = attributes.get("href", "")
            if href:
                self.hrefs.append(href)
            self._anchor = {
                "href": href,
                "classes": classes,
                "text": [],
                "in_primary_nav": self._in_primary_nav,
                "in_site_header": self._in_site_header,
            }

    def handle_data(self, data: str) -> None:
        if self._anchor is not None:
            text = self._anchor["text"]
            assert isinstance(text, list)
            text.append(data)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "a" and self._anchor is not None:
            href = str(self._anchor["href"])
            classes = self._anchor["classes"]
            assert isinstance(classes, set)
            text_parts = self._anchor["text"]
            assert isinstance(text_parts, list)
            text = " ".join("".join(text_parts).split())
            if bool(self._anchor["in_primary_nav"]):
                self.nav_items.append((text, href))
            if bool(self._anchor["in_site_header"]):
                self.header_anchors.append((text, href, classes))
            if "skip-link" in classes:
                self.skip_links.append((text, href))
            self._anchor = None

        if tag == "nav":
            self._in_primary_nav = False
        if tag == "header":
            self._in_site_header = False


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def tracked_files() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files"],
        cwd=REPO_ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    return [line.strip() for line in result.stdout.splitlines() if line.strip()]


def resolve_public_path(path_value: str) -> Path | None:
    relative = unquote(path_value).lstrip("/")
    if not relative:
        candidates = [PUBLIC_DIR / "index.html"]
    elif path_value.endswith("/"):
        candidates = [PUBLIC_DIR / relative / "index.html"]
    else:
        path = PUBLIC_DIR / relative
        candidates = [path]
        if path.suffix == "":
            candidates.extend([path.with_suffix(".html"), path / "index.html"])
    return next((candidate for candidate in candidates if candidate.is_file()), None)


def resolve_public_target(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.netloc != "tayoca.com":
        fail(f"Sitemap URL is outside the canonical origin: {url}")
    if parsed.query or parsed.fragment:
        fail(f"Sitemap URL must not contain a query or fragment: {url}")
    return resolve_public_path(parsed.path)


def permanent_redirect_sources() -> set[str]:
    config_path = REPO_ROOT / "vercel.json"
    if not config_path.is_file():
        return set()
    config = json.loads(config_path.read_text(encoding="utf-8"))
    return {
        f"{SITE_ORIGIN}{redirect['source']}"
        for redirect in config.get("redirects", [])
        if redirect.get("permanent") is True and redirect.get("source", "").startswith("/")
    }


def parse_page(path: Path) -> PageParser:
    parser = PageParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def validate_blocked_public_claims() -> None:
    violations: list[str] = []
    for html_file in PUBLIC_DIR.rglob("*.html"):
        raw = html_file.read_text(encoding="utf-8", errors="replace")
        normalized = unescape(raw).lower()
        for label, patterns in BLOCKED_PUBLIC_CLAIMS.items():
            matched = next((pattern for pattern in patterns if pattern in normalized), None)
            if matched:
                relative = html_file.relative_to(REPO_ROOT)
                violations.append(f"{relative}: {label} ({matched!r})")
    if violations:
        fail("Blocked Stage 4 claims found on public surfaces: " + "; ".join(sorted(violations)))


def validate_public_shell(page_url: str, page_path: Path, parser: PageParser) -> list[str]:
    violations: list[str] = []
    if parser.canonical != page_url:
        violations.append(f"canonical={parser.canonical or '<missing>'}")
    if not parser.meta_description:
        violations.append("meta-description")
    if not parser.og_title:
        violations.append("og:title")
    if not parser.twitter_card:
        violations.append("twitter:card")
    if not parser.site_header:
        violations.append("site-header")
    if not parser.menu_toggle:
        violations.append("menu-toggle")
    if not parser.main_seen:
        violations.append("main-landmark")
    if parser.nav_items != LOCKED_NAV:
        violations.append(f"primary-nav={parser.nav_items!r}")
    if not any(
        text == "Start an Assessment"
        and href == "/assessments.html"
        and ("header-cta" in classes or "button" in classes)
        for text, href, classes in parser.header_anchors
    ):
        violations.append("primary-cta")
    if not parser.skip_links:
        violations.append("skip-link")
    else:
        valid_skip = False
        for _, href in parser.skip_links:
            parsed = urlparse(href)
            if parsed.path in ("", page_url, urlparse(page_url).path) and parsed.fragment in parser.ids:
                valid_skip = True
                break
        if not valid_skip:
            violations.append("skip-link-target")
    if not any(
        href in {"/assets/css/site-shell.css", "/assets/css/growth-os.css"}
        for href in parser.stylesheets
    ):
        violations.append("responsive-shell-css")
    if "/tayoca-site.js" not in parser.scripts:
        violations.append("tayoca-site.js")
    return violations


def validate_internal_links(
    page_url: str,
    page_path: Path,
    parser: PageParser,
    redirect_sources: set[str],
    parser_cache: dict[Path, PageParser],
) -> list[str]:
    violations: list[str] = []
    ignored_schemes = {"mailto", "tel", "javascript", "data"}
    for href in parser.hrefs:
        value = href.strip()
        if not value:
            violations.append("<empty href>")
            continue
        parsed_raw = urlparse(value)
        if parsed_raw.scheme.lower() in ignored_schemes:
            continue

        resolved = urljoin(page_url, value)
        parsed = urlparse(resolved)
        if parsed.scheme not in {"http", "https"}:
            continue
        if parsed.netloc and parsed.netloc.lower() != "tayoca.com":
            continue

        target_url = f"{SITE_ORIGIN}{parsed.path or '/'}"
        target_path = resolve_public_path(parsed.path or "/")
        if target_path is None and target_url not in redirect_sources:
            violations.append(value)
            continue

        if parsed.fragment and target_path is not None:
            target_parser = parser_cache.get(target_path)
            if target_parser is None:
                target_parser = parse_page(target_path)
                parser_cache[target_path] = target_parser
            if parsed.fragment not in target_parser.ids:
                violations.append(f"{value} (missing fragment)")
    return violations


def main() -> None:
    missing = [str(path.relative_to(REPO_ROOT)) for path in REQUIRED_FILES if not path.is_file()]
    if missing:
        fail(f"Missing required files: {', '.join(missing)}")

    tracked = tracked_files()
    tracked_envs = [
        path
        for path in tracked
        if Path(path).name.startswith(".env") and path != ".env.example"
    ]
    if tracked_envs:
        fail(f"Environment files must not be tracked: {', '.join(tracked_envs)}")

    validate_blocked_public_claims()

    robots = (PUBLIC_DIR / "robots.txt").read_text(encoding="utf-8")
    expected_sitemap = f"Sitemap: {SITE_ORIGIN}/sitemap.xml"
    if expected_sitemap not in robots:
        fail(f"robots.txt must contain: {expected_sitemap}")

    try:
        root = ET.parse(PUBLIC_DIR / "sitemap.xml").getroot()
    except ET.ParseError as exc:
        fail(f"Invalid sitemap XML: {exc}")

    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [
        (node.text or "").strip()
        for node in root.findall("sm:url/sm:loc", namespace)
        if (node.text or "").strip()
    ]
    if not urls:
        fail("Sitemap contains no URLs")
    if len(urls) != len(set(urls)):
        fail("Sitemap contains duplicate URLs")

    unresolved = [url for url in urls if resolve_public_target(url) is None]
    if unresolved:
        fail("Sitemap URLs have no deployable file: " + ", ".join(unresolved))

    sitemap_urls = set(urls)
    redirect_sources = permanent_redirect_sources()
    omitted_indexable: list[str] = []
    for html_file in PUBLIC_DIR.rglob("*.html"):
        parser = parse_page(html_file)
        robots_value = parser.robots.lower().replace(" ", "")
        is_indexable = "index" in robots_value and "noindex" not in robots_value
        if (
            is_indexable
            and parser.canonical.startswith(f"{SITE_ORIGIN}/")
            and parser.canonical not in redirect_sources
            and parser.canonical not in sitemap_urls
        ):
            omitted_indexable.append(parser.canonical)
    if omitted_indexable:
        fail("Indexable canonical pages are absent from sitemap: " + ", ".join(sorted(omitted_indexable)))

    parser_cache: dict[Path, PageParser] = {}
    shell_violations: list[str] = []
    broken_links: list[str] = []
    for page_url in urls:
        page_path = resolve_public_target(page_url)
        assert page_path is not None
        parser = parser_cache.get(page_path)
        if parser is None:
            parser = parse_page(page_path)
            parser_cache[page_path] = parser

        page_shell_violations = validate_public_shell(page_url, page_path, parser)
        if page_shell_violations:
            relative = page_path.relative_to(REPO_ROOT)
            shell_violations.append(f"{relative}: {', '.join(page_shell_violations)}")

        page_broken_links = validate_internal_links(
            page_url,
            page_path,
            parser,
            redirect_sources,
            parser_cache,
        )
        for href in page_broken_links:
            relative = page_path.relative_to(REPO_ROOT)
            broken_links.append(f"{relative}: {href}")

    if shell_violations:
        fail("Stage 5 public-shell violations: " + "; ".join(shell_violations))
    if broken_links:
        fail("Broken internal links on canonical pages: " + "; ".join(sorted(broken_links)))

    not_found = (PUBLIC_DIR / "404.html").read_text(encoding="utf-8").lower()
    if 'name="robots"' not in not_found or "noindex" not in not_found:
        fail("404.html must include a noindex robots directive")

    print(
        f"Validated {len(urls)} canonical pages, {len(tracked)} tracked files, "
        "Stage 4 blocked-claim exclusions, Stage 5 shell conformance, and internal links."
    )


if __name__ == "__main__":
    main()
