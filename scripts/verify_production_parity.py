#!/usr/bin/env python3
"""Verify that deployed Tayoca HTML exactly matches canonical Forgejo source.

The verifier is intentionally credential-free. It compares every tracked HTML file
under public/ with the corresponding https://tayoca.com/ URL and exits non-zero on
HTTP errors or byte drift. This is suited to scheduled post-deployment checks; it is
not run on pull requests because Vercel propagation can legitimately lag source merges.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path
from urllib.parse import quote

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = REPO_ROOT / "public"


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def fetch(url: str, *, attempts: int, timeout: float) -> tuple[int, bytes]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            request = urllib.request.Request(
                url,
                headers={
                    "User-Agent": "Tayoca-Forgejo-Deployment-Parity/1.0",
                    "Cache-Control": "no-cache",
                },
            )
            with urllib.request.urlopen(request, timeout=timeout) as response:
                return response.status, response.read()
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = exc
            if attempt < attempts:
                time.sleep(min(2 * attempt, 6))
    raise RuntimeError(f"failed to fetch {url}: {last_error}")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default="https://tayoca.com/")
    parser.add_argument("--attempts", type=int, default=3)
    parser.add_argument("--timeout", type=float, default=20.0)
    parser.add_argument("--json-output")
    args = parser.parse_args()

    if not args.base_url.endswith("/"):
        args.base_url += "/"

    files = sorted(PUBLIC_ROOT.rglob("*.html"))
    if not files:
        print("No public HTML files found", file=sys.stderr)
        return 2

    results: list[dict[str, object]] = []
    failed = False

    for path in files:
        relative = path.relative_to(PUBLIC_ROOT).as_posix()
        url = args.base_url + "/".join(quote(part) for part in relative.split("/"))
        expected = path.read_bytes()
        try:
            status, deployed = fetch(url, attempts=args.attempts, timeout=args.timeout)
            matches = status == 200 and deployed == expected
            result = {
                "path": relative,
                "url": url,
                "http_status": status,
                "expected_bytes": len(expected),
                "deployed_bytes": len(deployed),
                "expected_sha256": sha256(expected),
                "deployed_sha256": sha256(deployed),
                "match": matches,
            }
        except Exception as exc:  # emit a complete audit row before failing
            result = {
                "path": relative,
                "url": url,
                "match": False,
                "error": str(exc),
            }
            matches = False

        results.append(result)
        failed = failed or not matches
        state = "MATCH" if matches else "DRIFT"
        print(f"{state} {relative}")

    summary = {
        "base_url": args.base_url,
        "checked": len(results),
        "matched": sum(1 for row in results if row.get("match") is True),
        "failed": sum(1 for row in results if row.get("match") is not True),
        "results": results,
    }

    if args.json_output:
        output = Path(args.json_output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(json.dumps({key: summary[key] for key in ("checked", "matched", "failed")}))
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
