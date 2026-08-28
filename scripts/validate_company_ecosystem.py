#!/usr/bin/env python3
"""Validate the Tayoca company-level ecosystem registry (Arena redesign).

The registry is additive to the locked stage-10 commercial catalogue
(public/data/product-ecosystem.json) and models the company as one platform:
identity, practices, services, portfolio, publications, insights, newsletter,
community and evidence surfaces.

Every portfolio/insights/publication surface must resolve to a real public
file, and withdrawn-proof articles must be flagged so result surfaces never
cite them as evidence.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REGISTRY = PUBLIC / "data" / "company-ecosystem.json"
SITEMAP = PUBLIC / "sitemap.xml"

ALLOWED_KINDS = {
    "owned_product", "venture", "client_build", "community_initiative",
    "publication", "experiment", "internal_system", "separate_venture",
    "community_or_client_build", "internal_tooling",
}
ALLOWED_STATUSES = {"active", "in_market", "open_intake", "published", "staged", "closed"}
ALLOWED_CLASSIFICATIONS = {
    "public_verified", "public_candidate", "owner_confirmation_required",
    "private_internal", "client_disclosure_unknown", "archived", "superseded",
}
ALLOWED_CATEGORIES = {
    "finops", "kubernetes-platform", "ai-automation", "gitops-delivery", "company-community",
}


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
    if relative.endswith("/"):
        relative = relative + "index.html"
    elif not Path(relative).suffix:
        relative = relative + ".html"
    if not (PUBLIC / relative).is_file():
        fail(f"{where}: surface does not resolve to a public file: {path}")


def main() -> int:
    if not REGISTRY.is_file():
        fail(f"missing registry {REGISTRY.relative_to(ROOT)}")
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    if data.get("schema_version") != 1:
        fail("schema_version must equal 1")

    company = data.get("company")
    if not isinstance(company, dict):
        fail("company must be an object")
    require_text(company.get("name"), "company.name")
    require_text(company.get("positioning"), "company.positioning")
    founder = company.get("founder")
    if not isinstance(founder, dict) or not require_text(founder.get("public_name"), "company.founder.public_name"):
        fail("company.founder.public_name is required")

    practices = data.get("practices")
    if not isinstance(practices, list) or len(practices) != 3:
        fail("practices must contain exactly the three practice areas")
    for practice in practices:
        require_text(practice.get("id"), "practice.id")
        require_text(practice.get("name"), "practice.name")
        resolve_public(require_text(practice.get("surface"), "practice.surface"), f"practice {practice.get('id')}")

    for service in data.get("services", []):
        require_text(service.get("id"), "service.id")
        require_text(service.get("name"), "service.name")
        resolve_public(require_text(service.get("surface"), "service.surface"), f"service {service.get('id')}")

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
        if status not in ALLOWED_STATUSES:
            fail(f"portfolio.{item_id}.status is not allowed: {status}")
        classification = require_text(item.get("classification"), f"portfolio.{item_id}.classification")
        if classification not in ALLOWED_CLASSIFICATIONS:
            fail(f"portfolio.{item_id}.classification is not allowed: {classification}")
        require_text(item.get("summary"), f"portfolio.{item_id}.summary")
        surface = require_text(item.get("surface"), f"portfolio.{item_id}.surface")
        if surface not in ("/sivanta.html", "/work.html") and not surface.endswith(".html") and surface != "/community/websites":
            pass
        if surface == "/community/websites":
            if not (PUBLIC / "community" / "websites" / "index.html").is_file():
                fail("portfolio.community-websites surface missing")
        else:
            resolve_public(surface, f"portfolio.{item_id}")

    publications = data.get("publications", [])
    if len(publications) != 8:
        fail(f"expected 8 publications, found {len(publications)}")
    for pub in publications:
        require_text(pub.get("id"), "publication.id")
        resolve_public(require_text(pub.get("surface"), "publication.surface"), f"publication {pub.get('id')}")

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
        category = require_text(article.get("category"), f"insights {url} category")
        if category not in ALLOWED_CATEGORIES:
            fail(f"insights {url} has unknown category {category}")
        resolve_public(url, f"insights {url}")
        if article.get("proof_status") not in (None, "withdrawn_pending_verification"):
            fail(f"insights {url} has invalid proof_status")

    newsletter = data.get("newsletter")
    if not isinstance(newsletter, dict):
        fail("newsletter must be an object")
    resolve_public(require_text(newsletter.get("surface"), "newsletter.surface"), "newsletter")
    resolve_public(require_text(newsletter.get("archive_surface"), "newsletter.archive_surface"), "newsletter archive")
    require_text(newsletter.get("intake_contract"), "newsletter.intake_contract")

    for item in data.get("community", []):
        require_text(item.get("id"), "community.id")
        require_text(item.get("round"), "community.round")
        if not isinstance(item.get("slots"), int) or item.get("slots") <= 0:
            fail("community.slots must be a positive integer")
        require_text(item.get("intake"), "community.intake")
        surface = require_text(item.get("surface"), "community.surface")
        if surface != "/community/websites":
            fail("community surface must be /community/websites")

    related = data.get("related_ecosystem", [])
    related_ids: set[str] = set()
    for item in related:
        item_id = require_text(item.get("id"), "related_ecosystem.id")
        if item_id in related_ids:
            fail(f"duplicate related_ecosystem id: {item_id}")
        related_ids.add(item_id)
        require_text(item.get("name"), f"related_ecosystem.{item_id}.name")
        kind = require_text(item.get("kind"), f"related_ecosystem.{item_id}.kind")
        if kind not in ALLOWED_KINDS:
            fail(f"related_ecosystem.{item_id}.kind is not allowed: {kind}")
        classification = require_text(item.get("classification"), f"related_ecosystem.{item_id}.classification")
        if classification not in ALLOWED_CLASSIFICATIONS:
            fail(f"related_ecosystem.{item_id}.classification is not allowed: {classification}")
        if item.get("published_on_site") is not False:
            fail(f"related_ecosystem.{item_id}.published_on_site must be false (firewall rule)")
        require_text(item.get("summary"), f"related_ecosystem.{item_id}.summary")
        evidence = item.get("evidence")
        if not isinstance(evidence, list) or not evidence:
            fail(f"related_ecosystem.{item_id}.evidence must be a non-empty list")
        for ref in evidence:
            if not isinstance(ref, str) or not ref.startswith("https://"):
                fail(f"related_ecosystem.{item_id}.evidence entries must be https URLs")

    evidence = data.get("evidence")
    if not isinstance(evidence, dict):
        fail("evidence must be an object")
    resolve_public(require_text(evidence.get("results_standard"), "evidence.results_standard"), "evidence")
    resolve_public(require_text(evidence.get("trust_center"), "evidence.trust_center"), "evidence")
    resolve_public(require_text(evidence.get("reviews", {}).get("surface"), "evidence.reviews.surface"), "evidence")

    # Withdrawn-proof articles must not appear as result evidence surfaces.
    for item in data.get("portfolio", []):
        for ref in item.get("evidence", []):
            if str(ref).startswith("/blog/how-we-saved-216k"):
                fail(f"portfolio {item.get('id')} cites withdrawn-proof narrative: {ref}")

    print("Company ecosystem validation PASSED: identity, 3 practices, services, "
          f"{len(portfolio_ids)} portfolio items, 8 publications, {len(seen_urls)} insights, "
          "newsletter, community and evidence surfaces resolve; withdrawn-proof isolation holds.")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except SystemExit as exc:
        sys.exit(exc.code)
