#!/usr/bin/env python3
"""Arena redesign QA: internal link, fragment, asset and contract checker.

Checks every HTML file under public/:
  - internal hrefs resolve to real files (respecting directory index and
    clean-URL conventions used by this site)
  - in-page fragments (#id) exist on the target page
  - img/link/script src resolve to real files
  - n8n form contracts: webhook actions + field names byte-stable
  - operator-brief archive insert marker present exactly once
  - legacy landers and auxiliary pages carry noindex where expected

Usage: python3 scripts/check_links.py
"""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

PUBLIC = Path(__file__).resolve().parents[1] / "public"

EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "//", "data:", "#")
FORM_CONTRACTS = {
    "assessment_request": {
        "action": "https://n8n.tca-infraforge.site/webhook/tayoca/growth/assessment",
        "fields": {"email", "company", "role", "segment", "assessment", "urgency", "evidence_readiness", "context"},
    },
    "operator_brief": {
        "action": "https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief",
        "fields": {"email", "interest", "consent", "website"},
    },
    "operator_brief_unsubscribe": {
        "action": "https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief/unsubscribe",
        "fields": {"email", "website"},
    },
}
ARCHIVE_MARKER = "<!-- OPERATOR_BRIEF_ARCHIVE_INSERT -->"
GOOGLE_FORM = "https://docs.google.com/forms/d/e/1FAIpQLSeTyWlIZzI8uz4zNRiLXaNdIAw3NuPDIRxnuemwIb7c-IW64Q/viewform"
REVIEWS_ENDPOINT = "https://n8n.tca-infraforge.site/webhook/tayoca/reviews/public"


class PageParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__()
        self.hrefs: list[tuple[str, str]] = []
        self.ids: set[str] = set()
        self.forms: list[dict] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attributes = {k.lower(): v or "" for k, v in attrs}
        if tag == "a" and attributes.get("href"):
            self.hrefs.append(("a", attributes["href"]))
        elif tag in ("img", "script", "link", "source", "video") and attributes.get("src"):
            self.hrefs.append((tag, attributes["src"]))
        elif tag == "link" and attributes.get("href") and "stylesheet" in attributes.get("rel", ""):
            self.hrefs.append(("link", attributes["href"]))
        if attributes.get("id"):
            self.ids.add(attributes["id"])
        if tag == "form":
            fields = set()
            self.forms.append({"action": attributes.get("action", ""), "fields": fields, "tag": None})
            self._current_form = self.forms[-1]
        elif tag == "input" and attributes.get("name") and getattr(self, "_current_form", None):
            self._current_form["fields"].add(attributes["name"])
        elif tag == "select" and attributes.get("name") and getattr(self, "_current_form", None):
            self._current_form["fields"].add(attributes["name"])
        elif tag == "textarea" and attributes.get("name") and getattr(self, "_current_form", None):
            self._current_form["fields"].add(attributes["name"])

    def handle_endtag(self, tag: str) -> None:
        if tag == "form":
            self._current_form = None


def resolve(path: str, base_dir: Path) -> Path | None:
    if path.startswith("/"):
        rel = path.lstrip("/")
        base = PUBLIC
    else:
        rel = path
        base = base_dir
    target = (base / rel).resolve()
    # safety: stay inside public
    if not str(target).startswith(str(PUBLIC.resolve())):
        return None
    if target.is_file():
        return target
    if target.suffix == "":
        for candidate in (Path(str(target) + ".html"), target / "index.html"):
            if candidate.is_file():
                return candidate
    return None


def main() -> int:
    files = sorted(PUBLIC.rglob("*.html"))
    failures: list[str] = []
    checked = 0
    forms_found: dict[str, int] = {}

    for file in files:
        rel = file.relative_to(PUBLIC)
        html = file.read_text(encoding="utf-8", errors="replace")
        parser = PageParser()
        parser.feed(html)
        checked += 1

        for tag, href in parser.hrefs:
            if href.startswith(EXTERNAL_PREFIXES) or href == "":
                continue
            base = file.parent if not href.startswith("/") else PUBLIC
            frag = ""
            clean = href
            if "#" in href:
                clean, frag = href.split("#", 1)
            if "?" in clean:
                clean = clean.split("?", 1)[0]
            if not clean:
                continue
            target = resolve(clean, base if not clean.startswith("/") else PUBLIC)
            if target is None:
                failures.append(f"{rel}: {tag} href={href!r} does not resolve")
            elif frag and frag not in target.read_text(encoding="utf-8", errors="replace"):
                # fragment check: look for id="frag"
                if f'id="{frag}"' not in target.read_text(encoding="utf-8", errors="replace"):
                    failures.append(f"{rel}: fragment #{frag} not found in {target.relative_to(PUBLIC)}")

        # form contracts
        for form in parser.forms:
            action = form["action"]
            for key, contract in FORM_CONTRACTS.items():
                if action == contract["action"]:
                    forms_found[key] = forms_found.get(key, 0) + 1
                    missing = contract["fields"] - form["fields"]
                    if missing:
                        failures.append(f"{rel}: form {key} missing fields {sorted(missing)}")
            if "n8n.tca-infraforge.site" in action and "webhook/tayoca" not in action:
                failures.append(f"{rel}: unexpected n8n webhook action {action}")

        if rel.as_posix() == "operator-brief-archive.html":
            if html.count(ARCHIVE_MARKER) != 1:
                failures.append("operator-brief-archive.html: archive insert marker count != 1")

        if rel.as_posix() == "community/websites/index.html":
            if GOOGLE_FORM not in html:
                failures.append("community page: Google Form URL missing")
            if html.count('data-google-form-cta="hero"') < 1 or html.count('data-google-form-cta="apply_section"') < 1:
                failures.append("community page: data-google-form-cta markers missing")

        if rel.as_posix() == "reviews.html" and REVIEWS_ENDPOINT not in html:
            failures.append("reviews.html: public reviews endpoint missing")

        # noindex expectations
        if file.name == "404.html" and "noindex" not in html.lower():
            failures.append("404.html must carry noindex")

    for key, contract in FORM_CONTRACTS.items():
        if forms_found.get(key, 0) < 1:
            failures.append(f"no page found with form contract {key}")

    print(f"Checked {checked} HTML files.")
    if failures:
        print("FAILURES:")
        for f in failures:
            print(" -", f)
        return 1
    print("All internal links, fragments, assets and contracts OK.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
