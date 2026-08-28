#!/usr/bin/env python3
from pathlib import Path
import sys

ROOT = Path(__file__).resolve().parents[1]
POLICY = ROOT / "editorial" / "media-distribution-policy.yaml"

required = [
    "policy_id: tayoca-social-media-distribution-v1",
    "product_campaign_video_allowed",
    "sivanta_video_actively_used",
    "sitesupply_video_actively_used",
    "posters_allowed_for_product_campaigns",
    "soundscape_allowed_for_product_campaigns",
    "technical_video_allowed_when_explanatory",
    "technical_gif_allowed_when_explanatory",
    "forbidden_author_urn: urn:li:person:Cb5CPR4rns",
    "author_urn: urn:li:person:TmZ1E0fsDJ",
    "canonical_count: 29",
    "preferred_resolution: 1080x1920",
    "folder_id: 1t8cwAol9MbHtdf_8x9IjYldhL8f73Vvb",
    "folder_id: 18cgYYUlAGI--I_tgVZw8TnNAyIAiUJKc",
    "folder_id: 1rGHXSAE7kJyDah4qOsRkjl9_Ep7Jlxdc",
    "folder_id: 1gnW5O00jjKXJxJeHQvQpNuUtp5JB6trS",
    "folder_id: 1m9UGJ69htQOCZ03lBNVVCtHFu-kKz7Jn",
    "canonical_drive_asset_present: false",
    "preserve_source_audio_or_use_separately_approved_soundscape",
    "arbitration: deterministic_day_level",
    "same_day_duplicate_prevention: shared_publication_ledger",
    "source_audio_only_unless_separately_approved_soundscape: true",
    "tayoca_sitesupply_amplification: KVJhvWVTBECuYTjd",
    "professional_brand_producer: iFY5iIQSRMVY6zso",
    "professional_brand_publisher: 3QVCTmqNTmLAHLUM",
    "professional_brand_native_video_publisher: ihm0uhoBkDdhnU29",
    "professional_brand_collector: MMzDONqjgzUFHTxC",
    "professional_brand_technical_video_builder: 7nyFIuPbdga6obvB",
    "sivanta_daily_video_publisher: t9zrvrDClZQ6467e",
    "sivanta_story_video_publisher: 5K1qDSHkfe7zkaC3",
    "sivanta_native_video_publisher: GDYZhHTV0mrn8R4Y",
    "sivanta_story_poster_publisher: IIo1jDtXEszdiISB",
    "sivanta_feed_poster_publisher: rcQPnm2ky4iCfcNo",
    "sivanta_linkedin_poster_publisher: NnDuT3iZ38zama6Q",
    "sivanta_story_poster_active: true",
    "sivanta_feed_poster_active: true",
    "sivanta_linkedin_poster_active: true",
    "sivanta_media_rotation_policy: video_sun_mon_wed_fri_poster_tue_thu_sat",
    "retired_sitesupply_amplification: tdax4k30XpV2RRjf",
    "retired_professional_brand_collector: NWGZc805DCh5p51t",
    "retired_technical_video_builder: Ny8nP5lqRg5wI7We",
    "retired_sitesupply_amplification_active: false",
    "retired_professional_brand_collector_active: false",
    "retired_technical_video_builder_active: false",
    "video_queue_status: VIDEO_READY",
    "static_queue_status: READY",
    "READY: professional_brand_publisher",
    "VIDEO_READY: professional_brand_native_video_publisher",
]

forbidden_runtime_rules = [
    "professional linkedin video forbidden",
    "non-sivanta professional linkedin may never use video",
    "sivanta remains the only linkedin video lane",
]

if not POLICY.exists():
    raise SystemExit("missing editorial/media-distribution-policy.yaml")
text = POLICY.read_text(encoding="utf-8")
missing = [token for token in required if token not in text]
if missing:
    raise SystemExit("media policy missing required tokens: " + ", ".join(missing))

# Scan only executable/current configuration surfaces. Historical reports are evidence,
# not runtime policy, and must remain immutable even if they contain superseded wording.
scan_paths = [
    ROOT / "automation" / "n8n" / "workflow-registry.yaml",
    ROOT / "editorial" / "editorial-policy.yaml",
]
workflow_root = ROOT / "automation" / "n8n" / "workflows"
if workflow_root.exists():
    scan_paths.extend(p for p in workflow_root.rglob("*") if p.is_file())
for p in (ROOT / "automation" / "n8n").glob("*.workflow.json"):
    scan_paths.append(p)

violations = []
for path in scan_paths:
    if not path.exists() or path == POLICY:
        continue
    try:
        body = path.read_text(encoding="utf-8").lower()
    except UnicodeDecodeError:
        continue
    for rule in forbidden_runtime_rules:
        if rule in body:
            violations.append(f"{path.relative_to(ROOT)}: {rule}")

if violations:
    print("forbidden blanket media rules found:", file=sys.stderr)
    for v in violations:
        print(" - " + v, file=sys.stderr)
    raise SystemExit(1)

print("media distribution policy: PASS")
