#!/usr/bin/env python3
"""Reconcile Tayoca's GitHub deployment mirror from canonical Forgejo bytes.

Only the Vercel deployment surface is in scope: public/** and vercel.json.
The script never reads credentials and never invokes provider APIs.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import sys
from pathlib import Path


def git_blob_sha(data: bytes) -> str:
    header = f"blob {len(data)}\0".encode("ascii")
    return hashlib.sha1(header + data).hexdigest()


def selected_files(root: Path) -> dict[str, str]:
    root = root.resolve()
    public = root / "public"
    vercel = root / "vercel.json"
    if not public.is_dir():
        raise SystemExit(f"missing required deployment directory: {public}")
    if public.is_symlink():
        raise SystemExit("refusing symlinked public directory")
    if not vercel.is_file() or vercel.is_symlink():
        raise SystemExit(f"missing or unsafe required deployment file: {vercel}")

    manifest: dict[str, str] = {}
    for path in sorted(public.rglob("*")):
        if path.is_symlink():
            raise SystemExit(f"refusing symlink inside deployment tree: {path}")
        if not path.is_file():
            continue
        rel = path.relative_to(root).as_posix()
        manifest[rel] = git_blob_sha(path.read_bytes())
    manifest["vercel.json"] = git_blob_sha(vercel.read_bytes())
    return manifest


def diff_manifests(canonical: dict[str, str], mirror: dict[str, str]) -> dict[str, list[str]]:
    cpaths = set(canonical)
    mpaths = set(mirror)
    return {
        "missing": sorted(cpaths - mpaths),
        "extra": sorted(mpaths - cpaths),
        "mismatched": sorted(p for p in cpaths & mpaths if canonical[p] != mirror[p]),
    }


def summarize(canonical: dict[str, str], mirror: dict[str, str]) -> dict[str, object]:
    diff = diff_manifests(canonical, mirror)
    changed = diff["missing"] + diff["extra"] + diff["mismatched"]
    return {
        "canonical_files": len(canonical),
        "mirror_files": len(mirror),
        "equal": not changed,
        "missing_count": len(diff["missing"]),
        "extra_count": len(diff["extra"]),
        "mismatched_count": len(diff["mismatched"]),
        "changed_paths": changed[:100],
        "changed_paths_truncated": len(changed) > 100,
    }


def sync_tree(canonical_root: Path, mirror_root: Path) -> None:
    canonical_root = canonical_root.resolve()
    mirror_root = mirror_root.resolve()
    if canonical_root == mirror_root:
        raise SystemExit("canonical and mirror roots must differ")

    source_public = canonical_root / "public"
    target_public = mirror_root / "public"
    if target_public.exists() or target_public.is_symlink():
        if target_public.is_symlink():
            raise SystemExit("refusing to replace symlinked mirror public directory")
        shutil.rmtree(target_public)
    shutil.copytree(source_public, target_public, copy_function=shutil.copy2)
    shutil.copy2(canonical_root / "vercel.json", mirror_root / "vercel.json")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--canonical-root", required=True, type=Path)
    parser.add_argument("--mirror-root", required=True, type=Path)
    parser.add_argument("--mode", choices=("check", "sync"), default="check")
    args = parser.parse_args()

    canonical = selected_files(args.canonical_root)
    try:
        mirror = selected_files(args.mirror_root)
    except SystemExit:
        if args.mode == "check":
            raise
        mirror = {}

    before = summarize(canonical, mirror)
    if args.mode == "sync" and not before["equal"]:
        sync_tree(args.canonical_root, args.mirror_root)
        mirror_after = selected_files(args.mirror_root)
        after = summarize(canonical, mirror_after)
        print(json.dumps({"before": before, "after": after}, sort_keys=True))
        return 0 if after["equal"] else 2

    print(json.dumps(before, sort_keys=True))
    return 0 if before["equal"] else 1


if __name__ == "__main__":
    sys.exit(main())
