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

    require(
        PUBLIC / "data" / "company-ecosystem.json",
        '"owned_product"',
        '"publication"',
        '"community_initiative"',
        '"internal_system"',
    )

    require(
        PUBLIC / "about.html",
        "client delivery",
        "owned software",
        "editorial work",
        "community projects",
    )

    print("Phase 3 content architecture validation PASSED: public offer taxonomy and Operator Brief editorial authority controls are present while governed registries remain intact.")


if __name__ == "__main__":
    main()
