#!/usr/bin/env python3
"""Validate the Tayoca company-level ecosystem registry.

The registry is additive to the locked Stage 10 commercial catalogue
(public/data/product-ecosystem.json). It models the company as one platform:
identity, practices, services, portfolio, publications, editorial, newsletter,
community and evidence surfaces — and it separates existence, ownership
confidence, disclosure permission, public classification and publication
status so unresolved projects are recorded rather than published or lost.

Guarantees enforced here:
  - every public surface referenced by the registry resolves to a real file;
  - portfolio and related-ecosystem items carry the full classification tuple;
  - no unresolved third-party/community item is marked as published on the site;
  - withdrawn proof narratives are never cited as portfolio evidence;
  - the workflow registry is described only as a declared snapshot;
  - the Control Center security remediation is never described as complete.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REGISTRY = PUBLIC / "data" / "company-ecosystem.json"

ALLOWED_KINDS = {
    "owned_product",
    "venture_build",
    "client_build",
    "community_initiative",
    "publication",
    "experiment",
    "internal_system",
}
ALLOWED_EXISTENCE = {"verified", "verified_as_placeholder", "reported", "unconfirmed"}
ALLOWED_CONFIDENCE = {"confirmed", "probable", "unconfirmed"}
ALLOWED_RELATIONSHIP = {
    "owned",
    "built_by_tayoca",
    "advised",
    "contributed",
    "collaborated",
    "internal",
    "internal_or_infrastructure",
    "unrelated_pending_confirmation",
}
ALLOWED_DISCLOSURE = {"granted", "not_granted", "unresolved", "not_required"}
ALLOWED_CLASSIFICATION = {
    "owned_product",
    "venture_build",
    "publication",
    "community_initiative",
    "internal_system",
    "experiment",
    "third_party",
    "unclassified",
}
ALLOWED_PUBLICATION_STATUS = {
    "published",
    "published_neutral",
    "published_descriptive_only",
    "staged",
    "recorded_not_published",
    "withdrawn",
}
ALLOWED_STATUSES = {
    "active",
    "in_market",
    "open_intake",
    "published",
    "staged",
    "closed",
}
REQUIRED_CLASSIFICATION_FIELDS = (
    "existence",
    "technical_nature",
    "owner_relationship_confidence",
    "tayoca_relationship",
    "disclosure_permission",
    "public_classification",
    "publication_status",
    "recommended_destination_if_approved",
)
# Items that may legitimately appear on the public site.
PUBLISHABLE_STATUSES = {"published", "published_neutral", "published_descriptive_only"}
# Non-written evidence is acceptable for canonical-internal items.
FILE_BEARING_PREFIXES = ("/", "public/", "docs/", "automation/", "editorial/", "product-ecosystem.json")


def fail(message: str) -> None:
    raise SystemExit(f"Company ecosystem validation FAILED: {message}")


def require_text(value: object, where: str) -> str:
    if not isinstance(value, str) or not value.strip():
        fail(f"{where} must be a non-empty string")
    return value.strip()


def resolve_public(path: str, where: str) -> None:
    if not path.startswith("/"):
        fail(f"{where}: surface must be an absolute site path: {path}")
    relative = path.lstrip("/")
    if relative.endswith("/") or relative == "community/websites":
        relative = relative.rstrip("/") + "/index.html"
    elif not Path(relative).suffix and "." not in Path(relative).name:
        relative = relative + ".html"
    if not (PUBLIC / relative).is_file():
        fail(f"{where}: surface does not resolve to a public file: {path}")


def resolve_evidence(ref: str, where: str) -> None:
    """Evidence may be a public site path, a tracked repository path, or an https URL."""
    if ref.startswith("https://"):
        return
    if ref.startswith(FILE_BEARING_PREFIXES):
        if ref.startswith("/"):
            resolve_public(ref, where)
            return
        # A trailing "#anchor" points inside a registry rather than at its own file.
        repo_path = ref.split("#", 1)[0]
        if (ROOT / repo_path).exists():
            return
        fail(f"{where}: repository evidence path does not exist: {ref}")
        return
    fail(f"{where}: unsupported evidence reference: {ref}")


def validate_classification(item: dict, where: str) -> None:
    for field in REQUIRED_CLASSIFICATION_FIELDS:
        require_text(item.get(field), f"{where}.{field}")
    if item["existence"] not in ALLOWED_EXISTENCE:
        fail(f"{where}.existence is not allowed: {item['existence']}")
    if item["owner_relationship_confidence"] not in ALLOWED_CONFIDENCE:
        fail(f"{where}.owner_relationship_confidence is not allowed: {item['owner_relationship_confidence']}")
    if item["tayoca_relationship"] not in ALLOWED_RELATIONSHIP:
        fail(f"{where}.tayoca_relationship is not allowed: {item['tayoca_relationship']}")
    if item["disclosure_permission"] not in ALLOWED_DISCLOSURE:
        fail(f"{where}.disclosure_permission is not allowed: {item['disclosure_permission']}")
    if item["public_classification"] not in ALLOWED_CLASSIFICATION:
        fail(f"{where}.public_classification is not allowed: {item['public_classification']}")
    if item["publication_status"] not in ALLOWED_PUBLICATION_STATUS:
        fail(f"{where}.publication_status is not allowed: {item['publication_status']}")

    # Disclosure firewall: an item without granted permission must not be published.
    if item["disclosure_permission"] == "unresolved" and item["publication_status"] in {
        "published",
        "published_neutral",
    }:
        if item.get("public_classification") != "venture_build":
            fail(
                f"{where}: disclosure permission is unresolved but publication_status is "
                f"{item['publication_status']!r}"
            )
    if item["disclosure_permission"] == "not_granted" and item["publication_status"] != "recorded_not_published":
        fail(f"{where}: disclosure not granted but publication_status is {item['publication_status']!r}")
    if item["disclosure_permission"] == "unresolved" and item["publication_status"] == "published":
        fail(f"{where}: unresolved disclosure may not carry the plain 'published' status")

    # Internal systems may be described for context but never showcased as products.
    if item["public_classification"] == "internal_system" and item["publication_status"] == "published":
        fail(f"{where}: internal systems must not carry the plain 'published' status")


def main() -> int:
    if not REGISTRY.is_file():
        fail(f"missing registry {REGISTRY.relative_to(ROOT)}")
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    if data.get("schema_version") != 2:
        fail("schema_version must equal 2")

    company = data.get("company")
    if not isinstance(company, dict):
        fail("company must be an object")
    require_text(company.get("name"), "company.name")
    require_text(company.get("positioning"), "company.positioning")
    founder = company.get("founder")
    if not isinstance(founder, dict):
        fail("company.founder must be an object")
    if require_text(founder.get("public_name"), "company.founder.public_name") != "Temitayo Charles":
        fail("company.founder.public_name must be the public founder identity: Temitayo Charles")

    practices = data.get("practices")
    if not isinstance(practices, list) or len(practices) != 3:
        fail("practices must contain exactly the three practice areas")
    for practice in practices:
        practice_id = require_text(practice.get("id"), "practice.id")
        require_text(practice.get("name"), f"practice {practice_id}.name")
        resolve_public(require_text(practice.get("surface"), f"practice {practice_id}.surface"), f"practice {practice_id}")

    for service in data.get("services", []):
        service_id = require_text(service.get("id"), "service.id")
        require_text(service.get("name"), f"service {service_id}.name")
        resolve_public(require_text(service.get("surface"), f"service {service_id}.surface"), f"service {service_id}")

    for segment in data.get("segments", []):
        segment_id = require_text(segment.get("id"), "segment.id")
        resolve_public(require_text(segment.get("surface"), f"segment {segment_id}.surface"), f"segment {segment_id}")

    portfolio_ids: set[str] = set()
    for item in data.get("portfolio", []):
        item_id = require_text(item.get("id"), "portfolio.id")
        if item_id in portfolio_ids:
            fail(f"duplicate portfolio id: {item_id}")
        portfolio_ids.add(item_id)
        kind = require_text(item.get("kind"), f"portfolio.{item_id}.kind")
        if kind not in ALLOWED_KINDS:
            fail(f"portfolio.{item_id}.kind is not an allowed kind: {kind}")
        status = require_text(item.get("status"), f"portfolio.{item_id}.status")
        if status not in ALLOWED_STATUSES and item_id not in {"tayoca-control-center", "tayoca-control-plane"}:
            fail(f"portfolio.{item_id}.status is not allowed: {status}")
        require_text(item.get("summary"), f"portfolio.{item_id}.summary")
        validate_classification(item, f"portfolio.{item_id}")
        surface = require_text(item.get("surface"), f"portfolio.{item_id}.surface")
        resolve_public(surface, f"portfolio.{item_id}")
        for ref in item.get("evidence", []) or []:
            resolve_evidence(str(ref), f"portfolio.{item_id}.evidence")

    publications = data.get("publications")
    if not isinstance(publications, list) or len(publications) != 8:
        fail(f"expected 8 publications, found {len(publications) if isinstance(publications, list) else 'non-list'}")
    for pub in publications:
        pub_id = require_text(pub.get("id"), "publication.id")
        resolve_public(require_text(pub.get("page"), f"publication {pub_id}.page"), f"publication {pub_id}")
        require_text(pub.get("commercial_role"), f"publication {pub_id}.commercial_role")

    insights = data.get("insights")
    if not isinstance(insights, dict):
        fail("insights must be an object")
    resolve_public(require_text(insights.get("surface"), "insights.surface"), "insights")
    seen_urls: set[str] = set()
    for article in insights.get("articles", []):
        url = require_text(article.get("url"), "insights.article.url")
        if url in seen_urls:
            fail(f"duplicate insights url: {url}")
        seen_urls.add(url)
        require_text(article.get("title"), f"insights {url}.title")
        if article.get("proof_status") not in (None, "withdrawn_pending_verification"):
            fail(f"insights {url} has invalid proof_status")
        # A superseded article's canonical destination must exist.
        destination = article.get("canonical_destination")
        if destination:
            resolve_public(str(destination), f"insights {url}.canonical_destination")
        else:
            resolve_public(url, f"insights {url}")

    for withdrawn in insights.get("withdrawn_or_superseded", []):
        url = require_text(withdrawn.get("url"), "withdrawn.url")
        if withdrawn.get("proof_status") != "withdrawn_pending_verification":
            fail(f"withdrawn article {url} must carry proof_status withdrawn_pending_verification")

    newsletter = data.get("newsletter")
    if not isinstance(newsletter, dict):
        fail("newsletter must be an object")
    resolve_public(require_text(newsletter.get("surface"), "newsletter.surface"), "newsletter")
    resolve_public(require_text(newsletter.get("archive_surface"), "newsletter.archive_surface"), "newsletter archive")
    require_text(newsletter.get("intake_contract"), "newsletter.intake_contract")
    require_text(newsletter.get("unsubscribe_contract"), "newsletter.unsubscribe_contract")

    for item in data.get("community", []):
        item_id = require_text(item.get("id"), "community.id")
        require_text(item.get("round"), f"community {item_id}.round")
        if not isinstance(item.get("slots"), int) or item.get("slots") <= 0:
            fail(f"community {item_id}.slots must be a positive integer")
        require_text(item.get("intake"), f"community {item_id}.intake")
        intake_url = require_text(item.get("intake_url"), f"community {item_id}.intake_url")
        if not intake_url.startswith("https://docs.google.com/forms/"):
            fail(f"community {item_id}.intake_url must be the Google Form intake surface")
        if require_text(item.get("surface"), f"community {item_id}.surface") != "/community/websites":
            fail(f"community {item_id} surface must be /community/websites")

    related_ids: set[str] = set()
    for item in data.get("related_ecosystem", []):
        item_id = require_text(item.get("id"), "related_ecosystem.id")
        if item_id in related_ids:
            fail(f"duplicate related_ecosystem id: {item_id}")
        related_ids.add(item_id)
        require_text(item.get("name"), f"related_ecosystem.{item_id}.name")
        validate_classification(item, f"related_ecosystem.{item_id}")
        require_text(item.get("source"), f"related_ecosystem.{item_id}.source")
        # Firewall: unresolved third-party/community/venture items stay off the site.
        if item["disclosure_permission"] == "unresolved" and item["publication_status"] not in {
            "recorded_not_published",
            "published_neutral",
        }:
            fail(
                f"related_ecosystem.{item_id}: unresolved disclosure must be recorded_not_published "
                "(or an explicitly neutral public label)"
            )
        if item["publication_status"] in {"published"}:
            fail(f"related_ecosystem.{item_id}: related-ecosystem items must not be published outright")

    # Creator Prompter Studio must be recorded as verified-existing and unpublished.
    creator = next(
        (item for item in data.get("related_ecosystem", []) if item.get("id") == "creator-prompter-studio"),
        None,
    )
    if creator is None:
        fail("related_ecosystem must record creator-prompter-studio")
    else:
        if creator.get("existence") != "verified":
            fail("creator-prompter-studio.existence must be 'verified' (canonical Forgejo evidence)")
        if creator.get("github_mirror_status") != "not_found_on_github":
            fail("creator-prompter-studio.github_mirror_status must reflect the GitHub re-check")
        if creator.get("publication_status") != "recorded_not_published":
            fail("creator-prompter-studio must remain recorded_not_published until disclosure is granted")
        narrative = json.dumps(
            {
                "verification_basis": creator.get("verification_basis"),
                "correction_note": creator.get("correction_note"),
                "technical_nature": creator.get("technical_nature"),
                "summary": creator.get("summary"),
            }
        ).lower()
        for phrase in ("cannot be found", "could not be found", "does not exist", "nonexistent", "no repository exists"):
            if phrase in narrative:
                fail(f"creator-prompter-studio must not be described as nonexistent (found {phrase!r})")

    evidence = data.get("evidence")
    if not isinstance(evidence, dict):
        fail("evidence must be an object")
    resolve_public(require_text(evidence.get("results_standard"), "evidence.results_standard"), "evidence")
    resolve_public(require_text(evidence.get("trust_center"), "evidence.trust_center"), "evidence")
    resolve_public(require_text(evidence.get("reviews", {}).get("surface"), "evidence.reviews.surface"), "evidence")
    if not str(evidence.get("reviews", {}).get("endpoint", "")).startswith("https://n8n.tayoca.com/"):
        fail("evidence.reviews.endpoint must remain the review data endpoint")

    # Withdrawn proof narratives must never become portfolio evidence.
    for item in data.get("portfolio", []):
        for ref in item.get("evidence", []) or []:
            if str(ref).startswith("/blog/how-we-saved-216k"):
                fail(f"portfolio {item.get('id')} cites withdrawn-proof narrative: {ref}")

    runtime = data.get("runtime_inventory")
    if not isinstance(runtime, dict):
        fail("runtime_inventory must be an object")
    registry_note = runtime.get("workflow_registry") or {}
    if registry_note.get("authority") != "declared_snapshot":
        fail("runtime_inventory.workflow_registry.authority must be 'declared_snapshot'")
    statement = str(registry_note.get("statement", "")).lower()
    if "declared subset/snapshot" not in statement or "not authoritative" not in statement:
        fail("the workflow registry statement must say it is a declared snapshot and not authoritative")
    live = runtime.get("live_estate") or {}
    if live.get("status") != "not_queried_in_this_workspace":
        fail("runtime_inventory.live_estate must not claim a live runtime inventory")
    for required in ("invent or estimate live workflow counts", "claim a complete runtime inventory"):
        if required not in json.dumps(live.get("forbidden_actions", [])):
            fail(f"runtime_inventory.live_estate.forbidden_actions missing: {required}")

    security = data.get("security") or {}
    secret = security.get("control_center_embedded_authorization_material") or {}
    if secret.get("status") != "superseded_by_completed_production_handoff":
        fail("historical Control Center authorization finding must follow the completed production handoff")
    if secret.get("classification") != "historical_finding_not_active_workstream":
        fail("historical Control Center authorization finding must not be represented as active implementation work")
    evidence_refs = secret.get("evidence") or []
    for required_ref in (
        "docs/control-center-production-handoff-20260828.md",
        "docs/control-center-status-note.yaml",
    ):
        if required_ref not in evidence_refs or not (ROOT / required_ref).is_file():
            fail(f"Control Center completed-handoff evidence missing: {required_ref}")
    reopen_rule = str(secret.get("reopen_rule", "")).lower()
    if "specific evidenced defect" not in reopen_rule or "security audit" not in reopen_rule:
        fail("Control Center historical finding needs the narrow reopen rule")
    if "no historical or current authorization value is reproduced" not in str(secret.get("secret_value_policy", "")).lower():
        fail("Control Center secret-value policy is incomplete")

    print(
        "Company ecosystem validation PASSED: identity, 3 practices, services, segments, "
        f"{len(portfolio_ids)} portfolio items, 8 publications, {len(seen_urls)} insights, "
        f"{len(related_ids)} related-ecosystem items classified, newsletter, community and evidence "
        "surfaces resolve; disclosure firewall, withdrawn-proof isolation, runtime-inventory "
        "wording and the control-center security boundary all hold."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
