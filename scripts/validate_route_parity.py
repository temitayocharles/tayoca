#!/usr/bin/env python3
"""Fail closed when canonical Tayoca URLs are redirected by deployment routing."""

from __future__ import annotations

import json
import sys
import xml.etree.ElementTree as ET
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
VERCEL = ROOT / "vercel.json"
REDIRECTS = PUBLIC / "_redirects"
SITEMAP = PUBLIC / "sitemap.xml"
ORIGIN = "https://tayoca.com"


def fail(message: str) -> None:
    print(f"ERROR: {message}", file=sys.stderr)
    raise SystemExit(1)


def normalize_path(value: str) -> str:
    path = urlparse(value).path if value.startswith(("http://", "https://")) else value
    if not path.startswith("/"):
        path = "/" + path
    return path


def sitemap_paths() -> set[str]:
    try:
        root = ET.parse(SITEMAP).getroot()
    except (OSError, ET.ParseError) as exc:
        fail(f"Unable to parse sitemap: {exc}")
    ns = {"sm": "http://www.sitemaps.org/schemas/sitemap/0.9"}
    paths: set[str] = set()
    for node in root.findall("sm:url/sm:loc", ns):
        url = (node.text or "").strip()
        if not url:
            continue
        parsed = urlparse(url)
        if parsed.scheme != "https" or parsed.netloc != "tayoca.com":
            fail(f"Non-canonical sitemap URL: {url}")
        paths.add(parsed.path or "/")
    if not paths:
        fail("Sitemap contains no canonical paths")
    return paths


def vercel_redirects() -> dict[str, str]:
    try:
        config = json.loads(VERCEL.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"Unable to parse vercel.json: {exc}")
    result: dict[str, str] = {}
    for item in config.get("redirects", []):
        source = str(item.get("source", "")).strip()
        destination = str(item.get("destination", "")).strip()
        if not source or not destination:
            fail(f"Invalid Vercel redirect entry: {item!r}")
        if source in result and result[source] != destination:
            fail(f"Conflicting Vercel redirect destinations for {source}")
        result[source] = destination
    return result


def static_redirects() -> dict[str, str]:
    result: dict[str, str] = {}
    try:
        lines = REDIRECTS.read_text(encoding="utf-8").splitlines()
    except OSError as exc:
        fail(f"Unable to read public/_redirects: {exc}")
    for raw in lines:
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        parts = line.split()
        if len(parts) < 2:
            fail(f"Malformed public/_redirects line: {raw!r}")
        source, destination = parts[0], parts[1]
        status = parts[2] if len(parts) >= 3 else "301"
        if "*" in source or ":" in source:
            continue
        if status not in {"301", "302", "303", "307", "308"}:
            continue
        if source in result and result[source] != destination:
            fail(f"Conflicting static redirect destinations for {source}")
        result[source] = destination
    return result


def main() -> None:
    canonicals = sitemap_paths()
    vercel = vercel_redirects()
    static = static_redirects()

    canonical_redirects = sorted(path for path in canonicals if path in vercel or path in static)
    if canonical_redirects:
        details = []
        for path in canonical_redirects:
            providers = []
            if path in vercel:
                providers.append(f"vercel->{vercel[path]}")
            if path in static:
                providers.append(f"_redirects->{static[path]}")
            details.append(f"{path} ({', '.join(providers)})")
        fail("Canonical sitemap URLs must not be redirect sources: " + "; ".join(details))

    shared = sorted(set(vercel).intersection(static))
    drift = [path for path in shared if normalize_path(vercel[path]) != normalize_path(static[path])]
    if drift:
        fail(
            "Explicit redirect destination drift between vercel.json and public/_redirects: "
            + "; ".join(f"{path}: vercel={vercel[path]} static={static[path]}" for path in drift)
        )

    print(
        f"Validated route parity: {len(canonicals)} canonical sitemap paths, "
        f"{len(vercel)} Vercel redirects, {len(static)} explicit static redirects; "
        "no canonical URL is redirected."
    )


if __name__ == "__main__":
    main()
