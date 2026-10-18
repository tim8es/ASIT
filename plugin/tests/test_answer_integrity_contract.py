"""Static tests for mandatory no-hint, no-copy gate in ASIT v0.3.2.
These cannot prove clipboard prevention or native-client runtime behavior.
"""
import json
from pathlib import Path
import unittest
ROOT=Path(__file__).resolve().parents[1]
read=lambda name:(ROOT/name).read_text(encoding="utf-8")

class AnswerIntegrityContractTest(unittest.TestCase):
    def test_manifest_versions(self):
        for path in ["plugin.json",".codex-plugin/plugin.json"]:
            self.assertEqual(json.loads(read(path))["version"],"0.3.2")
    def test_mandatory_route_before_registration(self):
        for path in ["skills/asit-teacher/SKILL.md","skills/asit-lessons/SKILL.md"]:
            s=read(path)
            self.assertIn("answer-integrity.md",s)
            self.assertIn("before",s.lower())
            self.assertIn("Submit",s)
    def test_cross_task_and_clipboard_limits(self):
        p=read("skills/asit-lessons/references/answer-integrity.md")
        for term in ["copy/paste", "cross-task", "clipboard", "placeholder", "vocabulary", "before Submit", "independent", "first", "registration", "alt"]:
            self.assertIn(term.lower(),p.lower())
    def test_grading_does_not_promote_copied_work(self):
        p=read("skills/asit-assessment/SKILL.md")
        self.assertIn("not independent production evidence",p)
        self.assertIn("unverified client report",p)
    def test_continuation_checks_integrity(self):
        self.assertIn("answer integrity gate",read("skills/asit-assessment/references/auto-continuation.md"))

if __name__=='__main__': unittest.main()
