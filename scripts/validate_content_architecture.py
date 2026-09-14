#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def fail(message: str) -> None:
    raise SystemExit(f"Phase 3 content architecture validation FAILED: {message}")


def require(path: Path, *markers: str) -> str:
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            fail(f"{path.relative_to(ROOT)} missing {marker!r}")
    return text


def main() -> None:
    runtime = require(
        PUBLIC / "tayoca-v9.js",
        "applyPhase3OfferTaxonomy",
        "Useful material for people who want to do the work themselves.",
        "Offer map",
        "Different ways to work with Tayoca.",
        "Software product",
        "Operator publications",
        "Diagnostic engagements",
        "Ongoing services",
        "Assessments are diagnostic engagements",
        "Managed Operations are ongoing services",
        "Three diagnostic engagements that turn cost, reliability and technology-value uncertainty",
        "cleanOperatorBriefArchive",
        "Practical operating intelligence for people responsible for cloud",
        "AWS Cost Optimization Playbook",
        "Kubernetes Production Readiness Checklist",
        "GitOps Field Guide",
        "Opportunity|public_verified|pgc1:|product:",
        "alignWorkAuthority",
        "documents selected project work alongside client delivery",
        "Products, publications, programmes and selected project work",
        "other projects stay neutral unless the relationship has been confirmed",
    )
    if "Three diagnostic products that turn cost, reliability and technology-value uncertainty" in runtime:
        fail("public taxonomy runtime must not describe Executive Assessments as diagnostic products")

    require(
        PUBLIC / "products.html",
        "Operator publications",
        "Looking for software? See Sivanta",
        "Need the work done with you rather than by you?",
    )

    require(
        PUBLIC / "operator-brief-archive.html",
        'data-section="operating_signal"',
        'data-section="from_the_field"',
        'data-section="technology_value"',
        'data-section="decision_memo"',
        'data-section="build_log"',
        'data-section="evidence"',
        'data-section="operator_action"',
        'data-section="tayoca_update"',
        "/tayoca-v9.js",
    )

    company_registry = require(
        PUBLIC / "data" / "company-ecosystem.json",
        '"owned_product"',
        '"publication"',
        '"community_initiative"',
        '"internal_system"',
        '"id": "sitesupply"',
        '"owner_relationship_confidence": "unconfirmed"',
        '"tayoca_relationship": "unrelated_pending_confirmation"',
        '"publication_status": "published_neutral"',
    )
    if '"id": "sitesupply"' not in company_registry:
        fail("SiteSupply authority record missing")

    require(
        PUBLIC / "about.html",
        "client delivery",
        "owned software",
        "editorial work",
        "community projects",
    )

    require(
        PUBLIC / "work.html",
        "SiteSupply",
        "Project / build · in market",
        "It is an owned Tayoca product",
        "/tayoca-v9.js",
    )

    redirects = require(PUBLIC / "_redirects", "/insights.html    /blog/    301")
    if "/insights.html    /blog/    301" not in redirects:
        fail("Insights compatibility route must resolve to the canonical /blog/ library")

    legacy_routes = (
        PUBLIC / "blog" / "how-we-saved-216k-aws.html",
        PUBLIC / "blog" / "how-we-saved-216k-on-aws-in-90-days.html",
    )
    stale_taxonomy = "Technology Value &amp; FinOps, Platform Reliability &amp; DevSecOps, and Agentic Operations &amp; Automation."
    for path in legacy_routes:
        text = require(
            path,
            'content="noindex,follow"',
            "Case Study Under Evidence Review | Tayoca",
            "withdrawn",
            "public proof",
            "We help organizations understand technology costs, improve reliability and automate work that should not need to be repeated by hand.",
            '<a href="/blog/">Insights</a>',
            '<a href="/operator-brief.html">Operator Brief</a>',
        )
        if stale_taxonomy in text:
            fail(f"{path.relative_to(ROOT)} still carries superseded service taxonomy")

    print("Phase 3 content architecture validation PASSED: offer taxonomy, editorial authority, portfolio disclosure and withdrawn-evidence route controls are present while governed registries remain intact.")


if __name__ == "__main__":
    main()
