"""Offline ASIT lesson blueprint linter and conservative evidence-family normalizer.

This is a developer/test helper. Skills-only ChatGPT cannot invoke it as a
runtime preflight; a verified tool response and live client rendering remain
separate requirements. No learner data is read or written.
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

IMAGE_OPERATIONS = {"image_choice", "image_label", "image_comparison", "image_matching"}
PHOTO_KINDS = {"photo", "generated_image"}
GUIDED_OPERATIONS = {"guided_chunk_order", "guided_construction", "sentence_builder", "card_ordering"}
RECOGNITION_OPERATIONS = {
    "image_scene_recognition", "image_object_recognition", "visual_object_position",
    "image_choice", "visual_recognition", "recognition", "grammar_contrast",
    "plural_agreement_recognition", "polite_question_recognition",
}
READING_OPERATIONS = {"reading_inference", "textual_inference", "reading_comprehension", "comprehension", "reading_detail"}
INDEPENDENT_OPERATIONS = {"independent_production", "production", "independent_interaction", "spoken_interaction", "independent_spoken_interaction"}
PHOTO_REF = re.compile(r"^turn[0-9]+image[0-9]+$")


def evidence_family(operation: str) -> str:
    """Normalize *observed task* operations, not their claimed learning outcomes."""
    if operation in GUIDED_OPERATIONS:
        return "guided_construction"
    if operation in RECOGNITION_OPERATIONS:
        return "recognition"
    if operation in READING_OPERATIONS:
        return "comprehension"
    if operation in INDEPENDENT_OPERATIONS:
        return "independent_production"
    if operation in {"image_label", "image_object_label", "vocabulary_retrieval"}:
        return "lexical_retrieval"
    if operation in {"listening_comprehension", "audio_comprehension"}:
        return "comprehension"
    return "unknown"


def normalized_modality(value: str) -> str:
    aliases = {
        "typed_text": "writing", "writing": "writing",
        "reading_text": "reading", "reading": "reading",
        "visual": "visual", "text_or_visual": "visual", "visual_symbols": "visual_symbolic",
        "visual_and_writing": "visual_and_writing",
        "spoken_audio": "speaking", "speaking": "speaking",
        "audio_comprehension": "listening", "listening": "listening",
    }
    return aliases.get(value or "", "unknown")


def evidence_compatibility(required_modality: str, required_operation: str,
                           observed_modality: str, observed_operation: str,
                           verdict: str, hint_level: str = "none",
                           *, evidence: dict | None = None) -> dict:
    """Conservative, single-task evidence eligibility; never award CEFR here.

    `evidence` must come from verified original Activity / rubric and trusted
    observations, not from an arbitrary client-authored JSON. A correct final
    choice after instant feedback is only supported until a reliable *first*
    unaided attempt is observed. Missing media/audio/voice proof is excluded.
    """
    def excluded(reason: str) -> dict:
        return {"eligible": False, "status_ceiling": "unassessed", "reason": reason}

    if verdict not in {"correct", "partial", "needs_support"}:
        return excluded("not_assessed_or_invalid")
    meta = evidence if isinstance(evidence, dict) else {}
    if meta.get("trusted_rubric_verified") is not True:
        return excluded("trusted_rubric_required")
    family = evidence_family(observed_operation)
    req = normalized_modality(required_modality)
    obs = normalized_modality(observed_modality)
    if required_modality == "text_or_visual":
        modality_ok = obs in {"visual", "visual_symbolic", "visual_and_writing", "reading"}
    elif req == "visual":
        modality_ok = obs in {"visual", "visual_symbolic", "visual_and_writing"}
    else:
        modality_ok = req != "unknown" and req == obs
    if not modality_ok:
        return excluded("modality_mismatch")
    requirements = {
        "recognition": {"recognition", "lexical_retrieval"},
        "comprehension": {"comprehension"},
        "interaction": {"independent_production", "guided_construction"},
        "production": {"independent_production"},
        "guided_construction": {"guided_construction"},
        "independent_production": {"independent_production"},
    }
    if family not in requirements.get(required_operation, set()):
        return excluded("operation_mismatch")

    if obs in {"visual", "visual_and_writing"}:
        if not (meta.get("media_source_verified") is True
                and meta.get("media_visible_confirmed") is True):
            return excluded("visual_source_or_visibility_not_verified")
    elif obs == "visual_symbolic":
        if meta.get("diagram_visible_confirmed") is not True:
            return excluded("diagram_visibility_not_verified")

    if req == "listening":
        if observed_operation not in {"audio_comprehension", "listening_comprehension"}:
            return excluded("listening_operation_not_audio")
        if not (meta.get("audio_source_verified") is True
                and meta.get("learner_heard_audio") is True):
            return excluded("audio_hearing_not_verified")
        if meta.get("transcript_used") is True:
            ceiling = "supported"
        else:
            ceiling = "independent"
    elif req == "speaking":
        if observed_operation not in {
            "independent_production", "independent_interaction",
            "spoken_interaction", "independent_spoken_interaction"
        }:
            return excluded("speaking_operation_not_spoken")
        if not (meta.get("real_voice_session") is True
                and meta.get("actual_spoken_answer_reviewed") is True):
            return excluded("spoken_audio_not_verified")
        if required_operation == "interaction" and meta.get("oral_turn_count", 0) < 2:
            return excluded("spoken_interaction_requires_two_turns")
        ceiling = "independent"
    elif req == "writing" and required_operation == "interaction" and family == "independent_production":
        if not (meta.get("communicative_intent_verified") is True
                and meta.get("recipient_verified") is True
                and meta.get("semantic_review_verified") is True):
            return excluded("written_interaction_context_not_verified")
        ceiling = "independent"
    elif req == "writing" and family == "independent_production":
        if meta.get("semantic_review_verified") is not True:
            return excluded("independent_writing_semantic_review_required")
        ceiling = "independent"
    else:
        ceiling = "independent"

    # A final "correct" UI answer does not prove a correct unaided FIRST try.
    if (verdict != "correct" or hint_level != "none"
            or meta.get("unaided_first_attempt_verified") is not True
            or family in {"guided_construction", "recognition", "lexical_retrieval"}):
        ceiling = "supported" if verdict in {"correct", "partial"} else "emerging"
    return {"eligible": True, "status_ceiling": ceiling, "reason": family}


def validate_blueprint(plan: dict) -> list[str]:
    """Check explicit plan invariants before a *developer* release or fixture review.

    This cannot prove that a source ref exists in an actual ChatGPT tool result,
    or that the client displayed the image. The tutor must verify that separately.
    """
    errors: list[str] = []
    if not isinstance(plan, dict):
        return ["blueprint: expected object"]
    tasks = plan.get("tasks")
    if not isinstance(tasks, list) or not tasks:
        return ["tasks: missing non-empty list"]
    ids = [t.get("id") for t in tasks if isinstance(t, dict)]
    if len(ids) != len(tasks) or any(not isinstance(x, str) or not x for x in ids):
        errors.append("tasks: every task needs a stable id")
    if len(ids) == len(tasks) and len(ids) != len(set(ids)):
        errors.append("tasks: duplicate ids")
    if not isinstance(plan.get("can_do"), str) or not plan["can_do"].strip():
        errors.append("can_do: missing observable communication objective")
    duration = plan.get("duration_minutes", 0)
    if isinstance(duration, bool) or not isinstance(duration, (int, float)) or duration <= 0:
        errors.append("duration_minutes: must be positive")
        duration = 0
    operations = [t.get("operation", "") if isinstance(t, dict) else "" for t in tasks]
    controls = [t.get("response_control", "") if isinstance(t, dict) else "" for t in tasks]
    if len(tasks) >= 4 and duration <= 7:
        if len(set(operations)) < 3:
            errors.append("inventory: 4-7 minute lesson needs >=3 operations")
        if len(tasks) == 5 and len(set(controls)) < 3:
            errors.append("inventory: five tasks need >=3 response controls")
        if len(tasks) == 5 and controls.count("single_choice") > 2:
            errors.append("inventory: at most two single-choice tasks")
    if duration >= 20:
        if len(set(operations)) < 5:
            errors.append("inventory: 20+ minute lesson needs >=5 operations")
        if sum(c == "single_choice" for c in controls) / len(tasks) > 0.35:
            errors.append("inventory: single-choice ratio exceeds 35%")
    if any(operations[i] == operations[i+1] == operations[i+2]
           for i in range(len(operations) - 2)):
        errors.append("inventory: three consecutive identical operations")
    if not plan.get("single_canonical_submit"):
        errors.append("submission: missing single canonical Submit")
    if plan.get("skipped_grade") != "not_assessed":
        errors.append("skipped_grade: unanswered items must be not_assessed")
    visual_ops = set()
    for i, task in enumerate(tasks):
        if not isinstance(task, dict):
            errors.append(f"task_{i}: not an object")
            continue
        key = task.get("id") or f"task_{i}"
        operation = task.get("operation", "")
        modality = task.get("modality", "")
        if operation in IMAGE_OPERATIONS:
            visual_ops.add(operation)
            asset = task.get("media")
            if not isinstance(asset, dict):
                errors.append(f"{key}: image operation has no real media")
            else:
                if asset.get("kind") not in PHOTO_KINDS:
                    errors.append(f"{key}: symbolic diagram is not photograph evidence")
                if asset.get("verification") != "tool_verified_in_this_turn":
                    errors.append(f"{key}: unverified image provenance")
                if not PHOTO_REF.fullmatch(str(asset.get("ref", ""))):
                    errors.append(f"{key}: missing trusted image result ref")
                if asset.get("host_display_claimed") is True:
                    errors.append(f"{key}: host display cannot be certified before render")
                if asset.get("fallback_operation") not in {
                    "text_prompted_retrieval", "reading_detail", "visual_symbolic_prediction"
                }:
                    errors.append(f"{key}: no explicit post-render media fallback")
            if modality not in {"visual", "visual_and_writing"}:
                errors.append(f"{key}: image operation modality mismatch")
            expected = str(task.get("expected_label", "")).lower().strip()
            if expected:
                seen = " ".join(str(task.get(p, "")) for p in ("prompt", "alt", "caption", "title", "example", "options"))
                seen += " " + str(plan.get("introduction", ""))
                seen += " " + " ".join(map(str, plan.get("vocabulary_before", [])))
                for other in tasks:
                    if isinstance(other, dict) and other is not task:
                        seen += " " + " ".join(str(other.get(p, "")) for p in (
                            "prompt", "alt", "caption", "title", "example", "options", "chunks"
                        ))
                if re.search(r"(?<!\w)" + re.escape(expected) + r"(?!\w)", seen.lower()):
                    errors.append(f"{key}: expected image label leaked before answer")
        elif modality in {"visual", "visual_and_writing"} and not task.get("visual_symbol_only"):
            errors.append(f"{key}: visual modality without verified image operation")
        if task.get("response_control") not in {"single_choice", "short_text", "click_order", "matching", "stateful_choice", "multi_select"}:
            errors.append(f"{key}: unknown or missing response control")
        if task.get("submission_grade") == "needs_support" and task.get("skipped"):
            errors.append(f"{key}: skipped item cannot be graded needs_support")
        if task.get("skipped") and task.get("skip_reason") not in (None, "unknown", "learner_declared"):
            errors.append(f"{key}: invented skip reason")
        if task.get("independent") and (task.get("support") == "guided" or evidence_family(operation) != "independent_production"):
            errors.append(f"{key}: scaffolded/recognition activity claimed independent")
    if plan.get("visually_teachable") and 4 <= len(tasks) <= 7:
        if len(visual_ops) < 2:
            errors.append("visual lesson: needs two distinct image-grounded operations")
    if plan.get("visually_teachable") and not plan.get("discovery_cycle"):
        errors.append("visual lesson: missing predict/manipulate/feedback discovery cycle")
    if plan.get("discovery_cycle"):
        c = plan["discovery_cycle"]
        if not isinstance(c, dict) or not all(c.get(k) in ids for k in ("predict_id", "manipulate_id")):
            errors.append("discovery_cycle: invalid task references")
        elif not c.get("visible_state_change") or not c.get("post_action_feedback"):
            errors.append("discovery_cycle: interaction must change visible state and respond")
    return errors


def main() -> int:
    parser = argparse.ArgumentParser(description="Lint a *developer* ASIT lesson blueprint JSON")
    parser.add_argument("blueprint", type=Path)
    args = parser.parse_args()
    plan = json.loads(args.blueprint.read_text(encoding="utf-8"))
    errors = validate_blueprint(plan)
    if errors:
        for item in errors:
            print("FAIL:", item)
        return 1
    print("PASS: offline ASIT blueprint checks (NOT runtime media/playback verification)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
