---
name: asit-core
description: "Use on demand for subject-neutral adaptive learning decisions: competency selection, pacing, evidence, adaptation, reviews and next-step policy; not for quick routine feedback."
---

# ASIT Core — subject-neutral policy (v0.3.0 candidate)

ASIT Core is a **model-followed instruction contract**, not a server, executable engine, new database or second teacher. It coordinates the learning cycle; a subject adapter supplies the domain knowledge and trusted grading rubric.

## Inputs and boundary

Take learner request, domain ID, assessable competency IDs and prerequisites, context IDs, required modality/operation, verified prior evidence, due reviews and preferences. A subject adapter supplies each task's observable outcome, accepted answers/variants, rubric and independent transfer context. Unknown subject rules must not be invented.

The boundary is logical: preserve existing `ASIT_ATTEMPT_V2`, stable `session_id`, `lesson_id`, `activity_id`, `competency_id`, `context_id`, current grade/status vocabulary and nine-tab Google Sheets v2 schema. **No migration** or new storage fields are introduced.

## Six-stage cycle

1. **Select:** current user request first, then verified goals, due reviews and gaps. Use [selection invariants](references/selection-invariants.md) lazily for ranked decisions, not for every response.
2. **Plan:** ask the adapter for task-specific rubric. Scaffold from recognition/reconstruction to a fresh independent application; match supported ChatGPT controls and explicit learner lesson length/preferences.
3. **Practice:** no answer leaks before first input. Provisional Correct/Try again feedback applies to deterministic UI only, never as trusted assessment or durable evidence.
4. **Assess:** route final Submit to sole `asit-assessment` coordinator. Task grades: `correct|partial|needs_support|not_assessed`. Evidence confidence: `unassessed|emerging|supported|independent|transferable`. A hinted recognition result cannot establish independent transfer.
5. **Persist optionally:** `asit-progress` owns consented, verified Google Sheets writes and required Activity pre-registration; teaching continues without storage. Never invent a save hook or successful write.
6. **Adapt:** change operation after repeated errors; cap focused remediation at two cycles by default, then continue the broader plan, ordinarily rendering the next lesson in the same turn unless paused.

## One decision per lesson

Select a compact transient decision (competency, observable goal, evidence source, support level, planned operations/modalities and reason) **once** from verified relevant history. Hand it to the English adapter and lesson planner; do not re-rank or re-diagnose during registration and UI rendering unless the learner's direction or verified evidence changes. This is no new persisted state. Preserve diagnosis, independent transfer and varied cognitive tasks.

## Isolation

English grammar, CEFR evidence policy, ELLLO, pronunciation and language-specific answer validity belong to `asit-english`; a future subject uses another adapter. The Core does not award subject proficiency. UI is delivered by ChatGPT via `asit-lessons`/`asit-exercises`. No Dashboard sheets, new service, mandatory connector or background process.
