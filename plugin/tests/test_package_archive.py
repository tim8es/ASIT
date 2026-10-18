"""Release archive behavior checks; these exercise the actual ZIP writer."""
from pathlib import Path
from tempfile import TemporaryDirectory
from zipfile import ZipFile
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
REPO = ROOT.parent
sys.path.insert(0, str(ROOT / "scripts"))
import package as packaging


class PackageArchiveTests(unittest.TestCase):
    def build(self, path):
        packaging.check()
        packaging.build(path)
        return path.read_bytes()

    def test_zip_includes_exact_mit_license(self):
        with TemporaryDirectory() as directory:
            path = Path(directory) / "plugin.zip"
            self.build(path)
            with ZipFile(path) as archive:
                self.assertEqual(
                    archive.read("asit-english-tutor/LICENSE"),
                    (REPO / "LICENSE").read_bytes(),
                )

    def test_zip_is_reproducible_and_contains_only_supported_files(self):
        with TemporaryDirectory() as directory:
            a, b = Path(directory) / "a.zip", Path(directory) / "b.zip"
            self.assertEqual(self.build(a), self.build(b))
            with ZipFile(a) as archive:
                names = archive.namelist()
                self.assertEqual(len(names), len(set(names)))
                self.assertIsNone(archive.testzip())
                self.assertIn("asit-english-tutor/plugin.json", names)
                self.assertIn("asit-english-tutor/.codex-plugin/plugin.json", names)
                self.assertTrue(all(
                    name.startswith("asit-english-tutor/") and
                    not any(part.startswith(".env") or part in
                            {"data", "private", "secrets", "__pycache__"}
                            for part in Path(name).parts)
                    for name in names
                ))
                self.assertTrue(all(
                    name.endswith((".md", ".json")) or
                    name.endswith("/LICENSE") for name in names
                ))


if __name__ == "__main__":
    unittest.main()
