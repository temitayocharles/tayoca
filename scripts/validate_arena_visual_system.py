#!/usr/bin/env python3
"""Guard Tayoca's Arena-derived visual system and company-platform IA contracts.

This validator intentionally protects durable primitives, not exact copy or page
markup. Current pages may evolve, but the company-platform visual language and
classification/navigation contracts must remain available.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

def require_text(path: str, needles: list[str]) -> None:
    text = (ROOT / path).read_text(encoding="utf-8")
    missing = [needle for needle in needles if needle not in text]
    if missing:
        raise SystemExit(f"{path}: missing Arena contract fragments: {missing}")

def main() -> None:
    require_text(
        "public/assets/css/site-shell.css",
        [
            ".hero-cinema",
            ".hero-split",
            ".paper-band",
            ".portfolio-card",
            ".ledger-label",
            ".header-map",
            ".coverstrip",
            ".device",
            ".diagram",
            ".ledger-panel",
        ],
    )

    require_text(
        "public/work.html",
        [
            'aria-label="Company map"',
            'href="/work.html"',
            'href="/operator-brief.html"',
            'href="/community/websites"',
            'href="/trust.html"',
            'href="/reviews.html"',
            'href="/sivanta.html"',
            ">Sivanta<",
            ">SiteSupply<",
            ">The Operator Brief<",
            ">Free Website Initiative<",
            "The systems behind the public work",
        ],
    )

    settings = json.loads((ROOT / "public/data/site-settings.json").read_text(encoding="utf-8"))
    if settings.get("schemaVersion") != 1:
        raise SystemExit("site-settings schemaVersion must remain 1")

    nav = {(item.get("label"), item.get("href")) for item in settings.get("navigation", [])}
    explore = {(item.get("label"), item.get("href")) for item in settings.get("footer", {}).get("explore", [])}
    required_nav = {
        ("Work", "/work.html"),
        ("Community", "/community/websites"),
    }
    if not required_nav <= nav:
        raise SystemExit(f"site-settings navigation lost company-platform entries: {sorted(required_nav - nav)}")
    if not required_nav <= explore:
        raise SystemExit(f"site-settings footer lost company-platform entries: {sorted(required_nav - explore)}")

    ecosystem = json.loads((ROOT / "public/data/company-ecosystem.json").read_text(encoding="utf-8"))
    if ecosystem.get("schema_version") != 2:
        raise SystemExit("company-ecosystem schema_version must remain 2")

    required_keys = {
        "classification_model",
        "portfolio",
        "products",
        "publications",
        "community",
        "runtime_inventory",
        "practices",
        "services",
        "evidence",
        "security",
    }
    missing_keys = required_keys - set(ecosystem)
    if missing_keys:
        raise SystemExit(f"company-ecosystem lost required company-platform keys: {sorted(missing_keys)}")

    print("Arena visual-system/company-platform contract: PASS")

if __name__ == "__main__":
    main()
