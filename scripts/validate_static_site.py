#!/usr/bin/env python3
"""Fail closed on critical Tayoca static-site packaging and SEO defects."""

from __future__ import annotations

import json
import subprocess
import sys
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

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


class MetadataParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.robots = ""
        self.canonical = ""

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "meta" and attributes.get("name", "").lower() == "robots":
            self.robots = attributes.get("content", "")
        if tag.lower() == "link":
            relations = attributes.get("rel", "").lower().split()
            if "canonical" in relations:
                self.canonical = attributes.get("href", "")


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


def resolve_public_target(url: str) -> Path | None:
    parsed = urlparse(url)
    if parsed.scheme != "https" or parsed.netloc != "tayoca.com":
        fail(f"Sitemap URL is outside the canonical origin: {url}")
    if parsed.query or parsed.fragment:
        fail(f"Sitemap URL must not contain a query or fragment: {url}")

    relative = unquote(parsed.path).lstrip("/")
    if not relative:
        candidates = [PUBLIC_DIR / "index.html"]
    elif parsed.path.endswith("/"):
        candidates = [PUBLIC_DIR / relative / "index.html"]
    else:
        path = PUBLIC_DIR / relative
        candidates = [path]
        if path.suffix == "":
            candidates.extend([path.with_suffix(".html"), path / "index.html"])

    return next((candidate for candidate in candidates if candidate.is_file()), None)


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
        parser = MetadataParser()
        parser.feed(html_file.read_text(encoding="utf-8", errors="replace"))
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

    not_found = (PUBLIC_DIR / "404.html").read_text(encoding="utf-8").lower()
    if 'name="robots"' not in not_found or "noindex" not in not_found:
        fail("404.html must include a noindex robots directive")

    print(f"Validated {len(urls)} sitemap URLs and {len(tracked)} tracked files.")


if __name__ == "__main__":
    main()
