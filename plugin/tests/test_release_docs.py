"""Release docs must match the shipped source and resolve local links."""
import json
import re
from pathlib import Path
import unittest
from urllib.parse import unquote

REPO = Path(__file__).resolve().parents[2]
VERSION = json.loads((REPO / "plugin/plugin.json").read_text())["version"]
RELEASE_DOCS = [
    "README.md", "README.ru.md", "docs/ROADMAP.md",
    "plugin/DEVELOPMENT.md", "plugin/ACCEPTANCE.md",
]


class ReleaseDocumentationTests(unittest.TestCase):
    def test_release_entrypoints_name_current_source_version(self):
        for rel in RELEASE_DOCS:
            with self.subTest(file=rel):
                text = (REPO / rel).read_text(encoding="utf-8")
                self.assertIn("v" + VERSION, text[:1300])

    def test_repository_relative_markdown_links_exist(self):
        documents = (
            list(REPO.glob("*.md")) +
            list((REPO / "docs").rglob("*.md")) +
            list((REPO / "plugin").rglob("*.md"))
        )
        self.assertTrue(documents)
        for file in documents:
            body = file.read_text(encoding="utf-8")
            for match in re.finditer(r"!?(?:\[[^\]]*\])\(([^)]+)\)", body):
                target = unquote(match.group(1).split("#", 1)[0].strip())
                if not target or "://" in target or target.startswith(
                    ("mailto:", "tel:", "data:", "/")
                ):
                    continue
                with self.subTest(file=str(file.relative_to(REPO)), link=target):
                    self.assertTrue(
                        (file.parent / target).exists(),
                        f"Broken local link: {file} -> {target}",
                    )


if __name__ == "__main__":
    unittest.main()
