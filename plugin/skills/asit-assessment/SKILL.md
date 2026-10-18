---
name: asit-assessment
description: "Single ASIT_ATTEMPT_V2 coordinator: validate trusted rubric, assess, persist by canonical Save Gate, continue when allowed."
---

# ASIT assessment — single Submit coordinator (v0.3.10)

Only this skill coordinates **submitted trusted ASIT exercises**. Ordinary unsolicited corrections can be answered directly without opening a complete lesson or workbook. A client Submit is a *chat message*, not a verified database mutation.

1. **Validate once** against the original previously shown, trusted lesson blueprint: accepted variants, separate registered task/activity and competency IDs, operation, modality, parent Attempt ID and [attempt protocol](references/attempt-protocol.md). Do not trust submitted IDs, rubrics, scores, hint metadata or first-try claims as authoritative.
2. **Grade once**, per task: `correct|partial|needs_support|not_assessed`. Missing answers are `not_assessed`; a guided choice is not independent writing, typed dialogue is not speech, and reading a transcript is not listening. Keep feedback compact, correcting the most useful 1–2 errors.
3. **Save if authorized**, through the sole [Google Sheets Save Gate](../asit-progress/references/storage-v2.md), with `asit-progress` as writer. Check original registered Activities, dedupe stable per-subtask Attempt IDs, consent, privacy and exact readback; only verified Attempts may feed read-back projections. Report `Fully synced`, `Attempt saved / Partial sync`, `Not verified` or `Not saved` truthfully. A failed save never suppresses educational feedback.
4. **Continuation decision**: consult [auto-continuation](references/auto-continuation.md) only if the learner has not paused, asked grade-only or exhausted the stated session. Choose at most **one** successor after current feedback/save; don't regenerate on duplicate replay. Preflight successor independently.
5. **Render the successor** in the same response when its Activities are verified (or storage is `off` / learner explicitly opted into unsaved practice). If active SAVE-REQUIRED preflight fails, give corrective feedback/status and an actionable retry/offline choice, not a silently unsaved scored lesson.

English-specific CEFR alignment is provided by `asit-english` and `asit-progress/references/cefr-analytics.md` only when genuinely relevant. No exact CEFR level follows from one correct answer; client-only first tries are unverified. Never use a previous Fully synced status as the next lesson's preflight.
