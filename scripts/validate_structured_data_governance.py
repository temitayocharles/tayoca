#!/usr/bin/env python3
"""Validate Tayoca Phase 4 structured-data governance without fabricating content history."""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
from typing import Any

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_DIR = REPO_ROOT / "public"
SITE_ORIGIN = "https://tayoca.com"

ARTICLE_JSONLD_DATE_GAP_ALLOWLIST = {
}

ARTICLE_JSONLD_MISSING_ALLOWLIST = {
    "public/blog/cloud-cost-optimization-playbook.html": "known Phase 4 remediation candidate; add BlogPosting JSON-LD only when date/content provenance is explicit",
}

PRODUCT_SCHEMA_TYPES = {"Product"}
ARTICLE_SCHEMA_TYPES = {"Article", "BlogPosting", "NewsArticle"}
GOVERNED_PRODUCT_CURRENCIES = {"CAD", "USD"}


class HeadParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.title = ""
        self.canonical = ""
        self.robots = ""
        self.og_type = ""
        self.og_title = ""
        self.og_description = ""
        self.og_url = ""
        self.og_image = ""
        self.twitter_card = ""
        self.twitter_title = ""
        self.twitter_description = ""
        self.twitter_image = ""
        self.jsonld_blocks: list[tuple[str, str]] = []
        self._in_title = False
        self._title_parts: list[str] = []
        self._in_jsonld = False
        self._jsonld_parts: list[str] = []

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
        if tag == "meta":
            name = attributes.get("name", "").lower()
            prop = attributes.get("property", "").lower()
            content = attributes.get("content", "").strip()
            if name == "robots":
                self.robots = content
            elif name == "twitter:card":
                self.twitter_card = content
            elif name == "twitter:title":
                self.twitter_title = content
            elif name == "twitter:description":
                self.twitter_description = content
            elif name == "twitter:image":
                self.twitter_image = content
            elif prop == "og:type":
                self.og_type = content
            elif prop == "og:title":
                self.og_title = content
            elif prop == "og:description":
                self.og_description = content
            elif prop == "og:url":
                self.og_url = content
            elif prop == "og:image":
                self.og_image = content
            return
        if tag == "script" and attributes.get("type", "").lower() == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_parts = []

    def handle_data(self, data: str) -> None:
        if self._in_title:
            self._title_parts.append(data)
        if self._in_jsonld:
            self._jsonld_parts.append(data)

    def handle_endtag(self, tag: str) -> None:
        tag = tag.lower()
        if tag == "title" and self._in_title:
            self.title = " ".join("".join(self._title_parts).split())
            self._in_title = False
        if tag == "script" and self._in_jsonld:
            raw = "".join(self._jsonld_parts).strip()
            self.jsonld_blocks.append(("application/ld+json", raw))
            self._in_jsonld = False


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


def iter_schema_nodes(value: Any) -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    if isinstance(value, dict):
        if "@graph" in value and isinstance(value["@graph"], list):
            for item in value["@graph"]:
                nodes.extend(iter_schema_nodes(item))
        else:
            nodes.append(value)
    elif isinstance(value, list):
        for item in value:
            nodes.extend(iter_schema_nodes(item))
    return nodes


def schema_type_set(node: dict[str, Any]) -> set[str]:
    raw = node.get("@type")
    if isinstance(raw, str):
        return {raw}
    if isinstance(raw, list):
        return {item for item in raw if isinstance(item, str)}
    return set()


def is_indexable(parser: HeadParser) -> bool:
    return "noindex" not in parser.robots.lower().replace(" ", "")


def validate_jsonld(path: Path, parser: HeadParser) -> list[dict[str, Any]]:
    nodes: list[dict[str, Any]] = []
    for _, raw in parser.jsonld_blocks:
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError as exc:
            fail(f"{path.relative_to(REPO_ROOT)} has invalid JSON-LD: {exc}")
        nodes.extend(iter_schema_nodes(parsed))
    return nodes


def validate_product_node(relative: str, node: dict[str, Any], canonical: str) -> None:
    if node.get("url") != canonical:
        fail(f"{relative}: Product JSON-LD url must match canonical")
    for field in ("name", "description", "image", "brand", "offers"):
        if field not in node:
            fail(f"{relative}: Product JSON-LD missing {field}")
    offers = node.get("offers")
    if not isinstance(offers, dict):
        fail(f"{relative}: Product JSON-LD offers must be an object")
    if offers.get("@type") != "Offer":
        fail(f"{relative}: Product offer must use @type Offer")
    if str(offers.get("price", "")).strip() == "":
        fail(f"{relative}: Product offer must include price")
    price_currency = offers.get("priceCurrency")
    if price_currency not in GOVERNED_PRODUCT_CURRENCIES:
        fail(
            f"{relative}: Product offer priceCurrency must be one of "
            f"{sorted(GOVERNED_PRODUCT_CURRENCIES)}, got {price_currency!r}"
        )
    availability = offers.get("availability")
    if availability != "https://schema.org/OnlineOnly":
        fail(f"{relative}: Product offer availability must remain OnlineOnly for current digital products")


def validate_article_node(relative: str, node: dict[str, Any], canonical: str) -> None:
    if node.get("url") != canonical:
        fail(f"{relative}: Article JSON-LD url must match canonical")
    main_entity = node.get("mainEntityOfPage")
    if isinstance(main_entity, dict) and main_entity.get("@id") != canonical:
        fail(f"{relative}: Article mainEntityOfPage @id must match canonical")
    for field in ("headline", "description", "author", "publisher", "image"):
        if field not in node:
            fail(f"{relative}: Article JSON-LD missing {field}")


def main() -> None:
    violations: list[str] = []
    active_article_date_allowlist: set[str] = set()
    active_article_missing_allowlist: set[str] = set()

    for url in sitemap_urls():
        path = page_for_url(url)
        if not path.is_file():
            fail(f"Sitemap URL has no file: {url}")
        parser = parse_page(path)
        relative = str(path.relative_to(REPO_ROOT))
        if parser.canonical != url:
            continue
        if not is_indexable(parser):
            continue

        nodes = validate_jsonld(path, parser)
        node_types = set().union(*(schema_type_set(node) for node in nodes)) if nodes else set()

        if relative.startswith("public/products/") and relative.endswith(".html"):
            product_nodes = [node for node in nodes if schema_type_set(node) & PRODUCT_SCHEMA_TYPES]
            if not product_nodes:
                violations.append(f"{relative}: missing Product JSON-LD")
            for node in product_nodes:
                validate_product_node(relative, node, parser.canonical)

        if relative.startswith("public/blog/") and relative != "public/blog/index.html":
            article_nodes = [node for node in nodes if schema_type_set(node) & ARTICLE_SCHEMA_TYPES]
            if not article_nodes:
                if relative in ARTICLE_JSONLD_MISSING_ALLOWLIST:
                    active_article_missing_allowlist.add(relative)
                else:
                    violations.append(f"{relative}: missing Article/BlogPosting JSON-LD")
            for node in article_nodes:
                validate_article_node(relative, node, parser.canonical)
                has_date = bool(node.get("datePublished") or node.get("dateModified"))
                if not has_date:
                    if relative in ARTICLE_JSONLD_DATE_GAP_ALLOWLIST:
                        active_article_date_allowlist.add(relative)
                    else:
                        violations.append(f"{relative}: Article JSON-LD has no datePublished/dateModified")

        if parser.og_type == "article" and relative.startswith("public/blog/"):
            if not parser.og_url or parser.og_url != parser.canonical:
                violations.append(f"{relative}: og:url must match canonical")
            if not parser.og_title or not parser.og_description or not parser.og_image:
                violations.append(f"{relative}: article social metadata incomplete")
            if not parser.twitter_card:
                violations.append(f"{relative}: missing twitter:card")

        if relative.startswith("public/blog/") and node_types & PRODUCT_SCHEMA_TYPES:
            violations.append(f"{relative}: blog page must not use Product JSON-LD")

    stale_article_date_allowlist = sorted(set(ARTICLE_JSONLD_DATE_GAP_ALLOWLIST) - active_article_date_allowlist)
    if stale_article_date_allowlist:
        violations.append("Stale Article JSON-LD date allowlist entries: " + ", ".join(stale_article_date_allowlist))

    stale_article_missing_allowlist = sorted(set(ARTICLE_JSONLD_MISSING_ALLOWLIST) - active_article_missing_allowlist)
    if stale_article_missing_allowlist:
        violations.append("Stale Article JSON-LD missing allowlist entries: " + ", ".join(stale_article_missing_allowlist))

    if violations:
        fail("Structured-data governance violations: " + "; ".join(sorted(violations)))

    print("Structured-data governance validated for sitemap-indexed Tayoca pages with explicit Phase 4 allowlists.")


if __name__ == "__main__":
    main()
