# ASIT English Tutor — skills-only v0.2.6

Adaptive story-led English lessons, native ChatGPT exercises, source-verified ELLLO workflows, observational CEFR evidence and optional Google Sheets progress through a user-connected Google Drive app. No MCP/backend or automatically executing repository JavaScript.

## v0.2.6 — Save Gate reliability and lightweight routing

- Every ASIT answer / `ASIT_ATTEMPT_V2` routes to `asit-assessment` as the **single Submit coordinator**: validate, grade, check consent + preregistration, dedupe, persist, read back, project and report a verified storage status in the same chat turn.
- Pre-register one trusted Activity per assessed subtask before showing a save-enabled lesson. A composite UI Submit is only an envelope; it cannot count multiple modalities as one Attempt.
- Use replay-stable parent and per-subtask Attempt IDs, not DIL runtime `useId()` as persistent IDs. Detect exact duplicates/conflicts; on unknown provider outcome read existence before retry.
- Honor existing `summary_only` consent without repeatedly asking; persist non-verbatim summaries only, no first-answer/transcript leakage. Project Sessions/Competencies/Reviews/Config after verified Attempts; distinguish `Fully synced`, `Attempt saved / Partial sync`, `Not verified` and `Not saved`.
- Honor **verified individual preference** (including five tasks) over plugin's four-task fallback, unless the learner explicitly chooses otherwise. Keep media/UI reference loading lazy and everyday reads bounded.
- Remove contradictory parent-Activity wording and document real regression scenarios in `SAVE-GATE-ACCEPTANCE.md`.

## Limits

Save Gate is a **model-followed workflow**, NOT a guaranteed background hook. The ordinary ChatGPT native Submit sends a chat message, not an automatic Google Sheets operation. Google Drive authorization and private workbook/schema/consent are independently required. Sheets cannot guarantee cross-tab ACID transactions or exactly-once writes across concurrent clients. Provider write/readback and real-chat dogfooding are required before declaring reliable automatic saving. The source GitHub repository is not updated by publishing this plugin.
