# ASIT media provenance & renderability — mandatory image Save Gate

**Purpose:** prevent the actual October 2026 regression: a UI referenced `turn309465image0` / `turn309465image1` without any corresponding confirmed image-tool result and nevertheless preregistered two visual-scored Activities.

This is a **model-executed source check**. It cannot run an automatic image renderer or verify another device's screen. Developer-only `plugin/scripts/lesson_contract.py` can lint an offline claimed blueprint, but cannot authenticate ChatGPT tool results.

## Three-state source verdict per asset (before Activity registration)

- **verified_source:** The **exact immutable media ref** was returned by an actually successful current-turn image/media search or generation tool, the subject/image content was inspected and fits the prompt, rights/provider requirements were respected, and the original source or generated-asset provenance is known. Record which task IDs share the source; use the **exact ref** in native `AsyncImage.ref` or an actually tool-returned asset. A guessed, copied, historical, synthetic `turn...image...` string is not evidence.
- **unverified:** There is a candidate URL, a bare ref typed by the model, a previous-turn ref without current permission/availability, a web snippet, or a photo description without an inspected asset. Do not preregister a photo-scored activity.
- **unavailable:** Asset search failed or returned no suitable material, the platform cannot render the asset, or a learner reports that the image is missing. Stop photo-scored assessment; switch to an explicit **text/diagram** task with changed prompt, rubric, modality and operation. If the image failed only after the lesson was shown, record that subtask `not_assessed`, **not** a retrospective rewrite of a stored Activity.

## Pre-render evidence receipt

For EACH real-image question build privately:

```text
task_id:
asset_role: cover | question_evidence
source_state: verified_source | unverified | unavailable
exact_tool_result_ref: exact original ref, never manually fabricated
content_observed: scene/object distinguishing the key from distractors
source_license_or_rights: provider link/permission when applicable
alt: helpful non-spoiling scene description
image_needed_for_answer: true | false
host_display_status: observed | not_observed | learner_reports_broken
fallback_operation: reading_detail | textual_vocab_retrieval | visual_symbolic_prediction
```

A source ref must be a real tool output **in this conversation**. Do not mark `host_display_status=observed` unless it actually was observed via suitable host evidence. An accessible client may not display the image even when source_verified. Never assert confirmed client display from source retrieval alone.

## Save Gate sequencing

1. Make image-dependent question and intended source request.
2. Retrieve **real** image(s) using an available image tool. Inspect suitability and confirm exact source result ref; verify that object details required for the key are actually present. Avoid unsourced image claims or unverifiable labels.
3. If `verified_source`, freeze task + media metadata, user-visible prompt, rubric and fallback. Apply answer-integrity audit including alt, caption and title. A cover does not count as one of the two graded visual operations.
4. If `unverified`/`unavailable`, **replace the scored task before writing Activities**; use `text_prompted_retrieval`/`visual_symbolic` etc. Never register a photo operation then show a text fallback. Preserve useful mission, operation diversity and accessible control.
5. Verify Google Sheets consent and register/readback exact final Activity IDs. Render the exact media-ref returned by a tool (not a template or invented ref). Report only source verification, not device-level display certainty.
6. On real learner Submit, if the media was broken/not visible, mark affected visual tasks `not_assessed` even if the learner guessed a plausible answer; do not count visual or CEFR evidence.

## Motion, video and accessibility

Static `AsyncImage` is not a motion graphic, click hotspot or video player. A stateful SVG move is a **diagram state change**, not a photographed image. CSS transitions or real video must be independently tested on the actual host and be replaceable with reduced motion / static states. Never require hearing without confirmed sound/learner hearing report.

Never leak the target word in alt, source caption, vocabulary, filenames shown in UI, choices labeled as correct, or provisional feedback before selection. If visual content is central, show an honest missing-media fallback rather than an empty question.
