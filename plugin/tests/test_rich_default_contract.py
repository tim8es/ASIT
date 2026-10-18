"""Quality-policy regressions: full lessons must not silently be text-only.

These tests verify *source and developer blueprint declarations only*. They
cannot prove that ChatGPT rendered the controls on the learner's device.
"""
from pathlib import Path
import importlib.util
import json
import unittest

ROOT = Path(__file__).resolve().parents[1]
def get(path):
    return (ROOT / path).read_text(encoding="utf-8")

spec = importlib.util.spec_from_file_location("lesson_contract", ROOT / "scripts/lesson_contract.py")
contract = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contract)


class RichDefaultContractTest(unittest.TestCase):
    def test_plain_continue_and_automatic_follow_on_load_mandatory_contract(self):
        for path in [
            "skills/asit-teacher/SKILL.md",
            "skills/asit-lessons/SKILL.md",
            "skills/asit-assessment/references/auto-continuation.md",
        ]:
            content = get(path)
            self.assertIn("rich-default-lesson.md", content)
            self.assertIn("complete-native-lesson.md", content)

    def test_source_first_and_nontext_fallback_are_explicit(self):
        p = get("skills/asit-lessons/references/rich-default-lesson.md")
        for term in ["Продолжим", "SVG", "diagram", "state", "not_assessed",
                     "one canonical Submit", "real photo", "without any user request"]:
            self.assertIn(term.lower(), p.lower())
        self.assertIn("not a running lesson compiler", p.lower())
        self.assertIn("FAIL AND REDESIGN", p)

    def test_complete_native_lesson_template_contains_real_client_controls(self):
        p = get("skills/asit-exercises/references/complete-native-lesson.md")
        for term in [
            "{@body", "DIL.useState", "<svg", "<radio-group", "<select",
            "<input", "<textarea", "<segmented-control", "setMoved(true)",
            "Replay scene", "onClick", "Undo", "Reset",
            'GenUI.issueNewTurn("ASIT_ATTEMPT_V2', "skipped_task_ids",
            "Confirm incomplete Submit", 'ui_provenance: "unverified"',
            "onChange", "Review", "visual_symbols",
        ]:
            self.assertIn(term, p)
        self.assertEqual(p.count('GenUI.issueNewTurn("ASIT_ATTEMPT_V2'), 1)
        self.assertIn("first_answer: null", p)
        self.assertNotIn('ref="turn309465image0"', p)
        for i in range(1, 6):
            self.assertIn("**Task %s" % i, p)

    def test_both_positive_modes_pass_real_structural_validator(self):
        for name in ("valid_visual_lesson.json", "valid_svg_fallback_lesson.json"):
            plan = json.loads(get("tests/fixtures/" + name))
            self.assertEqual(contract.validate_blueprint(plan), [], name)

    def test_regression_bare_text_lesson_fails(self):
        plan = json.loads(get("tests/fixtures/valid_svg_fallback_lesson.json"))
        plan["source_strategy"] = "text_only"
        plan["scene"] = {}
        plan["native_ui"] = {}
        for item in plan["tasks"]:
            item["operation"] = "reading_inference"
            item["modality"] = "reading"
            item.pop("scene_ref", None)
            item["response_control"] = "short_text"
        err = " ".join(contract.validate_blueprint(plan))
        for marker in ("visual strategy", "missing native DIL", "grounded", "missing distinct original transfer"):
            self.assertIn(marker, err)

if __name__ == "__main__":
    unittest.main()
