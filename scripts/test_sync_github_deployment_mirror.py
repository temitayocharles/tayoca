#!/usr/bin/env python3
from __future__ import annotations

import tempfile
import unittest
from pathlib import Path

from sync_github_deployment_mirror import selected_files, summarize, sync_tree


class MirrorReconcilerTests(unittest.TestCase):
    def seed(self, root: Path, *, body: bytes = b"canonical\n") -> None:
        (root / "public" / "nested").mkdir(parents=True)
        (root / "public" / "index.html").write_bytes(body)
        (root / "public" / "nested" / "asset.bin").write_bytes(b"\x00\x01\x02")
        (root / "vercel.json").write_text('{"outputDirectory":"public"}\n')

    def test_equal_tree_is_equal(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            canonical = base / "canonical"
            mirror = base / "mirror"
            self.seed(canonical)
            self.seed(mirror)
            self.assertTrue(summarize(selected_files(canonical), selected_files(mirror))["equal"])

    def test_sync_repairs_changed_missing_and_extra_paths(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            canonical = base / "canonical"
            mirror = base / "mirror"
            self.seed(canonical)
            self.seed(mirror, body=b"drift\n")
            (mirror / "public" / "extra.txt").write_text("github-only\n")
            (mirror / "public" / "nested" / "asset.bin").unlink()

            before = summarize(selected_files(canonical), selected_files(mirror))
            self.assertFalse(before["equal"])
            self.assertEqual(before["extra_count"], 1)
            self.assertEqual(before["missing_count"], 1)
            self.assertEqual(before["mismatched_count"], 1)

            sync_tree(canonical, mirror)
            after = summarize(selected_files(canonical), selected_files(mirror))
            self.assertTrue(after["equal"])
            self.assertFalse((mirror / "public" / "extra.txt").exists())


if __name__ == "__main__":
    unittest.main()
