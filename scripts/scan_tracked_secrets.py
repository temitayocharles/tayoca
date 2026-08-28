#!/usr/bin/env python3
"""Fail closed on high-confidence tracked secret material without printing values."""

from __future__ import annotations

import re
import subprocess
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
MAX_TEXT_BYTES = 2 * 1024 * 1024
MAX_ARCHIVE_MEMBER_BYTES = 2 * 1024 * 1024

FORBIDDEN_EXACT = {
    ".env",
    ".env.local",
    ".env.development",
    ".env.production",
    ".env.staging",
    ".env.test",
    "credentials.json",
    "service-account.json",
    "service_account.json",
    "id_rsa",
    "id_ed25519",
}
FORBIDDEN_SUFFIXES = {".pem", ".key", ".p12", ".pfx"}
ALLOWED_SECRET_LIKE_FILES = {".env.example"}

PLACEHOLDER_MARKERS = (
    "example",
    "placeholder",
    "changeme",
    "change-me",
    "replace-me",
    "replace_me",
    "redacted",
    "your-",
    "your_",
    "${",
    "process.env",
    "deno.env",
    "$env",
    "{{",
    "<secret>",
    "<token>",
    "<password>",
    "<api-key>",
)

PATTERNS: tuple[tuple[str, re.Pattern[str]], ...] = (
    ("private-key", re.compile(r"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----")),
    ("aws-access-key", re.compile(r"\b(?:AKIA|ASIA)[0-9A-Z]{16}\b")),
    ("github-token", re.compile(r"\bgh[pousr]_[A-Za-z0-9]{30,}\b")),
    ("github-fine-grained-token", re.compile(r"\bgithub_pat_[A-Za-z0-9_]{40,}\b")),
    ("slack-token", re.compile(r"\bxox[baprs]-[A-Za-z0-9-]{20,}\b")),
    ("stripe-live-secret", re.compile(r"\b(?:sk|rk)_live_[A-Za-z0-9]{16,}\b")),
    ("google-api-key", re.compile(r"\bAIza[0-9A-Za-z_-]{30,}\b")),
    ("openai-style-key", re.compile(r"\bsk-(?:proj-)?[A-Za-z0-9_-]{20,}\b")),
    ("bearer-token", re.compile(r"(?i)\bBearer\s+[A-Za-z0-9._~+/-]{24,}={0,2}\b")),
)

ASSIGNMENT = re.compile(
    r"(?i)\b(?:api[_-]?key|access[_-]?token|auth[_-]?token|password|client[_-]?secret|app[_-]?secret|private[_-]?key)\b"
    r"\s*[:=]\s*[\"']?([^\"'\s,#}]{12,})"
)


def tracked_files() -> list[str]:
    result = subprocess.run(
        ["git", "ls-files", "-z"], cwd=ROOT, check=True, capture_output=True
    )
    return [item.decode("utf-8") for item in result.stdout.split(b"\0") if item]


def forbidden_name(path: PurePosixPath) -> bool:
    name = path.name.lower()
    if name in ALLOWED_SECRET_LIKE_FILES:
        return False
    if name in FORBIDDEN_EXACT:
        return True
    if name.startswith(".env."):
        return True
    return any(name.endswith(suffix) for suffix in FORBIDDEN_SUFFIXES)


def looks_placeholder(value: str) -> bool:
    lowered = value.lower()
    return any(marker in lowered for marker in PLACEHOLDER_MARKERS)


def scan_text(label: str, data: bytes) -> list[tuple[str, int, str]]:
    if len(data) > MAX_TEXT_BYTES or b"\0" in data:
        return []
    try:
        text = data.decode("utf-8")
    except UnicodeDecodeError:
        return []

    findings: list[tuple[str, int, str]] = []
    for line_no, line in enumerate(text.splitlines(), start=1):
        for rule, pattern in PATTERNS:
            for match in pattern.finditer(line):
                if not looks_placeholder(match.group(0)):
                    findings.append((label, line_no, rule))
        for match in ASSIGNMENT.finditer(line):
            if not looks_placeholder(match.group(1)):
                findings.append((label, line_no, "secret-assignment"))
    return findings


def scan_zip(path: Path, rel: str) -> list[tuple[str, int, str]]:
    findings: list[tuple[str, int, str]] = []
    try:
        with zipfile.ZipFile(path) as archive:
            for info in archive.infolist():
                member = PurePosixPath(info.filename)
                label = f"{rel}!{info.filename}"
                if info.is_dir():
                    continue
                if forbidden_name(member):
                    findings.append((label, 0, "forbidden-secret-filename-in-archive"))
                    continue
                if info.file_size > MAX_ARCHIVE_MEMBER_BYTES:
                    continue
                try:
                    findings.extend(scan_text(label, archive.read(info)))
                except (RuntimeError, zipfile.BadZipFile):
                    findings.append((label, 0, "unreadable-archive-member"))
    except zipfile.BadZipFile:
        findings.append((rel, 0, "invalid-zip-archive"))
    return findings


def main() -> int:
    findings: list[tuple[str, int, str]] = []
    for rel in tracked_files():
        posix = PurePosixPath(rel)
        if forbidden_name(posix):
            findings.append((rel, 0, "forbidden-secret-filename"))
            continue
        path = ROOT / rel
        if path.suffix.lower() == ".zip":
            findings.extend(scan_zip(path, rel))
            continue
        try:
            findings.extend(scan_text(rel, path.read_bytes()))
        except OSError:
            findings.append((rel, 0, "unreadable-tracked-file"))

    unique = sorted(set(findings))
    if unique:
        print(f"Tracked-secret gate failed: {len(unique)} finding(s).")
        for label, line, rule in unique:
            location = f"{label}:{line}" if line else label
            print(f"- {location} [{rule}]")
        print("Matched values are intentionally suppressed.")
        return 1

    print("Tracked-secret gate passed: no high-confidence tracked secret material found.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
