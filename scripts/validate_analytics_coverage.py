#!/usr/bin/env python3
from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse
import xml.etree.ElementTree as ET

PUBLIC = Path("public")
SITEMAP = PUBLIC / "sitemap.xml"
MEASUREMENT_ID = "G-G4QC90QNXW"
GA_LOADER = "/ga4.js"


def url_to_file(url: str) -> Path:
    path = urlparse(url).path
    if path in ("", "/"):
        return PUBLIC / "index.html"
    relative = path.lstrip("/")
    candidate = PUBLIC / relative
    if candidate.suffix:
        return candidate
    if candidate.is_file():
        return candidate
    html_candidate = candidate.with_suffix(".html")
    if html_candidate.is_file():
        return html_candidate
    return candidate / "index.html"


def main() -> int:
    root = ET.parse(SITEMAP).getroot()
    namespace = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    urls = [element.text.strip() for element in root.findall("sm:url/sm:loc", namespace) if element.text]

    failures: list[str] = []
    checked = 0
    for url in urls:
        file_path = url_to_file(url)
        if not file_path.is_file():
            failures.append(f"{url}: canonical target missing at {file_path}")
            continue
        html = file_path.read_text(encoding="utf-8")
        missing = []
        if MEASUREMENT_ID not in html:
            missing.append(MEASUREMENT_ID)
        if GA_LOADER not in html:
            missing.append(GA_LOADER)
        if missing:
            failures.append(f"{url}: missing analytics marker(s): {', '.join(missing)}")
        checked += 1

    if failures:
        print("Analytics coverage validation failed:")
        for failure in failures:
            print(f"- {failure}")
        return 1

    print(f"Validated GA4 coverage for {checked} canonical sitemap URLs.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
