#!/usr/bin/env python3
"""Create the Phase 4 provenance-safe BlogPosting dateModified remediation branch."""

from __future__ import annotations

import json
import pathlib
import re
import subprocess
from typing import Any

TARGET_BRANCH = "phase4-jsonld-datemodified-remediation"
TARGETS = {
    "public/blog/ai-automation-career-roadmap.html": "2026-09-11",
    "public/blog/gitops-beyond-hello-world.html": "2026-09-11",
    "public/blog/kubernetes-production-checklist.html": "2026-09-11",
}

ORIGINAL_STRUCTURED_WORKFLOW = "\n".join(
    [
        "name: Structured data governance",
        "",
        "on:",
        "  push:",
        "  pull_request:",
        "  workflow_dispatch:",
        "",
        "concurrency:",
        "  group: tayoca-structured-data-governance-${{ forgejo.ref }}",
        "  cancel-in-progress: true",
        "",
        "jobs:",
        "  validate:",
        "    name: Validate structured data governance",
        "    runs-on: forgejo-general",
        "    timeout-minutes: 10",
        "    steps:",
        "      - name: Check out Tayoca",
        "        uses: https://data.forgejo.org/actions/checkout@v6",
        "",
        "      - name: Validate structured data",
        "        shell: bash",
        "        run: |",
        "          set -euo pipefail",
        "          python3 -m py_compile scripts/validate_structured_data_governance.py",
        "          python3 scripts/validate_structured_data_governance.py",
    ]
) + "\n"

CHECKPOINT_NOTE = "\n".join(
    [
        "# Phase 4 JSON-LD dateModified remediation",
        "",
        "This checkpoint records the provenance-safe remediation of the remaining no-date BlogPosting JSON-LD entries.",
        "",
        "## Pages remediated",
        "",
        "- `public/blog/ai-automation-career-roadmap.html`",
        "- `public/blog/gitops-beyond-hello-world.html`",
        "- `public/blog/kubernetes-production-checklist.html`",
        "",
        "Each page received only:",
        "",
        "```json",
        "\"dateModified\":\"2026-09-11\"",
        "```",
        "",
        "The value is based on the tracked v9 editorial migration or rebuild commits recorded in issue #138. No `datePublished` value was added because publication provenance was not separately established.",
        "",
        "## Boundary",
        "",
        "- No visible article body copy was intentionally changed.",
        "- No canonical URL was intentionally changed.",
        "- No Open Graph or Twitter/X metadata was intentionally changed.",
        "- No Product JSON-LD, product price, checkout URL, or offer was changed.",
        "- The corresponding entries were removed from `ARTICLE_JSONLD_DATE_GAP_ALLOWLIST` only after the BlogPosting JSON-LD carried a valid date field.",
        "",
        "## Required validation",
        "",
        "- Tayoca static quality",
        "- Social metadata parity",
        "- Structured-data governance",
    ]
) + "\n"

SCRIPT_RE = re.compile(r'(<script type="application/ld\+json">)(.*?)(</script>)', re.S)
EXPECTED_CHANGED = sorted(
    [
        ".forgejo/workflows/structured-data-governance.yml",
        "docs/TAYOCA_PHASE4_JSONLD_DATEMODIFIED_REMEDIATION_20260916.md",
        "public/blog/ai-automation-career-roadmap.html",
        "public/blog/gitops-beyond-hello-world.html",
        "public/blog/kubernetes-production-checklist.html",
        "scripts/remediate_phase4_jsonld_dates.py",
        "scripts/validate_structured_data_governance.py",
    ]
)


def run(*args: str, check: bool = True) -> subprocess.CompletedProcess[str]:
    return subprocess.run(args, check=check, text=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def remote_branch_exists(branch: str) -> bool:
    result = run("git", "ls-remote", "--exit-code", "origin", f"refs/heads/{branch}", check=False)
    return result.returncode == 0


def find_blogposting(value: Any) -> dict[str, Any] | None:
    if isinstance(value, dict):
        kind = value.get("@type")
        if kind == "BlogPosting" or (isinstance(kind, list) and "BlogPosting" in kind):
            return value
        graph = value.get("@graph")
        if isinstance(graph, list):
            for item in graph:
                found = find_blogposting(item)
                if found is not None:
                    return found
    elif isinstance(value, list):
        for item in value:
            found = find_blogposting(item)
            if found is not None:
                return found
    return None


def patch_blogposting_file(rel: str, date_modified: str) -> None:
    path = pathlib.Path(rel)
    text = path.read_text(encoding="utf-8")
    matches = list(SCRIPT_RE.finditer(text))
    if not matches:
        raise SystemExit(f"{rel}: missing JSON-LD script")

    for match in matches:
        raw = match.group(2)
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            continue

        blog = find_blogposting(data)
        if blog is None:
            continue
        if "datePublished" in blog:
            raise SystemExit(f"{rel}: unexpected datePublished already present")

        existing = blog.get("dateModified")
        if existing not in (None, date_modified):
            raise SystemExit(f"{rel}: unexpected existing dateModified {existing!r}")

        blog["dateModified"] = date_modified
        new_raw = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
        text = text[: match.start(2)] + new_raw + text[match.end(2) :]
        path.write_text(text, encoding="utf-8")
        return

    raise SystemExit(f"{rel}: BlogPosting JSON-LD not found")


def remove_allowlist_entries() -> None:
    validator = pathlib.Path("scripts/validate_structured_data_governance.py")
    validator_text = validator.read_text(encoding="utf-8")
    for rel in TARGETS:
        before = validator_text
        validator_text = "\n".join(line for line in validator_text.splitlines() if rel not in line) + "\n"
        if validator_text == before:
            raise SystemExit(f"{rel}: allowlist line was not removed")
    validator.write_text(validator_text, encoding="utf-8")


def changed_files() -> list[str]:
    diff = run("git", "diff", "--name-only").stdout.splitlines()
    cached = run("git", "diff", "--cached", "--name-only").stdout.splitlines()
    return sorted(set(diff + cached))


def main() -> None:
    if remote_branch_exists(TARGET_BRANCH):
        print(f"Target branch already exists: {TARGET_BRANCH}")
        return

    run("git", "switch", "-C", TARGET_BRANCH)
    run("git", "config", "user.name", "Tayoca Phase 4 Remediator")
    run("git", "config", "user.email", "tayoca-phase4-remediator@users.noreply.forgejo.tayoca.com")

    for rel, date_modified in TARGETS.items():
        patch_blogposting_file(rel, date_modified)

    remove_allowlist_entries()
    pathlib.Path("docs/TAYOCA_PHASE4_JSONLD_DATEMODIFIED_REMEDIATION_20260916.md").write_text(
        CHECKPOINT_NOTE,
        encoding="utf-8",
    )
    pathlib.Path(".forgejo/workflows/structured-data-governance.yml").write_text(
        ORIGINAL_STRUCTURED_WORKFLOW,
        encoding="utf-8",
    )
    pathlib.Path("scripts/remediate_phase4_jsonld_dates.py").unlink()

    run("python3", "-m", "py_compile", "scripts/validate_structured_data_governance.py")
    run("python3", "-m", "py_compile", "scripts/validate_social_metadata_parity.py")
    run("python3", "-m", "py_compile", "scripts/validate_static_site.py")
    run("python3", "scripts/validate_structured_data_governance.py")
    run("python3", "scripts/validate_social_metadata_parity.py")

    actual = changed_files()
    if actual != EXPECTED_CHANGED:
        raise SystemExit(f"Unexpected changed files: {actual!r}")

    run("git", "add", "-A")
    run("git", "commit", "-m", "fix: add provenance-safe BlogPosting dateModified fields")
    run("git", "push", "--quiet", "origin", f"HEAD:refs/heads/{TARGET_BRANCH}")
    print(f"Created {TARGET_BRANCH}")


if __name__ == "__main__":
    main()
