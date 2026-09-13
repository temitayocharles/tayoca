#!/usr/bin/env python3
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


def fail(message: str) -> None:
    raise SystemExit(f"Phase 3 content architecture validation FAILED: {message}")


def require(path: Path, *markers: str) -> None:
    text = path.read_text(encoding="utf-8")
    for marker in markers:
        if marker not in text:
            fail(f"{path.relative_to(ROOT)} missing {marker!r}")


def main() -> None:
    require(
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
    )

    require(
        PUBLIC / "products.html",
        "Operator publications",
        "Looking for software? See Sivanta",
        "Need the work done with you rather than by you?",
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

    print("Phase 3 content architecture validation PASSED: public offer taxonomy distinguishes products, publications, diagnostic engagements and ongoing services while retaining the governed Stage 10 registry.")


if __name__ == "__main__":
    main()
