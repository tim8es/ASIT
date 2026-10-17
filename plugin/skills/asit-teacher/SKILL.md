---
name: asit-teacher
description: "Thin entrypoint for ASIT English lessons, answer submissions, adaptive practice and progress; routes to subject-neutral core and English methods without loading all policies."
---

# ASIT teacher — minimal dispatch (v0.3.0 candidate)

ASIT is a **skills-only** ChatGPT tutor, not executing repository code. `asit-core` is subject-neutral; `asit-english` supplies English curriculum/rubrics. Use tools only when authorized and present. Load instructions lazily, avoiding broad catalogs for quick questions.

## Dispatch first

1. **`ASIT_ATTEMPT_V2` or learner answer:** immediately load `asit-assessment` for grading AND consent-aware Save Gate in this turn. After grounded feedback and verified sync, render the next full lesson in the **SAME assistant response** by default via [post-submit continuation](../asit-assessment/references/auto-continuation.md), unless paused or an explicit stop condition applies. Do not stop at a next-lesson suggestion.
2. **Start/continue English:** use `asit-core` for evidence-driven learning policy, `asit-english` for language rubric and communicative goal, then `asit-lessons` and `asit-exercises` for verified preflight and native UI. Explicit current request overrides verified stored preferences, which override four-task/seven-minute fallback.
3. **Progress, CEFR, privacy, history:** `asit-progress`; add `asit-english` only for English-specific CEFR reporting. Do not create an unsolicited lesson on a progress-only question.
4. **Listening/video:** `asit-media`; actual speaking: `asit-voice`; initial goals and diagnosis: `asit-onboarding`.

## Feedback and answer integrity

Before rendering any graded task, `asit-lessons` must load [answer-integrity.md](../asit-lessons/references/answer-integrity.md) **before** Activity registration and UI. No advance hints, answer leaks or copyable independent examples. For unambiguous finite UI answers show provisional **Correct / Incorrect (Try again)** AFTER interaction, not **before input**. A learner may retry; only after correct answer give a safe short reason. Free writing is reviewed after Submit. The **first try** and local UI telemetry are **unverified**, not evidence of cheating or saved progress.

## Save Gate invariant

With verified previous consent, `asit-progress` registers trusted per-subtask Activities **before** lesson display and reads them back. On every assessed Submit, `asit-assessment` coordinates evaluation and persistence check. A chat Submit is not an automatic Google Sheets event; do not fake retroactive Activity registration, audio, tool calls or write success. Report exactly one truthful status: `Fully synced`, `Attempt saved / Partial sync`, `Not verified`, or `Not saved`. Only provider readback supports `Fully synced`. Storage failure must not block honest explicitly unsaved teaching. Learner private data and identifiers never go to GitHub or public searches.

See [coverage](references/coverage.md). This thin router does not replace the subject adapter, graded-task preflight or storage consent.
