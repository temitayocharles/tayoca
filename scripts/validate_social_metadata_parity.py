#!/usr/bin/env python3
"""Validate Tayoca Phase 4 social-preview metadata boundaries for sitemap-indexed article and product detail pages."""

from __future__ import annotations

import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = REPO_ROOT / "public"

DETAIL_PREFIXES = (
    "public/blog/",
    "public/products/",
)

DETAIL_INDEX_EXCLUSIONS = {
    "public/blog/index.html",
}

# Existing indexed detail pages that have only twitter:card, or otherwise have not
# yet had full Twitter/X title, description and image parity normalized. Keep these
# explicit so Phase 4 remediation can remove entries as pages are corrected.
TWITTER_DETAIL_GAP_ALLOWLIST = {
    "public/blog/kubernetes-production-checklist.html": "twitter title/description/image not normalized yet",
    "public/blog/kubernetes-production-readiness-checklist-for-2026.html": "twitter title/description/image not normalized yet",
    "public/blog/kubernetes-troubleshooting-labs.html": "twitter title/description/image not normalized yet",
}


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.description = ""
        self.canonical = ""
        self.robots = ""
        self.og_title = ""
        self.og_description = ""
        self.og_type = ""
        self.og_url = ""
        self.og_image = ""
        self.twitter_card = ""
        self.twitter_title = ""
        self.twitter_description = ""
        self.twitter_image = ""
        self._in_title = False
        self._title_parts: list[str] = []

    @staticmethod
    def _attrs(attrs: list[tuple[str, str | None]]) -> dict[str, str]:
        return {key.lower(): value or "" for key, value in attrs}

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        tag = tag.lower()
        attributes = self._attrs(attrs)
        if tag == "title":
            self._in_title = True
            self._title_parts = []
            return
        if tag == "link":
            rels = {value.lower() for value in attributes.get("rel", "").split()}
            if "canonical" in rels:
                self.canonical = attributes.get("href", "").strip()
            return
        if tag != "meta":
            return

        name = attributes.get("name", "").lower()
        prop = attributes.get("property", "").lower()
        content = attributes.get("content", "").strip()

        if name == "description":
            self.description = content
        elif name == "robots":
            self.robots = content
        elif name == "twitter:card":
            self.twitter_card = content
        elif name == "twitter:title":
            self.twitter_title = content
        elif name == "twitter:description":
            self.twitter_description = content
        elif name == "twitter:image":
            self.twitter_image = content
        elif prop == "og:title":
            self.og_title = content
        elif prop == "og:description":
            self.og_description = content
        elif prop == "og:type":
            self.og_type = content
        elif prop == "og:url":
            self.og_url = content
        elif prop == "og:image":
            self.og_image = content

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title" and self._in_title:
            self.title = " ".join("".join(self._title_parts).split())
            self._in_title = False


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def page_for_url(url: str) -> Path:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.netloc != "tayoca.com":
        fail(f"Non-canonical sitemap URL: {url}")
    if parsed.path == "/":
        return PUBLIC_DIR / "index.html"
    if parsed.path.endswith("/"):
        return PUBLIC_DIR / parsed.path.strip("/") / "index.html"
    path = PUBLIC_DIR / parsed.path.lstrip("/")
    if path.suffix:
        return path
    return path / "index.html"


def sitemap_urls() -> list[str]:
    root = ET.parse(PUBLIC_DIR / "sitemap.xml").getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [
        (node.text or "").strip()
        for node in root.findall("sm:url/sm:loc", namespace)
        if (node.text or "").strip()
    ]
    if not urls:
        fail("Sitemap contains no URLs")
    return urls


def parse_page(path: Path) -> HeadParser:
    parser = HeadParser()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser


def is_indexable(parser: HeadParser) -> bool:
    return "noindex" not in parser.robots.lower().replace(" ", "")


def is_detail_path(relative: str) -> bool:
    if relative in DETAIL_INDEX_EXCLUSIONS:
        return False
    return any(relative.startswith(prefix) for prefix in DETAIL_PREFIXES)


def validate_social_metadata(relative: str, url: str, parser: HeadParser) -> list[str]:
    violations: list[str] = []

    if parser.canonical != url:
        violations.append(f"{relative}: canonical must match sitemap URL")
        return violations

    if parser.og_url and parser.og_url != parser.canonical:
        violations.append(f"{relative}: og:url must match canonical")

    for field, value in {
        "og:title": parser.og_title,
        "og:description": parser.og_description,
        "og:type": parser.og_type,
        "og:image": parser.og_image,
    }.items():
        if not value:
            violations.append(f"{relative}: missing {field}")

    if parser.twitter_card != "summary_large_image":
        violations.append(f"{relative}: twitter:card must be summary_large_image")

    missing_twitter_detail = [
        field
        for field, value in {
            "twitter:title": parser.twitter_title,
            "twitter:description": parser.twitter_description,
            "twitter:image": parser.twitter_image,
        }.items()
        if not value
    ]
    if missing_twitter_detail and relative not in TWITTER_DETAIL_GAP_ALLOWLIST:
        violations.append(
            f"{relative}: missing {', '.join(missing_twitter_detail)} and is not allowlisted"
        )

    if parser.twitter_image and parser.og_image and parser.twitter_image != parser.og_image:
        violations.append(f"{relative}: twitter:image must match og:image")

    return violations


def main() -> None:
    violations: list[str] = []
    seen_detail_pages: set[str] = set()

    for url in sitemap_urls():
        path = page_for_url(url)
        if not path.is_file():
            fail(f"Sitemap URL has no file: {url}")
        relative = str(path.relative_to(REPO_ROOT))
        if not is_detail_path(relative):
            continue
        seen_detail_pages.add(relative)
        parser = parse_page(path)
        if not is_indexable(parser):
            continue
        violations.extend(validate_social_metadata(relative, url, parser))

    stale_allowlist = sorted(set(TWITTER_DETAIL_GAP_ALLOWLIST) - seen_detail_pages)
    if stale_allowlist:
        violations.append(
            "Stale Twitter detail allowlist entries: " + ", ".join(stale_allowlist)
        )

    if violations:
        fail("Social metadata parity violations: " + "; ".join(sorted(violations)))

    print(
        "Social metadata parity validated for sitemap-indexed Tayoca detail pages with explicit Phase 4 allowlists."
    )


if __name__ == "__main__":
    main()
