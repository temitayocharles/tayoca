#!/usr/bin/env bash
set -euo pipefail

ENDPOINT="${ENDPOINT:-https://n8n.tca-infraforge.site/webhook/tayoca/growth/operator-brief}"
SYNTHETIC_EMAIL="${SYNTHETIC_EMAIL:-}"
INTEREST="${INTEREST:-Platform reliability and DevSecOps}"

if [[ -z "$SYNTHETIC_EMAIL" ]]; then
  echo "ERROR: set SYNTHETIC_EMAIL to a controlled mailbox before running." >&2
  exit 2
fi

case "$SYNTHETIC_EMAIL" in
  *@*) ;;
  *) echo "ERROR: SYNTHETIC_EMAIL is not a valid-looking email address." >&2; exit 2 ;;
esac

TMP_DIR="$(mktemp -d)"
trap 'rm -rf "$TMP_DIR"' EXIT

post_request() {
  local output_file="$1"
  curl --fail-with-body --silent --show-error \
    --connect-timeout 10 \
    --max-time 30 \
    --output "$output_file" \
    --write-out '%{http_code}' \
    --request POST "$ENDPOINT" \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data-urlencode "email=$SYNTHETIC_EMAIL" \
    --data-urlencode "interest=$INTEREST" \
    --data-urlencode 'consent=yes' \
    --data-urlencode 'source=lead_magnet' \
    --data-urlencode 'lead_magnet=debugging-ai-generated-devops-scripts' \
    --data-urlencode 'campaign=evergreen-ai-script-debugging' \
    --data-urlencode 'website='
}

printf '== lead magnet intake smoke test ==\n'
printf 'endpoint: %s\n' "$ENDPOINT"
printf 'synthetic identity: %s\n' "$SYNTHETIC_EMAIL"

HTTP_1="$(post_request "$TMP_DIR/first.body")"
printf 'first submission HTTP: %s\n' "$HTTP_1"

sleep 2

HTTP_2="$(post_request "$TMP_DIR/second.body")"
printf 'repeat submission HTTP: %s\n' "$HTTP_2"

if [[ "$HTTP_1" != 2* || "$HTTP_2" != 2* ]]; then
  echo "FAIL: one or more submissions were not accepted." >&2
  echo "First response:" >&2
  cat "$TMP_DIR/first.body" >&2 || true
  echo >&2
  echo "Second response:" >&2
  cat "$TMP_DIR/second.body" >&2 || true
  echo >&2
  exit 1
fi

FIRST_SHA="$(shasum -a 256 "$TMP_DIR/first.body" | awk '{print $1}')"
SECOND_SHA="$(shasum -a 256 "$TMP_DIR/second.body" | awk '{print $1}')"
printf 'first response sha256: %s\n' "$FIRST_SHA"
printf 'second response sha256: %s\n' "$SECOND_SHA"

cat <<'EOF'
HTTP intake smoke passed.

This script intentionally does NOT claim full funnel certification.
The following must still be verified from authoritative runtime/provider state:
  - exactly one subscriber/sequence membership
  - explicit consent + source/campaign metadata persisted
  - Email 0 provider send ID recorded
  - 59-page certified PDF download succeeds
  - repeat request did not duplicate future nurture jobs
  - unsubscribe suppresses a later scheduled send
  - no newsletter-only revenue opportunity was created
EOF
