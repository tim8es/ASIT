"""ASIT critical path optimization guardrails; tests only static source contracts."""
import json
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
def get(path):
    return (ROOT / path).read_text(encoding="utf-8")

class CriticalPathContractTests(unittest.TestCase):
    def test_candidate_and_lazy_routing(self):
        a = json.loads(get("plugin.json"))
        b = json.loads(get(".codex-plugin/plugin.json"))
        self.assertEqual(a["version"], "0.3.0")
        self.assertEqual(a["version"], b["version"])
        self.assertIn("classify the request first", get("skills/asit-teacher/SKILL.md").lower())
        self.assertIn("one decision per lesson", get("skills/asit-core/SKILL.md").lower())

    def test_blueprint_identity_without_regenerating_rubric(self):
        lessons = get("skills/asit-lessons/SKILL.md")
        assessment = get("skills/asit-assessment/SKILL.md")
        self.assertIn("one trusted lesson blueprint", lessons)
        self.assertIn("BEFORE display", lessons)
        self.assertIn("grade once", assessment)
        self.assertIn("trusted", assessment)
        self.assertIn("SAME response", assessment)
        self.assertIn("Save Gate", assessment)

    def test_batched_reads_preserve_necessary_guards(self):
        progress = get("skills/asit-progress/SKILL.md")
        storage = get("skills/asit-progress/references/storage-v2.md")
        for key in ("nine", "consent", "state_revision", "read back", "Activities", "Attempts", "projections"):
            self.assertIn(key.lower(), progress.lower())
        for key in ("full", "revision", "complete", "preflight", "projections", "summary_only",
                    "Not saved", "Not verified", "Fully synced", "Partial sync"):
            self.assertIn(key.lower(), storage.lower())
        self.assertIn("after verified Attempts", progress)
        self.assertIn("before display", progress)
        self.assertIn("previous chat", progress)
        self.assertIn("before retry", storage)
        self.assertIn("nine exact tab headers", storage.lower())

    def test_wrong_answer_not_spoiled(self):
        visual = get("skills/asit-exercises/references/visual-feedback.md")
        exercise = get("skills/asit-exercises/SKILL.md")
        integrity = get("skills/asit-lessons/references/answer-integrity.md")
        self.assertIn("Incorrect — Try again", visual)
        self.assertIn("do not reveal a directional clue", visual)
        self.assertIn("without a directional clue", exercise)
        self.assertNotIn("brief, relevant clue explaining what to reconsider", visual)
        self.assertIn("without giving the correct answer", integrity)

    def test_all_eighteen_patterns_preserved(self):
        import re
        source = get("skills/asit-exercises/references/pattern-registry.md")
        names = re.findall(r"^\\| `([a-z_]+)` \\|", source, flags=re.MULTILINE)
        expected = {
            "cloze", "vocabulary_retrieval", "image_label", "grammar_contrast",
            "matching", "image_choice", "image_hotspot", "reading_comprehension",
            "sentence_builder", "error_detective", "card_ordering", "timeline_ordering",
            "free_production", "scenario", "dialogue", "spoken_response",
            "listening", "progress_explorer",
        }
        self.assertEqual(set(names), expected)
        self.assertEqual(len(names), 18)

    def test_feature_set_preserved(self):
        exercise = get("skills/asit-exercises/SKILL.md")
        registry = get("skills/asit-exercises/references/pattern-registry.md")
        visual = get("skills/asit-lessons/references/visual-lesson-standard.md")
        media = get("skills/asit-media/SKILL.md")
        english = get("skills/asit-english/SKILL.md")
        continuation = get("skills/asit-assessment/references/auto-continuation.md")
        for pattern in ("image_label", "image_hotspot", "listening", "spoken_response", "progress_explorer"):
            self.assertIn(pattern, registry)
        self.assertIn("one final Submit", exercise)
        self.assertIn("two graded visual interactions", visual)
        self.assertIn("ELLLO", media)
        self.assertIn("Sound Grammar", media)
        self.assertIn("CEFR", english)
        self.assertIn("same", continuation.lower())
        self.assertIn("stop/pause", continuation)
        self.assertIn("preflight", continuation.lower())

if __name__ == "__main__":
    unittest.main()
