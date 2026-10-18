"""Regression tests for offline ASIT blueprint contracts (synthetic data only)."""
import importlib.util
import unittest
from copy import deepcopy
from pathlib import Path

SCRIPT = Path(__file__).resolve().parents[1] / "scripts/lesson_contract.py"
spec = importlib.util.spec_from_file_location("lesson_contract", SCRIPT)
contract = importlib.util.module_from_spec(spec)
spec.loader.exec_module(contract)


def scene_task(task_id, operation, control, modality, image_ref=None, **extras):
    obj = {
        "id": task_id, "operation": operation,
        "response_control": control, "modality": modality, "prompt": "Find and respond.",
    }
    if image_ref is not None:
        obj["media"] = {
            "kind": "photo", "verification": "tool_verified_in_this_turn",
            "ref": image_ref, "render_checked": True
        }
    obj.update(extras)
    return obj


def valid_blueprint():
    return {
        "lesson_id": "synthetic_lesson_01",
        "can_do": "Can request a change to an everyday order.",
        "duration_minutes": 7,
        "visually_teachable": True,
        "single_canonical_submit": True,
        "skipped_grade": "not_assessed",
        "introduction": "A customer needs help in a cafe.",
        "vocabulary_before": ["request", "replace", "available"],
        "tasks": [
            scene_task("q1", "image_choice", "single_choice", "visual", "turn1image2"),
            scene_task("q2", "independent_production", "short_text", "writing", independent=True),
            scene_task("q3", "image_label", "short_text", "visual_and_writing",
                       "turn1image3", expected_label="lid", alt="An unlabelled cup"),
            scene_task("q4", "reading_inference", "single_choice", "reading"),
            scene_task("q5", "guided_chunk_order", "click_order", "writing",
                       support="guided", independent=False),
        ],
        "discovery_cycle": {
            "predict_id": "q1", "manipulate_id": "q3",
            "visible_state_change": True, "post_action_feedback": True,
        },
    }


class BlueprintContractTest(unittest.TestCase):
    def test_genuine_diverse_visual_lesson_passes(self):
        self.assertEqual(contract.validate_blueprint(valid_blueprint()), [])

    def test_invented_or_missing_media_fails_before_registration(self):
        plan = valid_blueprint()
        del plan["tasks"][0]["media"]
        self.assertIn("image operation has no real media", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        plan["tasks"][0]["media"]["ref"] = "turn309465image0_made_up"
        self.assertIn("missing trusted image result ref", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        plan["tasks"][0]["media"]["verification"] = "unverified"
        self.assertIn("unverified image provenance", " ".join(contract.validate_blueprint(plan)))

    def test_diagram_is_not_photo(self):
        plan = valid_blueprint()
        plan["tasks"][0]["media"]["kind"] = "diagram"
        self.assertIn("symbolic diagram", " ".join(contract.validate_blueprint(plan)))

    def test_label_leak_in_prompt_alt_or_vocabulary_rejected(self):
        for where in ("alt", "prompt"):
            plan = valid_blueprint()
            plan["tasks"][2][where] = "A cup lid is visible"
            self.assertIn("leaked", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        plan["vocabulary_before"].append("lid")
        self.assertIn("leaked", " ".join(contract.validate_blueprint(plan)))

    def test_skips_do_not_imply_inability(self):
        plan = valid_blueprint()
        plan["tasks"][1]["skipped"] = True
        plan["tasks"][1]["skip_reason"] = "learner_declared"
        self.assertEqual(contract.validate_blueprint(plan), [])
        plan["tasks"][1]["submission_grade"] = "needs_support"
        self.assertIn("skipped item", " ".join(contract.validate_blueprint(plan)))
        plan["tasks"][1]["submission_grade"] = "not_assessed"
        plan["tasks"][1]["skip_reason"] = "learner_is_unable"
        self.assertIn("invented skip reason", " ".join(contract.validate_blueprint(plan)))

    def test_no_guided_activity_masquerades_as_independent(self):
        plan = valid_blueprint()
        plan["tasks"][4]["independent"] = True
        self.assertIn("claimed independent", " ".join(contract.validate_blueprint(plan)))

    def test_repetitive_thirty_item_lesson_fails(self):
        plan = valid_blueprint()
        plan["duration_minutes"] = 40
        plan["visually_teachable"] = False
        plan["discovery_cycle"] = {}
        plan["tasks"] = [
            scene_task(f"q{i}", "grammar_contrast", "single_choice", "reading")
            for i in range(1, 31)
        ]
        errors = " ".join(contract.validate_blueprint(plan))
        self.assertIn(">=5 operations", errors)
        self.assertIn("exceeds 35%", errors)
        self.assertIn("three consecutive", errors)

    def test_predict_manipulate_feedback_must_be_real_state(self):
        plan = valid_blueprint()
        plan["discovery_cycle"]["visible_state_change"] = False
        self.assertIn("must change visible state", " ".join(contract.validate_blueprint(plan)))

    def test_evidence_compatibility_normalizes_old_sheet_values(self):
        f = contract.evidence_compatibility
        self.assertEqual(f("reading", "comprehension", "reading", "reading_inference", "correct")["status_ceiling"], "independent")
        self.assertEqual(f("text_or_visual", "recognition", "visual", "image_scene_recognition", "correct")["status_ceiling"], "supported")
        self.assertEqual(f("writing", "interaction", "writing", "guided_chunk_order", "correct")["status_ceiling"], "supported")
        self.assertEqual(f("writing", "interaction", "writing", "independent_production", "correct")["status_ceiling"], "independent")
        self.assertFalse(f("writing", "production", "visual", "image_choice", "correct")["eligible"])
        self.assertFalse(f("reading", "comprehension", "reading", "reading_inference", "not_assessed")["eligible"])
        self.assertFalse(f("writing", "production", "writing", "guided_chunk_order", "correct")["eligible"])
        self.assertEqual(f("writing", "interaction", "writing", "independent_production", "correct", "model")["status_ceiling"], "supported")
        self.assertFalse(f("listening", "comprehension", "reading", "reading_inference", "correct")["eligible"])

if __name__ == "__main__":
    unittest.main()
