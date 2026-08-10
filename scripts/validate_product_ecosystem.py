#!/usr/bin/env python3
"""Validate the locked Tayoca Stage 10 product ecosystem contract."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
REGISTRY = PUBLIC / "data" / "product-ecosystem.json"
SITE_JS = PUBLIC / "tayoca-site.js"
SITE_CSS = PUBLIC / "assets" / "css" / "site-shell.css"

EXPECTED_FAMILIES = {
    "operator-tools": ("Operator Tools", 1),
    "operator-playbooks": ("Operator Playbooks", 8),
    "executive-assessments": ("Executive Assessments", 3),
    "managed-operations": ("Managed Operations", 4),
}
REQUIRED_CONTROLS = (
    "buyer",
    "problem",
    "deliverable",
    "time_to_value",
    "evidence",
    "pricing_method",
    "boundaries",
    "next_action",
)
EXPECTED_PLAYBOOK_FILES = {
    "kubernetes-operators-workbook.html",
    "ai-automation-career-playbook.html",
    "n8n-mcp-kubernetes-teaching-pack.html",
    "build-break-fix-devops-lab-pack.html",
    "aws-cost-optimization-playbook.html",
    "devops-incident-runbook-template.html",
    "kubernetes-production-readiness-checklist.html",
    "gitops-field-guide.html",
}
SHARED_RUNTIME_PAGES = (
    PUBLIC / "products.html",
    PUBLIC / "assessments.html",
    PUBLIC / "services.html",
    PUBLIC / "sivanta.html",
)


def fail(message: str) -> None:
    raise SystemExit(f"Stage 10 product ecosystem validation FAILED: {message}")


def require_text(value: object, where: str) -> str:
    if not isinstance(value, str) or not value.strip():
        fail(f"{where} must be a non-empty string")
    return value.strip()


def validate_action(action: object, where: str) -> None:
    if not isinstance(action, dict):
        fail(f"{where} must be an object")
    require_text(action.get("label"), f"{where}.label")
    href = require_text(action.get("href"), f"{where}.href")
    if not (href.startswith("/") or href.startswith("https://")):
        fail(f"{where}.href must be an internal path or https URL")


def main() -> None:
    if not REGISTRY.exists():
        fail(f"missing registry {REGISTRY.relative_to(ROOT)}")
    data = json.loads(REGISTRY.read_text(encoding="utf-8"))
    if data.get("stage") != 10:
        fail("registry stage must equal 10")
    if require_text(data.get("acceptance_gate"), "acceptance_gate") != (
        "Every product has a coherent commercial role and does not appear as an unrelated side project."
    ):
        fail("acceptance gate does not match the locked Stage 10 definition")
    if tuple(data.get("required_controls") or ()) != REQUIRED_CONTROLS:
        fail("required_controls must match the locked eight-field contract exactly")

    families = data.get("families")
    if not isinstance(families, list) or len(families) != 4:
        fail("registry must contain exactly four product families")
    family_by_id = {}
    product_ids: set[str] = set()
    all_products = []
    for family in families:
        if not isinstance(family, dict):
            fail("every family must be an object")
        family_id = require_text(family.get("id"), "family.id")
        if family_id in family_by_id:
            fail(f"duplicate family id: {family_id}")
        if family_id not in EXPECTED_FAMILIES:
            fail(f"unexpected family id: {family_id}")
        expected_name, expected_count = EXPECTED_FAMILIES[family_id]
        if family.get("name") != expected_name:
            fail(f"family {family_id} must be named {expected_name!r}")
        require_text(family.get("summary"), f"family {family_id}.summary")
        validate_action(family.get("next_action"), f"family {family_id}.next_action")
        products = family.get("products")
        if not isinstance(products, list) or len(products) != expected_count:
            fail(f"family {family_id} must contain exactly {expected_count} products")
        family_by_id[family_id] = family
        for product in products:
            if not isinstance(product, dict):
                fail(f"family {family_id} contains a non-object product")
            product_id = require_text(product.get("id"), f"{family_id}.product.id")
            if product_id in product_ids:
                fail(f"duplicate product id: {product_id}")
            product_ids.add(product_id)
            require_text(product.get("name"), f"product {product_id}.name")
            require_text(product.get("page"), f"product {product_id}.page")
            require_text(product.get("commercial_role"), f"product {product_id}.commercial_role")
            for key in REQUIRED_CONTROLS:
                if key == "next_action":
                    validate_action(product.get(key), f"product {product_id}.{key}")
                else:
                    require_text(product.get(key), f"product {product_id}.{key}")
            all_products.append((family_id, product))

    if len(all_products) != 16:
        fail(f"expected 16 governed products, found {len(all_products)}")

    actual_playbook_files = {p.name for p in (PUBLIC / "products").glob("*.html")}
    if actual_playbook_files != EXPECTED_PLAYBOOK_FILES:
        missing = sorted(EXPECTED_PLAYBOOK_FILES - actual_playbook_files)
        extra = sorted(actual_playbook_files - EXPECTED_PLAYBOOK_FILES)
        fail(f"playbook page set drifted; missing={missing}, extra={extra}")
    registry_playbook_files = {
        Path(product["page"]).name
        for family_id, product in all_products
        if family_id == "operator-playbooks"
    }
    if registry_playbook_files != EXPECTED_PLAYBOOK_FILES:
        fail("Operator Playbooks registry does not map one-to-one to the eight product detail pages")

    for page in SHARED_RUNTIME_PAGES:
        text = page.read_text(encoding="utf-8")
        if "/tayoca-site.js" not in text:
            fail(f"{page.relative_to(ROOT)} must load /tayoca-site.js")
    for name in EXPECTED_PLAYBOOK_FILES:
        text = (PUBLIC / "products" / name).read_text(encoding="utf-8")
        if "/tayoca-site.js" not in text or "/assets/css/site-shell.css" not in text:
            fail(f"product page {name} must load the shared renderer and shell")

    js = SITE_JS.read_text(encoding="utf-8")
    required_js_markers = (
        "/data/product-ecosystem.json",
        "/assets/css/site-shell.css",
        "data-stage10-styles",
        "product_ecosystem_next_action",
        "data-product-control",
        "operator-playbooks",
        "managed-operations",
        "executive-assessments",
        "operator-tools",
        "24/7 basic support",
        "24/7 support (chat + email)",
        "24/7 chat + email",
        "SLA-backed SLAs including uptime",
        "Support and SLA terms defined in the signed plan",
    )
    for marker in required_js_markers:
        if marker not in js:
            fail(f"shared renderer is missing required Stage 10 marker {marker!r}")

    css = SITE_CSS.read_text(encoding="utf-8")
    for marker in (
        ".stage10-ecosystem",
        ".stage10-commercial",
        ".stage10-control-grid",
        ".stage10-managed-operations",
        ".stage10-next",
    ):
        if marker not in css:
            fail(f"site shell is missing Stage 10 style {marker}")

    print(
        "Stage 10 product ecosystem validation PASSED: "
        "4 families, 16 products, 8 commercial controls per product, "
        "8/8 playbook pages governed, shared runtime/style contract present."
    )


if __name__ == "__main__":
    main()
