#!/usr/bin/env python3
"""Create a bounded Phase 4 remediation branch for cloud-cost BlogPosting JSON-LD."""

from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path
from typing import Any

TARGET_BRANCH = "phase4-cloud-cost-blogposting-jsonld"
DATE_MODIFIED = "2026-09-11"
HTML_PATH = Path("public/blog/cloud-cost-optimization-playbook.html")
VALIDATOR_PATH = Path("scripts/validate_structured_data_governance.py")
WORKFLOW_PATH = Path(".forgejo/workflows/phase4-cloud-cost-blogposting-carrier.yml")
SCRIPT_PATH = Path("scripts/remediate_cloud_cost_blogposting_jsonld.py")
NOTE_PATH = Path("docs/TAYOCA_PHASE4_CLOUD_COST_BLOGPOSTING_JSONLD_20260918.md")

BLOGPOSTING = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": "AWS Cloud Cost Optimization Playbook | Tayoca",
    "description": "A practical evidence-first FinOps playbook for finding AWS cost drivers, validating optimization hypotheses, assigning ownership and measuring realized savings safely.",
    "url": "https://tayoca.com/blog/cloud-cost-optimization-playbook.html",
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": "https://tayoca.com/blog/cloud-cost-optimization-playbook.html",
    },
    "author": {
        "@type": "Person",
        "name": "Temitayo Charles Akinniranye",
    },
    "publisher": {
        "@type": "Organization",
        "name": "Tayoca",
        "url": "https://tayoca.com/",
    },
    "image": ["https://tayoca.com/cover_aws-cost-optimization.png"],
    "dateModified": DATE_MODIFIED,
}


def run(args: list[str], check: bool = True) -> subprocess.CompletedProcess[str]:
    result = subprocess.run(args, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    if check and result.returncode != 0:
        sys.stderr.write("Command failed: " + " ".join(args) + "\n")
        sys.stderr.write(result.stdout)
        sys.stderr.write(result.stderr)
        raise SystemExit(result.returncode)
    return result


def remote_branch_exists(branch: str) -> bool:
    result = run(["git", "ls-remote", "--exit-code", "origin", f"refs/heads/{branch}"], check=False)
    return result.returncode == 0


def patch_html() -> None:
    raw = HTML_PATH.read_text(encoding="utf-8")
    if "application/ld+json" in raw:
        raise SystemExit(f"{HTML_PATH}: JSON-LD already present")
    if BLOGPOSTING["url"] not in raw:
        raise SystemExit(f"{HTML_PATH}: expected canonical URL not found")
    if BLOGPOSTING["image"][0] not in raw:
        raise SystemExit(f"{HTML_PATH}: expected social image not found")

    script = '<script type="application/ld+json">' + json.dumps(BLOGPOSTING, ensure_ascii=False, separators=(",", ":")) + "</script>"
    marker = '<link rel="stylesheet" href="/assets/css/site-shell.css">'
    if marker not in raw:
        raise SystemExit(f"{HTML_PATH}: stylesheet marker not found")
    patched = raw.replace(marker, script + marker, 1)
    if patched.count('type="application/ld+json"') != 1:
        raise SystemExit(f"{HTML_PATH}: JSON-LD insertion count mismatch")
    HTML_PATH.write_text(patched, encoding="utf-8")


def patch_validator() -> None:
    raw = VALIDATOR_PATH.read_text(encoding="utf-8")
    needle = '    "public/blog/cloud-cost-optimization-playbook.html": "known Phase 4 remediation candidate; add BlogPosting JSON-LD only when date/content provenance is explicit",\n'
    if needle not in raw:
        raise SystemExit(f"{VALIDATOR_PATH}: expected missing allowlist entry not found")
    VALIDATOR_PATH.write_text(raw.replace(needle, "", 1), encoding="utf-8")


def write_note() -> None:
    NOTE_PATH.write_text(
        "# Phase 4 cloud-cost BlogPosting JSON-LD remediation\n\n"
        "This checkpoint records the provenance-safe remediation of the remaining missing BlogPosting JSON-LD entry.\n\n"
        "## Page remediated\n\n"
        "- `public/blog/cloud-cost-optimization-playbook.html`\n\n"
        "## Provenance\n\n"
        "- `6aced8396809c222f3614e2ad04905cc82f93b28` replaced the unsupported FinOps outcome narrative with an evidence-safe playbook on 2026-08-09.\n"
        "- `e2c5f9f4c888800be4cb0bf58705d111a8a96f92` migrated the cloud-cost article to the v9 editorial system on 2026-09-11.\n\n"
        "## Structured data boundary\n\n"
        "The page receives a `BlogPosting` JSON-LD node with `dateModified: 2026-09-11`. No `datePublished` value is added because separate publication provenance is not encoded.\n\n"
        "No visible article copy, canonical URL, Open Graph metadata, Twitter/X metadata, product metadata, product price, checkout URL or Product offer is intentionally changed by this remediation.\n",
        encoding="utf-8",
    )


def restore_structured_workflow() -> None:
    workflow = """name: Structured data governance

on:
  push:
  pull_request:
  workflow_dispatch:

concurrency:
  group: tayoca-structured-data-governance-${{ forgejo.ref }}
  cancel-in-progress: true

jobs:
  validate:
    name: Validate structured data governance
    runs-on: forgejo-general
    timeout-minutes: 10
    steps:
      - name: Check out Tayoca
        uses: https://data.forgejo.org/actions/checkout@v6

      - name: Validate structured data
        shell: bash
        run: |
          set -euo pipefail
          python3 -m py_compile scripts/validate_structured_data_governance.py
          python3 scripts/validate_structured_data_governance.py
"""
    Path(".forgejo/workflows/structured-data-governance.yml").write_text(workflow, encoding="utf-8")


def main() -> None:
    if remote_branch_exists(TARGET_BRANCH):
        raise SystemExit(f"Target branch already exists: {TARGET_BRANCH}")

    run(["git", "checkout", "-B", TARGET_BRANCH])
    run(["git", "config", "user.name", "Tayoca Phase 4 Remediator"])
    run(["git", "config", "user.email", "tayoca-phase4-remediator@users.noreply.forgejo.tayoca.com"])

    patch_html()
    patch_validator()
    write_note()
    restore_structured_workflow()
    if WORKFLOW_PATH.exists():
        WORKFLOW_PATH.unlink()
    if SCRIPT_PATH.exists():
        SCRIPT_PATH.unlink()

    run(["git", "add", "-A"])
    status = run(["git", "status", "--short"]).stdout
    print(status)
    run(["git", "commit", "-m", "fix: add cloud-cost BlogPosting JSON-LD"])
    run(["git", "push", "--quiet", "origin", f"HEAD:refs/heads/{TARGET_BRANCH}"])
    print(f"Created {TARGET_BRANCH}")


if __name__ == "__main__":
    main()
