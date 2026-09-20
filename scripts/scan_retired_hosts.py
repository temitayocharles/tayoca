#!/usr/bin/env python3
"""Fail closed when retired Tayoca infrastructure hostnames re-enter live surfaces."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LIVE_ROOTS = (
    ROOT / "public",
    ROOT / ".forgejo" / "workflows",
)
RETIRED_HOSTS = (
    "n8n.tca-infraforge.site",
    "forgejo.tca-infraforge.site",
    "vault.tca-infraforge.site",
)
TEXT_SUFFIXES = {
    ".html", ".htm", ".js", ".json", ".css", ".xml", ".txt",
    ".md", ".yml", ".yaml", ".py", ".sh", ".toml"
}


def main() -> int:
    hits: list[tuple[str, str]] = []
    for root in LIVE_ROOTS:
        if not root.exists():
            continue
        for path in sorted(p for p in root.rglob("*") if p.is_file()):
            if path.suffix.lower() not in TEXT_SUFFIXES and path.name != "_redirects":
                continue
            try:
                text = path.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for host in RETIRED_HOSTS:
                if host in text:
                    hits.append((path.relative_to(ROOT).as_posix(), host))

    if hits:
        for path, host in hits:
            print(f"ERROR: retired host {host} found in live surface {path}", file=sys.stderr)
        return 1

    print(
        "Retired-host guard passed: no legacy n8n, Forgejo, or Vault "
        "tca-infraforge.site hostnames found in public/ or .forgejo/workflows/."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
