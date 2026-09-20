#!/usr/bin/env python3
"""Verify that deployed Tayoca content matches canonical Forgejo source.

Ordinary tracked HTML under public/ must match the deployed response byte-for-byte.
HTML routes explicitly declared as redirects in vercel.json are instead validated as
redirect contracts: the deployed response must be a permanent redirect to the declared
destination. This keeps the check strict without treating intentional routing as drift.
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
from urllib.parse import quote, urljoin, urlparse

REPO_ROOT = Path(__file__).resolve().parents[1]
PUBLIC_ROOT = REPO_ROOT / "public"
VERCEL_CONFIG = REPO_ROOT / "vercel.json"
PERMANENT_REDIRECT_CODES = {301, 308}


def sha256(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def request_for(url: str) -> urllib.request.Request:
    return urllib.request.Request(
        url,
        headers={
            "User-Agent": "Tayoca-Forgejo-Deployment-Parity/1.1",
            "Cache-Control": "no-cache",
        },
    )


def fetch(url: str, *, attempts: int, timeout: float) -> tuple[int, bytes]:
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request_for(url), timeout=timeout) as response:
                return response.status, response.read()
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = exc
            if attempt < attempts:
                time.sleep(min(2 * attempt, 6))
    raise RuntimeError(f"failed to fetch {url}: {last_error}")


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):  # noqa: ANN001
        return None


def fetch_redirect(url: str, *, attempts: int, timeout: float) -> tuple[int, str]:
    opener = urllib.request.build_opener(NoRedirect)
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            with opener.open(request_for(url), timeout=timeout) as response:
                return response.status, response.headers.get("Location", "")
        except urllib.error.HTTPError as exc:
            if exc.code in PERMANENT_REDIRECT_CODES:
                return exc.code, exc.headers.get("Location", "")
            last_error = exc
        except (urllib.error.URLError, TimeoutError, OSError) as exc:
            last_error = exc
        if attempt < attempts:
            time.sleep(min(2 * attempt, 6))
    raise RuntimeError(f"failed to fetch redirect contract {url}: {last_error}")


def load_redirects() -> dict[str, dict[str, object]]:
    if not VERCEL_CONFIG.is_file():
        return {}
    data = json.loads(VERCEL_CONFIG.read_text(encoding="utf-8"))
    redirects: dict[str, dict[str, object]] = {}
    for row in data.get("redirects", []):
        source = row.get("source")
        destination = row.get("destination")
        if not isinstance(source, str) or not isinstance(destination, str):
            continue
        redirects[source] = {
            "destination": destination,
            "permanent": row.get("permanent") is True,
        }
    return redirects


def normalized_location(base_url: str, location: str) -> str:
    resolved = urljoin(base_url, location)
    parsed = urlparse(resolved)
    value = parsed.path or "/"
    if parsed.query:
        value += "?" + parsed.query
    return value


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

    redirects = load_redirects()
    results: list[dict[str, object]] = []
    failed = False

    checked_routes: set[str] = set()

    for path in files:
        relative = path.relative_to(PUBLIC_ROOT).as_posix()
        route = "/" + relative
        checked_routes.add(route)
        url = args.base_url + "/".join(quote(part) for part in relative.split("/"))
        redirect = redirects.get(route)

        if redirect is not None:
            expected_destination = str(redirect["destination"])
            try:
                status, location = fetch_redirect(
                    url, attempts=args.attempts, timeout=args.timeout
                )
                deployed_destination = normalized_location(args.base_url, location)
                expected_permanent = bool(redirect.get("permanent"))
                status_ok = (
                    status in PERMANENT_REDIRECT_CODES
                    if expected_permanent
                    else 300 <= status < 400
                )
                matches = status_ok and deployed_destination == expected_destination
                result = {
                    "path": relative,
                    "url": url,
                    "mode": "redirect_contract",
                    "http_status": status,
                    "expected_destination": expected_destination,
                    "deployed_location": location,
                    "deployed_destination": deployed_destination,
                    "permanent": expected_permanent,
                    "match": matches,
                }
            except Exception as exc:
                result = {
                    "path": relative,
                    "url": url,
                    "mode": "redirect_contract",
                    "expected_destination": expected_destination,
                    "match": False,
                    "error": str(exc),
                }
                matches = False
        else:
            expected = path.read_bytes()
            try:
                status, deployed = fetch(
                    url, attempts=args.attempts, timeout=args.timeout
                )
                matches = status == 200 and deployed == expected
                result = {
                    "path": relative,
                    "url": url,
                    "mode": "byte_parity",
                    "http_status": status,
                    "expected_bytes": len(expected),
                    "deployed_bytes": len(deployed),
                    "expected_sha256": sha256(expected),
                    "deployed_sha256": sha256(deployed),
                    "match": matches,
                }
            except Exception as exc:
                result = {
                    "path": relative,
                    "url": url,
                    "mode": "byte_parity",
                    "match": False,
                    "error": str(exc),
                }
                matches = False

        results.append(result)
        failed = failed or not matches
        state = "MATCH" if matches else "DRIFT"
        print(f"{state} {relative} [{result['mode']}]")

    # Validate explicit redirect aliases that are not backed by a tracked HTML file.
    # This catches routing defects such as /blog -> /blog/ loops that byte-parity
    # checks cannot see because there is no public/blog.html file at that route.
    for route, redirect in sorted(redirects.items()):
        if route in checked_routes:
            continue
        if any(token in route for token in ("*", ":", "(", ")")):
            continue
        expected_destination = str(redirect["destination"])
        url = urljoin(args.base_url, route.lstrip("/"))
        try:
            status, location = fetch_redirect(
                url, attempts=args.attempts, timeout=args.timeout
            )
            deployed_destination = normalized_location(args.base_url, location)
            expected_permanent = bool(redirect.get("permanent"))
            status_ok = (
                status in PERMANENT_REDIRECT_CODES
                if expected_permanent
                else 300 <= status < 400
            )
            matches = status_ok and deployed_destination == expected_destination
            result = {
                "path": route,
                "url": url,
                "mode": "redirect_alias_contract",
                "http_status": status,
                "expected_destination": expected_destination,
                "deployed_location": location,
                "deployed_destination": deployed_destination,
                "permanent": expected_permanent,
                "match": matches,
            }
        except Exception as exc:
            result = {
                "path": route,
                "url": url,
                "mode": "redirect_alias_contract",
                "expected_destination": expected_destination,
                "match": False,
                "error": str(exc),
            }
            matches = False

        results.append(result)
        failed = failed or not matches
        state = "MATCH" if matches else "DRIFT"
        print(f"{state} {route} [{result['mode']}]")

    summary = {
        "base_url": args.base_url,
        "checked": len(results),
        "matched": sum(1 for row in results if row.get("match") is True),
        "failed": sum(1 for row in results if row.get("match") is not True),
        "redirect_contracts": sum(
            1 for row in results if row.get("mode") == "redirect_contract"
        ),
        "results": results,
    }

    if args.json_output:
        output = Path(args.json_output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")

    print(
        json.dumps(
            {
                key: summary[key]
                for key in ("checked", "matched", "failed", "redirect_contracts")
            }
        )
    )
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
