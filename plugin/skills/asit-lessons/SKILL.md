---
name: asit-lessons
description: "Use when ASIT should continue an English lesson, teach grammar, plan an adaptive program, drill a language skill or create a full native UI lesson, including required consented Save Gate preflight before grading tasks."
---

# ASIT lesson planner with pre-registered evidence (v0.2.7)

Choose one communicative `can-do` outcome grounded in the learner request and verified performance. If requested outside-plan practice, honor it without replacing the plan. Use `asit-exercises` for native UI, `asit-media` for real listening, and `asit-assessment` after a real answer.

## Before rendering a graded lesson: Save Gate preflight

1. If verified prior storage state is known or discoverable using authorized Drive tools, load only bounded `asit-progress` state: effective recording consent, seven Config values, exact nine sheet headers, current revision, lesson preference, active plan, due reviews and few relevant attempts. Do not hydrate the entire history. In ordinary chat, no automated Google Drive connection is bundled with ASIT.
2. If consent permits writing and provider/workbook/schema are verified, define **each subtask's** Activity ID, session/lesson/competency ID, real modality, actual operation and trusted rubric **before** presenting the form. Register separate Activities in the learner-owned Sheets and read back each exact Activity ID. One composite outer `ASIT_ATTEMPT_V2` is an envelope, **not** a graded Activity spanning modalities. Do not persist keys, user responses or unconsented data elsewhere.
3. Only after all required Activity registrations verify may the displayed lesson be marked `save-ready`. A skipped/failed preflight means **explicitly unsaved**: teach normally, disclose that storage is unavailable, do not later invent registered tasks or promise automatic saving. Never publish fabricated registration IDs, use DIL's runtime `useId()` as a durable Attempt ID, or claim guaranteed global uniqueness. Mint stable opaque identifiers and validate uniqueness against stored records before writes.
4. If consent is disabled, no writes; create a normal unsaved lesson without extra Drive calls. An existing `summary_only` setting is valid prior consent; don't request it again on each submission.

## Structured planned lesson

Default: seven minutes and four related tasks **unless** user's current request or verified learner-specific Config specifies a different count/budget (e.g. five). Current-turn request overrides saved preference. One response contains: topic, real situation and outcome; one/two rules or comprehension strategy; a coherent practice form; vocabulary 3–6 chunks last; **one real final Submit**. Prefer three different operations (notice/recognize → reason/repair → construct → independent contextual communication) and one visually meaningful scene when reliable. Make UI choices give provisional explanatory Correct/Try again when supported; do not expose an answer key before a first attempt. Free writing is assessed after Submit.

**Required for EVERY full planned lesson:** load and apply [visual-first lesson standard](references/visual-lesson-standard.md) **before** choosing Activities, selecting images or rendering UI. For topics naturally suited to images and with genuine image support, the default output includes a 16:9 thematic cover and at least two image-dependent graded interactions with distinct operations in a 4–5-task lesson; image-labelled words, picture choice and sentence cards take precedence over repeat translation prompts. Include a short Brilliant-style predict/manipulate/explain discovery cycle when it supports the goal; preserve Duolingo-like low-friction retries and Skyeng-like contextual transfer without copying either product. Text-only learner requests, image unavailability and genuinely nonvisual skills take the documented honest fallback. Check the task mix against the standard immediately before rendering. This contract outranks softer 'cover optional' advice for visually suitable full lessons; never create filler media merely to meet a count. Do not load this reference for one-off explanations or ordinary chat.

For each task specify trusted source rubric and accepted variants, required flag, modality/operation and help policy. Missing required answers block ordinary completion or are explicitly incomplete with `not_assessed`. With consented storage, each graded subtask must be separately registered and later separately assessed/saved even though one form submits them together. The Submit envelope should carry stable parent ID + task ID → answer mapping, with observed first/revisions treated as untrusted telemetry, never an externally writable grade. Do not fabricate drag, Play, microphone or fake image-hotspot interactions.

## Adaptive teaching and end-of-lesson checks

Use earlier useful pattern briefly, change cognitive operation after repeated independent error, scaffold progressively and fade support; a successful multiple choice does not prove transfer. Close repeated remediation after two focused cycles unless learner opts into more. Independent final message should solve a new realistic situation. Review interval is heuristic. Typed practice does not prove listening/speaking.

Reject near-duplicate translation tasks, purely decorative images presented as visual evidence, link-only listening, inert buttons, fabricated telemetry, exposed keys, incorrect personal preference count, and completion before a real final Submit. Confirm Save Gate status is truthful; register BEFORE the lesson when enabled, not retrospectively. Additional details: [experience planner](references/experience-planner.md), [lesson rules](references/lesson-rules.md).
