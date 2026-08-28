#!/usr/bin/env python3
"""Fail-closed editorial hook/body repetition validator.

This validator intentionally checks wording quality only. It does not weaken Tayoca's
fact/evidence, disclosure, approval, or publication boundaries.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Iterable

TOKEN_RE = re.compile(r"[a-z0-9]+(?:'[a-z0-9]+)?", re.I)
SENTENCE_RE = re.compile(r"(?<=[.!?])\s+|\n+")
DEFAULT_THRESHOLD = 0.82
DEFAULT_NGRAM = 5


def tokens(text: str) -> list[str]:
    return [m.group(0).lower() for m in TOKEN_RE.finditer(text or "")]


def normalized(text: str) -> str:
    return " ".join(tokens(text))


def sentences(text: str) -> list[str]:
    return [part.strip() for part in SENTENCE_RE.split(text or "") if part.strip()]


def dice_similarity(a: str, b: str) -> float:
    left, right = set(tokens(a)), set(tokens(b))
    if not left or not right:
        return 0.0
    return 2.0 * len(left & right) / (len(left) + len(right))


def ngrams(words: list[str], size: int) -> set[tuple[str, ...]]:
    if len(words) < size:
        return set()
    return {tuple(words[i : i + size]) for i in range(len(words) - size + 1)}


def quality_issues(
    hook: str,
    body: str,
    *,
    threshold: float = DEFAULT_THRESHOLD,
    ngram_size: int = DEFAULT_NGRAM,
) -> list[str]:
    issues: list[str] = []
    hook_norm, body_norm = normalized(hook), normalized(body)
    if not hook_norm or not body_norm:
        issues.append("hook_or_body_empty")
        return issues

    if hook_norm == body_norm or hook_norm in body_norm:
        issues.append("normalized_hook_repeated_in_body")

    hook_sentences = sentences(hook)
    body_sentences = sentences(body)
    for hs in hook_sentences:
        for bs in body_sentences:
            if normalized(hs) == normalized(bs):
                issues.append("exact_duplicate_sentence")
                break
            if dice_similarity(hs, bs) >= threshold:
                issues.append("near_duplicate_sentence")
                break

    shared = ngrams(tokens(hook), ngram_size) & ngrams(tokens(body), ngram_size)
    if shared:
        phrase = " ".join(sorted(shared)[0])
        issues.append(f"repeated_{ngram_size}_token_phrase:{phrase}")

    # Stable ordering and no duplicate issue labels.
    return list(dict.fromkeys(issues))


def assert_fixture(path: Path) -> None:
    fixture = json.loads(path.read_text(encoding="utf-8"))
    if fixture["published_asset_boundary"]["mutation_allowed"] is not False:
        raise AssertionError("W9 regression fixture must preserve immutable published-asset boundary")

    legacy = fixture["legacy_assembly"]
    legacy_issues = quality_issues(legacy["hook"], legacy["body"])
    if legacy["expected_quality_result"] != "blocked" or not legacy_issues:
        raise AssertionError(f"legacy repetitive copy was not blocked: {legacy_issues}")

    safe = fixture["safe_future_assembly"]
    safe_issues = quality_issues(safe["hook"], safe["body"])
    if safe["expected_quality_result"] != "pass" or safe_issues:
        raise AssertionError(f"safe future copy was unexpectedly blocked: {safe_issues}")

    print("editorial copy quality fixture: PASS")
    print("legacy issues:", ", ".join(legacy_issues))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--hook")
    parser.add_argument("--body")
    parser.add_argument(
        "--fixture",
        default="automation/n8n/fixtures/editorial-copy-repetition-w9.json",
    )
    args = parser.parse_args()

    if (args.hook is None) != (args.body is None):
        parser.error("--hook and --body must be provided together")

    if args.hook is not None:
        issues = quality_issues(args.hook, args.body)
        if issues:
            print(json.dumps({"result": "blocked", "issues": issues}, sort_keys=True))
            return 1
        print(json.dumps({"result": "pass", "issues": []}, sort_keys=True))
        return 0

    assert_fixture(Path(args.fixture))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
