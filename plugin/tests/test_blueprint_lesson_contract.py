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
        "rubric": {
            "assessment_mode": "semantic" if control == "short_text" else "deterministic",
            "criteria": ["Assess the grounded communicative goal"],
            "accepted": ["valid_response"],
        }
    }
    if image_ref is not None:
        obj["media"] = {
            "kind": "photo", "verification": "tool_verified_in_this_turn",
            "ref": image_ref, "fallback_operation": "text_prompted_retrieval"
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

    def test_unknown_operation_and_ungradable_rubric_rejected(self):
        plan = valid_blueprint()
        plan["tasks"][4]["operation"] = "totally_fake_game"
        self.assertIn("unknown cognitive operation", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        del plan["tasks"][4]["rubric"]
        self.assertIn("trusted rubric missing", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        del plan["tasks"][0]["rubric"]["accepted"]
        self.assertIn("no accepted answers", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        plan["tasks"][2]["expected_label"] = ""
        self.assertIn("semantic target", " ".join(contract.validate_blueprint(plan)))

    def test_invalid_blueprint_does_not_raise_exceptions(self):
        for malformed in (None, [], {"tasks": [None, {"id": "q2"}], "can_do": "Valid",
                                   "duration_minutes": 7, "skipped_grade": "not_assessed"}):
            errors = contract.validate_blueprint(malformed)
            self.assertTrue(errors)

    def test_fake_render_proof_and_missing_fallback_are_rejected(self):
        plan = valid_blueprint()
        plan["tasks"][0]["media"]["host_display_claimed"] = True
        self.assertIn("host display cannot be certified", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        del plan["tasks"][0]["media"]["fallback_operation"]
        self.assertIn("post-render media fallback", " ".join(contract.validate_blueprint(plan)))

    def test_cross_task_and_option_answer_leak_rejected(self):
        plan = valid_blueprint()
        plan["tasks"][0]["options"] = ["a glass", "lid", "a fork"]
        self.assertIn("leaked", " ".join(contract.validate_blueprint(plan)))
        plan = valid_blueprint()
        plan["tasks"][1]["prompt"] = "On the right is the lid of a cup"
        self.assertIn("leaked", " ".join(contract.validate_blueprint(plan)))

    def test_evidence_compatibility_normalizes_old_sheet_values_without_false_independence(self):
        f = contract.evidence_compatibility
        trusted = {"trusted_rubric_verified": True}
        reading = {**trusted, "unaided_first_attempt_verified": True}
        self.assertEqual(f("reading", "comprehension", "reading", "reading_inference", "correct",
                           evidence=reading)["status_ceiling"], "independent")
        self.assertEqual(f("reading", "comprehension", "reading", "reading_inference", "correct",
                           evidence=trusted)["status_ceiling"], "supported")
        self.assertFalse(f("reading", "comprehension", "reading", "reading_inference", "correct")["eligible"])
        visual = {**trusted, "media_source_verified": True, "media_visible_confirmed": True}
        self.assertEqual(f("text_or_visual", "recognition", "visual", "image_scene_recognition", "correct",
                           evidence=visual)["status_ceiling"], "supported")
        self.assertFalse(f("text_or_visual", "recognition", "visual", "image_scene_recognition", "correct",
                           evidence=trusted)["eligible"])
        self.assertTrue(f("text_or_visual", "recognition", "reading", "recognition", "correct",
                          evidence=trusted)["eligible"])
        self.assertEqual(f("writing", "interaction", "writing", "guided_chunk_order", "correct",
                           evidence=trusted)["status_ceiling"], "supported")
        self.assertFalse(f("writing", "production", "writing", "guided_chunk_order", "correct",
                           evidence=trusted)["eligible"])
        self.assertFalse(f("writing", "interaction", "writing", "independent_production", "correct",
                           evidence=trusted)["eligible"])
        question = {**trusted, "communicative_intent_verified": True, "recipient_verified": True,
                    "semantic_review_verified": True, "unaided_first_attempt_verified": True}
        self.assertEqual(f("writing", "interaction", "writing", "independent_production", "correct",
                           evidence=question)["status_ceiling"], "independent")
        self.assertEqual(f("writing", "interaction", "writing", "independent_production", "correct",
                           "model", evidence=question)["status_ceiling"], "supported")
        self.assertFalse(f("reading", "comprehension", "reading", "reading_inference", "not_assessed",
                           evidence=reading)["eligible"])
        self.assertFalse(f("writing", "production", "visual", "image_choice", "correct",
                           evidence=visual)["eligible"])

    def test_listening_and_speaking_cannot_be_awarded_from_plain_correct(self):
        f = contract.evidence_compatibility
        trusted = {"trusted_rubric_verified": True, "unaided_first_attempt_verified": True}
        self.assertFalse(f("listening", "comprehension", "listening", "audio_comprehension",
                           "correct", evidence=trusted)["eligible"])
        self.assertFalse(f("speaking", "interaction", "speaking", "independent_production",
                           "correct", evidence=trusted)["eligible"])
        with_audio = {**trusted, "audio_source_verified": True, "learner_heard_audio": True}
        self.assertEqual(f("listening", "comprehension", "listening", "audio_comprehension",
                           "correct", evidence=with_audio)["status_ceiling"], "independent")
        self.assertEqual(f("listening", "comprehension", "listening", "audio_comprehension",
                           "correct", evidence={**with_audio, "transcript_used": True})["status_ceiling"], "supported")
        self.assertFalse(f("listening", "comprehension", "listening", "reading_inference",
                           "correct", evidence=with_audio)["eligible"])
        with_voice = {**trusted, "real_voice_session": True, "actual_spoken_answer_reviewed": True}
        self.assertFalse(f("speaking", "interaction", "speaking", "independent_production",
                           "correct", evidence={**with_voice, "oral_turn_count": 1})["eligible"])
        self.assertEqual(f("speaking", "interaction", "speaking", "independent_production",
                           "correct", evidence={**with_voice, "oral_turn_count": 2})["status_ceiling"], "independent")


if __name__ == "__main__":
    unittest.main()
